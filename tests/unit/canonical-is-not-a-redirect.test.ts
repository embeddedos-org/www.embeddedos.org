/**
 * A canonical URL must be the URL the server actually serves.
 *
 * scripts/prerender.mjs writes every route to <route>/index.html, so Apache's
 * DirectorySlash answers /about with 301 -> /about/. The page served at
 * /about/ was declaring <link rel="canonical" href=".../about"> — a canonical
 * pointing at a URL that redirects away from the page carrying it. The sitemap
 * listed the same redirecting form for 131 of its 132 entries.
 *
 * Google resolves a canonical by following it; a canonical that 301s is a
 * contradiction, and it is the documented reason a page is dropped in favour
 * of a search-engine-chosen URL. These tests pin the agreement between what is
 * served and what is claimed.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
// @ts-expect-error - plain .mjs script, no type declarations
import { applyMeta } from "../../scripts/prerender.mjs";
import { canonicalFor } from "../../client/src/lib/page-meta";

const ROOT = path.resolve(__dirname, "../..");
const ORIGIN = "https://www.embeddedos.org";

const SHELL = `<!doctype html><html><head><title>t</title>
<link rel="canonical" href="${ORIGIN}/" />
<meta property="og:url" content="${ORIGIN}/" />
<meta name="description" content="d" />
<meta property="og:title" content="t" />
<meta property="og:description" content="d" />
</head><body><main><h1>H</h1></main></body></html>`;

const attrOf = (html: string, re: RegExp) => html.match(re)?.[1] ?? "";

/** A served route is a directory, so its canonical must end in "/". */
const expectedCanonical = (route: string) =>
  route === "/" ? `${ORIGIN}/` : `${ORIGIN}${route}/`;

describe("a canonical URL is never a URL that redirects", () => {
  const routes = ["/about", "/mission", "/donate", "/projects", "/eos"];

  it("the client-side canonical ends in a slash for every non-root route", () => {
    for (const r of routes) {
      expect(canonicalFor(r), `canonicalFor("${r}")`).toBe(
        expectedCanonical(r)
      );
    }
  });

  it("the prerenderer writes the same canonical the client does", () => {
    for (const r of routes) {
      const out = applyMeta(SHELL, {
        route: r,
        heading: "H",
        description: "x".repeat(80),
      });
      expect(
        attrOf(out, /<link rel="canonical" href="([^"]*)"/),
        `prerendered canonical for ${r}`
      ).toBe(expectedCanonical(r));
      expect(
        attrOf(out, /<meta property="og:url" content="([^"]*)"/),
        `prerendered og:url for ${r}`
      ).toBe(expectedCanonical(r));
    }
  });

  it("the root canonical stays a bare slash, not a doubled one", () => {
    expect(canonicalFor("/")).toBe(`${ORIGIN}/`);
    const out = applyMeta(SHELL, {
      route: "/",
      heading: "H",
      description: "x".repeat(80),
    });
    expect(attrOf(out, /<link rel="canonical" href="([^"]*)"/)).toBe(
      `${ORIGIN}/`
    );
  });

  it("every sitemap URL ends in a slash, so none of them redirect", () => {
    const xml = fs.readFileSync(
      path.join(ROOT, "client/public/sitemap.xml"),
      "utf8"
    );
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    expect(locs.length).toBeGreaterThan(100);
    const redirecting = locs.filter(l => !l.endsWith("/"));
    expect(
      redirecting,
      `${redirecting.length} of ${locs.length} sitemap URLs would 301`
    ).toEqual([]);
  });
});
