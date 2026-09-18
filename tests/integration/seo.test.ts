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
   * /product-eapps, /product-eos-platform and /product-eserviceapps have no
   * inbound internal link. That is fixed on its own branch by the products-hub
   * change; this bound stops the set growing in the meantime.
   */
  it("introduces no orphan page beyond the known product-detail set", () => {
    const orphans = of("orphan-page").map(f => f.route);
    expect(orphans.filter(r => !r.startsWith("/product-"))).toEqual([]);
    expect(orphans.length).toBeLessThanOrEqual(3);
  });
});
