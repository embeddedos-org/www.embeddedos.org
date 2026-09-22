import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");

type Graph = {
  components: Array<{
    id: string;
    name: string;
    repository: string;
    version?: string;
    language?: string;
  }>;
};

const graph = JSON.parse(
  fs.readFileSync(path.join(ROOT, "docs/ecosystem-graph.json"), "utf8")
) as Graph;
const repoSet = new Set(graph.components.map(c => c.repository));
const versionByRepo = new Map(
  graph.components.map(c => [c.repository, c.version ?? null])
);
const languageByRepo = new Map(
  graph.components.map(c => [c.repository, c.language ?? null])
);
const ownPageOf = new Map(graph.components.map(c => [`/product-${c.id}`, c]));

const docs = new Map<string, string>();

const walk = (dir: string) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") {
      const route = "/" + path.relative(DIST, p).replace(/\/?index\.html$/, "");
      docs.set(route, fs.readFileSync(p, "utf8"));
    }
  }
};

const blocksIn = (html: string) =>
  [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ].map(m => m[1]);

beforeAll(() => {
  if (!fs.existsSync(path.join(DIST, "index.html")))
    throw new Error("run `pnpm build` first");
  walk(DIST);
});

describe("every JSON-LD block in the build", () => {
  it("parses as JSON", () => {
    const broken: string[] = [];
    for (const [route, html] of docs)
      for (const raw of blocksIn(html)) {
        try {
          JSON.parse(raw);
        } catch {
          broken.push(route);
        }
      }
    expect(broken).toEqual([]);
  });

  it("declares a schema.org context and a type", () => {
    const bad: string[] = [];
    for (const [route, html] of docs)
      for (const raw of blocksIn(html)) {
        const parsed = JSON.parse(raw);
        for (const node of Array.isArray(parsed) ? parsed : [parsed])
          if (
            !String(node["@context"] ?? "").includes("schema.org") ||
            !node["@type"]
          )
            bad.push(`${route} ${node["@type"] ?? "(no type)"}`);
      }
    expect(bad).toEqual([]);
  });

  it("never fabricates ratings, reviews or offers", () => {
    const fabricated: string[] = [];
    for (const [route, html] of docs)
      for (const raw of blocksIn(html))
        if (/aggregateRating|"review"|"offers"|ratingValue/.test(raw))
          fabricated.push(route);
    expect(fabricated).toEqual([]);
  });
});

describe("product pages", () => {
  const NOT_A_DETAIL_PAGE = new Set(["/product-showcases"]);

  const productRoutes = () =>
    [...docs.keys()].filter(
      r => r.startsWith("/product-") && !NOT_A_DETAIL_PAGE.has(r)
    );

  const nodesOf = (route: string, type: string) =>
    blocksIn(docs.get(route)!)
      .flatMap(raw => {
        const p = JSON.parse(raw);
        return Array.isArray(p) ? p : [p];
      })
      .filter(n => n["@type"] === type);

  it("are present in the build", () => {
    expect(productRoutes().length).toBeGreaterThanOrEqual(13);
  });

  it("each carry exactly one BreadcrumbList", () => {
    const wrong = productRoutes().filter(
      r => nodesOf(r, "BreadcrumbList").length !== 1
    );
    expect(wrong).toEqual([]);
  });

  it("place Home, Products and the product in order", () => {
    const wrong: string[] = [];
    for (const r of productRoutes()) {
      const items = nodesOf(r, "BreadcrumbList")[0]?.itemListElement ?? [];
      const positions = items.map((i: { position: number }) => i.position);
      const names = items.map((i: { name: string }) => i.name);
      if (
        positions.join(",") !== "1,2,3" ||
        names[0] !== "Home" ||
        names[1] !== "Products"
      )
        wrong.push(`${r} ${names.join(" > ")}`);
    }
    expect(wrong).toEqual([]);
  });

  it("point the last breadcrumb at the page's own canonical URL", () => {
    const wrong: string[] = [];
    for (const r of productRoutes()) {
      const items = nodesOf(r, "BreadcrumbList")[0]?.itemListElement ?? [];
      const last = items.at(-1);
      const canonical = docs
        .get(r)!
        .match(/<link rel="canonical" href="([^"]*)"/)?.[1];
      if (last?.item !== canonical) wrong.push(`${r}: ${last?.item}`);
    }
    expect(wrong).toEqual([]);
  });

  it("each carry exactly one SoftwareSourceCode", () => {
    const wrong = productRoutes().filter(
      r => nodesOf(r, "SoftwareSourceCode").length !== 1
    );
    expect(wrong).toEqual([]);
  });

  it("name a repository the ecosystem graph records", () => {
    const stray: string[] = [];
    for (const r of productRoutes()) {
      const repo = nodesOf(r, "SoftwareSourceCode")[0]?.codeRepository;
      if (!repoSet.has(repo)) stray.push(`${r}: ${repo}`);
    }
    expect(stray).toEqual([]);
  });

  it("declare MIT, which every component repository reports", () => {
    const wrong: string[] = [];
    for (const r of productRoutes()) {
      const node = nodesOf(r, "SoftwareSourceCode")[0];
      if (node?.license !== "https://spdx.org/licenses/MIT.html")
        wrong.push(`${r}: ${node?.license}`);
    }
    expect(wrong).toEqual([]);
  });

  it("claim only a version the ecosystem graph verified", () => {
    const invented: string[] = [];
    for (const r of productRoutes()) {
      const node = nodesOf(r, "SoftwareSourceCode")[0];
      if (!node?.version) continue;
      if (versionByRepo.get(node.codeRepository) !== node.version)
        invented.push(`${r}: ${node.version}`);
    }
    expect(invented).toEqual([]);
  });

  it("state only graph facts on a component's own page, and none on a shared-repo page", () => {
    const wrong: string[] = [];
    for (const r of productRoutes()) {
      const node = nodesOf(r, "SoftwareSourceCode")[0];
      const own = ownPageOf.get(r);
      if (own) {
        if (node?.name !== own.name)
          wrong.push(`${r}: name ${node?.name} != ${own.name}`);
        if (own.language && node?.programmingLanguage !== own.language)
          wrong.push(
            `${r}: language ${node?.programmingLanguage} != ${own.language}`
          );
        if (own.version && node?.version !== own.version)
          wrong.push(`${r}: version ${node?.version} != ${own.version}`);
      } else {
        for (const k of ["programmingLanguage", "version"])
          if (node?.[k])
            wrong.push(
              `${r}: claims ${k}=${node[k]} from a repository it shares`
            );
      }
    }
    expect(wrong).toEqual([]);
  });

  it("show the same language in the visible badge and the JSON-LD", () => {
    const wrong: string[] = [];
    for (const r of productRoutes()) {
      const lang = nodesOf(r, "SoftwareSourceCode")[0]?.programmingLanguage;
      if (!lang) continue;
      const badge = docs
        .get(r)!
        .match(/text-xs font-mono text-white\/40[^>]*>\s*([^<]{1,40})</)?.[1]
        ?.trim();
      if (badge !== lang)
        wrong.push(`${r}: badge "${badge}" vs schema "${lang}"`);
    }
    expect(wrong).toEqual([]);
  });

  it("never ship the placeholder version the pages used to hard-code", () => {
    const stale = productRoutes().filter(r => /v0\.1\.0/.test(docs.get(r)!));
    expect(stale).toEqual([]);
  });

  it("render a visible breadcrumb, not only the markup", () => {
    const missing = productRoutes().filter(
      r => !/aria-label="Breadcrumb"/.test(docs.get(r)!)
    );
    expect(missing).toEqual([]);
  });
});
