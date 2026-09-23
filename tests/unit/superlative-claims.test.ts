/**
 * Unsupported superlatives about EmbeddedOS's own software.
 *
 * docs/unverified-claims.md retired the achieved-performance numbers on these
 * pages; comparative superlatives are the same claim in words. A phrase here
 * needs either a published, reproducible measurement or different wording.
 *
 * Scope is the Foundation's own products. Descriptions of third-party tools
 * and literal product names (SiFive HiFive Unmatched) are not covered, and
 * "the best way to …" as navigational guidance is not a product claim.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, globSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");

const BANNED = [
  /\bfastest\b/i,
  /\bbest[- ]in[- ]class\b/i,
  /\bindustry[- ]leading\b/i,
  /\bworld[- ]?class\b/i,
  /\bmost secure\b/i,
  /\brevolutionary\b/i,
  /\bzero[- ]latency\b/i,
];

/**
 * Files describing third-party ecosystems, where a superlative is the upstream
 * project's own wording rather than a Foundation claim. Flagged for maintainer
 * review rather than failed here.
 */
const THIRD_PARTY = new Set(["client/src/pages/Quantum.tsx"]);

/**
 * "Fastest embedded APIs" in these two files is an unsupported product
 * superlative of the same class as C-001, and both files belong to open PR #56,
 * so this branch cannot change them. Recorded in docs/unverified-claims.md.
 * Remove these entries once #56 has landed and the wording is settled.
 */
const BLOCKED_BY_OPEN_PR = new Set([
  "client/src/components/Navbar.tsx",
  "client/src/pages/Projects.tsx",
]);

/**
 * Bounded comparisons, not marketing. Each ranks options inside a list the same
 * page defines — shared memory against SPI/UART/TCP — or labels the quickest of
 * six onboarding paths. Neither claims EmbeddedOS beats anything outside itself.
 */
const BOUNDED_COMPARISON = [
  /shared memory is fastest for same-chip/i,
  /fastest transport for same-core or same-chip/i,
  /badge: "Fastest"/,
  /the fastest route to us is the press inbox/i,
  /the fastest reliable record of what the Foundation has actually done/i,
];

const sources = globSync("client/src/**/*.{ts,tsx}", { cwd: root })
  .filter(f => !THIRD_PARTY.has(f))
  .filter(f => !BLOCKED_BY_OPEN_PR.has(f))
  .filter(f => !f.includes(`${path.sep}ui${path.sep}`));

describe("no unsupported superlatives about EmbeddedOS software", () => {
  it.each(BANNED.map(p => [p.source, p] as const))(
    "does not use %s",
    (_label, pattern) => {
      const offenders: string[] = [];
      for (const file of sources) {
        const text = readFileSync(path.join(root, file), "utf8");
        for (const line of text.split("\n")) {
          if (!pattern.test(line)) continue;
          if (/the (fastest|best) way to\b/i.test(line)) continue;
          if (BOUNDED_COMPARISON.some(ok => ok.test(line))) continue;
          offenders.push(`${file}: ${line.trim().slice(0, 90)}`);
        }
      }
      expect(offenders).toEqual([]);
    }
  );
});
