// @vitest-environment jsdom
/**
 * Corner cases for the generic article route.
 *
 * Eight bespoke components became one parameterised page, so every failure that
 * used to be impossible-by-construction — a route with no component, a
 * component with no content — is now reachable at runtime through a bad slug.
 * These tests attack that surface rather than confirming the happy path.
 *
 * They render the real component with React Testing Library, so what is
 * asserted is what a browser would show, not what the data says.
 */

import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import Article from "../../client/src/pages/Article";
import { ARTICLE_BODIES, bodyOf } from "../../client/src/data/article-bodies";
import { CONTENT, bySlug, formatDate } from "../../client/src/data/content";

afterEach(cleanup);

const SLUGS = Object.keys(ARTICLE_BODIES);

describe("every article renders", () => {
  it("has bodies to test", () => {
    // Without this the parameterised suite below is empty and green.
    expect(SLUGS.length).toBe(8);
  });

  it.each(SLUGS)("%s renders title, lede and all sections", slug => {
    render(<Article slug={slug} />);
    const item = bySlug(slug)!;
    const body = bodyOf(slug)!;

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      item.title
    );
    expect(screen.getByText(body.lede)).toBeInTheDocument();

    for (const section of body.sections) {
      expect(
        screen.getByRole("heading", { level: 2, name: section.heading })
      ).toBeInTheDocument();
      expect(screen.getByText(section.text)).toBeInTheDocument();
    }
  });

  it.each(SLUGS)("%s shows the registry date, not a second copy", slug => {
    // The defect this whole change exists to prevent: seven of the eight
    // article components carried their own date, and seven disagreed with the
    // listing — one by eleven months.
    render(<Article slug={slug} />);
    expect(
      screen.getByText(formatDate(bySlug(slug)!.date))
    ).toBeInTheDocument();
  });
});

describe("unknown and malformed slugs", () => {
  const BAD = [
    ["absent", "no-such-article"],
    ["empty", ""],
    ["path traversal", "../../etc/passwd"],
    ["url encoded", "%2e%2e%2f"],
    ["html", "<script>alert(1)</script>"],
    ["very long", "a".repeat(5000)],
    ["unicode", "🙂"],
    ["whitespace", "   "],
    ["case mismatch", "EAI-LLM-BENCH"],
    ["trailing slash", "eai-llm-bench/"],
  ] as const;

  it.each(BAD)(
    "%s slug shows not-found rather than an empty shell",
    (_, slug) => {
      render(<Article slug={slug} />);
      expect(
        screen.getByRole("heading", { name: /article not found/i })
      ).toBeInTheDocument();
    }
  );

  it("never renders raw markup from a slug", () => {
    // The slug reaches the page only through a lookup, never the DOM. If that
    // ever changes, this fails rather than shipping an injection.
    const { container } = render(
      <Article slug="<img src=x onerror=alert(1)>" />
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.innerHTML).not.toContain("onerror");
  });

  it("does not throw when the slug is undefined", () => {
    expect(() => render(<Article />)).not.toThrow();
  });
});

describe("registry entries without a body", () => {
  it("a listed item that is a link-out has no article page", () => {
    // Most registry entries point at GitHub. Rendering /article/<their slug>
    // must say not-found rather than an article with a title and no words.
    const linkOut = CONTENT.find(
      c => !c.href.startsWith("/") && !bodyOf(c.slug)
    );
    expect(linkOut, "expected at least one link-out entry").toBeDefined();
    render(<Article slug={linkOut!.slug} />);
    expect(
      screen.getByRole("heading", { name: /article not found/i })
    ).toBeInTheDocument();
  });

  it("every body has a matching registry entry", () => {
    // The opposite orphan: prose with no metadata would render a page with no
    // title and no date.
    const orphans = SLUGS.filter(s => !bySlug(s));
    expect(orphans, `bodies with no registry entry: ${orphans}`).toEqual([]);
  });

  it("every internal /article- href in the registry has a body", () => {
    // A registry item linking to an article route that renders not-found is a
    // dead link the listing presents as live.
    const dead = CONTENT.filter(
      c => c.href.startsWith("/article-") && !bodyOf(c.slug)
    ).map(c => c.href);
    expect(dead, `listed but unrenderable: ${dead}`).toEqual([]);
  });
});

describe("content integrity after extraction", () => {
  it("no body is empty", () => {
    for (const [slug, body] of Object.entries(ARTICLE_BODIES)) {
      expect(body.lede.trim(), `${slug} lede`).not.toBe("");
      expect(body.sections.length, `${slug} sections`).toBeGreaterThan(0);
      for (const s of body.sections) {
        expect(s.heading.trim(), `${slug} heading`).not.toBe("");
        expect(s.text.trim(), `${slug} text`).not.toBe("");
      }
    }
  });

  it("no JSX or entities survived the extraction", () => {
    // The prose came out of .tsx files by regex. A leftover tag or a raw
    // &amp; would render literally on the page.
    for (const [slug, body] of Object.entries(ARTICLE_BODIES)) {
      const all = [
        body.lede,
        ...body.sections.flatMap(s => [s.heading, s.text]),
      ];
      for (const text of all) {
        expect(text, `${slug}: leftover markup`).not.toMatch(
          /<\/?[a-z][^>]*>/i
        );
        expect(text, `${slug}: leftover entity`).not.toMatch(
          /&(amp|lt|gt|quot|#\d+);/
        );
        expect(text, `${slug}: leftover JSX brace`).not.toMatch(/\{["'`]/);
      }
    }
  });

  it("section headings are unique within an article", () => {
    // They are React keys. Duplicates silently drop a section from the page.
    for (const [slug, body] of Object.entries(ARTICLE_BODIES)) {
      const headings = body.sections.map(s => s.heading);
      expect(new Set(headings).size, `${slug} has duplicate headings`).toBe(
        headings.length
      );
    }
  });
});

describe("routing", () => {
  it("keeps every legacy /article-xxx path", () => {
    // These are indexed and linked from /news and /research. Dropping one
    // would 404 silently through the SPA fallback.
    const app = readFileSync(
      join(__dirname, "../../client/src/App.tsx"),
      "utf-8"
    );
    for (const item of CONTENT.filter(c => c.href.startsWith("/article-"))) {
      expect(app, `route missing for ${item.href}`).toContain(
        `<Route path="${item.href}">`
      );
    }
  });

  it("passes the right slug to each legacy route", () => {
    // A copy-paste error here renders the wrong article at a real URL — which
    // looks like a working page, so nothing would report it.
    const app = readFileSync(
      join(__dirname, "../../client/src/App.tsx"),
      "utf-8"
    );
    for (const item of CONTENT.filter(c => c.href.startsWith("/article-"))) {
      const block = app.slice(
        app.indexOf(`<Route path="${item.href}">`),
        app.indexOf("</Route>", app.indexOf(`<Route path="${item.href}">`))
      );
      expect(block, `${item.href} passes the wrong slug`).toContain(
        `slug="${item.slug}"`
      );
    }
  });

  it("serves the canonical /article/:slug route", () => {
    const app = readFileSync(
      join(__dirname, "../../client/src/App.tsx"),
      "utf-8"
    );
    expect(app).toContain('<Route path="/article/:slug">');
  });
});
