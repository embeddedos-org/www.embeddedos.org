/**
 * The preload registry in App.tsx carries a route path per code-split page, and
 * scripts/prerender.mjs discovers routes from the `Route path` literals in the
 * same file. Those are two hand-maintained lists over one set of routes.
 *
 * If they drift, nothing throws: the route still renders, it just loses its
 * preload and silently goes back to ~300ms of blank <main>. That is invisible
 * in every other test, so it gets its own check here.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const APP_TSX = path.resolve(__dirname, "../../client/src/App.tsx");
const source = fs.readFileSync(APP_TSX, "utf8");

/** Route paths declared as `Route path="..."` JSX literals. */
function declaredRoutes(): string[] {
  return [...source.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1]);
}

/** Route paths registered for preloading via `lazyPage("...", ...)`. */
function registeredRoutes(): string[] {
  return [...source.matchAll(/=\s*lazyPage\(\s*"([^"]+)"/g)].map(m => m[1]);
}

/** Route paths whose JSX body renders a component inside a Suspense boundary. */
function codeSplitRouteBlocks(): string[] {
  return [
    ...source.matchAll(
      /<Route\s+path="([^"]+)">\s*<Suspense\b[\s\S]*?>\s*<\w+\s*\/>/g
    ),
  ].map(m => m[1]);
}

describe("route preload registry", () => {
  it("registers a loader for every code-split route", () => {
    const missing = codeSplitRouteBlocks().filter(
      r => !registeredRoutes().includes(r)
    );
    expect(
      missing,
      `routes rendered under Suspense with no lazyPage() entry`
    ).toEqual([]);
  });

  it("registers no path that is not a real route", () => {
    const declared = declaredRoutes();
    const stray = registeredRoutes().filter(r => !declared.includes(r));
    expect(stray, `lazyPage() paths with no matching Route literal`).toEqual(
      []
    );
  });

  it("registers each path exactly once", () => {
    const seen = new Map<string, number>();
    for (const r of registeredRoutes()) seen.set(r, (seen.get(r) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([r]) => r);
    expect(dupes, "duplicate lazyPage() registrations").toEqual([]);
  });

  it("still exposes the Route literals prerender.mjs scrapes", () => {
    // Guards the inverse failure: a refactor that makes routes data-driven would
    // leave prerender.mjs discovering nothing and ship an unprerendered site.
    expect(declaredRoutes().length).toBeGreaterThanOrEqual(90);
  });
});
