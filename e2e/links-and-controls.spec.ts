/**
 * Full-coverage sweep for dead links and dead controls.
 *
 * The Ad Grants policy requires that "all links must function correctly" and
 * that buttons — donation buttons especially — work. The acceptance suite
 * samples five pages; this one covers every prerendered page in the build.
 *
 * Internal targets are resolved over HTTP against the production server.
 * External targets are deliberately not fetched here: a third-party outage
 * would turn a green suite red for a reason that is not ours. They are swept
 * separately before a deploy.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist/public");

type Anchor = {
  route: string;
  href?: string;
  text: string;
  aria?: string;
  inner: string;
};

function readBuild() {
  const anchors: Anchor[] = [];
  const namelessButtons: string[] = [];
  const doubledChrome: string[] = [];
  const files = fs.globSync("**/*.html", { cwd: DIST });

  for (const file of files) {
    const route =
      "/" + file.replace(/(^|\/)index\.html$/, "").replace(/\/$/, "");
    const html = fs.readFileSync(path.join(DIST, file), "utf8");

    // App.tsx renders the navbar and footer once, around <main>. A page that
    // renders its own on top of that produces a second position:fixed z-50
    // header which, being later in the DOM, silently swallows every click
    // aimed at the real one. That is how the whole navbar went dead on all 13
    // product pages and /patents while looking perfectly normal.
    const headers = (html.match(/<header\b/gi) ?? []).length;
    const footers = (html.match(/<footer\b/gi) ?? []).length;
    if (headers > 1 || footers > 1) {
      doubledChrome.push(`${route}: ${headers} <header>, ${footers} <footer>`);
    }

    for (const [, attrs, inner] of html.matchAll(
      /<a\b([^>]*)>([\s\S]*?)<\/a>/gi
    )) {
      anchors.push({
        route,
        href: attrs.match(/\bhref="([^"]*)"/)?.[1],
        aria: attrs.match(/aria-label="([^"]*)"/)?.[1],
        text: inner
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim(),
        inner,
      });
    }

    for (const [, attrs, inner] of html.matchAll(
      /<button\b([^>]*)>([\s\S]*?)<\/button>/gi
    )) {
      const text = inner
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const aria = attrs.match(/aria-label="([^"]*)"/)?.[1];
      const title = attrs.match(/\btitle="([^"]*)"/)?.[1];
      if (!text && !aria && !title) {
        namelessButtons.push(`${route}: <button${attrs.slice(0, 60)}…>`);
      }
    }
  }

  expect(files.length, "prerendered pages found").toBeGreaterThan(80);
  return { anchors, namelessButtons, doubledChrome, pageCount: files.length };
}

const build = readBuild();

test.describe("links", () => {
  test("every internal link target resolves", async ({ request }) => {
    const targets = new Set(
      build.anchors
        .map(a => a.href)
        .filter((h): h is string => !!h && h.startsWith("/"))
        .map(h => h.split("#")[0].split("?")[0] || "/")
    );

    const broken: string[] = [];
    for (const href of targets) {
      const res = await request.get(href, { maxRedirects: 5 });
      if (res.status() >= 400) broken.push(`${href} -> ${res.status()}`);
    }

    expect(targets.size, "internal targets swept").toBeGreaterThan(50);
    expect(broken, "broken internal links").toEqual([]);
  });

  test("no anchor is a placeholder", () => {
    const placeholders = build.anchors
      .filter(a => a.href === undefined || a.href === "" || a.href === "#")
      .map(
        a =>
          `${a.route}: "${a.text.slice(0, 40)}" href=${JSON.stringify(a.href)}`
      );
    expect(placeholders, "anchors with no destination").toEqual([]);
  });

  test("an unknown URL returns a real 404", async ({ request }) => {
    const res = await request.get("/this-route-does-not-exist", {
      maxRedirects: 0,
    });
    expect(res.status()).toBe(404);
  });
});

test.describe("controls", () => {
  test("every button has an accessible name", () => {
    expect(
      build.namelessButtons,
      "buttons a screen reader cannot announce"
    ).toEqual([]);
  });

  test("no page renders the site chrome twice", () => {
    expect(
      build.doubledChrome,
      "pages rendering a second navbar/footer over the app's own"
    ).toEqual([]);
  });

  // The static check above catches the duplicate at build time; this one proves
  // the consequence is gone — that a real click actually reaches the navbar.
  // Routes listed here are the ones the duplicate navbar had disabled.
  for (const route of ["/product-eboot", "/product-edb", "/patents", "/"]) {
    test(`the navbar accepts clicks on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const nav = page.getByRole("button", { name: "Projects" }).first();
      await expect(nav).toBeVisible();

      // Nothing else may occupy the button's own centre point.
      const covering = await nav.evaluate(el => {
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(
          r.x + r.width / 2,
          r.y + r.height / 2
        );
        if (!top || top === el || el.contains(top)) return null;
        return `${top.tagName.toLowerCase()}.${String(top.className).slice(0, 60)}`;
      });
      expect(covering, `element covering the navbar on ${route}`).toBeNull();

      // And the click must open the menu it belongs to.
      await nav.click({ timeout: 5000 });
      await expect(nav).toHaveAttribute("aria-expanded", "true");
    });
  }

  test("every link has an accessible name", () => {
    const nameless = build.anchors
      .filter(a => {
        if (a.text || a.aria) return false;
        // An icon-only link is fine when the image inside carries alt text.
        const alt = a.inner.match(/\balt="([^"]*)"/)?.[1];
        return !alt;
      })
      .map(a => `${a.route}: <a href="${a.href}">`);
    expect(nameless, "links a screen reader cannot announce").toEqual([]);
  });
});
