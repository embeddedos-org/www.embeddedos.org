# `partials/` — Shared Page Markup (Source of Truth)

This folder holds the canonical markup for site-wide chrome:

- `nav.html` — site header / main navigation (incl. Products dropdown with all 14 components)
- `footer.html` — site footer (mega columns, newsletter, legal links)

## Status

The site currently inlines this markup directly into every HTML page. These files are the
**authoritative source of truth**: any nav or footer change should be made here first, then
mirrored across all pages (a tooling task).

The page-by-page partial-include migration (using the `<div data-include="…"></div>` loader
in `js/main.js`) is staged for a follow-up pass once the test suite has been extended to
recognize partial-include placeholders. Until then:

1. Edit `partials/nav.html` and `partials/footer.html` here first.
2. Use the `tools/` migration scripts (or a manual diff) to propagate changes to inlined
   markup in each page.

## How the runtime loader works

`js/main.js` includes a `loadPartials()` IIFE that, on `DOMContentLoaded`:

- Scans the document for any `<div data-include="path/to/partial.html"></div>` placeholders.
- `fetch()`s each partial and replaces the placeholder's outerHTML with the response.
- Dispatches a `partials:loaded` custom event so menu/scroll/dropdown initializers can re-bind.
- No-ops if no placeholders are present (existing inlined pages are unaffected).

This approach satisfies the "no build toolchain" constraint while paving the way for
incremental migration.
