import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");

type Graph = {
  components: Array<{ id: string; name: string; sitePage: string | null }>;
};

const graph = JSON.parse(
  fs.readFileSync(path.join(ROOT, "docs/ecosystem-graph.json"), "utf8")
) as Graph;

const CARD_NAME_TO_ID: Record<string, string> = {
  "EoS RTOS Kernel": "eos",
  eBootloader: "eboot",
  EIPC: "eipc",
  eDB: "edb",
  EAI: "eai",
  ENI: "eni",
  "EoStudio IDE": "eostudio",
  EoStudio: "eostudio",
  eBuild: "ebuild",
  ebuild: "ebuild",
  EoSim: "eosim",
  eFlow: "eflow",
  "eApps Store": "eapps",
  eBrowser: "ebrowser",
  "eOffice Suite": "eoffice",
  EoS: "eos",
};

/**
 * Card names that start with a component name but denote something else, so
 * a prefix match would mis-attribute them. "EoS Platform" is the device
 * management product at /product-eos-platform; "EoS Language" names an entity
 * no repository and no graph component corresponds to, recorded in
 * docs/unverified-claims.md.
 */
const NOT_THE_COMPONENT = ["EoS Platform", "EoS Language"];

/**
 * /flow and /eflow are the undecided duplicate pair in D-6. The card is left
 * pointing at /flow until that URL question is settled, rather than this
 * branch picking a winner.
 */
const PENDING_URL_DECISION = new Set(["/flow"]);

const HUBS = ["/ecosystem", "/products"];

const pageOf = (route: string) => {
  const file = path.join(DIST, route.slice(1), "index.html");
  if (!fs.existsSync(file)) throw new Error(`${route} was not built`);
  const html = fs.readFileSync(file, "utf8");
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
};

const anchorsOf = (main: string) =>
  [...main.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    m => ({
      href: m[1].replace(/\/$/, "") || "/",
      text: m[2]
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    })
  );

const sitePageOf = (id: string) =>
  graph.components.find(c => c.id === id)?.sitePage ?? null;

beforeAll(() => {
  if (!fs.existsSync(path.join(DIST, "index.html")))
    throw new Error("run `pnpm build` first");
});

describe("ecosystem hubs link each component to its own page", () => {
  it.each(HUBS)(
    "%s sends every named component card to that component",
    hub => {
      const wrong: string[] = [];
      for (const a of anchorsOf(pageOf(hub))) {
        if (NOT_THE_COMPONENT.some(n => a.text.startsWith(n))) continue;
        if (PENDING_URL_DECISION.has(a.href)) continue;
        const entry = Object.entries(CARD_NAME_TO_ID)
          .sort((x, y) => y[0].length - x[0].length)
          .find(([name]) => a.text.startsWith(name));
        if (!entry) continue;
        const expected = sitePageOf(entry[1]);
        if (!expected) continue;
        const acceptable = [expected, `/product-${entry[1]}`];
        if (!acceptable.includes(a.href))
          wrong.push(
            `${hub}: "${entry[0]}" -> ${a.href}, expected ${expected}`
          );
      }
      expect(wrong).toEqual([]);
    }
  );

  it.each(HUBS)("%s links at least eight distinct component pages", hub => {
    const pages = new Set(
      graph.components.map(c => c.sitePage).filter(Boolean) as string[]
    );
    const hit = new Set(
      anchorsOf(pageOf(hub))
        .map(a => a.href)
        .filter(h => pages.has(h))
    );
    expect(hit.size).toBeGreaterThanOrEqual(8);
  });
});
