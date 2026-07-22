import { motion } from "framer-motion";
import { ArrowRight, Github, Heart, Code, BookOpen, Users, MessageSquare, Star, Wrench, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const WAYS_TO_CONTRIBUTE = [
  {
    icon: Code,
    title: "Write Code",
    desc: "Fix bugs, add features, or build new components. All skill levels welcome — from first PR to kernel hacker.",
    color: "#F97316",
    action: "Browse Issues",
    href: "https://github.com/embeddedos-org/eos/issues",
  },
  {
    icon: BookOpen,
    title: "Improve Docs",
    desc: "Write tutorials, fix typos, translate content, or add examples. Good docs are as valuable as good code.",
    color: "#22D3EE",
    action: "View Docs Repo",
    href: "https://github.com/embeddedos-org/embeddedos-org",
  },
  {
    icon: Wrench,
    title: "Test Hardware",
    desc: "Port EmbeddedOS to new boards, test BSPs, and report hardware-specific bugs.",
    color: "#A78BFA",
    action: "Hardware Lab",
    href: "/hardware-lab",
  },
  {
    icon: Zap,
    title: "Build Apps",
    desc: "Create new eApps, browser extensions, or mobile apps for the ecosystem.",
    color: "#34D399",
    action: "eApps Repo",
    href: "https://github.com/embeddedos-org/eApps",
  },
  {
    icon: MessageSquare,
    title: "Join Discussions",
    desc: "Answer questions, share ideas, and help newcomers in GitHub Discussions.",
    color: "#F59E0B",
    action: "Open Discussions",
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
  {
    icon: Star,
    title: "Star & Share",
    desc: "Star the repos, share on social media, and help grow the EmbeddedOS community.",
    color: "#60A5FA",
    action: "Star on GitHub",
    href: "https://github.com/embeddedos-org",
  },
];

const REPOS = [
  { name: "eos", desc: "Core kernel", href: "https://github.com/embeddedos-org/eos" },
  { name: "eAI", desc: "AI layer", href: "https://github.com/embeddedos-org/eAI" },
  { name: "eApps", desc: "App store", href: "https://github.com/embeddedos-org/eApps" },
  { name: "eos-health", desc: "Health devices", href: "https://github.com/embeddedos-org/eos-health" },
  { name: "eos-aero", desc: "Aerospace", href: "https://github.com/embeddedos-org/eos-aero" },
  { name: "embeddedos-org", desc: "This website", href: "https://github.com/embeddedos-org/embeddedos-org" },
];

export default function GetInvolved() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              <Heart size={12} />
              Foundation · 501(c)(3) · 509(a)(2)
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Get{" "}
              <span className="text-gradient">Involved</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              EmbeddedOS is built by the community, for the community.
              Whether you write code, improve docs, or just star the repos — every contribution matters.
            </p>
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <Github size={16} />
              Browse All Repos
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Ways to contribute */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">6 Ways to Contribute</h2>
            <p className="text-white/50">No contribution is too small. Find the path that fits you.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WAYS_TO_CONTRIBUTE.map((way, i) => {
              const Icon = way.icon;
              return (
                <motion.div
                  key={way.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-2xl p-5 border border-white/5 card-hover flex flex-col"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: way.color + "20", border: `1px solid ${way.color}40` }}
                  >
                    <Icon size={22} style={{ color: way.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base mb-2">{way.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed flex-1 mb-4">{way.desc}</p>
                  <a
                    href={way.href}
                    target={way.href.startsWith("http") ? "_blank" : undefined}
                    rel={way.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: way.color }}
                  >
                    {way.action}
                    <ArrowRight size={14} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Repos */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">Key Repositories</h2>
            <p className="text-white/50">Start with one of these to make your first contribution.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPOS.map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-xl p-4 border border-white/5 hover:border-white/15 card-hover flex items-center gap-3 group"
              >
                <Github size={20} className="text-white/40 group-hover:text-[#F97316] transition-colors shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm group-hover:text-[#F97316] transition-colors">embeddedos-org / {repo.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{repo.desc}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#080F1E] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Users size={32} className="text-[#F97316] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-white text-2xl mb-4">Our Values</h2>
          <p className="text-white/50 mb-2">Foundation · 501(c)(3) · 509(a)(2) · Community-driven · Free forever.</p>
          <p className="text-white/40 text-sm mb-6">
            EmbeddedOS is licensed under the MIT License. All hardware designs are open hardware.
            We will never add paywalls, ads, or proprietary features.
          </p>
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
          >
            <Star size={16} />
            Star Us on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
