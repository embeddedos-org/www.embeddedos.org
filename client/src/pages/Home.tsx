import React, { Suspense, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import {
  ArrowRight,
  Github,
  Star,
  Cpu,
  Zap,
  MessageSquare,
  Shield,
  Network,
  Package,
  Database,
  Globe,
  FileText,
  Gamepad2,
  FlaskConical,
  Heart,
  Code,
  Layers,
  ChevronRight,
  Terminal,
  Wifi,
  Lock,
  BarChart3,
  Plane,
  Bot,
  Factory,
  Lightbulb,
  Building2,
  Microscope,
  Leaf,
  ShieldAlert,
  Smartphone,
  Pickaxe,
  Telescope,
  Bolt,
  Radio,
} from "lucide-react";

gsap.registerPlugin();

const CircuitHero = React.lazy(() => import("../components/CircuitHero"));
const ProductMarquee = React.lazy(() => import("../components/ProductMarquee"));
const BootPipeline = React.lazy(() => import("../components/BootPipeline"));
const HealthShowcase = React.lazy(() => import("../components/HealthShowcase"));
const ParticleField = React.lazy(() => import("../components/ParticleField"));

const HERO_IMG = "/manus-storage/hero-background_1bafea1c.jpg";
const ARCH_IMG = "/manus-storage/architecture-diagram-hero_72436b3f.jpg";
const COMMUNITY_IMG = "/manus-storage/community-illustration-eos_6f39c9db.jpg";
const OPEN_SOURCE_IMG = "/manus-storage/what-we-do-illustration_4c2ad2f7.jpg";

const STATS = [
  { value: REPO_COUNT, label: "Repositories", suffix: "", color: "#F97316" },
  { value: BOARD_COUNT, label: "Boards", suffix: "", color: "#22D3EE" },
  { value: 300, label: "APIs", suffix: "+", color: "#A78BFA" },
  { value: 60, label: "Apps", suffix: "+", color: "#34D399" },
  { value: 4, label: "Health Devices", suffix: "", color: "#F59E0B" },
  { value: 14, label: "Books", suffix: "", color: "#60A5FA" },
];

const MISSION_PILLARS = [
  {
    icon: Code,
    color: "#F97316",
    title: "Open-source software, permanently free",
    desc: "The kernel, bootloader, drivers, build tools, and every application we ship are MIT licensed and developed in public on GitHub. No paid tiers, no license fees, no vendor lock-in.",
  },
  {
    icon: Lightbulb,
    color: "#22D3EE",
    title: "Free education for engineers and students",
    desc: "14 full-length technical books, a 300+ API reference, free certification exams, a Kids Edition for classrooms, and paid internships for students and new graduates — all at no cost to learners.",
  },
  {
    icon: Microscope,
    color: "#A78BFA",
    title: "Public-benefit research",
    desc: "We publish our research openly, including patent filings for health-monitoring hardware, so that clinicians, universities, and other nonprofits can build on the work rather than license it.",
  },
];

const PRODUCTS = [
  {
    name: "EOS Kernel",
    desc: "The core real-time operating system kernel with sub-microsecond latency and deterministic scheduling.",
    icon: Cpu,
    color: "#F97316",
    tag: "Core",
  },
  {
    name: "eBoot",
    desc: "Secure, verified bootloader with hardware attestation, rollback protection, and OTA update support.",
    icon: Zap,
    color: "#22D3EE",
    tag: "Security",
  },
  {
    name: "EIPC",
    desc: "High-performance inter-process communication with zero-copy message passing and typed channels.",
    icon: MessageSquare,
    color: "#A78BFA",
    tag: "Platform",
  },
  {
    name: "eAI Edge",
    desc: "On-device AI inference runtime supporting TensorFlow Lite, ONNX, and custom neural network models.",
    icon: FlaskConical,
    color: "#34D399",
    tag: "AI",
  },
  {
    name: "eSec",
    desc: "Comprehensive security and cryptography layer with hardware security module integration.",
    icon: Shield,
    color: "#F59E0B",
    tag: "Security",
  },
  {
    name: "eNet",
    desc: "Full networking stack supporting TCP/IP, MQTT, CoAP, and custom embedded protocols.",
    icon: Network,
    color: "#60A5FA",
    tag: "Network",
  },
  {
    name: "eApps",
    desc: "60+ curated embedded applications covering productivity, monitoring, and system management.",
    icon: Package,
    color: "#F97316",
    tag: "Apps",
  },
  {
    name: "eDB",
    desc: "Lightweight embedded database with SQL support, optimized for flash storage and low RAM.",
    icon: Database,
    color: "#22D3EE",
    tag: "Data",
  },
  {
    name: "eBrowser",
    desc: "Minimal web browser engine for embedded displays with CSS and JavaScript support.",
    icon: Globe,
    color: "#A78BFA",
    tag: "UI",
  },
  {
    name: "eOffice",
    desc: "11 office applications including document editor, spreadsheet, and presentation tools.",
    icon: FileText,
    color: "#34D399",
    tag: "Apps",
  },
  {
    name: "Kids Edition",
    desc: "Educational embedded OS platform with interactive learning modules and parental controls.",
    icon: Gamepad2,
    color: "#F59E0B",
    tag: "Education",
  },
  {
    name: "eFlow",
    desc: "Visual programming environment for embedded systems with drag-and-drop logic blocks.",
    icon: Zap,
    color: "#60A5FA",
    tag: "Dev Tools",
  },
];

const HEALTH_PRODUCTS = [
  {
    name: "HEALTH-KEY ULTRA",
    desc: "USB-C pendrive with ECG, SpO₂, BAC breath, temperature, UV index and IMU. Patent Pending #64/073,334.",
    icon: Lock,
    color: "#F85149",
  },
  {
    name: "HEALTH-BAND Neuro",
    desc: "sEMG gesture control + TENS therapy wristband with full biometric monitoring. Patent Pending #64/076,078.",
    icon: BarChart3,
    color: "#F59E0B",
  },
  {
    name: "HEALTH-RING",
    desc: "Titanium smart ring with ECG, HbA1c estimation, cuffless blood pressure, and 14-day sleep staging.",
    icon: Heart,
    color: "#A78BFA",
  },
  {
    name: "HEALTH-LAB",
    desc: "14-day biosensor patch monitoring glucose, lactate, cortisol, electrolytes, uric acid, and pH.",
    icon: Heart,
    color: "#34D399",
  },
];

const FEATURES = [
  {
    icon: Terminal,
    title: "Real-Time Performance",
    desc: "Sub-microsecond interrupt latency with deterministic scheduling for mission-critical applications.",
  },
  {
    icon: Lock,
    title: "Security First",
    desc: "Hardware-backed security, secure boot, and encrypted storage built into every layer.",
  },
  {
    icon: Wifi,
    title: "Universal Connectivity",
    desc: "WiFi, Bluetooth, Ethernet, CAN bus, and custom protocol support out of the box.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    desc: "300+ APIs, comprehensive docs, 14 technical books, and an active open-source community.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    desc: "Use only what you need — from bare-metal kernel to full application stack.",
  },
  {
    icon: BarChart3,
    title: "Production Ready",
    desc: `Board definitions for ${BOARD_COUNT} targets spanning automotive, industrial, and IoT hardware.`,
  },
];

function StatCounter({
  value,
  suffix,
  color,
}: {
  value: number;
  suffix: string;
  color: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * end);
      if (ref.current) ref.current.textContent = start.toString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [inView, value]);

  return (
    <span>
      <span ref={ref} style={{ color }}>
        0
      </span>
      <span style={{ color }}>{suffix}</span>
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!heroTextRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-actions",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ".hero-image",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8 },
          "-=0.5"
        );
    },
    { scope: heroRef }
  );

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-grid"
        aria-labelledby="hero-heading"
      >
        {/* Three.js Circuit Board */}
        <Suspense fallback={null}>
          <CircuitHero />
        </Suspense>
        {/* Particle field */}
        <Suspense fallback={null}>
          <ParticleField count={45} />
        </Suspense>

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A78BFA]/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div ref={heroTextRef}>
              <div className="hero-badge badge-amber mb-6 inline-flex opacity-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                Foundation · 501(c)(3) · MIT License
              </div>

              <h1
                id="hero-heading"
                className="hero-title font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 opacity-0"
              >
                The Operating System{" "}
                <span className="text-gradient">for Every Device</span>
              </h1>

              <p className="hero-subtitle text-lg text-white/60 leading-relaxed mb-8 max-w-lg opacity-0">
                The Embedded Operating Systems Research Foundation is a
                501(c)(3) nonprofit. We build a free, open-source operating
                system for embedded devices — and give away the tools,
                documentation, and training that engineers, students, and
                researchers need to use it.
              </p>

              <div className="hero-actions flex flex-wrap gap-3 opacity-0">
                <Link
                  href="/getting-started"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl btn-press glow-amber"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press"
                >
                  <Heart size={18} className="text-[#F472B6]" />
                  Support Our Mission
                </Link>
                <a
                  href="https://github.com/embeddedos-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press"
                >
                  <Github size={18} />
                  View on GitHub
                  <Star size={14} className="text-[#F97316]" />
                </a>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-6 mt-10">
                {STATS.slice(0, 3).map(s => (
                  <div key={s.label}>
                    <div className="font-heading font-extrabold text-2xl">
                      <StatCounter
                        value={s.value}
                        suffix={s.suffix}
                        color={s.color}
                      />
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="hero-image opacity-0 relative">
              <div className="relative rounded-2xl overflow-hidden glow-amber">
                <img
                  src={HERO_IMG}
                  alt="EmbeddedOS running across multiple devices"
                  className="w-full h-auto object-cover rounded-2xl"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/60 to-transparent rounded-2xl" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-white/10 animate-float">
                <div className="text-xs text-white/50 mb-0.5">
                  Supported Boards
                </div>
                <div className="font-heading font-bold text-[#22D3EE] text-lg">
                  {BOARD_COUNT}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 border border-white/10 animate-float-delayed">
                <div className="text-xs text-white/50 mb-0.5">Foundation</div>
                <div className="font-heading font-bold text-[#F97316] text-lg">
                  MIT License
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT MARQUEE ── */}
      <div className="py-6 border-y border-white/5 bg-[#060A14] overflow-hidden">
        <div className="text-center mb-3">
          <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-mono">
            EmbeddedOS Ecosystem
          </span>
        </div>
        <Suspense fallback={null}>
          <ProductMarquee />
        </Suspense>
      </div>

      {/* ── STATS BAR ── */}
      <section
        className="py-14 border-y border-white/[0.06] bg-[#080F1E] relative overflow-hidden"
        aria-label="Key statistics"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 bg-[#F97316]/5 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center group"
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 mx-auto transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `${stat.color}18`,
                    border: `1px solid ${stat.color}35`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: stat.color }}
                  />
                </div>
                <div className="font-heading font-extrabold text-3xl mb-1">
                  <StatCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    color={stat.color}
                  />
                </div>
                <div className="text-xs text-white/40 font-medium tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="section-padding" aria-labelledby="mission-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="badge-amber mb-4 inline-flex">
              <Heart size={12} />
              Our Mission
            </div>
            <h2
              id="mission-heading"
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-5"
            >
              Embedded computing should be{" "}
              <span className="text-gradient">
                free to learn and free to build on
              </span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              The Embedded Operating Systems Research Foundation is a 501(c)(3)
              public charity (EIN 41-4821627). We exist to advance open-source
              embedded systems research, education, and technology for the
              public benefit — accountable to our community, not to
              shareholders. Every line of code we publish is MIT licensed and
              free, forever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {MISSION_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-2xl p-6 border border-white/5 card-hover"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `${pillar.color}20`,
                      border: `1px solid ${pillar.color}40`,
                    }}
                  >
                    <Icon size={22} style={{ color: pillar.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl btn-press"
            >
              <Heart size={16} />
              Make a Tax-Deductible Donation
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press"
            >
              Volunteer or Contribute
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/mission"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press"
            >
              Our Mission &amp; Scope
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press"
            >
              About the Foundation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section className="section-padding" aria-labelledby="arch-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="badge-teal mb-4 inline-flex">
              System Architecture
            </div>
            <h2
              id="arch-heading"
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4"
            >
              Built Layer by Layer
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              From silicon to application, every layer of EmbeddedOS is designed
              for reliability, security, and developer experience.
            </p>
          </motion.div>

          {/* Animated boot pipeline */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="rounded-2xl overflow-hidden border border-white/10 p-8 glass"
          >
            <Suspense
              fallback={
                <div className="h-32 flex items-center justify-center text-white/20 text-sm">
                  Loading pipeline...
                </div>
              }
            >
              <BootPipeline />
            </Suspense>
          </motion.div>
          {/* Architecture image below */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="rounded-2xl overflow-hidden border border-white/10 mt-8"
          >
            <img
              src={ARCH_IMG}
              alt="EmbeddedOS architecture diagram showing Hardware, Kernel, Platform, and Application layers"
              className="w-full h-auto"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section
        className="section-padding bg-[#080F1E]"
        aria-labelledby="products-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="badge-amber mb-4 inline-flex">
              22 Repos · 60+ Apps
            </div>
            <h2
              id="products-heading"
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4"
            >
              The Complete Embedded Ecosystem
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Every component you need to build, deploy, and manage embedded
              systems at any scale.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PRODUCTS.map((product, i) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i % 8}
                  className="group relative glass-card rounded-2xl p-5 overflow-hidden cursor-default"
                >
                  {/* Hover glow border */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 1px ${product.color}40, 0 0 30px ${product.color}08`,
                    }}
                  />
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: `${product.color}20`,
                        border: `1px solid ${product.color}40`,
                      }}
                    >
                      <Icon size={20} style={{ color: product.color }} />
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${product.color}20`,
                        color: product.color,
                      }}
                    >
                      {product.tag}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm mb-1.5 group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed group-hover:text-white/65 transition-colors">
                    {product.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="text-center mt-10"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-150 border border-white/10"
              >
                All 22 Projects
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/eapps"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-150 border border-white/10"
              >
                All 60+ Apps
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HEALTH PRODUCTS ── */}
      <section className="section-padding" aria-labelledby="health-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="badge-amber mb-4 inline-flex">
              <Heart size={12} />
              Health Technology
            </div>
            <h2
              id="health-heading"
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4"
            >
              4 Health Devices · 2 Patents Pending
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Open-source medical-grade hardware covering ~95% of all clinically
              relevant health metrics.
            </p>
          </motion.div>

          {/* Interactive health device showcase */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <Suspense
              fallback={
                <div className="h-64 glass rounded-2xl flex items-center justify-center text-white/20">
                  Loading showcase...
                </div>
              }
            >
              <HealthShowcase />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ── eCAD HARDWARE CATEGORIES ── */}
      <section
        className="section-padding bg-[#080F1E]"
        aria-labelledby="hardware-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="badge-cyan mb-4 inline-flex">
              <Cpu size={12} />
              Open Hardware
            </div>
            <h2
              id="hardware-heading"
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4"
            >
              eCAD Hardware ·{" "}
              <span className="text-gradient">15 Product Categories</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Open-source KiCad hardware designs for every industry — all
              running EmbeddedOS. From aerospace flight computers to smart city
              sensors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {(
              [
                {
                  Icon: Heart,
                  label: "eHealth365",
                  color: "#EF4444",
                  href: "/health",
                },
                {
                  Icon: Radio,
                  label: "eRadar360",
                  color: "#F97316",
                  href: "/eradar360",
                },
                {
                  Icon: Plane,
                  label: "eAerospace",
                  color: "#22D3EE",
                  href: "/aerospace",
                },
                {
                  Icon: Bot,
                  label: "eRobotics",
                  color: "#A78BFA",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Factory,
                  label: "eIndustrial",
                  color: "#34D399",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Bolt,
                  label: "eEnergy",
                  color: "#F59E0B",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Building2,
                  label: "eSmart City",
                  color: "#60A5FA",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Microscope,
                  label: "eMedical",
                  color: "#F472B6",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Leaf,
                  label: "eAgriTech",
                  color: "#10B981",
                  href: "/ecad-hardware",
                },
                {
                  Icon: ShieldAlert,
                  label: "eDefense",
                  color: "#6B7280",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Smartphone,
                  label: "eConsumer",
                  color: "#8B5CF6",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Lightbulb,
                  label: "eElectronics",
                  color: "#FBBF24",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Pickaxe,
                  label: "eMining",
                  color: "#78716C",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Lock,
                  label: "eCyberSec",
                  color: "#06B6D4",
                  href: "/ecad-hardware",
                },
                {
                  Icon: Telescope,
                  label: "Future Designs",
                  color: "#C084FC",
                  href: "/ecad-hardware",
                },
              ] as {
                Icon: React.ComponentType<{
                  size?: number;
                  style?: React.CSSProperties;
                }>;
                label: string;
                color: string;
                href: string;
              }[]
            ).map((cat, i) => (
              <motion.div
                key={cat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.05}
              >
                <Link
                  href={cat.href}
                  className="glass-card rounded-xl p-4 flex flex-col items-center gap-2.5 group block"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `${cat.color}18`,
                      border: `1px solid ${cat.color}35`,
                    }}
                  >
                    <cat.Icon size={18} style={{ color: cat.color }} />
                  </div>
                  <span className="text-white/70 text-xs font-semibold text-center group-hover:text-white transition-colors">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/ecad-hardware"
              className="inline-flex items-center gap-2 text-[#22D3EE] font-semibold text-sm hover:text-white transition-colors"
            >
              View All eCAD Hardware Products
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        className="section-padding bg-[#080F1E]"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">
              Why EmbeddedOS?
            </p>
            <h2
              id="features-heading"
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4"
            >
              The Operating System{" "}
              <span className="text-gradient">for Every Device</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Built by embedded engineers, for any embedded hardware. Every
              design decision prioritizes reliability, security, and developer
              experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="group relative flex gap-4 p-5 glass-card rounded-2xl overflow-hidden"
                >
                  {/* Numbered accent */}
                  <div className="absolute top-4 right-4 font-heading font-extrabold text-4xl text-white/[0.04] select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                    <Icon size={20} className="text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-sm mb-1">
                      {f.title}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed group-hover:text-white/65 transition-colors">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="section-padding" aria-labelledby="community-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="badge-teal mb-4 inline-flex">
                Foundation Community
              </div>
              <h2
                id="community-heading"
                className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-6"
              >
                Built by the Community,{" "}
                <span className="text-gradient">for the Community</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                EmbeddedOS is a 501(c)(3), community-driven project — built by
                embedded engineers, for any embedded hardware. Every line of
                code, every document, and every tool prioritizes reliability,
                security, and developer experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/get-involved"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-xl transition-all duration-150 active:scale-95 text-sm"
                >
                  <Heart size={16} />
                  Get Involved
                </Link>
                <a
                  href="https://github.com/embeddedos-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-150 text-sm border border-white/10"
                >
                  <Github size={16} />
                  Star on GitHub
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={COMMUNITY_IMG}
                alt="Global EmbeddedOS developer community"
                className="w-full h-auto rounded-2xl"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OPEN SOURCE BANNER ── */}
      <section
        className="section-padding bg-[#080F1E]"
        aria-label="Open source mission"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden relative"
          >
            <img
              src={OPEN_SOURCE_IMG}
              alt="Open Minds, Open Code, Open Future"
              className="w-full h-auto rounded-2xl"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Gradient border card */}
            <div
              className="relative rounded-3xl p-px mb-10"
              style={{
                background:
                  "linear-gradient(135deg, #F97316, #A78BFA, #22D3EE)",
              }}
            >
              <div className="rounded-3xl bg-[#080F1E] px-8 py-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-bold mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                  Open Source · 501(c)(3) · MIT License
                </div>
                <h2
                  id="cta-heading"
                  className="font-heading font-extrabold text-3xl sm:text-5xl text-white mb-6"
                >
                  Ready to build on{" "}
                  <span className="text-gradient">EmbeddedOS?</span>
                </h2>
                <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                  Join engineers building the next generation of embedded
                  systems. Free, Foundation-backed, and 501(c)(3) forever.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/getting-started"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl btn-press text-lg glow-amber"
                  >
                    Start Building
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press text-lg border border-white/10"
                  >
                    Read the Docs
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
