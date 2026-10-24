import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { Github } from "lucide-react";
import { BOARD_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import { Band, BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./Books.css";

const BOOKS = [
  {
    id: "complete-guide",
    title: "EmbeddedOS: The Complete Guide",
    subtitle: "From Bare Metal to Full Stack",
    desc: "The definitive 42-chapter reference covering the entire EoS platform — kernel internals, HAL design, all 13 ecosystem products. 620+ pages with architecture diagrams, API references, and deployment guides.",
    pages: 620,
    chapters: 42,
    level: "All Levels",
    category: "core",
    color: "#F97316",
    featured: true,
    repo: "eos",
    topics: [
      "Kernel Architecture",
      "Driver Development",
      "Networking",
      "Security",
      "Applications",
    ],
  },
  {
    id: "eos-kernel",
    title: "EoS Kernel Internals",
    subtitle: "Real-Time Scheduling & Memory Management",
    desc: "Deep dive into the EoS real-time kernel: task scheduling, memory allocators, interrupt handling, power management, and multi-arch support (ARM, RISC-V, Xtensa, x86_64).",
    pages: 380,
    chapters: 28,
    level: "Advanced",
    category: "core",
    color: "#22D3EE",
    featured: false,
    repo: "eos",
    topics: [
      "RTOS Scheduling",
      "Memory Allocators",
      "Interrupt Handling",
      "Power Management",
    ],
  },
  {
    id: "eboot",
    title: "eBoot: Secure Bootloader Design",
    subtitle: "Hardware Attestation & OTA Updates",
    desc: "Complete guide to building secure boot chains, implementing hardware attestation, and designing reliable OTA update systems with A/B partition support.",
    pages: 290,
    chapters: 22,
    level: "Intermediate",
    category: "core",
    color: "#A78BFA",
    featured: false,
    repo: "eBoot",
    topics: [
      "Secure Boot",
      "OTA Updates",
      "Hardware Security",
      "A/B Partitions",
    ],
  },
  {
    id: "eipc",
    title: "eIPC: Inter-Process Communication",
    subtitle: "Zero-Copy Messaging & Typed Channels",
    desc: "Master high-performance IPC patterns: message queues, shared memory, typed channels, and distributed system design with Go and C SDKs.",
    pages: 310,
    chapters: 24,
    level: "Intermediate",
    category: "core",
    color: "#34D399",
    featured: false,
    repo: "eIPC",
    topics: ["Message Queues", "Shared Memory", "Typed Channels", "Go SDK"],
  },
  {
    id: "ebuild",
    title: "ebuild: Build System & Toolchain",
    subtitle: "Cross-Compilation & CI/CD for Embedded",
    desc: "Master the ebuild CLI: cross-compilation, dependency management, eFab manifests, and CI/CD pipelines across supported target profiles.",
    pages: 240,
    chapters: 18,
    level: "Intermediate",
    category: "tools",
    color: "#34D399",
    featured: false,
    repo: "ebuild",
    topics: ["Cross-Compilation", "CMake", "eFab Manifests", "CI/CD"],
  },
  {
    id: "eai",
    title: "eAI Edge: On-Device AI",
    subtitle: "TensorFlow Lite & ONNX on Embedded Systems",
    desc: "Deploy neural networks on microcontrollers and edge devices. Covers model optimization, quantization, hardware acceleration, and the eAI inference engine.",
    pages: 420,
    chapters: 32,
    level: "Advanced",
    category: "ai",
    color: "#F59E0B",
    featured: false,
    repo: "eAI",
    topics: [
      "TensorFlow Lite",
      "Model Quantization",
      "Hardware Acceleration",
      "ONNX",
    ],
  },
  {
    id: "eni",
    title: "eNI: Neural Interface Platform",
    subtitle: "Configurable Brain-Computer Interface Research",
    desc: "Study brain-computer interface applications using the eNI platform. Covers configuration-specific acquisition, neural signal processing, and BCI research workflows.",
    pages: 360,
    chapters: 26,
    level: "Advanced",
    category: "ai",
    color: "#F472B6",
    featured: false,
    repo: "eNI",
    topics: [
      "BCI Development",
      "EEG Signal Processing",
      "Neural Decoding",
      "Real-Time DSP",
    ],
  },
  {
    id: "eosim",
    title: "EoSim: Hardware Simulation",
    subtitle: `Simulate ${SIM_PLATFORM_COUNT} Platforms Without Hardware`,
    desc: `Use EoSim to develop and test firmware without physical hardware. Covers ${SIM_PLATFORM_COUNT} supported platforms, GPIO/UART/SPI/I2C simulation, and HIL bridge testing.`,
    pages: 280,
    chapters: 20,
    level: "Beginner",
    category: "tools",
    color: "#F85149",
    featured: false,
    repo: "EoSim",
    topics: [
      "Platform Simulation",
      "GPIO Simulation",
      "UART/SPI/I2C",
      "HIL Testing",
    ],
  },
  {
    id: "eostudio",
    title: "EoStudio: Design & Development",
    subtitle: "3D Modeling, Game Design & AI Tutoring",
    desc: "Master EoStudio's 12 integrated editors: 3D modeler, game engine, UI designer, code generator, AI tutor, circuit designer, and more.",
    pages: 460,
    chapters: 36,
    level: "All Levels",
    category: "tools",
    color: "#60A5FA",
    featured: false,
    repo: "EoStudio",
    topics: ["3D Modeling", "Game Design", "UI Design", "Code Generation"],
  },
  {
    id: "eapps",
    title: "eApps: Building Embedded Applications",
    subtitle: "C + LVGL Cross-Platform Development",
    desc: "Build production-ready embedded applications using C and LVGL. Covers all 60+ built-in apps, the eApps framework, and how to publish to the app store.",
    pages: 390,
    chapters: 30,
    level: "Intermediate",
    category: "apps",
    color: "#F97316",
    featured: false,
    repo: "eApps",
    topics: ["LVGL UI", "C Development", "Cross-Platform", "App Store"],
  },
  {
    id: "edb",
    title: "eDB: Embedded Database Systems",
    subtitle: "SQL, NoSQL & Key-Value on Flash Storage",
    desc: "Design and implement database systems for embedded devices. Flash wear leveling, query optimization, low-RAM operation, and multi-model data access.",
    pages: 260,
    chapters: 20,
    level: "Intermediate",
    category: "apps",
    color: "#22D3EE",
    featured: false,
    repo: "eDB",
    topics: ["SQL Engine", "Flash Storage", "Query Optimization", "NoSQL"],
  },
  {
    id: "ebrowser",
    title: "eBrowser: Minimal Web Engine",
    subtitle: "HTML, CSS & JavaScript on Embedded Displays",
    desc: "Build and extend the eBrowser engine. Covers HTML parsing, CSS layout engine, JavaScript execution, and display drivers for embedded screens.",
    pages: 320,
    chapters: 24,
    level: "Advanced",
    category: "apps",
    color: "#A78BFA",
    featured: false,
    repo: "eBrowser",
    topics: [
      "HTML Parsing",
      "CSS Layout",
      "JavaScript Engine",
      "Display Drivers",
    ],
  },
  {
    id: "eoffice",
    title: "eOffice: Office Suite Development",
    subtitle: "11 Applications for Embedded Devices",
    desc: "Architecture and implementation of the eOffice suite: document editor, spreadsheet, presentation, email client, calendar, and 6 more applications.",
    pages: 340,
    chapters: 26,
    level: "Advanced",
    category: "apps",
    color: "#F472B6",
    featured: false,
    repo: "eOffice",
    topics: ["Document Editor", "Spreadsheet", "Presentation", "Email Client"],
  },
  {
    id: "hardware-guide",
    title: "EmbeddedOS Hardware Guide",
    subtitle: `${BOARD_COUNT} Boards: Setup, Drivers & Optimization`,
    desc: `Comprehensive hardware reference covering ${BOARD_COUNT} supported boards, board bring-up procedures, driver development, and platform-specific optimizations.`,
    pages: 510,
    chapters: 40,
    level: "All Levels",
    category: "hardware",
    color: "#F59E0B",
    featured: false,
    repo: "eos",
    topics: [
      "Board Bring-Up",
      "Driver Development",
      "Platform Optimization",
      "STM32",
      "RPi",
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Books" },
  { id: "core", label: "Core Platform" },
  { id: "ai", label: "AI & Neural" },
  { id: "tools", label: "Dev Tools" },
  { id: "apps", label: "Apps & Services" },
  { id: "hardware", label: "Hardware" },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#34D399",
  Intermediate: "#F59E0B",
  Advanced: "#F85149",
  "All Levels": "#A78BFA",
};

function BookCover({
  repo,
  title,
  color,
  eager = false,
}: {
  repo: string;
  title: string;
  color: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="bk-nocover"
        style={{ "--c": color } as CSSProperties}
        aria-hidden="true"
      />
    );
  }
  const cover = `/media/book-cover-${repo.toLowerCase()}`;
  return (
    <picture>
      <source srcSet={`${cover}.webp`} type="image/webp" />
      <img
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        src={`${cover}.jpg`}
        width={240}
        height={360}
        alt={title}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

export default function Books() {
  const [activeCategory, setActiveCategory] = useState("all");

  const featured = BOOKS.find(b => b.featured)!;
  const filtered = BOOKS.filter(
    b =>
      !b.featured && (activeCategory === "all" || b.category === activeCategory)
  );
  const counts: Record<string, number> = {
    all: BOOKS.filter(b => !b.featured).length,
  };
  for (const cat of ["core", "ai", "tools", "apps", "hardware"]) {
    counts[cat] = BOOKS.filter(b => !b.featured && b.category === cat).length;
  }

  return (
    <BpPage className="books">
      <PageHero
        sig
        label="14 Technical Books"
        title={
          <>
            EmbeddedOS <span>Library</span>
          </>
        }
        lead="14 comprehensive technical books covering every aspect of EmbeddedOS — free PDF downloads, open-source, community-driven."
      >
        <div className="bk-stats">
          <Stats
            items={[
              { value: "14", label: "Books" },
              { value: "4,950+", label: "Total Pages" },
              { value: "Free", label: "Open Access" },
              { value: "MIT", label: "License" },
            ]}
          />
        </div>
      </PageHero>

      {/* Featured book: the cover shown large beside its details */}
      <Section className="bk-feat-sec" title="Featured Book">
        <article className="bk-feat">
          <div className="bk-shelf bk-shelf-l">
            <BookCover
              repo={featured.repo}
              title={featured.title}
              color={featured.color}
              eager
            />
          </div>
          <div className="bk-fbody">
            <span
              className="st"
              style={{ "--c": LEVEL_COLORS[featured.level] } as CSSProperties}
            >
              {featured.level}
            </span>
            <h3>{featured.title}</h3>
            <p className="bk-sub">{featured.subtitle}</p>
            <p className="bk-desc">{featured.desc}</p>
            <ul className="badges">
              {featured.topics.map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="ctas">
              <a
                href={`https://github.com/embeddedos-org/${featured.repo}/releases/latest`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn or"
              >
                Download PDF
              </a>
              <a
                href={`https://github.com/embeddedos-org/${featured.repo}/tree/master/docs/book`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn gh"
              >
                View Source
              </a>
              <span className="bk-meta">
                {featured.chapters} chapters · {featured.pages} pages
              </span>
            </div>
          </div>
        </article>
      </Section>

      {/* Filter: sticky under the site header */}
      <div className="bk-filter">
        <div className="wrap">
          <span className="label" aria-hidden="true">
            Filter
          </span>
          <div className="bk-cats" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className="bk-cat"
              >
                {cat.label}
                <span className="bk-n">({counts[cat.id]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books grid */}
      <section className="sec bk-list" aria-label="Books">
        <div className="wrap">
          <ul className="bk-grid">
            {filtered.map(book => (
              <li key={book.id}>
                <article className="bk-card">
                  <div className="bk-shelf">
                    <BookCover
                      repo={book.repo}
                      title={book.title}
                      color={book.color}
                    />
                  </div>
                  <div className="bk-body">
                    <span
                      className="st"
                      style={
                        { "--c": LEVEL_COLORS[book.level] } as CSSProperties
                      }
                    >
                      {book.level}
                    </span>
                    <h3>{book.title}</h3>
                    <p className="bk-sub">{book.subtitle}</p>
                    <p className="bk-desc">{book.desc}</p>
                    <ul className="bk-topics">
                      {book.topics.slice(0, 3).map(t => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <div className="bk-foot">
                      <span className="bk-meta">
                        {book.chapters}ch · {book.pages}pp
                      </span>
                      <span className="bk-acts">
                        <a
                          href={`https://github.com/embeddedos-org/${book.repo}/tree/master/docs/book`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bk-src"
                          title="View Source"
                          aria-label={`View the source of ${book.title} on GitHub`}
                        >
                          <Github size={16} aria-hidden="true" />
                        </a>
                        <a
                          href={`https://github.com/embeddedos-org/${book.repo}/releases/latest`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn gh sm bk-pdf"
                        >
                          PDF
                        </a>
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="bk-none">No books in this category yet.</p>
          )}
        </div>
      </section>

      {/* Contribute */}
      <Band
        title="Want to Contribute a Book?"
        lead="All books are open source and community-driven. Submit a chapter, fix a typo, or propose a new title on GitHub."
      >
        <a
          href="https://github.com/embeddedos-org"
          target="_blank"
          rel="noopener noreferrer"
          className="btn pri"
        >
          Contribute on GitHub{" "}
          <span className="ar" aria-hidden="true">
            ↗
          </span>
        </a>
        <Link href="/docs" className="btn gh">
          Browse Documentation
        </Link>
      </Band>
    </BpPage>
  );
}
