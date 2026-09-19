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
import { applyMeta, deferStylesheet, TITLE_OVERRIDES as PRERENDER_TITLES, DESCRIPTION_OVERRIDES as PRERENDER_DESCRIPTIONS } from "../../scripts/prerender.mjs";
import {
  buildTitle,
  canonicalFor,
  truncate,
  DEFAULT_TITLE,
  FALLBACK_DESCRIPTION,
  TITLE_OVERRIDES,
  DESCRIPTION_OVERRIDES,
} from "../../client/src/lib/page-meta";

const SHELL = `<!doctype html><html lang="en"><head>
<title>EmbeddedOS — The Operating System for Every Device</title>
<meta name="description" content="placeholder" />
<link rel="canonical" href="https://www.embeddedos.org/" />
<meta property="og:url" content="https://www.embeddedos.org/" />
<meta property="og:title" content="placeholder" />
<meta property="og:description" content="placeholder" />
<meta property="og:image" content="https://www.embeddedos.org/media/hero-background_1bafea1c.jpg" />
<meta name="twitter:title" content="placeholder" />
<meta name="twitter:description" content="placeholder" />
<meta name="twitter:image" content="https://www.embeddedos.org/media/hero-background_1bafea1c.jpg" />
</head><body></body></html>`;

const titleFrom = (html: string) =>
  html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
const canonicalFrom = (html: string) =>
  html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)?.[1] ?? "";
const metaFrom = (html: string, name: string) =>
  html.match(new RegExp(`<meta\\s+(?:name|property)="${name}"\\s+content="([^"]*)"`, "i"))?.[1] ?? "";

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
    // Use a route with no title override — "/" has one (see below).
    const rendered = applyMeta(SHELL, {
      route: "/some-route",
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

  it("keeps every title override short enough to never truncate", () => {
    for (const title of Object.values(TITLE_OVERRIDES)) {
      expect(title.length).toBeLessThanOrEqual(60);
    }
  });
});

describe("per-route metadata overrides stay in lockstep", () => {
  it("uses the same override tables on both sides", () => {
    expect(PRERENDER_TITLES).toEqual(TITLE_OVERRIDES);
    expect(PRERENDER_DESCRIPTIONS).toEqual(DESCRIPTION_OVERRIDES);
  });

  it("applies the homepage title override in both implementations", () => {
    const rendered = applyMeta(SHELL, {
      route: "/",
      heading: "Open-source embedded systems for intelligent physical devices",
      description: "x".repeat(120) + ".",
    });
    expect(titleFrom(rendered)).toBe(TITLE_OVERRIDES["/"]);
    expect(buildTitle("whatever heading", "/")).toBe(TITLE_OVERRIDES["/"]);
    expect(TITLE_OVERRIDES["/"]).toContain("device");
  });

  it("applies the same description overrides in both implementations", () => {
    const rendered = applyMeta(SHELL, {
      route: "/donate",
      heading: "Donate",
      description: "extracted text that must not win",
    });
    expect(metaFrom(rendered, "description")).toBe(
      DESCRIPTION_OVERRIDES["/donate"]
    );
    expect(metaFrom(rendered, "twitter:description")).toBe(
      DESCRIPTION_OVERRIDES["/donate"]
    );
  });

  it("mirrors the title into the twitter card tags", () => {
    const rendered = applyMeta(SHELL, {
      route: "/donate",
      heading: "Donate",
      description: "x".repeat(120) + ".",
    });
    expect(metaFrom(rendered, "twitter:title")).toBe(titleFrom(rendered));
  });

  it("rewrites og:image and twitter:image from the page's own image", () => {
    const rendered = applyMeta(SHELL, {
      route: "/donate",
      heading: "Donate",
      description: "x".repeat(120) + ".",
      image: "/media/donate-hero.jpg",
    });
    expect(metaFrom(rendered, "og:image")).toBe(
      "https://www.embeddedos.org/media/donate-hero.jpg"
    );
    expect(metaFrom(rendered, "twitter:image")).toBe(
      "https://www.embeddedos.org/media/donate-hero.jpg"
    );
  });

  it("keeps the generic hero image when a page has no image", () => {
    const rendered = applyMeta(SHELL, {
      route: "/donate",
      heading: "Donate",
      description: "x".repeat(120) + ".",
      image: "",
    });
    expect(metaFrom(rendered, "og:image")).toBe(
      "https://www.embeddedos.org/media/hero-background_1bafea1c.jpg"
    );
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

describe("stylesheet deferral", () => {
  const CSS_SHELL = `<!doctype html><html><head>
<link rel="stylesheet" crossorigin href="/assets/index-abc123.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans" media="print" onload="this.media='all'">
</head><body></body></html>`;

  it("defers the built stylesheet without blocking first render", () => {
    const out = deferStylesheet(CSS_SHELL);
    expect(out).toContain(
      `<link rel="preload" as="style" crossorigin href="/assets/index-abc123.css" />`
    );
    expect(out).toContain(`media="print" onload="this.media='all'"`);
    expect(out).toContain(
      `<noscript><link rel="stylesheet" crossorigin href="/assets/index-abc123.css" /></noscript>`
    );
    // No render-blocking stylesheet link remains outside the noscript
    // fallback (which by definition only loads with JS disabled).
    const withoutNoscript = out.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
    expect(withoutNoscript).not.toMatch(
      /<link rel="stylesheet"(?![^>]*\bmedia=)[^>]*>/
    );
  });

  it("leaves the already-deferred webfont stylesheet alone", () => {
    const out = deferStylesheet(CSS_SHELL);
    expect(out.match(/fonts\.googleapis\.com/g)?.length).toBe(1);
    expect(out).not.toContain("as=\"style\" href=\"https://fonts.googleapis.com");
  });
});

describe("shared copy", () => {
  it("uses the same fallback description the prerenderer writes", () => {
    // Use a route with no description override — overridden routes
    // legitimately skip the fallback (see above).
    const rendered = applyMeta(SHELL, {
      route: "/some-route",
      heading: "Heading",
      description: "",
    });
    expect(rendered).toContain(FALLBACK_DESCRIPTION.slice(0, 80));
  });
});
