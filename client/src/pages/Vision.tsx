import { motion } from "framer-motion";
import { Eye, Cpu, Brain, Globe, Shield, Zap, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";

const pillars = [
  { icon: Cpu, color: "#F97316", title: "Every Device, Every Architecture", desc: "EmbeddedOS runs on ARM Cortex-M/A/R, RISC-V, x86, MIPS, ARC, and Xtensa — from a 4KB microcontroller to a 64-core server. One OS, every device." },
  { icon: Brain, color: "#A855F7", title: "AI as a First-Class Citizen", desc: "AI inference is not a plugin or an afterthought. EAI is built into the EoS kernel scheduler, memory manager, and power governor — so AI tasks run with the same determinism as real-time tasks." },
  { icon: Shield, color: "#22D3EE", title: "Security Without Compromise", desc: "Capability-based security, verified boot, post-quantum cryptography, and formal verification — not as optional add-ons, but as the foundation every application is built on." },
  { icon: Globe, color: "#34D399", title: "Free, Forever", desc: "EmbeddedOS is MIT licensed and will remain free forever. The Foundation is a 501(c)(3) nonprofit — no investor pressure, no licensing fees, no vendor lock-in." },
  { icon: Zap, color: "#FBBF24", title: "Developer Experience First", desc: "EoStudio, eBuild, EoSim, eFlow — every tool in the EmbeddedOS ecosystem is designed to make embedded development faster, safer, and more accessible than it has ever been." },
  { icon: Star, color: "#F472B6", title: "Education & Access", desc: "10,000 free certifications. Open curriculum. Internships and fellowships for students worldwide. EmbeddedOS believes the next generation of embedded engineers should not be limited by access to tools or education." },
];

const timeline = [
  { year: "2018", event: "embeddedos.org domain registered — EmbeddedOS project started" },
  { year: "2020", event: "Kernel architecture research phase — real-time scheduling, memory management" },
  { year: "2023", event: "EoS kernel v0.1 released — ARM Cortex-M, RISC-V, x86 support" },
  { year: "2024", event: "EAI v0.1 released — INT8 inference on Cortex-M55 with Helium MVE" },
  { year: "2025", event: "ENI v0.1 released — 1,024-channel neural signal acquisition" },
  { year: "2025", event: "EoStudio, EoSim, eBuild, eFlow, eDB, eBrowser released" },
  { year: "2026", event: "Foundation incorporated as 501(c)(3) public charity (EIN: 41-4821627)" },
  { year: "2026", event: "eHealth365 and eRadar360 hardware products launched" },
  { year: "2027", event: "v1.0 — safety-critical certification, DO-178C DAL-A, IEC 61508 SIL-3" },
  { year: "2030", event: "Vision: EmbeddedOS running on 1 billion devices worldwide" },
];

export default function Vision() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Eye className="w-4 h-4" /> VISION
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              Our Vision
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A world where every embedded device — from a $0.50 microcontroller to a $50,000 medical device — runs on a secure, AI-capable, open-source operating system.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Six Pillars of EmbeddedOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: p.color + "20" }}>
                  <p.icon className="w-6 h-6" style={{ color: p.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Foundation Timeline</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <motion.div key={t.year + t.event} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-6">
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-orange-400 font-mono text-sm font-bold">{t.year}</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1 relative z-10" />
                  <p className="text-gray-300 text-sm">{t.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join the Mission</h2>
          <p className="text-gray-400 mb-6">Whether you contribute code, documentation, funding, or your time — you are part of building the future of embedded computing.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/get-involved" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">Get Involved <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">Donate</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
