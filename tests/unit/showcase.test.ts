/**
 * The showcase reel's text alternative must describe the reel that exists.
 *
 * The video is video-only content, so the visible scene list is its WCAG 1.2.1
 * equivalent. That equivalent is only worth having while it is accurate, and
 * the failure mode is silent: someone adds a product page to the capture
 * script, regenerates the reel, and the list on the page now describes a
 * different video. Nothing about the rendered page would look wrong.
 *
 * So these compare the two sources directly rather than trusting them to be
 * edited together.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { SHOWCASE_SCENES } from "../../client/src/components/ProductShowcase";

const ROOT = join(__dirname, "../..");

/** The routes the capture script actually screenshots, in capture order. */
function capturedRoutes(): string[] {
  const src = readFileSync(join(ROOT, "scripts/showcase-shots.mjs"), "utf-8");
  const block = src.slice(
    src.indexOf("const FRAMES = ["),
    src.indexOf("];", src.indexOf("const FRAMES = ["))
  );
  return [...block.matchAll(/route:\s*"([^"]+)"/g)].map(m => m[1]);
}

describe("showcase scene list", () => {
  it("lists one scene per captured frame, in the same order", () => {
    expect(SHOWCASE_SCENES.map(s => s.href)).toEqual(capturedRoutes());
  });

  it("has no empty labels or notes", () => {
    for (const scene of SHOWCASE_SCENES) {
      expect(scene.label.trim(), scene.href).not.toBe("");
      expect(scene.note.trim(), scene.href).not.toBe("");
    }
  });

  it("points every scene at a route the app serves", () => {
    // A text alternative whose links 404 is worse than plain text.
    const app = readFileSync(join(ROOT, "client/src/App.tsx"), "utf-8");
    for (const scene of SHOWCASE_SCENES) {
      expect(app, `no route for ${scene.href}`).toContain(
        `path="${scene.href}"`
      );
    }
  });
});

describe("showcase media", () => {
  const video = join(ROOT, "client/public/media/product-showcase.mp4");
  const poster = join(ROOT, "client/public/media/product-showcase-poster.jpg");

  it("ships both the video and its poster", () => {
    // The component references these by literal path. A missing poster shows a
    // black rectangle; a missing video shows a control bar that does nothing.
    expect(statSync(video).isFile()).toBe(true);
    expect(statSync(poster).isFile()).toBe(true);
  });

  it("keeps the video small enough to sit on the front page", () => {
    // preload="none" means it is only fetched on play, but someone who presses
    // play on a phone still pays for it. 3 MB is the point at which that stops
    // being a reasonable thing to ask.
    expect(statSync(video).size).toBeLessThan(3 * 1024 * 1024);
  });

  it("uses preload=none and does not autoplay", () => {
    const src = readFileSync(
      join(ROOT, "client/src/components/ProductShowcase.tsx"),
      "utf-8"
    );
    expect(src).toContain('preload="none"');
    expect(
      src,
      "autoplay would download the reel for every visitor"
    ).not.toMatch(/\bautoPlay\b/);
  });
});
