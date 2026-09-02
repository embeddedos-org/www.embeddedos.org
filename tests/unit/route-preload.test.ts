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

/**
 * Route paths registered for preloading.
 *
 * Two forms count. `lazyPage("/x", ...)` registers its own path; the optional
 * third argument registers aliases, which is how one component can serve
 * several concrete URLs — the article page serves eight. An alias needs a
 * loader entry of its own because preloadRoute() keys the registry by exact
 * pathname, so omitting one costs that URL its synchronous hydration.
 *
 * The generic parameter in `lazyPage<{ slug?: string }>(` is optional and must
 * not defeat the match.
 */
function registeredRoutes(): string[] {
  const direct = [
    ...source.matchAll(/=\s*lazyPage(?:<[^>]*>)?\(\s*"([^"]+)"/g),
  ].map(m => m[1]);
  const aliasBlocks = [
    ...source.matchAll(/lazyPage(?:<[^>]*>)?\([\s\S]*?\)\s*;/g),
  ].map(m => m[0]);
  const aliases: string[] = [];
  for (const block of aliasBlocks) {
    const arrays = [...block.matchAll(/\[([\s\S]*?)\]/g)].map(m => m[1]);
    for (const arr of arrays) {
      aliases.push(...[...arr.matchAll(/"(\/[^"]*)"/g)].map(m => m[1]));
    }
  }
  // An identifier passed as the alias list, e.g. `ARTICLE_PATHS`, is declared
  // as a const array elsewhere in the file; collect those too.
  for (const m of source.matchAll(
    /const\s+([A-Z_]+)\s*=\s*\[([\s\S]*?)\]\s*as const;/g
  )) {
    if (!source.includes(`${m[1]}\n)`) && !source.includes(`${m[1]}
)`)) continue;
    aliases.push(...[...m[2].matchAll(/"(\/[^"]*)"/g)].map(x => x[1]));
  }
  return [...new Set([...direct, ...aliases])];
}

/** Route paths whose JSX body renders a component inside a Suspense boundary. */
function codeSplitRouteBlocks(): string[] {
  return [
    ...source.matchAll(
      // The component may take props: <ArticlePage slug="..." />.
      /<Route\s+path="([^"]+)">\s*<Suspense\b[\s\S]*?>\s*<\w+(?:\s[^>]*?)?\s*\/>/g
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
