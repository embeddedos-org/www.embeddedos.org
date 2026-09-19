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

/**
 * Per-route title overrides. Consulted before the heading-derived title.
 *
 * The homepage's h1 ("Open-source embedded systems for intelligent physical
 * devices") truncates mid-phrase under the 70-char budget, dropping the key
 * noun "devices" — see F-05. An explicit override keeps the indexed title
 * short, complete and honest. Every value must stay ≤ 60 characters.
 *
 * Mirrored in scripts/prerender.mjs (TITLE_OVERRIDES); the two tables must
 * stay identical — tests/unit/page-meta.test.ts enforces it.
 */
export const TITLE_OVERRIDES: Record<string, string> = {
  "/": "Open-source embedded OS for every device | EmbeddedOS",
};

/**
 * Per-route meta-description overrides, consulted before the extracted
 * first-paragraph description (F-25). Hand-written for the highest-intent
 * routes; every other route keeps the extracted description.
 *
 * Mirrored in scripts/prerender.mjs (DESCRIPTION_OVERRIDES); the two tables
 * must stay identical — tests/unit/page-meta.test.ts enforces it.
 */
export const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "/":
    "EmbeddedOS is a 501(c)(3) nonprofit building a free, open-source " +
    "operating system for embedded devices — kernel, tools, docs and " +
    "education, MIT licensed.",
  "/donate":
    "Support the EmbeddedOS Foundation's open-source embedded systems " +
    "research and free education. 501(c)(3) nonprofit, EIN 41-4821627 — " +
    "gifts are tax-deductible.",
  "/projects":
    "23 open-source repositories: the EoS real-time kernel, bootloader, " +
    "IPC, build tools, AI, simulators, apps and hardware — all MIT " +
    "licensed on GitHub.",
  "/mission":
    "Our mission: advance open-source embedded systems research, " +
    "education and technology for the public benefit — free to read, " +
    "audit, learn from and build on.",
  "/about":
    "The Embedded Operating Systems Research Foundation (EIN 41-4821627) " +
    "is a 501(c)(3) public charity advancing open embedded systems.",
  "/contact":
    "Contact the EmbeddedOS Foundation: general inquiries, technical " +
    "support, press, partnerships, careers and donations. Every topic " +
    "reaches a person.",
  "/books":
    "Free technical books on embedded systems from the EmbeddedOS " +
    "Foundation — full-length, openly licensed, including a kids edition.",
  "/research":
    "Open research into real-time operating systems, edge AI, health " +
    "hardware, avionics and quantum control — published openly, never " +
    "licensed.",
  "/get-involved":
    "Contribute to EmbeddedOS: code, docs, hardware testing, internships " +
    "and community programmes. All work is public and MIT licensed.",
  "/transparency":
    "How the EmbeddedOS Foundation handles money and decisions: " +
    "nonprofit disclosures, finances, governance and public records.",
};

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
 * than pushing the whole string past what a search result will show. A
 * per-route override wins over both when one is declared.
 */
export function buildTitle(heading: string, route?: string): string {
  if (route && TITLE_OVERRIDES[route]) return TITLE_OVERRIDES[route];
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

/** Read the page's own representative image: the first image in <main>. */
export function readPageImage(doc: Document = document): string {
  const src = doc.querySelector("main img")?.getAttribute("src")?.trim();
  if (!src || src.startsWith("data:")) return "";
  return src.startsWith("http")
    ? src
    : `${ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
}

/**
 * Rewrite the head to describe `route`, reading the heading and description
 * out of the DOM exactly as the prerenderer reads them out of the page.
 */
export function applyRouteMeta(route: string, doc: Document = document): void {
  const title = buildTitle(readHeading(doc), route);
  const description = truncate(
    DESCRIPTION_OVERRIDES[route] ||
      readDescription(doc) ||
      FALLBACK_DESCRIPTION,
    250
  );
  const canonical = canonicalFor(route);
  const image = readPageImage(doc);

  doc.title = title;
  setMeta(doc, 'meta[name="description"]', description);
  setMeta(doc, 'meta[property="og:title"]', title);
  setMeta(doc, 'meta[property="og:description"]', description);
  setMeta(doc, 'meta[property="og:url"]', canonical);
  setMeta(doc, 'meta[name="twitter:title"]', title);
  setMeta(doc, 'meta[name="twitter:description"]', description);
  if (image) {
    setMeta(doc, 'meta[property="og:image"]', image);
    setMeta(doc, 'meta[name="twitter:image"]', image);
  }

  const link = doc.querySelector('link[rel="canonical"]');
  if (link) link.setAttribute("href", canonical);
}
