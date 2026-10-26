import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Downloads.css";

/** An anchor id for a category: "AI & Neural" → "ai-neural". */
const categoryId = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const INSTALL = [
  {
    step: "1",
    title: "Clone the repo",
    code: "git clone https://github.com/embeddedos-org/eos",
  },
  {
    step: "2",
    title: "Initialize your project",
    code: "ebuild init my-project --board stm32f4",
  },
  {
    step: "3",
    title: "Build and flash",
    code: "ebuild build && ebuild flash",
  },
];

const DOWNLOADS = [
  {
    category: "Core Platform",
    color: "#F97316",
    items: [
      {
        name: "EmbeddedOS Kernel",
        version: "v1.0.0",
        description: `The core EoS real-time kernel — HAL, scheduler, memory manager, IPC, and device drivers for ${BOARD_COUNT} boards.`,
        size: "2.4 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos",
        tags: ["ARM", "RISC-V", "MIPS", "x86"],
      },
      {
        name: "eBoot Bootloader",
        version: "v1.0.0",
        description:
          "Secure bootloader with chain-of-trust, OTA update support, anti-rollback counters, and signed manifests.",
        size: "512 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eboot",
        tags: ["Secure Boot", "OTA", "ARM"],
      },
      {
        name: "eos-platform",
        version: "v1.0.0",
        description: `Meta-distribution: one toolchain, every EoS profile. Unified package manifest for ${BOARD_COUNT} supported boards.`,
        size: "18 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos",
        tags: ["Toolchain", "Cross-compile", "All Boards"],
      },
    ],
  },
  {
    category: "Developer Tools",
    color: "#22D3EE",
    items: [
      {
        name: "EoSim Simulator",
        version: "v2.0.0",
        description: `In-browser and CLI platform simulator for ${SIM_PLATFORM_COUNT} embedded targets. Full GPIO, UART, SPI, I²C peripheral emulation and GDB integration.`,
        size: "8.1 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/EoSim",
        tags: ["Simulator", "GDB", `${SIM_PLATFORM_COUNT} Platforms`],
      },
      {
        name: "EoStudio IDE",
        version: "v3.1.0",
        description:
          "Universal embedded IDE with 10 specialized editors, AI code tutor, 3D hardware modeler, and cross-compilation for ARM, RISC-V, and MIPS.",
        size: "124 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/EoStudio",
        tags: ["IDE", "AI Tutor", "Cross-compile"],
      },
      {
        name: "eBuild Build System",
        version: "v1.0.0",
        description:
          "Declarative build system for EoS projects. CAD analysis, hardware simulation, firmware generation, and one-command flash.",
        size: "3.2 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/ebuild",
        tags: ["Build", "CAD", "Flash"],
      },
    ],
  },
  {
    category: "AI & Neural",
    color: "#A78BFA",
    items: [
      {
        name: "eAI Engine",
        version: "v0.9.0",
        description:
          "On-device AI inference engine for embedded systems. Supports TensorFlow Lite, ONNX Runtime, and INT4/INT8 quantized LLMs on Cortex-M and RISC-V.",
        size: "1.8 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eAI",
        tags: ["TFLite", "ONNX", "INT4 LLM"],
      },
      {
        name: "eNI Neural Interface",
        version: "v0.8.0",
        description:
          "Hardware abstraction layer for configuration-specific EEG, EMG, ECoG, and spike-sorting research pipelines.",
        size: "920 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eNI",
        tags: ["BCI", "EEG", "EMG", "Spike Sort"],
      },
      {
        name: "eosllm",
        version: "v0.5.0",
        description:
          "On-device LLM inference for resource-constrained embedded devices. Runs on 256 KB RAM with streaming token generation.",
        size: "640 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eosllm",
        tags: ["LLM", "256KB RAM", "Streaming"],
      },
    ],
  },
  {
    category: "Applications & Services",
    color: "#34D399",
    items: [
      {
        name: "eOffice Suite",
        version: "v1.0.0",
        description:
          "11-app productivity suite for embedded displays: eWriter, eSheet, ePresent, eNotes, eDraw, eCalc, eCalendar, eContacts, eMail, eChat, eFiles.",
        size: "22 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eoffice",
        tags: ["11 Apps", "Productivity", "Embedded UI"],
      },
      {
        name: "eApps Store (60+ apps)",
        version: "v1.0.0",
        description:
          "Full catalog of 60+ EoS applications across 6 categories: Productivity, Media, Communication, Utilities, Developer Tools, and System.",
        size: "Varies",
        license: "MIT",
        github: "https://github.com/embeddedos-org",
        tags: ["60+ Apps", "App Store", "6 Categories"],
      },
      {
        name: "eDB Database",
        version: "v0.9.0",
        description:
          "Multi-model embedded database: SQL, Document, Key-Value, REST API, and AI queries. AES-XTS at-rest encryption. Fits in 64 KB.",
        size: "380 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/edb",
        tags: ["SQL", "Document", "AES-XTS"],
      },
    ],
  },
  {
    category: "Health & Devices",
    color: "#F472B6",
    items: [
      {
        name: "EoS Health Firmware",
        version: "v1.0.0",
        description:
          "Firmware stack for the 4 EmbeddedOS health devices: HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, and HEALTH-LAB. Includes biosensor drivers, BLE stack, and cloud sync.",
        size: "4.8 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eos-health",
        tags: ["ECG", "SpO₂", "BLE", "4 Devices"],
      },
      {
        name: "EoS Aerospace Avionics",
        version: "v0.8.0",
        description:
          "Avionics research firmware for the AeroSwift concept platform. DO-178C is a target standard; the software is not certified for flight.",
        size: "6.2 MB",
        license: "MIT",
        // eos-aero is a private repo — link the org profile until it is published.
        github: "https://github.com/embeddedos-org",
        tags: ["DO-178C", "VTOL", "Avionics"],
      },
    ],
  },
  {
    category: "Protocols & Middleware",
    color: "#F97316",
    items: [
      {
        name: "eIPC Protocol",
        version: "v1.0.0",
        description:
          "IPC protocol with wire format, CBOR codec, HMAC-SHA256 security, and transport-dependent latency.",
        size: "210 KB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/eipc",
        tags: ["IPC", "CBOR", "HMAC", "Multi-Transport"],
      },
      {
        name: "eBrowser Engine",
        version: "v0.7.0",
        description:
          "Embedded web browser engine with full HTML5/CSS3/JS support, WebAssembly runtime, and hardware-accelerated rendering for embedded displays.",
        size: "14 MB",
        license: "MIT",
        github: "https://github.com/embeddedos-org/ebrowser",
        tags: ["HTML5", "CSS3", "WASM", "GPU"],
      },
    ],
  },
];

export default function Downloads() {
  return (
    <BpPage className="dls">
      <PageHero
        sig
        label="Downloads"
        title={
          <>
            Everything EmbeddedOS, <span>MIT Licensed</span>
          </>
        }
        lead="Every component of the EmbeddedOS ecosystem is free and open-source under the MIT License. Download directly from GitHub — no registration, no paywalls."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            Browse All Repos{" "}
            <span className="ar" aria-hidden="true">
              ↗
            </span>
          </a>
          <Link href="/getting-started" className="btn gh">
            Get Started Guide{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </PageHero>
      <LocalNav
        name="Downloads"
        items={[
          ...DOWNLOADS.map(c => ({
            id: categoryId(c.category),
            label: c.category,
          })),
          { id: "quick-install", label: "Quick Install" },
          { id: "license", label: "MIT License" },
        ]}
      />

      {/* Download Categories */}
      {DOWNLOADS.map(category => (
        <Section
          key={category.category}
          id={categoryId(category.category)}
          className="dl-cat"
        >
          <h2
            className="dl-ch"
            style={{ "--c": category.color } as CSSProperties}
          >
            {category.category}
          </h2>
          <ul className="dl-list">
            {category.items.map(item => (
              <li key={item.name} className="dl-item">
                <div className="dl-name">
                  <h3>{item.name}</h3>
                  <span className="dl-ver">{item.version}</span>
                </div>
                <div className="dl-about">
                  <p>{item.description}</p>
                  <ul className="dl-tags">
                    {item.tags.map(tag => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <div className="dl-meta">
                  <dl>
                    <dt>Size</dt>
                    <dd>{item.size}</dd>
                  </dl>
                  <p className="dl-lic">{item.license} License</p>
                </div>
                <a
                  href={item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn gh dl-get"
                >
                  Download{" "}
                  <span className="ar" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      {/* Install Instructions */}
      <Section
        id="quick-install"
        title="Quick Install"
        lead="Get started with EmbeddedOS in under 5 minutes"
        split
      >
        <ol className="steps num dl-steps">
          {INSTALL.map(s => (
            <li key={s.step}>
              <span className="n">{s.step}</span>
              <div>
                <h3>{s.title}</h3>
                <div className="code">
                  <pre tabIndex={0}>
                    <code>{s.code}</code>
                  </pre>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p className="dl-more">
          <Link href="/getting-started" className="btn ln">
            Full Getting Started Guide{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </Section>

      {/* License Notice */}
      <Section id="license" title="MIT License">
        <div className="prose dl-license">
          <p>
            All EmbeddedOS software is released under the MIT License. You are
            free to use, copy, modify, merge, publish, distribute, sublicense,
            and/or sell copies of the software, subject to the copyright notice
            and permission notice appearing in all copies.
          </p>
          <p>
            <Link href="/licenses" className="tl">
              View full license text
            </Link>
          </p>
        </div>
      </Section>
    </BpPage>
  );
}
