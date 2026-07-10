/* Post-build fixups + lightweight optimisation:
   1. Restore subdir index pages collapsed by build.format:'file'.
   2. Minify the CSS served from public/ (Astro doesn't touch public assets),
      which is the main render-blocking payload on every page. */
import { existsSync, mkdirSync, copyFileSync, rmSync, readFileSync, writeFileSync, globSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SECTIONS = ['docs', 'stacks', 'downloads', 'eApps'];

// 1. Restore subdir index pages
let n = 0;
for (const s of SECTIONS) {
  const flat = join(DIST, `${s}.html`);
  const nested = join(DIST, s, 'index.html');
  if (existsSync(flat)) {
    mkdirSync(dirname(nested), { recursive: true });
    copyFileSync(flat, nested);
    rmSync(flat);
    n++;
    console.log(`  ${s}.html -> ${s}/index.html (flat removed)`);
  }
}
console.log(`Post-build: fixed ${n} subdir index page(s).`);

// 2. Security: ensure every target="_blank" link has rel=noopener noreferrer
//    (prevents reverse-tabnabbing). Applied to the built HTML.
const htmlFiles = globSync('dist/**/*.html', { cwd: join(DIST, '..') });
let fixedLinks = 0;
for (const rel of htmlFiles) {
  const abs = join(DIST, '..', rel);
  let html = readFileSync(abs, 'utf8');
  html = html.replace(/<a\b([^>]*\btarget="_blank"[^>]*)>/gi, (m, attrs) => {
    if (/\brel=/.test(attrs)) {
      if (/\brel="[^"]*noopener/i.test(attrs)) return m;
      fixedLinks++;
      return m.replace(/\brel="([^"]*)"/i, 'rel="$1 noopener noreferrer"');
    }
    fixedLinks++;
    return `<a${attrs} rel="noopener noreferrer">`;
  });
  writeFileSync(abs, html, 'utf8');
}
if (fixedLinks) console.log(`Hardened ${fixedLinks} target=_blank link(s) with rel=noopener.`);

// 3. Minify public CSS
const cssFiles = globSync('dist/**/*.css', { cwd: join(DIST, '..') });
let before = 0, after = 0;
for (const rel of cssFiles) {
  const abs = join(DIST, '..', rel);
  const src = readFileSync(abs, 'utf8');
  const out = await transform(src, { loader: 'css', minify: true });
  before += Buffer.byteLength(src);
  after += Buffer.byteLength(out.code);
  writeFileSync(abs, out.code, 'utf8');
}
if (cssFiles.length) {
  console.log(`Minified ${cssFiles.length} CSS file(s): ${(before/1024).toFixed(0)} KB -> ${(after/1024).toFixed(0)} KB`);
}
