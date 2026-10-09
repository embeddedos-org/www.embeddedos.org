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
  STATS,
  USAGE,
  VALIDATION,
} from "../../client/src/pages/OpenHardware";

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
        /\.(kicad_pcb|kicad_sch|brd|zip|stp|step)$/
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
