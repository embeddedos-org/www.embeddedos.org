import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Cpu,
  Zap,
  Brain,
  Network,
  Database,
  Package,
  Monitor,
  Globe,
  Smartphone,
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
} from "lucide-react";
import { BOARD_COUNT, REPO_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";

const STACK_LAYERS = [
  {
    id: "hardware",
    label: "Hardware Layer",
    color: "#22D3EE",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.3)",
    items: [
      {
        icon: Heart,
        label: "Health Devices",
        sub: "KEY, BAND, RING, LAB",
        href: "/health",
      },
      {
        icon: Plane,
        label: "Aerospace",
        sub: "AeroSwift, ePAM",
        href: "/aerospace",
      },
      {
        icon: Car,
        label: "Transport",
        sub: "eRadar360, ADAS",
        href: "/eradar360",
      },
      {
        icon: Factory,
        label: "Industrial",
        sub: "PLCs, Sensors, HMI",
        href: "/ecad-hardware",
      },
      {
        icon: Bot,
        label: "Robotics",
        sub: "Arms, AMR, Cobots",
        href: "/ecad-hardware",
      },
      {
        icon: Leaf,
        label: "Energy",
        sub: "BMS, Solar, Grid",
        href: "/ecad-hardware",
      },
    ],
  },
  {
    id: "os",
    label: "OS Foundation",
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.3)",
    items: [
      {
        icon: Cpu,
        label: "EoS Kernel",
        sub: "RTOS · 33 HAL peripherals · 41 profiles",
        href: "/eos",
      },
      {
        icon: Shield,
        label: "eBoot",
        sub: "Secure bootloader · A/B slots · Ed25519",
        href: "/eboot",
      },
      {
        icon: Package,
        label: "eBuild",
        sub: "Cross-compile · 18 commands · 14 SDKs",
        href: "/ebuild",
      },
      {
        icon: Network,
        label: "EIPC",
        sub: "Secure IPC · HMAC-SHA256 · zero-copy",
        href: "/eipc",
      },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence Layer",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.3)",
    items: [
      {
        icon: Brain,
        label: "EAI Runtime",
        sub: "On-device LLM · ReAct agents · LoRA",
        href: "/eai",
      },
      {
        icon: Activity,
        label: "ENI / Neural",
        sub: "1,024-ch BCI · spike sorting · TENS",
        href: "/eni",
      },
      {
        icon: Database,
        label: "eDB",
        sub: "SQL + Doc + KV · AES-256 · REST API",
        href: "/edb",
      },
    ],
  },
  {
    id: "applications",
    label: "Application Layer",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.3)",
    items: [
      {
        icon: Monitor,
        label: "eOffice Suite",
        sub: "11 productivity apps · CRDT collab",
        href: "/eoffice",
      },
      {
        icon: Layers,
        label: "eApps (43)",
        sub: "Productivity · Media · Games · Connectivity",
        href: "/eapps",
      },
      {
        icon: Globe,
        label: "eBrowser",
        sub: "Embedded web engine · DOM API · JS",
        href: "/ebrowser",
      },
      {
        icon: Smartphone,
        label: "eServiceApps",
        sub: "Flutter super-app · eSocial · eRide",
        href: "/eserviceapps",
      },
    ],
  },
  {
    id: "tools",
    label: "Developer Tools",
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.3)",
    items: [
      {
        icon: Code2,
        label: "EoStudio IDE",
        sub: "Board picker · HAL config · AI tutor",
        href: "/eostudio",
      },
      {
        icon: HardDrive,
        label: "EoSim",
        sub: `${SIM_PLATFORM_COUNT} virtual platforms · QEMU · HIL`,
        href: "/eosim",
      },
      {
        icon: Wifi,
        label: "eFlow",
        sub: "Visual node editor · 5 block categories",
        href: "/eflow",
      },
    ],
  },
];

const USE_CASES = [
  {
    icon: Heart,
    color: "#EF4444",
    title: "Healthcare & Wearables",
    desc: "EoS runs on nRF5340 inside HEALTH-KEY ULTRA and HEALTH-BAND Neuro. ENI captures 4-channel EEG and sEMG. EAI classifies neurological patterns in real time. eDB stores encrypted biometric history. eServiceApps delivers the companion mobile app.",
    products: ["EoS", "ENI", "EAI", "eDB", "eServiceApps"],
    href: "/health",
  },
  {
    icon: Plane,
    color: "#22D3EE",
    title: "Aerospace & UAV",
    desc: "AeroSwift Personal runs EoS on STM32H7 with ARINC-429 HAL. eBoot provides cryptographically verified staged boot. EIPC routes sensor data between flight-computer cores. EoSim validates firmware against a digital twin before hardware deployment.",
    products: ["EoS", "eBoot", "EIPC", "EoSim"],
    href: "/aerospace",
  },
  {
    icon: Car,
    color: "#F97316",
    title: "Automotive & ADAS",
    desc: "eRadar360 Aegis One fuses 4× 77 GHz FMCW radar, 8× cameras, and V2X on EoS. EAI runs the threat-detection neural network at <10 ms latency. EIPC safely routes CAN FD data between AUTOSAR partitions. eBuild cross-compiles the full stack for NXP S32K344.",
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
    desc: "EoS SMP runs on Cortex-A72 with real-time servo control. ENI reads sEMG for human-robot collaboration. EAI runs SLAM and path-planning models on-device. EoStudio provides a visual robot configuration and simulation environment.",
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
    desc: "EoS targets IEC 60601-1 certified medical hardware. ENI captures 1,024-channel neural signals for BCI and neurofeedback. EAI classifies seizure patterns and motor imagery. eDB stores HIPAA-compliant patient data with full audit trails.",
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
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <div ref={ref} className="w-full max-w-5xl mx-auto">
      <div className="space-y-3">
        {STACK_LAYERS.map((layer, li) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: li * 0.12,
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1],
            }}
            onMouseEnter={() => setActiveLayer(layer.id)}
            onMouseLeave={() => setActiveLayer(null)}
            className="rounded-xl border transition-all duration-300 cursor-default"
            style={{
              background:
                activeLayer === layer.id ? layer.bg : "rgba(255,255,255,0.02)",
              borderColor:
                activeLayer === layer.id
                  ? layer.border
                  : "rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="px-5 py-3 flex items-center gap-3 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: layer.color }}
              />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: layer.color }}
              >
                {layer.label}
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {layer.items.map(item => (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg p-3 flex flex-col gap-1.5 cursor-pointer transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <item.icon size={18} style={{ color: layer.color }} />
                    <div className="text-xs font-semibold text-white">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {item.sub}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
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
          className="flex items-center gap-1 text-xs font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: uc.color }}
        >
          Learn more <ArrowRight size={12} />
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
          src="/manus-storage/what-we-do-illustration_4c2ad2f7.jpg"
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
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
              We build the complete software stack for intelligent embedded
              devices — from the bare-metal kernel to AI inference, neural
              interfaces, productivity apps, and developer tools. One
              open-source foundation powering every device category.
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              The Complete Embedded Stack
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every layer is open-source, MIT-licensed, and designed to work
              together — or independently. Hover a layer to explore. Click any
              product to learn more.
            </p>
          </div>
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
              Five product families that compose into any embedded system — from
              a 32 KB microcontroller to a quad-core application processor.
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
                desc: "On-device LLM inference with 12 model families, ReAct agents, and LoRA fine-tuning. 1,024-channel neural interface for BCI, sEMG, and EEG applications.",
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
                    className="flex items-center gap-1 text-sm font-semibold transition-opacity"
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
              EmbeddedOS products compose into complete solutions across eight
              major device categories.
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
              15 CAD hardware design categories — from health wearables to
              aerospace systems — all engineered to run the EmbeddedOS stack.
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
              EmbeddedOS Research Foundation is a 501(c)(3) nonprofit. Every
              line of code is MIT-licensed. No vendor lock-in, no proprietary
              blobs, no closed APIs. We believe the infrastructure for
              intelligent devices should be a public good — freely available to
              every engineer, student, and researcher on Earth.
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
