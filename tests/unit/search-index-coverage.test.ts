/**
 * Every route the app declares must be reachable through the site's own
 * search. The search index (shared/site-index.ts) is hand-maintained next to
 * App.tsx, and nothing forced the two together — 38 real routes were missing
 * from the index with no test to say so.
 *
 * `/404` is deliberately exempt: an error page must not be a search result.
 * The remaining gap is an explicit pending list below, one entry per route
 * still to index. Each entry carries an expiry date; once it passes, the
 * test fails until the route is indexed or the entry is renewed. Adding the
 * entries is a shared/site-index.ts change (title, path, tags) owned outside
 * this test — the list names exactly what is owed.
 */
import { describe, expect, it } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import { discoverRoutes } from "../../scripts/prerender.mjs";
import { PAGES } from "../../shared/site-index";

/** Routes that exist but are not in the search index yet. */
const PENDING: { path: string; expires: string }[] = [
  { path: "/blog", expires: "2026-10-31" },
  { path: "/publications", expires: "2026-10-31" },
  { path: "/technical-reports", expires: "2026-10-31" },
  { path: "/benchmarks", expires: "2026-10-31" },
  { path: "/press-releases", expires: "2026-10-31" },
  { path: "/newsletter", expires: "2026-10-31" },
  { path: "/case-studies", expires: "2026-10-31" },
  { path: "/member-stories", expires: "2026-10-31" },
  { path: "/product-showcases", expires: "2026-10-31" },
  { path: "/project-showcases", expires: "2026-10-31" },
  { path: "/videos", expires: "2026-10-31" },
  { path: "/podcast", expires: "2026-10-31" },
  { path: "/webinars", expires: "2026-10-31" },
  { path: "/white-papers", expires: "2026-10-31" },
  { path: "/datasets", expires: "2026-10-31" },
  { path: "/research/architecture", expires: "2026-10-31" },
  { path: "/research/security", expires: "2026-10-31" },
  { path: "/research/ai", expires: "2026-10-31" },
  { path: "/research/embedded-systems", expires: "2026-10-31" },
  { path: "/research/rtos", expires: "2026-10-31" },
  { path: "/research/linux", expires: "2026-10-31" },
  { path: "/research/hardware", expires: "2026-10-31" },
  { path: "/research/networking", expires: "2026-10-31" },
  { path: "/programmes", expires: "2026-10-31" },
  { path: "/programmes/ambassador", expires: "2026-10-31" },
  { path: "/programmes/university-program", expires: "2026-10-31" },
  { path: "/programmes/community-meetups", expires: "2026-10-31" },
  { path: "/programmes/conference-presence", expires: "2026-10-31" },
  { path: "/programmes/member-marketing", expires: "2026-10-31" },
  { path: "/programmes/partner-marketing", expires: "2026-10-31" },
  { path: "/programmes/university-collaborations", expires: "2026-10-31" },
  { path: "/programmes/industry-collaborations", expires: "2026-10-31" },
  { path: "/programmes/grants", expires: "2026-10-31" },
  { path: "/brand", expires: "2026-10-31" },
  { path: "/press-kit", expires: "2026-10-31" },
  { path: "/social", expires: "2026-10-31" },
  { path: "/youtube", expires: "2026-10-31" },
  { path: "/article-newsletter-issue-01", expires: "2026-10-31" },
];

const today = () => new Date().toISOString().slice(0, 10);
const livePending = () => PENDING.filter(p => p.expires >= today());

describe("search index covers every route", () => {
  it("indexes every discovered route", () => {
    const routes: string[] = discoverRoutes();
    expect(routes.length).toBeGreaterThan(90);
    const indexed = new Set(PAGES.map(p => p.path));
    const pending = new Set(livePending().map(p => p.path));
    const missing = routes.filter(
      r => r !== "/404" && !indexed.has(r) && !pending.has(r)
    );
    expect(
      missing,
      `routes with no search index entry and no pending entry:\n${missing.join("\n")}`
    ).toEqual([]);
  });

  it("expires pending entries instead of carrying them forever", () => {
    const expired = PENDING.filter(p => p.expires < today());
    expect(
      expired.map(p => p.path),
      "pending search-index entries past their expiry — index the route or renew the entry"
    ).toEqual([]);
  });

  it("drops pending entries once the route is indexed", () => {
    const indexed = new Set(PAGES.map(p => p.path));
    const stale = livePending().filter(p => indexed.has(p.path));
    expect(
      stale.map(p => p.path),
      "pending entries for routes that are indexed now — remove them"
    ).toEqual([]);
  });
});
