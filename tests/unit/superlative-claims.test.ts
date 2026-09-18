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
  /\bthe fastest\b/i,
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

const sources = globSync("client/src/**/*.{ts,tsx}", { cwd: root })
  .filter(f => !THIRD_PARTY.has(f))
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
          offenders.push(`${file}: ${line.trim().slice(0, 90)}`);
        }
      }
      expect(offenders).toEqual([]);
    }
  );
});
