import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Cpu,
  Zap,
  Shield,
  Layers,
  Code,
  ChevronRight,
  ArrowRight,
  Check,
  Terminal,
  BookOpen,
} from "lucide-react";
import { Suspense, lazy } from "react";
const EoSKernelCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EoSKernelCanvas }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.07,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

const LAYERS = [
  {
    name: "Applications",
    color: "#A78BFA",
    items: ["eOffice", "eBrowser", "eDB", "60+ eApps", "Custom Apps"],
  },
  {
    name: "AI / ENI Layer",
    color: "#34D399",
    items: ["EAI Engine", "ENI Adapter", "eBot", "eosllm"],
  },
  {
    name: "EoS Services",
    color: "#22D3EE",
    items: ["eIPC", "OTA Manager", "App Store", "Security Manager", "eFlow"],
  },
  {
    name: "EoS Kernel",
    color: "#F97316",
    items: [
      "RTOS Scheduler",
      "Memory Manager",
      "Driver Model",
      "POSIX Layer",
      "EoS Language API",
    ],
  },
  {
    name: "eBoot",
    color: "#F59E0B",
    items: ["Secure Boot", "Verified Chain", "OTA Staging", "Recovery"],
  },
  {
    name: "Hardware (HAL)",
    color: "#60A5FA",
    items: [
      "STM32",
      "ESP32",
      "nRF52",
      "RISC-V",
      "i.MX RT",
      "RPi Pico",
      "46+ more",
    ],
  },
];

const FEATURES = [
  {
    icon: Zap,
    color: "#F97316",
    title: "Sub-1ms Interrupt Latency",
    desc: "Deterministic real-time scheduling with configurable tick rates down to 1 µs.",
  },
  {
    icon: Shield,
    color: "#34D399",
    title: "Secure Boot Chain",
    desc: "eBoot verifies every stage cryptographically. Tampered firmware cannot run.",
  },
  {
    icon: Layers,
    color: "#22D3EE",
    title: "Modular Driver Model",
    desc: "Add or remove drivers without recompiling the kernel. Hot-plug on supported platforms.",
  },
  {
    icon: Code,
    color: "#A78BFA",
    title: "POSIX-Compatible API",
    desc: "Port existing POSIX applications to EoS with minimal changes. Standard threads, mutexes, and sockets.",
  },
  {
    icon: Terminal,
    color: "#F59E0B",
    title: "EoS Language",
    desc: "The fastest embedded API surface — direct memory-mapped register access with type safety.",
  },
  {
    icon: Cpu,
    color: "#60A5FA",
    title: "52+ Board Support",
    desc: "STM32, ESP32, nRF52, RISC-V, i.MX RT, Raspberry Pi Pico, and 46 more MCU families.",
  },
];

const BOARDS = [
  "STM32F4 / F7 / H7",
  "ESP32 / ESP32-S3",
  "nRF52840",
  "RISC-V (GD32VF103)",
  "i.MX RT1060",
  "Raspberry Pi Pico",
  "Nordic nRF9160",
  "Renesas RA6M5",
  "TI CC2652",
  "Microchip SAME70",
];

export default function EoS() {
  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#F97316]/6 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[#22D3EE]/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
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
                  <Cpu size={12} /> EoS Kernel
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]"
              >
                EmbeddedOS
                <br />
                <span style={{ color: "#F97316" }}>Kernel</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-white/60 text-lg mb-6 leading-relaxed"
              >
                A deterministic, real-time operating system kernel built for
                resource-constrained devices. Sub-1ms interrupt latency, modular
                driver model, POSIX-compatible API, and support for 52+ MCU
                families.
              </motion.p>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/getting-started"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#F97316", color: "#fff" }}
                >
                  Get Started <ArrowRight size={15} />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
                >
                  <BookOpen size={15} /> API Reference
                </Link>
              </motion.div>
            </div>

            {/* 3D Kernel + Architecture stack visual */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex flex-col gap-4"
            >
              {/* 3D kernel animation */}
              <div
                className="rounded-2xl border border-white/8 overflow-hidden h-48"
                style={{ background: "rgba(5,10,20,0.8)" }}
              >
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <EoSKernelCanvas hovered={false} />
                </Suspense>
              </div>
              <div
                className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: "rgba(5,10,20,0.8)" }}
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#F0883E]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
                  </div>
                  <span className="text-xs font-mono text-white/30 ml-2">
                    eos-architecture.d
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {LAYERS.map((layer, i) => (
                    <motion.div
                      key={layer.name}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.3 + i * 0.08,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                      style={{
                        background: `${layer.color}10`,
                        border: `1px solid ${layer.color}20`,
                      }}
                    >
                      <span
                        className="text-xs font-bold w-28 shrink-0"
                        style={{ color: layer.color }}
                      >
                        {layer.name}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {layer.items.map(item => (
                          <span
                            key={item}
                            className="text-[10px] px-1.5 py-0.5 rounded text-white/50"
                            style={{ background: `${layer.color}12` }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl text-white mb-2">
              Kernel Features
            </h2>
            <p className="text-white/40 text-base">
              What makes EoS different from other RTOS platforms
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border p-5 card-hover-glow"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: `${f.color}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${f.color}15` }}
                  >
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <div className="font-heading font-bold text-white mb-1">
                    {f.title}
                  </div>
                  <div className="text-white/50 text-sm leading-relaxed">
                    {f.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported boards */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-white text-xl mb-1">
                  52+ Supported Platforms
                </h2>
                <p className="text-white/40 text-sm">
                  From hobbyist boards to industrial MCUs
                </p>
              </div>
              <Link
                href="/hardware-lab"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:underline"
              >
                View all boards <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {BOARDS.map(b => (
                <span
                  key={b}
                  className="text-xs px-3 py-1.5 rounded-lg text-white/60"
                  style={{
                    background: "rgba(249,115,22,0.08)",
                    border: "1px solid rgba(249,115,22,0.2)",
                  }}
                >
                  {b}
                </span>
              ))}
              <span
                className="text-xs px-3 py-1.5 rounded-lg font-bold"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  color: "#F97316",
                }}
              >
                + 42 more →
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
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
            <h2 className="font-heading font-black text-3xl text-white mb-3">
              Try EoS on your board
            </h2>
            <p className="text-white/55 text-lg mb-6 max-w-xl mx-auto">
              Flash EoS to any of 52+ supported boards in under 10 minutes. Or
              try EoSim to simulate without hardware.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#F97316", color: "#fff" }}
              >
                Flash Your Board <ArrowRight size={15} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
              >
                <Terminal size={15} /> Try EoSim
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
