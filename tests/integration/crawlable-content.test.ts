import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");

const CASES = [
  {
    route: "/getting-started",
    source: "client/src/pages/GettingStarted.tsx",
    pattern: /title:\s*"([^"]{6,70})"/g,
    label: "onboarding path and step titles",
    panels: 6,
  },
  {
    route: "/architecture",
    source: "client/src/pages/Architecture.tsx",
    pattern: /label: "([^"]{3,40})"/g,
    label: "architecture layer labels",
    panels: 7,
  },
  {
    route: "/eflow",
    source: "client/src/pages/EFlow.tsx",
    pattern: /name:\s*"([^"]{3,40})"/g,
    label: "visual block names",
    panels: 5,
  },
] as const;

const mainOf = (route: string) => {
  const file = path.join(DIST, route.slice(1), "index.html");
  if (!fs.existsSync(file)) throw new Error(`${route} was not built`);
  const html = fs.readFileSync(file, "utf8");
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
};

const textOf = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");

beforeAll(() => {
  if (!fs.existsSync(path.join(DIST, "index.html")))
    throw new Error("run `pnpm build` first");
});

describe("tab panels ship their content in HTML, not only after a click", () => {
  it.each(CASES)("$route exposes every $label", testCase => {
    const declared = new Set(
      [
        ...fs
          .readFileSync(path.join(ROOT, testCase.source), "utf8")
          .matchAll(testCase.pattern),
      ].map(m => m[1])
    );
    const text = textOf(mainOf(testCase.route));
    const missing = [...declared].filter(t => !text.includes(t));
    expect(declared.size).toBeGreaterThan(5);
    expect(missing).toEqual([]);
  });

  it("/architecture mounts exactly one WebGL canvas", () => {
    const main = mainOf("/architecture");
    expect(main.match(/<canvas/g) ?? []).toHaveLength(1);
  });

  it.each(CASES)("$route renders all $panels panels up front", testCase => {
    const main = mainOf(testCase.route);
    expect(main.match(/role="tabpanel"/g) ?? []).toHaveLength(testCase.panels);
  });

  it.each(CASES)(
    "$route hides the inactive panels rather than dropping them",
    t => {
      const main = mainOf(t.route);
      const hidden = (main.match(/role="tabpanel"[^>]*hidden/g) ?? []).length;
      expect(hidden).toBe(t.panels - 1);
    }
  );

  it.each(CASES)("$route wires its tabs to those panels", testCase => {
    const main = mainOf(testCase.route);
    expect(main.match(/role="tab"/g) ?? []).toHaveLength(testCase.panels);
    expect(main).toMatch(/aria-controls="/);
    expect(main).toMatch(/aria-selected="/);
  });
});
