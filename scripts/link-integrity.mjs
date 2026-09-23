import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const JSON_OUT = process.argv.includes("--json");
const flagIndex = process.argv.indexOf("--concurrency");
const CONCURRENCY =
  flagIndex === -1 ? 6 : Math.max(1, Number(process.argv[flagIndex + 1]) || 6);
const TIMEOUT_MS = 2e4;
const UA = "EmbeddedOS-site-link-integrity (+https://www.embeddedos.org)";
const KNOWN_CAUSE = [
  [
    /^https:\/\/github\.com\/embeddedos-org\/www\.embeddedos\.org(\/|$)/,
    "the website repository is private, so this 404s for every signed-out visitor and for Googlebot",
  ],
  [
    /^https:\/\/github\.com\/embeddedos-org\/eos-stack-manifest(\/|$)/,
    "no repository of this name exists in the organization",
  ],
];
const causeOf = url => KNOWN_CAUSE.find(([re]) => re.test(url))?.[1] ?? "";
const BOT_HOSTILE = /* @__PURE__ */ new Map([
  [
    "apps.irs.gov",
    "IRS Tax Exempt Organization Search blocks non-browser clients; the page loads normally for a visitor.",
  ],
]);
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
const targets = /* @__PURE__ */ new Map();
for (const file of documents()) {
  const route = "/" + path.relative(DIST, file).replace(/\/?index\.html$/, "");
  const html = fs.readFileSync(file, "utf8");
  for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
    const href = tag[0].match(/\bhref="(https?:\/\/[^"]+)"/)?.[1];
    if (!href) continue;
    const url = href.replace(/&amp;/g, "&");
    if (!targets.has(url)) targets.set(url, /* @__PURE__ */ new Set());
    targets.get(url).add(route);
  }
}
async function probe(url) {
  const attempt = async method => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": UA, accept: "*/*" },
      });
      return { status: res.status, finalUrl: res.url };
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    const head = await attempt("HEAD");
    if (head.status === 405 || head.status === 403 || head.status === 404)
      return await attempt("GET");
    return head;
  } catch {
    try {
      return await attempt("GET");
    } catch (retryErr) {
      return { status: 0, error: String(retryErr.message ?? retryErr) };
    }
  }
}
const urls = [...targets.keys()].sort();
const results = [];
let index = 0;
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (index < urls.length) {
      const url = urls[index++];
      const r = await probe(url);
      results.push({
        url,
        status: r.status,
        finalUrl: r.finalUrl ?? null,
        error: r.error ?? null,
        pages: targets.get(url).size,
        sample: [...targets.get(url)].slice(0, 3),
      });
    }
  })
);
results.sort((a, b) => b.pages - a.pages || a.url.localeCompare(b.url));
const botBlocked = results.filter(
  r => r.status === 403 && BOT_HOSTILE.has(new URL(r.url).host)
);
const blockedSet = new Set(botBlocked.map(r => r.url));
const broken = results.filter(
  r => (r.status >= 400 || r.status === 0) && !blockedSet.has(r.url)
);
const redirected = results.filter(
  r =>
    r.status < 400 &&
    r.finalUrl &&
    r.finalUrl.replace(/\/$/, "") !== r.url.replace(/\/$/, "")
);
if (JSON_OUT) {
  console.log(
    JSON.stringify(
      { checked: results.length, broken, redirected, botBlocked, results },
      null,
      1
    )
  );
} else {
  console.log(
    `[integrity] ${results.length} distinct external URLs across the build
`
  );
  if (broken.length) {
    console.log(`UNREACHABLE (${broken.length}):`);
    for (const r of broken)
      console.log(
        `  ${String(r.status || "ERR").padEnd(4)} ${r.url}
       on ${r.pages} page(s): ${r.sample.join(", ")}${
         causeOf(r.url)
           ? `
       cause: ${causeOf(r.url)}`
           : ""
       }${
         r.error
           ? `
       ${r.error}`
           : ""
       }`
      );
    console.log("");
  }
  if (redirected.length) {
    console.log(`REDIRECTED (${redirected.length}):`);
    for (const r of redirected.slice(0, 12))
      console.log(`  ${r.status} ${r.url}
       -> ${r.finalUrl}`);
    if (redirected.length > 12)
      console.log(`  \u2026 ${redirected.length - 12} more`);
    console.log("");
  }
  if (botBlocked.length) {
    console.log(`BOT-BLOCKED, not a defect (${botBlocked.length}):`);
    for (const r of botBlocked)
      console.log(
        `  403 ${r.url}
       ${BOT_HOSTILE.get(new URL(r.url).host)}`
      );
    console.log("");
  }
  console.log(
    `[integrity] ${broken.length} unreachable, ${redirected.length} redirected, ${botBlocked.length} bot-blocked`
  );
}
if (broken.length) process.exitCode = 1;
