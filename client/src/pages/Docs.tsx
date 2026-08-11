import { motion } from "framer-motion";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { Link } from "wouter";
import {
  Cpu,
  Zap,
  MessageSquare,
  Shield,
  Network,
  FlaskConical,
  Package,
  Database,
  Globe,
  FileText,
  Layers,
  Code,
  ArrowRight,
  Search,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const DOC_SECTIONS = [
  {
    title: "Core Platform",
    color: "#F97316",
    items: [
      {
        name: "EOS Kernel",
        desc: "Real-time kernel API, task scheduling, memory management",
        icon: Cpu,
        href: "https://github.com/embeddedos-org/EoS",
        external: true,
      },
      {
        name: "eBoot",
        desc: "Secure bootloader, OTA updates, hardware attestation",
        icon: Zap,
        href: "https://github.com/embeddedos-org/eBoot",
        external: true,
      },
      {
        name: "EIPC",
        desc: "Inter-process communication, message queues, shared memory",
        icon: MessageSquare,
        href: "https://github.com/embeddedos-org/eIPC",
        external: true,
      },
      {
        name: "eSec",
        desc: "Cryptography, secure storage, hardware security modules",
        icon: Shield,
        href: "https://github.com/embeddedos-org/EoS",
        external: true,
      },
      {
        name: "eNet",
        desc: "Networking stack, TCP/IP, MQTT, CoAP, WiFi, BLE",
        icon: Network,
        href: "https://github.com/embeddedos-org/EoS",
        external: true,
      },
    ],
  },
  {
    title: "AI & Neural",
    color: "#34D399",
    items: [
      {
        name: "eAI Edge",
        desc: "On-device AI inference, TensorFlow Lite, ONNX runtime",
        icon: FlaskConical,
        href: "https://github.com/embeddedos-org/eAI",
        external: true,
      },
      {
        name: "eAI Neural",
        desc: "Neural network training, model optimization, quantization",
        icon: Layers,
        href: "https://github.com/embeddedos-org/eNI",
        external: true,
      },
    ],
  },
  {
    title: "Applications & Tools",
    color: "#22D3EE",
    items: [
      {
        name: "eApps",
        desc: "60+ embedded applications, LVGL UI framework, SDL2 port",
        icon: Package,
        href: "/eapps",
        external: false,
      },
      {
        name: "eDB",
        desc: "Embedded SQL database, flash optimization, low-RAM mode",
        icon: Database,
        href: "https://github.com/embeddedos-org/eApps",
        external: true,
      },
      {
        name: "eBrowser",
        desc: "Minimal web engine, CSS support, JavaScript runtime",
        icon: Globe,
        href: "https://github.com/embeddedos-org/eApps",
        external: true,
      },
      {
        name: "eOffice",
        desc: "11 office applications, document formats, collaboration",
        icon: FileText,
        href: "https://github.com/embeddedos-org/eApps",
        external: true,
      },
    ],
  },
  {
    title: "Simulation & Dev Tools",
    color: "#A78BFA",
    items: [
      {
        name: "EoSim",
        desc: `Hardware simulator, ${SIM_PLATFORM_COUNT} platforms, GPIO/UART/SPI/I2C simulation`,
        icon: Cpu,
        href: "https://github.com/embeddedos-org/EoSim",
        external: true,
      },
      {
        name: "EoStudio",
        desc: "All-in-one IDE, 3D modeler, game editor, AI tutor",
        icon: Code,
        href: "https://github.com/embeddedos-org/EoStudio",
        external: true,
      },
      {
        name: "ebuild",
        desc: "Build system, cross-compilation, package management",
        icon: Layers,
        href: "https://github.com/embeddedos-org/ebuild",
        external: true,
      },
    ],
  },
];

const QUICK_REF = [
  {
    api: "eos_task_create()",
    module: "EOS Kernel",
    desc: "Create a new RTOS task",
  },
  {
    api: "eos_mutex_lock()",
    module: "EOS Kernel",
    desc: "Acquire a mutex lock",
  },
  { api: "eipc_channel_open()", module: "EIPC", desc: "Open an IPC channel" },
  {
    api: "eai_model_load()",
    module: "eAI Edge",
    desc: "Load a neural network model",
  },
  { api: "esec_encrypt()", module: "eSec", desc: "Encrypt data with AES-256" },
  {
    api: "enet_socket_create()",
    module: "eNet",
    desc: "Create a network socket",
  },
  { api: "edb_query()", module: "eDB", desc: "Execute a SQL query" },
  {
    api: "eboot_update_start()",
    module: "eBoot",
    desc: "Initiate OTA firmware update",
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center mb-10"
          >
            <div className="badge-teal mb-4 inline-flex">Documentation</div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              EmbeddedOS <span className="text-gradient">Documentation</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Complete API reference, guides, and examples for all 14 EmbeddedOS
              components. 300+ APIs documented with code examples.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-11 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F97316]/50 text-sm"
                onFocus={() => {
                  const e = new CustomEvent("open-search");
                  window.dispatchEvent(e);
                }}
                readOnly
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono bg-white/5 px-1.5 py-0.5 rounded">
                Ctrl+K
              </kbd>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {DOC_SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={si}
            >
              <h2
                className="font-heading font-bold text-white text-xl mb-4"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                    >
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-4 glass rounded-xl border border-white/5 hover:border-white/10 card-hover group"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: section.color + "20",
                              border: `1px solid ${section.color}40`,
                            }}
                          >
                            <Icon size={18} style={{ color: section.color }} />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm group-hover:text-[#F97316] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-xs text-white/50 mt-0.5 leading-relaxed">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 p-4 glass rounded-xl border border-white/5 hover:border-white/10 card-hover group"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: section.color + "20",
                              border: `1px solid ${section.color}40`,
                            }}
                          >
                            <Icon size={18} style={{ color: section.color }} />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm group-hover:text-[#F97316] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-xs text-white/50 mt-0.5 leading-relaxed">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-6"
          >
            <h2 className="font-heading font-bold text-white text-2xl mb-2">
              Quick API Reference
            </h2>
            <p className="text-white/50 text-sm">
              Commonly used APIs across the EmbeddedOS ecosystem.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="glass rounded-2xl border border-white/10 overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-white/40 font-semibold text-xs uppercase tracking-widest">
                    API
                  </th>
                  <th className="text-left px-4 py-3 text-white/40 font-semibold text-xs uppercase tracking-widest hidden sm:table-cell">
                    Module
                  </th>
                  <th className="text-left px-4 py-3 text-white/40 font-semibold text-xs uppercase tracking-widest">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {QUICK_REF.map((row, i) => (
                  <tr
                    key={row.api}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/2"}`}
                  >
                    <td className="px-4 py-3">
                      <code className="text-[#22D3EE] text-xs font-mono">
                        {row.api}
                      </code>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-[#F97316] font-semibold">
                        {row.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#080F1E] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading font-bold text-white text-2xl mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-white/50 mb-6">
            Follow the Getting Started guide to set up your development
            environment.
          </p>
          <Link
            href="/getting-started"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
