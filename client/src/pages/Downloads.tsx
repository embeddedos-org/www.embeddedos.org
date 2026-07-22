import { motion } from "framer-motion";
import { Download, Github, Package, Terminal, Cpu, Layers, Brain, Zap, ArrowRight, ExternalLink } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

const DOWNLOADS = [
  {
    category: "Core Platform",
    icon: Cpu,
    color: "#F97316",
    items: [
      {
        name: "EmbeddedOS Kernel",
        version: "v1.0.0",
        description: "The core EoS real-time kernel — HAL, scheduler, memory manager, IPC, and device drivers for 52+ boards.",
        size: "2.4 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos",
        tags: ["ARM", "RISC-V", "MIPS", "x86"],
      },
      {
        name: "eBoot Bootloader",
        version: "v1.0.0",
        description: "Secure bootloader with chain-of-trust, OTA update support, anti-rollback counters, and signed manifests.",
        size: "512 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eboot",
        tags: ["Secure Boot", "OTA", "ARM"],
      },
      {
        name: "eos-platform",
        version: "v1.0.0",
        description: "Meta-distribution: one toolchain, every EoS profile. Unified package manifest and reproducible builds for all 52 supported boards.",
        size: "18 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos-platform",
        tags: ["Toolchain", "Cross-compile", "All Boards"],
      },
    ],
  },
  {
    category: "Developer Tools",
    icon: Terminal,
    color: "#22D3EE",
    items: [
      {
        name: "EoSim Simulator",
        version: "v2.0.0",
        description: "In-browser and CLI board simulator for 63+ embedded targets. Full GPIO, UART, SPI, I²C peripheral emulation and GDB integration.",
        size: "8.1 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/EoSim",
        tags: ["Simulator", "GDB", "63+ Boards"],
      },
      {
        name: "EoStudio IDE",
        version: "v3.1.0",
        description: "Universal embedded IDE with 10 specialized editors, AI code tutor, 3D hardware modeler, and cross-compilation for ARM, RISC-V, and MIPS.",
        size: "124 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/EoStudio",
        tags: ["IDE", "AI Tutor", "Cross-compile"],
      },
      {
        name: "eBuild Build System",
        version: "v1.0.0",
        description: "Declarative build system for EoS projects. CAD analysis, hardware simulation, firmware generation, and one-command flash.",
        size: "3.2 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/ebuild",
        tags: ["Build", "CAD", "Flash"],
      },
    ],
  },
  {
    category: "AI & Neural",
    icon: Brain,
    color: "#A78BFA",
    items: [
      {
        name: "eAI Engine",
        version: "v0.9.0",
        description: "On-device AI inference engine for embedded systems. Supports TensorFlow Lite, ONNX Runtime, and INT4/INT8 quantized LLMs on Cortex-M and RISC-V.",
        size: "1.8 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eAI",
        tags: ["TFLite", "ONNX", "INT4 LLM"],
      },
      {
        name: "eNI Neural Interface",
        version: "v0.8.0",
        description: "Hardware abstraction layer for neural interface devices — EEG, EMG, ECoG, and spike sorting pipeline with 1,024-channel deterministic processing.",
        size: "920 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eNI",
        tags: ["BCI", "EEG", "EMG", "Spike Sort"],
      },
      {
        name: "eosllm",
        version: "v0.5.0",
        description: "On-device LLM inference for resource-constrained embedded devices. Runs on 256 KB RAM with streaming token generation.",
        size: "640 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eosllm",
        tags: ["LLM", "256KB RAM", "Streaming"],
      },
    ],
  },
  {
    category: "Applications & Services",
    icon: Package,
    color: "#34D399",
    items: [
      {
        name: "eOffice Suite",
        version: "v1.0.0",
        description: "11-app productivity suite for embedded displays: eWriter, eSheet, ePresent, eNotes, eDraw, eCalc, eCalendar, eContacts, eMail, eChat, eFiles.",
        size: "22 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eoffice",
        tags: ["11 Apps", "Productivity", "Embedded UI"],
      },
      {
        name: "eApps Store (60+ apps)",
        version: "v1.0.0",
        description: "Full catalog of 60+ EoS applications across 6 categories: Productivity, Media, Communication, Utilities, Developer Tools, and System.",
        size: "Varies",
        license: "MIT",
        github: "https://github.com/embeddedos-org",
        tags: ["60+ Apps", "App Store", "6 Categories"],
      },
      {
        name: "eDB Database",
        version: "v0.9.0",
        description: "Multi-model embedded database: SQL, Document, Key-Value, REST API, and AI queries. AES-XTS at-rest encryption. Fits in 64 KB.",
        size: "380 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/edb",
        tags: ["SQL", "Document", "AES-XTS"],
      },
    ],
  },
  {
    category: "Health & Devices",
    icon: Zap,
    color: "#F472B6",
    items: [
      {
        name: "EoS Health Firmware",
        version: "v1.0.0",
        description: "Firmware stack for the 4 EmbeddedOS health devices: HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, and HEALTH-LAB. Includes biosensor drivers, BLE stack, and cloud sync.",
        size: "4.8 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos-health",
        tags: ["ECG", "SpO₂", "BLE", "4 Devices"],
      },
      {
        name: "EoS Aerospace Avionics",
        version: "v0.8.0",
        description: "DO-178C-compliant avionics firmware for the AeroSwift VTOL platform. Flight control, navigation, telemetry, and redundancy management.",
        size: "6.2 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos-aero",
        tags: ["DO-178C", "VTOL", "Avionics"],
      },
    ],
  },
  {
    category: "Protocols & Middleware",
    icon: Layers,
    color: "#F97316",
    items: [
      {
        name: "eIPC Protocol",
        version: "v1.0.0",
        description: "Ultra-low latency IPC protocol with wire format, CBOR codec, HMAC-SHA256 security, and sub-microsecond cross-core messaging.",
        size: "210 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eipc",
        tags: ["IPC", "CBOR", "HMAC", "Sub-µs"],
      },
      {
        name: "eBrowser Engine",
        version: "v0.7.0",
        description: "Embedded web browser engine with full HTML5/CSS3/JS support, WebAssembly runtime, and hardware-accelerated rendering for embedded displays.",
        size: "14 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/ebrowser",
        tags: ["HTML5", "CSS3", "WASM", "GPU"],
      },
    ],
  },
];

export default function Downloads() {
  return (
    <div className="min-h-screen pt-16 bg-[#050B18]">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-[#080F1E] to-[#050B18]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#F97316] uppercase mb-4">
              <Download size={13} /> Downloads
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Everything EmbeddedOS,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#FBBF24]">
                MIT Licensed
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              Every component of the EmbeddedOS ecosystem is free and open-source under the MIT License.
              Download directly from GitHub — no registration, no paywalls.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                <Github size={18} />
                Browse All Repos
              </a>
              <a
                href="/getting-started"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-[#F97316] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Get Started Guide
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download Categories */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-16">
            {DOWNLOADS.map((category, ci) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.category}
                  variants={fadeUp}
                  custom={ci}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${category.color}20` }}>
                      <Icon size={20} style={{ color: category.color }} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{category.category}</h2>
                    <div className="flex-1 h-px bg-white/10 ml-2" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item, ii) => (
                      <motion.div
                        key={item.name}
                        variants={fadeUp}
                        custom={ci * 0.3 + ii * 0.1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all hover:-translate-y-0.5 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-white text-sm">{item.name}</h3>
                            <span className="text-xs text-white/40 font-mono">{item.version}</span>
                          </div>
                          <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{item.size}</span>
                        </div>
                        <p className="text-xs text-white/55 leading-relaxed mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#34D399] font-semibold">{item.license} License</span>
                          <a
                            href={item.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:text-[#F97316]"
                            style={{ color: category.color }}
                          >
                            <Github size={13} />
                            Download
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Install Instructions */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Quick Install</h2>
            <p className="text-white/50 text-sm">Get started with EmbeddedOS in under 5 minutes</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Clone the repo",
                code: "git clone https://github.com/embeddedos-org/eos",
                color: "#F97316",
              },
              {
                step: "2",
                title: "Initialize your project",
                code: "ebuild init my-project --board stm32f4",
                color: "#22D3EE",
              },
              {
                step: "3",
                title: "Build and flash",
                code: "ebuild build && ebuild flash",
                color: "#34D399",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
                    {s.step}
                  </span>
                  <span className="text-sm font-semibold text-white">{s.title}</span>
                </div>
                <code className="block text-xs font-mono text-[#22D3EE] bg-black/30 px-3 py-2 rounded-lg break-all">{s.code}</code>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-8">
            <a href="/getting-started" className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#EA580C] font-semibold text-sm transition-colors">
              Full Getting Started Guide
              <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* License Notice */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-3">MIT License</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-4">
                All EmbeddedOS software is released under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the copyright notice and permission notice appearing in all copies.
              </p>
              <a href="/licenses" className="inline-flex items-center gap-1.5 text-[#F97316] hover:text-[#EA580C] text-sm font-semibold transition-colors">
                View full license text
                <ArrowRight size={13} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
