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
  const files = fs.globSync("**/*.html", { cwd: DIST });

  for (const file of files) {
    const route =
      "/" + file.replace(/(^|\/)index\.html$/, "").replace(/\/$/, "");
    const html = fs.readFileSync(path.join(DIST, file), "utf8");

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
  return { anchors, namelessButtons, pageCount: files.length };
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
