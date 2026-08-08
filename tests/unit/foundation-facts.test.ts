/**
 * The Foundation's legal facts appear in three places that cannot import from
 * each other: client/src/data/foundation.ts (the source of truth, used by the
 * React pages), the JSON-LD block in client/index.html (static, read by
 * crawlers), and client/public/sitemap.xml (static, read by crawlers).
 *
 * Drift between them is the failure this file exists to catch, and it has
 * already happened once: /contact published "EIN available upon request" while
 * /donate and /organization published the EIN itself — a contradiction on the
 * single number that proves charitable status, which is exactly what a Google
 * Ad Grants reviewer checks. Nothing else in the suite compares a TypeScript
 * constant against static markup, so it gets its own check here.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const INDEX_HTML = path.join(ROOT, "client/index.html");
const SITEMAP = path.join(ROOT, "client/public/sitemap.xml");
const APP_TSX = path.join(ROOT, "client/src/App.tsx");
const FOUNDATION_TS = path.join(ROOT, "client/src/data/foundation.ts");

const indexHtml = fs.readFileSync(INDEX_HTML, "utf8");
const sitemap = fs.readFileSync(SITEMAP, "utf8");
const appTsx = fs.readFileSync(APP_TSX, "utf8");
const foundationTs = fs.readFileSync(FOUNDATION_TS, "utf8");

const ORIGIN = "https://www.embeddedos.org";

/** The single JSON-LD block in the shell, parsed. */
function structuredData(): Record<string, unknown> {
  const match = indexHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  expect(match, "index.html must carry a JSON-LD block").not.toBeNull();
  return JSON.parse(match![1]);
}

/** A string literal assigned to `key:` in foundation.ts. */
function foundationValue(key: string): string {
  const match = foundationTs.match(
    new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
  );
  expect(match, `foundation.ts must define ${key}`).not.toBeNull();
  return match![1];
}

/** Static route paths declared in App.tsx, excluding the 404 fallback. */
function declaredRoutes(): string[] {
  return [...appTsx.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map(m => m[1])
    .filter(r => !r.includes(":") && !r.includes("*") && r !== "/404");
}

/** Paths listed in the sitemap, normalised to route form. */
function sitemapPaths(): string[] {
  return [
    ...sitemap.matchAll(
      new RegExp(`<loc>${ORIGIN}([^<]*)</loc>`.replace(/\//g, "\\/"), "g")
    ),
  ].map(m => m[1] || "/");
}

describe("structured data agrees with the source of truth", () => {
  it("publishes the same EIN the pages publish", () => {
    expect(structuredData().taxID).toBe(foundationValue("ein"));
  });

  it("publishes the same legal name the pages publish", () => {
    expect(structuredData().name).toBe(foundationValue("legalName"));
  });

  it("publishes the same canonical URL", () => {
    expect(structuredData().url).toBe(foundationValue("website"));
  });

  it("declares 501(c)(3) status", () => {
    const data = structuredData();
    expect(data["@type"]).toBe("NGO");
    expect(data.nonprofitStatus).toBe("Nonprofit501c3");
  });

  it("links only accounts the site links elsewhere", () => {
    // A sameAs pointing at an account the Foundation does not control is worse
    // than no sameAs: it tells Google to treat that account as authoritative.
    const sameAs = structuredData().sameAs as string[];
    expect(sameAs.length).toBeGreaterThan(0);
    for (const url of sameAs) {
      expect(
        foundationTs,
        `${url} must be declared in foundation.ts`
      ).toContain(url);
    }
  });
});

describe("the sitemap covers the site", () => {
  it("lists every static route", () => {
    const missing = declaredRoutes().filter(r => !sitemapPaths().includes(r));
    expect(missing, "routes absent from sitemap.xml").toEqual([]);
  });

  it("lists no path that is not a route", () => {
    const routes = declaredRoutes();
    const stray = sitemapPaths().filter(p => !routes.includes(p));
    expect(stray, "sitemap.xml entries with no matching route").toEqual([]);
  });

  it("includes the pages a nonprofit review looks for", () => {
    for (const required of [
      "/",
      "/about",
      "/mission",
      "/transparency",
      "/organization",
      "/contact",
      "/donate",
      "/privacy",
      "/terms",
    ]) {
      expect(sitemapPaths(), `sitemap missing ${required}`).toContain(required);
    }
  });
});

describe("the EIN is stated consistently", () => {
  it("is never described as withheld", () => {
    // The specific regression: /contact said "EIN available upon request" while
    // two other pages printed it.
    const pages = path.join(ROOT, "client/src/pages");
    const offenders: string[] = [];
    for (const file of fs.readdirSync(pages)) {
      if (!file.endsWith(".tsx")) continue;
      const text = fs.readFileSync(path.join(pages, file), "utf8");
      if (/EIN[^.]{0,40}(upon request|on request|available on)/i.test(text)) {
        offenders.push(file);
      }
    }
    expect(offenders, "pages that withhold the EIN").toEqual([]);
  });
});
