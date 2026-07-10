import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, Globe, Shield, Zap, Users, ArrowRight } from "lucide-react";

const timeline = [
  { year: "2019", title: "The Problem Identified", desc: "Founders observed that every embedded project reinvented the same wheel — bootloader, IPC, OTA, tooling. The vision for a unified open-source embedded OS stack was born." },
  { year: "2020", title: "EoS Kernel v0.1", desc: "First public release of the EoS real-time kernel targeting ARM Cortex-M4. Deterministic scheduling, basic IPC, and a signed bootloader." },
  { year: "2021", title: "EIPC & eBuild", desc: "Capability-based IPC (EIPC) and the eBuild SDK generator launched. First community contributors joined from the RISC-V ecosystem." },
  { year: "2022", title: "RISC-V & eDB", desc: "Full RISC-V support added. eDB embedded database released. EoSim simulator enabled testing without physical hardware." },
  { year: "2023", title: "EAI Runtime", desc: "EAI on-device AI runtime launched with 8 initial model variants. EoStudio IDE reached 1.0 with full debugging support." },
  { year: "2024", title: "eApps & eBowser", desc: "60+ first-party apps shipped in the eApps catalog. eBowser HTML5 engine entered beta. ENI neural interface stack announced." },
  { year: "2025", title: "Foundation Governance", desc: "EmbeddedOS transitioned to foundation governance model. 14 core products in production. eOffice suite and eServiceApps released." },
  { year: "2026+", title: "The Next Frontier", desc: "Expanding to automotive-grade safety certification, cloud-edge continuum, and neural interface production deployments." },
];

const values = [
  { icon: Globe, title: "Open by Default", desc: "Every line of code is open-source under Apache 2.0 or MIT. No proprietary lock-in, no closed modules, no hidden dependencies." },
  { icon: Shield, title: "Security First", desc: "Capability-based security is not an afterthought — it is the architecture. Every component boundary is authenticated and authorized." },
  { icon: Zap, title: "Performance Without Compromise", desc: "Real-time guarantees, deterministic scheduling, and sub-microsecond interrupt latency — because embedded systems cannot afford unpredictability." },
  { icon: Heart, title: "Community Driven", desc: "Governed by contributors, not corporations. Decisions are made transparently, roadmaps are public, and every voice matters." },
  { icon: Users, title: "Inclusive Engineering", desc: "We actively recruit from underrepresented groups in embedded systems. Diverse teams build better, more resilient software." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl text-white mb-6">
            About <span className="text-gold-gradient">EmbeddedOS</span>
          </h1>
          <p className="text-[#666] text-xl max-w-3xl mx-auto leading-relaxed">
            We are building the operating system infrastructure that the embedded world has always needed —
            open, modular, secure, and production-ready for every device from MCU to Linux-capable SoC.
          </p>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 sm:p-14 mb-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,76,0.06)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-4">Mission</p>
            <blockquote className="font-['Playfair_Display'] text-2xl sm:text-3xl text-white leading-relaxed font-medium">
              "To make world-class embedded OS infrastructure freely available to every developer, organization, and device — regardless of budget, geography, or corporate affiliation."
            </blockquote>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-['Playfair_Display'] font-bold text-4xl text-white mb-3">Our Values</h2>
            <p className="text-[#555] text-lg">The principles that guide every decision we make.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-['Playfair_Display'] font-bold text-4xl text-white mb-3">Our Journey</h2>
            <p className="text-[#555] text-lg">From a kernel prototype to a full embedded OS ecosystem.</p>
          </motion.div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[rgba(201,168,76,0.4)] via-[rgba(201,168,76,0.2)] to-transparent" />
            <div className="space-y-8 pl-16">
              {timeline.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="absolute -left-[42px] top-1.5 w-3 h-3 rounded-full bg-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.5)]" />
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#C9A84C] font-mono text-sm font-semibold">{year}</span>
                      <h3 className="font-semibold text-white">{title}</h3>
                    </div>
                    <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 text-center"
        >
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-white mb-4">
            Join the Mission
          </h2>
          <p className="text-[#666] mb-8 max-w-lg mx-auto">
            Whether you contribute code, documentation, hardware testing, or funding — every contribution moves embedded computing forward.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/careers" className="btn-gold px-8 py-4 rounded-xl font-semibold flex items-center gap-2">
              Join Our Team <ArrowRight size={18} />
            </Link>
            <Link href="/organization" className="btn-outline-gold px-8 py-4 rounded-xl font-semibold">
              Our Organization
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
