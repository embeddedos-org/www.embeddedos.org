/**
 * Every piece of editorial content on the site — one registry, many kinds.
 *
 * Before this module each kind of content was a page. `/news` held sixteen
 * items in a `NEWS_ITEMS` array inside its own component, and each long-form
 * article was a separate ~130-line `.tsx` with the prose inline as JSX: eight
 * of them, 1,077 lines, one route apiece.
 *
 * That does not scale to a marketing and research programme. Blog, News, Press
 * Releases, Newsletter, Case Studies, Member Stories, Product Showcases,
 * Project Showcases, Webinars — plus Publications, White Papers, Technical
 * Reports, Benchmarks and the rest of the research layer — would each be a new
 * React component and a new route for every item anyone publishes. Content that
 * costs a code review to publish does not get published.
 *
 * Here content is data. A new post is an entry in CONTENT; its kind decides
 * which index lists it. Adding a category is adding a string to ContentKind,
 * not building a page.
 *
 * Two things this fixes rather than merely moves:
 *
 *   Dates were display strings — "July 2026" — so the list could not be sorted
 *   and was maintained in hand-written order. An item inserted in the wrong
 *   place stayed there, silently. Dates are now ISO and the order is computed.
 *
 *   `internal` was an optional flag that News.tsx read through `(item as any)`,
 *   because the array had no type. Whether a link is internal is not a fact
 *   about a post, it is a fact about its href, so it is derived rather than
 *   stored — one less field that can disagree with reality.
 *
 * Nothing here is presentation. Colours, layout and animation stay in the
 * components; this module holds only what is true about the content.
 */

/**
 * The publishable categories.
 *
 * Marketing first, then research, in the order the Foundation's programme
 * describes them. Adding a category means adding a member here and a label in
 * KIND_LABEL — TypeScript then requires every exhaustive use to handle it.
 */
export type ContentKind =
  // Marketing
  | "blog"
  | "news"
  | "press-release"
  | "newsletter"
  | "case-study"
  | "member-story"
  | "product-showcase"
  | "project-showcase"
  | "video"
  | "podcast"
  | "webinar"
  // Research
  | "publication"
  | "white-paper"
  | "technical-report"
  | "benchmark"
  | "dataset";

/** Human-readable singular label for each kind. */
export const KIND_LABEL: Record<ContentKind, string> = {
  blog: "Blog",
  news: "News",
  "press-release": "Press Release",
  newsletter: "Newsletter",
  "case-study": "Case Study",
  "member-story": "Member Story",
  "product-showcase": "Product Showcase",
  "project-showcase": "Project Showcase",
  video: "Video",
  podcast: "Podcast",
  webinar: "Webinar",
  publication: "Publication",
  "white-paper": "White Paper",
  "technical-report": "Technical Report",
  benchmark: "Benchmark",
  dataset: "Research Dataset",
};

/** Which kinds belong to which programme, for section indexes. */
export const MARKETING_KINDS: readonly ContentKind[] = [
  "blog",
  "news",
  "press-release",
  "newsletter",
  "case-study",
  "member-story",
  "product-showcase",
  "project-showcase",
  "video",
  "podcast",
  "webinar",
];

export const RESEARCH_KINDS: readonly ContentKind[] = [
  "publication",
  "white-paper",
  "technical-report",
  "benchmark",
  "dataset",
];

/**
 * What a piece of research is *about*, as opposed to what it *is*.
 *
 * Kind and area are separate axes and conflating them loses information: a
 * benchmark of the AI runtime and a white paper on the AI runtime are the same
 * subject in two formats, and a reader browsing "AI Research" wants both.
 *
 * A closed vocabulary rather than free tags. The existing `tags` field is
 * open, and it shows why: eighteen items carry forty-six distinct tags, with
 * `eAI` and `EAI`, `eNI` and `ENI` already diverging by case. Free tags are
 * useful as keywords and useless as navigation, because nothing can enumerate
 * them or guarantee a page exists behind one.
 */
export type ResearchArea =
  | "architecture"
  | "security"
  | "ai"
  | "embedded-systems"
  | "rtos"
  | "linux"
  | "hardware"
  | "networking";

export const AREA_LABEL: Record<ResearchArea, string> = {
  architecture: "Architecture Research",
  security: "Security Research",
  ai: "AI Research",
  "embedded-systems": "Embedded Systems Research",
  rtos: "RTOS Research",
  linux: "Linux Research",
  hardware: "Hardware Research",
  networking: "Networking Research",
};

export const RESEARCH_AREAS = Object.keys(AREA_LABEL) as ResearchArea[];

export interface ContentItem {
  /** Stable identifier, unique across all kinds. */
  slug: string;
  kind: ContentKind;
  title: string;
  /**
   * ISO 8601, `YYYY-MM-DD`. Day precision even when only the month is
   * published — the first is used, and `formatDate` renders month and year, so
   * the extra precision never reaches the page. Sorting needs a real date;
   * readers do not need to see one.
   */
  date: string;
  summary: string;
  /**
   * Where the item lives. A path beginning `/` is a page on this site;
   * anything else is external and should open in a new tab. See `isInternal`.
   */
  href: string;
  /** Free-form topic keywords, shown as chips. Not navigation — see area. */
  tags: readonly string[];
  /**
   * Subject area, for research content. Optional because most marketing
   * content has no research subject, and inventing one for a press release
   * would make the area filters meaningless.
   */
  area?: ResearchArea;
  /**
   * Short badge label. Falls back to the kind's label when absent — most items
   * do not need one, and the ones that do are saying something the kind cannot,
   * such as "Patent".
   */
  badge?: string;
}

/**
 * True when the href points at a page on this site rather than off it.
 *
 * `//example.com` is excluded deliberately. It begins with a slash but is
 * protocol-relative and navigates off-site, so a plain `startsWith("/")` would
 * render it through wouter's `<Link>` — an off-site destination presented as
 * in-app navigation, with no `rel="noopener"` and no new tab.
 */
export function isInternal(item: ContentItem): boolean {
  return item.href.startsWith("/") && !item.href.startsWith("//");
}

/** The badge to display: the override if given, otherwise the kind's label. */
export function badgeOf(item: ContentItem): string {
  return item.badge ?? KIND_LABEL[item.kind];
}

/**
 * Every published item, in no particular order.
 *
 * Order is computed by the accessors below, so entries can be appended without
 * anyone having to find the right position — which is what went wrong with the
 * hand-ordered array this replaces.
 */
export const CONTENT: readonly ContentItem[] = [
  {
    slug: "eai-eni-released",
    kind: "news",
    date: "2026-07-01",
    badge: "Release",
    title:
      "eAI and eNI Released — On-Device AI and Neural Interface for Embedded Systems",
    summary:
      "The eAI on-device inference engine and eNI neural interface adapter are now publicly available on GitHub. eAI supports TensorFlow Lite, ONNX Runtime, and custom quantized models on ARM Cortex-M and RISC-V. eNI provides a hardware abstraction layer for neural interface devices including EEG, EMG, and ECoG sensors.",
    href: "https://github.com/embeddedos-org/eAI",
    tags: ["eAI", "eNI", "AI", "Neural"],
  },
  {
    slug: "health-band-neuro-patent",
    kind: "news",
    date: "2026-06-01",
    badge: "Patent",
    title:
      "HEALTH-BAND Neuro Patent Application Filed — U.S. App. No. 64/076,078",
    summary:
      "The Embedded Operating Systems Research Foundation has filed a patent application for the HEALTH-BAND Neuro wristband (U.S. Provisional Application No. 64/076,078). The device combines surface electromyography (sEMG) with transcutaneous electrical nerve stimulation (TENS) in a wearable form factor running EmbeddedOS.",
    href: "https://github.com/embeddedos-org/eos-health",
    tags: ["Health", "Patent", "HEALTH-BAND"],
  },
  {
    slug: "health-key-ultra-patent",
    kind: "news",
    date: "2026-05-01",
    badge: "Patent",
    title:
      "HEALTH-KEY ULTRA Patent Application Filed — U.S. App. No. 64/073,334",
    summary:
      "Patent application filed for the HEALTH-KEY ULTRA USB-C health monitoring key (U.S. Provisional Application No. 64/073,334). The device measures ECG, SpO₂, heart rate, and skin conductance through a USB-C connector, powered by the EmbeddedOS health firmware stack.",
    href: "https://github.com/embeddedos-org/eos-health",
    tags: ["Health", "Patent", "HEALTH-KEY"],
  },
  {
    slug: "aeroswift-announced",
    kind: "news",
    date: "2026-04-01",
    badge: "Announcement",
    title: "AeroSwift Personal and Transit VTOL Aircraft Platforms Announced",
    summary:
      "EmbeddedOS announces the AeroSwift aerospace platform — a family of VTOL aircraft powered by the EmbeddedOS avionics stack. AeroSwift Personal is a 1-2 seat personal air vehicle; AeroSwift Transit is a 10-seat urban air taxi. Both run EmbeddedOS with DO-178C-compliant flight software.",
    href: "/aerospace",
    tags: ["Aerospace", "AeroSwift", "VTOL"],
  },
  {
    slug: "eosim-v2",
    kind: "news",
    date: "2026-03-01",
    badge: "Release",
    title: "EoSim v2.0 — 63+ Board Simulator with Full Peripheral Emulation",
    summary:
      "EoSim v2.0 ships with support for 63+ embedded boards including STM32, ESP32, nRF52, RP2040, and RISC-V targets. New features include GPIO/UART/SPI/I2C peripheral emulation, GDB integration, and a visual memory map inspector. Available at github.com/embeddedos-org/EoSim.",
    href: "https://github.com/embeddedos-org/EoSim",
    tags: ["EoSim", "Simulator", "Dev Tools"],
  },
  {
    slug: "eostudio-v3-1",
    kind: "news",
    date: "2026-02-01",
    badge: "Release",
    title: "EoStudio v3.1 — Universal IDE with 3D Modeler and AI Tutor",
    summary:
      "EoStudio v3.1 is now available. New features include an integrated 3D hardware modeler, an AI-powered code tutor using eosllm, a game editor for EmbeddedOS game development, and improved cross-compilation support for ARM, RISC-V, and MIPS targets.",
    href: "https://github.com/embeddedos-org/EoStudio",
    tags: ["EoStudio", "IDE", "Dev Tools"],
  },
  {
    slug: "ecosystem-22-repositories",
    kind: "news",
    date: "2026-01-01",
    badge: "Ecosystem",
    title: "EmbeddedOS Ecosystem Reaches 22 Open-Source Repositories",
    summary:
      "The EmbeddedOS ecosystem has grown to 22 public repositories covering the full embedded systems stack: kernel, bootloader, IPC, build tools, AI inference, neural interfaces, applications, health devices, aerospace avionics, and developer tools. All repositories are MIT-licensed and available at github.com/embeddedos-org.",
    href: "https://github.com/embeddedos-org",
    tags: ["Ecosystem", "Foundation", "GitHub"],
  },
  {
    slug: "eosllm-released",
    kind: "news",
    date: "2025-12-01",
    badge: "Release",
    title: "eosllm — On-Device LLM Inference for Embedded Systems",
    summary:
      "eosllm brings large language model inference to resource-constrained embedded devices. Supports quantized models (4-bit, 8-bit), streaming token generation, and runs on devices with as little as 256KB RAM. Designed for edge AI applications in industrial, medical, and consumer electronics.",
    href: "https://github.com/embeddedos-org/eosllm",
    tags: ["eosllm", "LLM", "AI", "Edge AI"],
  },
  {
    slug: "foundation-membership-2026",
    kind: "blog",
    date: "2025-11-01",
    badge: "Foundation",
    title: "Foundation 2026 Membership: Governance, Voting, Working Groups",
    summary:
      "The 2026 membership cycle opens with three new working groups (Safety-Certified, Embedded AI Ethics, and Neural Interface Standards) and a refreshed governance charter with public TSC voting records.",
    href: "/article-foundation-membership-2026",
    tags: ["Foundation", "Governance", "Membership"],
  },
  {
    slug: "eosim-hil-bridge",
    kind: "blog",
    date: "2025-10-01",
    badge: "Engineering",
    title: "EoSim 2.4 HIL Bridge: Virtual Peripherals Talking to Real Silicon",
    summary:
      "EoSim 2.4 introduces a bidirectional hardware-in-the-loop bridge via the ezbus USB protocol. Drive simulated EoS images from a real PHY, or drive real boards from a simulated MMIO bus.",
    href: "/article-eosim-hil-bridge",
    tags: ["EoSim", "HIL", "Testing"],
  },
  {
    // Also listed on /research, as an "Architecture Overview". Kept research
    // so both pages agree; a roadmap is the weakest of the four such cases and
    // is the one to revisit first if the classification is wrong.
    slug: "eos-roadmap-2026",
    area: "rtos",
    kind: "technical-report",
    date: "2025-09-01",
    badge: "Roadmap",
    title: "EoS RTOS Roadmap 2026: Tickless Idle, RT-IPC, Formal Verification",
    summary:
      "Three large RTOS bets for 2026: a tickless scheduler with sub-microsecond wake latency, RT-IPC primitives sharing memory across security domains, and a formally verified context-switch path using TLA+ and Coq.",
    href: "/article-eos-roadmap-2026",
    tags: ["Roadmap", "RTOS", "2026"],
  },
  {
    slug: "eni-1024-channel-pipeline",
    area: "hardware",
    kind: "technical-report",
    date: "2025-08-01",
    badge: "Research",
    title:
      "ENI's 1,024-Channel Pipeline: Deterministic Spike Sorting in 800 µs",
    summary:
      "How the Embedded Neural Interface stack moves a thousand-electrode array through filtering, sorting, and decoding inside a single RTOS frame — and why determinism matters more than throughput.",
    href: "/article-eni-1024-channel-pipeline",
    tags: ["ENI", "BCI", "Research"],
  },
  {
    slug: "edb-encryption-at-rest",
    kind: "blog",
    date: "2025-07-01",
    badge: "Security",
    title: "eDB Ships AES-XTS At-Rest Encryption — Even on 64 KB Devices",
    summary:
      "eDB's new storage layer adds page-level AES-XTS encryption with hardware-key offload on supported MCUs. The cipher fits in 6 KB of code on the smallest target.",
    href: "/article-edb-encryption-at-rest",
    tags: ["eDB", "Encryption", "Security"],
  },
  {
    // Classified as research rather than blog because /research already
    // presented it as a "Security Analysis". Two pages disagreeing about what
    // a piece is, is the same defect as two pages disagreeing about its title.
    slug: "eboot-secure-boot-deepdive",
    area: "security",
    kind: "technical-report",
    date: "2025-06-01",
    badge: "Security",
    title: "eBoot Secure Boot: A Measured-Launch Walkthrough",
    summary:
      "An end-to-end tour of eBoot's chain of trust — root-of-trust keys, immutable stage 0, signed manifests, anti-rollback counters, and the runtime attestation hooks eAI consumes during model loading.",
    href: "/article-eboot-secure-boot-deepdive",
    tags: ["eBoot", "Security", "Secure Boot"],
  },
  {
    slug: "eai-llm-bench",
    area: "ai",
    kind: "benchmark",
    date: "2025-05-01",
    badge: "Benchmark",
    title: "EAI 0.9: INT4 LLM Runtime — 11 tok/s on Cortex-M85",
    summary:
      "EAI's new quantized inference path squeezes a 1.3B-parameter model into 312 MB of flash and runs at interactive speed on a 480 MHz microcontroller. Block-streamed weight loading reduces peak SRAM by 94%.",
    href: "/article-eai-llm-bench",
    tags: ["EAI", "LLM", "Benchmark"],
  },
  {
    // The two entries below were listed only on /research, in its own `papers`
    // array, and existed nowhere else. They are published works hosted outside
    // this site rather than posts on it, which is what `publication` is for.
    slug: "capability-based-security-rtos",
    area: "security",
    kind: "publication",
    date: "2025-01-01",
    badge: "Technical Paper",
    title: "Capability-Based Security in Real-Time Operating Systems",
    summary:
      "How EoS applies capability-based access control to a real-time kernel: unforgeable references, delegation without ambient authority, and what that costs in a deterministic scheduler.",
    href: "https://github.com/embeddedos-org/embeddedos-org/blob/main/docs/eos.html",
    tags: ["EoS", "Security", "Capabilities", "RTOS"],
  },
  {
    slug: "ebuild-declarative-cross-compilation",
    area: "embedded-systems",
    kind: "publication",
    date: "2024-01-01",
    badge: "Technical Paper",
    title: "eBuild: Declarative Cross-Compilation for Embedded AI Systems",
    summary:
      "The design of eBuild's declarative build model: one manifest describing toolchain, board and dependencies, and reproducible cross-compilation across the supported target set.",
    href: "https://github.com/embeddedos-org/embeddedos-org/blob/main/docs/ebuild.html",
    tags: ["eBuild", "Toolchain", "Cross-Compilation"],
  },
  {
    slug: "eos-platform-launch",
    kind: "news",
    date: "2025-04-01",
    badge: "Release",
    title: "eos-platform 1.0: One Toolchain, Every EoS Profile",
    summary:
      "After eighteen months of incremental releases, the eos-platform meta-distribution reaches 1.0 with stable APIs, a unified package manifest, and reproducible builds across all 52 supported boards.",
    href: "/article-eos-platform-launch",
    tags: ["eos-platform", "Release", "1.0"],
  },
];

/** Newest first, ties broken by title so the order is total and stable. */
function byDateDesc(a: ContentItem, b: ContentItem): number {
  if (a.date === b.date) return a.title.localeCompare(b.title);
  return a.date < b.date ? 1 : -1;
}

/** Every item of one kind, newest first. */
export function byKind(kind: ContentKind): ContentItem[] {
  return CONTENT.filter(item => item.kind === kind).sort(byDateDesc);
}

/** Every item across several kinds, newest first — for programme indexes. */
export function byKinds(kinds: readonly ContentKind[]): ContentItem[] {
  const wanted = new Set(kinds);
  return CONTENT.filter(item => wanted.has(item.kind)).sort(byDateDesc);
}

/** One item by slug, or undefined. Slugs are unique; a test enforces it. */
export function bySlug(slug: string): ContentItem | undefined {
  return CONTENT.find(item => item.slug === slug);
}

/** The n most recent items of any kind. */
export function recent(n: number): ContentItem[] {
  return [...CONTENT].sort(byDateDesc).slice(0, n);
}

/** Every item in one research area, newest first. */
export function byArea(area: ResearchArea): ContentItem[] {
  return CONTENT.filter(item => item.area === area).sort(byDateDesc);
}

/** A category with its size, for rendering a taxonomy that shows what is empty. */
export interface CategorySummary<T> {
  key: T;
  label: string;
  count: number;
}

/**
 * The full set of categories in a programme, including the empty ones.
 *
 * Empty categories are returned on purpose. The alternative — listing only
 * what has content — hides the shape of the programme from anyone deciding
 * what to write next, and quietly makes the published taxonomy depend on
 * whoever published last. A category with nothing in it is a commissioning
 * brief; a category that vanished is a mystery.
 */
export function kindSummary(
  kinds: readonly ContentKind[],
): CategorySummary<ContentKind>[] {
  const counts = countsByKind();
  return kinds.map(kind => ({
    key: kind,
    label: KIND_LABEL[kind],
    count: counts[kind] ?? 0,
  }));
}

export function areaSummary(): CategorySummary<ResearchArea>[] {
  return RESEARCH_AREAS.map(area => ({
    key: area,
    label: AREA_LABEL[area],
    count: byArea(area).length,
  }));
}

/** How many items exist of each kind, for counts on an index page. */
export function countsByKind(): Partial<Record<ContentKind, number>> {
  const counts: Partial<Record<ContentKind, number>> = {};
  for (const item of CONTENT) {
    counts[item.kind] = (counts[item.kind] ?? 0) + 1;
  }
  return counts;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "July 2026" from "2026-07-01".
 *
 * Built from the ISO parts rather than `new Date()`. `new Date("2026-07-01")`
 * parses as UTC midnight and renders in the viewer's local zone, so anywhere
 * west of Greenwich a July post displays as June.
 */
export function formatDate(iso: string): string {
  const [year, month] = iso.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return iso;
  return `${MONTHS[index]} ${year}`;
}
