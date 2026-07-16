import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Download, Github, Star, Filter, ExternalLink } from "lucide-react";

const BOOKS = [
  {
    id: "complete-guide", title: "EmbeddedOS: The Complete Guide", subtitle: "From Bare Metal to Full Stack",
    desc: "The definitive 42-chapter reference covering the entire EoS platform — kernel internals, HAL design, all 13 ecosystem products. 620+ pages with architecture diagrams, API references, and deployment guides.",
    pages: 620, chapters: 42, level: "All Levels", category: "core", color: "#F97316", featured: true,
    repo: "eos", topics: ["Kernel Architecture", "Driver Development", "Networking", "Security", "Applications"],
  },
  {
    id: "eos-kernel", title: "EoS Kernel Internals", subtitle: "Real-Time Scheduling & Memory Management",
    desc: "Deep dive into the EoS real-time kernel: task scheduling, memory allocators, interrupt handling, power management, and multi-arch support (ARM, RISC-V, Xtensa, x86_64).",
    pages: 380, chapters: 28, level: "Advanced", category: "core", color: "#22D3EE", featured: false,
    repo: "eos", topics: ["RTOS Scheduling", "Memory Allocators", "Interrupt Handling", "Power Management"],
  },
  {
    id: "eboot", title: "eBoot: Secure Bootloader Design", subtitle: "Hardware Attestation & OTA Updates",
    desc: "Complete guide to building secure boot chains, implementing hardware attestation, and designing reliable OTA update systems with A/B partition support.",
    pages: 290, chapters: 22, level: "Intermediate", category: "core", color: "#A78BFA", featured: false,
    repo: "eBoot", topics: ["Secure Boot", "OTA Updates", "Hardware Security", "A/B Partitions"],
  },
  {
    id: "eipc", title: "eIPC: Inter-Process Communication", subtitle: "Zero-Copy Messaging & Typed Channels",
    desc: "Master high-performance IPC patterns: message queues, shared memory, typed channels, and distributed system design with Go and C SDKs.",
    pages: 310, chapters: 24, level: "Intermediate", category: "core", color: "#34D399", featured: false,
    repo: "eIPC", topics: ["Message Queues", "Shared Memory", "Typed Channels", "Go SDK"],
  },
  {
    id: "ebuild", title: "ebuild: Build System & Toolchain", subtitle: "Cross-Compilation & CI/CD for Embedded",
    desc: "Master the ebuild CLI: cross-compilation, dependency management, eFab manifests, and CI/CD pipelines for all 52 target platforms.",
    pages: 240, chapters: 18, level: "Intermediate", category: "tools", color: "#34D399", featured: false,
    repo: "ebuild", topics: ["Cross-Compilation", "CMake", "eFab Manifests", "CI/CD"],
  },
  {
    id: "eai", title: "eAI Edge: On-Device AI", subtitle: "TensorFlow Lite & ONNX on Embedded Systems",
    desc: "Deploy neural networks on microcontrollers and edge devices. Covers model optimization, quantization, hardware acceleration, and the eAI inference engine.",
    pages: 420, chapters: 32, level: "Advanced", category: "ai", color: "#F59E0B", featured: false,
    repo: "eAI", topics: ["TensorFlow Lite", "Model Quantization", "Hardware Acceleration", "ONNX"],
  },
  {
    id: "eni", title: "eNI: Neural Interface Platform", subtitle: "Brain-Computer Interface & 1024-Channel EEG",
    desc: "Build brain-computer interface applications using the eNI platform. Covers 1024-channel EEG pipeline, neural signal processing, and real-time BCI applications.",
    pages: 360, chapters: 26, level: "Advanced", category: "ai", color: "#F472B6", featured: false,
    repo: "eNI", topics: ["BCI Development", "EEG Signal Processing", "Neural Decoding", "Real-Time DSP"],
  },
  {
    id: "eosim", title: "EoSim: Hardware Simulation", subtitle: "Simulate 52+ Platforms Without Hardware",
    desc: "Use EoSim to develop and test firmware without physical hardware. Covers all 52 supported platforms, GPIO/UART/SPI/I2C simulation, and HIL bridge testing.",
    pages: 280, chapters: 20, level: "Beginner", category: "tools", color: "#F85149", featured: false,
    repo: "EoSim", topics: ["Platform Simulation", "GPIO Simulation", "UART/SPI/I2C", "HIL Testing"],
  },
  {
    id: "eostudio", title: "EoStudio: Design & Development", subtitle: "3D Modeling, Game Design & AI Tutoring",
    desc: "Master EoStudio's 12 integrated editors: 3D modeler, game engine, UI designer, code generator, AI tutor, circuit designer, and more.",
    pages: 460, chapters: 36, level: "All Levels", category: "tools", color: "#60A5FA", featured: false,
    repo: "EoStudio", topics: ["3D Modeling", "Game Design", "UI Design", "Code Generation"],
  },
  {
    id: "eapps", title: "eApps: Building Embedded Applications", subtitle: "C + LVGL Cross-Platform Development",
    desc: "Build production-ready embedded applications using C and LVGL. Covers all 60+ built-in apps, the eApps framework, and how to publish to the app store.",
    pages: 390, chapters: 30, level: "Intermediate", category: "apps", color: "#F97316", featured: false,
    repo: "eApps", topics: ["LVGL UI", "C Development", "Cross-Platform", "App Store"],
  },
  {
    id: "edb", title: "eDB: Embedded Database Systems", subtitle: "SQL, NoSQL & Key-Value on Flash Storage",
    desc: "Design and implement database systems for embedded devices. Flash wear leveling, query optimization, low-RAM operation, and multi-model data access.",
    pages: 260, chapters: 20, level: "Intermediate", category: "apps", color: "#22D3EE", featured: false,
    repo: "eDB", topics: ["SQL Engine", "Flash Storage", "Query Optimization", "NoSQL"],
  },
  {
    id: "ebrowser", title: "eBrowser: Minimal Web Engine", subtitle: "HTML, CSS & JavaScript on Embedded Displays",
    desc: "Build and extend the eBrowser engine. Covers HTML parsing, CSS layout engine, JavaScript execution, and display drivers for embedded screens.",
    pages: 320, chapters: 24, level: "Advanced", category: "apps", color: "#A78BFA", featured: false,
    repo: "eBrowser", topics: ["HTML Parsing", "CSS Layout", "JavaScript Engine", "Display Drivers"],
  },
  {
    id: "eoffice", title: "eOffice: Office Suite Development", subtitle: "11 Applications for Embedded Devices",
    desc: "Architecture and implementation of the eOffice suite: document editor, spreadsheet, presentation, email client, calendar, and 6 more applications.",
    pages: 340, chapters: 26, level: "Advanced", category: "apps", color: "#F472B6", featured: false,
    repo: "eOffice", topics: ["Document Editor", "Spreadsheet", "Presentation", "Email Client"],
  },
  {
    id: "hardware-guide", title: "EmbeddedOS Hardware Guide", subtitle: "52+ Platforms: Setup, Drivers & Optimization",
    desc: "Comprehensive hardware reference covering all 52 supported platforms, board bring-up procedures, driver development, and platform-specific optimizations.",
    pages: 510, chapters: 40, level: "All Levels", category: "hardware", color: "#F59E0B", featured: false,
    repo: "eos", topics: ["Board Bring-Up", "Driver Development", "Platform Optimization", "STM32", "RPi"],
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
  "Beginner": "#34D399",
  "Intermediate": "#F59E0B",
  "Advanced": "#F85149",
  "All Levels": "#A78BFA",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  }),
};

function BookCover({ repo, title, color }: { repo: string; title: string; color: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}15` }}>
        <BookOpen size={20} style={{ color }} />
      </div>
    );
  }
  return (
    <img
      src={`https://raw.githubusercontent.com/embeddedos-org/${repo}/master/docs/book/cover.png`}
      alt={title}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function Books() {
  const [activeCategory, setActiveCategory] = useState("all");

  const featured = BOOKS.find(b => b.featured)!;
  const filtered = BOOKS.filter(b => !b.featured && (activeCategory === "all" || b.category === activeCategory));
  const counts: Record<string, number> = { all: BOOKS.filter(b => !b.featured).length };
  for (const cat of ["core", "ai", "tools", "apps", "hardware"]) {
    counts[cat] = BOOKS.filter(b => !b.featured && b.category === cat).length;
  }

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", color: "#F97316" }}>
              <BookOpen size={12} /> 14 Technical Books
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-heading font-black text-4xl sm:text-6xl text-white mb-4 leading-tight">
            EmbeddedOS <span style={{ color: "#F97316" }}>Library</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            14 comprehensive technical books covering every aspect of EmbeddedOS — free PDF downloads,
            open-source, community-driven.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-10">
            {[
              { num: "14", label: "Books", color: "#F97316" },
              { num: "4,950+", label: "Total Pages", color: "#22D3EE" },
              { num: "Free", label: "Open Access", color: "#34D399" },
              { num: "MIT", label: "License", color: "#A78BFA" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-heading font-black text-3xl" style={{ color: s.color }}>{s.num}</div>
                <div className="text-white/40 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Book */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
            <h2 className="font-heading font-bold text-white text-xl flex items-center gap-2">
              <Star size={18} className="text-[#F97316]" /> Featured Book
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="rounded-2xl p-6 sm:p-8 border"
            style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.25)" }}>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Cover */}
              <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0 mx-auto sm:mx-0"
                style={{ border: `2px solid ${featured.color}40` }}>
                <BookCover repo={featured.repo} title={featured.title} color={featured.color} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-heading font-extrabold text-white text-xl">{featured.title}</h3>
                    <p className="text-sm font-semibold" style={{ color: featured.color }}>{featured.subtitle}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: LEVEL_COLORS[featured.level] + "20", color: LEVEL_COLORS[featured.level] }}>
                    {featured.level}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{featured.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.topics.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">{t}</span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-white/40">{featured.chapters} chapters · {featured.pages} pages</span>
                  <a href={`https://github.com/embeddedos-org/${featured.repo}/releases/latest`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90 active:scale-95"
                    style={{ background: featured.color, color: "#fff" }}>
                    <Download size={14} /> Download PDF
                  </a>
                  <a href={`https://github.com/embeddedos-org/${featured.repo}/tree/master/docs/book`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border transition-all hover:bg-white/5"
                    style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                    <Github size={14} /> View Source
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-10 bg-[#080F1E]/95 backdrop-blur-sm border-b border-white/5 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <Filter size={13} className="text-white/30 shrink-0" />
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
                style={activeCategory === cat.id
                  ? { background: "#F97316", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {cat.label}
                <span className="text-[10px] opacity-60 ml-0.5">({counts[cat.id]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <section className="py-10 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((book, i) => (
                <motion.div key={book.id} variants={fadeUp} initial="hidden" animate="visible" custom={i % 6}
                  className="rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col group"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  {/* Cover */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0"
                      style={{ border: `1px solid ${book.color}30` }}>
                      <BookCover repo={book.repo} title={book.title} color={book.color} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: LEVEL_COLORS[book.level] + "20", color: LEVEL_COLORS[book.level] }}>
                      {book.level}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm mb-0.5 leading-snug">{book.title}</h3>
                  <p className="text-[11px] font-semibold mb-2" style={{ color: book.color }}>{book.subtitle}</p>
                  <p className="text-xs text-white/50 leading-relaxed flex-1 mb-3">{book.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {book.topics.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{t}</span>
                    ))}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="text-xs text-white/30">{book.chapters}ch · {book.pages}pp</span>
                    <div className="flex items-center gap-2">
                      <a href={`https://github.com/embeddedos-org/${book.repo}/tree/master/docs/book`}
                        target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/10" title="View Source">
                        <Github size={13} className="text-white/40 hover:text-white/70" />
                      </a>
                      <a href={`https://github.com/embeddedos-org/${book.repo}/releases/latest`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-95"
                        style={{ background: book.color + "20", color: book.color, border: `1px solid ${book.color}30` }}>
                        <Download size={11} /> PDF
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">No books in this category yet.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mb-4">
              Want to Contribute a Book?
            </h2>
            <p className="text-white/50 mb-8">
              All books are open source and community-driven. Submit a chapter, fix a typo, or propose a new title on GitHub.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://github.com/embeddedos-org" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#F97316", color: "#fff" }}>
                <Github size={16} /> Contribute on GitHub
              </a>
              <Link href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
                <ExternalLink size={16} /> Browse Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
