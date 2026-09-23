import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Cpu,
  Zap,
  Brain,
  Network,
  Package,
  Monitor,
  Globe,
  Layers,
  Shield,
  Activity,
  Code2,
  HardDrive,
  Wifi,
  ChevronRight,
  ArrowRight,
  Rocket,
  Factory,
  Heart,
  Car,
  Plane,
  Bot,
  Building2,
  Leaf,
  Microscope,
  type LucideIcon,
} from "lucide-react";
import { BOARD_COUNT, REPO_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import {
  ARCHITECTURE_STAGES,
  MATURITY_STATUSES,
  type ArchitectureStageId,
} from "@/data/architecture";

const STAGE_ICONS: Record<ArchitectureStageId, LucideIcon> = {
  "hardware-sensors": Cpu,
  "secure-boot": Shield,
  "eos-kernel-drivers": Layers,
  "ipc-data-storage": Network,
  applications: Monitor,
  "on-device-ai": Brain,
  "physical-action-feedback": Activity,
};

const USE_CASES = [
  {
    icon: Heart,
    color: "#EF4444",
    title: "Healthcare & Wearables",
    desc: "HEALTH-KEY ULTRA and HEALTH-BAND Neuro are in-development reference designs. The proposed stack combines EoS, configuration-specific ENI acquisition, EAI research models, encrypted local data, and a planned companion app; clinical validation is pending.",
    products: ["EoS", "ENI", "EAI", "eDB", "eServiceApps"],
    href: "/health",
  },
  {
    icon: Plane,
    color: "#22D3EE",
    title: "Aerospace & UAV",
    desc: "AeroSwift Personal is a concept aircraft and software reference architecture. The design combines EoS, an ARINC-429 HAL target, eBoot, EIPC, and EoSim; it has not been flight-tested or certified.",
    products: ["EoS", "eBoot", "EIPC", "EoSim"],
    href: "/aerospace",
  },
  {
    icon: Car,
    color: "#F97316",
    title: "Automotive & ADAS",
    desc: "eRadar360 Aegis One is a design-stage reference architecture combining radar, camera, and V2X inputs with experimental EAI detection, EIPC data paths, and an eBuild target for NXP S32K344. Performance, partitioning, and end-to-end integration remain validation targets.",
    products: ["EoS", "EAI", "EIPC", "eBuild"],
    href: "/eradar360",
  },
  {
    icon: Factory,
    color: "#34D399",
    title: "Industrial & IIoT",
    desc: "EoS targets IEC 61131-3 PLCs and Modbus gateways. eDB stores time-series sensor data with AES-256 encryption. EIPC bridges OT and IT networks securely. eFlow provides a visual node editor for industrial automation logic without writing C.",
    products: ["EoS", "eDB", "EIPC", "eFlow"],
    href: "/ecad-hardware",
  },
  {
    icon: Bot,
    color: "#A78BFA",
    title: "Robotics & Cobots",
    desc: "This reference scenario explores EoS servo control, ENI sEMG input, on-device EAI models, and EoStudio-assisted configuration. Individual elements carry separate maturity labels and require system-specific validation.",
    products: ["EoS", "ENI", "EAI", "EoStudio"],
    href: "/ecad-hardware",
  },
  {
    icon: Building2,
    color: "#60A5FA",
    title: "Smart City & Infrastructure",
    desc: `EoS runs on smart meters, traffic controllers, and 5G gateways. eDB stores utility telemetry. EIPC routes data between city subsystems. eFlow visualises sensor pipelines. EoSim validates firmware for ${SIM_PLATFORM_COUNT} virtual platforms before deployment.`,
    products: ["EoS", "eDB", "EIPC", "eFlow", "EoSim"],
    href: "/ecad-hardware",
  },
  {
    icon: Microscope,
    color: "#F59E0B",
    title: "Medical Devices",
    desc: "The medical research stack targets IEC 60601-1 design requirements. ENI channel count and sample rate are configuration-specific; BCI, neurofeedback, seizure-pattern classification, and regulated patient-data use all require separate validation and approval.",
    products: ["EoS", "ENI", "EAI", "eDB"],
    href: "/ecad-hardware",
  },
  {
    icon: Leaf,
    color: "#10B981",
    title: "Energy & CleanTech",
    desc: "EoS runs on BMS controllers and solar inverters. eDB stores energy telemetry and grid state. EIPC routes data between battery packs and inverter controllers. EoSim validates firmware for energy hardware before deployment.",
    products: ["EoS", "eDB", "EIPC", "EoSim"],
    href: "/ecad-hardware",
  },
];

const PRODUCT_NUMBERS = [
  { value: String(REPO_COUNT), label: "GitHub Repos" },
  { value: String(BOARD_COUNT), label: "Supported Boards" },
  { value: "300+", label: "Public APIs" },
  { value: "43", label: "eApps" },
  { value: "13", label: "Product Lines" },
  { value: "15", label: "Hardware Categories" },
];

function AnimatedStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="w-full max-w-5xl mx-auto">
      <ol className="space-y-3" aria-label="Architecture stages by maturity">
        {ARCHITECTURE_STAGES.map((stage, index) => {
          const StageIcon = STAGE_ICONS[stage.id];
          return (
            <motion.li
              key={stage.id}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="rounded-xl border px-5 py-4"
              style={{
                background: `${stage.color}0D`,
                borderColor: `${stage.color}40`,
              }}
            >
              <div className="flex flex-wrap items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${stage.color}1A`, color: stage.color }}
                >
                  <StageIcon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-white/35">
                      STAGE 0{index + 1}
                    </span>
                    <h3 className="font-bold text-white">{stage.label}</h3>
                    <span
                      className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                      style={{
                        borderColor: `${stage.color}66`,
                        color: stage.color,
                      }}
                    >
                      {stage.maturity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    {stage.description}
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-white/45">
                    {stage.products.join(" · ")}
                  </p>
                </div>
                <Link
                  href={stage.href}
                  className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-semibold"
                  style={{ color: stage.color }}
                >
                  Project detail <ArrowRight size={12} />
                </Link>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function UseCaseCard({
  uc,
  index,
}: {
  uc: (typeof USE_CASES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: (index % 4) * 0.08,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="rounded-2xl border p-6 flex flex-col gap-4 hover:border-white/20 transition-colors group"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${uc.color}20` }}
        >
          <uc.icon size={24} style={{ color: uc.color }} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">
            {uc.title}
          </h3>
        </div>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{uc.desc}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {uc.products.map(p => (
          <span
            key={p}
            className="text-[11px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: `${uc.color}15`,
              color: uc.color,
              border: `1px solid ${uc.color}30`,
            }}
          >
            {p}
          </span>
        ))}
      </div>
      <Link href={uc.href}>
        <div
          className="flex items-center gap-1 text-xs font-semibold mt-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: uc.color }}
        >
          Learn more<span className="sr-only"> about {uc.title}</span>{" "}
          <ArrowRight size={12} />
        </div>
      </Link>
    </motion.div>
  );
}

export default function WhatWeDo() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative pt-28 pb-20 px-6 overflow-hidden"
      >
        <img
          loading="lazy"
          decoding="async"
          src="/media/what-we-do-illustration_4c2ad2f7.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none"
        />
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient orbs */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #22D3EE, transparent)",
          }}
        />
        <div
          className="absolute top-40 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #A78BFA, transparent)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{
                background: "rgba(34,211,238,0.1)",
                borderColor: "rgba(34,211,238,0.3)",
                color: "#22D3EE",
              }}
            >
              <Layers size={12} /> FOUNDATION · 501(C)(3) · MIT LICENSE
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              What{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #22D3EE, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                EmbeddedOS
              </span>{" "}
              Does
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-6">
              We build open-source embedded-system projects spanning secure
              boot, a real-time OS, communications, applications, developer
              tools, on-device AI, and longer-term artificial general
              intelligence (AGI) research. Each architecture stage below is
              labeled by its current maturity; no achieved AGI system is
              claimed.
            </p>
            <p className="mb-10 text-sm text-cyan-300/80">
              The architecture below is an illustrative reference, not a claim
              that every stage is available as one production system.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/getting-started">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-xl font-bold text-white flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE, #0EA5E9)",
                  }}
                >
                  Get Started <ChevronRight size={18} />
                </motion.button>
              </Link>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-xl font-bold border flex items-center gap-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  All Products <Layers size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="border-y py-8 px-6"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6">
          {PRODUCT_NUMBERS.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="text-center"
            >
              <div
                className="text-3xl font-black"
                style={{
                  color: [
                    "#22D3EE",
                    "#34D399",
                    "#A78BFA",
                    "#F97316",
                    "#FBBF24",
                    "#F472B6",
                  ][i],
                }}
              >
                {n.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{n.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full Stack Architecture */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Architecture by Maturity
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Seven stages describe a possible path from sensing to physical
              feedback. Available projects, research, plans, and concepts are
              shown separately so the reference view does not imply uniform
              readiness.
            </p>
          </div>
          <ul
            className="mb-10 flex flex-wrap justify-center gap-2"
            aria-label="Approved maturity labels"
          >
            {MATURITY_STATUSES.map(status => (
              <li
                key={status}
                className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-white/65"
              >
                {status}
              </li>
            ))}
          </ul>
          <AnimatedStackDiagram />
        </div>
      </section>

      {/* What We Build — product families */}
      <section
        className="py-20 px-6"
        style={{ background: "rgba(255,255,255,0.01)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              What We Build
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Project families that can be evaluated separately or composed for
              device prototypes across microcontroller and application-processor
              targets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                color: "#22D3EE",
                title: "EoS + eBoot",
                sub: "OS Foundation",
                desc: "Real-time kernel with 33 HAL peripherals, 41 product profiles, SMP/AMP multicore. Secure bootloader with A/B slots, Ed25519 signing, and measured boot.",
                href: "/eos",
                cta: "Explore EoS",
              },
              {
                icon: Brain,
                color: "#A78BFA",
                title: "EAI + ENI",
                sub: "Intelligence",
                desc: "On-device AI, configurable neural-interface research, and longer-term AGI-enabling research. Model and acquisition limits depend on the named hardware configuration; no achieved AGI system is claimed.",
                href: "/eai",
                cta: "Explore EAI",
              },
              {
                icon: Network,
                color: "#34D399",
                title: "EIPC + eDB",
                sub: "Data & Comms",
                desc: "Capability-secured inter-process communication with HMAC-SHA256 and zero-copy shared memory. Multi-model database with SQL, document, and key-value stores.",
                href: "/eipc",
                cta: "Explore EIPC",
              },
              {
                icon: Monitor,
                color: "#F97316",
                title: "eOffice + eApps",
                sub: "Applications",
                desc: "11-app office suite with real-time CRDT collaboration. 43 cross-platform apps in C+LVGL covering productivity, media, games, and connectivity.",
                href: "/eoffice",
                cta: "Explore eOffice",
              },
              {
                icon: Code2,
                color: "#FBBF24",
                title: "EoStudio + EoSim",
                sub: "Developer Tools",
                desc: `Full IDE with board picker, HAL configurator, and AI tutor. Simulate firmware on ${SIM_PLATFORM_COUNT} virtual platforms with QEMU, Renode, and HIL bridge.`,
                href: "/eostudio",
                cta: "Explore EoStudio",
              },
              {
                icon: Package,
                color: "#F472B6",
                title: "eBuild + eFlow",
                sub: "Build System",
                desc: "18-command cross-compilation CLI targeting ARM, x86, and RISC-V. Visual node editor for sensor pipelines and automation logic without writing C.",
                href: "/ebuild",
                cta: "Explore eBuild",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border p-6 flex flex-col gap-4 group cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}20` }}
                  >
                    <card.icon size={22} style={{ color: card.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-white">{card.title}</div>
                    <div className="text-xs" style={{ color: card.color }}>
                      {card.sub}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {card.desc}
                </p>
                <Link href={card.href}>
                  <div
                    className="flex items-center gap-1 text-sm font-semibold py-0.5 transition-opacity"
                    style={{ color: card.color }}
                  >
                    {card.cta} <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Industry Use Cases
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These reference scenarios show where projects may compose across
              device categories. They mix available work, research, and planned
              integrations rather than representing end-to-end shipped systems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {USE_CASES.map((uc, i) => (
              <UseCaseCard key={uc.title} uc={uc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Products */}
      <section
        className="py-20 px-6"
        style={{ background: "rgba(255,255,255,0.01)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Hardware Design Portfolio
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              CAD and hardware references span health, aerospace, industrial,
              and other device concepts. Their availability and validation vary
              by design.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                icon: Heart,
                color: "#EF4444",
                label: "Health",
                sub: "4 wearables",
                href: "/health",
              },
              {
                icon: Plane,
                color: "#22D3EE",
                label: "Aerospace",
                sub: "Aircraft, UAV, Space",
                href: "/aerospace",
              },
              {
                icon: Car,
                color: "#F97316",
                label: "Transport",
                sub: "ADAS, Rail, Maritime",
                href: "/eradar360",
              },
              {
                icon: Bot,
                color: "#A78BFA",
                label: "Robotics",
                sub: "Arms, AMR, Cobots",
                href: "/ecad-hardware",
              },
              {
                icon: Factory,
                color: "#34D399",
                label: "Industrial",
                sub: "PLCs, Sensors, HMI",
                href: "/ecad-hardware",
              },
              {
                icon: Leaf,
                color: "#10B981",
                label: "Energy",
                sub: "BMS, Solar, Grid",
                href: "/ecad-hardware",
              },
              {
                icon: Building2,
                color: "#60A5FA",
                label: "Smart City",
                sub: "Traffic, Utilities, 5G",
                href: "/ecad-hardware",
              },
              {
                icon: Microscope,
                color: "#F59E0B",
                label: "Medical",
                sub: "ECG, EEG, Surgical",
                href: "/ecad-hardware",
              },
              {
                icon: Rocket,
                color: "#F472B6",
                label: "ePAM",
                sub: "eVTOL, Space, EcoCar",
                href: "/aerospace",
              },
              {
                icon: Shield,
                color: "#6366F1",
                label: "Defense",
                sub: "Surveillance, Tactical",
                href: "/ecad-hardware",
              },
              {
                icon: Wifi,
                color: "#06B6D4",
                label: "Consumer",
                sub: "Smart home, AR, Wearables",
                href: "/ecad-hardware",
              },
              {
                icon: Zap,
                color: "#FBBF24",
                label: "Electronics",
                sub: "PCBs, FPGAs, AI chips",
                href: "/ecad-hardware",
              },
              {
                icon: Brain,
                color: "#8B5CF6",
                label: "Mining",
                sub: "Autonomous, Safety",
                href: "/ecad-hardware",
              },
              {
                icon: Globe,
                color: "#14B8A6",
                label: "Cybersecurity",
                sub: "HSMs, Firewalls, Access",
                href: "/ecad-hardware",
              },
              {
                icon: HardDrive,
                color: "#F87171",
                label: "Future Designs",
                sub: "10 concept products",
                href: "/ecad-hardware",
              },
            ].map((item, i) => (
              <Link key={item.label} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl border p-4 flex flex-col items-center gap-2 text-center cursor-pointer transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${item.color}20` }}
                  >
                    <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <div className="font-semibold text-white text-sm">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-gray-500">{item.sub}</div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/ecad-hardware">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-xl font-bold border flex items-center gap-2 mx-auto"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}
              >
                View All Hardware Products <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Open Source Mission */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(34,211,238,0.15)" }}
            >
              <Rocket size={32} style={{ color: "#22D3EE" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Open Source. Forever.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              EmbeddedOS Research Foundation is a 501(c)(3) nonprofit.
              Foundation-authored projects are published under the MIT license,
              with public repositories and documentation. We believe open
              infrastructure for intelligent devices should be a public good
              that engineers, students, and researchers can inspect and build
              upon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-xl font-bold text-white flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE, #0EA5E9)",
                  }}
                >
                  About the Foundation <ChevronRight size={18} />
                </motion.button>
              </Link>
              <Link href="/donate">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-xl font-bold border flex items-center gap-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  Support Us <Heart size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
