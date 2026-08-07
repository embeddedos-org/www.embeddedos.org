import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Heart,
  Github,
  Globe,
  BookOpen,
  Cpu,
  Users,
  ArrowRight,
  Mail,
  Linkedin,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

const MILESTONES = [
  {
    year: "2018",
    title: "Project Inception",
    desc: "embeddedos.org domain registered and the EmbeddedOS project started — early research into a unified open-source OS for every embedded device.",
  },
  {
    year: "2020",
    title: "Kernel Architecture Research",
    desc: "Core kernel architecture and real-time scheduling research underway, targeting ARM Cortex-M and RISC-V platforms.",
  },
  {
    year: "2023",
    title: "EoS Kernel v0.1",
    desc: "First public release of the EoS real-time kernel, supporting ARM Cortex-M and RISC-V architectures.",
  },
  {
    year: "2024",
    title: "Health Devices & Patents",
    desc: "HEALTH-KEY ULTRA and HEALTH-BAND Neuro patent applications filed (U.S. App. No. 64/073,334 and 64/076,078).",
  },
  {
    year: "2024",
    title: "AeroSwift Announced",
    desc: "AeroSwift Personal and Transit VTOL aircraft platforms announced, powered by EmbeddedOS avionics stack.",
  },
  {
    year: "2025",
    title: "22 Open-Source Repos",
    desc: "Ecosystem grows to 22 public repositories covering kernel, AI, dev tools, health, aerospace, and applications.",
  },
  {
    year: "2026",
    title: "501(c)(3) Foundation",
    desc: "Embedded Operating Systems Research Foundation incorporated as a 501(c)(3) public charity (EIN: 41-4821627), effective March 11, 2026.",
  },
  {
    year: "2026",
    title: "eAI & eNI Released",
    desc: "On-device AI inference (eAI) and neural interface adapter (eNI) released, enabling edge AI on embedded hardware.",
  },
];

const TEAM_VALUES = [
  {
    icon: Globe,
    color: "#F97316",
    title: "Open by Default",
    desc: "Every line of code, every design decision, every research paper — published openly under MIT license.",
  },
  {
    icon: Cpu,
    color: "#22D3EE",
    title: "Hardware First",
    desc: "We build for real hardware. From 8-bit microcontrollers to 64-bit SoCs, EmbeddedOS runs everywhere.",
  },
  {
    icon: BookOpen,
    color: "#34D399",
    title: "Education Driven",
    desc: "14 technical books, a kids edition, and a hardware lab — we invest in the next generation of embedded engineers.",
  },
  {
    icon: Heart,
    color: "#F472B6",
    title: "Community Powered",
    desc: "A 501(c)(3) Foundation with no VC funding. Every contribution, donation, and pull request matters.",
  },
  {
    icon: Users,
    color: "#A78BFA",
    title: "Inclusive Ecosystem",
    desc: "From hobbyists to aerospace engineers, EmbeddedOS is designed for every skill level and every device.",
  },
  {
    icon: Github,
    color: "#60A5FA",
    title: "Transparent Governance",
    desc: "Public roadmap, open issues, and community RFCs. No black boxes, no hidden agendas.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              About the Foundation
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-6">
              Embedded Operating Systems{" "}
              <span className="text-gradient">Research Foundation</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              A 501(c)(3) organization dedicated to advancing open-source
              embedded systems research, education, and technology for the
              benefit of humanity.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all duration-150 active:scale-95"
              >
                Get Involved
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-150 border border-white/10"
              >
                <Heart size={16} className="text-[#F472B6]" />
                Donate
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="badge-teal mb-4 inline-flex">Our Mission</div>
              <h2 className="font-heading font-bold text-white text-3xl mb-4">
                The Operating System for Every Device
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                The Embedded Operating Systems Research Foundation was
                established to create a world where every embedded device — from
                a $2 microcontroller to a VTOL aircraft — runs on open,
                auditable, and community-maintained software.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                We believe that the software powering medical devices,
                industrial controllers, aerospace avionics, and consumer
                electronics should be transparent, secure, and accessible to
                everyone — not locked behind proprietary licenses or vendor
                lock-in.
              </p>
              <p className="text-white/60 leading-relaxed">
                As a 501(c)(3), we are accountable to our community, not to
                shareholders. Every dollar donated goes directly to research,
                development, and education.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  value: String(REPO_COUNT),
                  label: "Open-Source Repos",
                  color: "#F97316",
                },
                {
                  value: String(BOARD_COUNT),
                  label: "Supported Boards",
                  color: "#22D3EE",
                },
                { value: "300+", label: "APIs Documented", color: "#34D399" },
                { value: "14", label: "Technical Books", color: "#A78BFA" },
                { value: "60+", label: "Applications", color: "#F59E0B" },
                { value: "4", label: "Health Devices", color: "#F472B6" },
              ].map(s => (
                <div
                  key={s.label}
                  className="glass rounded-xl p-4 border border-white/5 text-center"
                >
                  <div
                    className="font-heading font-extrabold text-2xl mb-1"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="badge-purple mb-4 inline-flex">Our Values</div>
            <h2 className="font-heading font-bold text-white text-3xl">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM_VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-5 border border-white/5 card-hover"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: v.color + "20",
                      border: `1px solid ${v.color}40`,
                    }}
                  >
                    <Icon size={20} style={{ color: v.color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{v.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="badge-amber mb-4 inline-flex">History</div>
            <h2 className="font-heading font-bold text-white text-3xl">
              Our Journey
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year + m.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex gap-6 relative"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-bold text-[#F97316]">
                      {m.year}
                    </span>
                  </div>
                  <div className="glass rounded-xl p-4 border border-white/5 flex-1">
                    <div className="font-semibold text-white mb-1">
                      {m.title}
                    </div>
                    <div className="text-sm text-white/50 leading-relaxed">
                      {m.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl border border-white/10 p-8"
          >
            <div className="badge-teal mb-4 inline-flex">
              Legal & Governance
            </div>
            <h2 className="font-heading font-bold text-white text-2xl mb-4">
              Foundation Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Legal Name
                </div>
                <div className="text-white">
                  Embedded Operating Systems Research Foundation
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Tax Status
                </div>
                <div className="text-white">501(c)(3) Organization</div>
              </div>
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Software License
                </div>
                <div className="text-white">MIT License (all repositories)</div>
              </div>
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Hosting
                </div>
                <div className="text-white">Powered by InterServer</div>
              </div>
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Website
                </div>
                <div className="text-white">
                  <a
                    href="https://www.embeddedos.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] hover:underline"
                  >
                    www.embeddedos.org
                  </a>
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Contact
                </div>
                <div className="text-white">
                  <a
                    href="mailto:hello@embeddedos.org"
                    className="text-[#F97316] hover:underline"
                  >
                    hello@embeddedos.org
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social / Connect */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-white text-2xl mb-2">
              Connect With Us
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Follow the foundation across all platforms for updates, research,
              and community news.
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              {[
                {
                  icon: Github,
                  href: "https://github.com/embeddedos-org",
                  label: "GitHub",
                  color: "#F97316",
                },
                {
                  icon: Twitter,
                  href: "https://x.com/EmbeddedOS_ORG",
                  label: "X / Twitter",
                  color: "#22D3EE",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/embedded-operating-systems-research-foundation",
                  label: "LinkedIn",
                  color: "#60A5FA",
                },
                {
                  icon: Youtube,
                  href: "https://www.youtube.com/@EmbeddedOS_ORG",
                  label: "YouTube",
                  color: "#F85149",
                },
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/profile.php?id=61588978691494",
                  label: "Facebook",
                  color: "#A78BFA",
                },
                {
                  icon: Mail,
                  href: "mailto:hello@embeddedos.org",
                  label: "Email",
                  color: "#34D399",
                },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-150 text-sm font-medium"
                >
                  <Icon size={16} style={{ color }} />
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
