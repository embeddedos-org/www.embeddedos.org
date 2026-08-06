import { motion } from "framer-motion";
import {
  FlaskConical,
  Brain,
  Cpu,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";

const areas = [
  {
    icon: Brain,
    color: "#A855F7",
    title: "Neural Link & AI Integration",
    desc: "Research into brain-computer interfaces (BCI) using the ENI framework. Topics include spike sorting algorithms, neural decoding, closed-loop stimulation, and BCI latency optimization.",
    href: "/neural-link-ai",
  },
  {
    icon: Cpu,
    color: "#F97316",
    title: "AI Operating Systems",
    desc: "Investigating how AI inference should be integrated at the OS level — scheduling AI tasks alongside real-time tasks, memory management for model weights, and hardware-aware kernel extensions.",
    href: "/ai-os",
  },
  {
    icon: Shield,
    color: "#22D3EE",
    title: "Building OS with Linux/RTOS",
    desc: "Research into hybrid OS architectures that combine Linux user-space with real-time EoS kernel guarantees — enabling rich application ecosystems without sacrificing determinism.",
    href: "/building-os",
  },
  {
    icon: Zap,
    color: "#34D399",
    title: "Future Research Programs",
    desc: "Post-quantum cryptography for embedded systems, formal verification of the EoS kernel, energy harvesting OS primitives, and federated learning on microcontrollers.",
    href: "/future-research",
  },
  {
    icon: Globe,
    color: "#FBBF24",
    title: "Open Hardware Research",
    desc: "CAD-driven hardware co-design using the eCAD framework — from schematic capture to firmware simulation. Research into open hardware certification pathways (CE, FCC, FDA).",
    href: "/hardware-lab",
  },
  {
    icon: FlaskConical,
    color: "#F472B6",
    title: "Embedded AI Benchmarks",
    desc: "Developing standardized benchmarks for embedded AI inference — latency, throughput, energy efficiency, and accuracy on constrained hardware. Published openly for community use.",
    href: "/eai",
  },
];

const papers = [
  {
    title: "EAI 0.9: INT4 LLM Inference at 11 tok/s on Cortex-M85",
    date: "2026",
    type: "Benchmark Report",
    href: "/article-eai-llm-bench",
    internal: true,
  },
  {
    title: "Capability-Based Security in Real-Time Operating Systems",
    date: "2025",
    type: "Technical Paper",
    href: "https://github.com/embeddedos-org/embeddedos-org/blob/main/docs/eos.html",
    internal: false,
  },
  {
    title: "ENI: 1,024-Channel Neural Signal Acquisition at 30 kHz",
    date: "2025",
    type: "Hardware Specification",
    href: "/article-eni-1024-channel-pipeline",
    internal: true,
  },
  {
    title: "eBootloader: Formal Security Analysis of 5-Stage Verified Boot",
    date: "2025",
    type: "Security Analysis",
    href: "/article-eboot-secure-boot-deepdive",
    internal: true,
  },
  {
    title: "eBuild: Declarative Cross-Compilation for Embedded AI Systems",
    date: "2024",
    type: "Technical Paper",
    href: "https://github.com/embeddedos-org/embeddedos-org/blob/main/docs/ebuild.html",
    internal: false,
  },
  {
    title: "EoS Kernel: Deterministic Scheduling with Sub-10μs Context Switch",
    date: "2024",
    type: "Performance Report",
    href: "/article-eos-roadmap-2026",
    internal: true,
  },
];

export default function Research() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <FlaskConical className="w-4 h-4" /> RESEARCH
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Research Programs
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The EmbeddedOS Foundation conducts open research across embedded
              AI, neural interfaces, OS architecture, and hardware security. All
              findings are published openly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Research Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={a.href}
                  className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all h-full"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: a.color + "20" }}
                  >
                    <a.icon className="w-6 h-6" style={{ color: a.color }} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{a.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {a.desc}
                  </p>
                  <div
                    className="mt-4 flex items-center gap-1 text-sm font-medium"
                    style={{ color: a.color }}
                  >
                    Read more <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Publications & Reports
          </h2>
          <div className="space-y-3">
            {papers.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div>
                  <div className="text-white font-medium mb-1">{p.title}</div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-400">{p.date}</span>
                    <span className="text-gray-500">{p.type}</span>
                  </div>
                </div>
                {p.internal ? (
                  <Link
                    href={p.href}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Contribute to Research
          </h2>
          <p className="text-gray-400 mb-6">
            The Foundation welcomes research contributions. Apply for a
            fellowship or open a research RFC on GitHub Discussions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/internship"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              Apply for Fellowship <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/orgs/embeddedos-org/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              GitHub Discussions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
