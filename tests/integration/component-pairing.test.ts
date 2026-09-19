import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");

const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/eos", "/product-eos"],
  ["/eboot", "/product-eboot"],
  ["/ebuild", "/product-ebuild"],
  ["/eipc", "/product-eipc"],
  ["/eai", "/product-eai"],
  ["/eni", "/product-eni"],
  ["/edb", "/product-edb"],
  ["/eosim", "/product-eosim"],
  ["/eostudio", "/product-eostudio"],
  ["/eoffice", "/product-eoffice"],
  ["/eapps", "/product-eapps"],
  ["/eserviceapps", "/product-eserviceapps"],
];

const OVERVIEW_ROUTES = new Set(PAIRS.map(([o]) => o));

const contentLinks = new Map<string, Set<string>>();

const mainOf = (html: string) =>
  html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";

beforeAll(() => {
  if (!fs.existsSync(path.join(DIST, "index.html")))
    throw new Error("run `pnpm build` first");
  for (const [, detail] of PAIRS) {
    for (const route of [detail, detail.replace("/product-", "/")]) {
      const file = path.join(DIST, route.slice(1), "index.html");
      if (!fs.existsSync(file)) continue;
      const main = mainOf(fs.readFileSync(file, "utf8"));
      contentLinks.set(
        route,
        new Set(
          [...main.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g)].map(
            m => m[1].replace(/\/$/, "") || "/"
          )
        )
      );
    }
  }
});

describe("component overview pages reach their engineering detail page", () => {
  it.each(PAIRS)("%s links %s from its content", (overview, detail) => {
    const links = contentLinks.get(overview);
    expect(links, `${overview} was not built`).toBeDefined();
    expect([...links!]).toContain(detail);
  });
});

describe("engineering detail pages reach a component overview", () => {
  it.each(PAIRS)("%s is reachable back from %s", (overview, detail) => {
    const links = contentLinks.get(detail);
    expect(links, `${detail} was not built`).toBeDefined();
    const back = [...links!].filter(l => OVERVIEW_ROUTES.has(l));
    expect(
      back.length,
      `${detail} links no component overview at all`
    ).toBeGreaterThan(0);
  });
});

describe("the pairing is not achieved through chrome", () => {
  it("every overview link sits inside <main>", () => {
    const missing = PAIRS.filter(([overview, detail]) => {
      const file = path.join(DIST, overview.slice(1), "index.html");
      if (!fs.existsSync(file)) return true;
      return !mainOf(fs.readFileSync(file, "utf8")).includes(
        `href="${detail}"`
      );
    }).map(([o]) => o);
    expect(missing).toEqual([]);
  });
});
