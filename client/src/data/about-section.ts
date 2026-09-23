/**
 * One long-form content section: a heading plus its paragraphs.
 *
 * Shared by the category "about" content (category-about.ts) and the
 * programme detail content (programme-details.ts). Paragraphs are plain
 * strings — no markdown — so the renderer cannot be surprised by markup
 * the data never promised.
 */
export interface AboutSection {
  heading: string;
  body: ReadonlyArray<string>;
}
