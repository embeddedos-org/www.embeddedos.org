/**
 * Unit tests for the prerenderer's pure helpers.
 *
 * These encode the metadata rules the Ad Grants audit depends on: titles that
 * fit a SERP, descriptions that are not boilerplate, and per-route canonicals.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import {
  truncate,
  applyMeta,
  escapeAttr,
  discoverRoutes,
  formatHostForUrl,
  report,
  CRASH_MARKER,
} from "../../scripts/prerender.mjs";
import fs from "node:fs";
import path from "node:path";

const SHELL = `<!doctype html><html lang="en"><head>
<title>EmbeddedOS — The Operating System for Every Device</title>
<meta name="description" content="placeholder" />
<link rel="canonical" href="https://www.embeddedos.org/" />
<meta property="og:url" content="https://www.embeddedos.org/" />
<meta property="og:title" content="placeholder" />
<meta property="og:description" content="placeholder" />
</head><body><div id="root"></div></body></html>`;

const titleOf = (html: string) => html.match(/<title>([\s\S]*?)<\/title>/)![1];
const attrOf = (html: string, re: RegExp) => html.match(re)![1];

describe("truncate", () => {
  it("leaves short strings untouched", () => {
    expect(truncate("short", 20)).toBe("short");
  });

  it("never exceeds the limit once the ellipsis is added", () => {
    const out = truncate("a".repeat(500), 50);
    expect(out.length).toBeLessThanOrEqual(51); // 50 chars + the ellipsis
    expect(out.endsWith("…")).toBe(true);
  });

  it("breaks on a word boundary rather than mid-word", () => {
    const source = "the quick brown fox jumps over the lazy dog";
    const out = truncate(source, 20);
    expect(out.endsWith("…")).toBe(true);

    // The kept text must be a prefix of the source that ends where a word ends,
    // i.e. the next source character is a space (or we consumed the whole string).
    const kept = out.slice(0, -1);
    expect(source.startsWith(kept)).toBe(true);
    expect(kept.length === source.length || source[kept.length] === " ").toBe(
      true
    );
  });

  it("strips trailing punctuation before the ellipsis", () => {
    expect(
      truncate("hello world, and then some more text here", 13)
    ).not.toContain(",…");
  });
});

describe("escapeAttr", () => {
  it("escapes the characters that would break an HTML attribute", () => {
    expect(escapeAttr('a & b "c" <d>')).toBe(
      "a &amp; b &quot;c&quot; &lt;d&gt;"
    );
  });

  it("escapes ampersands before entities so output is not double-broken", () => {
    expect(escapeAttr("&amp;")).toBe("&amp;amp;");
  });
});

describe("prerender host formatting", () => {
  it("keeps IPv4 hosts usable and brackets IPv6 hosts for URLs", () => {
    expect(formatHostForUrl("127.0.0.1")).toBe("127.0.0.1");
    expect(formatHostForUrl("172.31.123.79")).toBe("172.31.123.79");
    expect(formatHostForUrl("::1")).toBe("[::1]");
  });
});

describe("applyMeta", () => {
  it("builds a title from the page heading", () => {
    const out = applyMeta(SHELL, {
      route: "/about",
      heading: "About the Foundation",
      description:
        "We are a nonprofit doing nonprofit things for the public good.",
    });
    expect(titleOf(out)).toBe("About the Foundation | EmbeddedOS Foundation");
  });

  it("keeps every title within the 70-character SERP budget", () => {
    const longHeading =
      "An Extremely Long Page Heading That Would Blow Past Google's Display Limit Several Times Over";
    const out = applyMeta(SHELL, {
      route: "/x",
      heading: longHeading,
      description: "d".repeat(80),
    });
    expect(titleOf(out).length).toBeLessThanOrEqual(70);
  });

  it("falls back to the short brand suffix when the long one will not fit", () => {
    const out = applyMeta(SHELL, {
      route: "/x",
      heading: "A Heading Of Quite Considerable Length Indeed Yes",
      description: "d".repeat(80),
    });
    expect(titleOf(out)).toContain("| EmbeddedOS");
    expect(titleOf(out).length).toBeLessThanOrEqual(70);
  });

  it("uses the site default title when a page has no heading", () => {
    const out = applyMeta(SHELL, { route: "/x", heading: "", description: "" });
    expect(titleOf(out)).toBe(
      "EmbeddedOS — The Operating System for Every Device"
    );
  });

  it("writes a route-specific canonical and og:url", () => {
    const out = applyMeta(SHELL, {
      route: "/donate",
      heading: "Donate",
      description: "x".repeat(80),
    });
    expect(attrOf(out, /<link rel="canonical" href="([^"]*)"/)).toBe(
      "https://www.embeddedos.org/donate"
    );
    expect(attrOf(out, /<meta property="og:url" content="([^"]*)"/)).toBe(
      "https://www.embeddedos.org/donate"
    );
  });

  it("keeps the root canonical as a bare trailing slash", () => {
    const out = applyMeta(SHELL, {
      route: "/",
      heading: "Home",
      description: "x".repeat(80),
    });
    expect(attrOf(out, /<link rel="canonical" href="([^"]*)"/)).toBe(
      "https://www.embeddedos.org/"
    );
  });

  it("substitutes the nonprofit fallback description when none was extracted", () => {
    const out = applyMeta(SHELL, {
      route: "/x",
      heading: "X",
      description: "",
    });
    expect(attrOf(out, /<meta name="description" content="([^"]*)"/)).toContain(
      "501(c)(3)"
    );
  });

  it("caps descriptions so they do not overflow a SERP snippet", () => {
    const out = applyMeta(SHELL, {
      route: "/x",
      heading: "X",
      description: "word ".repeat(300),
    });
    const desc = attrOf(out, /<meta name="description" content="([^"]*)"/);
    expect(desc.length).toBeLessThanOrEqual(251);
  });

  it("escapes quotes coming from page content so the attribute cannot break out", () => {
    const out = applyMeta(SHELL, {
      route: "/x",
      heading: 'He said "hello" & left',
      description:
        'A description with "quotes" & ampersands in it, long enough to be used.',
    });
    expect(out).not.toMatch(/content="[^"]*"[^"=>\s][^>]*>/);
    expect(titleOf(out)).toContain("&quot;");
  });
});

describe("report", () => {
  /** A route that rendered the way every healthy route does. */
  const rendered = (route: string, extra: object = {}) => ({
    route,
    ok: true,
    textLength: 2400,
    errors: [],
    consoleErrors: [],
    degraded: false,
    crashed: false,
    ...extra,
  });

  it("passes a run where every route rendered", () => {
    const { exitCode, problems } = report([rendered("/"), rendered("/about")]);
    expect(problems).toEqual([]);
    expect(exitCode).toBe(0);
  });

  it("fails a run where a route shipped the ErrorBoundary screen", () => {
    // The screen carries plenty of visible text — the heading plus a stack
    // trace — so it clears the THIN threshold and pageerror never fired.
    // Before this gate the run below exited 0 and shipped the stack trace.
    const { exitCode, lines, problems } = report([
      rendered("/"),
      rendered("/eos", {
        textLength: 900,
        crashed: true,
        consoleErrors: [
          "TypeError: Cannot read properties of undefined (reading 'map')\n    at EoS (index-abc.js:1:2)",
        ],
      }),
    ]);
    expect(exitCode).toBe(1);
    expect(lines.some(l => /^\s+CRASH\s+\/eos\b/.test(l))).toBe(true);
    // React's report of the caught error is the only clue to the cause, so
    // its first line must be printed with the route.
    expect(lines.join("\n")).toContain("Cannot read properties of undefined");
    expect(problems.join("\n")).toMatch(/1 route\(s\) threw during render/);
  });

  it("still fails a run with an unrendered route, and lists its page errors", () => {
    const { exitCode, lines } = report([
      {
        route: "/x",
        ok: false,
        error: "Timeout 45000ms exceeded",
        errors: ["Error: boom"],
      },
    ]);
    expect(exitCode).toBe(1);
    expect(lines.some(l => /^\s+FAIL\s+\/x\b/.test(l))).toBe(true);
    expect(lines.some(l => /^\s+ERROR\s+\/x\s+Error: boom/.test(l))).toBe(true);
  });

  it("keeps the degraded-embed gate", () => {
    const { exitCode } = report([rendered("/donate", { degraded: true })]);
    expect(exitCode).toBe(1);
  });

  it("uses the attribute the ErrorBoundary actually renders", () => {
    // The marker is matched on the snapshot's markup, so the string here and
    // the JSX attribute in ErrorBoundary.tsx must be the same thing.
    const source = fs.readFileSync(
      path.resolve(
        import.meta.dirname,
        "../../client/src/components/ErrorBoundary.tsx"
      ),
      "utf8"
    );
    expect(source).toMatch(new RegExp(`<div\\s+${CRASH_MARKER}\\b`));
  });
});

describe("discoverRoutes", () => {
  const routes: string[] = discoverRoutes();

  it("finds the full route table from App.tsx", () => {
    expect(routes.length).toBeGreaterThan(80);
  });

  it("always includes the site root", () => {
    expect(routes).toContain("/");
  });

  it("includes the key nonprofit pages a reviewer will look for", () => {
    for (const r of [
      "/about",
      "/donate",
      "/organization",
      "/contact",
      "/get-involved",
    ]) {
      expect(routes).toContain(r);
    }
  });

  it("excludes parameterised and wildcard routes, which have no static output", () => {
    expect(routes.every(r => !r.includes(":") && !r.includes("*"))).toBe(true);
  });

  it("returns no duplicates", () => {
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("no longer includes the removed thin duplicate page", () => {
    expect(routes).not.toContain("/ecosystem-map");
  });
});
