/**
 * One-off image optimizer for client/public/media.
 *
 * The source assets are wildly oversized for how they are displayed — the site
 * logo was a 1920x1920 / 119 KB JPEG rendered into a 40px box, and the homepage
 * shipped ~1.3 MB of JPEG. The Ad Grants website policy calls out image
 * optimization directly under page speed.
 *
 * Resizes to a sane maximum for each asset's actual display size and re-encodes
 * with mozjpeg. Idempotent: re-running on already-optimized files is a no-op
 * beyond a small re-encode, and files are only replaced when the result is
 * smaller.
 *
 * Run with `pnpm optimize:images`. Commit the results.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.resolve(
  import.meta.dirname,
  "..",
  "client",
  "public",
  "media"
);

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

const files = fs.readdirSync(DIR).filter(f => /\.(jpe?g|png)$/i.test(f));
if (!files.length) {
  console.log(`[images] nothing to optimize in ${DIR}`);
  process.exit(0);
}

let beforeTotal = 0;
let afterTotal = 0;
const rows = [];

for (const file of files.sort()) {
  const abs = path.join(DIR, file);
  const before = fs.statSync(abs).size;
  beforeTotal += before;

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

  const outMeta = await sharp(abs).metadata();
  rows.push({
    file,
    beforeKb: Math.round(before / 1024),
    afterKb: Math.round(after / 1024),
    dims: `${meta.width}x${meta.height}`,
    newDims: `${outMeta.width}x${outMeta.height}`,
    skipped: !shrank,
  });
}

console.log(
  `${"FILE".padEnd(44)}${"WAS".padStart(8)}${"NOW".padStart(8)}  ${"DIMENSIONS".padEnd(22)}`
);
for (const r of rows) {
  console.log(
    r.file.padEnd(44) +
      `${r.beforeKb}K`.padStart(8) +
      `${r.afterKb}K`.padStart(8) +
      `  ${r.dims} -> ${r.newDims}${r.skipped ? "  (kept original, already smaller)" : ""}`
  );
}

const pct = Math.round((1 - afterTotal / beforeTotal) * 100);
console.log(
  `\n[images] ${files.length} files: ${Math.round(beforeTotal / 1024)} KB -> ${Math.round(afterTotal / 1024)} KB (${pct}% smaller)`
);
