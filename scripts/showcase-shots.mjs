/**
 * Capture the frames for the product showcase reel.
 *
 * The reel is built from screenshots of the real, built site rather than from
 * generated footage or mockups. That constraint is the point: a showcase video
 * on the front page is a claim about what the products look like, and the only
 * version of that claim we can keep true is one rendered from the same build
 * that ships. When a product page changes, re-running this and rebuilding the
 * reel keeps the video honest; a hand-made video would drift silently.
 *
 * Frames are captured at 1280x720 — 16:9, matching the reel's output, so
 * ffmpeg never has to letterbox or crop and no text lands on a seam.
 *
 * Usage: node scripts/showcase-shots.mjs [outDir]
 * Requires the server from `pnpm build` to be running on PORT (default 5000).
 */

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const PORT = process.env.PORT ?? "5000";
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.argv[2] ?? "showcase-frames";

/**
 * The pages the reel shows, in order.
 *
 * Ordered as an argument rather than by importance: what the platform is,
 * then the four products a visitor can actually look at today, then where to
 * start. Each entry names the scroll position because the interesting part of
 * a product page is rarely the hero — `y` is a pixel offset applied after
 * load, chosen per page from what is actually on it.
 */
const FRAMES = [
  { route: "/", y: 0, name: "01-home" },
  { route: "/products", y: 0, name: "02-products" },
  { route: "/eos", y: 0, name: "03-eos" },
  { route: "/eboot", y: 0, name: "04-eboot" },
  { route: "/ebuild", y: 0, name: "05-ebuild" },
  { route: "/eosim", y: 0, name: "06-eosim" },
  { route: "/eostudio", y: 0, name: "07-eostudio" },
  { route: "/get-involved", y: 0, name: "08-get-involved" },
];

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2, // Retina-sharp; ffmpeg scales back down to 1280x720.
  });

  // Motion in a still frame is a blurred still frame. The site animates
  // several sections in on scroll, so freeze everything before capturing.
  await page.emulateMedia({ reducedMotion: "reduce" });

  let captured = 0;
  for (const frame of FRAMES) {
    const res = await page.goto(`${BASE}${frame.route}`, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    if (!res || !res.ok()) {
      throw new Error(
        `${frame.route} returned ${res ? res.status() : "no response"}`
      );
    }
    if (frame.y) {
      await page.evaluate(y => window.scrollTo(0, y), frame.y);
    }
    // Fonts decide the whole look of these pages; a frame captured before they
    // swap in shows the fallback stack and looks like a different site.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const file = join(OUT, `${frame.name}.png`);
    await page.screenshot({ path: file });
    console.log(`  ${frame.route} -> ${file}`);
    captured += 1;
  }

  await browser.close();

  if (captured !== FRAMES.length) {
    throw new Error(`captured ${captured} of ${FRAMES.length} frames`);
  }
  console.log(`\n${captured} frames in ${OUT}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
