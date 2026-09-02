/**
 * The header and the footer are two different menus with two different jobs:
 * the header is the product menu a builder uses, the footer is the site's
 * organisational map. They had drifted into near-duplicates — 16 routes in
 * both, with the header's "Community" menu carrying About, Mission,
 * Transparency, Careers and Patents.
 *
 * These tests hold the separation in place and, more importantly, hold the
 * footer's own promise: every route the router serves has a home in one of its
 * columns. Six routes had quietly failed that promise (`/docs`, `/security`,
 * `/licenses`, `/roadmap`, `/research`, `/demo`) while remaining reachable only
 * from body copy on other pages.
 *
 * Both menus are parsed from source rather than rendered, because the data is
 * what is being asserted and rendering the navbar would drag in Radix, wouter
 * and framer-motion for no gain.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

const appSource = read("client/src/App.tsx");
const navSource = read("client/src/components/Navbar.tsx");
const footerSource = read("client/src/components/Footer.tsx");

/** Internal routes the router serves, excluding the catch-all 404. */
const routes = [
  ...new Set(
    [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1])
  ),
].filter(r => r !== "/404");

/** Extract the internal hrefs from a named object literal in a source file. */
function hrefsIn(source: string, declaration: string): string[] {
  const start = source.indexOf(declaration);
  if (start === -1) throw new Error(`${declaration} not found`);
  const rest = source.slice(start);
  const end = rest.search(/\n\}(?: as const)?;\n/);
  const block = rest.slice(0, end);
  return [
    ...new Set([...block.matchAll(/href:\s*"(\/[^"]*)"/g)].map(m => m[1])),
  ];
}

const navHrefs = hrefsIn(navSource, "const NAV_ITEMS = {");
const footerHrefs = hrefsIn(footerSource, "const FOOTER_LINKS = {");
const legalBlock =
  footerSource.match(/const LEGAL_LINKS = \[[\s\S]*?\n\];/)?.[0] ?? "";
const legalHrefs = [
  ...new Set([...legalBlock.matchAll(/href:\s*"(\/[^"]*)"/g)].map(m => m[1])),
];
const footerAll = [...new Set([...footerHrefs, ...legalHrefs])];

/**
 * Families of detail pages reached through a hub page instead of directly.
 *
 * Listing 13 product detail pages and 8 articles in the footer would bury the
 * columns that matter. Each family has a hub that IS in the footer and that
 * links its members, so the chain from the footer to any page stays unbroken —
 * which is the property worth holding, not the literal presence of every URL.
 */
const HUBS: Array<{ prefix: string; hub: string }> = [
  { prefix: "/product-", hub: "/products" },
  { prefix: "/article-", hub: "/news" },
];

/**
 * A parameterised route is a template, not a page. `/article/:slug` has no
 * single URL to put in a footer; its concrete instances are the `/article-xxx`
 * paths, which the /news hub covers above.
 */
const isParameterised = (route: string) => route.includes(":");

describe("route coverage", () => {
  it("gives every route a home in the footer, directly or through its hub", () => {
    const missing = routes.filter(r => {
      if (r === "/" || isParameterised(r) || footerAll.includes(r)) return false;
      const hub = HUBS.find(h => r.startsWith(h.prefix));
      return !(hub && footerAll.includes(hub.hub));
    });
    expect(
      missing,
      `routes with no footer link:\n${missing.join("\n")}`
    ).toEqual([]);
  });

  it("keeps every hub itself in the footer", () => {
    for (const { hub } of HUBS) expect(footerAll).toContain(hub);
  });

  it("points every menu link at a route that exists", () => {
    const known = new Set(routes);
    const dangling = [...navHrefs, ...footerAll].filter(h => !known.has(h));
    expect(
      dangling,
      `links to non-existent routes:\n${dangling.join("\n")}`
    ).toEqual([]);
  });
});

describe("menu separation", () => {
  it("keeps the Foundation's institutional pages out of the header", () => {
    // These belong to the organisation, not to the software. A visitor opening
    // the product menu is not looking for the charity's filing policy.
    const institutional = [
      "/about",
      "/mission",
      "/transparency",
      "/organization",
      "/vision",
      "/industries",
      "/patents",
      "/careers",
      "/internship",
      "/membership",
      "/what-we-do",
    ];
    const leaked = institutional.filter(r => navHrefs.includes(r));
    expect(
      leaked,
      `institutional routes still in the header:\n${leaked.join("\n")}`
    ).toEqual([]);
  });

  it("gives every header destination a footer home too", () => {
    // Raw overlap is deliberately NOT the metric. The footer is the complete
    // map of the site, so every product page the header shows must also appear
    // there — overlap on product routes is the design, not a defect. What the
    // split actually removed is the reverse direction: institutional pages that
    // had no business in a product menu, asserted above.
    const orphaned = navHrefs.filter(h => {
      if (footerAll.includes(h)) return false;
      const hub = HUBS.find(x => h.startsWith(x.prefix));
      return !(hub && footerAll.includes(hub.hub));
    });
    expect(
      orphaned,
      `header links with no footer home:\n${orphaned.join("\n")}`
    ).toEqual([]);
  });

  it("keeps the header focused on the builder's journey", () => {
    expect(navSource).toMatch(/^\s{2}Projects: \{/m);
    expect(navSource).toMatch(/^\s{2}Products: \{/m);
    expect(navSource).toMatch(/^\s{2}Docs: \{/m);
    expect(navSource).toMatch(/^\s{2}Community: \{/m);
  });
});

describe("footer columns", () => {
  it("has a column for each area of the site", () => {
    for (const heading of [
      "Foundation",
      "Join & Support",
      "Platform",
      "Applications",
      "Resources",
    ]) {
      expect(footerSource).toContain(heading);
    }
  });

  it("publishes the policy pages in the bottom bar", () => {
    for (const href of ["/privacy", "/terms", "/licenses", "/security"]) {
      expect(legalHrefs).toContain(href);
    }
  });

  it("lists no route twice within the footer", () => {
    const all = [...footerHrefs, ...legalHrefs];
    const seen = new Set<string>();
    const dupes = all.filter(h => (seen.has(h) ? true : (seen.add(h), false)));
    expect(dupes).toEqual([]);
  });
});
