/**
 * Guards the article rich-results markup in the shipped HTML.
 *
 * Article structured data is rendered declaratively by the Article page, so it
 * must survive the prerender snapshot that becomes dist/public. A component
 * that only worked client-side (for example one that injected the script with
 * an effect after the snapshot was taken) would pass the jsdom unit tests
 * and still ship nothing to crawlers. These tests read the built files the
 * crawler actually sees.
 *
 * Requires `pnpm build` first.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(import.meta.dirname, "../../dist/public");

const articleHtmlFiles = () =>
  fs
    .globSync("article-*/index.html", { cwd: DIST })
    .map(f => path.join(DIST, f));

const jsonLdBlocks = (html: string): JsonLdNode[] =>
  [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ]
    .map(m => m[1])
    .map(text => JSON.parse(text) as JsonLdNode);

type JsonLdNode = Record<string, unknown>;

const newsArticleOf = (doc: JsonLdNode): JsonLdNode | undefined =>
  (doc["@graph"] as JsonLdNode[] | undefined)?.find(
    e => e["@type"] === "NewsArticle"
  );

/** Registry slug for a built legacy article file: article-<slug>/index.html. */
const slugOf = (file: string) =>
  path.basename(path.dirname(file)).replace(/^article-/, "");

describe("built article pages", () => {
  it("has built article pages to test", () => {
    expect(
      fs.existsSync(DIST),
      "dist/public is missing — run `pnpm build` before tests/integration"
    ).toBe(true);
    const files = articleHtmlFiles();
    expect(files.length, "expected the eight prerendered legacy article pages").toBe(8);
  });

  it.each(articleHtmlFiles())(
    "%s carries a valid NewsArticle JSON-LD block",
    file => {
      const slug = slugOf(file);
      const html = fs.readFileSync(file, "utf-8");
      const blocks = jsonLdBlocks(html);
      const doc = blocks.find(d => newsArticleOf(d));
      expect(doc, `${slug}: no NewsArticle block in built HTML`).toBeDefined();

      const news = newsArticleOf(doc);
      expect(news, `${slug}: NewsArticle shape`).toBeDefined();
      const headline = news!["headline"] as string;
      expect(typeof headline).toBe("string");
      expect(headline.length).toBeGreaterThan(0);
      // Registry date, ISO YYYY-MM-DD.
      expect(news!["datePublished"] as string).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect((news!["author"] as JsonLdNode)?.["name"]).toBe(
        "Embedded Operating Systems (EoS) Research Foundation"
      );
      const publisher = news!["publisher"] as JsonLdNode;
      expect(publisher?.["name"]).toBe(
        "Embedded Operating Systems (EoS) Research Foundation"
      );
      expect((publisher?.["logo"] as JsonLdNode)?.["url"]).toMatch(
        /^https:\/\/www\.embeddedos\.org\//
      );
      // The canonical URL, even though this file was built from a legacy
      // /article-xxx route.
      expect((news!["mainEntityOfPage"] as JsonLdNode)?.["@id"]).toBe(
        `https://www.embeddedos.org/article/${slug}`
      );
      expect(news!["description"] as string).toBeTruthy();
    }
  );

  it("emits exactly one NewsArticle block per article page", () => {
    // Every page also carries the static NGO block from the shell, so the
    // count that matters is NewsArticle-carrying blocks: one means the
    // article's data is neither dropped by the snapshot nor duplicated.
    for (const file of articleHtmlFiles()) {
      const html = fs.readFileSync(file, "utf-8");
      const newsCount = jsonLdBlocks(html).filter(d =>
        newsArticleOf(d)
      ).length;
      expect(newsCount, `${slugOf(file)}: NewsArticle block count`).toBe(1);
    }
  });
});
