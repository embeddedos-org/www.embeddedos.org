/**
 * Catch unreadable text utilities before a browser has to.
 *
 * Two colour-contrast failures reached master in quick succession, both the
 * same shape: a low-alpha white used for a caption because it looked right on
 * the author's screen. `text-white/25` measured 2.14:1 and `text-white/45`
 * measured 4.36:1, against the 4.5:1 WCAG 2.1 asks for normal text.
 *
 * axe catches these, but only on the routes the accessibility suite visits, and
 * only after a full build and browser run. This is the same check as a grep,
 * runs in milliseconds, and covers every component including the ones no e2e
 * test opens — which is exactly where the last one was hiding.
 *
 * It deliberately does not compute contrast. The page backgrounds vary, and the
 * honest threshold is empirical: on the two grounds the site actually uses,
 * #0B1D3A and #080F1E, white at 50% opacity is the lowest value that clears
 * 4.5:1 (5.08:1 and 5.31:1 respectively). Anything below that is unreadable
 * somewhere on the site, so the rule is a floor rather than a calculation.
 *
 * ## Why there is a baseline
 *
 * When this check was first run it found 289 occurrences across 67 files. Those
 * are a real finding and they are not fixed here: several sit on lighter card
 * grounds where the same value may well pass, and the accessibility suite
 * currently passes on all 21 routes it visits. Rewriting 289 colours across the
 * site on the strength of a grep would be an unverified visual change to almost
 * every page, which is a worse trade than leaving a known, measured debt.
 *
 * So BASELINE freezes that set and the rule applies to everything else. The
 * list may only ever shrink: deleting a line is how a file gets fixed, and a
 * new file cannot be added to it. That keeps the debt from growing while the
 * existing pages are worked through page by page against a real browser.
 */

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = join(__dirname, "../../client/src");

/**
 * The lowest white opacity that clears 4.5:1 on every ground the site uses.
 * Raising a background lighter than #0B1D3A would let a lower value through,
 * but nothing on the site does that today.
 */
const MIN_WHITE_ALPHA = 50;

/**
 * Greys whose contrast is too low on the dark grounds, measured rather than
 * guessed: gray-600 is 1.95:1 and gray-500 is 3.04:1 against a bg-white/5 card
 * over #0B1D3A. gray-400 is 5.79:1 and is fine.
 */
const BANNED_GRAYS = ["text-gray-500", "text-gray-600", "text-gray-700"];

/**
 * Files that already carried low-contrast utilities when this check was added.
 *
 * 289 occurrences across these 67 files. Remove a path when its colours have
 * been checked in a browser and raised — never add one.
 */
const BASELINE = new Set<string>([
  "src/components/AeroSwift3D.tsx",
  "src/components/BootPipeline.tsx",
  "src/components/DonateModal.tsx",
  "src/components/Footer.tsx",
  "src/components/HealthShowcase.tsx",
  "src/components/Navbar.tsx",
  "src/components/ProductDetailPage.tsx",
  "src/components/ProgrammeList.tsx",
  "src/components/SearchModal.tsx",
  "src/pages/About.tsx",
  "src/pages/Aerospace.tsx",
  "src/pages/ApiDocs.tsx",
  "src/pages/Architecture.tsx",
  "src/pages/Article.tsx",
  "src/pages/Books.tsx",
  "src/pages/Careers.tsx",
  "src/pages/Certification.tsx",
  "src/pages/Changelog.tsx",
  "src/pages/Contact.tsx",
  "src/pages/Demo.tsx",
  "src/pages/Docs.tsx",
  "src/pages/Donate.tsx",
  "src/pages/Downloads.tsx",
  "src/pages/EAI.tsx",
  "src/pages/EAIEdge.tsx",
  "src/pages/EApps.tsx",
  "src/pages/EBoot.tsx",
  "src/pages/EBrowser.tsx",
  "src/pages/EBuildPage.tsx",
  "src/pages/EFlow.tsx",
  "src/pages/EHealth365.tsx",
  "src/pages/EIPC.tsx",
  "src/pages/ENI.tsx",
  "src/pages/EOSuite.tsx",
  "src/pages/EOffice.tsx",
  "src/pages/ERadar360.tsx",
  "src/pages/EServiceApps.tsx",
  "src/pages/EcadHardware.tsx",
  "src/pages/Ecosystem.tsx",
  "src/pages/EoS.tsx",
  "src/pages/EoStudio.tsx",
  "src/pages/Events.tsx",
  "src/pages/FAQ.tsx",
  "src/pages/GetInvolved.tsx",
  "src/pages/GettingStarted.tsx",
  "src/pages/HardwareLab.tsx",
  "src/pages/Health.tsx",
  "src/pages/HealthCompare.tsx",
  "src/pages/Home.tsx",
  "src/pages/Industries.tsx",
  "src/pages/Internship.tsx",
  "src/pages/Licenses.tsx",
  "src/pages/Mission.tsx",
  "src/pages/NeuralLinkAI.tsx",
  "src/pages/News.tsx",
  "src/pages/NotFound.tsx",
  "src/pages/Organization.tsx",
  "src/pages/Patents.tsx",
  "src/pages/Products.tsx",
  "src/pages/Projects.tsx",
  "src/pages/Quantum.tsx",
  "src/pages/Research.tsx",
  "src/pages/Resources.tsx",
  "src/pages/Roadmap.tsx",
  "src/pages/Stacks.tsx",
  "src/pages/Transparency.tsx",
  "src/pages/WhatWeDo.tsx",
]);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx$/.test(entry) ? [full] : [];
  });
}

/**
 * Strip block and line comments.
 *
 * Without this the test fails on its own explanations — the comments above name
 * the very classes being banned, and so do the ones left in the components
 * recording why a value was raised.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

describe("text contrast floors", () => {
  const files = sourceFiles(SRC);

  it("finds components to check", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("uses no white text below the readable opacity floor", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const rel = file.replace(SRC, "src");
      if (BASELINE.has(rel)) continue;
      const src = stripComments(readFileSync(file, "utf-8"));
      for (const m of src.matchAll(/text-white\/(\d+)\b/g)) {
        if (Number(m[1]) < MIN_WHITE_ALPHA) {
          offenders.push(`${rel}: ${m[0]}`);
        }
      }
    }
    expect(
      offenders,
      `below ${MIN_WHITE_ALPHA}% white — unreadable on at least one page ground`
    ).toEqual([]);
  });

  it("uses none of the greys that fail on a dark ground", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const rel = file.replace(SRC, "src");
      if (BASELINE.has(rel)) continue;
      const src = stripComments(readFileSync(file, "utf-8"));
      for (const gray of BANNED_GRAYS) {
        if (new RegExp(`\\b${gray}\\b`).test(src)) {
          offenders.push(`${rel}: ${gray}`);
        }
      }
    }
    expect(offenders, "greys under 4.5:1 on the dark grounds").toEqual([]);
  });
});

describe("the baseline only shrinks", () => {
  it("lists only files that still exist", () => {
    // A stale path silently exempts nothing and hides that the debt was paid.
    const present = new Set(sourceFiles(SRC).map(f => f.replace(SRC, "src")));
    const stale = [...BASELINE].filter(f => !present.has(f));
    expect(stale, "baseline entries for files that are gone").toEqual([]);
  });

  it("still exempts no more than the 67 files it started with", () => {
    expect(BASELINE.size).toBeLessThanOrEqual(67);
  });
});
