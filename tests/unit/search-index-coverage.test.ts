/**
 * Every route the app declares must be reachable through the site's own
 * search. The search index (shared/site-index.ts) is hand-maintained next to
 * App.tsx, and nothing forced the two together — 38 real routes were once
 * missing from the index with no test to say so. All of them are indexed now.
 *
 * `/404` is deliberately exempt: an error page must not be a search result.
 * A new route that cannot be indexed straight away goes in the pending list
 * below, with an expiry date; once that passes, the test fails until the route
 * is indexed or the entry is renewed. Indexing is a shared/site-index.ts change
 * (title, path, tags) owned outside this test.
 */
import { describe, expect, it } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import { discoverRoutes, NOINDEX_ROUTES } from "../../scripts/prerender.mjs";
import { PAGES } from "../../shared/site-index";

/** Routes that exist but are not in the search index yet. */
const PENDING: { path: string; expires: string }[] = [];

/**
 * Routes that must never be search results: the 404 page, and the noindex
 * confirmation pages, which open only after a completed action — a result
 * landing on one would thank the visitor for something they never did.
 */
const EXEMPT = new Set<string>(["/404", ...NOINDEX_ROUTES]);

const today = () => new Date().toISOString().slice(0, 10);
const livePending = () => PENDING.filter(p => p.expires >= today());

describe("search index covers every route", () => {
  it("indexes every discovered route", () => {
    const routes: string[] = discoverRoutes();
    expect(routes.length).toBeGreaterThan(90);
    const indexed = new Set(PAGES.map(p => p.path));
    const pending = new Set(livePending().map(p => p.path));
    const missing = routes.filter(
      r => !EXEMPT.has(r) && !indexed.has(r) && !pending.has(r)
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
