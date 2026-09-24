/**
 * Generate sitemap.xml from the routes App.tsx actually declares.
 *
 * It was maintained by hand, and by the time this script was written it listed
 * 98 URLs while the app declared 130 — every category page added for the
 * Marketing and Research structure was invisible to search engines, and two
 * tests were failing to say so.
 *
 * A hand-kept sitemap drifts because nothing forces the two lists together at
 * the moment a route is added. Generating it removes that class of bug rather
 * than fixing one instance of it. The route list comes from the same
 * `discoverRoutes()` the prerenderer uses, so a page that is prerendered and a
 * page that is listed for crawlers cannot disagree. discoverRoutes() strips
 * JS/JSX comments before scraping, so a commented-out Route literal is not
 * listed here either.
 *
 * The sitemap intentionally omits <lastmod>: the route set is generated from
 * discoverRoutes(), but the source file lives under source control and there
 * is no tracked per-route modification date. Stamping it with the build date
 * tells crawlers the entire site changed daily, which is false and is treated
 * as noise — Google works fine without lastmod.
 *
 * Usage: node scripts/gen-sitemap.mjs [--dist] [--check]
 *   --dist   write the current build's sitemap directly to dist/public
 *   --check  exit 1 if the selected sitemap is stale, without rewriting it
 *
 * The normal source command keeps client/public/sitemap.xml reviewable. The
 * production build passes --dist after prerendering so it does not modify a
 * tracked source file and the deployed sitemap describes that exact build.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { discoverRoutes } from "./prerender.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_OUT = path.join(ROOT, "client", "public", "sitemap.xml");
const DIST = path.join(ROOT, "dist", "public");
const DIST_OUT = path.join(DIST, "sitemap.xml");
const WRITE_DIST = process.argv.includes("--dist");
const OUT = WRITE_DIST ? DIST_OUT : SOURCE_OUT;
const ORIGIN = "https://www.embeddedos.org";

/**
 * How often a crawler should come back, and how much the page matters
 * relative to the rest of the site. Ordered most specific first — the first
 * matching rule wins.
 */
const RULES = [
  { test: p => p === "/", changefreq: "weekly", priority: "1.0" },
  {
    test: p => p === "/news" || p === "/blog",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    test: p => p.startsWith("/article"),
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    test: p => p.startsWith("/programmes/"),
    changefreq: "monthly",
    priority: "0.5",
  },
  {
    test: p => p.startsWith("/research/"),
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    test: p => p.startsWith("/product"),
    changefreq: "monthly",
    priority: "0.7",
  },
  { test: () => true, changefreq: "monthly", priority: "0.7" },
];

function ruleFor(p) {
  return RULES.find(r => r.test(p));
}

function build() {
  // Sorted so the file has a stable order and a diff shows real changes rather
  // than the order Vite happened to walk the routes in.
  // /404 is a real route but must never be in a sitemap: submitting an error
  // page for indexing invites it into search results, where it is the worst
  // possible landing page.
  const EXCLUDE = new Set(["/404"]);
  const routes = discoverRoutes()
    .filter(r => !EXCLUDE.has(r))
    .sort();
  const body = routes
    .map(route => {
      const { changefreq, priority } = ruleFor(route);
      const loc = route === "/" ? `${ORIGIN}/` : `${ORIGIN}${route}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const xml = build();

if (WRITE_DIST && !fs.existsSync(DIST)) {
  console.error(
    `[sitemap] ${DIST} does not exist. Run the client build and prerender first.`
  );
  process.exit(1);
}

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  // Compare the URL set rather than the bytes: a rewrite with the same route
  // set should not read as a change.
  const locs = s =>
    [...s.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort();
  const a = locs(current);
  const b = locs(xml);
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    const missing = b.filter(x => !a.includes(x));
    const stray = a.filter(x => !b.includes(x));
    console.error("[sitemap] stale.");
    if (missing.length)
      console.error(
        `  missing ${missing.length}: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " …" : ""}`
      );
    if (stray.length)
      console.error(
        `  stray ${stray.length}: ${stray.slice(0, 5).join(", ")}${stray.length > 5 ? " …" : ""}`
      );
    console.error(
      `  run: ${WRITE_DIST ? "pnpm sitemap:dist" : "pnpm sitemap"}`
    );
    process.exit(1);
  }
  console.log(`[sitemap] up to date — ${b.length} URLs`);
} else {
  fs.writeFileSync(OUT, xml);
  console.log(`[sitemap] wrote ${OUT} — ${xml.match(/<loc>/g).length} URLs`);
}
