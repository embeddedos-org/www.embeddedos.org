/**
 * Architecture — Interactive 3D architecture diagrams for every EmbeddedOS product.
 * Each diagram uses a distinct visual mode (layered, radial, pipeline, tree, matrix)
 * so no two diagrams look alike.
 */
import { lazy, Suspense, useState } from "react";
import {
  ECOSYSTEM,
  ROLE_LABEL,
  ROLE_ORDER,
  componentsInRole,
} from "@/data/ecosystem";
import { motion } from "framer-motion";
import {
  Layers,
  Cpu,
  Brain,
  FileText,
  Package,
  Database,
  Shield,
  ChevronRight,
  Heart,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Radio,
  GitBranch,
  Network,
  DraftingCompass,
} from "lucide-react";
import { Link } from "wouter";
import type { DiagramMode } from "../components/ArchitectureDiagram3D";
import { moveTabFocus } from "@/lib/tablist";
import { BOARD_COUNT } from "@/data/stack";
import { ARCHITECTURE_STAGES } from "@/data/architecture";

const ArchitectureDiagram3D = lazy(
  () => import("../components/ArchitectureDiagram3D")
);
const CadWalkthrough3D = lazy(() => import("../components/CadWalkthrough3D"));

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.08,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  }),
};

// ── 1. Full EmbeddedOS Stack — MATRIX mode ───────────────────────────────────
// Shows all products as a glowing node grid — no other diagram uses this
const FULL_STACK_LAYERS = [
  {
    label: "eServiceApps",
    sublabels: ["eSocial", "eRide", "eWallet", "eTravel"],
    color: "#F472B6",
    y: 2.2,
    width: 4.0,
  },
  {
    label: "eOffice + eApps",
    sublabels: ["60+ apps", "11 office tools"],
    color: "#34D399",
    y: 1.5,
    width: 3.8,
  },
  {
    label: "EAI / ENI",
    sublabels: ["Neural AI", "BCI", "eDB", "EIPC"],
    color: "#A78BFA",
    y: 0.8,
    width: 3.6,
  },
  {
    label: "EoS Kernel",
    sublabels: ["RTOS", "SMP", "VFS", "IPC"],
    color: "#F97316",
    y: 0.1,
    width: 3.4,
  },
  {
    label: "eBoot",
    sublabels: ["Secure boot", "OTA", "TPM 2.0"],
    color: "#FBBF24",
    y: -0.6,
    width: 3.2,
  },
  {
    label: "eCAD Hardware",
    sublabels: ["15 categories", "KiCad open designs"],
    color: "#6B7280",
    y: -1.3,
    width: 3.0,
  },
];

// ── 2. EoS Kernel Architecture — LAYERED mode ────────────────────────────────
// Classic horizontal slab stack — the canonical OS diagram
const EOS_LAYERS = [
  {
    label: "Applications",
    sublabels: ["eOffice", "eApps", "eServiceApps"],
    color: "#34D399",
    y: 1.8,
    width: 3.8,
  },
  {
    label: "Services Layer",
    sublabels: ["ENI", "EAI", "EIPC", "eDB"],
    color: "#22D3EE",
    y: 1.1,
    width: 3.6,
  },
  {
    label: "EoS Kernel",
    sublabels: ["Scheduler", "MM", "VFS", "IPC"],
    color: "#F97316",
    y: 0.4,
    width: 3.4,
  },
  {
    label: "HAL",
    sublabels: ["GPIO", "SPI", "I2C", "UART", "USB", "CAN"],
    color: "#A78BFA",
    y: -0.3,
    width: 3.2,
  },
  {
    label: "Hardware",
    sublabels: ["ARM Cortex-M/A", "RISC-V", "x86"],
    color: "#6B7280",
    y: -1.0,
    width: 3.0,
  },
];

// ── 3. eBoot Secure Boot — PIPELINE mode ─────────────────────────────────────
// Left-to-right flow perfectly represents a sequential boot chain
const EBOOT_LAYERS = [
  {
    label: "ROM Bootrom",
    sublabels: ["Immutable"],
    color: "#6B7280",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Stage 2: eBoot",
    sublabels: ["TPM 2.0"],
    color: "#FBBF24",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Stage 3: Verify",
    sublabels: ["Ed25519"],
    color: "#F97316",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Stage 4: OTA",
    sublabels: ["A/B slots"],
    color: "#22D3EE",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "EoS Kernel",
    sublabels: ["Handoff"],
    color: "#34D399",
    y: 0,
    width: 1.0 as number,
  },
];

// ── 4. ENI / EAI Neural Pipeline — RADIAL mode ───────────────────────────────
// Hub-and-spoke shows the EAI inference engine at center with I/O nodes orbiting
const ENI_LAYERS = [
  {
    label: "EAI Inference",
    sublabels: ["INT4 LLM", "ReAct agents"],
    color: "#F472B6",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Electrode Array",
    sublabels: ["Configurable channels", "Research front ends"],
    color: "#EF4444",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "ADC / Amplifier",
    sublabels: ["Hardware-defined rate", "Front-end ADC"],
    color: "#F97316",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "DSP / Spike Sort",
    sublabels: ["Threshold detect", "PCA"],
    color: "#22D3EE",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Motor Commands",
    sublabels: ["Stimulation output"],
    color: "#A78BFA",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "eHealth365 API",
    sublabels: ["Biometric stream"],
    color: "#34D399",
    y: 0,
    width: 1.0 as number,
  },
];

// ── 5. eOffice Suite — TREE mode ─────────────────────────────────────────────
// Top-down hierarchy: kernel → services → apps — shows dependency tree
const EOFFICE_LAYERS = [
  {
    label: "EoS Kernel",
    sublabels: ["Process isolation", "VFS"],
    color: "#6B7280",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "EoS Services",
    sublabels: ["EIPC", "eDB", "EAI"],
    color: "#A78BFA",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Collab Layer",
    sublabels: ["CRDT sync", "eBot AI"],
    color: "#22D3EE",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "eDocs",
    sublabels: ["Rich text", "LaTeX"],
    color: "#34D399",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "eSheets",
    sublabels: ["Formulas", "Charts"],
    color: "#F97316",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "eSlides",
    sublabels: ["Decks", "Embed"],
    color: "#FBBF24",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "eDrive",
    sublabels: ["S3", "eVault"],
    color: "#F472B6",
    y: 0,
    width: 1.0 as number,
  },
];

// ── 6. eDB Multi-Model Database — PIPELINE mode ──────────────────────────────
// Left-to-right query path: API → SQL/Doc/KV → Storage
const EDB_LAYERS = [
  {
    label: "Query API",
    sublabels: ["REST / tRPC / WS"],
    color: "#22D3EE",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "SQL Engine",
    sublabels: ["B-tree", "WAL", "MVCC"],
    color: "#34D399",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Document Store",
    sublabels: ["JSON", "BSON", "CBOR"],
    color: "#F97316",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Key-Value Cache",
    sublabels: ["LRU", "AES-256"],
    color: "#A78BFA",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Storage Engine",
    sublabels: ["Flash", "NVMe", "SD"],
    color: "#6B7280",
    y: 0,
    width: 1.0 as number,
  },
];

// ── 7. eRadar360 Sensor Fusion — RADIAL mode ─────────────────────────────────
// Hub = Kalman filter fusion, orbiting = individual sensor/processing nodes
const RADAR_LAYERS = [
  {
    label: "Sensor Fusion EKF",
    sublabels: ["Kalman filter"],
    color: "#EF4444",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "77GHz FMCW Radar",
    sublabels: ["Range + velocity"],
    color: "#F97316",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "LiDAR",
    sublabels: ["Point cloud 3D"],
    color: "#FBBF24",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Camera",
    sublabels: ["RGB + depth"],
    color: "#22D3EE",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Perception AI",
    sublabels: ["YOLO-nano INT4"],
    color: "#A78BFA",
    y: 0,
    width: 1.0 as number,
  },
  {
    label: "Decision Output",
    sublabels: ["Object class", "Trajectory"],
    color: "#34D399",
    y: 0,
    width: 1.0 as number,
  },
];

// ── Diagram registry ──────────────────────────────────────────────────────────
type LucideIcon = React.FC<{ className?: string; style?: React.CSSProperties }>;

interface DiagramDef {
  id: string;
  icon: LucideIcon;
  color: string;
  mode: DiagramMode;
  /** Renders the dedicated CAD walkthrough instead of the generic component. */
  cadWalkthrough?: boolean;
  title: string;
  /** Short pill label for the diagram selector tabs (never truncated). */
  tabLabel: string;
  subtitle: string;
  desc: string;
  image: string;
  whyMatters: string;
  stats: { label: string; value: string }[];
  layers: typeof FULL_STACK_LAYERS;
  learnMore: string;
  bgGradient: string;
}

const DIAGRAMS: DiagramDef[] = [
  // ── CAD walkthrough — the default tab ─────────────────────────────────────
  // From a bare CAD drawing to a complete product: each of the seven
  // architecture stages bolts tangible parts onto one sensor board.
  // Rendered by CadWalkthrough3D (not the generic component below).
  {
    id: "cad-walkthrough",
    tabLabel: "CAD Walkthrough",
    icon: DraftingCompass,
    color: "#38BDF8",
    // Unused when cadWalkthrough is set; only satisfies the DiagramDef type.
    mode: "matrix",
    cadWalkthrough: true,
    title: "CAD to Product Walkthrough",
    subtitle: "CAD drawing → complete product",
    desc: "One sensor board, built stage by stage: a bare CAD drawing gains sensor modules, secure-boot parts, the EoS SoC, IPC and storage, a display and app layer, an on-device AI accelerator, and finally actuator drivers — until it is a complete, powered product. Every step names the real architecture stage behind it, with maturity badges distinguishing available projects from research and plans.",
    image: "/media/architecture-diagram-hero_72436b3f.jpg",
    whyMatters:
      "Newcomers can watch the platform become a product — and, just as importantly, see what is already built versus what is still research. That honesty is what makes the platform worth evaluating.",
    stats: [
      { label: "Architecture Stages", value: "7" },
      { label: "Supported Boards", value: String(BOARD_COUNT) },
      { label: "Maturity Levels", value: "5" },
      { label: "Shipped Profile", value: "1" },
    ],
    layers: ARCHITECTURE_STAGES.map(s => ({
      label: s.label,
      sublabels: [...s.products],
      color: s.color,
      y: 0,
      width: 3.6,
    })),
    learnMore: "/what-we-do",
    bgGradient: "from-sky-500/10 via-transparent to-cyan-500/5",
  },
  {
    id: "full-stack",
    tabLabel: "Full Stack",
    icon: Layers,
    color: "#F97316",
    mode: "matrix",
    title: "Full EmbeddedOS Stack",
    subtitle: "Hardware → OS → AI → Applications",
    desc: "The complete EmbeddedOS ecosystem shown as an interconnected node matrix — from open KiCad hardware designs through the secure bootloader, real-time kernel, AI/neural services, and up to 60+ productivity and service applications.",
    image: "/media/arch-eos-kernel_d7d1b4a5.jpg",
    whyMatters:
      "This unified stack means a single team can build a complete embedded product — from PCB design to shipping apps — without switching vendors or ecosystems. Every layer is MIT-licensed and open-source.",
    stats: [
      { label: "Supported Boards", value: String(BOARD_COUNT) },
      { label: "HAL Peripherals", value: "33" },
      { label: "App Ecosystem", value: "60+" },
      { label: "Open Repos", value: "22+" },
    ],
    layers: FULL_STACK_LAYERS,
    learnMore: "/what-we-do",
    bgGradient: "from-orange-500/10 via-transparent to-pink-500/5",
  },
  {
    id: "eos-kernel",
    tabLabel: "EoS Kernel",
    icon: Cpu,
    color: "#F97316",
    mode: "layered",
    title: "EoS Kernel Architecture",
    subtitle: "HAL → Kernel → Services → Applications",
    desc: "The EoS kernel sits above the Hardware Abstraction Layer (HAL), providing deterministic fixed-priority preemptive scheduling, memory management, virtual filesystem, and IPC. Services like EAI, ENI, EIPC, and eDB run as isolated processes above the kernel.",
    image: "/media/arch-eos-kernel_d7d1b4a5.jpg",
    whyMatters:
      "A real-time kernel with hard deadline guarantees is critical for medical devices, industrial controllers, and aerospace systems where a missed deadline can mean patient harm or equipment failure.",
    stats: [
      { label: "Board Definitions", value: String(BOARD_COUNT) },
      { label: "HAL Drivers", value: "33" },
      { label: "Form Factors", value: "41" },
      { label: "Min RAM", value: "64KB" },
    ],
    layers: EOS_LAYERS,
    learnMore: "/eos",
    bgGradient: "from-orange-500/10 via-transparent to-amber-500/5",
  },
  {
    id: "eboot",
    tabLabel: "eBoot Chain",
    icon: Shield,
    color: "#FBBF24",
    mode: "pipeline",
    title: "eBoot Secure Boot Chain",
    subtitle: "ROM → TPM → Ed25519 → OTA → EoS",
    desc: "The 5-stage verified boot pipeline flows left to right: an immutable ROM bootstraps eBoot, which performs TPM 2.0 attestation, Ed25519 signature verification, A/B OTA slot selection, and hands off to the EoS kernel entry point.",
    image: "/media/arch-eboot-chain_b9f999b5.jpg",
    whyMatters:
      "Secure boot prevents malicious firmware from running on medical implants, industrial PLCs, and connected vehicles — protecting both patients and critical infrastructure from supply-chain attacks.",
    stats: [
      { label: "Boot Stages", value: "5" },
      { label: "Signature Algo", value: "Ed25519" },
      { label: "A/B OTA Slots", value: "2" },
      { label: "TPM Support", value: "2.0" },
    ],
    layers: EBOOT_LAYERS,
    learnMore: "/eboot",
    bgGradient: "from-yellow-500/10 via-transparent to-orange-500/5",
  },
  {
    id: "eni-eai",
    tabLabel: "Neural Pipeline",
    icon: Brain,
    color: "#F472B6",
    mode: "radial",
    title: "ENI / EAI Neural Pipeline",
    subtitle: "Configurable neural-acquisition research with on-device AI",
    desc: "The research architecture places EAI at the hub with configuration-specific electrode arrays, acquisition front ends, spike-sorting DSP, and experimental output streams. Channel count, sample rate, and resolution depend on the attached hardware.",
    image: "/media/arch-eai-neural_4d7964d2.jpg",
    whyMatters:
      "On-device neural inference is being studied for brain-computer interface research. Prosthetic control and neurostimulation are research applications that require independent clinical validation and regulatory approval.",
    stats: [
      { label: "Channels", value: "Config-specific" },
      { label: "Sample Rate", value: "Hardware-defined" },
      { label: "ADC Resolution", value: "Front-end-defined" },
      { label: "Inference", value: "INT4" },
    ],
    layers: ENI_LAYERS,
    learnMore: "/eai",
    bgGradient: "from-pink-500/10 via-transparent to-purple-500/5",
  },
  {
    id: "eoffice",
    tabLabel: "eOffice Suite",
    icon: FileText,
    color: "#34D399",
    mode: "tree",
    title: "eOffice Suite Architecture",
    subtitle: "Kernel → Services → Collaboration → Apps",
    desc: "The eOffice dependency tree shows how 11 productivity apps (eDocs, eSheets, eSlides, eMail, eDrive…) are built on a CRDT collaboration layer with eBot AI, backed by EoS services (EIPC, eDB, EAI) and the kernel's process isolation.",
    image: "/media/arch-eoffice-suite_d63eacf5.jpg",
    whyMatters:
      "A full productivity suite running natively on embedded hardware means remote field workers, medical staff, and industrial operators can work offline without depending on cloud connectivity.",
    stats: [
      { label: "Apps in Suite", value: "11" },
      { label: "Collaboration", value: "CRDT" },
      { label: "AI Assistant", value: "eBot" },
      { label: "Storage", value: "S3/Local" },
    ],
    layers: EOFFICE_LAYERS,
    learnMore: "/eoffice",
    bgGradient: "from-emerald-500/10 via-transparent to-cyan-500/5",
  },
  {
    id: "edb",
    tabLabel: "eDB",
    icon: Database,
    color: "#22D3EE",
    mode: "pipeline",
    title: "eDB Multi-Model Database",
    subtitle: "Query API → SQL → Document → KV → Flash",
    desc: "eDB's query pipeline flows from the unified REST/tRPC/WebSocket API through three storage engines (SQL with B-tree WAL, JSON/BSON document store, AES-256 key-value cache) down to the flash/NVMe storage layer — all in under 512KB flash.",
    image: "/media/arch-eos-kernel_d7d1b4a5.jpg",
    whyMatters:
      "Embedded devices need a database that fits in flash memory, survives power loss, and encrypts sensitive patient or industrial data — without requiring a separate database server process.",
    stats: [
      { label: "Storage Models", value: "3" },
      { label: "Encryption", value: "AES-256" },
      { label: "Query APIs", value: "REST+WS" },
      { label: "Min Flash", value: "512KB" },
    ],
    layers: EDB_LAYERS,
    learnMore: "/product-edb",
    bgGradient: "from-cyan-500/10 via-transparent to-blue-500/5",
  },
  {
    id: "eradar360",
    tabLabel: "eRadar360",
    icon: Radio,
    color: "#EF4444",
    mode: "radial",
    title: "eRadar360 Sensor Fusion",
    subtitle: "77GHz FMCW + LiDAR + Camera → EKF → AI",
    desc: "The Extended Kalman Filter fusion engine sits at the hub, with 77 GHz FMCW radar, LiDAR, and camera sensors orbiting as live data streams. YOLO-nano perception AI (EAI INT4) processes fused data for object classification and trajectory prediction.",
    image: "/media/arch-eai-neural_4d7964d2.jpg",
    whyMatters:
      "Multi-sensor fusion running on a single embedded SoC dramatically reduces the cost and complexity of autonomous vehicle perception — making ADAS accessible to mid-range vehicles and agricultural robots.",
    stats: [
      { label: "Radar Freq", value: "77 GHz" },
      { label: "Sensor Types", value: "3" },
      { label: "AI Model", value: "YOLO-nano" },
      { label: "Filter", value: "EKF" },
    ],
    layers: RADAR_LAYERS,
    learnMore: "/ecad-hardware",
    bgGradient: "from-red-500/10 via-transparent to-orange-500/5",
  },
];

// ── Mode descriptions ─────────────────────────────────────────────────────────
const MODE_LABELS: Record<DiagramMode, string> = {
  layered: "Layered Stack",
  pipeline: "Pipeline Flow",
  radial: "Radial Hub",
  tree: "Dependency Tree",
  matrix: "Node Matrix",
};

// ── Donor callout data ────────────────────────────────────────────────────────
const DONOR_REASONS = [
  {
    icon: Shield,
    color: "#34D399",
    title: "Medical Device Safety",
    desc: "EoS + eBoot + ENI power medical implants and health monitors. Your donation funds the security audits that keep patients safe.",
  },
  {
    icon: Brain,
    color: "#F472B6",
    title: "Neural Interface Research",
    desc: "The ENI/EAI pipeline could restore movement to paralyzed patients. Donations fund hardware bring-up on new neural recording platforms.",
  },
  {
    icon: Cpu,
    color: "#F97316",
    title: "Open Hardware Freedom",
    desc: "All 15 eCAD hardware categories are open KiCad designs. Donations fund new board designs and manufacturing test coverage.",
  },
  {
    icon: FileText,
    color: "#22D3EE",
    title: "Education & Books",
    desc: "14 technical books covering every layer of the stack — free forever. Donations fund authors, editors, and translation into 5 languages.",
  },
];

export default function Architecture() {
  const [active, setActive] = useState("cad-walkthrough");
  const diagram = DIAGRAMS.find(d => d.id === active) ?? DIAGRAMS[0];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      {/* ── Hero ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          src="/media/architecture-diagram-hero_72436b3f.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${diagram.bgGradient} transition-all duration-700`}
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Layers className="w-4 h-4" /> ARCHITECTURE &amp; BLOCK DIAGRAMS
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-5 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent leading-tight">
              Inside EmbeddedOS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Eight distinct interactive 3D diagrams — each using a different
              visual model to best represent its product's architecture. From a
              CAD drawing that builds into a complete product, to layered OS
              stacks, radial sensor fusion hubs, and dependency trees.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#diagrams"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#F97316", color: "#fff" }}
              >
                Explore Diagrams <ChevronRight className="w-4 h-4" />
              </a>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all duration-150"
              >
                <Heart className="w-4 h-4 text-pink-400" /> Support the
                Foundation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Diagram selector + active diagram ── */}
      <section className="py-4 px-4" id="diagrams">
        <div className="max-w-6xl mx-auto">
          {/* Selector tabs */}
          <div
            className="flex flex-wrap gap-2 justify-center mb-10"
            role="tablist"
            aria-label="Architecture diagrams"
            onKeyDown={moveTabFocus}
          >
            {DIAGRAMS.map(d => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  role="tab"
                  id={`diagram-tab-${d.id}`}
                  aria-selected={active === d.id}
                  aria-controls={`diagram-panel-${d.id}`}
                  tabIndex={active === d.id ? 0 : -1}
                  onClick={() => setActive(d.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    active === d.id
                      ? "text-white border-transparent"
                      : "text-white/50 border-white/10 hover:border-white/20 hover:text-white/80"
                  }`}
                  style={
                    active === d.id
                      ? {
                          background: d.color + "22",
                          borderColor: d.color + "66",
                          color: d.color,
                        }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" style={{}} />
                  <span>{d.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active diagram */}
          {DIAGRAMS.map(d => {
            const isActive = d.id === active;
            return (
              <div
                key={d.id}
                role="tabpanel"
                id={`diagram-panel-${d.id}`}
                aria-labelledby={`diagram-tab-${d.id}`}
                hidden={!isActive}
              >
                {/* Top: 3D canvas + info panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
                  {/* 3D Canvas */}
                  <div>
                    {isActive &&
                      (d.cadWalkthrough ? (
                        <Suspense
                          fallback={
                            <div className="h-80 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-sm">
                              Loading CAD walkthrough…
                            </div>
                          }
                        >
                          <CadWalkthrough3D height={400} />
                        </Suspense>
                      ) : (
                        <Suspense
                          fallback={
                            <div className="h-80 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-sm">
                              Loading 3D diagram…
                            </div>
                          }
                        >
                          <ArchitectureDiagram3D
                            layers={d.layers}
                            mode={d.mode}
                            height={400}
                            accentColor={d.color}
                          />
                        </Suspense>
                      ))}
                    {/* Mode label */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-white/30">
                        Visualization:
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                        style={{
                          color: d.color,
                          borderColor: d.color + "40",
                          background: d.color + "12",
                        }}
                      >
                        {d.cadWalkthrough
                          ? "CAD Walkthrough"
                          : MODE_LABELS[d.mode]}
                      </span>
                      <span className="text-xs text-white/20">
                        {d.cadWalkthrough
                          ? "· Drag to orbit · Step through the build · Keyboard: stepper below"
                          : "· Drag to rotate · Interactive"}
                      </span>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border"
                      style={{
                        background: d.color + "18",
                        borderColor: d.color + "44",
                        color: d.color,
                      }}
                    >
                      <d.icon className="w-3.5 h-3.5" />
                      {d.subtitle}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      {d.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-5">
                      {d.desc}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {d.stats.map(s => (
                        <div
                          key={s.label}
                          className="rounded-xl p-3 text-center border border-white/5"
                          style={{ background: d.color + "0d" }}
                        >
                          <div
                            className="font-bold text-lg"
                            style={{ color: d.color }}
                          >
                            {s.value}
                          </div>
                          <div className="text-[11px] text-white/40 mt-0.5">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Layer list */}
                    <div className="space-y-1.5 mb-5 max-h-52 overflow-y-auto pr-1">
                      {[...d.layers].reverse().map(layer => (
                        <div
                          key={layer.label}
                          className="flex items-start gap-3 p-2.5 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 transition-colors"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-sm mt-1 flex-shrink-0"
                            style={{ background: layer.color }}
                          />
                          <div>
                            <div className="text-white text-xs font-semibold">
                              {layer.label}
                            </div>
                            {layer.sublabels && (
                              <div className="text-white/35 text-[10px] mt-0.5">
                                {layer.sublabels.join(" · ")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Learn more link */}
                    <Link
                      href={d.learnMore}
                      className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                      style={{ color: d.color }}
                    >
                      Learn more about{" "}
                      {d.title.split(" ").slice(0, 3).join(" ")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Bottom: illustration + "Why This Matters" */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="rounded-2xl overflow-hidden border border-white/8 bg-white/3">
                    <img
                      src={d.image}
                      alt={`${d.title} illustration`}
                      className="w-full h-56 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className="rounded-2xl p-6 border"
                    style={{
                      background: d.color + "0a",
                      borderColor: d.color + "30",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle
                        className="w-5 h-5"
                        style={{ color: d.color }}
                      />
                      <span className="font-bold text-white text-base">
                        Why This Matters
                      </span>
                    </div>
                    <p className="text-white/70 leading-relaxed text-sm">
                      {d.whyMatters}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/8">
                      <Link
                        href="/donate"
                        className="inline-flex items-center gap-2 text-sm font-medium text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Support this research
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── All diagrams grid ── */}
      <section className="py-16 px-4 bg-[#080F1E]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              All Architecture Diagrams
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Each diagram uses a different 3D visualization mode to best
              represent its product's structure. Click any card to open it in
              the interactive viewer above.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {DIAGRAMS.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.button
                  key={d.id}
                  onClick={() => {
                    setActive(d.id);
                    document
                      .getElementById("diagrams")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] ${
                    active === d.id
                      ? "border-white/20 bg-white/8"
                      : "border-white/8 bg-white/4 hover:border-white/15"
                  }`}
                >
                  {/* Color band header */}
                  <div
                    className="rounded-xl h-2 mb-4 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${d.color}, ${d.color}44)`,
                    }}
                  />
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: d.color + "20",
                        border: `1px solid ${d.color}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: d.color }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {d.title}
                      </div>
                      <div className="text-white/40 text-xs">{d.subtitle}</div>
                    </div>
                  </div>
                  {/* Mode badge */}
                  <div className="mb-3">
                    <span
                      className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
                      style={{
                        color: d.color,
                        borderColor: d.color + "40",
                        background: d.color + "15",
                      }}
                    >
                      {d.cadWalkthrough
                        ? "CAD Walkthrough"
                        : MODE_LABELS[d.mode]}
                    </span>
                  </div>
                  {/* Layer chips */}
                  <div className="flex flex-wrap gap-1">
                    {d.layers.slice(0, 4).map(l => (
                      <span
                        key={l.label}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                        style={{ background: l.color + "18", color: l.color }}
                      >
                        {l.label.split(" ")[0]}
                      </span>
                    ))}
                    {d.layers.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/30 bg-white/5">
                        +{d.layers.length - 4}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Visualization modes explainer ── */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-3">
              6 Visualization Modes
            </h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto">
              Each diagram type is chosen to match the product's actual
              architecture pattern.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                mode: "layered" as DiagramMode,
                color: "#F97316",
                icon: Layers,
                title: "Layered Stack",
                desc: "Horizontal slabs showing OS layers from hardware to apps. Best for kernel and platform architectures.",
                used: "EoS Kernel",
              },
              {
                mode: "pipeline" as DiagramMode,
                color: "#FBBF24",
                icon: ArrowRight,
                title: "Pipeline Flow",
                desc: "Left-to-right sequential stages with arrows. Best for boot chains and query processing paths.",
                used: "eBoot, eDB",
              },
              {
                mode: "radial" as DiagramMode,
                color: "#F472B6",
                icon: Radio,
                title: "Radial Hub",
                desc: "Central hub with orbiting nodes. Best for inference engines and sensor fusion systems.",
                used: "ENI/EAI, eRadar360",
              },
              {
                mode: "tree" as DiagramMode,
                color: "#34D399",
                icon: GitBranch,
                title: "Dependency Tree",
                desc: "Top-down hierarchy showing how components depend on each other. Best for app suites.",
                used: "eOffice Suite",
              },
              {
                mode: "matrix" as DiagramMode,
                color: "#A78BFA",
                icon: Package,
                title: "Node Matrix",
                desc: "3D grid of glowing nodes. Best for showing the full ecosystem of products at once.",
                used: "Full Stack",
              },
              {
                color: "#38BDF8",
                icon: Network,
                title: "System Map",
                desc: "Seven architecture stages as one connected 3D map with maturity badges and documented links. Best for seeing how the whole platform fits together.",
                used: "Reference architecture",
              },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: m.color + "20" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">
                        {m.title}
                      </div>
                      <div className="text-white/30 text-[10px]">
                        Used for: {m.used}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {m.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Donor callout ── */}
      <section className="py-16 px-4 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Why Donors Fund This Research
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Every layer of the EmbeddedOS stack has real-world impact on
              safety, health, and freedom.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {DONOR_REASONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-6 border border-white/5 card-hover flex gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: r.color + "20",
                      border: `1px solid ${r.color}40`,
                    }}
                  >
                    <Icon size={22} style={{ color: r.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1">
                      {r.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white"
              style={{
                background: "linear-gradient(135deg, #F97316, #F59E0B)",
              }}
            >
              <Heart className="w-5 h-5 text-pink-200" />
              Donate to the Foundation
            </Link>
            <p className="text-white/30 text-xs mt-3">
              501(c)(3) nonprofit · 0% platform fees · Tax-deductible
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Components, from the verified ecosystem graph ── */}
      <section
        className="py-16 px-4 border-t border-white/5"
        id="components"
        aria-labelledby="components-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="components-heading"
            className="text-3xl font-bold text-white mb-3"
          >
            The components
          </h2>
          <p className="text-white/55 mb-3 max-w-3xl">
            Every part of EmbeddedOS is a separate, independently versioned
            repository. The grouping below follows the path a device takes at
            runtime — hardware, boot, operating system, communication, on-device
            AI, applications — with the development tooling that builds it last.
          </p>
          <p className="text-white/40 text-sm mb-10 max-w-3xl">
            Each status is the word that component&rsquo;s own repository uses
            to describe itself. Several are experimental or planned, and are
            labelled as such rather than presented as finished.
          </p>

          {ROLE_ORDER.map(role => {
            const items = componentsInRole(role);
            if (items.length === 0) return null;
            return (
              <div key={role} className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-4">
                  {ROLE_LABEL[role]}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map(component => (
                    <li
                      key={component.id}
                      className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]"
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h4 className="font-heading font-bold text-white text-lg">
                          {component.name}
                        </h4>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/45 border border-white/12 rounded-full px-2 py-0.5 whitespace-nowrap">
                          {component.maturity}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed mb-4">
                        {component.purpose}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {component.sitePage && (
                          <Link
                            href={component.sitePage}
                            className="text-[#F97316] hover:underline"
                          >
                            {component.name} on this site
                          </Link>
                        )}
                        <a
                          href={component.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-white hover:underline"
                        >
                          Source repository
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <p className="text-white/40 text-sm">
            {ECOSYSTEM.length} components. Anything not listed here does not
            exist as a repository yet.
          </p>
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "EoS Kernel", href: "/eos" },
              { label: "eBoot", href: "/eboot" },
              { label: "EAI / ENI", href: "/eai" },
              { label: "eOffice", href: "/eoffice" },
              { label: "eDB", href: "/product-edb" },
              { label: "eCAD Hardware", href: "/ecad-hardware" },
              { label: "API Docs", href: "/api-docs" },
              { label: "GitHub", href: "https://github.com/embeddedos-org" },
            ].map(link =>
              link.href.startsWith("http") ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white/50 border border-white/8 hover:border-white/20 hover:text-white/80 transition-all"
                >
                  {link.label} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white/50 border border-white/8 hover:border-white/20 hover:text-white/80 transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
