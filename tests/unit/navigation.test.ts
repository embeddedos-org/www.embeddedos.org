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
const communitySource = read("client/src/pages/Community.tsx");
const communityDataSource = read("client/src/data/community.ts");
const productsSource = read("client/src/pages/Products.tsx");
const newsSource = read("client/src/pages/News.tsx");
const researchSource = read("client/src/pages/Research.tsx");
const resourcesSource = read("client/src/pages/Resources.tsx");
const ecosystemSource = read("client/src/pages/Ecosystem.tsx");
const aboutSource = read("client/src/pages/About.tsx");
const donateSource = read("client/src/pages/Donate.tsx");
const missionSource = read("client/src/pages/Mission.tsx");
const foundationSource = read("client/src/data/foundation.ts");

/** Internal routes the router serves, excluding the catch-all 404. */
const routes = [
  ...new Set(
    [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1])
  ),
].filter(r => r !== "/404");

/** Extract every internal href from a named object literal in source order. */
function rawHrefsIn(source: string, declaration: string): string[] {
  const start = source.indexOf(declaration);
  if (start === -1) throw new Error(`${declaration} not found`);
  const rest = source.slice(start);
  const end = rest.search(/\n\}(?: as const)?;\n/);
  const block = rest.slice(0, end);
  return [...block.matchAll(/href:\s*"(\/[^"]*)"/g)].map(m => m[1]);
}

const navHrefs = [...new Set(rawHrefsIn(navSource, "const NAV_ITEMS = {"))];
const footerHrefs = rawHrefsIn(footerSource, "const FOOTER_LINKS = {");
const legalBlock =
  footerSource.match(/const LEGAL_LINKS = \[[\s\S]*?\n\];/)?.[0] ?? "";
const legalHrefs = [...legalBlock.matchAll(/href:\s*"(\/[^"]*)"/g)].map(
  m => m[1]
);
const footerAll = [...new Set([...footerHrefs, ...legalHrefs])];

/**
 * Families of detail pages reached through a hub page instead of directly.
 *
 * Listing 13 product detail pages and 9 articles in the footer would bury the
 * columns that matter. Each family has a hub that IS in the footer and that
 * links its members, so the chain from the footer to any page stays unbroken —
 * which is the property worth holding, not the literal presence of every URL.
 */
const HUBS: Array<{ prefix: string; hub: string }> = [
  { prefix: "/product-", hub: "/products" },
  { prefix: "/article-", hub: "/news" },
  // The eight research-area pages are listed on /research, and the nine
  // programme pages on /programmes. Both hubs are in the footer and both link
  // every member, so the chain from the footer to any page stays unbroken —
  // which is the property this file protects. The alternative was seventeen
  // more footer links, which buries the columns that matter.
  { prefix: "/research/", hub: "/research" },
  { prefix: "/programmes/", hub: "/programmes" },
];

/**
 * Pages with no footer column, grouped by the hub page that carries them.
 *
 * Ad Grants review: the footer ran seven columns and ~90 links. It now runs
 * six columns of at most eight links, and the depth moved here — each hub is
 * itself in the footer, and the "hub links its members" test below fails if a
 * member is ever removed from its hub page. Adding a member means adding the
 * link on the hub page AND the entry here, together.
 */
const HUB_MEMBERS: Array<{ hub: string; members: string[] }> = [
  {
    hub: "/news",
    members: [
      "/case-studies",
      "/member-stories",
      "/product-showcases",
      "/project-showcases",
      "/social",
      "/press-kit",
      "/brand",
    ],
  },
  {
    hub: "/research",
    members: [
      "/publications",
      "/white-papers",
      "/technical-reports",
      "/benchmarks",
      "/datasets",
      "/future-research",
    ],
  },
  {
    hub: "/resources",
    members: [
      "/demo",
      "/hardware-lab",
      "/kids",
      "/building-os",
      "/ai-os",
      "/roadmap",
      "/stacks",
      "/eflow",
      "/architecture",
      "/certification",
      "/internship",
    ],
  },
  {
    hub: "/ecosystem",
    members: [
      "/eboot",
      "/eipc",
      "/eni",
      "/eai-edge",
      "/ecad-hardware",
      "/aerospace",
      "/health",
      "/health-compare",
      "/neural-link-ai",
      "/flow",
      "/ehealth365",
      "/eradar360",
      "/youtube",
    ],
  },
  {
    hub: "/about",
    members: ["/what-we-do", "/industries", "/patents", "/careers"],
  },
  { hub: "/donate", members: ["/membership", "/sponsors"] },
  { hub: "/mission", members: ["/industries"] },
];

const HUB_SOURCES: Record<string, string> = {
  "/news": newsSource,
  "/research": researchSource,
  "/resources": resourcesSource,
  "/ecosystem": ecosystemSource,
  "/about": aboutSource,
  "/donate": donateSource,
  "/mission": missionSource,
};

/** Every route covered through a hub rather than a literal footer link. */
function hubFor(route: string): string | undefined {
  const prefix = HUBS.find(h => route.startsWith(h.prefix));
  if (prefix) return prefix.hub;
  return HUB_MEMBERS.find(h => h.members.includes(route))?.hub;
}

/**
 * A parameterised route is a template, not a page. `/article/:slug` has no
 * single URL to put in a footer; its concrete instances are the `/article-xxx`
 * paths, which the /news hub covers above.
 */
const isParameterised = (route: string) => route.includes(":");

describe("route coverage", () => {
  it("gives every route a home in the footer, directly or through its hub", () => {
    const missing = routes.filter(r => {
      if (r === "/" || isParameterised(r) || footerAll.includes(r))
        return false;
      const hub = hubFor(r);
      return !(hub && footerAll.includes(hub));
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

describe("hub pages link their members", () => {
  for (const { hub, members } of HUB_MEMBERS) {
    it(`${hub} links ${members.length} member pages`, () => {
      const source = HUB_SOURCES[hub];
      // Literal hrefs, data entries (`href: "/x"`, `link: "/x"`) and computed
      // paths (`href={..."/x"...}` all count: what matters is the address
      // appears in the hub's source, not which JSX form carries it. The
      // research area links are computed (`/research/${c.key}`), so the
      // prefix family above covers them rather than this list.
      const missing = members.filter(m => !source.includes(`"${m}"`));
      expect(missing, `${hub} does not link:\n${missing.join("\n")}`).toEqual(
        []
      );
    });
  }

  it("keeps every hub itself in the footer", () => {
    const hubs = [...new Set(HUB_MEMBERS.map(h => h.hub))];
    for (const hub of hubs) expect(footerAll).toContain(hub);
  });
});

describe("product reference pages", () => {
  /** Every /product-* detail route the router serves, excluding the hubs. */
  const detailRoutes = routes.filter(
    r => r.startsWith("/product-") && r !== "/product-showcases"
  );

  /**
   * These pages were reachable only from the header's mega-menu, which Radix
   * mounts on hover — so none of them appeared in any prerendered page, and
   * three had no inbound link anywhere in the static site. /products is their
   * hub and must link each one.
   */
  it("links every product detail page from the products hub", () => {
    const missing = detailRoutes.filter(
      r => !productsSource.includes(`href: "${r}"`)
    );
    expect(missing, "product routes absent from /products").toEqual([]);
  });

  it("lists no product reference entry that is not a route", () => {
    const listed = [
      ...productsSource.matchAll(/href: "(\/product-[^"]+)"/g),
    ].map(m => m[1]);
    const stray = listed.filter(h => !routes.includes(h));
    expect(stray, "product reference entries with no route").toEqual([]);
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
      const hub = hubFor(h);
      return !(hub && footerAll.includes(hub));
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

describe("community resources", () => {
  // NOTE (Ad Grants link-integrity, 2026-09-19): the wiki/issues/AGENTS.md
  // entries that pointed at github.com/embeddedos-org/www.embeddedos.org were
  // removed from client/src/data/community.ts — that repository is private, so
  // those links 404 for every public visitor.
  const expected = [
    "https://github.com/embeddedos-org/eos/wiki",
    "https://github.com/orgs/embeddedos-org/discussions",
    "https://discord.gg/n6Kd9fwja",
    "https://github.com/embeddedos-org/eos/issues",
    "https://github.com/orgs/embeddedos-org/projects",
    "https://github.com/embeddedos-org/eos/blob/master/AGENTS.md",
  ];

  it("publishes the exact repository and organization destinations", () => {
    for (const href of expected) expect(communityDataSource).toContain(href);
    expect(foundationSource).toContain(
      'discord: "https://discord.gg/n6Kd9fwja"'
    );
    expect(communitySource).toContain("SOCIAL_URLS.discord");
    expect(communityDataSource).not.toContain("/agents");
  });

  /**
   * The footer renders these on all 132 prerendered pages, so one unreachable
   * href is 132 broken links. This repository is private: every path under it
   * answers 404 for a logged-out visitor, while looking correct to a signed-in
   * maintainer — which is exactly how `/wiki`, `/issues` and `/blob/master/
   * AGENTS.md` shipped and stayed broken.
   */
  it("links nothing into this repository, which is private", () => {
    const offenders = [...communityDataSource.matchAll(/href: "([^"]+)"/g)]
      .map(m => m[1])
      .filter(href =>
        href.includes("github.com/embeddedos-org/www.embeddedos.org")
      );
    expect(offenders).toEqual([]);
  });

  it("uses the shared destinations in the footer and community page", () => {
    // The footer carries the two contribution links (Discussions, Projects)
    // via FOOTER_COMMUNITY_LINKS; the full list, AGENTS.md included, renders
    // on /community. Both spread the same shared data rather than retyping
    // URLs — one unreachable href would otherwise be 132 broken links.
    expect(footerSource).toContain("...FOOTER_COMMUNITY_LINKS.map");
    expect(footerSource).toContain("COMMUNITY_LINKS.filter");
    expect(communitySource).toContain("COMMUNITY_LINKS.map");
    expect(communityDataSource).toContain("AGENTS.md");
  });
});

describe("footer columns", () => {
  it("has a column for each area of the site", () => {
    for (const heading of [
      "Foundation",
      "News & Stories",
      "Join & Support",
      "Platform",
      "Applications",
      "Resources",
    ]) {
      expect(footerSource).toContain(heading);
    }
  });

  it("keeps every column scannable: six columns, eight links each at most", () => {
    // Ad Grants "clear navigation": the footer ran seven columns and ~90
    // links. A column is the literal block between `  "Name": [` (or
    // `  Name: [`) and the closing `  ],` at the same indent.
    const start = footerSource.indexOf("const FOOTER_LINKS = {");
    const end = footerSource.indexOf("\n};", start);
    const block = footerSource.slice(start, end);
    const columns = [
      ...block.matchAll(
        /^[ ]{2}(?:"[^"]+"|[\w &]+): \[$([\s\S]*?)^[ ]{2}\],/gm
      ),
    ];
    expect(columns.length).toBeLessThanOrEqual(6);
    expect(columns.length).toBeGreaterThan(0);
    for (const col of columns) {
      const count =
        (col[1].match(/\{ name:/g) ?? []).length +
        (col[1].includes("FOOTER_COMMUNITY_LINKS") ? 2 : 0);
      expect(count, `footer column has ${count} links`).toBeLessThanOrEqual(8);
    }
  });

  it("keeps the published legal address readable", () => {
    expect(footerSource).toMatch(
      /<address className="[^"]*text-white\/60[^"]*"/
    );
  });

  it("publishes the policy pages in the bottom bar", () => {
    for (const href of ["/privacy", "/terms", "/licenses", "/security"]) {
      expect(legalHrefs).toContain(href);
    }
  });

  it("lists no raw route twice within the footer", () => {
    const all = [...footerHrefs, ...legalHrefs];
    const counts = new Map<string, number>();
    for (const href of all) counts.set(href, (counts.get(href) ?? 0) + 1);

    const dupes = [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([href, count]) => `${href} (${count})`);

    expect(dupes, "duplicate footer hrefs before deduplication").toEqual([]);
  });
});
