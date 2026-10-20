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
    "eCAD HARDWARE DESIGNS · MIT LICENSE, EXCEPT EoS BOARDS",
  ],
  [
    "client/src/pages/EcadHardware.tsx",
    "The repository is MIT-licensed, except the original EoS development boards, which are all rights reserved.",
  ],
  [
    "client/src/pages/About.tsx",
    "published openly under MIT license, except the original EoS development boards, which are all rights reserved.",
  ],
  [
    "client/src/pages/About.tsx",
    "MIT License (all repositories, except the EoS board designs)",
  ],
];

/** Blanket claims that would cover the EoS boards unless they name them. */
const BLANKET = [
  /all hardware designs are open hardware/i,
  /hardware designs · MIT license/i,
  /MIT License \(all repositories/i,
  /every design decision[^."]{0,80}MIT license/i,
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
});
