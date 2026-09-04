/**
 * The brand, as publishable facts.
 *
 * Two of the design's marketing categories — Brand Assets and Media/Press Kit —
 * are not feeds. They are a fixed set of things a journalist or a member
 * organisation needs at 5pm on a deadline: the legal name spelled correctly, a
 * logo they are allowed to use, a colour they can match, and a sentence about
 * the Foundation they can paste without rewriting.
 *
 * The values here are the ones already in use elsewhere on the site rather than
 * a separate set invented for this page. The palette is read off the actual
 * stylesheet, and the boilerplate is built from the same FOUNDATION record that
 * feeds /about and the JSON-LD, so a press kit cannot quietly disagree with the
 * page it describes.
 */

/** A colour anyone reproducing the brand needs, with what it is for. */
export interface BrandColor {
  name: string;
  hex: string;
  use: string;
  /** True where the colour is dark enough to carry white text at 4.5:1. */
  darkGround: boolean;
}

export const BRAND_COLORS: readonly BrandColor[] = [
  {
    name: "Signal Orange",
    hex: "#F97316",
    use: "The primary accent. Actions, links and anything asking to be pressed.",
    darkGround: false,
  },
  {
    name: "Deep Navy",
    hex: "#0B1D3A",
    use: "The primary ground. Section backgrounds and the top of most pages.",
    darkGround: true,
  },
  {
    name: "Near Black",
    hex: "#060A14",
    use: "The darkest ground, used to separate one band of a page from the next.",
    darkGround: true,
  },
  {
    name: "Circuit Cyan",
    hex: "#22D3EE",
    use: "Secondary accent for diagrams and the technical illustrations.",
    darkGround: false,
  },
  {
    name: "Signal Violet",
    hex: "#A78BFA",
    use: "Third accent, used for the application tier in architecture diagrams.",
    darkGround: false,
  },
  {
    name: "Status Green",
    hex: "#34D399",
    use: "Reserved for state, never decoration: something is running or passing.",
    darkGround: false,
  },
];

/** A downloadable asset. Paths are served from /media and the site root. */
export interface BrandAsset {
  name: string;
  href: string;
  format: string;
  note: string;
}

export const BRAND_ASSETS: readonly BrandAsset[] = [
  {
    name: "Logo mark",
    href: "/media/embeddedos-logo-mark_bc053888.jpg",
    format: "JPG",
    note: "The mark on its own. Use where the Foundation is already named in the surrounding text.",
  },
  {
    name: "App icon, 512px",
    href: "/android-chrome-512x512.png",
    format: "PNG",
    note: "Square icon with transparent-safe padding, for app listings and avatars.",
  },
  {
    name: "App icon, 192px",
    href: "/android-chrome-192x192.png",
    format: "PNG",
    note: "The same icon at listing size.",
  },
  {
    name: "Apple touch icon",
    href: "/apple-touch-icon.png",
    format: "PNG",
    note: "180px, for iOS home screens.",
  },
  {
    name: "Favicon",
    href: "/favicon.ico",
    format: "ICO",
    note: "Multi-resolution browser icon.",
  },
];

/**
 * What people may and may not do with the marks, in plain language.
 *
 * Written as permissions first. A brand page that opens with prohibitions
 * reads as a legal department, and the Foundation's interest is in the marks
 * being used correctly and often, not sparingly.
 */
export const BRAND_PERMITTED: readonly string[] = [
  "Use the logo to link to embeddedos.org, or to say that your product runs on or supports EmbeddedOS.",
  "Use it in a talk, a paper, a course, or an article about the Foundation or its software.",
  "Scale it, and place it on either a light or a dark ground, so long as it stays legible.",
  "Use the colours and typefaces below in material about EmbeddedOS.",
];

export const BRAND_NOT_PERMITTED: readonly string[] = [
  "Redraw, recolour, rotate, stretch or add effects to the mark.",
  "Use the mark or the name in your own product name, company name, or domain.",
  "Present the logo in a way that implies the Foundation endorses, certifies or sponsors your product, unless it does and you can point to where that is written down.",
  "Use the mark as the most prominent element on packaging or a site that is not the Foundation's.",
];

/** The typefaces the site actually uses. */
export const BRAND_TYPE: readonly {
  role: string;
  family: string;
  note: string;
}[] = [
  {
    role: "Headings",
    family: "Space Grotesk",
    note: "Titles and section headings, weights 300–700. Falls back to system-ui.",
  },
  {
    role: "Body",
    family: "DM Sans",
    note: "Running text and interface labels, weights 300–700, optical sizing on.",
  },
  {
    role: "Code and data",
    family: "JetBrains Mono",
    note: "Code samples, terminal output and anything where digits must line up.",
  },
];
