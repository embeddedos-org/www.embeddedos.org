/**
 * Performance budgets over the built output.
 *
 * These are regression guards, not aspirations: every number is set slightly
 * above what the build currently produces, so an accidental re-introduction of
 * the dev runtime, an unoptimised image, or an eager three.js preload fails the
 * suite instead of quietly shipping.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const DIST = path.resolve(import.meta.dirname, "../../dist/public");
const ASSETS = path.join(DIST, "assets");

const brotli = (buf: Buffer) =>
  zlib.brotliCompressSync(buf, {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length;

const read = (p: string) => fs.readFileSync(p);
const assetsMatching = (re: RegExp) =>
  fs.readdirSync(ASSETS).filter(f => re.test(f));
const kb = (n: number) => Math.round(n / 1024);

describe("html payload", () => {
  it("the homepage document stays under 40 KB brotli", () => {
    const size = brotli(read(path.join(DIST, "index.html")));
    expect(size, `homepage html ${kb(size)} KB brotli`).toBeLessThan(40 * 1024);
  });

  it("no prerendered page exceeds 60 KB brotli", () => {
    const oversized: string[] = [];
    for (const f of fs.globSync("**/index.html", { cwd: DIST })) {
      const size = brotli(read(path.join(DIST, f)));
      if (size > 60 * 1024) oversized.push(`${f} = ${kb(size)} KB`);
    }
    expect(oversized).toEqual([]);
  });

  it("the document carries no giant inline script (the Manus runtime regression)", () => {
    for (const f of fs.globSync("**/index.html", { cwd: DIST })) {
      const html = fs.readFileSync(path.join(DIST, f), "utf8");
      for (const m of html.matchAll(
        /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g
      )) {
        expect(m[1].length, `inline script in ${f}`).toBeLessThan(8 * 1024);
      }
    }
  });
});

describe("javascript budgets", () => {
  it("the entry chunk stays under 160 KB brotli", () => {
    const [entry] = assetsMatching(/^index-.*\.js$/);
    const size = brotli(read(path.join(ASSETS, entry)));
    expect(size, `${entry} = ${kb(size)} KB brotli`).toBeLessThan(160 * 1024);
  });

  it("the eagerly-preloaded critical path stays under 260 KB brotli", () => {
    const critical = [
      ...assetsMatching(/^index-.*\.js$/),
      ...assetsMatching(/^vendor-.*\.js$/),
      ...assetsMatching(/^index-.*\.css$/),
    ];
    const total = critical.reduce(
      (sum, f) => sum + brotli(read(path.join(ASSETS, f))),
      0
    );
    const html = brotli(read(path.join(DIST, "index.html")));
    expect(
      total + html,
      `critical path = ${kb(total + html)} KB brotli`
    ).toBeLessThan(260 * 1024);
  });

  it("does not preload three.js on every page", () => {
    const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
    const preloads = [
      ...html.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g),
    ].map(m => m[1]);
    expect(preloads.filter(p => /three/i.test(p))).toEqual([]);
    expect(preloads.length).toBeLessThanOrEqual(4);
  });

  it("keeps three.js in an async chunk that only 3D pages pull in", () => {
    const three = assetsMatching(/three/i);
    expect(three.length).toBeGreaterThan(0);
    const entry = fs.readFileSync(
      path.join(ASSETS, assetsMatching(/^index-.*\.js$/)[0]),
      "utf8"
    );
    expect(entry).not.toContain("THREE.WebGLRenderer");
  });
});

describe("image budgets", () => {
  const IMG_DIR = path.join(DIST, "manus-storage");

  it("no single image exceeds 260 KB", () => {
    const oversized = fs
      .readdirSync(IMG_DIR)
      .map(f => [f, fs.statSync(path.join(IMG_DIR, f)).size] as const)
      .filter(([, s]) => s > 260 * 1024)
      .map(([f, s]) => `${f} = ${kb(s)} KB`);
    expect(oversized).toEqual([]);
  });

  it("the site logo is small enough for a 40px slot", () => {
    const size = fs.statSync(
      path.join(IMG_DIR, "embeddedos-logo-mark_bc053888.jpg")
    ).size;
    expect(size, `logo = ${kb(size)} KB`).toBeLessThan(20 * 1024);
  });

  it("the homepage image set stays under 800 KB", () => {
    const homepageImages = [
      "hero-background_1bafea1c.jpg",
      "architecture-diagram-hero_72436b3f.jpg",
      "community-illustration-eos_6f39c9db.jpg",
      "what-we-do-illustration_4c2ad2f7.jpg",
      "embeddedos-logo-mark_bc053888.jpg",
    ];
    const total = homepageImages.reduce(
      (s, f) => s + fs.statSync(path.join(IMG_DIR, f)).size,
      0
    );
    expect(total, `homepage images = ${kb(total)} KB`).toBeLessThan(800 * 1024);
  });

  it("defers below-the-fold images", () => {
    const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
    const belowFold = imgs.filter(t => !/loading="eager"/.test(t));
    expect(belowFold.every(t => /loading="lazy"/.test(t))).toBe(true);
  });
});

describe("css budget", () => {
  it("stylesheet stays under 40 KB brotli", () => {
    const [css] = assetsMatching(/^index-.*\.css$/);
    const size = brotli(read(path.join(ASSETS, css)));
    expect(size, `${css} = ${kb(size)} KB brotli`).toBeLessThan(40 * 1024);
  });
});
