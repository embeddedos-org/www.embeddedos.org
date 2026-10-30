/** @vitest-environment jsdom */

/**
 * /open-hardware is built from real artefacts, so its promises are about
 * files: every image it names ships as an optimized JPEG with a WebP sibling,
 * both videos ship with a poster and captions, and the captions never run past
 * their video. The render checks hold the accessibility side: alt text and
 * intrinsic size on every image, and captions tracks that do not load a video
 * until it is played. The licence counts must add up to the mirrored boards.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import OpenHardware, {
  GALLERY,
  LICENCE_TERMS,
  HELPER_SCRIPTS,
  RULES,
  SETUP,
  STATS,
  STATS_AS_OF,
  USAGE,
  VALIDATION,
} from "../../client/src/pages/OpenHardware";
import {
  ECAD_MIRROR,
  GUIDE_RUN,
  formatCount,
  formatSize,
} from "../../client/src/data/ecad-mirror";

const media = path.resolve(__dirname, "../../client/public/media");
const VIDEOS = [
  { name: "open-hardware-tour", seconds: 68.8, cues: 13 },
  { name: "open-hardware-howto", seconds: 45.3, cues: 8 },
];

const pageImages = [
  "open-hardware-terminal-mirror",
  ...USAGE.map(u => u.file),
  ...GALLERY.flatMap(g => g.shots.map(s => s.file)),
  ...VALIDATION.map(v => v.file),
];

afterEach(() => {
  cleanup();
});

describe("open hardware media", () => {
  it("ships every image as a JPEG with a WebP sibling", () => {
    const missing = pageImages.flatMap(name =>
      [".jpg", ".webp"]
        .map(ext => `${name}${ext}`)
        .filter(file => !existsSync(path.join(media, file)))
    );
    expect(missing).toEqual([]);
  });

  it("ships each video with its poster and captions", () => {
    for (const { name } of VIDEOS) {
      for (const file of [`${name}.mp4`, `${name}-poster.jpg`, `${name}.vtt`]) {
        expect(existsSync(path.join(media, file)), file).toBe(true);
      }
    }
  });

  it("states each video's real length", () => {
    for (const { name, seconds } of VIDEOS) {
      const mp4 = readFileSync(path.join(media, `${name}.mp4`));
      const mvhd = mp4.indexOf("mvhd");
      expect(mvhd, name).toBeGreaterThan(0);
      expect(mp4.indexOf("moov"), `${name} faststart`).toBeLessThan(
        mp4.indexOf("mdat")
      );
      const version = mp4[mvhd + 4];
      const timescale = mp4.readUInt32BE(mvhd + (version === 1 ? 24 : 16));
      const duration =
        version === 1
          ? Number(mp4.readBigUInt64BE(mvhd + 28))
          : mp4.readUInt32BE(mvhd + 20);
      expect(duration / timescale, name).toBeCloseTo(seconds, 1);
    }
  });

  it("keeps each video's captions inside the video", () => {
    for (const { name, seconds, cues } of VIDEOS) {
      const vtt = readFileSync(path.join(media, `${name}.vtt`), "utf8");
      expect(vtt.startsWith("WEBVTT"), name).toBe(true);
      const ends = [...vtt.matchAll(/--> (\d\d):(\d\d):(\d\d\.\d{3})/g)].map(
        m => Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])
      );
      expect(ends.length, name).toBe(cues);
      expect(Math.max(...ends), name).toBeLessThanOrEqual(seconds);
    }
  });

  it("counts every mirrored board under exactly one licence", () => {
    const boards = STATS.find(s => s.label.startsWith("boards with"));
    expect(LICENCE_TERMS.reduce((n, l) => n + l.boards, 0)).toBe(
      Number(boards?.value)
    );
  });

  it("names a real design file and a licence for every rendered board", () => {
    for (const shot of GALLERY.flatMap(g => g.shots)) {
      expect(shot.source, shot.board).toMatch(
        // a design file, or a Gerber folder (the mirror unpacks Gerber zips)
        /(\.(kicad_pcb|kicad_sch|brd|stp|step)|-Gerbers\/)$/
      );
      expect(shot.licence, shot.board).toMatch(/^(CC BY|MIT|Apache)/);
    }
  });
});

describe("open hardware page", () => {
  it("renders the heading, every image with alt text and size, and the captioned video", () => {
    const { container } = render(<OpenHardware />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /open hardware you can verify/i,
      })
    ).toBeInTheDocument();

    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBe(pageImages.length);
    for (const img of images) {
      expect(img.getAttribute("alt")?.length ?? 0).toBeGreaterThan(20);
      expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
    }

    const videos = [...container.querySelectorAll("video")];
    expect(videos.map(v => v.getAttribute("poster"))).toEqual(
      VIDEOS.map(v => `/media/${v.name}-poster.jpg`)
    );
    for (const video of videos) {
      expect(video.getAttribute("preload")).toBe("none");
      expect(video.querySelector('track[kind="captions"]')).not.toBeNull();
    }
  });

  it("numbers the six usage steps in order", () => {
    render(<OpenHardware />);
    expect(
      screen.getByRole("heading", { level: 2, name: "How to use the files" })
    ).toBeInTheDocument();
    expect(USAGE.length).toBe(6);
    for (const step of USAGE) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title })
      ).toBeInTheDocument();
    }
  });

  it("gives every gallery group a second-level heading", () => {
    render(<OpenHardware />);
    for (const group of GALLERY) {
      expect(
        screen.getByRole("heading", { level: 2, name: group.heading })
      ).toBeInTheDocument();
    }
  });
});

describe("open hardware figures are dated", () => {
  it("names the eCAD commit and date the figures were counted on", () => {
    expect(STATS_AS_OF.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(STATS_AS_OF.date).toMatch(/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
  });

  it("does not claim the 3D renders use the STEP files' own colours", () => {
    // An independent re-render of the BeagleBone AI-64 STEP showed its
    // connectors in the file's colours, not the page's; only shapes are claimed.
    const intro = GALLERY.find(g => g.intro.includes("STEP model"))?.intro;
    expect(intro).toBeDefined();
    expect(intro).not.toMatch(/colours its manufacturer gave/);
    expect(intro).toMatch(/shading colours are the renderer's/);
  });

  it("names the Gerber folder the mirror holds, not the old zip", () => {
    const source = readFileSync(
      path.resolve(__dirname, "../../client/src/pages/OpenHardware.tsx"),
      "utf8"
    );
    expect(source).not.toContain("Apollo3-Gerbers.zip");
    expect(source).toContain('"SparkFun_TensorFlow_Ambiq_Apollo3-Gerbers/"');
  });
});

function commands(lines: readonly string[]): string[] {
  const out: string[] = [];
  let pending = "";
  let heredoc: string | null = null;
  for (const line of lines) {
    if (heredoc !== null) {
      if (line === heredoc) heredoc = null;
      continue;
    }
    const joined = pending + line;
    if (joined.endsWith(" \\")) {
      pending = joined.slice(0, -1);
      continue;
    }
    pending = "";
    const command = joined.replace(/\s+/g, " ").trim();
    out.push(command);
    heredoc = command.match(/<<'(\w+)'$/)?.[1] ?? null;
  }
  return out;
}

const tokens = (command: string) =>
  command.split(" ").map(t => t.replace(/^['"]|['"]$/g, ""));

const GUIDE = [SETUP, ...USAGE.map(u => u.code)].map(commands);

describe("the how-to guide runs as printed, in one shell", () => {
  it("clones the repository before step 1 queries it", () => {
    const step1 = GUIDE[1];
    const clone = step1.findIndex(c => c.startsWith("git clone "));
    const cd = step1.indexOf("cd eCAD-Hardware-Products");
    const query = step1.findIndex(c => c.includes("query.py"));
    expect(clone).toBe(0);
    expect(cd).toBeGreaterThan(clone);
    expect(query).toBeGreaterThan(cd);
  });

  it("checks out every path a step reads before the step reads it", () => {
    let patterns: string[] = [];
    const unfetched: string[] = [];
    for (const command of GUIDE.flat()) {
      const words = tokens(command);
      const sparse = command.match(/^git sparse-checkout (set|add) /);
      if (sparse) {
        const added = words.filter(w => w.startsWith("/")).map(w => w.slice(1));
        patterns = sparse[1] === "set" ? added : [...patterns, ...added];
        continue;
      }
      for (const word of words.filter(w => /^(boards|tools)\//.test(w))) {
        if (!patterns.some(p => word.startsWith(p) || `${word}/` === p)) {
          unfetched.push(word);
        }
      }
    }
    expect(unfetched).toEqual([]);
  });

  it("saves each helper script before a step runs it", () => {
    const saved: string[] = [];
    const missing: string[] = [];
    for (const command of GUIDE.flat()) {
      const save = command.match(/^cat > (\S+) <<'EOF'$/);
      if (save) saved.push(save[1]);
      for (const word of tokens(command)) {
        const helper = word.match(/^\.\.\/eos-helpers\/(\S+\.mjs)$/);
        if (helper && !saved.includes(helper[1])) missing.push(helper[1]);
      }
    }
    expect(saved).toEqual(["gerber-layers.mjs", "measure-step.mjs"]);
    expect(missing).toEqual([]);
  });

  it("writes each helper script's whole source in the setup", () => {
    const bodies: Record<string, string[]> = {};
    let current: string | null = null;
    for (const line of SETUP) {
      if (current !== null) {
        if (line === "EOF") current = null;
        else bodies[current].push(line);
        continue;
      }
      const save = line.match(/^cat > (\S+) <<'EOF'$/);
      if (save) {
        current = save[1];
        bodies[current] = [];
      }
    }
    expect(bodies).toEqual(
      Object.fromEntries(HELPER_SCRIPTS.map(s => [s.name, [...s.code]]))
    );
  });

  it("prints the ATTRIBUTION.md prefixes that step 2's digests are checked against", () => {
    const step2 = GUIDE[2];
    const shasum = step2.findIndex(c => c.startsWith("shasum -a 256 "));
    const prefixes = step2.findIndex(
      c =>
        c.startsWith("awk ") &&
        c.includes("kicad_sch") &&
        c.endsWith("/ATTRIBUTION.md")
    );
    expect(shasum).toBeGreaterThanOrEqual(0);
    expect(prefixes).toBeGreaterThan(shasum);
  });

  it("states all three extents measure-step.mjs prints for each model", () => {
    for (const [model, size] of Object.entries(GUIDE_RUN.sizes)) {
      expect(size, model).toHaveLength(3);
    }
  });

  it("says which commit the outputs match, and what the guide needs", () => {
    render(<OpenHardware />);
    const intro = screen.getByText(/^Six steps from a board record/);
    expect(intro.textContent).toContain("Node.js with npm");
    expect(intro.textContent).toContain(
      `eCAD-Hardware-Products ${STATS_AS_OF.commit.slice(0, 7)} of ${STATS_AS_OF.date}`
    );
    expect(intro.textContent).toMatch(/later commits can add boards/);
  });

  it("installs the helper libraries into eos-helpers alone", () => {
    const setup = GUIDE[0];
    const enter = setup.indexOf("cd eos-helpers");
    const own = setup.indexOf("echo '{}' > package.json");
    const install = setup.findIndex(c => c.startsWith("npm install "));
    expect(enter).toBeGreaterThanOrEqual(0);
    expect(own).toBeGreaterThan(enter);
    expect(install).toBeGreaterThan(own);
  });

  it("changes folder only to set up and to enter the clone", () => {
    expect(GUIDE.flat().filter(c => /^cd\b/.test(c))).toEqual([
      "cd eos-helpers",
      "cd ..",
      "cd eCAD-Hardware-Products",
    ]);
  });

  it("shows the setup commands before the first step", () => {
    const { container } = render(<OpenHardware />);
    const setup = screen.getByRole("heading", {
      level: 3,
      name: "Before you start",
    });
    const step1 = screen.getByRole("heading", {
      level: 3,
      name: USAGE[0].title,
    });
    expect(
      setup.compareDocumentPosition(step1) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    const blocks = [...container.querySelectorAll("pre code")].map(
      c => c.textContent
    );
    expect(blocks).toContain(SETUP.join("\n"));
  });
});

describe("the mirror's figures come from one registry", () => {
  const M = ECAD_MIRROR;
  const captions = (name: string) =>
    readFileSync(path.join(media, `${name}.vtt`), "utf8");

  it("reconciles the records, the files and the licences", () => {
    expect(M.boards + M.unlicensedRecords + M.pdfOnlyRecords).toBe(M.records);
    expect(M.designSources + M.fabricationFiles + M.modelFiles).toBe(
      M.cadFiles
    );
    const { ccBySa, ccBy, permissive, zeroBsdGrant } = M.licences;
    expect(ccBySa + ccBy + permissive + zeroBsdGrant).toBe(M.boards);
    expect(LICENCE_TERMS.map(l => l.boards)).toEqual([
      ccBySa,
      ccBy,
      permissive,
      zeroBsdGrant,
    ]);
  });

  it("states the page's headline figures from the registry", () => {
    expect(STATS.map(s => s.value)).toEqual([
      formatCount(M.records),
      `${M.ecosystems} of ${M.ecosystemsInIssue28}`,
      formatCount(M.cadFiles),
      formatCount(M.boards),
    ]);
    expect(RULES[0].body).toContain(`the ${M.unlicensedRecords} records`);
    expect(RULES[0].body).toContain(`${M.boards} boards are mirrored`);
  });

  it("types none of the registry's or the guide run's figures into the page", () => {
    const G = GUIDE_RUN;
    const prose = readFileSync(
      path.resolve(__dirname, "../../client/src/pages/OpenHardware.tsx"),
      "utf8"
    )
      .replace(/^import[\s\S]*?;$/gm, "")
      .replace(/code: \[[\s\S]*?\],/g, "")
      .replace(
        /export const (HELPER_SCRIPTS|SETUP) = \[[\s\S]*?\](?: as const)?;/g,
        ""
      );
    const counts = [
      M.records,
      M.boards,
      M.cadFiles,
      M.designSources,
      M.fabricationFiles,
      M.modelFiles,
      M.eagleFiles,
      M.commercialReuseRecords,
      M.stepBoards,
      M.unlicensedRecords,
      M.ecosystems,
      M.ecosystemsInIssue28,
      M.licences.ccBySa,
      M.licences.ccBy,
      G.boardFiles,
    ].flatMap(n => [String(n), formatCount(n)]);
    const figures = [
      ...counts,
      M.gigabytes,
      STATS_AS_OF.date,
      STATS_AS_OF.commit.slice(0, 7),
      `${G.downloadedMB} MB`,
      `${G.filesMB} MB`,
      ...Object.values(G.sizes)
        .flat()
        .map(n => n.toFixed(1)),
    ];
    const typed = [...new Set(figures)].filter(f =>
      new RegExp(
        `(?<![\\w.,/-])${f.replace(/[.,]/g, "\\$&")}(?!\\d)(?![.,]\\d)`
      ).test(prose)
    );
    expect(typed).toEqual([]);
  });

  it("keeps the other pages on the registry, not a typed copy", () => {
    for (const page of ["Ecosystem.tsx", "EcadHardware.tsx"]) {
      const source = readFileSync(
        path.resolve(__dirname, "../../client/src/pages", page),
        "utf8"
      );
      expect(source, page).toContain('from "@/data/ecad-mirror"');
      expect(source, page).not.toMatch(/4,?022|254 boards/);
    }
  });

  it("quotes the registry in the captions and the route description", () => {
    const howto = captions("open-hardware-howto");
    const tour = captions("open-hardware-tour");
    const description = JSON.parse(
      readFileSync(
        path.resolve(__dirname, "../../shared/route-descriptions.json"),
        "utf8"
      )
    )["/open-hardware"] as string;
    const { ccBySa, ccBy, permissive } = M.licences;
    for (const quote of [
      `Query the ${M.records} records`,
      `${M.stepBoards} boards have a verified STEP model, ${M.commercialReuseRecords} records allow commercial reuse`,
      `downloads ${GUIDE_RUN.downloadedMB} MB`,
      `${GUIDE_RUN.boardFiles} files and ${GUIDE_RUN.filesMB} MB`,
      `${formatSize(GUIDE_RUN.sizes.beagleboneAi64, " by ")} millimetres`,
      `instead of ${M.gigabytes} GB`,
      `CC BY-SA, ${ccBySa} boards`,
      `CC BY 4.0, ${ccBy} boards`,
      `Apache-2.0, ${permissive} boards`,
      `${formatCount(M.cadFiles)} CAD files from ${M.boards} boards`,
    ]) {
      expect(howto, quote).toContain(quote);
    }
    for (const quote of [
      `from ${M.ecosystems} hardware ecosystems`,
      `${M.records} development boards`,
      `${formatCount(M.cadFiles)} openly licensed CAD files from ${M.boards} boards`,
      `${formatCount(M.designSources)} design sources, ${formatCount(M.fabricationFiles)} Gerber and drill files, ${M.modelFiles} 3D and mechanical models`,
      `${M.stepBoards} boards with a verified 3D model`,
    ]) {
      expect(tour, quote).toContain(quote);
    }
    expect(description).toContain(
      `${formatCount(M.cadFiles)} openly licensed CAD files from ${M.boards} development boards`
    );
  });
});
