/**
 * Invariants for the programme registry.
 *
 * A programme is a claim about what the Foundation does, published on a public
 * site by a 501(c)(3). The tests that matter here are the ones that stop it
 * claiming more than is true — an "open" programme with nowhere to apply, or a
 * "planned" one with a link implying otherwise.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  PROGRAMMES,
  STATUS_LABEL,
  TRACK_LABEL,
  byTrack,
  isActive,
  type ProgrammeTrack,
} from "../../client/src/data/programmes";

describe("registry integrity", () => {
  it("is not empty", () => {
    // Every assertion below passes vacuously on an empty array.
    expect(PROGRAMMES.length).toBeGreaterThan(5);
  });

  it("has unique slugs and names", () => {
    expect(new Set(PROGRAMMES.map(p => p.slug)).size).toBe(PROGRAMMES.length);
    expect(new Set(PROGRAMMES.map(p => p.name)).size).toBe(PROGRAMMES.length);
  });

  it("gives every programme a name and a summary someone can act on", () => {
    for (const p of PROGRAMMES) {
      expect(p.name.trim(), `${p.slug} name`).not.toBe("");
      expect(
        p.summary.trim().length,
        `${p.slug} summary too short`
      ).toBeGreaterThan(40);
    }
  });

  it("labels every status and track in use", () => {
    for (const p of PROGRAMMES) {
      expect(STATUS_LABEL[p.status], `no label for ${p.status}`).toBeTruthy();
      expect(TRACK_LABEL[p.track], `no label for ${p.track}`).toBeTruthy();
    }
  });
});

describe("claims match reality", () => {
  it("an active programme has somewhere to go", () => {
    // "Open to all" with no link tells a reader they can join something and
    // then gives them no way to do it. Either the status is wrong or the link
    // is missing; both are worth failing on.
    const unreachable = PROGRAMMES.filter(p => isActive(p) && !p.href);
    expect(
      unreachable.map(p => p.slug),
      "active programmes with no href"
    ).toEqual([]);
  });

  it("a planned programme does not link anywhere", () => {
    // A link on a planned programme implies it is running. A page that cannot
    // answer "how do I join" is worse than no link at all.
    const premature = PROGRAMMES.filter(p => p.status === "planned" && p.href);
    expect(
      premature.map(p => p.slug),
      "planned programmes with an href"
    ).toEqual([]);
  });

  it("keeps planned distinct from paused", () => {
    // Collapsing them loses what a reader needs: whether to wait or to ask.
    expect(STATUS_LABEL.planned).not.toBe(STATUS_LABEL.paused);
  });

  it("every programme is currently planned, and says so", () => {
    // Not an aspiration — a record of what was verifiable when this was
    // written. No evidence was found that any of these run: "Ambassador"
    // appears nowhere in the codebase, and the only "grant" is a donor
    // preparing an application *to* the Foundation.
    //
    // When one genuinely starts, this test fails and should be updated
    // alongside the status. That is the point: an honest claim is cheap to
    // make and this makes changing it deliberate.
    const running = PROGRAMMES.filter(p => p.status !== "planned");
    expect(
      running.map(p => `${p.slug}=${p.status}`),
      "a programme claims to be running — confirm it does before updating this test"
    ).toEqual([]);
  });
});

describe("tracks", () => {
  it("partitions the registry without loss or overlap", () => {
    const tracks: ProgrammeTrack[] = ["community", "research", "marketing"];
    const total = tracks.reduce((n, t) => n + byTrack(t).length, 0);
    expect(total).toBe(PROGRAMMES.length);
  });

  it("byTrack returns only that track", () => {
    for (const t of [
      "community",
      "research",
      "marketing",
    ] as ProgrammeTrack[]) {
      expect(byTrack(t).every(p => p.track === t)).toBe(true);
    }
  });

  it("every track that has programmes is rendered somewhere", () => {
    // A track with entries and no page is data nobody can see.
    const research = readFileSync(
      join(__dirname, "../../client/src/pages/Research.tsx"),
      "utf-8"
    );
    const involved = readFileSync(
      join(__dirname, "../../client/src/pages/GetInvolved.tsx"),
      "utf-8"
    );
    const rendered = research + involved;
    for (const t of ["community", "research"] as ProgrammeTrack[]) {
      if (byTrack(t).length === 0) continue;
      expect(rendered, `${t} track is not rendered on any page`).toContain(
        `track="${t}"`
      );
    }
  });

  it("marketing programmes are declared but not yet surfaced", () => {
    // Recorded rather than hidden. They belong on a marketing or membership
    // page that does not exist yet; asserting it keeps the gap visible instead
    // of letting three entries sit in the registry unnoticed.
    expect(byTrack("marketing").length).toBeGreaterThan(0);
  });
});
