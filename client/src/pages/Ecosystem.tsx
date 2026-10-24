import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./Ecosystem.css";

// A layer's part: a plain name (the hardware) or a product with its page.
type LayerItem = string | { name: string; desc: string; href: string };

const layers = [
  {
    name: "Hardware",
    color: "#6B7280",
    bg: "#6B728010",
    items: [
      "ARM Cortex-M/A/R",
      "RISC-V RV32/RV64",
      "x86 / x86-64",
      "Custom SoC",
      "FPGA",
    ],
  },
  {
    name: "Kernel & Boot Layer",
    color: "#F97316",
    bg: "#F9731610",
    items: [
      {
        name: "EoS RTOS Kernel",
        desc: "Real-time kernel, capability security, SMP/AMP",
        href: "/eos",
      },
      {
        name: "eBootloader",
        desc: "5-stage verified boot, Ed25519, A/B OTA",
        href: "/eboot",
      },
    ],
  },
  {
    name: "Services Layer",
    color: "#22D3EE",
    bg: "#22D3EE10",
    items: [
      {
        name: "EIPC",
        desc: "Zero-copy IPC with capability-based access control",
        href: "/eipc",
      },
      {
        name: "eDB",
        desc: "Multi-model embedded database (SQL + Doc + KV)",
        href: "/edb",
      },
      {
        name: "EoS Platform SDK",
        desc: "Hardware abstraction, BSP, middleware",
        href: "/eos",
      },
    ],
  },
  {
    name: "AI & Intelligence Layer",
    color: "#A855F7",
    bg: "#A855F710",
    items: [
      {
        name: "EAI",
        desc: "On-device AI inference with INT4/INT8 quantisation",
        href: "/eai",
      },
      {
        name: "ENI",
        desc: "Configurable neural interface for BCI research",
        href: "/eni",
      },
    ],
  },
  {
    name: "Developer Tools Layer",
    color: "#34D399",
    bg: "#34D39910",
    items: [
      {
        name: "EoStudio IDE",
        desc: "12-editor unified development environment",
        href: "/eostudio",
      },
      {
        name: "eBuild",
        desc: "Declarative cross-compilation, 41 profiles",
        href: "/ebuild",
      },
      {
        name: "EoSim",
        desc: `${SIM_PLATFORM_COUNT}-platform in-browser simulator`,
        href: "/eosim",
      },
      {
        name: "eFlow",
        desc: "Visual block-based firmware programming",
        href: "/eflow",
      },
    ],
  },
  {
    name: "Application Layer",
    color: "#FBBF24",
    bg: "#FBBF2410",
    items: [
      {
        name: "eApps Store",
        desc: "60+ embedded applications",
        href: "/eapps",
      },
      {
        name: "eBrowser",
        desc: "Embedded HTML/CSS/JS rendering engine",
        href: "/ebrowser",
      },
      {
        name: "eOffice Suite",
        desc: "11 productivity apps for embedded displays",
        href: "/eoffice",
      },
      {
        name: "eServiceApps",
        desc: "System services and daemons",
        href: "/eserviceapps",
      },
    ],
  },
];

const products = [
  {
    color: "#F97316",
    name: "EoS",
    tagline: "Core RTOS Kernel",
    metrics: [`${BOARD_COUNT} boards`, "ARM · RISC-V · x86", "C11 standard"],
    href: "/eos",
  },
  {
    color: "#22D3EE",
    name: "eBootloader",
    tagline: "Secure Boot Chain",
    metrics: ["Ed25519 signatures", "A/B updates", "<64KB footprint"],
    href: "/eboot",
  },
  {
    color: "#A855F7",
    name: "EAI",
    tagline: "AI Inference Engine",
    metrics: ["INT8/INT4 quant", "CMSIS-NN accelerated", "256KB min RAM"],
    href: "/eai",
  },
  {
    color: "#34D399",
    name: "ENI",
    tagline: "Neural Interface",
    metrics: [
      "Configurable channels",
      "Hardware-defined sample rate",
      "Front-end-defined ADC",
    ],
    href: "/eni",
  },
  {
    color: "#FBBF24",
    name: "EIPC",
    tagline: "IPC Bus",
    metrics: ["Zero-copy transport", "Capability tokens", "Shared memory"],
    href: "/eipc",
  },
  {
    color: "#F472B6",
    name: "eBuild",
    tagline: "Build System",
    metrics: ["41 profiles", "Cross-compile", "Declarative TOML"],
    href: "/ebuild",
  },
  {
    color: "#60A5FA",
    name: "EoStudio",
    tagline: "IDE",
    metrics: ["12 editors", "AI tutor", "Real-time debug"],
    href: "/eostudio",
  },
  {
    color: "#34D399",
    name: "eFlow",
    tagline: "Visual Programming",
    metrics: ["20+ block types", "CAD import", "No-code firmware"],
    href: "/eflow",
  },
  // Project pages with no footer column. /ecosystem is the footer's hub for
  // them, so the grid names every one — see tests/unit/navigation.test.ts.
  {
    color: "#22D3EE",
    name: "eAI Edge",
    tagline: "Edge AI Deployment",
    metrics: ["eNI + eIPC + eAI", "One-command stack"],
    href: "/eai-edge",
  },
  {
    color: "#FB923C",
    name: "Development Boards",
    tagline: "Original EoS Board Designs",
    metrics: ["KiCad designs", "ERC + DRC checked"],
    href: "/eos-boards",
  },
  {
    color: "#F472B6",
    name: "eCAD Hardware",
    tagline: "Open Hardware Designs",
    metrics: ["CAD files", "eCAD products"],
    href: "/ecad-hardware",
  },
  {
    color: "#60A5FA",
    name: "Aerospace",
    tagline: "Aerospace Concepts",
    metrics: ["VTOL concept family", "Avionics research"],
    href: "/aerospace",
  },
  {
    color: "#F85149",
    name: "Health",
    tagline: "Health Device Concepts",
    metrics: ["Wearable concepts", "Health research"],
    href: "/health",
  },
  {
    color: "#A78BFA",
    name: "Health Compare",
    tagline: "Compare Health Concepts",
    metrics: ["4 health concepts", "Side-by-side reference"],
    href: "/health-compare",
  },
  {
    color: "#A855F7",
    name: "Neural Link AI",
    tagline: "Neural Interface Research",
    metrics: ["BCI research", "eNI-powered"],
    href: "/neural-link-ai",
  },
  {
    color: "#34D399",
    name: "Flow Editor",
    tagline: "Visual Block Editor",
    metrics: ["Block library", "Pipeline examples"],
    href: "/flow",
  },
  {
    color: "#F97316",
    name: "eHealth365",
    tagline: "Health Platform",
    metrics: ["Device concepts", "Health research"],
    href: "/ehealth365",
  },
  {
    color: "#22D3EE",
    name: "eRadar360",
    tagline: "Radar Platform",
    metrics: ["Illustrative simulation", "Research prototype"],
    href: "/eradar360",
  },
  {
    color: "#E4405F",
    name: "YouTube",
    tagline: "Video Channel",
    metrics: ["Talks", "Demos"],
    href: "/youtube",
  },
];

export default function EcosystemPage() {
  return (
    <BpPage className="ecopage">
      <PageHero
        sig
        label="PRODUCT ECOSYSTEM"
        title="The EmbeddedOS Ecosystem"
        lead="14 open-source products built to work together — from bare-metal kernel to AI inference engine to full IDE. Every layer of the embedded stack, free forever."
      />

      {/* Architecture Layers */}
      <Section title="Full-Stack Embedded Platform">
        <ol className="eco-layers">
          {layers.map(layer => (
            <li
              key={layer.name}
              style={{ "--c": layer.color } as CSSProperties}
            >
              <div className="eco-lname">{layer.name}</div>
              <ul className="eco-items">
                {(layer.items as LayerItem[]).map(item =>
                  typeof item === "string" ? (
                    <li key={item}>
                      <span className="eco-chip">{item}</span>
                    </li>
                  ) : (
                    <li key={item.name}>
                      <Link href={item.href} className="eco-link">
                        <span className="eco-n">{item.name}</span>
                        <span className="eco-d">{item.desc}</span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* All Products Grid */}
      <Section title="Every Product, Explained">
        <ul className="cards four">
          {products.map(p => (
            <li key={p.name}>
              <Link
                href={p.href}
                className="card"
                style={{ "--c": p.color } as CSSProperties}
              >
                <h3>{p.name}</h3>
                <p className="eco-tag">{p.tagline}</p>
                <ul className="eco-metrics">
                  {p.metrics.map(m => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Start Building"
        lead="Use one product or the entire stack — everything is MIT licensed and free forever."
      >
        <Link href="/getting-started" className="btn pri">
          Get Started{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/products" className="btn gh">
          All Products
        </Link>
      </Band>
    </BpPage>
  );
}
