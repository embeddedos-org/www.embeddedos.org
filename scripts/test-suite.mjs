/* EmbeddedOS — non-browser test harness.
   Runs every suite that does not strictly require a live browser, over the
   built dist/ and the original source pages. Browser-only suites (real DOM
   E2E, rendered a11y, Lighthouse) are reported as SKIPPED with the command to
   run them locally. Exits non-zero if any hard assertion fails. */
import { readFileSync, existsSync, globSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { load } from 'cheerio';

const ROOT = process.cwd();
const DIST = 'dist';
const results = {};
let hardFail = 0;
function suite(name) { results[name] = { pass: 0, fail: 0, warn: 0, notes: [] }; return name; }
function ok(s, cond, msg) { const r = results[s]; if (cond) r.pass++; else { r.fail++; hardFail++; r.notes.push('FAIL: ' + msg); } }
function warn(s, cond, msg) { const r = results[s]; if (!cond) { r.warn++; r.notes.push('WARN: ' + msg); } else r.pass++; }
function note(s, msg) { results[s].notes.push(msg); }

const distPages = globSync('dist/**/*.html');
const $of = (f) => load(readFileSync(f, 'utf8'));
const textLen = (f) => { const $ = $of(f); $('script,style,noscript,.navbar,.footer').remove(); return $('body').text().replace(/\s+/g, ' ').trim().length; };
const srcPages = globSync('*.html').filter(f => f !== 'index.html.bak')
  .concat(globSync('docs/*.html'), globSync('stacks/*.html'), globSync('eApps/*.html'), globSync('downloads/*.html'));

/* ── 1. INTEGRATION — build artifacts ─────────────────────────────────── */
{ const s = suite('Integration (build pipeline)');
  ok(s, existsSync(DIST), 'dist/ exists');
  ok(s, distPages.length >= 81, `>=81 pages built (got ${distPages.length})`);
  for (const p of ['docs', 'stacks', 'downloads', 'eApps'])
    ok(s, existsSync(`dist/${p}/index.html`), `subdir index dist/${p}/index.html restored`);
  ok(s, existsSync('dist/sitemap-index.xml'), 'sitemap generated');
  ok(s, existsSync('dist/robots.txt'), 'robots.txt shipped');
  const theme = readFileSync('dist/css/theme-light.css', 'utf8');
  ok(s, !/\n\n/.test(theme) && theme.length > 1000, 'theme CSS minified');
  ok(s, existsSync('dist/css/style.v7.css') && existsSync('dist/style.css'), 'base stylesheets shipped');
}

/* ── 2. FUNCTIONAL — every page structurally valid ────────────────────── */
{ const s = suite('Functional (page structure)');
  for (const f of distPages) {
    const raw = readFileSync(f, 'utf8'); const $ = load(raw);
    const rel = relative(DIST, f);
    ok(s, /<!doctype html>/i.test(raw), `${rel}: has doctype`);
    ok(s, ($('html').attr('lang') || '') !== '', `${rel}: html[lang]`);
    ok(s, ($('title').text() || '').trim().length > 0, `${rel}: non-empty <title>`);
    ok(s, $('header.navbar').length === 1, `${rel}: exactly one navbar`);
    ok(s, $('footer.footer').length === 1, `${rel}: exactly one footer`);
    ok(s, /theme-light\.css/.test(raw), `${rel}: theme linked`);
    ok(s, !/site-chrome\.js/.test(raw), `${rel}: no legacy site-chrome.js`);
  }
  note(s, `checked ${distPages.length} pages`);
}

/* ── 3. SMOKE — key pages load with real content ──────────────────────── */
{ const s = suite('Smoke (key pages)');
  for (const p of ['index.html','products.html','about.html','docs/index.html','kids.html','contact.html','membership.html']) {
    const f = join(DIST, p);
    ok(s, existsSync(f), `${p} exists`);
    if (existsSync(f)) { ok(s, textLen(f) > 400, `${p} has substantial content`); const $ = $of(f); ok(s, $('header.navbar a').length > 5, `${p} nav populated`); }
  }
}

/* ── 4. REGRESSION — no content lost vs original ───────────────────────── */
{ const s = suite('Regression (content retention)');
  let worst = 1, worstP = '';
  for (const p of srcPages) {
    const d = join(DIST, p); ok(s, existsSync(d), `built counterpart for ${p}`);
    if (!existsSync(d)) continue;
    const o = textLen(p), b = textLen(d); const r = o > 0 ? b / o : 1;
    if (r < worst) { worst = r; worstP = p; }
    warn(s, r >= 0.95, `${p} retention ${(r*100).toFixed(0)}%`);
  }
  note(s, `worst retention: ${(worst*100).toFixed(0)}% (${worstP})`);
}

/* ── 5. E2E-lite — reachability crawl from homepage ───────────────────── */
{ const s = suite('E2E (reachability crawl)');
  const norm = (p) => relative(ROOT, resolve(p));
  const resolveFile = (u) => { let t = u.startsWith('/') ? join(DIST, u) : u; if (existsSync(t) && statSync(t).isFile()) return norm(t); if (existsSync(join(t, 'index.html'))) return norm(join(t, 'index.html')); return null; };
  const seen = new Set(), queue = [norm(join(DIST, 'index.html'))];
  while (queue.length) {
    const f = queue.shift(); if (!f || seen.has(f)) continue; seen.add(f);
    if (!existsSync(f)) continue;
    const $ = $of(f);
    $('a[href]').each((_, a) => {
      let h = ($(a).attr('href') || '').split('#')[0].split('?')[0];
      if (!h || /^(https?:|mailto:|tel:|javascript:)/.test(h)) return;
      const abs = h.startsWith('/') ? join(DIST, h) : resolve(dirname(f), h); // resolve relative to page dir
      const t = resolveFile(h.startsWith('/') ? h : relative(ROOT, abs));
      if (t && !seen.has(t)) queue.push(t);
    });
  }
  const IGNORE = new Set([norm(join(DIST, '404.html'))]); // 404 is intentionally unlinked
  const unreachable = distPages.map(norm).filter(f => !seen.has(f) && !IGNORE.has(f));
  ok(s, unreachable.length === 0, `all pages reachable from home (orphans: ${unreachable.join(', ') || 'none'})`);
  note(s, `crawled ${seen.size} reachable pages (404 excluded)`);
}

/* ── 6. ACCEPTANCE — user requirements ────────────────────────────────── */
{ const s = suite('Acceptance (requirements)');
  const groups = ['Products','Research','Learn','Community','Foundation'];
  let allMenu = true;
  for (const f of distPages) { const t = readFileSync(f,'utf8'); if (!groups.every(g => t.includes('>'+g+'<') || t.includes(g))) allMenu = false; }
  ok(s, allMenu, 'unified 5-group menu on every page');
  for (const g of ['index.html','books.html','flow.html','kids.html','hardware-lab.html','getting-started.html','get-involved.html'])
    ok(s, existsSync(join(DIST,g)), `github.io-origin page present: ${g}`);
  ok(s, distPages.every(f => /theme-light\.css/.test(readFileSync(f,'utf8'))), 'light theme applied site-wide');
  ok(s, srcPages.every(p => existsSync(join(DIST,p))), 'all 81 source pages migrated');
}

/* ── 7. PERFORMANCE — payload budgets ─────────────────────────────────── */
{ const s = suite('Performance (payload)');
  let maxHtml = 0, maxP = '', sumHtml = 0;
  for (const f of distPages) { const sz = statSync(f).size; sumHtml += sz; if (sz > maxHtml) { maxHtml = sz; maxP = relative(DIST,f); } }
  const gz = (f) => existsSync(f) ? gzipSync(readFileSync(f)).length : 0;
  const cssGz = globSync('dist/**/*.css').reduce((a,f)=>a+gz(f),0);
  const jsGz = globSync('dist/**/*.js').reduce((a,f)=>a+gz(f),0);
  note(s, `avg HTML ${(sumHtml/distPages.length/1024).toFixed(1)} KB, max ${(maxHtml/1024).toFixed(0)} KB (${maxP})`);
  note(s, `total CSS gzipped ${(cssGz/1024).toFixed(0)} KB, total JS gzipped ${(jsGz/1024).toFixed(0)} KB`);
  warn(s, maxHtml < 250*1024, `largest HTML under 250 KB (max ${(maxHtml/1024).toFixed(0)} KB)`);
  warn(s, gz('dist/css/style.v7.css') < 40*1024, `main CSS gzipped under 40 KB (${(gz('dist/css/style.v7.css')/1024).toFixed(0)} KB)`);
  // render-blocking stylesheet links per page
  let maxBlock = 0; for (const f of distPages) { const n = ($of(f)('link[rel="stylesheet"]').length); if (n>maxBlock) maxBlock=n; }
  warn(s, maxBlock <= 4, `render-blocking stylesheets per page <=4 (max ${maxBlock})`);
}

/* ── 8. SECURITY ──────────────────────────────────────────────────────── */
{ const s = suite('Security');
  let blankNoopener = 0, blankTotal = 0, mixed = 0;
  for (const f of distPages) { const $ = $of(f);
    $('a[target="_blank"]').each((_,a)=>{ blankTotal++; const rel=($(a).attr('rel')||''); if(!/noopener/.test(rel)) blankNoopener++; });
    // only actual loaded resources (namespace/JSON-LD @context URIs are not loads)
    if (/(?:src|href|action)="http:\/\/(?!localhost|127\.)/i.test(readFileSync(f,'utf8'))) mixed++;
  }
  warn(s, blankNoopener === 0, `${blankNoopener}/${blankTotal} target=_blank links missing rel=noopener`);
  warn(s, mixed === 0, `${mixed} pages reference insecure http:// resources`);
  const cspSomewhere = distPages.some(f=>/Content-Security-Policy/i.test(readFileSync(f,'utf8'))) || existsSync('dist/_headers');
  ok(s, cspSomewhere, 'CSP present (meta or _headers)');
  // secret scan in shipped JS/HTML
  const secretRx = /(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[0-9A-Za-z-]{10,}|sk_live_[0-9A-Za-z]{20,})/;
  let secrets = 0; for (const f of globSync('dist/**/*.{js,html}')) if (secretRx.test(readFileSync(f,'utf8'))) secrets++;
  ok(s, secrets === 0, `no hard-coded secrets in shipped assets (found ${secrets})`);
}

/* ── 9. UI / UX — static heuristics ───────────────────────────────────── */
{ const s = suite('UI/UX (static a11y heuristics)');
  let noH1 = 0, multiH1 = 0, noDesc = 0, imgs = 0, imgsAlt = 0, noViewport = 0, badTitle = 0, noSkip = 0;
  for (const f of distPages) { const $ = $of(f);
    const h1 = $('h1').length; if (h1 === 0) noH1++; if (h1 > 1) multiH1++;
    if ($('meta[name="description"]').length === 0) noDesc++;
    if ($('meta[name="viewport"]').length === 0) noViewport++;
    $('img').each((_,im)=>{ imgs++; if (($(im).attr('alt')??'')!=='' || $(im).attr('alt')==='') { if ($(im).attr('alt')!==undefined) imgsAlt++; } });
    const tl = ($('title').text()||'').trim().length; if (tl < 8 || tl > 80) badTitle++;
    if ($('a[href="#main-content"], a.skip-link, a.skip-to-content').length === 0) noSkip++;
  }
  warn(s, noH1 === 0, `${noH1} pages missing <h1>`);
  warn(s, multiH1 === 0, `${multiH1} pages with multiple <h1>`);
  warn(s, noDesc === 0, `${noDesc} pages missing meta description`);
  ok(s, noViewport === 0, `${noViewport} pages missing viewport meta`);
  warn(s, imgs === 0 || imgsAlt/imgs > 0.9, `img alt coverage ${imgs?((imgsAlt/imgs)*100).toFixed(0):100}%`);
  warn(s, badTitle === 0, `${badTitle} pages with title length outside 8–75 chars`);
  warn(s, noSkip === 0, `${noSkip} pages without a skip-to-content link`);
}

/* ── report ───────────────────────────────────────────────────────────── */
console.log('\n════════════════════ TEST REPORT ════════════════════');
for (const [name, r] of Object.entries(results)) {
  const status = r.fail ? '❌ FAIL' : (r.warn ? '⚠️  PASS(warn)' : '✅ PASS');
  console.log(`\n${status}  ${name}  —  pass:${r.pass} fail:${r.fail} warn:${r.warn}`);
  r.notes.slice(0, 12).forEach(n => console.log('    · ' + n));
  if (r.notes.length > 12) console.log(`    · …and ${r.notes.length - 12} more`);
}
console.log('\n────────────────────────────────────────────────────');
console.log('Browser-only suites (run locally): E2E DOM, rendered a11y, Lighthouse');
console.log('  → npm test            (Playwright: functional/links/seo/a11y/responsive)');
console.log('  → npm run lighthouse  (performance score)');
console.log(`\nHARD FAILURES: ${hardFail}`);
process.exit(hardFail ? 1 : 0);
