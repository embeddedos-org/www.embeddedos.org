/**
 * Browser audit of the built site against the mobile, navigation and donation
 * requirements of the Google Ad Grants website policy.
 *
 * Per page, at an iPhone-SE viewport:
 *   - horizontal overflow (the page body must never scroll sideways)
 *   - text smaller than 12px (unreadable on mobile)
 *   - tap targets under 24px (Lighthouse's accessibility floor)
 *   - console errors and failed requests
 * Plus a dedicated check that the donate route renders a usable donation control.
 *
 * Run with `pnpm audit:mobile` after a build.
 */
import fs from "node:fs";
import path from "node:path";
import express from "express";
import { chromium } from "@playwright/test";

const DIST = path.resolve(import.meta.dirname, "..", "dist", "public");
const PORT = Number(process.env.AUDIT_PORT ?? 41888);
const MOBILE = { width: 375, height: 667 };

// Sampled rather than exhaustive: these cover every distinct page layout in use.
const ROUTES = process.env.AUDIT_ROUTES?.split(",") ?? [
  "/",
  "/about",
  "/mission",
  "/transparency",
  "/industries",
  "/organization",
  "/what-we-do",
  "/donate",
  "/get-involved",
  "/contact",
  "/getting-started",
  "/docs",
  "/products",
  "/projects",
  "/news",
  "/faq",
  "/resources",
  "/downloads",
  "/kids",
  "/health",
  "/aerospace",
  "/patents",
  "/membership",
  "/privacy",
  "/terms",
  "/404",
];

function startServer() {
  const app = express();
  app.use(express.static(DIST, { index: false, redirect: false }));
  app.use((req, res) => {
    const safe = path
      .normalize(req.path)
      .replace(/^(\.\.[/\\])+/, "")
      .replace(/[/\\]+$/, "");
    const candidate = path.resolve(DIST, `.${path.sep}${safe}`, "index.html");
    if (candidate.startsWith(DIST) && fs.existsSync(candidate))
      return res.sendFile(candidate);
    const notFound = path.join(DIST, "404.html");
    return fs.existsSync(notFound)
      ? res.status(404).sendFile(notFound)
      : res.status(404).send("not found");
  });
  return new Promise(resolve => {
    const server = app.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

const server = await startServer();
const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const problems = [];
const rows = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({
    viewport: MOBILE,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  // The API is not running for a static audit; fail those fast rather than
  // reporting them as page errors.
  await ctx.route("**/api/**", r => r.abort());

  const page = await ctx.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  const thirdPartyRequestFailures = [];
  page.on("console", m => {
    if (m.type() !== "error") return;

    // Same policy as the requestfailed handler below, which this was missing.
    // A subresource that 404s arrives here as well as there, and the text
    // ("Failed to load resource: the server responded with a status of 404")
    // names no URL — so a Google Fonts woff2 answering 404 failed this audit on
    // a different route each run, for a reason outside this repository. The
    // location does carry the URL, which is what makes the split possible.
    //
    // An error with no location is kept: silently swallowing one would be the
    // worse failure, and first-party 404s still fail the gate.
    const url = m.location()?.url ?? "";
    if (url && !url.startsWith(`http://127.0.0.1:${PORT}`)) {
      thirdPartyRequestFailures.push(url.slice(0, 90));
      return;
    }

    consoleErrors.push(m.text().slice(0, 160));
  });
  page.on("pageerror", e =>
    consoleErrors.push(`pageerror: ${String(e).slice(0, 160)}`)
  );
  page.on("requestfailed", r => {
    const url = r.url();
    if (url.includes("/api/")) return;
    // Only first-party requests are a build problem. /donate embeds Zeffy's
    // donation form, which pulls chunks from Zeffy's CDN plus Stripe, hCaptcha
    // and reCAPTCHA; those fail intermittently from CI and sandboxed networks
    // and named different chunks on every run. A gate that goes red on someone
    // else's CDN teaches people to ignore it. They are surfaced as notes below.
    if (!url.startsWith(`http://127.0.0.1:${PORT}`)) {
      thirdPartyRequestFailures.push(url.slice(0, 90));
      return;
    }
    failedRequests.push(`${url.slice(0, 90)}`);
  });

  await page.goto(`http://127.0.0.1:${PORT}${route}`, {
    waitUntil: "domcontentloaded",
  });
  await page
    .waitForFunction(
      () => document.getElementById("root")?.children.length > 0,
      { timeout: 20_000 }
    )
    .catch(() => {});
  await page.waitForTimeout(1200);

  const metrics = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const overflowBy = document.documentElement.scrollWidth - docWidth;

    // Which elements actually stick out past the viewport?
    const offenders = [];
    if (overflowBy > 1) {
      for (const el of document.body.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > docWidth + 1) {
          const style = getComputedStyle(el);
          if (
            style.position === "fixed" ||
            style.overflowX === "auto" ||
            style.overflowX === "scroll"
          )
            continue;
          offenders.push(
            `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/).slice(0, 2).join(".") : ""} right=${Math.round(r.right)}`
          );
          if (offenders.length >= 4) break;
        }
      }
    }

    let tinyText = 0;
    let smallTaps = 0;
    for (const el of document.body.querySelectorAll(
      "p, span, a, li, div, button"
    )) {
      const text = el.textContent?.trim();
      if (!text) continue;
      const style = getComputedStyle(el);
      if (el.children.length === 0 && parseFloat(style.fontSize) < 12)
        tinyText++;
    }
    for (const el of document.body.querySelectorAll("a[href], button")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 24 || r.width < 24) smallTaps++;
    }

    return { docWidth, overflowBy, offenders, tinyText, smallTaps };
  });

  rows.push({
    route,
    ...metrics,
    consoleErrors: consoleErrors.length,
    failedRequests: failedRequests.length,
  });

  if (metrics.overflowBy > 1)
    problems.push([
      route,
      `horizontal overflow +${metrics.overflowBy}px :: ${metrics.offenders.join(" | ")}`,
    ]);
  for (const e of consoleErrors.slice(0, 3))
    problems.push([route, `console: ${e}`]);
  for (const f of failedRequests.slice(0, 3))
    problems.push([route, `failed request: ${f}`]);
  // Reported, never failed on — see the requestfailed handler above. Printing
  // them keeps a genuinely broken embed visible instead of silently dropped.
  for (const f of thirdPartyRequestFailures.slice(0, 3))
    console.log(`  note  ${route}  third-party request failed: ${f}`);

  // Donation path must actually work — an explicit policy requirement.
  if (route === "/donate") {
    const donate = await page.evaluate(() => {
      const text = document.body.innerText;
      const controls = [...document.querySelectorAll("button, a[href]")]
        .map(el => (el.textContent ?? "").trim())
        .filter(t => /donate|give|contribute|support|\$\d/i.test(t));
      return {
        mentionsTaxDeductible: /tax[- ]deductible/i.test(text),
        mentionsEin: /41-4821627/.test(text),
        controlCount: controls.length,
        sample: controls.slice(0, 8),
        hasAmountPresets: /\$(10|25|50|100|250|500)\b/.test(text),
      };
    });
    console.log("\n[donate] " + JSON.stringify(donate, null, 2) + "\n");
    if (donate.controlCount === 0)
      problems.push(["/donate", "no donation control rendered"]);
    if (!donate.hasAmountPresets)
      problems.push(["/donate", "no donation amount options rendered"]);
  }

  await ctx.close();
}

await browser.close();
server.close();

console.log(
  `${"ROUTE".padEnd(22)}${"OVERFLOW".padStart(9)}${"TINY".padStart(6)}${"TAPS<24".padStart(9)}${"ERRS".padStart(6)}${"REQFAIL".padStart(9)}`
);
for (const r of rows) {
  console.log(
    r.route.padEnd(22) +
      String(r.overflowBy > 1 ? `+${r.overflowBy}px` : "ok").padStart(9) +
      String(r.tinyText).padStart(6) +
      String(r.smallTaps).padStart(9) +
      String(r.consoleErrors).padStart(6) +
      String(r.failedRequests).padStart(9)
  );
}

console.log(
  `\n[mobile] ${rows.length} routes at ${MOBILE.width}x${MOBILE.height}`
);
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const [route, msg] of problems)
    console.log(`  ✗ ${route.padEnd(20)} ${msg}`);
  process.exitCode = 1;
} else {
  console.log("[mobile] no overflow, console errors, or failed requests");
}
