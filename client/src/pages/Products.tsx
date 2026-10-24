import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  BOARD_COUNT,
  FAMILY_COUNT,
  REPO_COUNT,
  SIM_PLATFORM_COUNT,
} from "@/data/stack";
import {
  Band,
  BpPage,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./Products.css";

// ─── Product families ─────────────────────────────────────────────────────────

/**
 * The per-product reference pages, and the section below that links them.
 *
 * Each of these 13 routes carries a full specification page, and until this
 * section existed not one of them had an inbound link from a page a crawler
 * could reach. They were linked only from the header's mega-menu, whose panels
 * Radix mounts on hover — `scripts/prerender.mjs` snapshots a real browser and
 * a crawler does not hover, so none of the 13 appeared in any of the 132
 * prerendered pages. They linked to each other, forming a closed island, and
 * /product-eapps, /product-eos-platform and /product-eserviceapps had no
 * inbound link anywhere in the static site at all.
 *
 * The family cards above deliberately keep their existing destinations: they
 * point at the overview pages (/eos, /eai, …), which is the right first stop.
 * This section is the reference layer underneath them.
 *
 * tests/unit/navigation.test.ts fails if App.tsx declares a /product-* route
 * that is missing here, so a new product page cannot be orphaned the same way.
 */
const PRODUCT_REFERENCE = [
  { href: "/product-eos", name: "EoS Kernel", note: "Real-time embedded OS" },
  {
    href: "/product-eboot",
    name: "eBootloader",
    note: "Multi-architecture bootloader",
  },
  { href: "/product-eipc", name: "EIPC", note: "Inter-process communication" },
  {
    href: "/product-ebuild",
    name: "eBuild",
    note: "Build system & SDK generator",
  },
  { href: "/product-eai", name: "eAI", note: "On-device AI inference engine" },
  { href: "/product-eni", name: "eNI", note: "Neural interface platform" },
  { href: "/product-edb", name: "eDB", note: "Embedded multi-model database" },
  {
    href: "/product-eapps",
    name: "eApps",
    note: "Embedded application ecosystem",
  },
  {
    href: "/product-eoffice",
    name: "eOffice Suite",
    note: "11-app embedded office suite",
  },
  {
    href: "/product-eserviceapps",
    name: "eServiceApps",
    note: "Embedded service applications",
  },
  { href: "/product-eosim", name: "EoSim", note: "Virtual platform simulator" },
  {
    href: "/product-eostudio",
    name: "EoStudio",
    note: "Embedded development IDE",
  },
  {
    href: "/product-eos-platform",
    name: "EoS Platform",
    note: "Device management & OTA",
  },
] as const;

const FAMILIES = [
  {
    id: "platform",
    label: "Platform",
    color: "#F97316",
    title: "EmbeddedOS Platform",
    tagline: "The kernel, bootloader, and runtime that power every device.",
    description:
      "EoS is a real-time operating system kernel designed for deterministic, resource-constrained environments. eBoot is its companion secure bootloader. Together they form the foundation every EmbeddedOS product is built on.",
    href: "/eos",
    products: [
      {
        name: "EoS Kernel",
        desc: "RTOS kernel — HAL, scheduler, IPC, drivers",
        href: "/eos",
        color: "#F97316",
      },
      {
        name: "eBoot",
        desc: "Secure bootloader with OTA + verified boot",
        href: "/eboot",
        color: "#F59E0B",
      },
      {
        name: "eIPC",
        desc: "Capability-secured inter-process communication",
        href: "/eipc",
        color: "#F97316",
      },
      {
        name: "EoS Platform",
        desc: "Device management, telemetry, and A/B OTA rollout",
        href: "/product-eos-platform",
        color: "#F97316",
      },
      {
        name: "EoS Language",
        desc: "Embedded APIs and programming language",
        href: "/docs",
        color: "#F59E0B",
      },
    ],
    stats: [
      `${BOARD_COUNT} boards`,
      "Deterministic scheduling",
      "MIT License",
      "POSIX-compatible",
    ],
  },
  {
    id: "ai",
    label: "AI & Neural",
    color: "#34D399",
    title: "ENI / EAI",
    tagline: "On-device AI inference and neural interface adapters.",
    description:
      "EAI is EmbeddedOS's edge AI layer — running TFLite, ONNX, and custom models directly on microcontrollers. ENI is the neural interface adapter for BCI devices, enabling direct brain-computer communication over standard embedded buses.",
    href: "/eai",
    products: [
      {
        name: "EAI Engine",
        desc: "On-device LLM + TFLite inference runtime",
        href: "/eai",
        color: "#34D399",
      },
      {
        name: "ENI Adapter",
        desc: "Neural interface for BCI devices over SPI/I²C",
        href: "/eni",
        color: "#10B981",
      },
      {
        name: "eBot Agent",
        desc: "AI assistant embedded in every EoS device",
        href: "/eai",
        color: "#34D399",
      },
      {
        name: "eosllm",
        desc: "On-device LLM inference engine (GGUF/ONNX)",
        href: "/projects",
        color: "#10B981",
      },
    ],
    stats: ["TFLite + ONNX", "BCI-ready", "4-bit quantization", "eBot agent"],
  },
  {
    id: "apps",
    label: "Applications",
    color: "#A78BFA",
    title: "eApps Ecosystem",
    tagline: "60+ apps across office, browser, mobile, and native LVGL.",
    description:
      "The eApps ecosystem covers everything from a full 11-app office suite to native C/LVGL apps running directly on embedded displays, Flutter mobile apps, and browser extensions for every major platform.",
    href: "/eapps",
    products: [
      {
        name: "eOffice Suite",
        desc: "11 office apps — Writer, Sheet, Present, Notes…",
        href: "/eoffice",
        color: "#A78BFA",
      },
      {
        name: "eBrowser",
        desc: "Privacy-first lightweight browser + 11 extensions",
        href: "/ebrowser",
        color: "#8B5CF6",
      },
      {
        name: "eDB",
        desc: "Embedded SQL database with AI query support",
        href: "/edb",
        color: "#A78BFA",
      },
      {
        name: "40+ LVGL Apps",
        desc: "Native C apps for embedded displays",
        href: "/eapps",
        color: "#8B5CF6",
      },
    ],
    stats: [
      "60+ total apps",
      "11 office apps",
      "5 mobile apps",
      "11 browser extensions",
    ],
  },
  {
    id: "health",
    label: "Health",
    color: "#F85149",
    title: "Health Devices",
    tagline: "In-development health research designs powered by EmbeddedOS.",
    description:
      "Four in-development health research designs — from a USB-C sensing design to a planned biochemistry biosensor patch. Physical reliability and clinical validation are pending.",
    href: "/health",
    products: [
      {
        name: "HEALTH-KEY ULTRA",
        desc: "USB-C ECG + SpO₂ + BAC pendrive",
        href: "/health",
        color: "#F85149",
      },
      {
        name: "HEALTH-BAND Neuro",
        desc: "sEMG + TENS AI wristband",
        href: "/health",
        color: "#F59E0B",
      },
      {
        name: "HEALTH-RING",
        desc: "Titanium ring — ECG + HbA1c + AFib",
        href: "/health",
        color: "#A78BFA",
      },
      {
        name: "HEALTH-LAB",
        desc: "14-day biosensor patch — glucose, lactate, cortisol",
        href: "/health",
        color: "#34D399",
      },
    ],
    stats: [
      "2 patents pending",
      "30+ health metrics",
      "Open-source SDK",
      "iOS + Android app",
    ],
  },
  {
    id: "devtools",
    label: "Dev Tools",
    color: "#22D3EE",
    title: "Developer Tools",
    tagline: "Build, simulate, and ship embedded firmware faster.",
    description: `EoStudio is the universal IDE for EmbeddedOS development. EoSim simulates ${SIM_PLATFORM_COUNT} platforms in-browser without hardware. ebuild is the next-gen build tool for the entire EoS ecosystem.`,
    href: "/demo",
    products: [
      {
        name: "EoSim",
        desc: `${SIM_PLATFORM_COUNT}-platform simulator — run firmware in-browser`,
        href: "/eosim",
        color: "#22D3EE",
      },
      {
        name: "EoStudio",
        desc: "Universal IDE v3.1 with EoS integration",
        href: "/eostudio",
        color: "#0EA5E9",
      },
      {
        name: "ebuild",
        desc: "Next-gen build tool for the EoS ecosystem",
        href: "/ebuild",
        color: "#22D3EE",
      },
      {
        name: "eFlow",
        desc: "Visual no-code programming for EoS devices",
        href: "/flow",
        color: "#0EA5E9",
      },
    ],
    stats: [
      `${SIM_PLATFORM_COUNT} platforms`,
      "In-browser sim",
      "Visual IDE",
      "No-code eFlow",
    ],
  },
  {
    id: "aerospace",
    label: "Aerospace",
    color: "#60A5FA",
    title: "AeroSwift",
    tagline: "Solar-hybrid VTOL aircraft powered by EmbeddedOS.",
    description:
      "AeroSwift Personal is a 1–2 seat solar-hybrid VTOL aircraft for personal mobility. AeroSwift Transit is a 10-seat urban air taxi platform. Both run EoS as their flight computer operating system.",
    href: "/aerospace",
    products: [
      {
        name: "AeroSwift Personal",
        desc: "1–2 seat solar-hybrid VTOL",
        href: "/aerospace",
        color: "#60A5FA",
      },
      {
        name: "AeroSwift Transit",
        desc: "10-seat urban air taxi platform",
        href: "/aerospace",
        color: "#3B82F6",
      },
    ],
    stats: [
      "Solar-hybrid",
      "VTOL capable",
      "EoS flight OS",
      "Urban air mobility",
    ],
  },
];

// ─── The stack, from the application layer down to the hardware ──────────────

const STACK_ROWS = [
  {
    layer: "Applications",
    items: ["eOffice Suite", "eBrowser", "eDB", "60+ eApps", "Mobile Apps"],
    color: "#A78BFA",
  },
  {
    layer: "AI & Neural Layer",
    items: ["EAI Engine", "ENI Adapter", "eBot Agent", "eosllm"],
    color: "#34D399",
  },
  {
    layer: "EoS Services",
    items: ["eIPC", "eFlow", "OTA Manager", "App Store", "Security"],
    color: "#22D3EE",
  },
  {
    layer: "EoS Kernel",
    items: [
      "Scheduler",
      "Memory Mgr",
      "Driver Model",
      "POSIX Layer",
      "EoS Language",
    ],
    color: "#F97316",
  },
  {
    layer: "eBoot",
    items: ["Secure Boot", "Verified Chain", "OTA Staging", "Recovery Mode"],
    color: "#F59E0B",
  },
  {
    layer: "Hardware (HAL)",
    items: [
      `${FAMILY_COUNT} MCU Families`,
      "STM32 / ESP32 / nRF52 / RISC-V / i.MX RT / RPi Pico",
    ],
    color: "#60A5FA",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Products() {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const displayed = activeFamily
    ? FAMILIES.filter(f => f.id === activeFamily)
    : FAMILIES;

  return (
    <BpPage className="productspage">
      <PageHero
        sig
        label="What We Build"
        title={
          <>
            The Full <span>EmbeddedOS</span>
            <br />
            Ecosystem
          </>
        }
        lead="From the bare-metal kernel to office productivity apps, from neural interfaces to VTOL aircraft — every product the EmbeddedOS Foundation builds, in one place."
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Get Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/projects" className="btn gh">
            View All Repos{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </PageHero>

      <div className="wrap pr-stats">
        <Stats
          items={[
            { value: String(REPO_COUNT), label: "Repositories" },
            { value: "60+", label: "Applications" },
            { value: String(BOARD_COUNT), label: "Supported Boards" },
            { value: "4", label: "Health Devices" },
            { value: "2", label: "Aircraft Models" },
            { value: "300+", label: "APIs" },
          ]}
        />
      </div>

      <LocalNav
        name="Products"
        items={[
          { id: "stack", label: "Stack" },
          { id: "families", label: "Product families" },
          { id: "product-reference", label: "Product reference" },
        ]}
      />

      {/* ── Architecture diagram ── */}
      <Section
        id="stack"
        title="EmbeddedOS Stack"
        lead="Every layer, from silicon to application"
      >
        <ol className="pr-layers">
          {STACK_ROWS.map(row => (
            <li key={row.layer} style={{ "--c": row.color } as CSSProperties}>
              <span className="pr-layer">{row.layer}</span>
              <ul>
                {row.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Family filter and product family cards ── */}
      <Section id="families" className="pr-families">
        <div className="pr-filter">
          <button
            type="button"
            onClick={() => setActiveFamily(null)}
            aria-pressed={activeFamily === null}
            className="btn gh"
          >
            All Products
          </button>
          {FAMILIES.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() =>
                setActiveFamily(f.id === activeFamily ? null : f.id)
              }
              aria-pressed={activeFamily === f.id}
              className="btn gh"
              style={{ "--c": f.color } as CSSProperties}
            >
              <span className="pr-dot" aria-hidden="true" /> {f.label}
            </button>
          ))}
        </div>

        {displayed.map(family => (
          <article
            key={family.id}
            className="pr-fam"
            style={{ "--c": family.color } as CSSProperties}
          >
            {/* Family header */}
            <div className="pr-fam-text">
              <span className="st">{family.label}</span>
              <h2>{family.title}</h2>
              <p className="pr-tag">{family.tagline}</p>
              <p className="pr-desc">{family.description}</p>
              <ul className="badges">
                {family.stats.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="ctas">
                <Link href={family.href} className="btn gh">
                  Explore{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Product grid */}
            <ul className="cards two pr-prods">
              {family.products.map(p => (
                <li key={p.name}>
                  <Link
                    href={p.href}
                    className="card"
                    style={{ "--c": p.color } as CSSProperties}
                  >
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      {/* ── Per-product reference pages ── */}
      <section
        id="product-reference"
        className="sec"
        aria-labelledby="product-reference-heading"
      >
        <div className="wrap">
          <div className="sec-h">
            <h2 id="product-reference-heading">Product reference</h2>
            <p className="lead">
              One page per product, with its interfaces, configuration and
              integration points.
            </p>
          </div>
          <ul className="glinks cols">
            {PRODUCT_REFERENCE.map(p => (
              <li key={p.href}>
                <Link href={p.href}>
                  <span className="pr-rn">{p.name}</span>
                  <small>{p.note}</small>
                  <i aria-hidden="true">→</i>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <Band
        title="Ready to build with EmbeddedOS?"
        lead="Everything is open-source, MIT-licensed, and free forever. Start with the kernel, add the apps, and ship to any device."
      >
        <Link href="/getting-started" className="btn pri">
          Get Started{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/docs" className="btn gh">
          Read the Docs
        </Link>
        <Link href="/membership" className="btn gh">
          Join the Foundation
        </Link>
      </Band>
    </BpPage>
  );
}
