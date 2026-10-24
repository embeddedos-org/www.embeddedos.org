/**
 * The original EoS development boards on /eos-boards are Copyright (c) 2026
 * Kartikeydheer Srivastava, all rights reserved. Licence statements written
 * before the site hosted them said that every hardware design is open
 * hardware or MIT licensed, and the footer's "MIT License" sat under the
 * boards on every page. Each statement now leaves the boards out. These tests
 * pin the exact wording, and fail if a blanket claim comes back without the
 * exception.
 *
 * Source text is compared with its whitespace collapsed, which is how JSX
 * renders text that wraps across lines.
 */
import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "../..");
const collapsed = (file: string) =>
  readFileSync(path.join(ROOT, file), "utf8").replace(/\s+/g, " ");

const PINNED: readonly (readonly [string, string])[] = [
  [
    "client/src/components/Footer.tsx",
    "EoS board designs: all rights reserved",
  ],
  ["client/src/components/Footer.tsx", 'href="/eos-boards#licence"'],
  [
    "client/src/pages/Terms.tsx",
    "**EoS Development Boards:** The original EoS board designs on /eos-boards, with their renders, videos, KiCad files and board licences, are not covered by the MIT License or the permission above: they are Copyright (c) 2026 Kartikeydheer Srivastava, all rights reserved, each board's LICENSE.txt governs it, and the Foundation has a limited, revocable permission to use them.",
  ],
  [
    "client/src/pages/GetInvolved.tsx",
    "All hardware designs are open hardware, except the original EoS development boards, which are all rights reserved.",
  ],
  [
    "client/src/pages/EcadHardware.tsx",
    "eCAD HARDWARE DESIGNS · MIT LICENSE, EXCEPT EoS BOARDS AND MIRRORED DESIGNS",
  ],
  [
    "client/src/pages/EcadHardware.tsx",
    "The repository is MIT-licensed, except the original EoS development boards, which are all rights reserved, and the manufacturer designs mirrored under boards/cad, which keep their manufacturers' licences.",
  ],
  // The homepage's eCAD hall paragraph lives with the story's chapters; the hero's eyebrow line ("Foundation ·
  // 501(c)(3) · MIT License (software)") was removed at the owner's request, since the header logo carries it.
  [
    "client/src/black/Chapters.tsx",
    "The repository is published under the MIT licence, except the original EoS development boards, which are all rights reserved, and the manufacturer designs mirrored under boards/cad, which keep their manufacturers' licences.",
  ],
  [
    "client/src/pages/Home.tsx",
    "Open Source · 501(c)(3) · MIT License (software)",
  ],
  ["client/src/data/foundation.ts", "All Foundation software is MIT licensed."],
  [
    "client/src/pages/WhatWeDo.tsx",
    "FOUNDATION · 501(C)(3) · MIT LICENSE (SOFTWARE)",
  ],
  [
    "client/src/pages/Membership.tsx",
    "501(c)(3) · Tax-deductible donations · MIT License (software) · No vendor",
  ],
  [
    "client/src/pages/Transparency.tsx",
    "All Foundation software is released under the ${FOUNDATION.softwareLicense}.",
  ],
  [
    "client/src/pages/GettingStarted.tsx",
    "All EmbeddedOS software repositories, MIT licensed, in one list.",
  ],
  [
    "client/src/pages/About.tsx",
    "published openly under MIT license, except the original EoS development boards, which are all rights reserved.",
  ],
  ["client/src/pages/About.tsx", "MIT License (all Foundation software)"],
];

/** Blanket claims that would cover the EoS boards unless they name them. */
const BLANKET = [
  /all hardware designs are open hardware/i,
  /hardware designs · MIT license/i,
  /MIT License \(all repositories/i,
  /every design decision[^."]{0,80}MIT license/i,
  /repository is (published under the )?MIT/i,
];

/**
 * Repository-wide or unscoped MIT claims. eCAD-Hardware-Products is one of the
 * Foundation's repositories and holds the boards, so these must say "software"
 * instead (25 repositories, "23 of them MIT licensed", as the home page says).
 */
const UNSCOPED = [
  /every (foundation )?repository is/i,
  /all (embeddedos |foundation )?repositories(,| are) MIT/i,
  /· MIT License(?! \(software\))(?!, except)/i,
];

/** Left as written, each with its reason. */
const EXEMPT: readonly (readonly [string, string])[] = [
  // A dated news item (2026-01-01) about the 22 repositories as they were then.
  ["client/src/data/content.ts", "All repositories are MIT-licensed"],
];

describe("licence statements leave the EoS development boards out", () => {
  it.each(PINNED)("%s says: %s", (file, text) => {
    expect(collapsed(file)).toContain(text);
  });

  it("the footer scopes both of its MIT mentions to software", () => {
    const footer = collapsed("client/src/components/Footer.tsx");
    expect(
      footer.split("{FOUNDATION.softwareLicense} (software)")
    ).toHaveLength(3);
    expect(footer).not.toMatch(
      /\{FOUNDATION\.softwareLicense\}(?! \(software\))/
    );
  });

  it("no page claims every hardware design is open or MIT without the exception", () => {
    const files = globSync("client/src/**/*.{ts,tsx}", { cwd: ROOT });
    expect(files.length).toBeGreaterThan(50);
    const unqualified: string[] = [];
    for (const file of files) {
      const text = collapsed(file);
      for (const claim of BLANKET)
        for (const m of text.matchAll(new RegExp(claim, "gi"))) {
          const sentence = text.slice(m.index, m.index + 200);
          if (!/except[^.]{0,40}\bEoS\b/i.test(sentence))
            unqualified.push(`${file}: ${sentence.slice(0, 80)}`);
        }
    }
    expect(unqualified).toEqual([]);
  });

  it("no page makes a repository-wide or unscoped MIT claim", () => {
    const files = globSync("client/src/**/*.{ts,tsx}", { cwd: ROOT });
    const unscoped: string[] = [];
    for (const file of files) {
      const text = collapsed(file);
      for (const claim of UNSCOPED)
        for (const m of text.matchAll(new RegExp(claim, "gi"))) {
          const sentence = text.slice(m.index, m.index + 120);
          const exempt = EXEMPT.some(
            ([f, snippet]) => f === file && sentence.includes(snippet)
          );
          if (!exempt) unscoped.push(`${file}: ${sentence.slice(0, 80)}`);
        }
    }
    expect(unscoped).toEqual([]);
  });
});
