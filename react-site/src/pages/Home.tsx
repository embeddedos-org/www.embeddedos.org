import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Cpu, Zap, Shield, Globe, Database, Brain,
  Code2, Layers, Terminal, Smartphone, ChevronRight, Star,
  GitBranch, Package, Play
} from "lucide-react";

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

const stats = [
  { value: 14, suffix: "+", label: "Core Products", icon: Package },
  { value: 60, suffix: "+", label: "First-Party Apps", icon: Smartphone },
  { value: 24, suffix: "+", label: "Supported Boards", icon: Cpu },
  { value: 100, suffix: "%", label: "Open Source", icon: GitBranch },
];

const products = [
  { name: "EoS Kernel", slug: "eos", tagline: "Real-time embedded OS for ARM & RISC-V", icon: Cpu, category: "Core", status: "Live" },
  { name: "EAI Runtime", slug: "eai", tagline: "On-device AI inference with 12 model variants", icon: Brain, category: "AI", status: "Live" },
  { name: "eBuild SDK", slug: "ebuild", tagline: "18-command CLI for cross-compilation & signing", icon: Terminal, category: "Tooling", status: "Live" },
  { name: "EIPC", slug: "eipc", tagline: "Secure capability-based inter-process communication", icon: Shield, category: "Core", status: "Live" },
  { name: "eDB", slug: "edb", tagline: "Embedded SQL, document & key-value database", icon: Database, category: "Data", status: "Live" },
  { name: "eBowser", slug: "ebowser", tagline: "Hardware-accelerated HTML5/CSS browser engine", icon: Globe, category: "UI", status: "Beta" },
  { name: "EoStudio", slug: "eostudio", tagline: "Full IDE with 12 domain editors & code generators", icon: Code2, category: "Tooling", status: "Live" },
  { name: "eOffice", slug: "eoffice", tagline: "11-app productivity suite for embedded devices", icon: Layers, category: "Apps", status: "Beta" },
  { name: "ENI", slug: "eni", tagline: "Neural interface stack for 1024-channel BCI", icon: Zap, category: "AI", status: "Beta" },
];

const features = [
  {
    icon: Cpu,
    title: "Real-Time Kernel",
    desc: "Deterministic scheduling, sub-microsecond interrupt latency, and A/B-slotted OTA updates on ARM Cortex-M and RISC-V targets.",
  },
  {
    icon: Brain,
    title: "On-Device AI",
    desc: "EAI runtime with 12 curated model variants and ReAct agent orchestration — inference without cloud dependency.",
  },
  {
    icon: Shield,
    title: "Capability Security",
    desc: "EIPC enforces HMAC-SHA256 message authentication and fine-grained capability tokens across every component boundary.",
  },
  {
    icon: Globe,
    title: "Full Ecosystem",
    desc: "From bootloader to browser engine, database to office suite — a complete software stack for every device class.",
  },
];

const codeSnippet = `# Install eBuild CLI
pip install embeddedos-ebuild

# Create a new project
ebuild init my-project --board stm32f4

# Build, flash & monitor
cd my-project
ebuild build
ebuild flash
ebuild monitor`;

export default function Home() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid noise-bg">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.04)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)] text-[#C9A84C] text-sm font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            Open Source · Production Ready · Apache 2.0
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl lg:text-8xl text-white leading-[1.05] tracking-tight mb-6"
          >
            The Operating System
            <br />
            <span className="text-gold-gradient">for Every Device</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#888] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A modular, real-time embedded OS with AI inference, secure IPC, browser engine,
            database, office suite, and 60+ apps — from MCU to Linux-capable SoC.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/getting-started" className="btn-gold px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 justify-center">
              <Play size={18} />
              Get Started Free
            </Link>
            <Link href="/products" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 justify-center">
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-[#444] text-xs font-medium uppercase tracking-widest"
          >
            {["ARM Cortex-M", "RISC-V", "STM32F407", "ESP32", "Linux Host", "Apache 2.0"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#333]">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C44] to-transparent" />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 border-y border-[rgba(201,168,76,0.1)] bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, suffix, label, icon: Icon }) => {
              const { count, ref } = useCounter(value);
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-[#C9A84C]" />
                  </div>
                  <div className="stat-number text-4xl sm:text-5xl mb-1">
                    <span ref={ref}>{count}</span>{suffix}
                  </div>
                  <div className="text-[#555] text-sm font-medium">{label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">The Ecosystem</p>
            <h2 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-white mb-4">
              14 Products. One Stack.
            </h2>
            <p className="text-[#666] text-lg max-w-2xl mx-auto">
              Every component is designed to work together — from kernel to cloud, from bootloader to browser.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link href={`/products/${product.slug}`}>
                  <div
                    className="glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 group h-full"
                    onMouseEnter={() => setActiveProduct(product.slug)}
                    onMouseLeave={() => setActiveProduct(null)}
                    style={{
                      transform: activeProduct === product.slug ? "translateY(-4px)" : "none",
                      boxShadow: activeProduct === product.slug ? "0 20px 60px rgba(201,168,76,0.12)" : "none",
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center group-hover:bg-[rgba(201,168,76,0.18)] transition-colors">
                        <product.icon size={20} className="text-[#C9A84C]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${product.status === "Live" ? "bg-[rgba(201,168,76,0.1)] text-[#C9A84C] border border-[rgba(201,168,76,0.25)]" : "bg-[rgba(255,255,255,0.05)] text-[#666] border border-[rgba(255,255,255,0.1)]"}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-['Playfair_Display'] font-semibold text-lg text-white mb-2 group-hover:text-[#E8C97A] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[#555] text-sm leading-relaxed mb-4">{product.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#444] uppercase tracking-wider">{product.category}</span>
                      <ChevronRight size={16} className="text-[#333] group-hover:text-[#C9A84C] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* View all card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: products.length * 0.05 }}
            >
              <Link href="/products">
                <div className="rounded-2xl p-6 border border-dashed border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)] cursor-pointer transition-all duration-300 group h-full flex flex-col items-center justify-center text-center min-h-[160px]">
                  <div className="w-11 h-11 rounded-xl border border-[rgba(201,168,76,0.2)] flex items-center justify-center mb-3 group-hover:border-[rgba(201,168,76,0.5)] transition-colors">
                    <ArrowRight size={20} className="text-[#444] group-hover:text-[#C9A84C] transition-colors" />
                  </div>
                  <p className="text-[#555] text-sm group-hover:text-[#C9A84C] transition-colors font-medium">
                    View All 14 Products
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-[#050505] border-y border-[rgba(201,168,76,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: features list */}
            <div>
              <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Why EmbeddedOS</p>
              <h2 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-white mb-8 leading-tight">
                Built for the
                <br />
                <span className="text-gold-gradient">Edge of Computing</span>
              </h2>
              <div className="space-y-6">
                {features.map(({ icon: Icon, title, desc }) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={18} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{title}</h3>
                      <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: code snippet */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.2)] gold-glow">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-[rgba(255,255,255,0.06)]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-[#444] text-xs font-mono">ebuild — terminal</span>
                </div>
                {/* Code */}
                <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto bg-[#0a0a0a]">
                  {codeSnippet.split("\n").map((line, i) => (
                    <div key={i} className={line.startsWith("#") ? "text-[#555]" : line.startsWith("pip") || line.startsWith("ebuild") || line.startsWith("cd") ? "text-[#C9A84C]" : "text-[#888]"}>
                      {line || "\u00A0"}
                    </div>
                  ))}
                </pre>
              </div>
              {/* Glow decoration */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── QUICK START ─── */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Open Source</p>
            <h2 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl text-white mb-6">
              Community-First,
              <br />
              <span className="text-gold-gradient">Foundation-Governed</span>
            </h2>
            <p className="text-[#666] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              EmbeddedOS is governed as an open-source foundation — transparent, community-driven,
              and committed to long-term maintainability. Inspired by Apache, OSI, and Mozilla.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2"
              >
                <Star size={18} />
                Star on GitHub
              </a>
              <Link href="/organization" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2">
                Our Organization
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HIRING TEASER ─── */}
      <section className="py-20 bg-[#050505] border-t border-[rgba(201,168,76,0.1)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <span className="badge bg-[rgba(201,168,76,0.1)] text-[#C9A84C] border border-[rgba(201,168,76,0.25)] mb-6 inline-block">
                We're Hiring
              </span>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl text-white mb-4">
                Build the Future of Embedded Systems
              </h2>
              <p className="text-[#666] text-lg mb-8 max-w-xl mx-auto">
                Join a world-class team building open-source embedded OS infrastructure. Remote-first, mission-driven, equity-eligible.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {["Kernel Engineering", "AI Runtime", "IDE & Tooling", "Hardware Lab", "Research"].map((role) => (
                  <span key={role} className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#666] text-sm">
                    {role}
                  </span>
                ))}
              </div>
              <Link href="/careers" className="btn-gold px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2">
                View Open Positions
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
