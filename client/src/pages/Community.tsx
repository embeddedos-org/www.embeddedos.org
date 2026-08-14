import { motion } from "framer-motion";
import {
  Users,
  Github,
  MessageSquare,
  Twitter,
  Youtube,
  BookOpen,
  Code,
  Heart,
  ArrowRight,
  Globe,
  Instagram,
} from "lucide-react";
import { Link } from "wouter";
import { SOCIAL_URLS } from "@/data/foundation";
import { BOARD_COUNT } from "@/data/stack";

const ways = [
  {
    icon: Code,
    color: "#F97316",
    title: "Contribute Code",
    desc: "Fix bugs, add features, write BSP drivers, or improve the EoS kernel. All skill levels welcome.",
    href: "https://github.com/embeddedos-org",
    cta: "View GitHub",
  },
  {
    icon: BookOpen,
    color: "#22D3EE",
    title: "Write Documentation",
    desc: "Improve API docs, write tutorials, translate content, or add examples to the developer wiki.",
    href: "/docs",
    cta: "View Docs",
  },
  {
    icon: MessageSquare,
    color: "#A855F7",
    title: "Join Discussions",
    desc: "Ask questions, share projects, and help other engineers on GitHub Discussions.",
    href: "https://github.com/orgs/embeddedos-org/discussions",
    cta: "Open Discussions",
  },
  {
    icon: Heart,
    color: "#EF4444",
    title: "Donate",
    desc: "Fund open-source development, free certifications, and education for engineers worldwide.",
    href: "/donate",
    cta: "Donate Now",
  },
  {
    icon: Globe,
    color: "#34D399",
    title: "Spread the Word",
    desc: "Star the repos, share on social media, write blog posts, or speak at conferences.",
    href: "https://github.com/embeddedos-org",
    cta: "Star on GitHub",
  },
  {
    icon: Users,
    color: "#FBBF24",
    title: "Join a Working Group",
    desc: "Join the kernel WG, AI WG, hardware WG, or documentation WG for focused collaboration.",
    href: "https://github.com/orgs/embeddedos-org/discussions",
    cta: "Find a WG",
  },
];

const stats = [
  { value: "22+", label: "Open Repositories" },
  { value: String(BOARD_COUNT), label: "Supported Boards" },
  { value: "300+", label: "Public APIs" },
  { value: "14", label: "Books Published" },
];

export default function Community() {
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
              <Users className="w-4 h-4" /> COMMUNITY
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Built by the Community
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              EmbeddedOS is built by embedded engineers from around the world.
              Every contribution — code, docs, hardware designs, or feedback —
              makes the platform better for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-bold text-orange-400">
                {s.value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ways to contribute */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              6 Ways to Contribute
            </h2>
            <p className="text-gray-400">
              Every skill set has a place in the EmbeddedOS community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ways.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: w.color + "20" }}
                >
                  <w.icon className="w-6 h-6" style={{ color: w.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {w.desc}
                </p>
                <a
                  href={w.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: w.color }}
                >
                  {w.cta} <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Community Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/*
              Every href here reads SOCIAL_URLS. This list is where the drift
              that constant exists to prevent kept reappearing: X was written
              as twitter.com while the footer and /about used x.com, and
              YouTube as youtube.com while everywhere else used www.youtube.com
              — the same account under two names, twice on one screen.
            */}
            {[
              {
                icon: Github,
                label: "GitHub",
                desc: "Issues, PRs, and Discussions",
                href: SOCIAL_URLS.github,
                color: "#fff",
              },
              {
                icon: Twitter,
                label: "X / Twitter",
                desc: "@EmbeddedOS_ORG — announcements & updates",
                href: SOCIAL_URLS.x,
                color: "#1DA1F2",
              },
              {
                icon: Instagram,
                label: "Instagram",
                desc: "@embeddedos.org — hardware, builds and events",
                href: SOCIAL_URLS.instagram,
                color: "#E4405F",
              },
              {
                icon: Youtube,
                label: "YouTube",
                desc: "Tutorials, demos, and conference talks",
                href: SOCIAL_URLS.youtube,
                color: "#FF0000",
              },
              {
                icon: MessageSquare,
                label: "GitHub Discussions",
                desc: "Q&A, show & tell, and RFC discussions",
                href: SOCIAL_URLS.discussions,
                color: "#A855F7",
              },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex items-center gap-4"
              >
                <c.icon
                  className="w-8 h-8 flex-shrink-0"
                  style={{ color: c.color }}
                />
                <div>
                  <div className="text-white font-medium">{c.label}</div>
                  <div className="text-gray-400 text-sm">{c.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Contribute?
          </h2>
          <p className="text-gray-400 mb-6">
            Start with a good-first-issue on GitHub or join the weekly community
            call.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              Get Involved <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
