/**
 * One-off image optimizer for client/public/media.
 *
 * The source assets are wildly oversized for how they are displayed — the site
 * logo was a 1920x1920 / 119 KB JPEG rendered into a 40px box, and the homepage
 * shipped ~1.3 MB of JPEG. The Ad Grants website policy calls out image
 * optimization directly under page speed.
 *
 * Resizes to a sane maximum for each asset's actual display size and re-encodes
 * with mozjpeg. Idempotent via scripts/image-manifest.json: the manifest
 * records a fingerprint of the optimization settings plus the sha256 of every
 * optimized output, and files that already match are skipped without even
 * invoking the encoder. (Byte-comparing re-encodes does NOT converge — each
 * generation can come out a byte smaller than the last — so "rewrite when
 * smaller" alone can never reach a fixed point. The manifest is what makes a
 * clean checkout a true no-op, which `pnpm build` relies on: CI runs
 * `git diff --exit-code` after the build.)
 *
 * Also emits a `.webp` sibling for every JPEG (F-18): 25–35% smaller than the
 * optimized JPEG at the same quality. Pages serve it via <picture> with the
 * JPEG as fallback; the JPEG stays the og:image (widest social-crawler
 * support). WebP files are only written when smaller than the JPEG.
 *
 * Run with `pnpm optimize:images`. Commit the results AND the updated
 * manifest. Wired into `pnpm build` so new assets never ship raw.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const DIR = path.resolve(
  import.meta.dirname,
  "..",
  "client",
  "public",
  "media"
);
const MANIFEST_PATH = path.resolve(import.meta.dirname, "image-manifest.json");

// Max width by role. Anything not matched falls back to CONTENT_MAX.
const CONTENT_MAX = 1600;
const RULES = [
  { match: /logo/i, maxWidth: 256, quality: 82 },
  { match: /^hero-/i, maxWidth: 1920, quality: 76 },
  { match: /illustration/i, maxWidth: 1600, quality: 76 },
  { match: /^(arch|architecture)-/i, maxWidth: 1600, quality: 78 },
  { match: /^product-/i, maxWidth: 1400, quality: 78 },
];

const ruleFor = name =>
  RULES.find(r => r.match.test(name)) ?? { maxWidth: CONTENT_MAX, quality: 78 };

// Fingerprint of the optimization settings. Any rule change re-optimizes
// everything once; otherwise already-optimized files are skipped by hash.
const SETTINGS_FP = createHash("sha256")
  .update(
    JSON.stringify({
      contentMax: CONTENT_MAX,
      rules: RULES.map(r => [r.match.source, r.maxWidth, r.quality]),
    })
  )
  .digest("hex")
  .slice(0, 16);

const sha256File = abs =>
  createHash("sha256").update(fs.readFileSync(abs)).digest("hex");

let manifest = { version: 1, settings: SETTINGS_FP, files: {} };
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
} catch {
  // First run: no manifest yet; everything gets optimized.
}
const settingsChanged = manifest.settings !== SETTINGS_FP;

const files = fs.readdirSync(DIR).filter(f => /\.(jpe?g|png)$/i.test(f));
if (!files.length) {
  console.log(`[images] nothing to optimize in ${DIR}`);
  process.exit(0);
}

let beforeTotal = 0;
let afterTotal = 0;
let skippedCount = 0;
const rows = [];
const seen = new Set();

for (const file of files.sort()) {
  const abs = path.join(DIR, file);
  const before = fs.statSync(abs).size;
  beforeTotal += before;
  seen.add(file);

  const webpPath = abs.replace(/\.(jpe?g|png)$/i, ".webp");
  const diskWebpHash = fs.existsSync(webpPath) ? sha256File(webpPath) : null;
  const entry = manifest.files[file];
  const alreadyOptimized =
    !settingsChanged &&
    !!entry &&
    entry.sha256 === sha256File(abs) &&
    (entry.webpSha256 ?? null) === diskWebpHash;

  if (alreadyOptimized) {
    skippedCount++;
    afterTotal += before;
    const meta = await sharp(abs).metadata();
    rows.push({
      file,
      beforeKb: Math.round(before / 1024),
      afterKb: Math.round(before / 1024),
      dims: `${meta.width}x${meta.height}`,
      newDims: `${meta.width}x${meta.height}`,
      cached: true,
    });
    continue;
  }

  const { maxWidth, quality } = ruleFor(file);
  const meta = await sharp(abs).metadata();

  const pipeline = sharp(abs).rotate();
  if (meta.width && meta.width > maxWidth) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  const output = await pipeline
    .jpeg({
      quality,
      progressive: true,
      mozjpeg: true,
      chromaSubsampling: "4:2:0",
    })
    .toBuffer();

  const shrank = output.length < before;
  if (shrank) fs.writeFileSync(abs, output);
  const after = fs.statSync(abs).size;
  afterTotal += after;

  // WebP sibling for <picture> (F-18). Re-encode from the (possibly resized)
  // optimized buffer, not the original, so dimensions match the JPEG.
  // (webpPath was computed above for the manifest skip-check.)
  try {
    const webpBuf = await sharp(output)
      .webp({ quality: Math.min(quality + 2, 82) })
      .toBuffer();
    if (webpBuf.length < after) {
      fs.writeFileSync(webpPath, webpBuf);
    } else if (fs.existsSync(webpPath)) {
      // A previous run's .webp no longer beats the JPEG (e.g. rules changed):
      // remove the stale sibling so the manifest stays truthful.
      fs.unlinkSync(webpPath);
    }
  } catch {
    // sharp without webp support: JPEG optimization above still stands.
  }

  const outMeta = await sharp(abs).metadata();
  rows.push({
    file,
    beforeKb: Math.round(before / 1024),
    afterKb: Math.round(after / 1024),
    dims: `${meta.width}x${meta.height}`,
    newDims: `${outMeta.width}x${outMeta.height}`,
    skipped: !shrank,
  });

  manifest.files[file] = {
    sha256: sha256File(abs),
    webpSha256: fs.existsSync(webpPath) ? sha256File(webpPath) : null,
  };
}

// Drop manifest entries (and orphaned .webp siblings) for source files that
// no longer exist.
for (const name of Object.keys(manifest.files)) {
  if (!seen.has(name)) {
    const staleWebp = path.join(DIR, name.replace(/\.(jpe?g|png)$/i, ".webp"));
    try {
      fs.unlinkSync(staleWebp);
    } catch {
      // Already gone; nothing to clean up.
    }
    delete manifest.files[name];
  }
}

manifest.settings = SETTINGS_FP;
const manifestJson = JSON.stringify(manifest, null, 2) + "\n";
let prevManifest = null;
try {
  prevManifest = fs.readFileSync(MANIFEST_PATH, "utf8");
} catch {
  // No manifest yet; fall through and write it.
}
if (prevManifest !== manifestJson) {
  fs.writeFileSync(MANIFEST_PATH, manifestJson);
}

console.log(
  `${"FILE".padEnd(44)}${"WAS".padStart(8)}${"NOW".padStart(8)}  ${"DIMENSIONS".padEnd(22)}`
);
for (const r of rows) {
  const note = r.cached
    ? "  (already optimized, skipped)"
    : r.skipped
      ? "  (kept original, already smaller)"
      : "";
  console.log(
    r.file.padEnd(44) +
      `${r.beforeKb}K`.padStart(8) +
      `${r.afterKb}K`.padStart(8) +
      `  ${r.dims} -> ${r.newDims}${note}`
  );
}

const pct = Math.round((1 - afterTotal / beforeTotal) * 100);
console.log(
  `\n[images] ${files.length} files: ${Math.round(beforeTotal / 1024)} KB -> ${Math.round(afterTotal / 1024)} KB (${pct}% smaller)` +
    (skippedCount ? `, ${skippedCount} skipped via manifest` : "")
);
