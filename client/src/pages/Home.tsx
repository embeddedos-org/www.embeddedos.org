import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import { BOOKS, type Book } from "@/data/books";
import { StoryHero, MakingOf, Showcase } from "../black/Sections";
import Chapters from "../black/Chapters";
import "../black/black.css";
import "./home-sections.css";

/** One item's colour, carried as --c: it draws only a small dot or a thin rule. */
const tint = (c: string) => ({ "--c": c }) as CSSProperties;

/** The ecosystem marquee: each project, its area and its colour. */
const ECOSYSTEM: [name: string, area: string, colour: string][] = [
  ["EoS Kernel", "Core", "#F97316"],
  ["eBoot", "Security", "#22D3EE"],
  ["eIPC", "Platform", "#A78BFA"],
  ["eAI", "AI", "#34D399"],
  ["eosllm", "AI", "#60A5FA"],
  ["eNI", "Neural", "#F472B6"],
  ["eDB", "Data", "#22D3EE"],
  ["eApps", "Apps", "#F97316"],
  ["eBrowser", "UI", "#A78BFA"],
  ["eOffice", "Apps", "#34D399"],
  ["ebuild", "Build", "#FBBF24"],
  ["EoStudio", "IDE", "#F472B6"],
  ["EoSim", "Simulation", "#60A5FA"],
  ["eCAD Hardware", "Hardware", "#38BDF8"],
  ["Kids Edition", "Education", "#F59E0B"],
  ["eNet", "Planned", "#60A5FA"],
  ["eSec", "Planned", "#F59E0B"],
];

/** The stats band. data-n is the counter's target (home-sections.js counts up to it). */
const STATS: { n: number; plus?: boolean; label: string; c: string }[] = [
  { n: REPO_COUNT, label: "Repositories", c: "#F97316" },
  { n: BOARD_COUNT, label: "Boards", c: "#22D3EE" },
  { n: 300, plus: true, label: "APIs", c: "#A78BFA" },
  { n: 60, plus: true, label: "Apps", c: "#34D399" },
  { n: 4, label: "Health devices", c: "#F59E0B" },
  { n: 14, label: "Books", c: "#60A5FA" },
];

/** The Foundation's three commitments (the mission's programme list). */
const COMMITMENTS: [title: string, text: string][] = [
  [
    "Open-source software, permanently free",
    "The kernel, bootloader, drivers, build tools, and every application we ship are MIT licensed and developed in public on GitHub. No paid tiers, no license fees, no vendor lock-in.",
  ],
  [
    "Free education for engineers and students",
    "14 full-length technical books, free certification exams, a Kids Edition for classrooms, and paid internships for students and new graduates, all at no cost to learners.",
  ],
  [
    "Public-benefit research",
    "We publish our research openly, including patent filings for health-monitoring hardware, so that clinicians, universities, and other nonprofits can build on the work rather than license it.",
  ],
];

/**
 * The Complete Guide and the Hardware Guide live in the eos repository with
 * EoS Kernel Internals, so /books shows all three with book-cover-eos. On the
 * shelf three copies of one picture would read as a mistake, so these two get
 * a cover set in type: their own titles, nothing drawn.
 */
const TYPESET_COVER = new Set(["complete-guide", "hardware-guide"]);

/** A book on the shelf: its cover (lazy, sized), title, subtitle and pages. */
function ShelfBook({ book }: { book: Book }) {
  const cover = `/media/book-cover-${book.repo.toLowerCase()}`;
  return (
    <li>
      <Link className="hp-bk" href="/books">
        {TYPESET_COVER.has(book.id) ? (
          <span className="cv tc" style={tint(book.color)} aria-hidden="true">
            <small>EmbeddedOS</small>
            <span>{book.title.replace(/^EmbeddedOS:?\s*/, "")}</span>
          </span>
        ) : (
          <picture className="cv">
            <source srcSet={`${cover}.webp`} type="image/webp" />
            <img
              src={`${cover}.jpg`}
              width={240}
              height={360}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
        <b>{book.title}</b>
        <span className="sub">{book.subtitle}</span>
        <span className="pp">{book.pages} pages</span>
      </Link>
    </li>
  );
}

type Chip = [cls: string, label: string];

/** The reference architecture's seven layers, top of the boot chain first. */
const LAYERS: { name: string; c: string; text: string; chips: Chip[] }[] = [
  {
    name: "eBoot",
    c: "#fbbf24",
    text: "Two-stage secure boot: Ed25519 + SHA-512 image check, A/B slots and recovery. Host-tested; key storage needs board hooks.",
    chips: [
      ["s-work", "Working"],
      ["s-docs", "Keys: board hooks"],
    ],
  },
  {
    name: "EoS HAL",
    c: "#34d399",
    text: "One driver API on every target. The dispatch layer, GPIO on Linux and the devicetree parser work; 28 extended classes are stubs.",
    chips: [
      ["s-work", "Dispatch"],
      ["s-docs", "28 stubs"],
    ],
  },
  {
    name: "EoS kernel",
    c: "#34d399",
    text: "Priority scheduler, priority-inheritance mutexes, semaphores, events, queues and a validated heap. 45 CTest suites on hosts.",
    chips: [["s-work", "Working"]],
  },
  {
    name: "EoS services",
    c: "#34d399",
    text: "18 libraries: motor and sensor control, OTA, crypto, networking, files and debug. Flash writes and an MCU network stack are planned.",
    chips: [
      ["s-code", "In code"],
      ["s-plan", "Some planned"],
    ],
  },
  {
    name: "eIPC · eDB",
    c: "#22d3ee",
    text: "Authenticated messages between services and devices; a multi-model data store with 38 endpoints. Both are working prototypes.",
    chips: [["s-work", "Prototypes"]],
  },
  {
    name: "Apps",
    c: "#f97316",
    text: "The eApps catalogue (124 entries), the eBrowser engine and 11 eOffice apps; packages install as verified .eapp files. Many apps are templates.",
    chips: [
      ["s-code", "In code"],
      ["s-docs", "Templates"],
    ],
  },
  {
    name: "On-device AI",
    c: "#a78bfa",
    text: "eosllm runs models with three real back ends; eNI works in simulation; eAI's runtimes are placeholders today.",
    chips: [
      ["s-work", "eosllm"],
      ["s-docs", "eAI runtimes"],
    ],
  },
];

type Repo = [name: string, st: string, status: string, text: string];

/** The ecosystem index: the repositories on the device, then the tools. */
const DEVICE_REPOS: Repo[] = [
  [
    "eBoot",
    "s-work",
    "Working",
    "Signed two-stage boot with A/B slots and recovery; not yet booted on hardware.",
  ],
  [
    "EoS kernel",
    "s-work",
    "Working",
    "Real-time kernel with priority scheduling, sync and queues; tested on hosts.",
  ],
  [
    "eIPC",
    "s-code",
    "Prototype",
    "Authenticated messages between processes and devices; Go core and a C SDK.",
  ],
  [
    "eDB",
    "s-code",
    "Prototype",
    "Multi-model data store: five models, 38 endpoints, 42 passing tests.",
  ],
  [
    "eosllm",
    "s-work",
    "Working",
    "Runs language models on the device with three real back ends; 160 tests.",
  ],
  [
    "eAI",
    "s-docs",
    "Framework",
    "The on-device AI layer; its model runtimes are placeholders today.",
  ],
  [
    "eBrowser",
    "s-code",
    "Engine",
    "Browser engine for embedded displays; JavaScript and the sandbox are planned.",
  ],
  ["eOffice", "s-code", "Prototype", "11 office apps with 741 tests."],
  [
    "eApps",
    "s-code",
    "Catalogue",
    "124 catalogue entries; many apps are templates.",
  ],
];
const TOOL_REPOS: Repo[] = [
  [
    "ebuild",
    "s-work",
    "Working",
    "One CLI to create, build, flash and simulate; knows 171 MCUs, 826 tests.",
  ],
  [
    "EoStudio",
    "s-docs",
    "7 of 13",
    "Design studio and IDE: 7 of its 13 editors are real; 40 code generators.",
  ],
  [
    "EoSim",
    "s-work",
    "Working",
    "Simulator with 153 platforms and 2,117 passing tests.",
  ],
];

/**
 * The four health designs. Each status line uses only what the site already
 * states: the two U.S. application numbers (pages/Patents.tsx, pages/Terms.tsx)
 * and, for the other two, their own concept / research-design wording.
 */
const HEALTH: {
  name: string;
  c: string;
  text: string;
  status: [state: string, detail: string];
  filed?: boolean;
}[] = [
  {
    name: "HEALTH-KEY ULTRA",
    c: "#F472B6",
    text: "A USB-C research design for exploring ECG, blood-oxygen, breath-alcohol, temperature, UV and motion sensing. Validation is pending.",
    status: ["Patent pending", "U.S. App. No. 64/073,334"],
    filed: true,
  },
  {
    name: "HEALTH-BAND Neuro",
    c: "#A78BFA",
    text: "A wristband research design for sEMG gesture studies, biometric sensing and TENS exploration. No therapeutic benefit is claimed.",
    status: ["Patent pending", "U.S. App. No. 64/076,078"],
    filed: true,
  },
  {
    name: "HEALTH-RING",
    c: "#22D3EE",
    text: "A concept ring for researching optical and electrical sensing. Clinical measurement has not been validated.",
    status: ["Concept", "Research design"],
  },
  {
    name: "HEALTH-LAB",
    c: "#34D399",
    text: "A biosensor patch concept for health-monitoring research.",
    status: ["Concept", "Research design"],
  },
];

/** Why EmbeddedOS: six properties, each stated at its real maturity. */
const WHY: [title: string, text: string][] = [
  [
    "Real-Time Scheduling",
    "Priority-driven scheduling with priority inheritance; timing is characterized per target.",
  ],
  [
    "Signed From the First Instruction",
    "Ed25519-signed boot and authenticated messages; hardware key storage needs board hooks.",
  ],
  [
    "Connectivity, Honestly",
    "Wi-Fi, BLE, Ethernet and CAN are defined in the HAL; sockets work on hosts and MCU stacks are planned.",
  ],
  [
    "Developer Friendly",
    "ebuild, EoStudio and EoSim, 14 technical books, documentation and free certification.",
  ],
  [
    "Modular Architecture",
    "Use only what you need, from the bare kernel to the full application stack.",
  ],
  [
    "Broad Hardware Coverage",
    `${BOARD_COUNT} board descriptors across 55 architectures. Maturity varies by target; a descriptor is not a validated port.`,
  ],
];

/** The community facts beside "Built by the Community, for the Community". */
const COMMUNITY: [title: string, text: string][] = [
  [
    "25 repositories in public",
    "Developed openly on GitHub, 23 of them MIT licensed.",
  ],
  ["14 books to learn from", "Full-length technical books, free for everyone."],
  ["10 fuzz harnesses", "Plus CodeQL and Scorecard across the organisation."],
  [
    "Every claim checked",
    "This page says what works, what is partial and what is planned.",
  ],
];

function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <ul className="hp-ix-list" data-stagger="">
      {repos.map(([name, st, status, text]) => (
        <li key={name}>
          <b>{name}</b>
          <span className={`hp-st ${st}`}>{status}</span>
          <p>{text}</p>
        </li>
      ))}
    </ul>
  );
}

const Arrow = () => (
  <span className="ar" aria-hidden="true">
    →
  </span>
);

type PrerenderWindow = Window & { __EOS_PRERENDER__?: boolean };

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host || (window as PrerenderWindow).__EOS_PRERENDER__) return;
    const sections = host.querySelector<HTMLElement>(".hs");
    const disposers: (() => void)[] = [];
    let cancelled = false;
    // Both scripts are their own chunks: the poster, the chapters, the boards
    // and every section are in the HTML before they arrive, and read without
    // them.
    void import("../black/story").then(({ mountBlack }) => {
      if (!cancelled) disposers.push(mountBlack(host));
    });
    if (sections)
      void import("./home-sections").then(({ mountSections }) => {
        if (!cancelled) disposers.push(mountSections(sections));
      });
    return () => {
      cancelled = true;
      disposers.forEach(d => d());
    };
  }, []);

  return (
    <div ref={root} className="bk">
      <StoryHero />
      <Chapters />
      <MakingOf />
      <Showcase />
      <div className="hs">
        <div className="hp" id="home-sections">
          <div className="hp-marquee" aria-label="EmbeddedOS ecosystem">
            <p>EmbeddedOS Ecosystem</p>
            <div className="mq-row">
              {ECOSYSTEM.map(([name, area, c]) => (
                <span key={name} className="mq-item" style={tint(c)}>
                  <b>{name}</b>
                  <em>{area}</em>
                </span>
              ))}
              {/* the second copy makes the loop seamless; screen readers and reduced motion skip it */}
              <span className="mq-dup" aria-hidden="true">
                {ECOSYSTEM.map(([name, area, c]) => (
                  <span key={name} className="mq-item" style={tint(c)}>
                    <b>{name}</b>
                    <em>{area}</em>
                  </span>
                ))}
              </span>
            </div>
          </div>
          <section
            className="hp-stats"
            aria-label="Key statistics"
            data-reveal=""
          >
            <div className="hp-wrap">
              <div className="hp-nums" data-stagger="">
                {STATS.map(s => (
                  <div key={s.label} className="hp-stat" style={tint(s.c)}>
                    <p className="v">
                      <b data-n={s.n}>{s.n}</b>
                      {s.plus && <i>+</i>}
                    </p>
                    <span className="k">
                      <span className="dot" />
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section
            className="hp-sec"
            id="board-map"
            aria-labelledby="hp-map"
            data-reveal=""
          >
            <div className="hp-wrap">
              <div className="hp-head split">
                <div>
                  <p className="hp-label" data-fade="">
                    The board, part by part
                  </p>
                  <h2 id="hp-map" data-split="">
                    Every component, and the bus that reaches it
                  </h2>
                </div>
                <p className="hp-lead" data-fade="">
                  Click or tap any part. U1 runs EoS; every other part hangs off
                  its own bus, and each says how EoS uses it today. The board is
                  illustrative; the statuses come from the code.
                </p>
              </div>
              <div className="hp-map">
                <div className="hp-board" data-fade="">
                  <svg
                    viewBox="0 0 1000 720"
                    role="group"
                    aria-label="Board map: click a part for details"
                  >
                    <defs>
                      <pattern
                        id="hp-grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          className="grid"
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                        />
                      </pattern>
                    </defs>
                    <rect
                      x="4"
                      y="4"
                      width="992"
                      height="712"
                      rx="18"
                      fill="url(#hp-grid)"
                    />
                    <rect
                      className="edge"
                      x="14"
                      y="14"
                      width="972"
                      height="692"
                      rx="14"
                    />
                    <g className="traces" />
                    <g className="holes" />
                    <g className="parts" />
                    <g className="pulses" />
                    <text className="silk" x="560" y="702">
                      EMBEDDEDOS · EoS REFERENCE · REV A
                    </text>
                  </svg>
                </div>
                <aside className="hp-detail" aria-live="polite" data-fade="">
                  <span className="ref" /> <h3 /> <p className="bus" />
                  <p className="what" />
                  <div className="eos">
                    <i>EoS</i>
                    <span />
                  </div>
                  <span className="hp-pill st-pill" />
                </aside>
              </div>
              <div className="hp-parts" role="group" aria-label="All parts" />
            </div>
          </section>
          <section
            className="hp-sec hp-fdn"
            aria-labelledby="hp-mission"
            data-reveal=""
          >
            <div className="hp-wrap">
              <p className="hp-label" data-fade="">
                Our Mission
              </p>
              <h2 id="hp-mission" data-split="">
                Embedded computing should be free to learn and free to build on
              </h2>
              <p className="hp-lead" data-fade="">
                The Embedded Operating Systems Research Foundation is a
                501(c)(3) public charity (
                <span className="nw">EIN 41-4821627</span>). We exist to advance
                open-source embedded systems research, education, and technology
                for the public benefit, accountable to our community, not to
                shareholders. Every line of code we publish is MIT licensed and
                free, forever.
              </p>
              <ul className="hp-prog" data-stagger="">
                {COMMITMENTS.map(([title, text]) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ul>
              <div className="hp-actions" data-fade="">
                <Link className="hp-btn or" href="/donate">
                  Make a Donation
                </Link>
                <Link className="hp-btn gh" href="/get-involved">
                  Volunteer or Contribute <Arrow />
                </Link>
                <Link className="hp-btn gh" href="/mission">
                  Our Mission &amp; Scope <Arrow />
                </Link>
                <Link className="hp-btn gh" href="/about">
                  About the Foundation
                </Link>
              </div>
            </div>
          </section>
          <section
            className="hp-sec hp-books"
            aria-labelledby="hp-books"
            data-reveal=""
          >
            <div className="hp-wrap">
              <div className="hp-head split">
                <div>
                  <p className="hp-label" data-fade="">
                    EmbeddedOS Library
                  </p>
                  <h2 id="hp-books" data-split="">
                    Fourteen free books.
                  </h2>
                </div>
                <div className="hp-head-r" data-fade="">
                  <p className="hp-lead">
                    Full-length technical books, free for everyone: from the
                    kernel, the bootloader and on-device AI to the build system,
                    the simulator and the hardware.
                  </p>
                  <Link className="hp-btn gh" href="/books">
                    Read all 14 free books <Arrow />
                  </Link>
                </div>
              </div>
              <ul className="hp-shelf" id="hp-shelf" data-stagger="">
                {BOOKS.map(book => (
                  <ShelfBook key={book.id} book={book} />
                ))}
              </ul>
              {/* shown by home-sections.js when the row is wider than the page: a mouse cannot swipe it */}
              <div className="hp-shelf-nav" hidden>
                <button
                  className="hp-rb"
                  type="button"
                  data-d="-1"
                  aria-label="Previous books"
                  aria-controls="hp-shelf"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10 3 5 8l5 5" />
                  </svg>
                </button>
                <button
                  className="hp-rb"
                  type="button"
                  data-d="1"
                  aria-label="Next books"
                  aria-controls="hp-shelf"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m6 3 5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
          <section className="hp-sec" aria-labelledby="hp-stack" data-reveal="">
            <div className="hp-wrap">
              <div className="hp-head split">
                <div>
                  <p className="hp-label" data-fade="">
                    Architecture and maturity
                  </p>
                  <h2 id="hp-stack" data-split="">
                    An Illustrative Reference Architecture
                  </h2>
                </div>
                <p className="hp-lead" data-fade="">
                  Seven layers, the same ones you scrolled through, each with
                  what is built and tested and what is still planned.
                  Illustrative reference only. Individual projects and
                  integrations have different maturity levels; planned elements
                  are not yet available products.
                </p>
              </div>
              <div className="hp-stack">
                <div className="hp-rail" aria-hidden="true">
                  <span className="hp-dot" />
                </div>
                <div className="hp-layers">
                  {LAYERS.map(l => (
                    <div key={l.name} className="hp-layer" style={tint(l.c)}>
                      <h3>{l.name}</h3>
                      <p>{l.text}</p>
                      <div className="hp-chips">
                        {l.chips.map(([cls, label]) => (
                          <span key={label} className={`hp-pill ${cls}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="hp-sec" aria-labelledby="hp-eco" data-reveal="">
            <div className="hp-wrap hp-ix-wrap">
              <div className="hp-ix-head">
                <p className="hp-label" data-fade="">
                  The ecosystem
                </p>
                <h2 id="hp-eco" data-split="">
                  The Complete Embedded Ecosystem
                </h2>
                <p className="hp-lead" data-fade="">
                  Every component you need to build, deploy and manage embedded
                  systems, each described as it stands in its repository today.
                </p>
                <div className="hp-actions" data-fade="">
                  <Link className="hp-btn gh" href="/projects">
                    All Projects <Arrow />
                  </Link>
                  <Link className="hp-btn gh" href="/eapps">
                    All Apps <Arrow />
                  </Link>
                </div>
              </div>
              <div className="hp-ix">
                <h3 className="hp-ix-k" data-fade="">
                  <span>On the device</span>
                  <span>9 repositories</span>
                </h3>
                <RepoList repos={DEVICE_REPOS} />
                <h3 className="hp-ix-k" data-fade="">
                  <span>To build and test it</span>
                  <span>3 repositories</span>
                </h3>
                <RepoList repos={TOOL_REPOS} />
              </div>
            </div>
          </section>
          <section
            className="hp-sec"
            aria-labelledby="hp-health"
            data-reveal=""
          >
            <div className="hp-wrap">
              <div className="hp-head split">
                <div>
                  <p className="hp-label" data-fade="">
                    Health Technology
                  </p>
                  <h2 id="hp-health" data-split="">
                    4 Health Devices · 2 Patents Pending
                  </h2>
                </div>
                <div className="hp-head-r" data-fade="">
                  <p className="hp-lead">
                    In-development open hardware designs for health-monitoring
                    research. Physical reliability and clinical validation are
                    pending.
                  </p>
                  <Link className="hp-btn gh" href="/health">
                    All four designs <Arrow />
                  </Link>
                </div>
              </div>
              <ol className="hp-dev" role="list" data-stagger="">
                {HEALTH.map((d, i) => (
                  <li key={d.name} style={tint(d.c)}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                    <p className={d.filed ? "st filed" : "st"}>
                      <span>{d.status[0]}</span>
                      <span>{d.status[1]}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section
            className="hp-sec hp-band"
            aria-labelledby="hp-hw"
            data-reveal=""
          >
            <div className="hp-wrap">
              <div className="hp-head split">
                <div>
                  <p className="hp-label" data-fade="">
                    Open Hardware
                  </p>
                  <h2 id="hp-hw" data-split="">
                    eCAD Hardware · 18 domains, 292 models
                  </h2>
                </div>
                <div className="hp-head-r" data-fade="">
                  <p className="hp-lead">
                    Open designs from smart rings to a tilt-rotor eVTOL, in 125
                    product lines. Every one is at design stage with a
                    datasheet, and most add a bill of materials and a power
                    simulation. A dev-board CAD database adds 322 reference
                    boards, 186 of them verified.
                  </p>
                  <Link className="hp-btn gh" href="/ecad-hardware">
                    View all eCAD Hardware <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="hp-sec" aria-labelledby="hp-why" data-reveal="">
            <div className="hp-wrap">
              <div className="hp-head split">
                <div>
                  <p className="hp-label" data-fade="">
                    Why EmbeddedOS
                  </p>
                  <h2 id="hp-why" data-split="">
                    The Operating System for Every Device
                  </h2>
                </div>
                <p className="hp-lead" data-fade="">
                  Built by embedded engineers, for any embedded hardware. Every
                  design decision prioritizes reliability, security, and
                  developer experience.
                </p>
              </div>
              <ul className="hp-why" data-stagger="">
                {WHY.map(([title, text]) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="hp-sec" aria-labelledby="hp-comm" data-reveal="">
            <div className="hp-wrap hp-split">
              <div className="hp-comm-head">
                <p className="hp-label" data-fade="">
                  Foundation Community
                </p>
                <h2 id="hp-comm" data-split="">
                  Built by the Community, for the Community
                </h2>
                <p className="hp-lead" data-fade="">
                  EmbeddedOS is a 501(c)(3), community-driven project, built by
                  embedded engineers for any embedded hardware. Every line of
                  code, every document, and every tool prioritizes reliability,
                  security, and developer experience.
                </p>
                <div className="hp-actions" data-fade="">
                  <Link className="hp-btn pri" href="/get-involved">
                    Get Involved
                  </Link>
                  <a
                    className="hp-btn gh"
                    href="https://github.com/embeddedos-org"
                    target="_blank"
                    rel="noopener"
                  >
                    Star on GitHub{" "}
                    <span className="ar" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
              <ul className="hp-facts" data-stagger="">
                {COMMUNITY.map(([title, text]) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section
            className="hp-sec hp-cta"
            aria-labelledby="hp-cta"
            data-reveal=""
          >
            <div className="hp-wrap">
              <p className="hp-label" data-fade="">
                Open Source · 501(c)(3) · MIT License (software)
              </p>
              <h2 id="hp-cta" data-split="">
                Ready to build on EmbeddedOS?
              </h2>
              <p className="hp-lead" data-fade="">
                Join engineers building the next generation of embedded systems.
                Free, foundation-backed, and 501(c)(3) forever.
              </p>
              <div className="hp-actions" data-fade="">
                <Link className="hp-btn pri" href="/getting-started">
                  Start Building <Arrow />
                </Link>
                <Link className="hp-btn gh" href="/docs">
                  Read the Docs
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
