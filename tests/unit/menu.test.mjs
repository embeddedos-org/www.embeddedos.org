import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MENU, normalizePath, isActive, groupActive, menuTargets, canonicalPath } from '../../src/lib/menu.mjs';

test('normalizePath maps root to /index.html', () => {
  assert.equal(normalizePath('/'), '/index.html');
  assert.equal(normalizePath(''), '/index.html');
  assert.equal(normalizePath('/about.html'), '/about.html');
});

test('isActive matches exact page and ignores #fragments', () => {
  assert.equal(isActive('/about.html', '/about.html'), true);
  assert.equal(isActive('/index.html#health-devices', '/index.html'), true);
  assert.equal(isActive('/about.html', '/careers.html'), false);
});

test('isActive treats subdir index spellings as the same page', () => {
  // build emits "/docs.html"; menu references "/docs/index.html"; server may
  // serve "/docs/" — all three are the same page.
  assert.equal(isActive('/docs/index.html', '/docs.html'), true);
  assert.equal(isActive('/docs/index.html', '/docs/'), true);
  assert.equal(isActive('/docs/index.html', '/docs/index.html'), true);
  // must not collapse the site root or unrelated pages
  assert.equal(canonicalPath('/index.html'), '/index.html');
  assert.equal(isActive('/docs/index.html', '/downloads.html'), false);
});

test('groupActive matches subdir index pages (Learn open on /docs.html)', () => {
  const learn = MENU.find((m) => m.label === 'Learn').items;
  assert.equal(groupActive(learn, '/docs.html'), true);
});

test('groupActive is true when a child matches', () => {
  const products = MENU.find((m) => m.label === 'Products').items;
  assert.equal(groupActive(products, '/product-eos.html'), true);
  assert.equal(groupActive(products, '/about.html'), false);
});

test('MENU is well-formed: every group has items, every item has href+label', () => {
  for (const m of MENU) {
    if (m.type === 'group') {
      assert.ok(Array.isArray(m.items) && m.items.length > 0, `${m.label} has items`);
      for (const it of m.items) {
        assert.ok(it.href && it.href.startsWith('/'), `href absolute: ${it.label}`);
        assert.ok(it.label && it.label.length > 0, 'label present');
      }
    } else {
      assert.ok(m.href && m.label, 'link has href+label');
    }
  }
});

test('menuTargets returns unique internal hrefs without fragments', () => {
  const t = menuTargets();
  assert.ok(t.length > 30, 'covers many pages');
  assert.equal(new Set(t).size, t.length, 'no duplicates');
  assert.ok(t.every((h) => !h.includes('#')), 'no fragments');
});
