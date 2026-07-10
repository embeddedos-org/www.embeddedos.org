/* One-shot migration: static HTML pages -> Astro pages using Base layout.
   - Preserves per-page SEO (<head> tags carried over verbatim).
   - Strips the baked-in nav/footer (Base provides the unified chrome).
   - Body markup is injected via set:html (so inline-JS braces don't hit the
     Astro compiler); page <script>s are re-emitted as is:inline so they run. */
import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Source page list (real pages only)
const patterns = ['*.html', 'docs/*.html', 'stacks/*.html', 'eApps/*.html', 'downloads/*.html'];
const files = patterns
  .flatMap((p) => globSync(p, { cwd: ROOT }))
  .filter((f) => f !== 'index.html.bak');

const HEAD_DROP = (el, $) => {
  const $el = $(el);
  const tag = el.tagName?.toLowerCase();
  const rel = ($el.attr('rel') || '').toLowerCase();
  const href = ($el.attr('href') || '');
  const src = ($el.attr('src') || '');
  if (tag === 'meta' && ($el.attr('charset') !== undefined || ($el.attr('name') || '').toLowerCase() === 'viewport')) return true;
  if (tag === 'link' && rel === 'preconnect') return true;
  if (tag === 'link' && /fonts\.(googleapis|gstatic)\.com/.test(href)) return true;
  if (tag === 'link' && (rel === 'icon' || rel === 'shortcut icon')) return true;
  if (tag === 'link' && rel === 'manifest') return true;
  if (tag === 'link' && /(style\.v7\.css|style\.v6\.css|theme-light\.css|site-chrome\.css)/.test(href)) return true;
  if (tag === 'link' && (rel === 'stylesheet' || rel === 'preload') && /(^|\/)style\.css($|\?)/.test(href)) return true;
  if (tag === 'script' && /site-chrome\.js/.test(src)) return true;
  return false;
};

let ok = 0;
for (const rel of files) {
  const abs = join(ROOT, rel);
  const html = readFileSync(abs, 'utf8');
  const $ = load(html, { decodeEntities: false });

  const lang = $('html').attr('lang') || 'en';
  const bodyClass = $('body').attr('class') || '';

  // base stylesheet detection
  let cssHref = '/css/style.v7.css';
  let legacy = false;
  const headHtml = $('head').html() || '';
  if (/style\.v7\.css/.test(headHtml)) { cssHref = '/css/style.v7.css'; legacy = false; }
  else if (/style\.css/.test(headHtml)) { cssHref = '/style.css'; legacy = true; }

  // rawHead = head minus boilerplate
  const $head = $('head');
  $head.children().each((_, el) => { if (HEAD_DROP(el, $)) $(el).remove(); });
  const rawHead = ($head.html() || '').trim();

  // body content minus chrome + scripts
  const $body = $('body');
  // Strip ALL baked-in chrome (legacy pages use <nav class="navbar">, v7 pages
  // use <header class="navbar">; footers vary too). Base provides the unified
  // chrome, so remove every .navbar / .footer from the page body.
  $body.find('.navbar, nav.navbar, header.navbar').remove();
  $body.find('.footer, footer.footer').remove();
  $body.find('script[src*="site-chrome.js"]').remove();

  // collect + strip scripts (re-emitted as is:inline so they execute)
  const scripts = [];
  $body.find('script').each((_, el) => {
    const $s = $(el);
    const src = $s.attr('src');
    const type = ($s.attr('type') || '').toLowerCase();
    if (src) {
      scripts.push({ src, defer: $s.attr('defer') !== undefined, type });
    } else {
      const code = $s.html() || '';
      if (code.trim()) scripts.push({ code, type });
    }
    $s.remove();
  });

  const content = ($body.html() || '').trim();

  // build .astro file
  const outRel = rel.replace(/\.html$/, '.astro');
  const outAbs = join(ROOT, 'src', 'pages', outRel);
  const depth = outRel.split('/').length - 1; // subdir depth
  const layoutImport = '../'.repeat(depth + 1) + 'layouts/Base.astro';

  const scriptTags = scripts.map((s) => {
    if (s.src) {
      const t = s.type ? ` type="${s.type}"` : '';
      return `<script is:inline${t} src=${JSON.stringify(s.src)}${s.defer ? ' defer' : ''}></script>`;
    }
    const t = s.type ? ` type="${s.type}"` : '';
    return `<script is:inline${t} set:html={${JSON.stringify(s.code)}} />`;
  }).join('\n');

  const astro =
`---
import Base from ${JSON.stringify(layoutImport)};
const rawHead = ${JSON.stringify(rawHead)};
const content = ${JSON.stringify(content)};
---
<Base lang=${JSON.stringify(lang)} legacy={${legacy}} cssHref=${JSON.stringify(cssHref)} bodyClass=${JSON.stringify(bodyClass)} rawHead={rawHead}>
<Fragment set:html={content} />
${scriptTags}
</Base>
`;

  mkdirSync(dirname(outAbs), { recursive: true });
  writeFileSync(outAbs, astro, 'utf8');
  ok++;
}
console.log(`Converted ${ok} pages -> src/pages/`);
