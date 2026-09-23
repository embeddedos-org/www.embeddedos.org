/**
 * SEO contracts over the prerendered build.
 *
 * Runs the same audit as `pnpm seo:audit` and holds the classes of defect that
 * were fixed, so they cannot return unnoticed. Requires `pnpm build` first.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");

type Finding = {
  level: "error" | "warn";
  check: string;
  route: string;
  detail: string;
};

let findings: Finding[] = [];
let documents = 0;

const of = (check: string) => findings.filter(f => f.check === check);

beforeAll(() => {
  if (!fs.existsSync(path.join(DIST, "index.html")))
    throw new Error("run `pnpm build` first");
  const out = execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "seo-audit.mjs"), "--json"],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
  );
  const report = JSON.parse(out);
  findings = report.findings;
  documents = report.documents;
});

describe("the audit covers the whole build", () => {
  it("parses every prerendered document", () => {
    const built = fs.globSync("**/index.html", { cwd: DIST }).length;
    expect(documents).toBe(built);
    expect(documents).toBeGreaterThan(100);
  });
});

describe("metadata is present and unique", () => {
  it.each([
    "title-missing",
    "title-duplicate",
    "description-missing",
    "description-duplicate",
    "description-duplicated-tag",
    "description-too-long",
  ])("has no %s", check => {
    expect(of(check).map(f => `${f.route} ${f.detail}`)).toEqual([]);
  });
});

describe("descriptions stay within a search snippet", () => {
  it("has no description-long warning", () => {
    expect(of("description-long").map(f => `${f.route} ${f.detail}`)).toEqual(
      []
    );
  });

  it("has no description-short warning", () => {
    expect(of("description-short").map(f => `${f.route} ${f.detail}`)).toEqual(
      []
    );
  });
});

describe("canonical URLs are correct", () => {
  it.each(["canonical-missing", "canonical-multiple", "canonical-mismatch"])(
    "has no %s",
    check => {
      expect(of(check).map(f => `${f.route} ${f.detail}`)).toEqual([]);
    }
  );
});

describe("document structure is valid", () => {
  it.each([
    "h1-missing",
    "h1-multiple",
    "heading-skip",
    "landmark-main",
    "lang-missing",
  ])("has no %s", check => {
    expect(of(check).map(f => `${f.route} ${f.detail}`)).toEqual([]);
  });
});

describe("social and structured metadata", () => {
  it.each(["og-image-missing", "og-title-missing", "og-description-missing"])(
    "has no %s",
    check => {
      expect(of(check).map(f => f.route)).toEqual([]);
    }
  );

  it.each([
    "twitter-card-missing",
    "twitter-title-missing",
    "twitter-image-missing",
  ])("has no %s", check => {
    expect(of(check).map(f => f.route)).toEqual([]);
  });

  it("emits no invalid JSON-LD", () => {
    expect(of("jsonld-invalid").map(f => `${f.route} ${f.detail}`)).toEqual([]);
  });

  it("gives sections distinct social images rather than one sitewide image", () => {
    const html = (route: string) =>
      fs.readFileSync(
        path.join(DIST, route === "/" ? "index.html" : `${route}/index.html`),
        "utf8"
      );
    const image = (route: string) =>
      html(route).match(/<meta property="og:image" content="([^"]*)"/)?.[1];
    const routes = ["/", "/architecture", "/eboot", "/eai", "/community"];
    expect(new Set(routes.map(image)).size).toBeGreaterThan(3);
  });
});

describe("links and sitemap", () => {
  it.each([
    "internal-link-broken",
    "img-alt-missing",
    "sitemap-missing",
    "sitemap-url-not-built",
    "sitemap-duplicate",
  ])("has no %s", check => {
    expect(of(check).map(f => `${f.route} ${f.detail}`)).toEqual([]);
  });

  /**
   * The three product-detail orphans this bound used to allow are linked now,
   * so the allowance is gone. Any orphan, product page or not, fails here.
   */
  it("introduces no orphan page at all", () => {
    expect(of("orphan-page").map(f => f.route)).toEqual([]);
  });
});

/**
 * Checks the audit emits but nothing asserted. A mutation run proved the gap:
 * stripping every JSON-LD block from all 132 pages, adding a "Learn more"
 * anchor, and adding a dimensionless image each left the suite green, because
 * CI runs `pnpm seo:audit` without --strict and treats it as reporting.
 */
describe("checks the audit reports but nothing used to gate", () => {
  it("leaves no weak anchor text anywhere", () => {
    expect(of("weak-anchor").map(f => `${f.route} ${f.detail}`)).toEqual([]);
  });

  it("adds no image that can shift layout beyond the known homepage three", () => {
    const routes = of("img-no-dimensions").map(f => f.route);
    expect(routes.filter(r => r !== "/")).toEqual([]);
  });

  it("emits valid, present structured data on every page", () => {
    const missing: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          walk(full);
          continue;
        }
        if (e.name !== "index.html") continue;
        const html = fs.readFileSync(full, "utf8");
        const types = [
          ...html.matchAll(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
          ),
        ].flatMap(m => {
          const parsed = JSON.parse(m[1]);
          return (Array.isArray(parsed) ? parsed : [parsed]).map(
            n => n["@type"]
          );
        });
        const route =
          "/" + path.relative(DIST, full).replace(/\/?index\.html$/, "");
        if (!types.includes("WebSite") || !types.includes("NGO"))
          missing.push(`${route}: ${types.join(",") || "(none)"}`);
      }
    };
    walk(DIST);
    expect(missing).toEqual([]);
  });
});
