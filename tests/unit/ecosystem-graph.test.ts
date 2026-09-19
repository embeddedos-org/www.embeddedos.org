/**
 * Integrity of docs/ecosystem-graph.json.
 *
 * The graph is only useful if every edge points at a component that exists
 * and every claim carries the quote it came from.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const graph = JSON.parse(
  readFileSync(path.join(root, "docs/ecosystem-graph.json"), "utf8")
) as {
  components: Array<{
    id: string;
    name: string;
    purpose: string;
    repository: string;
    maturity: string;
    maturityEvidence: string;
    sitePage: string | null;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: string;
    evidence: string;
  }>;
  profiles: Array<{ sequence: string[]; evidence: string }>;
};

const ids = new Set(graph.components.map(c => c.id));
const appSource = readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const routes = new Set(
  [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1])
);

const MATURITIES = new Set([
  "Available project",
  "Experimental",
  "Experimental / Research",
  "Early",
  "Planned",
  "Design / Concept",
]);

describe("ecosystem graph", () => {
  it("gives every component a unique id", () => {
    expect(ids.size).toBe(graph.components.length);
  });

  it("points every repository at the embeddedos-org organisation", () => {
    const stray = graph.components
      .map(c => c.repository)
      .filter(r => !/^https:\/\/github\.com\/embeddedos-org\/[\w.-]+$/.test(r));
    expect(stray).toEqual([]);
  });

  it("records a maturity the model recognises, with its evidence", () => {
    const bad = graph.components
      .filter(c => !MATURITIES.has(c.maturity) || !c.maturityEvidence?.trim())
      .map(c => `${c.id} (${c.maturity})`);
    expect(bad).toEqual([]);
  });

  it("resolves every relationship endpoint to a component", () => {
    const dangling = graph.relationships
      .filter(r => !ids.has(r.from) || !ids.has(r.to))
      .map(r => `${r.from} -> ${r.to}`);
    expect(dangling).toEqual([]);
  });

  it("quotes evidence for every relationship", () => {
    const unsourced = graph.relationships
      .filter(r => !r.evidence?.trim())
      .map(r => `${r.from} -> ${r.to}`);
    expect(unsourced).toEqual([]);
  });

  it("resolves every profile step to a component", () => {
    const dangling = graph.profiles.flatMap(p =>
      p.sequence.filter(step => !ids.has(step))
    );
    expect(dangling).toEqual([]);
  });

  it("points every sitePage at a route the router serves", () => {
    const stray = graph.components
      .map(c => c.sitePage)
      .filter((p): p is string => Boolean(p))
      .filter(p => !routes.has(p));
    expect(stray).toEqual([]);
  });

  it("publishes no performance figure", () => {
    const text = JSON.stringify(graph);
    expect(text).not.toMatch(/\b\d+\s?(ns|µs|us|ms)\b/);
  });
});
