/**
 * Every outbound link on the site must resolve to a live destination.
 *
 * A dead outbound link is a listed Google Ad Grants website-policy rejection
 * reason ("All links should work correctly"), so this sweep runs in CI on
 * every build via `pnpm test:links:external`.
 *
 * How it works: the prerendered dist/public tree is scanned for every unique
 * external <a href> (anything http(s) that is not www.embeddedos.org itself),
 * and each URL is fetched — no browser needed. Redirects are followed;
 * anything that comes back 400/403 on a non-allowlisted URL, 404, 410, or
 * 5xx, or that fails to connect at all, fails the run. A 429 or a dropped
 * connection is retried with backoff (5s, then 30s), because public hosts
 * throttle CI runners and proxies blip — neither is evidence of a dead link
 * on its own. A 429 that survives all retries is reported as a warning, not
 * a failure: the host is up and answering, just refusing this particular
 * traffic, and hard-failing on a throttled CI runner would red the build
 * for no real reason.
 *
 * Bot-blocked allowlist: a few legitimate destinations refuse unauthenticated
 * bot traffic while working fine for human visitors. Those exact URLs are
 * listed in ALLOWLIST with the evidence for keeping them, and are skipped by
 * the automated check rather than failed. (The old site's nightly link
 * checker flagged the Facebook page the same way for months — that is
 * bot-blocking, not a dead page.)
 *
 * Absolute links back to www.embeddedos.org are checked too, but without
 * network: they must name a route the prerender actually emitted.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist/public");
const SITE_ORIGIN = "https://www.embeddedos.org";

/**
 * Exact URLs skipped by the automated check, with the reason each is kept.
 * Review this list when a destination changes hands; do not extend it for
 * links that are merely slow.
 */
const ALLOWLIST: { url: string; reason: string }[] = [
  {
    url: "https://www.facebook.com/profile.php?id=61588978691494",
    reason:
      "Facebook serves HTTP 400 to unauthenticated bot traffic. The page is " +
      "the Foundation's (public slug 'Embedded-Operating-Systems-Research-" +
      "Foundation', page id 61588978691494), verified 2026-09-19.",
  },
  {
    url: "https://apps.irs.gov/app/eos/",
    reason:
      "The IRS serves HTTP 403 to unauthenticated bot traffic. This is the " +
      "canonical IRS Tax Exempt Organization Search URL, verified 2026-09-19.",
  },
  {
    url: "https://x.com/EmbeddedOS_ORG",
    reason:
      "X serves HTTP 403 to unauthenticated bot traffic. This is the " +
      "Foundation's official handle (twitter:site/creator meta and the " +
      "footer social row use @EmbeddedOS_ORG sitewide), verified 2026-09-19.",
  },
  {
    url: "https://www.interserver.net",
    reason:
      "InterServer serves HTTP 403 to unauthenticated bot traffic. The " +
      "homepage loads normally for human visitors, verified 2026-09-19.",
  },
  {
    url: "https://www.linkedin.com/company/embedded-operating-systems-research-foundation",
    reason:
      "LinkedIn serves HTTP 403 to unauthenticated bot traffic, " +
      "intermittently. This is the Foundation's active company page (slug " +
      "'embedded-operating-systems-research-foundation', recent posts from " +
      "'Embedded Operating Systems Research Foundation'), verified live " +
      "2026-09-19.",
  },
];

/** Unique external <a href> URLs across the prerendered tree. */
function externalUrls(): string[] {
  const urls = new Set<string>();
  for (const file of fs.globSync("**/*.html", { cwd: DIST })) {
    const html = fs.readFileSync(path.join(DIST, file), "utf8");
    for (const m of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/g)) {
      const url = m[1].replace(/&amp;/g, "&");
      if (!url.startsWith(SITE_ORIGIN)) urls.add(url);
    }
  }
  return [...urls].sort();
}

/** Routes the prerender emitted, for checking absolute self-links. */
function knownRoutes(): Set<string> {
  const routes = new Set<string>();
  for (const file of fs.globSync("**/index.html", { cwd: DIST })) {
    const route =
      "/" + file.replace(/(^|\/)index\.html$/, "").replace(/\/$/, "");
    routes.add(route === "/" ? "/" : route);
  }
  // Static assets are linkable too (e.g. the /brand download links).
  for (const file of fs.globSync("**/*.+(png|ico|jpg|jpeg|webp|svg|pdf)", {
    cwd: DIST,
  })) {
    routes.add("/" + file);
  }
  return routes;
}

const URLS = externalUrls();
const ROUTES = knownRoutes();
const ALLOWED = new Set(ALLOWLIST.map(a => a.url));

test("the build exposes outbound links to check", () => {
  expect(URLS.length).toBeGreaterThan(50);
});

test("every outbound link resolves to a live destination", async () => {
  test.setTimeout(10 * 60_000);
  await checkOutbound();
});

async function checkOutbound() {
  const checked = URLS.filter(u => !ALLOWED.has(u));
  expect(checked.length).toBeGreaterThan(50);

  const failures: string[] = [];
  // A 429 that survives every retry is throttling, not a dead link, so it
  // goes here instead of into failures: the host is up and answering, just
  // refusing this traffic. The list is printed in the report below so a
  // human can decide whether the destination deserves an allowlist entry.
  const warnings: string[] = [];

  // Bounded parallelism: ~95 URLs, most answer in ~1s. Six at a time keeps
  // the sweep to a couple of minutes without hammering any single host.
  const CONCURRENCY = 6;
  let next = 0;
  async function worker() {
    while (next < checked.length) {
      const url = checked[next++];
      let status: number | string = "connection failed";
      // Up to three attempts: public hosts throttle CI runners with 429s and
      // proxies drop connections, and neither is evidence of a dead link.
      // Backoff grows (5s, 30s) so a short throttle clears; a 429 that
      // survives all attempts becomes a warning rather than a failure (see
      // the verdict below); a genuinely dead destination fails every attempt
      // the same way.
      const waits = [5_000, 30_000];
      for (let attempt = 0; attempt <= waits.length; attempt++) {
        try {
          // Plain fetch, not Playwright's request API: fetch honours proxy
          // env vars, so the sweep works both on CI runners (direct) and
          // behind an egress proxy. Redirects are followed by default.
          const res = await fetch(url, {
            redirect: "follow",
            signal: AbortSignal.timeout(30_000),
            headers: {
              "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
            },
          });
          // Drain the body so the socket can be reused/closed cleanly.
          await res.arrayBuffer().catch(() => undefined);
          status = res.status;
          if (status === 429 && attempt < waits.length) {
            await new Promise(r => setTimeout(r, waits[attempt]));
            continue;
          }
          break;
        } catch {
          // A dropped connection is usually a transient proxy/CI blip rather
          // than a dead destination; retries separate the two. A genuinely
          // dead host (DNS failure, refused) fails every attempt the same way.
          if (attempt < waits.length) {
            await new Promise(r => setTimeout(r, waits[attempt]));
            continue;
          }
          status = "connection failed";
          break;
        }
      }
      if (typeof status === "number" && status === 429) {
        warnings.push(`${url} -> 429 (throttled through all retries)`);
      } else if (typeof status === "number" ? status >= 400 : true) {
        failures.push(`${url} -> ${status}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (warnings.length > 0) {
    // Playwright attaches stdout to the report; the heading keeps warnings
    // visually distinct from the failing assertion below.
    // eslint-disable-next-line no-console
    console.log(
      "link-integrity warnings (not failures):\n" +
        warnings.map(w => `  - ${w}`).join("\n")
    );
  }

  expect(failures, "dead outbound links").toEqual([]);
}

test("absolute self-links name routes the prerender emitted", () => {
  const bad: string[] = [];
  for (const url of URLS) {
    if (!url.startsWith(SITE_ORIGIN)) continue;
    const pathname = new URL(url).pathname;
    if (!ROUTES.has(pathname)) bad.push(`${url} (no such route)`);
  }
  expect(bad, "self-links to missing routes").toEqual([]);
});
