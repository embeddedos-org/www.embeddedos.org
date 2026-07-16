import { motion } from "framer-motion";
import { BookOpen, Video, Code, Download, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const sections = [
  {
    icon: BookOpen,
    color: "#22D3EE",
    title: "Documentation",
    items: [
      { name: "EoS API Reference", desc: "Full C API reference — 197 functions, 14 modules.", link: "/api-docs", external: false },
      { name: "Getting Started Guide", desc: "5 onboarding paths from no hardware to full deployment.", link: "/getting-started", external: false },
      { name: "eBuild Reference", desc: "Complete ebuild CLI and ebuild.toml configuration reference.", link: "/ebuild", external: false },
      { name: "eFlow Documentation", desc: "Visual block programming — block library, pipeline, examples.", link: "/eflow", external: false },
      { name: "Books (14 titles)", desc: "Free embedded systems textbooks and reference guides.", link: "/books", external: false },
    ],
  },
  {
    icon: Code,
    color: "#F97316",
    title: "Code & Examples",
    items: [
      { name: "GitHub — embeddedos-org", desc: "All 22 repositories: kernel, drivers, apps, tools.", link: "https://github.com/embeddedos-org", external: true },
      { name: "EoSim Demo", desc: "Try EoS in your browser — no hardware needed.", link: "/demo", external: false },
      { name: "eCAD Hardware Designs", desc: "Open hardware CAD files for all eCAD products.", link: "https://github.com/embeddedos-org/eCAD-Hardware-Products", external: true },
      { name: "eAI Edge Stack", desc: "One-command eNI + eIPC + eAI deployment.", link: "/eai-edge", external: false },
    ],
  },
  {
    icon: Download,
    color: "#A855F7",
    title: "Downloads",
    items: [
      { name: "EoS Firmware Images", desc: "Pre-built firmware for 52+ supported boards.", link: "https://github.com/embeddedos-org/embeddedos/releases", external: true },
      { name: "eBuild CLI", desc: "Build tool for Linux, macOS, and Windows.", link: "https://github.com/embeddedos-org/ebuild/releases", external: true },
      { name: "EoStudio IDE", desc: "Desktop IDE for Linux, macOS, and Windows.", link: "https://github.com/embeddedos-org/eostudio/releases", external: true },
      { name: "EoSim CLI", desc: "Hardware simulator for 63 boards.", link: "https://github.com/embeddedos-org/eosim/releases", external: true },
    ],
  },
  {
    icon: Video,
    color: "#34D399",
    title: "Community & Support",
    items: [
      { name: "Discord Community", desc: "Join 2,000+ embedded engineers.", link: "https://discord.gg/embeddedos", external: true },
      { name: "GitHub Discussions", desc: "Q&A, feature requests, and RFCs.", link: "https://github.com/orgs/embeddedos-org/discussions", external: true },
      { name: "Certification Program", desc: "12 tracks, 60 certifications, free exams.", link: "/certification", external: false },
      { name: "Internship Program", desc: "Paid internships for students and new graduates.", link: "/internship", external: false },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" /> RESOURCES
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">Resources</h1>
            <p className="text-xl text-gray-400">Everything you need to build with EmbeddedOS — documentation, code, downloads, and community.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, i) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: section.color + "20" }}>
                  <section.icon className="w-5 h-5" style={{ color: section.color }} />
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map(item => (
                  <div key={item.name}>
                    {item.external ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-start justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors group">
                        <div>
                          <div className="text-white font-medium text-sm group-hover:text-white flex items-center gap-1">{item.name} <ExternalLink className="w-3 h-3 opacity-50" /></div>
                          <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                        </div>
                      </a>
                    ) : (
                      <Link href={item.link}>
                        <a className="flex items-start justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors group">
                          <div>
                            <div className="text-white font-medium text-sm">{item.name}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-0.5" />
                        </a>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
