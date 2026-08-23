/**
 * Generates the site's favicon set from the existing logo mark.
 *
 * The site shipped with no favicon at all: no <link rel="icon"> in the document
 * head and no icon file in the build, so /favicon.ico answered 404 and browser
 * tabs, bookmarks and phone home-screen shortcuts fell back to a blank glyph.
 * That is the "missing logo" — the header mark itself renders correctly.
 *
 * Sources client/public/media/embeddedos-logo-mark_bc053888.jpg, the
 * same 256x256 mark the navbar uses, so the tab icon cannot drift from the
 * header. Outputs into client/public/ where vite copies it to the build root,
 * which is where browsers look for /favicon.ico by convention.
 *
 * sharp cannot write ICO, so the container is assembled here: an ICO is a small
 * header plus one directory entry per image, and PNG payloads are legal inside
 * it on every browser that still requests .ico. Committing the outputs keeps the
 * build deterministic; re-run this only when the logo changes.
 *
 *   node scripts/generate-favicons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(
  ROOT,
  "client/public/media/embeddedos-logo-mark_bc053888.jpg"
);
const OUT = path.join(ROOT, "client/public");

/** PNG sizes to emit as standalone files, and what each is for. */
const PNGS = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 180, name: "apple-touch-icon.png" }, // iOS home screen
  { size: 192, name: "android-chrome-192x192.png" }, // Android / manifest
  { size: 512, name: "android-chrome-512x512.png" }, // manifest, splash
];

/** Sizes packed into favicon.ico, for clients that still ask for it. */
const ICO_SIZES = [16, 32, 48];

/**
 * Build an ICO container around already-encoded PNG buffers.
 *
 * Layout: a 6-byte ICONDIR, then a 16-byte ICONDIRENTRY per image, then the
 * payloads. Width/height are stored as a single byte each, where 0 means 256 —
 * which is why nothing above 256 can go in here.
 */
const buildIco = images => {
  const HEADER = 6;
  const ENTRY = 16;
  const dir = Buffer.alloc(HEADER + ENTRY * images.length);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type 1 = icon
  dir.writeUInt16LE(images.length, 4);

  let offset = dir.length;
  images.forEach(({ size, data }, i) => {
    const at = HEADER + ENTRY * i;
    dir.writeUInt8(size >= 256 ? 0 : size, at + 0); // width
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1); // height
    dir.writeUInt8(0, at + 2); // palette count, 0 for truecolour
    dir.writeUInt8(0, at + 3); // reserved
    dir.writeUInt16LE(1, at + 4); // colour planes
    dir.writeUInt16LE(32, at + 6); // bits per pixel
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([dir, ...images.map(i => i.data)]);
};

if (!fs.existsSync(SOURCE)) {
  console.error(`[favicons] source mark not found: ${SOURCE}`);
  process.exit(1);
}

const render = size =>
  sharp(SOURCE)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();

for (const { size, name } of PNGS) {
  const data = await render(size);
  fs.writeFileSync(path.join(OUT, name), data);
  console.log(`[favicons] ${name.padEnd(28)} ${size}x${size}  ${data.length}b`);
}

const icoImages = [];
for (const size of ICO_SIZES) {
  icoImages.push({ size, data: await render(size) });
}
const ico = buildIco(icoImages);
fs.writeFileSync(path.join(OUT, "favicon.ico"), ico);
console.log(
  `[favicons] favicon.ico                 ${ICO_SIZES.join("/")}  ${ico.length}b`
);

// A manifest makes the icons usable as an installed app, and is the only place
// Android looks for the maskable/large icon.
const manifest = {
  name: "EmbeddedOS Foundation",
  short_name: "EmbeddedOS",
  description:
    "The open-source operating system for every device, from the Embedded Operating Systems Research Foundation.",
  start_url: "/",
  display: "standalone",
  background_color: "#0A0E1A",
  theme_color: "#0B1D3A",
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};
fs.writeFileSync(
  path.join(OUT, "site.webmanifest"),
  JSON.stringify(manifest, null, 2) + "\n"
);
console.log("[favicons] site.webmanifest           written");
