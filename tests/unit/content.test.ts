/**
 * The content registry's invariants.
 *
 * These are the properties the site relies on and TypeScript cannot check: that
 * slugs are unique, that dates are real and sortable, that every internal href
 * points at a route that exists. The previous inline `NEWS_ITEMS` array had
 * none of them, which is how it came to be maintained in hand-written order
 * with a `(item as any)` cast to read a field the type did not declare.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CONTENT,
  KIND_LABEL,
  MARKETING_KINDS,
  RESEARCH_KINDS,
  badgeOf,
  byKind,
  byKinds,
  bySlug,
  countsByKind,
  formatDate,
  isInternal,
  recent,
  type ContentItem,
} from "../../client/src/data/content";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("registry integrity", () => {
  it("is not empty", () => {
    // Guards the guard: every assertion below passes vacuously on an empty
    // array, so a registry that failed to load would look perfectly healthy.
    expect(CONTENT.length).toBeGreaterThan(10);
  });

  it("has unique slugs", () => {
    const seen = new Map<string, number>();
    for (const item of CONTENT) {
      seen.set(item.slug, (seen.get(item.slug) ?? 0) + 1);
    }
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([s]) => s);
    expect(dupes, `duplicate slugs: ${dupes.join(", ")}`).toEqual([]);
  });

  it("has unique titles", () => {
    const titles = CONTENT.map(i => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("uses ISO dates that parse to the date they spell", () => {
    for (const item of CONTENT) {
      expect(item.date, `${item.slug} date`).toMatch(ISO_DATE);
      // A regex accepts 2026-13-45. Round-tripping through Date catches it.
      const round = new Date(item.date + "T00:00:00Z")
        .toISOString()
        .slice(0, 10);
      expect(round, `${item.slug} is not a real calendar date`).toBe(item.date);
    }
  });

  it("has a label for every kind in use", () => {
    for (const item of CONTENT) {
      expect(KIND_LABEL[item.kind], `no label for ${item.kind}`).toBeTruthy();
    }
  });

  it("assigns every declared kind to exactly one programme", () => {
    const all = [...MARKETING_KINDS, ...RESEARCH_KINDS];
    const declared = Object.keys(KIND_LABEL).sort();
    expect(all.length, "a kind is in both programmes or neither").toBe(
      new Set(all).size
    );
    expect([...all].sort()).toEqual(declared);
  });

  it("gives every item a non-empty title, summary and href", () => {
    for (const item of CONTENT) {
      expect(item.title.trim(), `${item.slug} title`).not.toBe("");
      expect(item.summary.trim(), `${item.slug} summary`).not.toBe("");
      expect(item.href.trim(), `${item.slug} href`).not.toBe("");
      expect(item.tags.length, `${item.slug} has no tags`).toBeGreaterThan(0);
    }
  });
});

describe("link classification", () => {
  it("treats a leading slash as internal and everything else as external", () => {
    const item = (href: string) => ({ href }) as ContentItem;
    expect(isInternal(item("/aerospace"))).toBe(true);
    expect(isInternal(item("https://github.com/embeddedos-org"))).toBe(false);
    // Protocol-relative is external, and starts with a slash — the case a
    // naive startsWith("/") check gets wrong is "//evil.example", which would
    // be rendered as an in-app link and navigate off-site.
    expect(isInternal(item("//example.com"))).toBe(false);
  });

  it("every internal href is a route the app serves", () => {
    // The reason this test exists: an internal link is rendered with wouter's
    // <Link>, so a typo does not 404 loudly — it renders the SPA's fallback
    // and looks like a working page with nothing on it.
    const app = readFileSync(
      join(__dirname, "../../client/src/App.tsx"),
      "utf-8"
    );
    const routes = new Set(
      [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1])
    );
    expect(routes.size, "no routes parsed from App.tsx").toBeGreaterThan(20);

    const missing = CONTENT.filter(isInternal)
      .map(i => i.href)
      .filter(href => !routes.has(href));
    expect(
      missing,
      `internal hrefs with no route: ${missing.join(", ")}`
    ).toEqual([]);
  });
});

describe("ordering", () => {
  it("returns newest first", () => {
    const dates = recent(CONTENT.length).map(i => i.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("does not depend on the order entries are written in", () => {
    // The property that makes the registry appendable. The previous array was
    // hand-ordered, so an entry added in the wrong place stayed wrong.
    const first = recent(5).map(i => i.slug);
    const shuffled = [...CONTENT].reverse();
    const again = [...shuffled]
      .sort((a, b) =>
        a.date === b.date
          ? a.title.localeCompare(b.title)
          : a.date < b.date
            ? 1
            : -1
      )
      .slice(0, 5)
      .map(i => i.slug);
    expect(again).toEqual(first);
  });

  it("breaks date ties deterministically", () => {
    const sameDay = CONTENT.filter(i => i.date === CONTENT[0].date);
    if (sameDay.length > 1) {
      const a = recent(CONTENT.length).map(i => i.slug);
      const b = recent(CONTENT.length).map(i => i.slug);
      expect(a).toEqual(b);
    }
  });
});

describe("accessors", () => {
  it("byKind returns only that kind", () => {
    for (const kind of Object.keys(KIND_LABEL) as (keyof typeof KIND_LABEL)[]) {
      expect(byKind(kind).every(i => i.kind === kind)).toBe(true);
    }
  });

  it("byKinds is the union of its parts", () => {
    const union = byKinds(["news", "blog"])
      .map(i => i.slug)
      .sort();
    const parts = [...byKind("news"), ...byKind("blog")]
      .map(i => i.slug)
      .sort();
    expect(union).toEqual(parts);
  });

  it("byKinds([]) is empty rather than everything", () => {
    // A filter built from an empty allow-list must deny, not permit. The
    // opposite would silently show research items on a marketing index.
    expect(byKinds([])).toEqual([]);
  });

  it("bySlug finds every item and nothing else", () => {
    for (const item of CONTENT) {
      expect(bySlug(item.slug)?.title).toBe(item.title);
    }
    expect(bySlug("no-such-slug")).toBeUndefined();
  });

  it("recent clamps to what exists", () => {
    expect(recent(0)).toEqual([]);
    expect(recent(10_000).length).toBe(CONTENT.length);
  });

  it("recent does not mutate the registry", () => {
    const before = CONTENT.map(i => i.slug);
    recent(5);
    byKind("news");
    expect(CONTENT.map(i => i.slug)).toEqual(before);
  });

  it("countsByKind totals to the registry size", () => {
    const counts = countsByKind();
    const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
    expect(total).toBe(CONTENT.length);
  });
});

describe("badges", () => {
  it("uses the override when present", () => {
    const patent = bySlug("health-band-neuro-patent")!;
    expect(badgeOf(patent)).toBe("Patent");
  });

  it("falls back to the kind label", () => {
    const item = { kind: "white-paper", tags: [] } as unknown as ContentItem;
    expect(badgeOf(item)).toBe("White Paper");
  });
});

describe("formatDate", () => {
  it("renders month and year", () => {
    expect(formatDate("2026-07-01")).toBe("July 2026");
    expect(formatDate("2025-12-31")).toBe("December 2025");
  });

  it("does not shift the month across timezones", () => {
    // new Date("2026-07-01") is UTC midnight; rendering it locally anywhere
    // west of Greenwich yields 30 June. formatDate reads the string instead.
    expect(formatDate("2026-01-01")).toBe("January 2026");
    expect(formatDate("2026-12-01")).toBe("December 2026");
  });

  it("returns the input unchanged when it cannot parse it", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
    expect(formatDate("2026-13-01")).toBe("2026-13-01");
  });
});
