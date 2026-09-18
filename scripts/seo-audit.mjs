/**
 * Static SEO audit over the prerendered build.
 *
 * Reads dist/public and reports the defect classes that are checkable without a
 * network: metadata uniqueness and length, heading structure, landmarks,
 * canonical agreement, structured-data validity, social metadata, the internal
 * link graph, and sitemap agreement.
 *
 * Usage: node scripts/seo-audit.mjs [--json] [--strict]
 *   --json    machine-readable report on stdout
 *   --strict  exit 1 when any error-level finding is present
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const ORIGIN = "https://www.embeddedos.org";
const JSON_OUT = process.argv.includes("--json");
const STRICT = process.argv.includes("--strict");

const TITLE_MAX = 70;
const DESC_MIN = 70;
const DESC_MAX = 160;
const DESC_HARD_MAX = 250;

function documents() {
  const out = [];
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") out.push(p);
    }
  };
  walk(DIST);
  return out;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}=("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : null;
}

const decode = s =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const text = html =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function parseDocument(file) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(DIST, file);
  const route = "/" + rel.replace(/\/?index\.html$/, "");
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "";
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map(m => m[0]);
  const metaBy = (key, value) =>
    metas
      .filter(t => (attr(t, key) || "").toLowerCase() === value)
      .map(t => decode(attr(t, "content") ?? ""));
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);

  const ld = [];
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      ld.push({ ok: true, value: JSON.parse(m[1]) });
    } catch (err) {
      ld.push({ ok: false, error: err.message });
    }
  }

  const headings = [
    ...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
  ].map(m => ({ level: Number(m[1]), text: decode(text(m[2])) }));

  const anchors = [...body.matchAll(/<a\b[^>]*>/gi)].map(m => m[0]);
  const hrefs = anchors.map(a => attr(a, "href")).filter(Boolean);
  const images = [...body.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);

  return {
    route,
    file: rel,
    bytes: html.length,
    title: decode(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: metaBy("name", "description"),
    robots: metaBy("name", "robots"),
    canonical: links
      .filter(l => (attr(l, "rel") || "").toLowerCase() === "canonical")
      .map(l => attr(l, "href")),
    og: Object.fromEntries(
      ["og:title", "og:description", "og:url", "og:image", "og:type"].map(k => [
        k,
        metaBy("property", k),
      ])
    ),
    twitter: Object.fromEntries(
      [
        "twitter:card",
        "twitter:title",
        "twitter:description",
        "twitter:image",
      ].map(k => [k, metaBy("name", k)])
    ),
    ld,
    headings,
    h1: headings.filter(h => h.level === 1),
    landmarks: {
      main: (body.match(/<main\b/gi) || []).length,
      nav: (body.match(/<nav\b/gi) || []).length,
      footer: (body.match(/<footer\b/gi) || []).length,
    },
    lang: attr(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang"),
    internal: [
      ...new Set(
        hrefs
          .filter(h => h.startsWith("/") && !h.startsWith("//"))
          .map(h => h.split(/[?#]/)[0].replace(/\/$/, "") || "/")
      ),
    ],
    httpLinks: hrefs.filter(h => /^http:\/\//i.test(h)),
    imagesWithoutAlt: images.filter(t => !/\balt=/i.test(t)).length,
    bodyTextLength: text(body).length,
  };
}

function sitemapRoutes() {
  const f = path.join(DIST, "sitemap.xml");
  if (!fs.existsSync(f)) return null;
  const xml = fs.readFileSync(f, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    m => m[1].replace(ORIGIN, "").replace(/\/$/, "") || "/"
  );
}

export function audit(docs, sitemap) {
  const findings = [];
  const add = (level, check, route, detail) =>
    findings.push({ level, check, route, detail });

  const byValue = (sel, check, level = "error") => {
    const seen = new Map();
    for (const d of docs) {
      const v = sel(d);
      if (!v) continue;
      seen.set(v, [...(seen.get(v) ?? []), d.route]);
    }
    for (const [value, routes] of seen) {
      if (routes.length > 1)
        add(
          level,
          check,
          routes.join(", "),
          `${routes.length}x: ${value.slice(0, 80)}`
        );
    }
  };

  for (const d of docs) {
    if (!d.title) add("error", "title-missing", d.route, "no <title>");
    else if (d.title.length > TITLE_MAX)
      add("warn", "title-long", d.route, `${d.title.length} chars`);

    if (d.description.length === 0)
      add("error", "description-missing", d.route, "no meta description");
    if (d.description.length > 1)
      add(
        "error",
        "description-duplicated-tag",
        d.route,
        `${d.description.length} tags`
      );
    const desc = d.description[0] ?? "";
    if (desc && desc.length > DESC_HARD_MAX)
      add("error", "description-too-long", d.route, `${desc.length} chars`);
    else if (desc && desc.length > DESC_MAX)
      add("warn", "description-long", d.route, `${desc.length} chars`);
    if (desc && desc.length < DESC_MIN)
      add("warn", "description-short", d.route, `${desc.length} chars`);

    if (d.canonical.length === 0)
      add("error", "canonical-missing", d.route, "no rel=canonical");
    if (d.canonical.length > 1)
      add("error", "canonical-multiple", d.route, `${d.canonical.length} tags`);
    const expected = d.route === "/" ? `${ORIGIN}/` : `${ORIGIN}${d.route}`;
    if (d.canonical[0] && d.canonical[0] !== expected)
      add(
        "error",
        "canonical-mismatch",
        d.route,
        `${d.canonical[0]} != ${expected}`
      );

    if (d.h1.length === 0) add("error", "h1-missing", d.route, "no <h1>");
    if (d.h1.length > 1)
      add("error", "h1-multiple", d.route, `${d.h1.length} <h1>`);

    let previous = 0;
    for (const h of d.headings) {
      if (previous && h.level > previous + 1)
        add(
          "error",
          "heading-skip",
          d.route,
          `h${previous} -> h${h.level}: "${h.text.slice(0, 40)}"`
        );
      previous = h.level;
    }

    if (d.landmarks.main !== 1)
      add("error", "landmark-main", d.route, `${d.landmarks.main} <main>`);
    if (!d.lang) add("error", "lang-missing", d.route, "no lang on <html>");

    for (const entry of d.ld)
      if (!entry.ok) add("error", "jsonld-invalid", d.route, entry.error);

    if (!d.og["og:title"][0]) add("warn", "og-title-missing", d.route, "");
    if (!d.og["og:description"][0])
      add("warn", "og-description-missing", d.route, "");
    if (!d.og["og:image"][0]) add("error", "og-image-missing", d.route, "");
    if (!d.og["og:url"][0]) add("warn", "og-url-missing", d.route, "");
    if (!d.twitter["twitter:card"][0])
      add("warn", "twitter-card-missing", d.route, "");
    if (!d.twitter["twitter:title"][0])
      add("warn", "twitter-title-missing", d.route, "");
    if (!d.twitter["twitter:image"][0])
      add("warn", "twitter-image-missing", d.route, "");

    if (d.imagesWithoutAlt)
      add("error", "img-alt-missing", d.route, `${d.imagesWithoutAlt} <img>`);
    for (const u of d.httpLinks) add("warn", "http-link", d.route, u);
  }

  byValue(d => d.title, "title-duplicate");
  byValue(d => d.description[0], "description-duplicate");

  const routes = new Set(docs.map(d => d.route));
  const inbound = new Map([...routes].map(r => [r, 0]));
  for (const d of docs)
    for (const href of d.internal)
      if (inbound.has(href) && href !== d.route)
        inbound.set(href, inbound.get(href) + 1);

  const EXEMPT = new Set(["/404"]);
  for (const [route, count] of inbound)
    if (count === 0 && !EXEMPT.has(route))
      add("error", "orphan-page", route, "no inbound internal link");

  for (const d of docs)
    for (const href of d.internal)
      if (
        !routes.has(href) &&
        !/\.(xml|txt|php|pdf|png|jpe?g|svg|ico|webmanifest|html|webp|avif)$/i.test(
          href
        ) &&
        !href.startsWith("/media/") &&
        !href.startsWith("/assets/") &&
        !href.startsWith("/api/")
      )
        add("error", "internal-link-broken", d.route, href);

  if (sitemap) {
    const set = new Set(sitemap);
    for (const loc of sitemap)
      if (!routes.has(loc))
        add("error", "sitemap-url-not-built", loc, "in sitemap, no page");
    for (const d of docs)
      if (!set.has(d.route) && !EXEMPT.has(d.route) && d.route !== "/404")
        add("warn", "sitemap-missing-page", d.route, "built, not in sitemap");
    if (new Set(sitemap).size !== sitemap.length)
      add("error", "sitemap-duplicate", "-", "duplicate <loc> entries");
  } else {
    add("error", "sitemap-missing", "-", "dist/public/sitemap.xml absent");
  }

  return findings;
}

const docs = documents().map(parseDocument);
const findings = audit(docs, sitemapRoutes());
const errors = findings.filter(f => f.level === "error");
const warnings = findings.filter(f => f.level === "warn");

if (JSON_OUT) {
  console.log(JSON.stringify({ documents: docs.length, findings }, null, 1));
} else {
  const group = list => {
    const by = new Map();
    for (const f of list) by.set(f.check, [...(by.get(f.check) ?? []), f]);
    return [...by.entries()].sort((a, b) => b[1].length - a[1].length);
  };
  console.log(`[seo] ${docs.length} prerendered documents\n`);
  for (const [label, list] of [
    ["ERRORS", errors],
    ["WARNINGS", warnings],
  ]) {
    if (!list.length) continue;
    console.log(`${label} (${list.length}):`);
    for (const [check, items] of group(list)) {
      console.log(`  ${check.padEnd(28)} ${items.length}`);
      for (const i of items.slice(0, 4))
        console.log(`      ${i.route} ${i.detail}`.trimEnd());
      if (items.length > 4) console.log(`      … ${items.length - 4} more`);
    }
    console.log("");
  }
  console.log(`[seo] ${errors.length} errors, ${warnings.length} warnings`);
}

if (STRICT && errors.length) process.exitCode = 1;
