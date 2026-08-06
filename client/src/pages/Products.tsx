import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Cpu,
  Zap,
  Brain,
  FileText,
  Package,
  Heart,
  Plane,
  ChevronRight,
  ArrowRight,
  Code,
  Globe,
  Database,
  Monitor,
  Smartphone,
  Layers,
  Shield,
  Wifi,
  Activity,
  Watch,
  Fingerprint,
  Microscope,
  Terminal,
  Wrench,
  BookOpen,
  Star,
  Check,
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.07,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

// ─── Product families ─────────────────────────────────────────────────────────

const FAMILIES = [
  {
    id: "platform",
    label: "Platform",
    color: "#F97316",
    icon: Cpu,
    title: "EmbeddedOS Platform",
    tagline: "The kernel, bootloader, and runtime that power every device.",
    description:
      "EoS is a real-time operating system kernel designed for deterministic, resource-constrained environments. eBoot is its companion secure bootloader. Together they form the foundation every EmbeddedOS product is built on.",
    href: "/eos",
    products: [
      {
        name: "EoS Kernel",
        desc: "RTOS kernel — HAL, scheduler, IPC, drivers",
        icon: Cpu,
        href: "/eos",
        color: "#F97316",
      },
      {
        name: "eBoot",
        desc: "Secure bootloader with OTA + verified boot",
        icon: Zap,
        href: "/eboot",
        color: "#F59E0B",
      },
      {
        name: "eIPC",
        desc: "Ultra-low latency inter-process communication",
        icon: Layers,
        href: "/projects",
        color: "#F97316",
      },
      {
        name: "EoS Language",
        desc: "Fastest embedded APIs & programming language",
        icon: Code,
        href: "/docs",
        color: "#F59E0B",
      },
    ],
    stats: ["52+ boards", "Sub-1ms latency", "MIT License", "POSIX-compatible"],
  },
  {
    id: "ai",
    label: "AI & Neural",
    color: "#34D399",
    icon: Brain,
    title: "ENI / EAI",
    tagline: "On-device AI inference and neural interface adapters.",
    description:
      "EAI is EmbeddedOS's edge AI layer — running TFLite, ONNX, and custom models directly on microcontrollers. ENI is the neural interface adapter for BCI devices, enabling direct brain-computer communication over standard embedded buses.",
    href: "/eai",
    products: [
      {
        name: "EAI Engine",
        desc: "On-device LLM + TFLite inference runtime",
        icon: Brain,
        href: "/eai",
        color: "#34D399",
      },
      {
        name: "ENI Adapter",
        desc: "Neural interface for BCI devices over SPI/I²C",
        icon: Wifi,
        href: "/eai",
        color: "#10B981",
      },
      {
        name: "eBot Agent",
        desc: "AI assistant embedded in every EoS device",
        icon: Terminal,
        href: "/eai",
        color: "#34D399",
      },
      {
        name: "eosllm",
        desc: "On-device LLM inference engine (GGUF/ONNX)",
        icon: Brain,
        href: "/projects",
        color: "#10B981",
      },
    ],
    stats: ["TFLite + ONNX", "BCI-ready", "4-bit quantization", "eBot agent"],
  },
  {
    id: "apps",
    label: "Applications",
    color: "#A78BFA",
    icon: Package,
    title: "eApps Ecosystem",
    tagline: "60+ apps across office, browser, mobile, and native LVGL.",
    description:
      "The eApps ecosystem covers everything from a full 11-app office suite to native C/LVGL apps running directly on embedded displays, Flutter mobile apps, and browser extensions for every major platform.",
    href: "/eapps",
    products: [
      {
        name: "eOffice Suite",
        desc: "11 office apps — Writer, Sheet, Present, Notes…",
        icon: FileText,
        href: "/eoffice",
        color: "#A78BFA",
      },
      {
        name: "eBrowser",
        desc: "Privacy-first lightweight browser + 11 extensions",
        icon: Globe,
        href: "/eapps",
        color: "#8B5CF6",
      },
      {
        name: "eDB",
        desc: "Embedded SQL database with AI query support",
        icon: Database,
        href: "/eapps",
        color: "#A78BFA",
      },
      {
        name: "40+ LVGL Apps",
        desc: "Native C apps for embedded displays",
        icon: Monitor,
        href: "/eapps",
        color: "#8B5CF6",
      },
    ],
    stats: [
      "60+ total apps",
      "11 office apps",
      "5 mobile apps",
      "11 browser extensions",
    ],
  },
  {
    id: "health",
    label: "Health",
    color: "#F85149",
    icon: Heart,
    title: "Health Devices",
    tagline: "Medical-grade wearables powered by EmbeddedOS.",
    description:
      "Four patent-pending health monitoring devices — from a USB-C ECG pendrive to a 14-day biochemistry biosensor patch — all running EoS firmware with an open-source SDK and unified mobile app.",
    href: "/health",
    products: [
      {
        name: "HEALTH-KEY ULTRA",
        desc: "USB-C ECG + SpO₂ + BAC pendrive",
        icon: Activity,
        href: "/health",
        color: "#F85149",
      },
      {
        name: "HEALTH-BAND Neuro",
        desc: "sEMG + TENS AI wristband",
        icon: Watch,
        href: "/health",
        color: "#F59E0B",
      },
      {
        name: "HEALTH-RING",
        desc: "Titanium ring — ECG + HbA1c + AFib",
        icon: Fingerprint,
        href: "/health",
        color: "#A78BFA",
      },
      {
        name: "HEALTH-LAB",
        desc: "14-day biosensor patch — glucose, lactate, cortisol",
        icon: Microscope,
        href: "/health",
        color: "#34D399",
      },
    ],
    stats: [
      "2 patents pending",
      "30+ health metrics",
      "Open-source SDK",
      "iOS + Android app",
    ],
  },
  {
    id: "devtools",
    label: "Dev Tools",
    color: "#22D3EE",
    icon: Wrench,
    title: "Developer Tools",
    tagline: "Build, simulate, and ship embedded firmware faster.",
    description:
      "EoStudio is the universal IDE for EmbeddedOS development. EoSim simulates 63+ boards in-browser without hardware. ebuild is the next-gen build tool for the entire EoS ecosystem.",
    href: "/demo",
    products: [
      {
        name: "EoSim",
        desc: "63+ board simulator — run firmware in-browser",
        icon: Terminal,
        href: "/demo",
        color: "#22D3EE",
      },
      {
        name: "EoStudio",
        desc: "Universal IDE v3.1 with EoS integration",
        icon: Monitor,
        href: "/projects",
        color: "#0EA5E9",
      },
      {
        name: "ebuild",
        desc: "Next-gen build tool for the EoS ecosystem",
        icon: Wrench,
        href: "/projects",
        color: "#22D3EE",
      },
      {
        name: "eFlow",
        desc: "Visual no-code programming for EoS devices",
        icon: Zap,
        href: "/flow",
        color: "#0EA5E9",
      },
    ],
    stats: ["63+ boards", "In-browser sim", "Visual IDE", "No-code eFlow"],
  },
  {
    id: "aerospace",
    label: "Aerospace",
    color: "#60A5FA",
    icon: Plane,
    title: "AeroSwift",
    tagline: "Solar-hybrid VTOL aircraft powered by EmbeddedOS.",
    description:
      "AeroSwift Personal is a 1–2 seat solar-hybrid VTOL aircraft for personal mobility. AeroSwift Transit is a 10-seat urban air taxi platform. Both run EoS as their flight computer operating system.",
    href: "/aerospace",
    products: [
      {
        name: "AeroSwift Personal",
        desc: "1–2 seat solar-hybrid VTOL",
        icon: Plane,
        href: "/aerospace",
        color: "#60A5FA",
      },
      {
        name: "AeroSwift Transit",
        desc: "10-seat urban air taxi platform",
        icon: Plane,
        href: "/aerospace",
        color: "#3B82F6",
      },
    ],
    stats: [
      "Solar-hybrid",
      "VTOL capable",
      "EoS flight OS",
      "Urban air mobility",
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Products() {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const displayed = activeFamily
    ? FAMILIES.filter(f => f.id === activeFamily)
    : FAMILIES;

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* ── Hero ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#A78BFA]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-[#34D399]/4 rounded-full blur-[90px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.3)",
                color: "#F97316",
              }}
            >
              <Cpu size={12} /> What We Build
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-[1.05]"
          >
            The Full <span className="text-gradient-animated">EmbeddedOS</span>
            <br />
            Ecosystem
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            From the bare-metal kernel to office productivity apps, from neural
            interfaces to VTOL aircraft — every product the EmbeddedOS
            Foundation builds, in one place.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap justify-center gap-8 mb-10"
          >
            {[
              { value: "22", label: "Repositories" },
              { value: "60+", label: "Applications" },
              { value: "52+", label: "Supported Boards" },
              { value: "4", label: "Health Devices" },
              { value: "2", label: "Aircraft Models" },
              { value: "300+", label: "APIs" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-heading font-black text-3xl text-white">
                  {s.value}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#F97316", color: "#fff" }}
            >
              Get Started <ArrowRight size={15} />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
            >
              View All Repos <ChevronRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Architecture diagram ── */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl border border-white/6 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-heading font-bold text-white text-lg">
                EmbeddedOS Stack
              </h2>
              <p className="text-white/40 text-sm mt-0.5">
                Every layer, from silicon to application
              </p>
            </div>
            <div className="p-6">
              {[
                {
                  layer: "Applications",
                  items: [
                    "eOffice Suite",
                    "eBrowser",
                    "eDB",
                    "60+ eApps",
                    "Mobile Apps",
                  ],
                  color: "#A78BFA",
                  bg: "rgba(167,139,250,0.08)",
                },
                {
                  layer: "AI & Neural Layer",
                  items: ["EAI Engine", "ENI Adapter", "eBot Agent", "eosllm"],
                  color: "#34D399",
                  bg: "rgba(52,211,153,0.08)",
                },
                {
                  layer: "EoS Services",
                  items: [
                    "eIPC",
                    "eFlow",
                    "OTA Manager",
                    "App Store",
                    "Security",
                  ],
                  color: "#22D3EE",
                  bg: "rgba(34,211,238,0.08)",
                },
                {
                  layer: "EoS Kernel",
                  items: [
                    "Scheduler",
                    "Memory Mgr",
                    "Driver Model",
                    "POSIX Layer",
                    "EoS Language",
                  ],
                  color: "#F97316",
                  bg: "rgba(249,115,22,0.08)",
                },
                {
                  layer: "eBoot",
                  items: [
                    "Secure Boot",
                    "Verified Chain",
                    "OTA Staging",
                    "Recovery Mode",
                  ],
                  color: "#F59E0B",
                  bg: "rgba(245,158,11,0.08)",
                },
                {
                  layer: "Hardware (HAL)",
                  items: [
                    "52+ MCU Families",
                    "STM32 / ESP32 / nRF52 / RISC-V / i.MX RT / RPi Pico",
                  ],
                  color: "#60A5FA",
                  bg: "rgba(96,165,250,0.08)",
                },
              ].map((row, i) => (
                <motion.div
                  key={row.layer}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.07,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 mb-2"
                  style={{
                    background: row.bg,
                    border: `1px solid ${row.color}20`,
                  }}
                >
                  <div className="w-36 shrink-0">
                    <span
                      className="text-xs font-bold"
                      style={{ color: row.color }}
                    >
                      {row.layer}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.items.map(item => (
                      <span
                        key={item}
                        className="text-xs px-2 py-0.5 rounded-md text-white/60"
                        style={{
                          background: `${row.color}12`,
                          border: `1px solid ${row.color}20`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Family filter ── */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            <button
              onClick={() => setActiveFamily(null)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={
                activeFamily === null
                  ? { background: "#F97316", color: "#fff" }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }
              }
            >
              All Products
            </button>
            {FAMILIES.map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() =>
                    setActiveFamily(f.id === activeFamily ? null : f.id)
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={
                    activeFamily === f.id
                      ? { background: f.color, color: "#fff" }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                >
                  <Icon size={13} /> {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Product family cards ── */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {displayed.map((family, fi) => {
            const FamilyIcon = family.icon;
            return (
              <motion.div
                key={family.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={fi}
                className="rounded-3xl border overflow-hidden"
                style={{
                  borderColor: `${family.color}20`,
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                {/* Family header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 border-b"
                  style={{
                    borderColor: `${family.color}15`,
                    background: `${family.color}06`,
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${family.color}20` }}
                    >
                      <FamilyIcon size={22} style={{ color: family.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="font-heading font-black text-xl text-white">
                          {family.title}
                        </h2>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${family.color}20`,
                            color: family.color,
                          }}
                        >
                          {family.label}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm">{family.tagline}</p>
                    </div>
                  </div>
                  <Link
                    href={family.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shrink-0"
                    style={{ background: family.color, color: "#fff" }}
                  >
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="p-6">
                  {/* Description */}
                  <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-3xl">
                    {family.description}
                  </p>

                  {/* Product grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {family.products.map((p, pi) => {
                      const PIcon = p.icon;
                      return (
                        <Link
                          key={p.name}
                          href={p.href}
                          className="group flex items-start gap-3 p-4 rounded-2xl border transition-all hover:border-opacity-60 card-hover-glow"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            borderColor: `${p.color}25`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: `${p.color}18` }}
                          >
                            <PIcon size={15} style={{ color: p.color }} />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm group-hover:text-white transition-colors">
                              {p.name}
                            </div>
                            <div className="text-white/40 text-xs mt-0.5 leading-snug">
                              {p.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Stats pills */}
                  <div className="flex flex-wrap gap-2">
                    {family.stats.map(s => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                        style={{
                          background: `${family.color}10`,
                          border: `1px solid ${family.color}25`,
                          color: family.color,
                        }}
                      >
                        <Check size={10} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl p-10 text-center border"
            style={{
              background: "rgba(249,115,22,0.06)",
              borderColor: "rgba(249,115,22,0.2)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(249,115,22,0.15)" }}
            >
              <Star size={24} style={{ color: "#F97316" }} />
            </div>
            <h2 className="font-heading font-black text-3xl text-white mb-3">
              Ready to build with EmbeddedOS?
            </h2>
            <p className="text-white/55 text-lg mb-6 max-w-xl mx-auto">
              Everything is open-source, MIT-licensed, and free forever. Start
              with the kernel, add the apps, and ship to any device.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#F97316", color: "#fff" }}
              >
                Get Started Free <ArrowRight size={15} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
              >
                <BookOpen size={15} /> Read the Docs
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
              >
                <Shield size={15} /> Join the Foundation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
