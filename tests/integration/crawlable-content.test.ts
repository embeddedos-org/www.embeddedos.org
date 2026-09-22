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
    route: "/faq",
    source: "client/src/pages/FAQ.tsx",
    pattern: /\ba:\s*"([^"]{20,})"/g,
    label: "answers",
    panels: 0,
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

  it("/faq keeps every answer in the DOM, collapsed, behind a wired disclosure button", () => {
    const main = mainOf("/faq");
    const answers = (main.match(/id="faq-answer-\d+"/g) ?? []).length;
    const hidden = (main.match(/id="faq-answer-\d+"[^>]*hidden/g) ?? []).length;
    const buttons = (main.match(/aria-controls="faq-answer-\d+"/g) ?? [])
      .length;
    expect(answers).toBeGreaterThanOrEqual(15);
    expect(hidden).toBe(answers);
    expect(buttons).toBe(answers);
    expect(main).toMatch(/aria-expanded="false"/);
  });

  it("/architecture mounts exactly one WebGL canvas", () => {
    const main = mainOf("/architecture");
    expect(main.match(/<canvas/g) ?? []).toHaveLength(1);
  });

  const TABBED = CASES.filter(c => c.panels > 0);

  it.each(TABBED)("$route renders at least $panels panels up front", tc => {
    const main = mainOf(tc.route);
    const panels = (main.match(/role="tabpanel"/g) ?? []).length;
    expect(panels).toBeGreaterThanOrEqual(tc.panels);
  });

  it.each(TABBED)("$route shows exactly one panel and hides the rest", t => {
    const main = mainOf(t.route);
    const panels = (main.match(/role="tabpanel"/g) ?? []).length;
    const hidden = (main.match(/role="tabpanel"[^>]*hidden/g) ?? []).length;
    expect(panels - hidden).toBe(1);
  });

  it.each(TABBED)("$route wires one tab to every panel", testCase => {
    const main = mainOf(testCase.route);
    const panels = (main.match(/role="tabpanel"/g) ?? []).length;
    expect((main.match(/role="tab"/g) ?? []).length).toBe(panels);
    expect(main).toMatch(/aria-controls="/);
    expect(main).toMatch(/aria-selected="/);
  });
});
