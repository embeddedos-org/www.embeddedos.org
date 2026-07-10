import { motion } from "framer-motion";
import { Link } from "wouter";
import { Terminal, Package, Cpu, Zap, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Terminal,
    title: "Install eBuild CLI",
    desc: "The eBuild CLI is the entry point to the EmbeddedOS ecosystem. Install it via pip.",
    code: "pip install embeddedos-ebuild\nebuild --version",
  },
  {
    step: "02",
    icon: Package,
    title: "Create a New Project",
    desc: "Initialize a new EoS project for your target board. Supports STM32, ESP32, RISC-V, and more.",
    code: "ebuild init my-project --board stm32f4\ncd my-project\nls",
  },
  {
    step: "03",
    icon: Cpu,
    title: "Build & Flash",
    desc: "Cross-compile for your target, sign the image, and flash it to your device.",
    code: "ebuild build\nebuild flash\nebuild monitor",
  },
  {
    step: "04",
    icon: Zap,
    title: "Add Components",
    desc: "Add EoS components to your project — AI runtime, database, IPC, and more.",
    code: "ebuild add eai\nebuild add edb\nebuild build",
  },
];

const boards = [
  "STM32F407", "STM32H743", "ESP32", "ESP32-S3", "ESP32-C3",
  "RISC-V GD32VF103", "SiFive U74", "nRF52840", "RP2040", "i.MX RT1060",
  "STM32F103", "STM32L476", "ESP8266", "Arduino Due",
];

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Quick Start</p>
          <h1 className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl text-white mb-6">
            Up and Running in <span className="text-gold-gradient">60 Seconds</span>
          </h1>
          <p className="text-[#666] text-xl max-w-2xl mx-auto">
            From zero to a running EoS image on your hardware in four steps.
          </p>
        </motion.div>

        {/* Prerequisites */}
        <div className="glass-card rounded-2xl p-6 mb-12">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-[#C9A84C]" />
            Prerequisites
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: "Python", version: "3.8+" },
              { label: "Git", version: "2.30+" },
              { label: "USB Driver", version: "For your board" },
            ].map(({ label, version }) => (
              <div key={label} className="flex items-center gap-3 bg-[rgba(255,255,255,0.03)] rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                <span className="text-white font-medium">{label}</span>
                <span className="text-[#555] ml-auto">{version}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          {steps.map(({ step, icon: Icon, title, desc, code }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center">
                      <Icon size={22} className="text-[#C9A84C]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#C9A84C] font-mono text-sm font-bold">{step}</span>
                      <h3 className="font-semibold text-white text-lg">{title}</h3>
                    </div>
                    <p className="text-[#555] text-sm mb-4">{desc}</p>
                    <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border-b border-[rgba(255,255,255,0.06)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <pre className="p-4 text-sm font-mono text-[#C9A84C] bg-[#0a0a0a] overflow-x-auto">
                        {code.split("\n").map((line, j) => (
                          <div key={j}>{line}</div>
                        ))}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supported boards */}
        <div className="mb-16">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-white mb-6 text-center">
            Supported Hardware
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {boards.map((board) => (
              <span key={board} className="px-3 py-1.5 rounded-lg bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] text-[#888] text-sm font-mono">
                {board}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#555] text-sm">
              +10 more
            </span>
          </div>
        </div>

        {/* Next steps */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: "Read the Docs", desc: "Full API reference and guides", href: "/docs", cta: "Open Docs" },
            { title: "Explore Products", desc: "All 14 EmbeddedOS components", href: "/products", cta: "View Products" },
            { title: "Join the Community", desc: "Discord, GitHub, and forums", href: "/contact", cta: "Get Involved" },
          ].map(({ title, desc, href, cta }) => (
            <Link key={title} href={href}>
              <div className="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full">
                <h3 className="font-semibold text-white mb-2 group-hover:text-[#E8C97A] transition-colors">{title}</h3>
                <p className="text-[#555] text-sm mb-4">{desc}</p>
                <div className="flex items-center gap-1 text-[#C9A84C] text-sm font-medium">
                  {cta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
