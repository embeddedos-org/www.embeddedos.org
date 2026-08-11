/**
 * Keeps <title> and the head metadata correct after a client-side navigation.
 *
 * The prerenderer writes a correct <title>, description, canonical and og:*
 * into every route's snapshot at build time, so a *first* load is always right.
 * Nothing updated them afterwards: wouter swaps the page component without
 * touching <head>, so from the second page onward the browser tab, the history
 * entry, the bookmark title and — worst of the four — <link rel="canonical">
 * all still described whichever page the visitor happened to land on first.
 *
 * The rules below are a deliberate copy of `applyMeta` in
 * scripts/prerender.mjs. They cannot be imported from it: that file is a plain
 * .mjs build script that pulls in playwright and express, none of which belongs
 * in a browser bundle. tests/unit/page-meta.test.ts imports both and asserts
 * they agree, so the copy cannot drift silently.
 */

/** Google truncates titles past roughly 70 characters. */
const MAX_TITLE = 70;
const LONG_SUFFIX = " | EmbeddedOS Foundation";
const SHORT_SUFFIX = " | EmbeddedOS";

export const DEFAULT_TITLE =
  "EmbeddedOS — The Operating System for Every Device";

export const ORIGIN = "https://www.embeddedos.org";

export const FALLBACK_DESCRIPTION =
  "EmbeddedOS is a 501(c)(3) nonprofit foundation building an open-source " +
  "operating system for embedded devices, with free documentation, tools and " +
  "education for engineers and students.";

/** Trim to `max`, preferring a word boundary, and mark the cut with an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, "")}…`;
}

/**
 * Build the document title for a page whose main heading is `heading`.
 *
 * Long headings (the article pages) drop to the shorter brand suffix rather
 * than pushing the whole string past what a search result will show.
 */
export function buildTitle(heading: string): string {
  if (!heading) return DEFAULT_TITLE;
  return heading.length + LONG_SUFFIX.length <= MAX_TITLE
    ? heading + LONG_SUFFIX
    : truncate(heading, MAX_TITLE - SHORT_SUFFIX.length) + SHORT_SUFFIX;
}

/** The absolute URL a route should declare as its canonical. */
export function canonicalFor(route: string): string {
  return route === "/" ? `${ORIGIN}/` : `${ORIGIN}${route}`;
}

const clean = (s: string | null | undefined) =>
  (s ?? "").replace(/\s+/g, " ").trim();

/**
 * The same heading the prerenderer reads: the main <h1>, falling back to the
 * first <h1> anywhere if a page renders outside <main>.
 */
export function readHeading(doc: Document = document): string {
  return clean(
    doc.querySelector("main h1")?.textContent ??
      doc.querySelector("h1")?.textContent
  );
}

/** Matches the masthead lines the prerenderer refuses to use as a description. */
const isBoilerplate = (text: string) =>
  /^(effective date|last updated|last revised|published|filed|version|copyright)\b/i.test(
    text
  ) || !/[.!?]/.test(text);

/** The first substantive sentence on the page, mirroring `extractMeta`. */
export function readDescription(doc: Document = document): string {
  let fallback = "";
  for (const el of Array.from(doc.querySelectorAll("main p, main li"))) {
    const text = clean(el.textContent);
    if (text.length < 70) continue;
    if (isBoilerplate(text)) {
      fallback ||= text;
      continue;
    }
    return text;
  }
  return fallback;
}

function setMeta(doc: Document, selector: string, value: string) {
  const el = doc.querySelector(selector);
  if (el) el.setAttribute("content", value);
}

/**
 * Rewrite the head to describe `route`, reading the heading and description
 * out of the DOM exactly as the prerenderer reads them out of the page.
 */
export function applyRouteMeta(route: string, doc: Document = document): void {
  const title = buildTitle(readHeading(doc));
  const description = truncate(
    readDescription(doc) || FALLBACK_DESCRIPTION,
    250
  );
  const canonical = canonicalFor(route);

  doc.title = title;
  setMeta(doc, 'meta[name="description"]', description);
  setMeta(doc, 'meta[property="og:title"]', title);
  setMeta(doc, 'meta[property="og:description"]', description);
  setMeta(doc, 'meta[property="og:url"]', canonical);

  const link = doc.querySelector('link[rel="canonical"]');
  if (link) link.setAttribute("href", canonical);
}
