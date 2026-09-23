/**
 * Compare the SEO state of two builds.
 *
 * Snapshot a build, change something, snapshot again, and diff — so a pull
 * request can state what it did to titles, descriptions, canonicals, social
 * metadata, structured data and the route set instead of asserting it.
 *
 *   node scripts/seo-diff.mjs --snapshot before.json
 *   node scripts/seo-diff.mjs before.json after.json
 *
 * Exits 1 only when a route disappears or loses its title, description or
 * canonical, which is the change a reviewer must never miss.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);

function snapshot() {
  const raw = execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "seo-audit.mjs"), "--json"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
  const report = JSON.parse(raw);
  const dist = path.join(ROOT, "dist", "public");
  const routes = {};
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") {
        const html = fs.readFileSync(p, "utf8");
        const route =
          "/" + path.relative(dist, p).replace(/\/?index\.html$/, "");
        const meta = re => html.match(re)?.[1] ?? null;
        routes[route] = {
          title: meta(/<title>([\s\S]*?)<\/title>/i),
          description: meta(/<meta name="description" content="([^"]*)"/i),
          canonical: meta(/<link rel="canonical" href="([^"]*)"/i),
          robots: meta(/<meta name="robots" content="([^"]*)"/i),
          ogImage: meta(/<meta property="og:image" content="([^"]*)"/i),
          twitterTitle: meta(/<meta name="twitter:title" content="([^"]*)"/i),
          schemaTypes: [
            ...html.matchAll(
              /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
            ),
          ]
            .map(m => {
              try {
                return JSON.parse(m[1])["@type"];
              } catch {
                return "INVALID";
              }
            })
            .sort(),
          images: (html.match(/<img\b/gi) || []).length,
        };
      }
    }
  };
  walk(dist);
  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of report.findings) counts[f.level]++;
  return { routes, counts };
}

if (args[0] === "--snapshot") {
  const out = args[1];
  if (!out) throw new Error("usage: --snapshot <file>");
  fs.writeFileSync(out, JSON.stringify(snapshot(), null, 1));
  console.log(`[seo-diff] snapshot written to ${out}`);
  process.exit(0);
}

const [beforeFile, afterFile] = args;
if (!beforeFile)
  throw new Error("usage: seo-diff.mjs <before.json> [after.json]");
const before = JSON.parse(fs.readFileSync(beforeFile, "utf8"));
const after = afterFile
  ? JSON.parse(fs.readFileSync(afterFile, "utf8"))
  : snapshot();

const beforeRoutes = Object.keys(before.routes);
const afterRoutes = Object.keys(after.routes);
const added = afterRoutes.filter(r => !before.routes[r]);
const removed = beforeRoutes.filter(r => !after.routes[r]);
const shared = afterRoutes.filter(r => before.routes[r]);

const FIELDS = [
  "title",
  "description",
  "canonical",
  "robots",
  "ogImage",
  "twitterTitle",
  "images",
];
const changes = {};
for (const f of FIELDS) changes[f] = [];
const schemaChanges = [];
const lost = [];

for (const r of shared) {
  const a = before.routes[r];
  const b = after.routes[r];
  for (const f of FIELDS)
    if (String(a[f]) !== String(b[f]))
      changes[f].push({ route: r, from: a[f], to: b[f] });
  if (a.schemaTypes.join(",") !== b.schemaTypes.join(","))
    schemaChanges.push({ route: r, from: a.schemaTypes, to: b.schemaTypes });
  for (const f of ["title", "description", "canonical"])
    if (a[f] && !b[f]) lost.push(`${r} lost its ${f}`);
}

console.log(
  `[seo-diff] ${beforeRoutes.length} -> ${afterRoutes.length} routes\n`
);
console.log(
  `findings   error ${before.counts.error} -> ${after.counts.error}   ` +
    `warn ${before.counts.warn} -> ${after.counts.warn}   ` +
    `info ${before.counts.info} -> ${after.counts.info}\n`
);
if (added.length)
  console.log(`routes added (${added.length}): ${added.join(", ")}`);
if (removed.length)
  console.log(`routes REMOVED (${removed.length}): ${removed.join(", ")}`);
for (const f of FIELDS) {
  const list = changes[f];
  if (!list.length) continue;
  console.log(`\n${f} changed on ${list.length} route(s):`);
  for (const c of list.slice(0, 8))
    console.log(
      `    ${c.route}\n        - ${String(c.from).slice(0, 88)}\n        + ${String(c.to).slice(0, 88)}`
    );
  if (list.length > 8) console.log(`    … ${list.length - 8} more`);
}
if (schemaChanges.length) {
  console.log(`\nstructured data changed on ${schemaChanges.length} route(s):`);
  for (const c of schemaChanges.slice(0, 8))
    console.log(`    ${c.route}  [${c.from}] -> [${c.to}]`);
}
if (
  !added.length &&
  !removed.length &&
  !schemaChanges.length &&
  FIELDS.every(f => !changes[f].length)
)
  console.log("no SEO-visible change");

if (lost.length || removed.length) {
  console.error(`\n[seo-diff] regression:`);
  for (const l of [...removed.map(r => `${r} removed`), ...lost])
    console.error(`    ${l}`);
  process.exitCode = 1;
}
