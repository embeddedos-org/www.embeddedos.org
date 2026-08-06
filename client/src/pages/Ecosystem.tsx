import { motion } from "framer-motion";
import {
  Layers,
  Cpu,
  Shield,
  Brain,
  Zap,
  Database,
  Globe,
  Code,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

const layers = [
  {
    name: "Hardware",
    color: "#6B7280",
    bg: "#6B728010",
    items: [
      "ARM Cortex-M/A/R",
      "RISC-V RV32/RV64",
      "x86 / x86-64",
      "Custom SoC",
      "FPGA",
    ],
  },
  {
    name: "Kernel & Boot Layer",
    color: "#F97316",
    bg: "#F9731610",
    items: [
      {
        name: "EoS RTOS Kernel",
        desc: "Real-time kernel, capability security, SMP/AMP",
        href: "/eos",
      },
      {
        name: "eBootloader",
        desc: "5-stage verified boot, Ed25519, A/B OTA",
        href: "/eboot",
      },
    ],
  },
  {
    name: "Services Layer",
    color: "#22D3EE",
    bg: "#22D3EE10",
    items: [
      {
        name: "EIPC",
        desc: "Zero-copy IPC, capability tokens, <1μs latency",
        href: "/eai",
      },
      {
        name: "eDB",
        desc: "Multi-model embedded database (SQL + Doc + KV)",
        href: "/products",
      },
      {
        name: "EoS Platform SDK",
        desc: "Hardware abstraction, BSP, middleware",
        href: "/eos",
      },
    ],
  },
  {
    name: "AI & Intelligence Layer",
    color: "#A855F7",
    bg: "#A855F710",
    items: [
      {
        name: "EAI",
        desc: "On-device AI inference, INT4/INT8, <1ms latency",
        href: "/eai",
      },
      {
        name: "ENI",
        desc: "1,024-channel neural interface, BCI output",
        href: "/eai",
      },
    ],
  },
  {
    name: "Developer Tools Layer",
    color: "#34D399",
    bg: "#34D39910",
    items: [
      {
        name: "EoStudio IDE",
        desc: "12-editor unified development environment",
        href: "/products",
      },
      {
        name: "eBuild",
        desc: "Declarative cross-compilation, 41 profiles",
        href: "/ebuild",
      },
      {
        name: "EoSim",
        desc: "63-platform in-browser simulator",
        href: "/demo",
      },
      {
        name: "eFlow",
        desc: "Visual block-based firmware programming",
        href: "/eflow",
      },
    ],
  },
  {
    name: "Application Layer",
    color: "#FBBF24",
    bg: "#FBBF2410",
    items: [
      {
        name: "eApps Store",
        desc: "60+ embedded applications",
        href: "/eapps",
      },
      {
        name: "eBrowser",
        desc: "Embedded HTML/CSS/JS rendering engine",
        href: "/products",
      },
      {
        name: "eOffice Suite",
        desc: "11 productivity apps for embedded displays",
        href: "/eoffice",
      },
      {
        name: "eServiceApps",
        desc: "System services and daemons",
        href: "/products",
      },
    ],
  },
];

const products = [
  {
    icon: Cpu,
    color: "#F97316",
    name: "EoS",
    tagline: "Core RTOS Kernel",
    metrics: ["≤10μs context switch", "ARM · RISC-V · x86", "C11 standard"],
    href: "/eos",
  },
  {
    icon: Shield,
    color: "#22D3EE",
    name: "eBootloader",
    tagline: "Secure Boot Chain",
    metrics: ["Ed25519 signatures", "A/B updates", "<64KB footprint"],
    href: "/eboot",
  },
  {
    icon: Brain,
    color: "#A855F7",
    name: "EAI",
    tagline: "AI Inference Engine",
    metrics: ["<1ms inference", "INT8/INT4 quant", "256KB min RAM"],
    href: "/eai",
  },
  {
    icon: Zap,
    color: "#34D399",
    name: "ENI",
    tagline: "Neural Interface",
    metrics: ["1,024 channels", "30kHz sample rate", "24-bit ADC"],
    href: "/eai",
  },
  {
    icon: Database,
    color: "#FBBF24",
    name: "EIPC",
    tagline: "IPC Bus",
    metrics: ["<1μs latency", "Zero-copy", "Capability tokens"],
    href: "/products",
  },
  {
    icon: Code,
    color: "#F472B6",
    name: "eBuild",
    tagline: "Build System",
    metrics: ["41 profiles", "Cross-compile", "Declarative TOML"],
    href: "/ebuild",
  },
  {
    icon: Monitor,
    color: "#60A5FA",
    name: "EoStudio",
    tagline: "IDE",
    metrics: ["12 editors", "AI tutor", "Real-time debug"],
    href: "/products",
  },
  {
    icon: Globe,
    color: "#34D399",
    name: "eFlow",
    tagline: "Visual Programming",
    metrics: ["20+ block types", "CAD import", "No-code firmware"],
    href: "/eflow",
  },
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-cyan-500/5" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Layers className="w-4 h-4" /> PRODUCT ECOSYSTEM
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              The EmbeddedOS Ecosystem
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              14 open-source products built to work together — from bare-metal
              kernel to AI inference engine to full IDE. Every layer of the
              embedded stack, free forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Full-Stack Embedded Platform
          </h2>
          <div className="space-y-3">
            {layers.map((layer, li) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: li * 0.08 }}
                className="rounded-xl border overflow-hidden"
                style={{
                  borderColor: layer.color + "30",
                  background: layer.bg,
                }}
              >
                <div
                  className="px-5 py-3 border-b font-semibold text-sm"
                  style={{
                    borderColor: layer.color + "20",
                    color: layer.color,
                  }}
                >
                  {layer.name}
                </div>
                <div className="p-4 flex flex-wrap gap-3">
                  {layer.items.map((item: any) =>
                    typeof item === "string" ? (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-sm"
                      >
                        {item}
                      </span>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                      >
                        <span className="text-white font-medium">
                          {item.name}
                        </span>
                        <span className="text-gray-500 ml-2">{item.desc}</span>
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Every Product, Explained
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={p.href}
                  className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all h-full"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: p.color + "20" }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div className="text-white font-bold mb-0.5">{p.name}</div>
                  <div className="text-gray-400 text-sm mb-3">{p.tagline}</div>
                  <div className="space-y-1">
                    {p.metrics.map(m => (
                      <div
                        key={m}
                        className="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: p.color }}
                        />
                        {m}
                      </div>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start Building</h2>
          <p className="text-gray-400 mb-6">
            Use one product or the entire stack — everything is MIT licensed and
            free forever.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
