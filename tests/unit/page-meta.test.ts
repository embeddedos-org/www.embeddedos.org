/**
 * The client-side metadata rules must agree with the prerenderer's.
 *
 * scripts/prerender.mjs stamps the head at build time; client/src/lib/page-meta.ts
 * restamps it after a client-side navigation. They are separate implementations
 * because the build script pulls in playwright and express and cannot enter a
 * browser bundle. These tests are what stops the two from drifting: if either
 * side changes its title budget, suffix or canonical shape, the agreement
 * cases below fail.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import { applyMeta } from "../../scripts/prerender.mjs";
import {
  buildTitle,
  canonicalFor,
  truncate,
  DEFAULT_TITLE,
  FALLBACK_DESCRIPTION,
} from "../../client/src/lib/page-meta";

const SHELL = `<!doctype html><html lang="en"><head>
<title>EmbeddedOS — The Operating System for Every Device</title>
<meta name="description" content="placeholder" />
<link rel="canonical" href="https://www.embeddedos.org/" />
<meta property="og:url" content="https://www.embeddedos.org/" />
<meta property="og:title" content="placeholder" />
<meta property="og:description" content="placeholder" />
</head><body></body></html>`;

const titleFrom = (html: string) =>
  html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
const canonicalFrom = (html: string) =>
  html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)?.[1] ?? "";

/** Headings chosen to straddle the 70-character title budget. */
const HEADINGS = [
  "ENI",
  "Start Building with EmbeddedOS",
  "eNI — Neural Interface Platform",
  "Build the OS for Every Device",
  "The EoSim Hardware-in-the-Loop Bridge for Continuous Integration Pipelines",
  "A heading of precisely the length that lands on the long-suffix boundary!!",
];

const ROUTES = ["/", "/eni", "/getting-started", "/product-eos-platform"];

describe("client and prerenderer agree on the title", () => {
  it.each(HEADINGS)("matches the prerenderer for %j", heading => {
    const rendered = applyMeta(SHELL, {
      route: "/some-route",
      heading,
      description: "x".repeat(120) + ".",
    });
    expect(buildTitle(heading)).toBe(titleFrom(rendered));
  });

  it("falls back to the site title when a page has no heading", () => {
    const rendered = applyMeta(SHELL, {
      route: "/",
      heading: "",
      description: "",
    });
    expect(buildTitle("")).toBe(DEFAULT_TITLE);
    expect(titleFrom(rendered)).toBe(DEFAULT_TITLE);
  });

  it("keeps every title within the search-result budget", () => {
    for (const heading of HEADINGS) {
      expect(buildTitle(heading).length).toBeLessThanOrEqual(70);
    }
  });
});

describe("client and prerenderer agree on the canonical URL", () => {
  it.each(ROUTES)("matches the prerenderer for %s", route => {
    const rendered = applyMeta(SHELL, {
      route,
      heading: "Heading",
      description: "y".repeat(120) + ".",
    });
    expect(canonicalFor(route)).toBe(canonicalFrom(rendered));
  });

  it("gives the homepage a trailing slash and nothing else a double one", () => {
    expect(canonicalFor("/")).toBe("https://www.embeddedos.org/");
    expect(canonicalFor("/eni")).toBe("https://www.embeddedos.org/eni");
  });
});

describe("truncate", () => {
  it("leaves text within the limit untouched", () => {
    expect(truncate("short", 70)).toBe("short");
  });

  it("cuts on a word boundary and marks the cut", () => {
    const out = truncate("alpha beta gamma delta epsilon", 20);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(21);
    expect(out).not.toMatch(/[,;:.\s]…$/);
  });

  it("still cuts when there is no usable word boundary", () => {
    const out = truncate("x".repeat(50), 10);
    expect(out).toBe("x".repeat(10) + "…");
  });
});

describe("shared copy", () => {
  it("uses the same fallback description the prerenderer writes", () => {
    const rendered = applyMeta(SHELL, {
      route: "/",
      heading: "Heading",
      description: "",
    });
    expect(rendered).toContain(FALLBACK_DESCRIPTION.slice(0, 80));
  });
});
