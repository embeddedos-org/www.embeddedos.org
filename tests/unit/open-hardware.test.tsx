/** @vitest-environment jsdom */

/**
 * /open-hardware is built from real artefacts, so its promises are about
 * files: every image it names ships as an optimized JPEG with a WebP sibling,
 * the walkthrough video ships with its poster and captions, and the captions
 * never run past the video. The render checks hold the accessibility side:
 * alt text and intrinsic size on every image, and a captions track that does
 * not load the video until it is played.
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
  VALIDATION,
} from "../../client/src/pages/OpenHardware";

const media = path.resolve(__dirname, "../../client/public/media");
const VIDEO_SECONDS = 68.8;

const pageImages = [
  ...GALLERY.flatMap(g => g.shots.map(s => s.file)),
  ...VALIDATION.map(v => v.file),
  "open-hardware-terminal-query",
  "open-hardware-terminal-mirror",
  "open-hardware-attribution",
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

  it("ships the video with its poster and captions", () => {
    for (const file of [
      "open-hardware-tour.mp4",
      "open-hardware-tour-poster.jpg",
      "open-hardware-tour.vtt",
    ]) {
      expect(existsSync(path.join(media, file)), file).toBe(true);
    }
  });

  it("keeps the captions inside the video", () => {
    const vtt = readFileSync(
      path.join(media, "open-hardware-tour.vtt"),
      "utf8"
    );
    expect(vtt.startsWith("WEBVTT")).toBe(true);
    const ends = [...vtt.matchAll(/--> (\d\d):(\d\d):(\d\d\.\d{3})/g)].map(
      m => Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])
    );
    expect(ends.length).toBe(13);
    expect(Math.max(...ends)).toBeLessThanOrEqual(VIDEO_SECONDS);
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

    const video = container.querySelector("video");
    expect(video?.getAttribute("preload")).toBe("none");
    expect(video?.getAttribute("poster")).toBe(
      "/media/open-hardware-tour-poster.jpg"
    );
    expect(video?.querySelector('track[kind="captions"]')).not.toBeNull();
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
