/**
 * Static audit of the prerendered build against the Google Ad Grants website
 * policy (support.google.com/nonprofits/answer/1657899).
 *
 * Checks, per page: unique non-empty <title> and meta description, exactly one
 * <h1>, canonical URL, images with alt text, no http:// subresources (mixed
 * content), and enough body text to not read as "thin content".
 *
 * Run with `pnpm audit:site` after a build. Exits non-zero if any hard failure.
 */
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(import.meta.dirname, "..", "dist", "public");
const THIN_TEXT_CHARS = 1200;

function visibleText(html) {
  let body = html.slice(html.indexOf("<body"));
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
  body = body.replace(/<style[\s\S]*?<\/style>/gi, "");
  return body
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const pages = [];
for (const file of fs.globSync("**/index.html", { cwd: DIST })) {
  const abs = path.join(DIST, file);
  const html = fs.readFileSync(abs, "utf8");
  const route = "/" + file.replace(/(^|\/)index\.html$/, "").replace(/\/$/, "");
  pages.push({
    route: route === "/" ? "/" : route,
    file,
    html,
    text: visibleText(html),
  });
}

const failures = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

const attr = (html, re) => html.match(re)?.[1]?.trim() ?? "";
// Compare the human-readable text, not its HTML-escaped form: "&amp;" is one
// character to a reader but five in the attribute.
const unescapeAttr = s =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

for (const p of pages) {
  const title = attr(p.html, /<title>([\s\S]*?)<\/title>/i);
  const desc = unescapeAttr(
    attr(p.html, /<meta\s+name="description"\s+content="([^"]*)"/i)
  );
  const canonical = attr(p.html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const h1s = p.html.match(/<h1\b/gi)?.length ?? 0;

  if (!title) failures.push([p.route, "missing <title>"]);
  if (!desc) failures.push([p.route, "missing meta description"]);
  if (!canonical) failures.push([p.route, "missing canonical"]);
  if (title.length > 70)
    warnings.push([
      p.route,
      `title ${title.length} chars (>70 truncates in SERPs)`,
    ]);
  if (desc && (desc.length < 70 || desc.length > 320))
    warnings.push([p.route, `description ${desc.length} chars (aim 70-320)`]);

  if (h1s === 0) failures.push([p.route, "no <h1>"]);
  if (h1s > 1) warnings.push([p.route, `${h1s} <h1> elements (should be 1)`]);

  if (title)
    (titles.get(title) ?? titles.set(title, []).get(title)).push(p.route);
  if (desc)
    (descriptions.get(desc) ?? descriptions.set(desc, []).get(desc)).push(
      p.route
    );

  // Mixed content is only triggered by *subresources* the browser loads over
  // http:// (scripts, styles, images, iframes). An <a href="http://…"> is an
  // outbound link, not mixed content — flag it separately as a warning.
  const subresources = [
    ...p.html.matchAll(
      /<(?:script|img|iframe|source|video|audio)\b[^>]*\bsrc="(http:\/\/[^"]+)"/gi
    ),
    ...p.html.matchAll(/<link\b[^>]*\bhref="(http:\/\/[^"]+)"/gi),
  ].map(m => m[1]);
  for (const u of subresources) failures.push([p.route, `mixed content: ${u}`]);

  const outboundHttp = [
    ...p.html.matchAll(/<a\b[^>]*\bhref="(http:\/\/[^"]+)"/gi),
  ].map(m => m[1]);
  for (const u of outboundHttp)
    warnings.push([p.route, `outbound http:// link ${u}`]);

  // Images must carry alt text.
  const imgsNoAlt = [...p.html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)]
    .length;
  if (imgsNoAlt) warnings.push([p.route, `${imgsNoAlt} <img> without alt`]);

  if (p.text.length < THIN_TEXT_CHARS)
    warnings.push([
      p.route,
      `thin content: ${p.text.length} chars of visible text`,
    ]);
}

const dupTitles = [...titles.entries()].filter(([, r]) => r.length > 1);
const dupDescs = [...descriptions.entries()].filter(([, r]) => r.length > 1);

console.log(`[audit] ${pages.length} prerendered pages\n`);

if (failures.length) {
  console.log(`FAILURES (${failures.length}):`);
  for (const [route, msg] of failures)
    console.log(`  ✗ ${route.padEnd(34)} ${msg}`);
  console.log("");
}

if (dupTitles.length) {
  console.log(`DUPLICATE TITLES (${dupTitles.length}):`);
  for (const [t, routes] of dupTitles)
    console.log(`  ! "${t.slice(0, 58)}" -> ${routes.join(", ")}`);
  console.log("");
}

if (dupDescs.length) {
  console.log(`DUPLICATE DESCRIPTIONS (${dupDescs.length}):`);
  for (const [d, routes] of dupDescs)
    console.log(`  ! "${d.slice(0, 58)}…" -> ${routes.join(", ")}`);
  console.log("");
}

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const [route, msg] of warnings)
    console.log(`  · ${route.padEnd(34)} ${msg}`);
  console.log("");
}

const textLengths = pages.map(p => p.text.length).sort((a, b) => a - b);
console.log(
  `[audit] visible text: min ${textLengths[0]}, median ${textLengths[Math.floor(textLengths.length / 2)]}, max ${textLengths.at(-1)}`
);
console.log(
  `[audit] ${failures.length} failures · ${dupTitles.length} dup titles · ${dupDescs.length} dup descriptions · ${warnings.length} warnings`
);

if (failures.length || dupTitles.length) process.exitCode = 1;
