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

import ProgrammeList from "@/components/ProgrammeList";
import {
  RESEARCH_KINDS,
  areaSummary,
  badgeOf,
  byKinds,
  formatDate,
  isInternal,
  kindSummary,
  type ContentItem,
} from "@/data/content";

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

/**
 * Publications come from the shared content registry, not from an array here.
 *
 * This page previously kept its own list, and it had drifted: four entries
 * pointed at the same URLs as /news while giving them different titles. One
 * article, two names, depending which page you landed on. A registry keyed by
 * href makes that impossible to reintroduce.
 */
const papers: ContentItem[] = byKinds(RESEARCH_KINDS);

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

      {/*
        The research programme's full shape, counts included — and the zeroes
        are the point. Listing only categories that already have something in
        them hides the programme from anyone deciding what to write next, and
        lets the published taxonomy drift with whoever published last. A
        category showing 0 is a commissioning brief; a category that quietly
        disappeared is a mystery.
      */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">
            Research Programme
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            What the Foundation publishes, and what it publishes about. Counts
            are live; a zero is work not yet done, not a category that does not
            exist.
          </p>

          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            By output
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {kindSummary(RESEARCH_KINDS).map(c => (
              <div
                key={c.key}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3"
              >
                <div className="text-white text-sm font-medium">{c.label}</div>
                <div
                  className={`text-xs mt-1 ${
                    c.count > 0 ? "text-orange-400" : "text-gray-600"
                  }`}
                >
                  {c.count > 0 ? `${c.count} published` : "none yet"}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            By subject
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {areaSummary().map(c => (
              <div
                key={c.key}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3"
              >
                <div className="text-white text-sm font-medium">{c.label}</div>
                <div
                  className={`text-xs mt-1 ${
                    c.count > 0 ? "text-purple-400" : "text-gray-600"
                  }`}
                >
                  {c.count > 0 ? `${c.count} published` : "none yet"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProgrammeList
        track="research"
        heading="Research Programmes"
        intro="Collaboration and funding, as distinct from what the Foundation publishes."
      />

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
                    <span className="text-orange-400">{formatDate(p.date)}</span>
                    <span className="text-gray-500">{badgeOf(p)}</span>
                  </div>
                </div>
                {isInternal(p) ? (
                  <Link
                    href={p.href}
                    aria-label={`Read ${p.title}`}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read ${p.title}, opens in a new tab`}
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
