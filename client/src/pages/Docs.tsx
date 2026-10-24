import type { CSSProperties } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { Band, BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Docs.css";

const DOC_SECTIONS = [
  {
    title: "Core Platform",
    color: "#F97316",
    items: [
      {
        name: "EOS Kernel",
        desc: "Real-time kernel API, task scheduling, memory management",
        href: "https://github.com/embeddedos-org/EoS",
        external: true,
      },
      {
        name: "eBoot",
        desc: "Secure bootloader, OTA updates, hardware attestation",
        href: "https://github.com/embeddedos-org/eBoot",
        external: true,
      },
      {
        name: "EIPC",
        desc: "Inter-process communication, message queues, shared memory",
        href: "https://github.com/embeddedos-org/eIPC",
        external: true,
      },
      {
        name: "eSec",
        desc: "Cryptography, secure storage, hardware security modules",
        href: "https://github.com/embeddedos-org/EoS",
        external: true,
      },
      {
        name: "eNet",
        desc: "Networking stack, TCP/IP, MQTT, CoAP, WiFi, BLE",
        href: "https://github.com/embeddedos-org/EoS",
        external: true,
      },
    ],
  },
  {
    title: "AI & Neural",
    color: "#34D399",
    items: [
      {
        name: "eAI Edge",
        desc: "On-device AI inference, TensorFlow Lite, ONNX runtime",
        href: "https://github.com/embeddedos-org/eAI",
        external: true,
      },
      {
        name: "eAI Neural",
        desc: "Neural network training, model optimization, quantization",
        href: "https://github.com/embeddedos-org/eNI",
        external: true,
      },
    ],
  },
  {
    title: "Applications & Tools",
    color: "#22D3EE",
    items: [
      {
        name: "eApps",
        desc: "60+ embedded applications, LVGL UI framework, SDL2 port",
        href: "/eapps",
        external: false,
      },
      {
        name: "eDB",
        desc: "Embedded SQL database, flash optimization, low-RAM mode",
        href: "https://github.com/embeddedos-org/eApps",
        external: true,
      },
      {
        name: "eBrowser",
        desc: "Minimal web engine, CSS support, JavaScript runtime",
        href: "https://github.com/embeddedos-org/eApps",
        external: true,
      },
      {
        name: "eOffice",
        desc: "11 office applications, document formats, collaboration",
        href: "https://github.com/embeddedos-org/eApps",
        external: true,
      },
    ],
  },
  {
    title: "Simulation & Dev Tools",
    color: "#A78BFA",
    items: [
      {
        name: "EoSim",
        desc: `Hardware simulator, ${SIM_PLATFORM_COUNT} platforms, GPIO/UART/SPI/I2C simulation`,
        href: "https://github.com/embeddedos-org/EoSim",
        external: true,
      },
      {
        name: "EoStudio",
        desc: "All-in-one IDE, 3D modeler, game editor, AI tutor",
        href: "https://github.com/embeddedos-org/EoStudio",
        external: true,
      },
      {
        name: "ebuild",
        desc: "Build system, cross-compilation, package management",
        href: "https://github.com/embeddedos-org/ebuild",
        external: true,
      },
    ],
  },
];

const QUICK_REF = [
  {
    api: "eos_task_create()",
    module: "EOS Kernel",
    desc: "Create a new RTOS task",
  },
  {
    api: "eos_mutex_lock()",
    module: "EOS Kernel",
    desc: "Acquire a mutex lock",
  },
  { api: "eipc_channel_open()", module: "EIPC", desc: "Open an IPC channel" },
  {
    api: "eai_model_load()",
    module: "eAI Edge",
    desc: "Load a neural network model",
  },
  { api: "esec_encrypt()", module: "eSec", desc: "Encrypt data with AES-256" },
  {
    api: "enet_socket_create()",
    module: "eNet",
    desc: "Create a network socket",
  },
  { api: "edb_query()", module: "eDB", desc: "Execute a SQL query" },
  {
    api: "eboot_update_start()",
    module: "eBoot",
    desc: "Initiate OTA firmware update",
  },
];

/** An anchor id for a documentation group: "AI & Neural" → "ai-neural". */
const groupId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Docs() {
  return (
    <BpPage className="docs">
      <PageHero
        sig
        label="Documentation"
        title={
          <>
            EmbeddedOS <span>Documentation</span>
          </>
        }
        lead="Complete API reference, guides, and examples for all 14 EmbeddedOS components. 300+ APIs documented with code examples."
      >
        <div className="dc-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search documentation..."
            aria-label="Search documentation"
            onFocus={() => {
              const e = new CustomEvent("open-search");
              window.dispatchEvent(e);
            }}
            readOnly
          />
          <kbd>Ctrl+K</kbd>
        </div>
      </PageHero>
      <LocalNav
        name="Documentation"
        items={[
          ...DOC_SECTIONS.map(s => ({ id: groupId(s.title), label: s.title })),
          { id: "quick-reference", label: "Quick API Reference" },
        ]}
      />

      {/* Every component, grouped */}
      <Section className="dc-dir" ariaLabel="Components">
        {DOC_SECTIONS.map(section => (
          <div
            key={section.title}
            id={groupId(section.title)}
            className="dc-group"
            style={{ "--c": section.color } as CSSProperties}
          >
            <h2>{section.title}</h2>
            <ul className="cards two">
              {section.items.map(item => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card dc-item"
                    >
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                      <i aria-hidden="true">↗</i>
                    </a>
                  ) : (
                    <Link href={item.href} className="card dc-item">
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                      <i aria-hidden="true">→</i>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Quick Reference Table */}
      <Section
        id="quick-reference"
        title="Quick API Reference"
        lead="Commonly used APIs across the EmbeddedOS ecosystem."
        split
      >
        <div
          className="tbl"
          tabIndex={0}
          role="region"
          aria-label="Quick API Reference table"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">API</th>
                <th scope="col">Module</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {QUICK_REF.map(row => (
                <tr key={row.api}>
                  <td>
                    <code>{row.api}</code>
                  </td>
                  <td>{row.module}</td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* CTA */}
      <Band
        title="Ready to Start Building?"
        lead="Follow the Getting Started guide to set up your development environment."
      >
        <Link href="/getting-started" className="btn pri">
          Get Started{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
      </Band>
    </BpPage>
  );
}
