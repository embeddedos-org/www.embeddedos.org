import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
const OUT = outFlag === -1 ? null : args[outFlag + 1];
const JSON_ONLY = args.includes("--json");
const FULL = args.includes("--full");

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("[baseline] no build in dist/public — run pnpm build");
  process.exit(2);
}

const br = buf => zlib.brotliCompressSync(buf).length;
const kb = n => +(n / 1024).toFixed(1);
const decode = s =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
const attr = (tag, name) => {
  const m = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i")
  );
  return m ? decode(m[2] ?? m[3] ?? "") : null;
};
const norm = s => decode(s).replace(/\s+/g, " ").trim();

const pages = [];
const walk = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (
      e.name === "index.html" ||
      (dir === DIST && e.name.endsWith(".html"))
    )
      pages.push(p);
  }
};
walk(DIST);

const NOT_A_PAGE = new Set(["/.app-shell", "/404"]);

const routeOf = p => {
  const rel = path.relative(DIST, p);
  if (rel === "index.html") return "/";
  return "/" + rel.replace(/\/?index\.html$/, "").replace(/\.html$/, "");
};

const CHROME_TAGS = /<(header|footer|nav)\b[^>]*>[\s\S]*?<\/\1>/gi;

const routes = {};
for (const file of pages) {
  const raw = fs.readFileSync(file);
  const html = raw.toString("utf8");
  const route = routeOf(file);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const main = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const contentOnly = body.replace(CHROME_TAGS, "");

  const metaTags = [...head.matchAll(/<meta\b[^>]*>/gi)].map(m => m[0]);
  const metaContent = (k, v) => {
    const t = metaTags.find(t => (attr(t, k) ?? "").toLowerCase() === v);
    return t ? attr(t, "content") : null;
  };

  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const anchors = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
    m => ({ tag: `<a${m[1]}>`, text: norm(m[2].replace(/<[^>]*>/g, "")) })
  );
  const links = anchors.map(a => a.tag);
  const contentLinks = [...contentOnly.matchAll(/<a\b[^>]*>/gi)].map(m => m[0]);

  const hrefs = links.map(a => attr(a, "href")).filter(Boolean);
  const internal = hrefs.filter(h => h.startsWith("/") && !h.startsWith("//"));
  const external = hrefs.filter(h => /^https?:\/\//i.test(h));

  const ld = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
    ),
  ]
    .map(m => {
      try {
        const j = JSON.parse(m[1]);
        return Array.isArray(j) ? j.map(x => x["@type"]) : [j["@type"]];
      } catch {
        return ["INVALID"];
      }
    })
    .flat();

  const headings = [
    ...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
  ].map(m => ({ level: +m[1], text: norm(m[2].replace(/<[^>]*>/g, "")) }));

  const textLen = norm(
    main.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, "")
  ).length;

  routes[route] = {
    bytes: raw.length,
    brotli: br(raw),
    title: norm(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: metaContent("name", "description"),
    canonical: (() => {
      const m = head.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i);
      return m ? attr(m[0], "href") : null;
    })(),
    robots: metaContent("name", "robots"),
    viewport: metaContent("name", "viewport"),
    charset: /<meta[^>]*charset/i.test(head),
    lang: attr(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang"),
    og: {
      title: metaContent("property", "og:title"),
      description: metaContent("property", "og:description"),
      image: metaContent("property", "og:image"),
      url: metaContent("property", "og:url"),
      type: metaContent("property", "og:type"),
    },
    twitter: {
      card: metaContent("name", "twitter:card"),
      title: metaContent("name", "twitter:title"),
      description: metaContent("name", "twitter:description"),
      image: metaContent("name", "twitter:image"),
    },
    schemaTypes: ld.sort(),
    headings: headings.map(h => h.level),
    h1Count: headings.filter(h => h.level === 1).length,
    landmarks: {
      main: /<main\b/i.test(body),
      header: /<header\b/i.test(body),
      footer: /<footer\b/i.test(body),
      nav: /<nav\b/i.test(body),
    },
    images: {
      total: imgs.length,
      missingAlt: imgs.filter(t => attr(t, "alt") === null).length,
      emptyAlt: imgs.filter(t => attr(t, "alt") === "").length,
      missingDims: imgs.filter(t => !attr(t, "width") || !attr(t, "height"))
        .length,
      lazy: imgs.filter(t => (attr(t, "loading") ?? "") === "lazy").length,
    },
    links: {
      total: links.length,
      internal: internal.length,
      external: external.length,
      contentLinks: contentLinks.length,
      genericAnchors: anchors.filter(a =>
        /^(click here|here|read more|learn more|more|link|this|go)$/i.test(
          a.text
        )
      ).length,
      weakAnchorTexts: [
        ...new Set(
          anchors
            .filter(a =>
              /^(click here|here|read more|learn more|more|link|this|go)$/i.test(
                a.text
              )
            )
            .map(a => a.text)
        ),
      ],
    },
    internalTargets: [
      ...new Set(internal.map(h => h.split("#")[0].replace(/\/$/, "") || "/")),
    ],
    contentTargets: [
      ...new Set(
        contentLinks
          .map(a => attr(a, "href"))
          .filter(h => h && h.startsWith("/") && !h.startsWith("//"))
          .map(h => h.split("#")[0].replace(/\/$/, "") || "/")
      ),
    ],
    mainTextChars: textLen,
    hasNoscriptContent: /<noscript\b/i.test(body),
  };
}

const assetsDir = path.join(DIST, "assets");
const assets = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).map(f => {
      const buf = fs.readFileSync(path.join(assetsDir, f));
      return { file: f, bytes: buf.length, brotli: br(buf) };
    })
  : [];
const sumBr = re =>
  assets.filter(a => re.test(a.file)).reduce((n, a) => n + a.brotli, 0);

const homepage = routes["/"];
const criticalPath =
  sumBr(/^index-.*\.js$/) +
  sumBr(/^vendor-.*\.js$/) +
  sumBr(/^index-.*\.css$/) +
  (homepage?.brotli ?? 0);

const depth = (() => {
  const adj = new Map(
    Object.entries(routes).map(([r, v]) => [r, v.internalTargets])
  );
  const d = new Map([["/", 0]]);
  const q = ["/"];
  while (q.length) {
    const cur = q.shift();
    for (const next of adj.get(cur) ?? []) {
      if (!routes[next] || d.has(next)) continue;
      d.set(next, d.get(cur) + 1);
      q.push(next);
    }
  }
  return d;
})();

const inbound = new Map(Object.keys(routes).map(r => [r, 0]));
const contentInbound = new Map(Object.keys(routes).map(r => [r, 0]));
for (const [r, v] of Object.entries(routes)) {
  for (const t of v.internalTargets)
    if (t !== r && inbound.has(t)) inbound.set(t, inbound.get(t) + 1);
  for (const t of v.contentTargets)
    if (t !== r && contentInbound.has(t))
      contentInbound.set(t, contentInbound.get(t) + 1);
}

const dupGroups = key => {
  const by = new Map();
  for (const [r, v] of Object.entries(routes)) {
    const k = (v[key] ?? "").toLowerCase().trim();
    if (!k) continue;
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(r);
  }
  return [...by.values()].filter(g => g.length > 1);
};

const sitemapPath = path.join(DIST, "sitemap.xml");
const sitemapUrls = fs.existsSync(sitemapPath)
  ? [
      ...fs.readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
    ].map(m => m[1])
  : [];
const robotsTxt = fs.existsSync(path.join(DIST, "robots.txt"))
  ? fs.readFileSync(path.join(DIST, "robots.txt"), "utf8")
  : null;

const all = Object.values(routes);
const sum = f => all.reduce((n, r) => n + f(r), 0);
const largest = Object.entries(routes)
  .sort((a, b) => b[1].brotli - a[1].brotli)
  .slice(0, 8)
  .map(([r, v]) => ({ route: r, brotliKB: kb(v.brotli) }));

const schemaCoverage = {};
for (const v of all)
  for (const t of new Set(v.schemaTypes))
    schemaCoverage[t] = (schemaCoverage[t] ?? 0) + 1;

const baseline = {
  capturedFrom: "dist/public",
  counts: {
    htmlDocuments: pages.length,
    routes: Object.keys(routes).length,
    sitemapUrls: sitemapUrls.length,
    assets: assets.length,
  },
  bytes: {
    criticalPathBrotliKB: kb(criticalPath),
    criticalPathBudgetKB: 260,
    homepageHtmlBrotliKB: kb(homepage?.brotli ?? 0),
    entryJsBrotliKB: kb(sumBr(/^index-.*\.js$/)),
    vendorJsBrotliKB: kb(sumBr(/^vendor-.*\.js$/)),
    cssBrotliKB: kb(sumBr(/\.css$/)),
    totalJsBrotliKB: kb(sumBr(/\.js$/)),
    largestPages: largest,
  },
  metadata: {
    withTitle: all.filter(r => r.title).length,
    withDescription: all.filter(r => r.description).length,
    withCanonical: all.filter(r => r.canonical).length,
    withRobots: all.filter(r => r.robots).length,
    withViewport: all.filter(r => r.viewport).length,
    withCharset: all.filter(r => r.charset).length,
    withLang: all.filter(r => r.lang).length,
    duplicateTitleGroups: dupGroups("title").length,
    duplicateDescriptionGroups: dupGroups("description").length,
    descriptionLengths: (() => {
      const l = all
        .map(r => (r.description ?? "").length)
        .filter(Boolean)
        .sort((a, b) => a - b);
      return {
        min: l[0] ?? 0,
        median: l[Math.floor(l.length / 2)] ?? 0,
        max: l.at(-1) ?? 0,
        over160: l.filter(x => x > 160).length,
      };
    })(),
    titleLengths: (() => {
      const l = all
        .map(r => r.title.length)
        .filter(Boolean)
        .sort((a, b) => a - b);
      return {
        min: l[0] ?? 0,
        median: l[Math.floor(l.length / 2)] ?? 0,
        max: l.at(-1) ?? 0,
        over70: l.filter(x => x > 70).length,
      };
    })(),
  },
  social: {
    withOgTitle: all.filter(r => r.og.title).length,
    withOgDescription: all.filter(r => r.og.description).length,
    withOgImage: all.filter(r => r.og.image).length,
    withOgUrl: all.filter(r => r.og.url).length,
    withTwitterCard: all.filter(r => r.twitter.card).length,
    withTwitterImage: all.filter(r => r.twitter.image).length,
    distinctOgImages: new Set(all.map(r => r.og.image).filter(Boolean)).size,
  },
  structuredData: {
    coverageByType: schemaCoverage,
    pagesWithAnySchema: all.filter(r => r.schemaTypes.length).length,
  },
  images: {
    total: sum(r => r.images.total),
    missingAlt: sum(r => r.images.missingAlt),
    decorativeEmptyAlt: sum(r => r.images.emptyAlt),
    missingDimensions: sum(r => r.images.missingDims),
    lazy: sum(r => r.images.lazy),
    pagesWithImagesMissingDims: all.filter(r => r.images.missingDims > 0)
      .length,
  },
  accessibility: {
    pagesWithMain: all.filter(r => r.landmarks.main).length,
    pagesWithNav: all.filter(r => r.landmarks.nav).length,
    pagesMissingH1: all.filter(r => r.h1Count === 0).length,
    pagesMultipleH1: all.filter(r => r.h1Count > 1).length,
    pagesWithHeadingSkip: all.filter(r => {
      let prev = 1;
      for (const h of r.headings) {
        if (h > prev + 1) return true;
        prev = h;
      }
      return false;
    }).length,
  },
  linkGraph: {
    totalInternalLinks: sum(r => r.links.internal),
    totalExternalLinks: sum(r => r.links.external),
    genericAnchors: sum(r => r.links.genericAnchors),
    orphans: [...inbound.entries()]
      .filter(([r, n]) => n === 0 && r !== "/" && !NOT_A_PAGE.has(r))
      .map(([r]) => r),
    chromeOnly: [...contentInbound.entries()]
      .filter(([r, n]) => n === 0 && r !== "/" && !NOT_A_PAGE.has(r))
      .map(([r]) => r),
    unreachableFromHome: Object.keys(routes).filter(
      r => !depth.has(r) && !NOT_A_PAGE.has(r)
    ),
    depthHistogram: (() => {
      const h = {};
      for (const [, d] of depth) h[d] = (h[d] ?? 0) + 1;
      return h;
    })(),
    deeperThan3: [...depth.entries()].filter(([, d]) => d > 3).map(([r]) => r),
  },
  crawlability: {
    robotsTxtPresent: robotsTxt !== null,
    robotsTxtHasSitemap: /sitemap:/i.test(robotsTxt ?? ""),
    robotsTxtDisallowAll: /disallow:\s*\/\s*$/im.test(robotsTxt ?? ""),
    pagesWithNoindex: all.filter(r => /noindex/i.test(r.robots ?? "")).length,
    sitemapHasLastmod:
      fs.existsSync(sitemapPath) &&
      /<lastmod>/.test(fs.readFileSync(sitemapPath, "utf8")),
    has404Page: fs.existsSync(path.join(DIST, "404.html")),
    manifestPresent: fs.existsSync(path.join(DIST, "site.webmanifest")),
    faviconPresent: fs.existsSync(path.join(DIST, "favicon.ico")),
  },
  javascriptDependence: {
    medianMainTextChars: (() => {
      const l = all.map(r => r.mainTextChars).sort((a, b) => a - b);
      return l[Math.floor(l.length / 2)] ?? 0;
    })(),
    pagesWithEmptyMain: all.filter(r => r.mainTextChars < 200).length,
    pagesWithNoscript: all.filter(r => r.hasNoscriptContent).length,
  },
  routes,
};

if (OUT) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const { routes: perRoute, ...summary } = baseline;
  fs.writeFileSync(
    OUT,
    JSON.stringify(FULL ? { ...summary, routes: perRoute } : summary, null, 1)
  );
}
if (JSON_ONLY) {
  console.log(JSON.stringify(baseline, null, 1));
} else {
  const b = baseline;
  console.log(
    `[baseline] ${b.counts.htmlDocuments} documents, ${b.counts.routes} routes\n`
  );
  console.log(
    `  critical path      ${b.bytes.criticalPathBrotliKB} / ${b.bytes.criticalPathBudgetKB} KB brotli`
  );
  console.log(
    `  entry / vendor js  ${b.bytes.entryJsBrotliKB} / ${b.bytes.vendorJsBrotliKB} KB`
  );
  console.log(`  css                ${b.bytes.cssBrotliKB} KB`);
  console.log(
    `  largest page       ${b.bytes.largestPages[0].route} ${b.bytes.largestPages[0].brotliKB} KB`
  );
  console.log(
    `\n  titles/descriptions ${b.metadata.withTitle}/${b.metadata.withDescription} of ${b.counts.routes}`
  );
  console.log(
    `  duplicate title groups        ${b.metadata.duplicateTitleGroups}`
  );
  console.log(
    `  duplicate description groups  ${b.metadata.duplicateDescriptionGroups}`
  );
  console.log(
    `  description len min/med/max   ${b.metadata.descriptionLengths.min}/${b.metadata.descriptionLengths.median}/${b.metadata.descriptionLengths.max}`
  );
  console.log(`\n  og:image distinct   ${b.social.distinctOgImages}`);
  console.log(
    `  schema pages        ${b.structuredData.pagesWithAnySchema}  types ${JSON.stringify(b.structuredData.coverageByType)}`
  );
  console.log(
    `\n  images              ${b.images.total} total, ${b.images.missingAlt} no alt, ${b.images.missingDimensions} no dimensions`
  );
  console.log(`  orphans             ${b.linkGraph.orphans.length}`);
  console.log(`  chrome-only         ${b.linkGraph.chromeOnly.length}`);
  console.log(
    `  depth histogram     ${JSON.stringify(b.linkGraph.depthHistogram)}`
  );
  console.log(`  generic anchors     ${b.linkGraph.genericAnchors}`);
  console.log(
    `\n  empty <main>        ${b.javascriptDependence.pagesWithEmptyMain}`
  );
  if (OUT) console.log(`\n[baseline] written to ${OUT}`);
}
