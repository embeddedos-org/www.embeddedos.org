/**
 * Internal link graph over the prerendered build.
 *
 * Distinguishes links in page content from links in the shared header and
 * footer: a route reachable only from the footer is in every page's chrome
 * and carries no topical signal, which is what "weakly connected" means here.
 *
 * Usage: node scripts/link-graph.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const JSON_OUT = process.argv.includes("--json");

const docs = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") docs.push(p);
  }
})(DIST);

const norm = h => h.split(/[?#]/)[0].replace(/\/$/, "") || "/";

const pages = docs.map(file => {
  const html = fs.readFileSync(file, "utf8");
  const route = "/" + path.relative(DIST, file).replace(/\/?index\.html$/, "");
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? "";
  const chrome = html.replace(main, " ");
  const hrefs = src =>
    [...src.matchAll(/<a\b[^>]*href="(\/[^"#?][^"]*|\/)"/g)].map(m =>
      norm(m[1])
    );
  return {
    route,
    contentLinks: [...new Set(hrefs(main))],
    chromeLinks: [...new Set(hrefs(chrome))],
  };
});

const routes = new Set(pages.map(p => p.route));
const contentIn = new Map([...routes].map(r => [r, new Set()]));
const chromeIn = new Map([...routes].map(r => [r, new Set()]));
for (const p of pages) {
  for (const t of p.contentLinks)
    if (routes.has(t) && t !== p.route) contentIn.get(t).add(p.route);
  for (const t of p.chromeLinks)
    if (routes.has(t) && t !== p.route) chromeIn.get(t).add(p.route);
}

const adjacency = new Map(
  pages.map(p => [
    p.route,
    [...new Set([...p.contentLinks, ...p.chromeLinks])].filter(t =>
      routes.has(t)
    ),
  ])
);
const depth = new Map([["/", 0]]);
const queue = ["/"];
while (queue.length) {
  const cur = queue.shift();
  for (const next of adjacency.get(cur) ?? [])
    if (!depth.has(next)) {
      depth.set(next, depth.get(cur) + 1);
      queue.push(next);
    }
}

const report = pages
  .map(p => ({
    route: p.route,
    inboundContent: contentIn.get(p.route).size,
    inboundChrome: chromeIn.get(p.route).size,
    outboundContent: p.contentLinks.filter(t => routes.has(t)).length,
    depth: depth.get(p.route) ?? null,
    orphan:
      contentIn.get(p.route).size === 0 && chromeIn.get(p.route).size === 0,
    contentOnly:
      contentIn.get(p.route).size === 0 && chromeIn.get(p.route).size > 0,
  }))
  .sort(
    (a, b) =>
      a.inboundContent - b.inboundContent || a.route.localeCompare(b.route)
  );

if (JSON_OUT) {
  console.log(
    JSON.stringify({ pages: report.length, routes: report }, null, 1)
  );
} else {
  const orphans = report.filter(r => r.orphan);
  const chromeOnly = report.filter(r => r.contentOnly);
  const unreachable = report.filter(r => r.depth === null);
  const deep = report.filter(r => (r.depth ?? 0) > 2);
  const hubs = [...report]
    .sort((a, b) => b.outboundContent - a.outboundContent)
    .slice(0, 5);

  console.log(`[links] ${report.length} routes\n`);
  console.log(`orphans (no inbound link at all): ${orphans.length}`);
  for (const r of orphans) console.log(`    ${r.route}`);
  console.log(
    `\nreachable only through header/footer chrome: ${chromeOnly.length}`
  );
  for (const r of chromeOnly.slice(0, 40)) console.log(`    ${r.route}`);
  if (chromeOnly.length > 40)
    console.log(`    … ${chromeOnly.length - 40} more`);
  console.log(`\nunreachable from / by links: ${unreachable.length}`);
  console.log(`deeper than 2 clicks: ${deep.length}`);
  console.log(`\nmost outbound content links:`);
  for (const r of hubs)
    console.log(`    ${r.route.padEnd(26)} ${r.outboundContent}`);
  const avg = (
    report.reduce((s, r) => s + r.inboundContent, 0) / report.length
  ).toFixed(1);
  console.log(`\nmean inbound content links per route: ${avg}`);
}
