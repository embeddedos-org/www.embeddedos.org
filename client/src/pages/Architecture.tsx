/**
 * Architecture — Interactive 3D architecture diagrams for every EmbeddedOS product.
 * Each diagram uses a distinct visual mode (layered, radial, pipeline, tree, matrix)
 * so no two diagrams look alike.
 */
import { lazy, Suspense, useState, type CSSProperties } from "react";
import {
  ECOSYSTEM,
  ROLE_LABEL,
  ROLE_ORDER,
  componentsInRole,
} from "@/data/ecosystem";
import { Link } from "wouter";
import type { DiagramMode } from "../components/ArchitectureDiagram3D";
import { moveTabFocus } from "@/lib/tablist";
import { BOARD_COUNT } from "@/data/stack";
import { ARCHITECTURE_STAGES } from "@/data/architecture";
import { useIsMobile } from "@/hooks/useMobile";
import { BpPage, LocalNav, PageHero, Section, Stats } from "@/components/bp";
import "./Architecture.css";

const ArchitectureDiagram3D = lazy(
  () => import("../components/ArchitectureDiagram3D")
);
const CadWalkthrough3D = lazy(() => import("../components/CadWalkthrough3D"));

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
interface DiagramDef {
  id: string;
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
}

const DIAGRAMS: DiagramDef[] = [
  // ── CAD walkthrough — the default tab ─────────────────────────────────────
  // From a bare CAD drawing to a complete product: each of the seven
  // architecture stages bolts tangible parts onto one sensor board.
  // Rendered by CadWalkthrough3D (not the generic component below).
  {
    id: "cad-walkthrough",
    tabLabel: "CAD Walkthrough",
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
  },
  {
    id: "full-stack",
    tabLabel: "Full Stack",
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
  },
  {
    id: "eos-kernel",
    tabLabel: "EoS Kernel",
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
  },
  {
    id: "eboot",
    tabLabel: "eBoot Chain",
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
  },
  {
    id: "eni-eai",
    tabLabel: "Neural Pipeline",
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
  },
  {
    id: "eoffice",
    tabLabel: "eOffice Suite",
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
  },
  {
    id: "edb",
    tabLabel: "eDB",
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
  },
  {
    id: "eradar360",
    tabLabel: "eRadar360",
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
    color: "#34D399",
    title: "Medical Device Safety",
    desc: "EoS + eBoot + ENI power medical implants and health monitors. Your donation funds the security audits that keep patients safe.",
  },
  {
    color: "#F472B6",
    title: "Neural Interface Research",
    desc: "The ENI/EAI pipeline could restore movement to paralyzed patients. Donations fund hardware bring-up on new neural recording platforms.",
  },
  {
    color: "#F97316",
    title: "Open Hardware Freedom",
    desc: "All 15 eCAD hardware categories are open KiCad designs. Donations fund new board designs and manufacturing test coverage.",
  },
  {
    color: "#22D3EE",
    title: "Education & Books",
    desc: "14 technical books covering every layer of the stack — free forever. Donations fund authors, editors, and translation into 5 languages.",
  },
];

// ── Visualization modes explainer ────────────────────────────────────────────
const MODES = [
  {
    color: "#F97316",
    title: "Layered Stack",
    desc: "Horizontal slabs showing OS layers from hardware to apps. Best for kernel and platform architectures.",
    used: "EoS Kernel",
  },
  {
    color: "#FBBF24",
    title: "Pipeline Flow",
    desc: "Left-to-right sequential stages with arrows. Best for boot chains and query processing paths.",
    used: "eBoot, eDB",
  },
  {
    color: "#F472B6",
    title: "Radial Hub",
    desc: "Central hub with orbiting nodes. Best for inference engines and sensor fusion systems.",
    used: "ENI/EAI, eRadar360",
  },
  {
    color: "#34D399",
    title: "Dependency Tree",
    desc: "Top-down hierarchy showing how components depend on each other. Best for app suites.",
    used: "eOffice Suite",
  },
  {
    color: "#A78BFA",
    title: "Node Matrix",
    desc: "3D grid of glowing nodes. Best for showing the full ecosystem of products at once.",
    used: "Full Stack",
  },
  {
    color: "#38BDF8",
    title: "System Map",
    desc: "Seven architecture stages as one connected 3D map with maturity badges and documented links. Best for seeing how the whole platform fits together.",
    used: "Reference architecture",
  },
];

const QUICK_LINKS = [
  { label: "EoS Kernel", href: "/eos" },
  { label: "eBoot", href: "/eboot" },
  { label: "EAI / ENI", href: "/eai" },
  { label: "eOffice", href: "/eoffice" },
  { label: "eDB", href: "/product-edb" },
  { label: "eCAD Hardware", href: "/ecad-hardware" },
  { label: "API Docs", href: "/api-docs" },
  { label: "GitHub", href: "https://github.com/embeddedos-org" },
];

export default function Architecture() {
  const [active, setActive] = useState("cad-walkthrough");
  // The 3D views get a large stage: full width, and as tall as a phone allows.
  const stageHeight = useIsMobile() ? 420 : 600;

  return (
    <BpPage className="arch">
      {/* The faint illustration stays inside the hero: this wrapper clips it
          to the hero's own height, so it never runs behind the section bar. */}
      <div className="ar-top">
        <img
          loading="lazy"
          decoding="async"
          src="/media/architecture-diagram-hero_72436b3f.jpg"
          alt=""
          aria-hidden="true"
          className="ar-heroimg"
        />
        <PageHero
          label="ARCHITECTURE & BLOCK DIAGRAMS"
          title="Inside EmbeddedOS"
          lead="Eight distinct interactive 3D diagrams — each using a different visual model to best represent its product's architecture. From a CAD drawing that builds into a complete product, to layered OS stacks, radial sensor fusion hubs, and dependency trees."
        >
          <div className="ctas">
            <a href="#diagrams" className="btn pri">
              Explore Diagrams{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
            <Link href="/donate" className="btn gh">
              Support the Foundation
            </Link>
          </div>
        </PageHero>
      </div>

      <LocalNav
        name="Architecture"
        items={[
          { id: "diagrams", label: "Diagrams" },
          { id: "all-diagrams", label: "All Diagrams" },
          { id: "modes", label: "Visualization Modes" },
          { id: "donors", label: "Why Donors Fund" },
          { id: "components", label: "The components" },
        ]}
      />

      {/* ── Diagram selector + active diagram ── */}
      <section className="sec ar-diagrams" id="diagrams">
        <div className="wrap">
          {/* Selector tabs */}
          <div
            className="ctas ar-tabs"
            role="tablist"
            aria-label="Architecture diagrams"
            onKeyDown={moveTabFocus}
          >
            {DIAGRAMS.map(d => (
              <button
                key={d.id}
                type="button"
                role="tab"
                id={`diagram-tab-${d.id}`}
                aria-selected={active === d.id}
                aria-controls={`diagram-panel-${d.id}`}
                tabIndex={active === d.id ? 0 : -1}
                onClick={() => setActive(d.id)}
                className="btn gh"
                style={{ "--c": d.color } as CSSProperties}
              >
                <span>{d.tabLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Every diagram's panel is in the page; only the active one is shown */}
        {DIAGRAMS.map(d => {
          const isActive = d.id === active;
          return (
            <div
              key={d.id}
              role="tabpanel"
              id={`diagram-panel-${d.id}`}
              aria-labelledby={`diagram-tab-${d.id}`}
              hidden={!isActive}
              className="ar-panel"
              style={{ "--c": d.color } as CSSProperties}
            >
              {/* The 3D view, on a large stage (one canvas: the active one) */}
              <div className="wrap wide ar-stage">
                {isActive &&
                  (d.cadWalkthrough ? (
                    <Suspense
                      fallback={
                        <div
                          className="ar-wait"
                          style={{ height: stageHeight }}
                        >
                          Loading CAD walkthrough…
                        </div>
                      }
                    >
                      <CadWalkthrough3D height={stageHeight} />
                    </Suspense>
                  ) : (
                    <Suspense
                      fallback={
                        <div
                          className="ar-wait"
                          style={{ height: stageHeight }}
                        >
                          Loading 3D diagram…
                        </div>
                      }
                    >
                      <ArchitectureDiagram3D
                        layers={d.layers}
                        mode={d.mode}
                        height={stageHeight}
                        accentColor={d.color}
                      />
                    </Suspense>
                  ))}
              </div>

              <div className="wrap">
                {/* Mode label */}
                <p className="ar-mode">
                  <span>Visualization:</span>
                  <b>
                    {d.cadWalkthrough ? "CAD Walkthrough" : MODE_LABELS[d.mode]}
                  </b>
                  <span>
                    {d.cadWalkthrough
                      ? "· Drag to orbit · Step through the build · Keyboard: stepper below"
                      : "· Drag to rotate · Interactive"}
                  </span>
                </p>

                {/* What the diagram shows, and its layers */}
                <div className="ar-info">
                  <div className="ar-copy">
                    <p className="label">{d.subtitle}</p>
                    <h2>{d.title}</h2>
                    <p className="ar-desc">{d.desc}</p>
                    <Stats
                      small
                      items={d.stats.map(s => ({
                        value: s.value,
                        label: s.label,
                      }))}
                    />
                    <Link href={d.learnMore} className="btn ln ar-more">
                      Learn more about{" "}
                      {d.title.split(" ").slice(0, 3).join(" ")}
                      <span className="ar" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>

                  {/* Layer list */}
                  <ul className="ar-layers">
                    {[...d.layers].reverse().map(layer => (
                      <li
                        key={layer.label}
                        style={{ "--c": layer.color } as CSSProperties}
                      >
                        <b>{layer.label}</b>
                        {layer.sublabels && (
                          <span>{layer.sublabels.join(" · ")}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Illustration + "Why This Matters" */}
                <div className="ar-why">
                  <figure className="board">
                    <img
                      src={d.image}
                      alt={`${d.title} illustration`}
                      width={1280}
                      height={720}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                  <div className="card">
                    <p className="ar-why-h">Why This Matters</p>
                    <p>{d.whyMatters}</p>
                    <Link href="/donate" className="more">
                      Support this research
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── All diagrams grid ── */}
      <Section
        id="all-diagrams"
        title="All Architecture Diagrams"
        lead="Each diagram uses a different 3D visualization mode to best represent its product's structure. Click any card to open it in the interactive viewer above."
        split
        alt
      >
        <ul className="cards">
          {DIAGRAMS.map(d => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => {
                  setActive(d.id);
                  document
                    .getElementById("diagrams")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={active === d.id ? "card ar-pick on" : "card ar-pick"}
                style={{ "--c": d.color } as CSSProperties}
              >
                <span className="ar-pick-t">{d.title}</span>
                <span className="ar-pick-s">{d.subtitle}</span>
                {/* Mode badge */}
                <span className="st">
                  {d.cadWalkthrough ? "CAD Walkthrough" : MODE_LABELS[d.mode]}
                </span>
                {/* Layer chips */}
                <span className="ar-chips">
                  {d.layers.slice(0, 4).map(l => (
                    <span
                      key={l.label}
                      style={{ "--c": l.color } as CSSProperties}
                    >
                      {l.label.split(" ")[0]}
                    </span>
                  ))}
                  {d.layers.length > 4 && (
                    <span className="ar-plus">+{d.layers.length - 4}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Visualization modes explainer ── */}
      <Section
        id="modes"
        title="6 Visualization Modes"
        lead="Each diagram type is chosen to match the product's actual architecture pattern."
        split
      >
        <ul className="cards">
          {MODES.map(m => (
            <li key={m.title}>
              <div className="card" style={{ "--c": m.color } as CSSProperties}>
                <h3 className="ar-dot">{m.title}</h3>
                <p className="k">Used for: {m.used}</p>
                <p>{m.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Donor callout ── */}
      <Section
        id="donors"
        title="Why Donors Fund This Research"
        lead="Every layer of the EmbeddedOS stack has real-world impact on safety, health, and freedom."
        split
        alt
      >
        <ul className="cards two">
          {DONOR_REASONS.map(r => (
            <li key={r.title}>
              <div className="card" style={{ "--c": r.color } as CSSProperties}>
                <h3 className="ar-dot">{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="ar-give">
          <div className="ctas">
            <Link href="/donate" className="btn or">
              Donate to the Foundation
            </Link>
          </div>
          <p className="fine">
            501(c)(3) nonprofit · 0% platform fees · Tax-deductible
          </p>
        </div>
      </Section>

      {/* ── Components, from the verified ecosystem graph ── */}
      <section
        className="sec"
        id="components"
        aria-labelledby="components-heading"
      >
        <div className="wrap">
          <div className="sec-h split">
            <h2 id="components-heading">The components</h2>
            <div className="lead">
              Every part of EmbeddedOS is a separate, independently versioned
              repository. The grouping below follows the path a device takes at
              runtime — hardware, boot, operating system, communication,
              on-device AI, applications — with the development tooling that
              builds it last.
            </div>
          </div>
          <p className="gnote ar-status">
            Each status is the word that component&rsquo;s own repository uses
            to describe itself. Several are experimental or planned, and are
            labelled as such rather than presented as finished.
          </p>

          {ROLE_ORDER.map(role => {
            const items = componentsInRole(role);
            if (items.length === 0) return null;
            return (
              <div key={role} className="ar-role">
                <h3 className="label">{ROLE_LABEL[role]}</h3>
                <ul className="cards two">
                  {items.map(component => (
                    <li key={component.id}>
                      <div className="card">
                        <div className="top">
                          <h4>{component.name}</h4>
                          <span className="st">{component.maturity}</span>
                        </div>
                        <p>{component.purpose}</p>
                        <div className="ar-links">
                          {component.sitePage && (
                            <Link href={component.sitePage} className="tl">
                              {component.name} on this site
                            </Link>
                          )}
                          <a
                            href={component.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tl"
                          >
                            Source repository
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <p className="fine">
            {ECOSYSTEM.length} components. Anything not listed here does not
            exist as a repository yet.
          </p>
        </div>
      </section>

      {/* ── Quick links ── */}
      <Section tight>
        <ul className="glinks cols">
          {QUICK_LINKS.map(link =>
            link.href.startsWith("http") ? (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ) : (
              <li key={link.label}>
                <Link href={link.href}>
                  <span>{link.label}</span>
                  <i aria-hidden="true">→</i>
                </Link>
              </li>
            )
          )}
        </ul>
      </Section>
    </BpPage>
  );
}
