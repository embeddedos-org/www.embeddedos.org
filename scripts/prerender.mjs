/**
 * Build-time prerenderer.
 *
 * The site is a client-rendered SPA, so the document served to any client that
 * does not execute JavaScript — including the Google Ad Grants reviewer's
 * crawler — contains nothing but `<div id="root"></div>`. This script renders
 * every route in headless Chromium after the build and writes a real HTML
 * document per route, each with its own <title>, meta description and canonical
 * URL derived from the page's actual content.
 *
 * React still boots normally on top of the snapshot: main.tsx uses createRoot
 * (not hydrateRoot), so it discards the prerendered DOM and re-renders. The
 * snapshot exists to be readable without JS and to paint sooner, not to hydrate.
 *
 * Run via `pnpm build` (build:client -> prerender) or standalone with
 * `pnpm prerender` against an existing dist/public.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
// @playwright/test re-exports the browser launchers, so no extra dependency.
import { chromium } from "@playwright/test";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const APP_TSX = path.join(ROOT, "client", "src", "App.tsx");
const ORIGIN = process.env.SITE_ORIGIN ?? "https://www.embeddedos.org";
const PORT = Number(process.env.PRERENDER_PORT ?? 41234);
/**
 * Prerendering 95 routes is the largest single cost in the verification gate —
 * 119s of a 149s `pnpm build` at the old fixed default of 4, which is most of
 * the reason the gate ran out of its budget before reaching the e2e and
 * performance categories and reported both as SKIP.
 *
 * Scaled to the machine instead. Measured here, on 8 cores: 4 workers 119s,
 * 6 workers 97s, 8 workers 74s, with 95/95 rendered and 0 thin every time —
 * each route is an independent page render, so concurrency changes how long it
 * takes and not what comes out.
 *
 * Clamped at both ends: never fewer than 2, so a single-core runner still makes
 * progress, and never more than 8, because past that the browser's own threads
 * start competing and the wall clock stops improving.
 */
const CONCURRENCY = Number(
  process.env.PRERENDER_CONCURRENCY ??
    Math.min(8, Math.max(2, os.availableParallelism?.() ?? os.cpus().length))
);

// <link rel="modulepreload"> hrefs present in the built shell. Anything beyond
// this set was appended at runtime by Vite's async chunk loader and must not be
// persisted into a snapshot.
let buildEmittedPreloads = [];

const FALLBACK_DESCRIPTION =
  "EmbeddedOS is a 501(c)(3) nonprofit foundation building an open-source " +
  "operating system for embedded devices, with free documentation, tools and " +
  "education for engineers and students.";

/** Read every literal `<Route path="...">` out of App.tsx. */
export function discoverRoutes() {
  const src = fs.readFileSync(APP_TSX, "utf8");
  const found = [...src.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1]);
  const routes = new Set(["/"]);
  for (const r of found) {
    // Skip parameterised/wildcard routes — they have no single static output.
    if (!r.startsWith("/") || r.includes(":") || r.includes("*")) continue;
    routes.add(r);
  }
  if (routes.size < 10) {
    throw new Error(
      `Only ${routes.size} routes discovered in App.tsx — the <Route path="..."> ` +
        `pattern probably changed. Refusing to emit a near-empty prerender.`
    );
  }
  return [...routes];
}

/**
 * Serve dist/public, but always hand the *pristine* shell to navigations so a
 * previous run's output is never re-rendered into itself.
 */
function startServer(shell) {
  const app = express();
  app.use(express.static(DIST, { index: false, redirect: false }));
  app.use((_req, res) => res.type("html").send(shell));
  return new Promise(resolve => {
    const server = app.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

/** Wait for React to mount and for in-view animations to have played. */
async function settle(page) {
  await page.waitForFunction(
    () => {
      const root = document.getElementById("root");
      return (
        !!root && root.children.length > 0 && root.innerText.trim().length > 200
      );
    },
    { timeout: 30_000 }
  );

  // framer-motion's whileInView sections and the count-up statistics only start
  // once an IntersectionObserver reports them in view, so the whole page has to
  // be scrolled before snapshotting.
  //
  // Measure with documentElement.scrollHeight, NOT body.scrollHeight: the body is
  // far shorter than the document here, so a body-based loop stops after one step
  // and never reaches the statistics band — which then snapshots as "0
  // Repositories". Re-read the height every iteration too, since lazy-loaded
  // sections grow the page as they mount.
  const scrollPass = () =>
    page.evaluate(async () => {
      const pause = ms => new Promise(r => setTimeout(r, ms));
      const docHeight = () =>
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          document.documentElement.offsetHeight
        );

      let y = 0;
      for (let guard = 0; y < docHeight() && guard < 300; guard++) {
        window.scrollTo(0, y);
        await pause(110);
        y += Math.max(320, Math.floor(window.innerHeight * 0.75));
      }
      window.scrollTo(0, docHeight());
      await pause(300);
      window.scrollTo(0, 0);
      await pause(300);
    });

  await scrollPass();

  // Count-up statistics animate over ~1.5s, and only start once an
  // IntersectionObserver reports the element in view. Text-stability alone is not
  // enough: between the scroll pass and the observer firing, every counter still
  // reads "0", which looks stable and bakes "0 Repositories" into the snapshot.
  // So hold for a hard floor first, then require the text to settle.
  await page.evaluate(async () => {
    const pause = ms => new Promise(r => setTimeout(r, ms));
    const read = () => document.getElementById("root")?.innerText ?? "";

    await pause(2000);

    let previous = read();
    let stable = 0;
    for (let i = 0; i < 30; i++) {
      await pause(200);
      const current = read();
      stable = current === previous ? stable + 1 : 0;
      previous = current;
      if (stable >= 2) return;
    }
  });

  // A counter renders a literal "0" until its IntersectionObserver fires. If any
  // survived the pass above, the observer never reported them in view and the
  // snapshot is about to bake "0 Books" into the homepage — which happened once
  // in testing and is invisible until someone reads the served HTML.
  //
  // Scroll again rather than wait longer: waiting cannot help an observer that
  // never fired. A counter that already ran keeps its value (`once: true`), so
  // the second pass is wasted motion at worst, and it only runs on the pages
  // where a bare "0" is still present.
  const zeroCounters = () =>
    page.evaluate(() =>
      [...document.querySelectorAll("span")].some(
        el => el.children.length === 0 && el.textContent?.trim() === "0"
      )
    );

  if (await zeroCounters()) {
    await scrollPass();
    await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));
    if (await zeroCounters()) {
      console.warn(
        "[prerender] counters still read 0 after a second scroll pass"
      );
    }
  }

  // Vite's runtime chunk loader appends <link rel="modulepreload" as="script">
  // for every async chunk it pulls in. Snapshotting after the lazy 3D sections
  // have mounted would bake those into the static HTML, making every visitor
  // eagerly preload three.js, CircuitHero and ParticleField — the exact payload
  // the React.lazy boundaries exist to defer. Keep only the preloads the build
  // itself emitted.
  await page.evaluate(buildPreloads => {
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
      const href = link.getAttribute("href");
      if (href && !buildPreloads.includes(href)) link.remove();
    }
  }, buildEmittedPreloads);
}

/**
 * Strip residual inline opacity:0 / transform, then serialise the document —
 * both inside one page.evaluate.
 *
 * The strip used to live in settle(), two async round-trips before the HTML was
 * read. That window was enough for React to re-render and for framer-motion to
 * re-apply `opacity: 0` to anything still sitting at its `initial` state, which
 * is exactly what happens to the `md:hidden` mobile variants: they are
 * display:none at the prerender viewport, so their whileInView trigger never
 * fires and motion never advances them past `initial`. Five such elements
 * shipped invisible on the homepage. Doing both in one evaluate closes the
 * window by construction — nothing can run between the strip and the read.
 */
async function captureHtml(page) {
  return page.evaluate(() => {
    for (const el of document.querySelectorAll("[style]")) {
      const style = el.getAttribute("style");
      if (!style || !/opacity|transform/i.test(style)) continue;
      const cleaned = style
        .replace(/(^|;)\s*opacity\s*:\s*0(\.\d+)?\s*(?=;|$)/gi, "$1")
        .replace(/(^|;)\s*transform\s*:\s*[^;]*(?=;|$)/gi, "$1")
        .replace(/;{2,}/g, ";")
        .replace(/^;|;$/g, "")
        .trim();
      if (cleaned) el.setAttribute("style", cleaned);
      else el.removeAttribute("style");
    }
    // page.content() would be a second round-trip; serialise here instead.
    // outerHTML omits the doctype, so put it back.
    return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
  });
}

/** Derive per-page metadata from the rendered content. */
async function extractMeta(page) {
  return page.evaluate(() => {
    const clean = s => (s ?? "").replace(/\s+/g, " ").trim();

    const heading = clean(
      document.querySelector("main h1")?.innerText ??
        document.querySelector("h1")?.innerText
    );

    // Skip masthead boilerplate ("Effective date: …", "Filed May 27, 2026 …").
    // Legal pages all open with the same line, which otherwise produces identical
    // meta descriptions across /terms and /privacy and reads as duplicate content.
    const isBoilerplate = text =>
      /^(effective date|last updated|last revised|published|filed|version|copyright)\b/i.test(
        text
      ) || !/[.!?]/.test(text);

    let description = "";
    let fallback = "";
    for (const p of document.querySelectorAll("main p, main li")) {
      const text = clean(p.innerText);
      if (text.length < 70) continue;
      if (isBoilerplate(text)) {
        fallback ||= text;
        continue;
      }
      description = text;
      break;
    }
    return { heading, description: description || fallback };
  });
}

export function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, "")}…`;
}

export const escapeAttr = s =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Rewrite the head of a snapshot with route-specific title/description/canonical. */
export function applyMeta(html, { route, heading, description }) {
  const canonical = route === "/" ? `${ORIGIN}/` : `${ORIGIN}${route}`;

  // Google truncates titles past roughly 70 characters, so budget the whole
  // string — heading plus suffix — rather than only capping the heading. Long
  // headings (the article pages) fall back to the shorter brand suffix.
  const MAX_TITLE = 70;
  const LONG_SUFFIX = " | EmbeddedOS Foundation";
  const SHORT_SUFFIX = " | EmbeddedOS";

  let title = "EmbeddedOS — The Operating System for Every Device";
  if (heading) {
    title =
      heading.length + LONG_SUFFIX.length <= MAX_TITLE
        ? heading + LONG_SUFFIX
        : truncate(heading, MAX_TITLE - SHORT_SUFFIX.length) + SHORT_SUFFIX;
  }

  const desc = truncate(description || FALLBACK_DESCRIPTION, 250);

  let out = html;
  const set = (pattern, replacement) => {
    if (pattern.test(out)) out = out.replace(pattern, replacement);
  };

  set(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`);
  set(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(desc)}" />`
  );
  set(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`
  );
  set(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`
  );
  set(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(title)}" />`
  );
  set(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(desc)}" />`
  );

  return out;
}

function writeSnapshot(route, html) {
  const target =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route, "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, "utf8");
  return target;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    throw new Error(`No build found at ${DIST}. Run the client build first.`);
  }

  // The pristine SPA shell, captured before index.html is overwritten with the
  // prerendered homepage. Cached as a dotfile so a standalone `pnpm prerender`
  // re-run does not snapshot an already-prerendered page into itself, and so
  // static servers (which ignore dotfiles by default) never expose it as a
  // crawlable near-duplicate of the homepage.
  const shellCache = path.join(DIST, ".app-shell.html");
  const shell = fs.existsSync(shellCache)
    ? fs.readFileSync(shellCache, "utf8")
    : fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  fs.writeFileSync(shellCache, shell, "utf8");

  buildEmittedPreloads = [
    ...shell.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g),
  ].map(m => m[1]);

  const routes = discoverRoutes();
  console.log(`[prerender] ${routes.length} routes -> ${DIST}`);

  const server = await startServer(shell);
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    // Snapshot the reduced-motion variant: less animation state to strip.
    reducedMotion: "reduce",
  });

  // The API is not running during a static build; fail those calls instantly so
  // react-query does not hold pages open through its retry backoff.
  await context.route("**/api/**", r => r.abort());

  const results = [];
  const queue = [...routes];

  const worker = async () => {
    while (queue.length) {
      const route = queue.shift();
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", e => errors.push(String(e)));
      try {
        await page.goto(`http://127.0.0.1:${PORT}${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 45_000,
        });
        await settle(page);
        const meta = await extractMeta(page);
        const html = applyMeta(await captureHtml(page), { route, ...meta });
        const target = writeSnapshot(route, html);
        const textLength = await page.evaluate(
          () => document.getElementById("root").innerText.trim().length
        );
        results.push({
          route,
          ok: true,
          bytes: Buffer.byteLength(html),
          textLength,
          heading: meta.heading,
          target,
          errors,
        });
      } catch (err) {
        results.push({ route, ok: false, error: err.message, errors });
      } finally {
        await page.close();
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();
  server.close();

  // Expose the NotFound snapshot at the conventional /404.html so the server (and
  // most static hosts) can return it with a real 404 status.
  const notFoundSnapshot = path.join(DIST, "404", "index.html");
  if (fs.existsSync(notFoundSnapshot)) {
    fs.copyFileSync(notFoundSnapshot, path.join(DIST, "404.html"));
  }

  // Vite copies publicDir wholesale, which drags the Manus dev debug collector
  // (~25 KB) into the public build even though only the dev-only plugin ever
  // injects it. Drop it from the deployed output.
  const devArtifacts = path.join(DIST, "__manus__");
  if (fs.existsSync(devArtifacts)) {
    fs.rmSync(devArtifacts, { recursive: true, force: true });
    console.log(
      "[prerender] removed dev-only __manus__/ from the build output"
    );
  }
  const staleShell = path.join(DIST, "app-shell.html");
  if (fs.existsSync(staleShell)) fs.rmSync(staleShell);

  results.sort((a, b) => a.route.localeCompare(b.route));
  const failed = results.filter(r => !r.ok);
  const thin = results.filter(r => r.ok && r.textLength < 500);

  for (const r of results) {
    if (!r.ok) console.log(`  FAIL  ${r.route.padEnd(38)} ${r.error}`);
  }
  for (const r of thin) {
    console.log(
      `  THIN  ${r.route.padEnd(38)} only ${r.textLength} chars of text`
    );
  }

  const ok = results.filter(r => r.ok);
  const avgText = ok.length
    ? Math.round(ok.reduce((s, r) => s + r.textLength, 0) / ok.length)
    : 0;
  console.log(
    `[prerender] ${ok.length}/${results.length} rendered · avg ${avgText} chars of visible text · ` +
      `${failed.length} failed · ${thin.length} thin`
  );

  if (failed.length) {
    console.error(`[prerender] ${failed.length} route(s) failed to render.`);
    process.exitCode = 1;
  }
}

// Only run when executed directly (`node scripts/prerender.mjs`), so unit tests
// can import the helpers above without launching a browser.
const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  await main();
}
