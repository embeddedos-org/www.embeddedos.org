import { motion } from "framer-motion";
import { ArrowRight, Github, Cpu, Zap, MessageSquare, Wrench, Bot, Braces, FlaskConical, Wifi, Terminal, LayoutGrid, Blocks, Plane, Rocket, Package, FileText, Globe, Database, Activity, Watch, Fingerprint, Microscope, Stethoscope, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const REPO_GROUPS = [
  {
    title: "Core OS",
    color: "#F97316",
    repos: [
      { name: "EoS Kernel", desc: "Real-time embedded OS — the heart of EmbeddedOS", icon: Cpu, href: "https://github.com/embeddedos-org/eos", stars: "⭐ Core" },
      { name: "eBoot", desc: "Secure bootloader with OTA update support", icon: Zap, href: "https://github.com/embeddedos-org/eBoot", stars: "⭐ Core" },
      { name: "eIPC", desc: "Ultra-low latency inter-process communication", icon: MessageSquare, href: "https://github.com/embeddedos-org/eIPC", stars: "⭐ Core" },
      { name: "ebuild", desc: "Next-gen build tool for the EoS ecosystem", icon: Wrench, href: "https://github.com/embeddedos-org/ebuild", stars: "⭐ Core" },
      { name: "eosllm", desc: "On-device LLM inference engine", icon: Bot, href: "https://github.com/embeddedos-org/eosllm", stars: "⭐ Core" },
      { name: "EoS Language", desc: "Fastest embedded APIs & programming language", icon: Braces, href: "https://github.com/embeddedos-org/eos-programming-language", stars: "⭐ Core" },
    ],
  },
  {
    title: "AI & Neural",
    color: "#34D399",
    repos: [
      { name: "eAI", desc: "AI layer with eBot agent and edge inference", icon: FlaskConical, href: "https://github.com/embeddedos-org/eAI", stars: "⭐ AI" },
      { name: "eNI", desc: "Neural interface adapter for BCI devices", icon: Wifi, href: "https://github.com/embeddedos-org/eNI", stars: "⭐ AI" },
    ],
  },
  {
    title: "Dev Tools",
    color: "#22D3EE",
    repos: [
      { name: "EoSim", desc: "63+ board simulator for hardware-free development", icon: Terminal, href: "https://github.com/embeddedos-org/eosim", stars: "⭐ Tools" },
      { name: "EoStudio", desc: "Universal IDE v3.1 for EmbeddedOS development", icon: LayoutGrid, href: "https://github.com/embeddedos-org/eostudio", stars: "⭐ Tools" },
      { name: "eos-stack-manifest", desc: "Unified build manifest for all project artifacts", icon: Blocks, href: "https://github.com/embeddedos-org/eos-stack-manifest", stars: "⭐ Tools" },
    ],
  },
  {
    title: "Applications",
    color: "#A78BFA",
    repos: [
      { name: "eApps", desc: "60+ embedded apps across all platforms", icon: Package, href: "https://github.com/embeddedos-org/eApps", stars: "⭐ Apps" },
      { name: "eOffice", desc: "11-app office suite for embedded systems", icon: FileText, href: "https://github.com/embeddedos-org/eApps", stars: "⭐ Apps" },
      { name: "eBrowser", desc: "Privacy-first lightweight browser", icon: Globe, href: "https://github.com/embeddedos-org/eApps", stars: "⭐ Apps" },
      { name: "eDB", desc: "Embedded SQL database with AI query support", icon: Database, href: "https://github.com/embeddedos-org/eApps", stars: "⭐ Apps" },
    ],
  },
  {
    title: "Health Devices",
    color: "#F85149",
    repos: [
      { name: "HEALTH-KEY ULTRA", desc: "USB-C ECG + SpO₂ pendrive — Patent Pending", icon: Activity, href: "https://github.com/embeddedos-org/eos-health", stars: "🔬 Health" },
      { name: "HEALTH-BAND Neuro", desc: "sEMG + TENS AI wristband — Patent Pending", icon: Watch, href: "https://github.com/embeddedos-org/eos-health", stars: "🔬 Health" },
      { name: "HEALTH-RING", desc: "Titanium smart ring with ECG + glucose", icon: Fingerprint, href: "https://github.com/embeddedos-org/eos-health", stars: "🔬 Health" },
      { name: "HEALTH-LAB", desc: "14-day biosensor patch for biochemistry", icon: Microscope, href: "https://github.com/embeddedos-org/eos-health", stars: "🔬 Health" },
      { name: "Health Hub App", desc: "Unified iOS + Android health app", icon: Stethoscope, href: "https://github.com/embeddedos-org/eos-health", stars: "🔬 Health" },
    ],
  },
  {
    title: "Aerospace",
    color: "#60A5FA",
    repos: [
      { name: "AeroSwift Personal", desc: "1-2 seat solar-hybrid VTOL aircraft", icon: Plane, href: "https://github.com/embeddedos-org/eos-aero", stars: "✈️ Aero" },
      { name: "AeroSwift Transit", desc: "10-seat urban air taxi platform", icon: Rocket, href: "https://github.com/embeddedos-org/eos-aero", stars: "✈️ Aero" },
    ],
  },
];

const STATS = [
  { value: "22", label: "Repositories" },
  { value: "60+", label: "Applications" },
  { value: "4", label: "Health Devices" },
  { value: "2", label: "Aircraft Models" },
];

export default function Projects() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              <Github size={12} />
              Open Source Ecosystem
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              All{" "}
              <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              22 open-source repositories spanning embedded OS, AI, health devices, aerospace, and developer tools.
              Everything is open. Everything is connected.
            </p>
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <Github size={16} />
              Browse All on GitHub
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-heading font-extrabold text-3xl text-[#F97316]">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repo Groups */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {REPO_GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={gi}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, ${group.color}60, transparent)` }}
                />
                <h2
                  className="font-heading font-bold text-sm uppercase tracking-widest"
                  style={{ color: group.color }}
                >
                  {group.title}
                </h2>
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(270deg, ${group.color}60, transparent)` }}
                />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.repos.map((repo, ri) => {
                  const Icon = repo.icon;
                  return (
                    <motion.a
                      key={repo.name}
                      href={repo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={ri * 0.5}
                      className="glass rounded-xl p-4 border border-white/5 hover:border-white/15 card-hover flex items-start gap-3 group"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: group.color + "20", border: `1px solid ${group.color}40` }}
                      >
                        <Icon size={18} style={{ color: group.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-white text-sm group-hover:text-[#F97316] transition-colors">{repo.name}</div>
                          <span className="text-[10px] text-white/30 shrink-0">{repo.stars}</span>
                        </div>
                        <div className="text-xs text-white/50 mt-0.5 leading-relaxed">{repo.desc}</div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#080F1E] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Star size={32} className="text-[#F97316] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-white text-2xl mb-4">Star the Repos</h2>
          <p className="text-white/50 mb-6">Every star helps EmbeddedOS grow. Join 22 repos and help build the OS for every device.</p>
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
          >
            <Github size={16} />
            View All Repos
          </a>
        </div>
      </section>
    </div>
  );
}
