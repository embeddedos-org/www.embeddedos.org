/**
 * The industries data makes claims about hardware that exists. This file checks
 * the claims against the repositories rather than trusting the copy.
 *
 * Two failures are worth catching automatically, because both are invisible on
 * the rendered page and both would be found by a grant reviewer instead:
 *
 * 1. A `referenceDesign.repoPath` that points at nothing. The page prints the
 *    path as provenance, so a stale path is a citation to a source that is not
 *    there.
 * 2. A TRL band that does not follow from the recorded status. The bands are
 *    derived, not assessed, and the derivation is the only thing that makes them
 *    defensible.
 *
 * The sibling repositories live outside this project, so the provenance check
 * skips when they are not checked out (a fresh CI clone) and runs when they are.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { INDUSTRIES, industriesInGroup } from "../../client/src/data/industries";

/** Where the sibling design repositories are checked out, if they are. */
const SIBLINGS = path.resolve(__dirname, "../../..");
const siblingsPresent = fs.existsSync(
  path.join(SIBLINGS, "eCAD-Hardware-Products")
);

describe("industry coverage", () => {
  it("covers the core and frontier sectors", () => {
    expect(industriesInGroup("core").length).toBe(34);
    expect(industriesInGroup("frontier").length).toBe(4);
    expect(INDUSTRIES.length).toBe(38);
  });

  it("gives every industry a unique id", () => {
    const ids = INDUSTRIES.map(i => i.id);
    expect(new Set(ids).size, "duplicate industry ids").toBe(ids.length);
  });

  it("names at least one target standard for every industry", () => {
    const bare = INDUSTRIES.filter(i => i.targetStandards.length === 0).map(
      i => i.name
    );
    expect(bare, "industries with no target standard").toEqual([]);
  });

  it("gives every industry a funding theme and a maturity status", () => {
    for (const i of INDUSTRIES) {
      expect(i.fundingTheme, `${i.name} funding theme`).toBeTruthy();
      expect(i.maturity.status.length, `${i.name} status`).toBeGreaterThan(5);
    }
  });
});

describe("maturity claims are derived, not invented", () => {
  it("maps each status kind to its documented TRL band", () => {
    const expected: Record<string, string | null> = {
      concept: "TRL 1-2",
      research: "TRL 2-3",
      design: "TRL 3-4",
      documented: "TRL 4",
      sought: null,
    };
    for (const i of INDUSTRIES) {
      expect(i.maturity.trl, `${i.name} (${i.maturity.kind})`).toBe(
        expected[i.maturity.kind]
      );
    }
  });

  it("claims TRL 5 or above nowhere", () => {
    // No physical qualification campaign has been run against any design.
    const overstated = INDUSTRIES.filter(i =>
      /TRL\s*[5-9]/.test(i.maturity.trl ?? "")
    ).map(i => i.name);
    expect(overstated, "TRL 5+ requires a qualification campaign").toEqual([]);
  });

  it("leaves TRL unset exactly where no design exists", () => {
    for (const i of INDUSTRIES) {
      const hasDesign = i.referenceDesign !== null;
      expect(
        i.maturity.trl !== null,
        `${i.name}: TRL band and reference design must agree`
      ).toBe(hasDesign);
    }
  });

  it("describes no industry as certified or production ready", () => {
    // The health CAD datasheets say "Production Ready" while
    // eos-health/PRODUCT_MATURITY_ROADMAP.md says physical testing and the FDA
    // 510(k) submission are pending. The conservative source wins on the site.
    const banned = /\b(certified|production[- ]ready)\b/i;
    const offenders = INDUSTRIES.filter(
      i =>
        banned.test(i.maturity.status) ||
        banned.test(i.referenceDesign?.note ?? "")
    ).map(i => i.name);
    expect(offenders, "unsupportable maturity wording").toEqual([]);
  });
});

describe("reference designs are real", () => {
  it.skipIf(!siblingsPresent)(
    "points every cited repository path at something that exists",
    () => {
      const missing: string[] = [];
      for (const i of INDUSTRIES) {
        if (!i.referenceDesign) continue;
        const full = path.join(SIBLINGS, i.referenceDesign.repoPath);
        if (!fs.existsSync(full)) {
          missing.push(`${i.name} -> ${i.referenceDesign.repoPath}`);
        }
      }
      expect(missing, "cited paths that do not exist").toEqual([]);
    }
  );

  it("states a design or states its absence, never an empty field", () => {
    for (const i of INDUSTRIES) {
      if (i.referenceDesign === null) {
        expect(i.maturity.kind, `${i.name} without a design`).toBe("sought");
        continue;
      }
      expect(i.referenceDesign.name.length, `${i.name} design name`).toBeGreaterThan(2);
      expect(i.referenceDesign.repoPath, `${i.name} repo path`).toMatch(/\w+\/\w+/);
    }
  });
});
