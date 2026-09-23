/**
 * Contracts for the hand-written meta descriptions.
 *
 * Every entry must describe one route, be unique, and fit a search snippet.
 * Overrides for routes the router does not serve are dead weight and fail here.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import descriptions from "../../shared/route-descriptions.json";

const root = path.resolve(__dirname, "../..");
const appSource = readFileSource("client/src/App.tsx");

function readFileSource(p: string) {
  return readFileSync(path.join(root, p), "utf8");
}

const routes = new Set(
  [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1])
);

const entries = Object.entries(descriptions as Record<string, string>);

describe("route descriptions", () => {
  it("describes only routes the router serves", () => {
    const stray = entries
      .map(([route]) => route)
      .filter(route => !routes.has(route));
    expect(stray, "descriptions with no matching route").toEqual([]);
  });

  it("fits a search snippet", () => {
    const long = entries
      .filter(([, text]) => text.length > 160)
      .map(([route, text]) => `${route} (${text.length})`);
    expect(long).toEqual([]);
  });

  it("carries enough text to be useful", () => {
    const short = entries
      .filter(([, text]) => text.length < 70)
      .map(([route, text]) => `${route} (${text.length})`);
    expect(short).toEqual([]);
  });

  it("gives every route a distinct description", () => {
    const seen = new Map<string, string[]>();
    for (const [route, text] of entries)
      seen.set(text, [...(seen.get(text) ?? []), route]);
    const duplicated = [...seen.values()].filter(r => r.length > 1);
    expect(duplicated).toEqual([]);
  });

  it("ends as a sentence rather than mid-clause", () => {
    const unterminated = entries
      .filter(([, text]) => !/[.!?]$/.test(text.trim()))
      .map(([route]) => route);
    expect(unterminated).toEqual([]);
  });

  it("is not truncated with an ellipsis", () => {
    const truncated = entries
      .filter(([, text]) => text.includes("…"))
      .map(([route]) => route);
    expect(truncated).toEqual([]);
  });
});
