import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const register = readFileSync(
  path.join(root, "docs/maintainer-decisions.md"),
  "utf8"
);

const CROSS_BRANCH_MARKER = "(not in this branch)";

const citedPaths = [
  ...new Set(
    register
      .split("\n")
      .filter(line => !line.includes(CROSS_BRANCH_MARKER))
      .flatMap(line => [
        ...line.matchAll(/`([^`\s]+\.(?:ts|tsx|mjs|json|md))`/g),
      ])
      .map(m => m[1])
  ),
].filter(p => p.includes("/"));

describe("maintainer decision register", () => {
  it("cites at least one file per decision it asks someone to act on", () => {
    expect(citedPaths.length).toBeGreaterThan(5);
  });

  it.each(citedPaths)("cites a file that exists: %s", cited => {
    expect(existsSync(path.join(root, cited))).toBe(true);
  });

  it("names the scripts it tells the maintainer to run", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    ) as { scripts: Record<string, string> };
    for (const [, script] of [...register.matchAll(/`pnpm ([a-z:]+)/g)])
      expect(Object.keys(pkg.scripts)).toContain(script);
  });
});
