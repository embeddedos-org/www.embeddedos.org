import { Suspense, lazy, type CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, ARCH_COUNT, boardsLabel } from "@/data/stack";
import ViewportGate from "../components/ViewportGate";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EoS.css";
const EoSKernelCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EoSKernelCanvas }))
);

const LAYERS = [
  {
    name: "Applications",
    color: "#A78BFA",
    items: ["eOffice", "eBrowser", "eDB", "60+ eApps", "Custom Apps"],
  },
  {
    name: "AI / ENI Layer",
    color: "#34D399",
    items: ["EAI Engine", "ENI Adapter", "eBot", "eosllm"],
  },
  {
    name: "EoS Services",
    color: "#22D3EE",
    items: ["eIPC", "OTA Manager", "App Store", "Security Manager", "eFlow"],
  },
  {
    name: "EoS Kernel",
    color: "#F97316",
    items: [
      "RTOS Scheduler",
      "Memory Manager",
      "Driver Model",
      "POSIX Layer",
      "EoS Language API",
    ],
  },
  {
    name: "eBoot",
    color: "#F59E0B",
    items: ["Secure Boot", "Verified Chain", "OTA Staging", "Recovery"],
  },
  {
    name: "Hardware (HAL)",
    color: "#60A5FA",
    items: [
      "STM32",
      "ESP32",
      "nRF52",
      "RISC-V",
      "i.MX RT",
      "RPi Pico",
      `${BOARD_COUNT - 6} more`,
    ],
  },
];

const FEATURES = [
  {
    color: "#F97316",
    title: "Deterministic Scheduling",
    desc: "Fixed-priority preemptive scheduling with configurable tick rates, so worst-case response is bounded rather than average.",
  },
  {
    color: "#34D399",
    title: "Secure Boot Chain",
    desc: "eBoot verifies every stage cryptographically. Tampered firmware cannot run.",
  },
  {
    color: "#22D3EE",
    title: "Modular Driver Model",
    desc: "Add or remove drivers without recompiling the kernel. Hot-plug on supported platforms.",
  },
  {
    color: "#A78BFA",
    title: "POSIX-Compatible API",
    desc: "Port existing POSIX applications to EoS with minimal changes. Standard threads, mutexes, and sockets.",
  },
  {
    color: "#F59E0B",
    title: "EoS Language",
    desc: "A low-overhead embedded API surface — direct memory-mapped register access with type safety.",
  },
  {
    color: "#60A5FA",
    title: `${BOARD_COUNT} Board Definitions`,
    desc: `STM32, ESP32, nRF52, RISC-V, i.MX RT, Raspberry Pi Pico and ${BOARD_COUNT - 6} more, spanning ${ARCH_COUNT} instruction-set architectures.`,
  },
];

const BOARDS = [
  "STM32F4 / F7 / H7",
  "ESP32 / ESP32-S3",
  "nRF52840",
  "RISC-V (GD32VF103)",
  "i.MX RT1060",
  "Raspberry Pi Pico",
  "Nordic nRF9160",
  "Renesas RA6M5",
  "TI CC2652",
  "Microchip SAME70",
];

export default function EoS() {
  return (
    <BpPage className="eospage">
      <PageHero
        label="EoS Kernel"
        title={
          <>
            EmbeddedOS
            <br />
            <span>Kernel</span>
          </>
        }
        lead={
          <>
            A deterministic, real-time operating system kernel built for
            resource-constrained devices. Fixed-priority preemptive scheduling,
            a modular driver model, a POSIX-compatible API, and{" "}
            {boardsLabel(true)}.
          </>
        }
        visual={
          <div className="eos-vis">
            {/* The 3D kernel on a large stage; it loads only near the viewport. */}
            <div className="board stage">
              <Suspense fallback={<div className="stage-wait" />}>
                <ViewportGate>
                  <EoSKernelCanvas hovered={false} />
                </ViewportGate>
              </Suspense>
            </div>
            <div className="code eos-arch">
              <div className="cbar">
                <b>eos-architecture.d</b>
              </div>
              <ol className="eos-layers">
                {LAYERS.map(layer => (
                  <li
                    key={layer.name}
                    style={{ "--c": layer.color } as CSSProperties}
                  >
                    <span className="eos-layer">{layer.name}</span>
                    <ul>
                      {layer.items.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        }
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Get Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/docs" className="btn gh">
            API Reference
          </Link>
        </div>
      </PageHero>

      <Section
        title="Kernel Features"
        lead="What makes EoS different from other RTOS platforms"
      >
        <ul className="cards">
          {FEATURES.map(f => (
            <li key={f.title}>
              <div className="card">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title={<>{BOARD_COUNT} Supported Boards</>}
        lead="From hobbyist boards to industrial MCUs"
      >
        <ul className="eos-boards">
          {BOARDS.map(b => (
            <li key={b}>{b}</li>
          ))}
          <li className="more">+ 42 more →</li>
        </ul>
        <p className="eos-all">
          <Link href="/hardware-lab" className="btn ln">
            View all boards{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </Section>

      <Band
        title="Try EoS on your board"
        lead={
          <>
            Flash EoS to any of {BOARD_COUNT} supported boards, or try EoSim to
            simulate without hardware.
          </>
        }
      >
        <Link href="/getting-started" className="btn pri">
          Flash Your Board{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/demo" className="btn gh">
          Try EoSim
        </Link>
        <Link href="/product-eos" className="btn gh">
          EoS engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
