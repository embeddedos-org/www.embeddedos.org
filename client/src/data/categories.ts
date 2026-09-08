/**
 * The Marketing and Research structure, as data.
 *
 * The Foundation's published organisational design names 21 marketing
 * categories and 16 research categories. Before this file, five of those 37 had
 * a page; the other 32 existed only in the design document, so there was no way
 * to tell from the code whether the site covered the structure it claims to
 * have, and no way for a reviewer to check.
 *
 * Writing the structure down as data makes that checkable. `name` is the
 * category name from the design, verbatim — tests/unit/categories.test.ts holds
 * the design's own list and fails if the two ever diverge, in either direction.
 * That is the point of the file: not to describe the site, but to make the site
 * answerable to the design.
 *
 * ## What a category page owes the reader
 *
 * A category with nothing published is common here and will stay that way for a
 * while. Two honest options exist for those, and one dishonest one. The
 * dishonest one is inventing a press release. The two honest ones are omitting
 * the page, which was the previous approach, or publishing a page that says
 * plainly that nothing is out yet and tells the reader what will appear and how
 * to be told when it does.
 *
 * The second is better here, and the difference matters: `/press-releases` with
 * a press contact and a link to the announcements feed is useful to a
 * journalist on the day before the first release exists. What it must never do
 * is imply volume that is not there. Every index states its count, including
 * zero, and `emptyNote` carries the "what goes here" copy that makes the page
 * worth loading in the meantime.
 */

import type { ContentKind, ResearchArea } from "./content";
import type { ContactTopicKey } from "./foundation";

export type CategoryGroup = "marketing" | "research";

/**
 * What supplies a category's content.
 *
 * `kind` and `area` filter the content registry. `programme` renders from
 * programmes.ts, because an Ambassador Program is people rather than posts and
 * "0 published" is the wrong sentence about it. `page` is a bespoke component
 * for the four categories that are neither — a press kit is a set of facts, not
 * a feed.
 */
export type CategoryBinding =
  | { type: "kind"; kind: ContentKind }
  | { type: "area"; area: ResearchArea }
  | { type: "programme"; slug: string }
  | { type: "page" };

export interface Category {
  /** Route path. Also the canonical URL for the category. */
  path: string;
  /** The category's name in the design document, verbatim. */
  name: string;
  group: CategoryGroup;
  binding: CategoryBinding;
  /** One sentence: what this category is. Shown as the page intro. */
  summary: string;
  /**
   * What a reader should know while the category is empty, and what to do
   * about it. Omitted where the category cannot be empty (a programme hub, a
   * bespoke page) or already has content.
   */
  emptyNote?: string;
  /**
   * Which `CONTACT_TOPICS` key the empty-state's "get in touch" button routes
   * to. Defaults to "contact" (see ContentIndex.tsx) when omitted; set this
   * where a category has a more specific inbox, e.g. Press Releases → press.
   */
  contactTopic?: ContactTopicKey;
}

const kind = (k: ContentKind): CategoryBinding => ({ type: "kind", kind: k });
const area = (a: ResearchArea): CategoryBinding => ({ type: "area", area: a });
const programme = (slug: string): CategoryBinding => ({
  type: "programme",
  slug,
});
const page: CategoryBinding = { type: "page" };

export const MARKETING_CATEGORIES: readonly Category[] = [
  {
    path: "/blog",
    name: "Blog",
    group: "marketing",
    binding: kind("blog"),
    summary:
      "Deep dives from the people building EmbeddedOS — design decisions, trade-offs, and the things that did not work.",
  },
  {
    path: "/news",
    name: "News",
    group: "marketing",
    binding: kind("news"),
    summary:
      "Announcements, releases and milestones across the EmbeddedOS ecosystem.",
  },
  {
    path: "/press-releases",
    name: "Press Releases",
    group: "marketing",
    binding: kind("press-release"),
    summary:
      "Formal announcements issued by the Foundation, written for journalists and analysts.",
    emptyNote:
      "The Foundation has not issued a formal press release yet. Announcements so far have gone out through News. Journalists working to a deadline should contact Press & Media directly rather than wait for this page.",
    contactTopic: "press",
  },
  {
    path: "/newsletter",
    name: "Newsletter",
    group: "marketing",
    binding: kind("newsletter"),
    summary:
      "A periodic summary of what shipped, what is being designed, and what needs help.",
    emptyNote:
      "No issue has been sent yet. The archive will appear here once the first one goes out, and every issue will stay readable on the web without subscribing.",
  },
  {
    path: "/case-studies",
    name: "Case Studies",
    group: "marketing",
    binding: kind("case-study"),
    summary:
      "How organisations deployed EmbeddedOS, what it replaced, and what it measurably cost or saved.",
    emptyNote:
      "None published. A case study needs a real deployment and numbers its subject is willing to stand behind, so these will follow the first production users rather than lead them. If you are running EmbeddedOS in production and would talk about it, get in touch below.",
  },
  {
    path: "/member-stories",
    name: "Member Stories",
    group: "marketing",
    binding: kind("member-story"),
    summary:
      "Member organisations in their own words — why they joined and what they are building.",
    emptyNote:
      "None published. The membership programme is still being set up, so there are no member stories to tell yet.",
  },
  {
    path: "/product-showcases",
    name: "Product Showcases",
    group: "marketing",
    binding: kind("product-showcase"),
    summary:
      "Shipping products built on EmbeddedOS, with the parts of the stack they use.",
    emptyNote:
      "None published. This page is for products that have actually shipped to customers, which is a deliberately higher bar than a demo. Building one? Get in touch below.",
  },
  {
    path: "/project-showcases",
    name: "Project Showcases",
    group: "marketing",
    binding: kind("project-showcase"),
    summary:
      "Community projects, research builds and hardware experiments running on the stack.",
    emptyNote:
      "None published. Unlike Product Showcases there is no shipping requirement here — a working project on real hardware is enough. Send one in using the link below.",
  },
  {
    path: "/videos",
    name: "Videos",
    group: "marketing",
    binding: kind("video"),
    summary:
      "Recorded talks, walkthroughs and demonstrations, indexed so they are findable outside YouTube.",
    emptyNote:
      "Nothing indexed here yet. The Foundation's channel is on YouTube, and recordings will be listed on this page as they are published so they remain findable without a Google account.",
  },
  {
    path: "/youtube",
    name: "YouTube",
    group: "marketing",
    binding: page,
    summary:
      "The Foundation's YouTube channel — what it carries and where to find it.",
  },
  {
    path: "/podcast",
    name: "Podcast",
    group: "marketing",
    binding: kind("podcast"),
    summary:
      "Conversations with the engineers building embedded systems, and the people running them in production.",
    emptyNote:
      "No episodes yet. When the podcast starts it will publish to an open RSS feed as well as the usual directories, so it can be followed without an account anywhere.",
  },
  {
    path: "/webinars",
    name: "Webinars",
    group: "marketing",
    binding: kind("webinar"),
    summary:
      "Live technical sessions, with the recording and materials published afterwards.",
    emptyNote:
      "None scheduled yet. Sessions will be announced through News and the newsletter, and every recording will be posted here afterwards rather than gated behind a form.",
  },
  {
    path: "/social",
    name: "Social Media",
    group: "marketing",
    binding: page,
    summary:
      "Every account the Foundation actually runs, so an impostor account is easy to spot.",
  },
  {
    path: "/programmes/conference-presence",
    name: "Conference Presence",
    group: "marketing",
    binding: programme("conference-presence"),
    summary:
      "Talks, booths and workshops at embedded, RTOS and open-source conferences.",
  },
  {
    path: "/programmes/community-meetups",
    name: "Community Meetups",
    group: "marketing",
    binding: programme("community-meetups"),
    summary:
      "Local meetings for people building on EmbeddedOS, organised with support from the Foundation.",
  },
  {
    path: "/programmes/ambassador",
    name: "Ambassador Program",
    group: "marketing",
    binding: programme("ambassador"),
    summary:
      "Recognised contributors who represent EmbeddedOS in their region and carry feedback back to the project.",
  },
  {
    path: "/programmes/university-program",
    name: "University Program",
    group: "marketing",
    binding: programme("university-program"),
    summary:
      "Course materials, hardware kits and mentoring for universities teaching embedded systems on an open stack.",
  },
  {
    path: "/programmes/member-marketing",
    name: "Member Marketing",
    group: "marketing",
    binding: programme("member-marketing"),
    summary:
      "Blog slots, social amplification and launch support for member organisations.",
  },
  {
    path: "/programmes/partner-marketing",
    name: "Partner Marketing",
    group: "marketing",
    binding: programme("partner-marketing"),
    summary:
      "Joint announcements and co-authored material with silicon vendors and integrators.",
  },
  {
    path: "/brand",
    name: "Brand Assets",
    group: "marketing",
    binding: page,
    summary:
      "Logos, colours, typography and the rules for using them — including when not to ask.",
  },
  {
    path: "/press-kit",
    name: "Media/Press Kit",
    group: "marketing",
    binding: page,
    summary:
      "The facts a journalist needs in one place: legal name, tax status, boilerplate, contacts and logos.",
  },
];

export const RESEARCH_CATEGORIES: readonly Category[] = [
  {
    path: "/publications",
    name: "Publications",
    group: "research",
    binding: kind("publication"),
    summary:
      "Peer-facing papers on the architecture, security model and toolchain of EmbeddedOS.",
  },
  {
    path: "/white-papers",
    name: "White Papers",
    group: "research",
    binding: kind("white-paper"),
    summary:
      "Long-form arguments about how embedded systems should be built, aimed at people making platform decisions.",
    emptyNote:
      "None published. White papers will appear here as the architecture work reaches the point where the argument is worth making in full rather than in a blog post.",
  },
  {
    path: "/technical-reports",
    name: "Technical Reports",
    group: "research",
    binding: kind("technical-report"),
    summary:
      "Engineering write-ups of individual subsystems, measured on real hardware where the measurement is the point.",
  },
  {
    path: "/benchmarks",
    name: "Benchmarks",
    group: "research",
    binding: kind("benchmark"),
    summary:
      "Performance results with the configuration stated, so they can be reproduced or disputed.",
  },
  {
    path: "/research/architecture",
    name: "Architecture Research",
    group: "research",
    binding: area("architecture"),
    summary:
      "How the layers fit together, and what the boundaries between them are allowed to assume.",
    emptyNote:
      "Nothing filed under this area yet. Architecture work currently appears in the technical reports and in the master design document rather than as standalone research.",
  },
  {
    path: "/research/security",
    name: "Security Research",
    group: "research",
    binding: area("security"),
    summary:
      "Secure boot, verified update, key handling and the failure modes of each.",
  },
  {
    path: "/research/ai",
    name: "AI Research",
    group: "research",
    binding: area("ai"),
    summary:
      "Running inference on constrained devices, and what that costs in memory, latency and power.",
  },
  {
    path: "/research/embedded-systems",
    name: "Embedded Systems Research",
    group: "research",
    binding: area("embedded-systems"),
    summary:
      "Drivers, board bring-up, and the practical problems of shipping software onto hardware.",
  },
  {
    path: "/research/rtos",
    name: "RTOS Research",
    group: "research",
    binding: area("rtos"),
    summary:
      "Scheduling, determinism and worst-case timing — the properties that make a system real-time rather than merely fast.",
  },
  {
    path: "/research/linux",
    name: "Linux Research",
    group: "research",
    binding: area("linux"),
    summary:
      "Where EmbeddedOS meets Linux: shared tooling, comparisons, and the cases where Linux is the right answer.",
    emptyNote:
      "Nothing filed under this area yet. Comparative work against Linux is planned but not published, and publishing a comparison before the measurements exist would be the wrong order.",
  },
  {
    path: "/research/hardware",
    name: "Hardware Research",
    group: "research",
    binding: area("hardware"),
    summary:
      "Silicon, boards and the hardware features an operating system can rely on.",
  },
  {
    path: "/research/networking",
    name: "Networking Research",
    group: "research",
    binding: area("networking"),
    summary:
      "Connectivity for constrained devices: stacks, protocols and their behaviour under loss.",
    emptyNote:
      "Nothing filed under this area yet. The networking layer exists in the platform, but no research write-up has been published about it.",
  },
  {
    path: "/programmes/university-collaborations",
    name: "University Collaborations",
    group: "research",
    binding: programme("university-collaborations"),
    summary:
      "Formal research partnerships with academic groups, publishing jointly and contributing results back.",
  },
  {
    path: "/programmes/industry-collaborations",
    name: "Industry Collaborations",
    group: "research",
    binding: programme("industry-collaborations"),
    summary:
      "Applied research with companies deploying EmbeddedOS, on problems too large for one organisation.",
  },
  {
    path: "/programmes/grants",
    name: "Grants",
    group: "research",
    binding: programme("grants"),
    summary:
      "Funding for independent work on the embedded stack, awarded on published criteria.",
  },
  {
    path: "/datasets",
    name: "Research Dataset",
    group: "research",
    binding: kind("dataset"),
    summary:
      "Measurement data published in full, so that results taken from it can be checked.",
    emptyNote:
      "No dataset published yet. When benchmark data is released it will be published here under an open licence with the collection method described, because a benchmark whose data nobody can inspect is an assertion.",
  },
];

export const ALL_CATEGORIES: readonly Category[] = [
  ...MARKETING_CATEGORIES,
  ...RESEARCH_CATEGORIES,
];

/** The category served at a path, or undefined. */
export function categoryByPath(path: string): Category | undefined {
  return ALL_CATEGORIES.find(c => c.path === path);
}

/** Categories in one group, in the design document's order. */
export function categoriesOf(group: CategoryGroup): Category[] {
  return ALL_CATEGORIES.filter(c => c.group === group);
}

/** Categories bound to a content kind, an area, or a programme. */
export function categoriesBound<T extends CategoryBinding["type"]>(
  type: T
): Category[] {
  return ALL_CATEGORIES.filter(c => c.binding.type === type);
}
