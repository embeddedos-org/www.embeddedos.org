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
import {
  applyMeta,
  restoreDeferredStylesheets,
  TITLE_OVERRIDES as PRERENDER_TITLES,
  DESCRIPTION_OVERRIDES as PRERENDER_DESCRIPTIONS,
  socialImageFor as prerenderSocialImageFor,
  SOCIAL_IMAGE_RULES as PRERENDER_SOCIAL_IMAGE_RULES,
} from "../../scripts/prerender.mjs";
import {
  buildTitle,
  canonicalFor,
  truncate,
  socialImageFor,
  SOCIAL_IMAGE_RULES,
  DEFAULT_TITLE,
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
  html.match(
    new RegExp(`<meta\\s+(?:name|property)="${name}"\\s+content="([^"]*)"`, "i")
  )?.[1] ?? "";

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
      truncate(DESCRIPTION_OVERRIDES["/donate"], 155)
    );
    expect(metaFrom(rendered, "twitter:description")).toBe(
      truncate(DESCRIPTION_OVERRIDES["/donate"], 155)
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

describe("client and prerenderer agree on the social image", () => {
  const routes = [
    "/",
    "/architecture",
    "/eboot",
    "/product-eboot",
    "/eos",
    "/product-eos",
    "/eai",
    "/eni",
    "/eoffice",
    "/eapps",
    "/edb",
    "/eipc",
    "/eosim",
    "/eostudio",
    "/ecad-hardware",
    "/community",
    "/mission",
    "/careers",
    "/does-not-match-any-rule",
  ];

  it.each(routes)("resolves %s to the same image in both", route => {
    expect(socialImageFor(route)).toBe(prerenderSocialImageFor(route));
  });

  it("declares the same rules in both implementations", () => {
    expect(SOCIAL_IMAGE_RULES.map(([p, v]) => [p.source, v])).toEqual(
      PRERENDER_SOCIAL_IMAGE_RULES.map(([p, v]: [RegExp, string]) => [
        p.source,
        v,
      ])
    );
  });

  it("returns an absolute URL on the site origin", () => {
    for (const route of routes)
      expect(socialImageFor(route)).toMatch(
        /^https:\/\/www\.embeddedos\.org\/media\/[\w.-]+\.(jpg|png|webp)$/
      );
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
  // The pipeline changed shape in fix/prerender-deferred-stylesheets: the
  // shell (client/index.html) already ships stylesheets deferred, and the
  // prerenderer restores that form in snapshots instead of deferring at
  // build time. What this suite holds is the round-trip: a snapshot taken
  // from the live page (onload already fired, media="all") is rewritten to
  // the shell's deferred declaration, and the webfont sheet is untouched.
  const SNAPSHOT_HEAD = `<!doctype html><html><head>
<link rel="stylesheet" crossorigin href="/assets/index-abc123.css" media="all" onload="this.media='all'">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans" media="all" onload="this.media='all'">
</head><body></body></html>`;

  it("restores the built stylesheet to its deferred declaration", () => {
    const out = restoreDeferredStylesheets(SNAPSHOT_HEAD);
    expect(out).toContain(
      `<link rel="stylesheet" crossorigin href="/assets/index-abc123.css" media="print" onload="this.media='all'">`
    );
    // No render-blocking (media-less, handler-less) stylesheet remains.
    expect(out).not.toMatch(/<link rel="stylesheet"(?![^>]*\bmedia=)[^>]*>/);
  });

  it("leaves the already-deferred webfont stylesheet alone", () => {
    const out = restoreDeferredStylesheets(SNAPSHOT_HEAD);
    expect(out.match(/fonts\.googleapis\.com/g)?.length).toBe(1);
    expect(out).toContain(
      `href="https://fonts.googleapis.com/css2?family=DM+Sans" media="print"`
    );
  });
});
