/**
 * The site must cover the published organisational design, exactly.
 *
 * DESIGN_MARKETING and DESIGN_RESEARCH below are transcribed from the
 * Foundation's structure document. They are duplicated here on purpose: if the
 * test derived its expectations from categories.ts, it would pass no matter
 * what the site actually covered, which is the failure mode of most
 * "everything is wired up" tests.
 *
 * The comparison runs both ways. A missing category is an unimplemented part of
 * the design; an extra one is a page nobody agreed to publish, which matters
 * for a foundation whose credibility rests on not overstating itself.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ALL_CATEGORIES,
  MARKETING_CATEGORIES,
  RESEARCH_CATEGORIES,
  categoryByPath,
} from "../../client/src/data/categories";
import { CONTENT } from "../../client/src/data/content";
import { PROGRAMMES } from "../../client/src/data/programmes";

/** Marketing, verbatim from the design document. */
const DESIGN_MARKETING = [
  "Blog",
  "News",
  "Press Releases",
  "Newsletter",
  "Case Studies",
  "Member Stories",
  "Product Showcases",
  "Project Showcases",
  "Videos",
  "YouTube",
  "Podcast",
  "Webinars",
  "Social Media",
  "Conference Presence",
  "Community Meetups",
  "Ambassador Program",
  "University Program",
  "Member Marketing",
  "Partner Marketing",
  "Brand Assets",
  "Media/Press Kit",
];

/** Research, verbatim from the design document. */
const DESIGN_RESEARCH = [
  "Publications",
  "White Papers",
  "Technical Reports",
  "Benchmarks",
  "Architecture Research",
  "Security Research",
  "AI Research",
  "Embedded Systems Research",
  "RTOS Research",
  "Linux Research",
  "Hardware Research",
  "Networking Research",
  "University Collaborations",
  "Industry Collaborations",
  "Grants",
  "Research Dataset",
];

describe("design coverage", () => {
  it("covers all 21 marketing categories, in order", () => {
    expect(MARKETING_CATEGORIES.map(c => c.name)).toEqual(DESIGN_MARKETING);
  });

  it("covers all 16 research categories, in order", () => {
    expect(RESEARCH_CATEGORIES.map(c => c.name)).toEqual(DESIGN_RESEARCH);
  });

  it("publishes 37 categories and no more", () => {
    expect(ALL_CATEGORIES).toHaveLength(37);
  });
});

describe("routing", () => {
  const app = readFileSync(
    join(__dirname, "../../client/src/App.tsx"),
    "utf-8"
  );

  it("serves every category at its own route", () => {
    // The whole point of the exercise: a category in the design with no route
    // is a part of the structure the site claims but does not have.
    const unrouted = ALL_CATEGORIES.filter(
      c => !app.includes(`path="${c.path}"`)
    ).map(c => `${c.name} (${c.path})`);
    expect(unrouted).toEqual([]);
  });

  it("gives every category a distinct path", () => {
    const paths = ALL_CATEGORIES.map(c => c.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("resolves each path back to its category", () => {
    for (const c of ALL_CATEGORIES) {
      expect(categoryByPath(c.path)?.name).toBe(c.name);
    }
  });
});

describe("bindings resolve", () => {
  it("every programme binding names a real programme", () => {
    const slugs = new Set(PROGRAMMES.map(p => p.slug));
    const dangling = ALL_CATEGORIES.filter(
      c => c.binding.type === "programme" && !slugs.has(c.binding.slug)
    ).map(c => c.name);
    expect(dangling).toEqual([]);
  });

  it("binds all nine programmes, each exactly once", () => {
    // A programme with no category is unreachable; one bound twice would
    // appear at two URLs and split its own search ranking.
    const bound = ALL_CATEGORIES.flatMap(c =>
      c.binding.type === "programme" ? [c.binding.slug] : []
    );
    expect(bound.sort()).toEqual(PROGRAMMES.map(p => p.slug).sort());
  });

  it("binds every content kind used in the registry", () => {
    // A kind with entries but no category means published content with no page
    // to reach it from.
    const boundKinds = new Set(
      ALL_CATEGORIES.flatMap(c =>
        c.binding.type === "kind" ? [c.binding.kind] : []
      )
    );
    const orphaned = [...new Set(CONTENT.map(i => i.kind))].filter(
      k => !boundKinds.has(k)
    );
    expect(orphaned).toEqual([]);
  });

  it("binds all eight research areas", () => {
    const areas = ALL_CATEGORIES.flatMap(c =>
      c.binding.type === "area" ? [c.binding.area] : []
    );
    expect(areas).toHaveLength(8);
    expect(new Set(areas).size).toBe(8);
  });
});

describe("honesty of empty categories", () => {
  it("every empty content category explains what goes there", () => {
    // The rule this file enforces: a category with nothing published may ship
    // a page, but only one that says so and is useful anyway. A bare heading
    // over an empty list is the placeholder the standard forbids.
    const bare = ALL_CATEGORIES.filter(c => {
      if (c.binding.type === "kind") {
        return (
          CONTENT.filter(i => i.kind === (c.binding as { kind: string }).kind)
            .length === 0 && !c.emptyNote
        );
      }
      if (c.binding.type === "area") {
        return (
          CONTENT.filter(i => i.area === (c.binding as { area: string }).area)
            .length === 0 && !c.emptyNote
        );
      }
      return false;
    }).map(c => c.name);
    expect(bare, "empty categories with no explanation").toEqual([]);
  });

  it("does not carry an empty note for a category that has content", () => {
    // A stale "nothing here yet" under a list of five items reads as neglect
    // and undermines every other claim on the page.
    const stale = ALL_CATEGORIES.filter(c => {
      if (!c.emptyNote) return false;
      if (c.binding.type === "kind")
        return CONTENT.some(
          i => i.kind === (c.binding as { kind: string }).kind
        );
      if (c.binding.type === "area")
        return CONTENT.some(
          i => i.area === (c.binding as { area: string }).area
        );
      return false;
    }).map(c => c.name);
    expect(stale, "categories whose empty note is now wrong").toEqual([]);
  });

  it("gives every category a summary that is a real sentence", () => {
    for (const c of ALL_CATEGORIES) {
      expect(c.summary.length, c.name).toBeGreaterThan(40);
      expect(c.summary.trim().endsWith("."), `${c.name} summary`).toBe(true);
    }
  });
});
