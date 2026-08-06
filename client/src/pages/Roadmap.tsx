import { motion } from "framer-motion";
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Brain,
  Shield,
  Globe,
  Cpu,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

const phases = [
  {
    version: "v0.1.x",
    label: "Current Release",
    status: "in-progress",
    color: "#F97316",
    quarter: "Active Now",
    icon: Zap,
    description:
      "Foundation: kernel, bootloader, build system, AI inference, and core developer tools.",
    items: [
      {
        done: true,
        text: "EoS RTOS kernel — ARM Cortex-M/A, RISC-V, x86 support",
      },
      {
        done: true,
        text: "eBootloader — 5-stage verified boot, Ed25519 signatures, A/B OTA",
      },
      {
        done: true,
        text: "eBuild — declarative cross-compilation, 41 product profiles",
      },
      {
        done: true,
        text: "EAI v0.1 — INT8/INT4 inference, CMSIS-NN, Helium MVE",
      },
      {
        done: true,
        text: "ENI v0.1 — 1,024-channel neural signal acquisition, spike sorting",
      },
      {
        done: true,
        text: "EIPC v0.1 — capability tokens, zero-copy IPC, <1μs latency",
      },
      {
        done: true,
        text: "EoStudio IDE — 12-editor unified development environment",
      },
      { done: true, text: "EoSim — 63-platform in-browser simulator" },
      {
        done: false,
        text: "eDB v0.1 — multi-model embedded database (SQL + Document + KV)",
      },
      {
        done: false,
        text: "eBrowser v0.1 — embedded HTML/CSS/JS rendering engine",
      },
      {
        done: false,
        text: "eOffice Suite v0.1 — 11 productivity apps for embedded displays",
      },
    ],
  },
  {
    version: "v0.2.x",
    label: "Next Release",
    status: "planned",
    color: "#22D3EE",
    quarter: "Q3 2026",
    icon: Cpu,
    description:
      "Networking, health firmware, radar pipeline, and advanced AI inference on Cortex-M85.",
    items: [
      {
        done: false,
        text: "EoS SMP scheduler improvements — work-stealing, NUMA awareness",
      },
      {
        done: false,
        text: "EAI v0.2 — transformer support, LLM inference at <1ms on Cortex-M85",
      },
      {
        done: false,
        text: "eFlow v0.2 — visual block editor with CAD schematic import",
      },
      {
        done: false,
        text: "eHealth365 firmware v0.1 — Smart Ring Pro + Smart Patch Pro",
      },
      {
        done: false,
        text: "eRadar360 Aegis One firmware v0.1 — 77 GHz FMCW radar pipeline",
      },
      {
        done: false,
        text: "EoSim v0.2 — hardware-in-the-loop (HIL) simulation support",
      },
      {
        done: false,
        text: "Package manager — eos-pkg for distributing EoS applications",
      },
      {
        done: false,
        text: "Networking stack — lwIP integration, TLS 1.3, MQTT, CoAP",
      },
    ],
  },
  {
    version: "v0.3.x",
    label: "Future Release",
    status: "planned",
    color: "#A855F7",
    quarter: "Q1 2027",
    icon: Shield,
    description:
      "Post-quantum cryptography, formal verification, federated learning, and safety certifications.",
    items: [
      {
        done: false,
        text: "Post-quantum cryptography — CRYSTALS-Kyber, CRYSTALS-Dilithium",
      },
      {
        done: false,
        text: "Formal verification — seL4-style capability proof for EoS kernel",
      },
      {
        done: false,
        text: "EAI v0.3 — on-device fine-tuning, federated learning runtime",
      },
      {
        done: false,
        text: "eHealth365 v0.2 — FDA 510(k) pre-submission documentation",
      },
      {
        done: false,
        text: "eRadar360 v0.2 — NHTSA NCAP testing, SAE J3016 L2 ADAS support",
      },
      {
        done: false,
        text: "EoStudio v0.2 — AI pair programmer, real-time hardware debugger",
      },
      {
        done: false,
        text: "Certification artifacts — DO-178C DAL-C, IEC 61508 SIL-2 evidence",
      },
    ],
  },
  {
    version: "v1.0",
    label: "Production Ready",
    status: "vision",
    color: "#34D399",
    quarter: "2027",
    icon: Globe,
    description:
      "Safety-critical certification, POSIX compliance, FDA clearance, and 10,000+ free certifications.",
    items: [
      {
        done: false,
        text: "Safety-critical certification — DO-178C DAL-A, IEC 61508 SIL-3",
      },
      { done: false, text: "Full POSIX compliance layer for EoS" },
      {
        done: false,
        text: "EAI v1.0 — production-grade on-device LLM with <10ms TTFT",
      },
      {
        done: false,
        text: "ENI v1.0 — FDA Breakthrough Device designation for BCI applications",
      },
      {
        done: false,
        text: "eHealth365 v1.0 — CE Mark + FDA clearance for Smart Ring Pro",
      },
      {
        done: false,
        text: "Long-term support (LTS) release with 5-year security maintenance",
      },
      {
        done: false,
        text: "10,000+ free certifications issued to engineers worldwide",
      },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ── HERO ── */}
      <section className="relative py-28 px-4 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-[#22D3EE]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[#A855F7]/8 rounded-full blur-[100px]" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-sm font-bold mb-6 tracking-wide">
              <Map className="w-4 h-4" />
              PUBLIC ROADMAP
            </div>
            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl mb-5 text-white">
              EmbeddedOS{" "}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#A855F7] bg-clip-text text-transparent">
                Roadmap
              </span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Our public development roadmap — from v0.1 to v1.0
              production-ready. Built transparently, shipped incrementally.
            </p>
          </motion.div>

          {/* Phase summary pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {phases.map(p => (
              <div
                key={p.version}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: `${p.color}15`,
                  border: `1px solid ${p.color}35`,
                  color: p.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: p.color }}
                />
                {p.version} · {p.quarter}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Vertical timeline connector */}
          <div className="relative">
            {/* Left timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#F97316]/40 via-[#22D3EE]/30 to-[#34D399]/20 hidden sm:block" />

            <div className="space-y-8">
              {phases.map((phase, pi) => {
                const doneCount = phase.items.filter(i => i.done).length;
                const progress = Math.round(
                  (doneCount / phase.items.length) * 100
                );
                const PhaseIcon = phase.icon;

                return (
                  <motion.div
                    key={phase.version}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={pi}
                    className="relative sm:pl-20"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-6 w-12 h-12 rounded-full hidden sm:flex items-center justify-center z-10 shadow-lg"
                      style={{
                        background: `${phase.color}20`,
                        border: `2px solid ${phase.color}60`,
                      }}
                    >
                      <PhaseIcon size={20} style={{ color: phase.color }} />
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#080F1E]/80 backdrop-blur-sm"
                      style={{
                        boxShadow: `0 0 0 1px ${phase.color}10, 0 8px 32px ${phase.color}06`,
                      }}
                    >
                      {/* Card header */}
                      <div
                        className="px-6 py-5 border-b border-white/[0.06]"
                        style={{ background: `${phase.color}08` }}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Mobile icon */}
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center sm:hidden"
                              style={{
                                background: `${phase.color}20`,
                                border: `1px solid ${phase.color}40`,
                              }}
                            >
                              <PhaseIcon
                                size={18}
                                style={{ color: phase.color }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span
                                  className="font-heading font-extrabold text-xl"
                                  style={{ color: phase.color }}
                                >
                                  {phase.version}
                                </span>
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                  style={{
                                    background: `${phase.color}20`,
                                    color: phase.color,
                                  }}
                                >
                                  {phase.status.replace("-", " ")}
                                </span>
                              </div>
                              <div className="text-white font-semibold text-sm">
                                {phase.label}
                              </div>
                              <div className="text-white/40 text-xs mt-0.5">
                                {phase.quarter}
                              </div>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="text-right">
                            <div className="text-xs text-white/40 mb-1.5">
                              {doneCount}/{phase.items.length} complete
                            </div>
                            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${progress}%`,
                                  background: phase.color,
                                }}
                              />
                            </div>
                            <div
                              className="text-xs font-bold mt-1"
                              style={{ color: phase.color }}
                            >
                              {progress}%
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-white/50 text-sm mt-3 leading-relaxed">
                          {phase.description}
                        </p>
                      </div>

                      {/* Items list */}
                      <div className="p-6">
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                          {phase.items.map(item => (
                            <div
                              key={item.text}
                              className="flex items-start gap-3 group"
                            >
                              {item.done ? (
                                <CheckCircle2
                                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                                  style={{ color: phase.color }}
                                />
                              ) : (
                                <Circle className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-sm leading-snug ${
                                  item.done ? "text-white/70" : "text-white/35"
                                }`}
                              >
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-3xl p-px"
            style={{
              background: "linear-gradient(135deg, #22D3EE, #A855F7, #34D399)",
            }}
          >
            <div className="rounded-3xl bg-[#080F1E] px-8 py-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-xs font-bold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                Open Source · Community Driven
              </div>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
                Shape the Roadmap
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Have a feature request, bug report, or want to contribute? Every
                issue and PR helps define what ships next.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/embeddedos-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#020617] font-bold rounded-xl btn-press"
                >
                  Open an Issue
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/get-involved"
                  className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press border border-white/10"
                >
                  Get Involved
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
