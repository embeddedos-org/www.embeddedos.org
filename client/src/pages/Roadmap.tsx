import type { CSSProperties } from "react";
import { Link } from "wouter";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import "./Roadmap.css";

/** An anchor id for a phase: "v0.1.x" → "v0-1-x". */
const phaseId = (version: string) => version.replace(/\./g, "-");

const phases = [
  {
    version: "v0.1.x",
    label: "Current Release",
    status: "in-progress",
    color: "#F97316",
    quarter: "Active Now",
    description:
      "Foundation: kernel, bootloader, build system, AI inference, and core developer tools.",
    items: [
      {
        done: true,
        text: "EoS RTOS kernel — ARM Cortex-M/A, RISC-V, x86 support",
      },
      {
        done: true,
        text: "eBootloader — 5-stage verified boot, Ed25519 signatures, A/B OTA",
      },
      {
        done: true,
        text: "eBuild — declarative cross-compilation, 41 product profiles",
      },
      {
        done: true,
        text: "EAI v0.1 — INT8/INT4 inference, CMSIS-NN, Helium MVE",
      },
      {
        done: true,
        text: "eAI Edge v0.1 profile — bundles eNI, EIPC, and eAI",
      },
      {
        done: true,
        text: "EIPC v0.1 — capability tokens and zero-copy IPC",
      },
      {
        done: true,
        text: "EoStudio IDE — 12-editor unified development environment",
      },
      {
        done: true,
        text: `EoSim — ${SIM_PLATFORM_COUNT}-platform in-browser simulator`,
      },
      {
        done: false,
        text: "eDB v0.1 — multi-model embedded database (SQL + Document + KV)",
      },
      {
        done: false,
        text: "eBrowser v0.1 — embedded HTML/CSS/JS rendering engine",
      },
      {
        done: false,
        text: "eOffice Suite v0.1 — 11 productivity apps for embedded displays",
      },
    ],
  },
  {
    version: "v0.2.x",
    label: "Next Release",
    status: "planned",
    color: "#22D3EE",
    quarter: "Q3 2026",
    description:
      "Networking, health firmware, radar pipeline, and advanced AI inference on Cortex-M85.",
    items: [
      {
        done: false,
        text: "EoS SMP scheduler improvements — work-stealing, NUMA awareness",
      },
      {
        done: false,
        text: "EAI v0.2 — transformer support, LLM inference at <1ms on Cortex-M85",
      },
      {
        done: false,
        text: "eFlow v0.2 — visual block editor with CAD schematic import",
      },
      {
        done: false,
        text: "eHealth365 firmware v0.1 — Smart Ring Pro + Smart Patch Pro",
      },
      {
        done: false,
        text: "eRadar360 Aegis One firmware v0.1 — 77 GHz FMCW radar pipeline",
      },
      {
        done: false,
        text: "EoSim v0.2 — hardware-in-the-loop (HIL) simulation support",
      },
      {
        done: false,
        text: "Package manager — eos-pkg for distributing EoS applications",
      },
      {
        done: false,
        text: "Networking stack — lwIP integration, TLS 1.3, MQTT, CoAP",
      },
    ],
  },
  {
    version: "v0.3.x",
    label: "Future Release",
    status: "planned",
    color: "#A855F7",
    quarter: "Q1 2027",
    description:
      "Post-quantum cryptography, formal verification, federated learning, and safety certifications.",
    items: [
      {
        done: false,
        text: "Post-quantum cryptography — CRYSTALS-Kyber, CRYSTALS-Dilithium",
      },
      {
        done: false,
        text: "Formal verification — seL4-style capability proof for EoS kernel",
      },
      {
        done: false,
        text: "EAI v0.3 — on-device fine-tuning, federated learning runtime",
      },
      {
        done: false,
        text: "eHealth365 v0.2 — FDA 510(k) pre-submission documentation",
      },
      {
        done: false,
        text: "eRadar360 v0.2 — NHTSA NCAP testing, SAE J3016 L2 ADAS support",
      },
      {
        done: false,
        text: "EoStudio v0.2 — AI pair programmer, real-time hardware debugger",
      },
      {
        done: false,
        text: "Certification artifacts — DO-178C DAL-C, IEC 61508 SIL-2 evidence",
      },
    ],
  },
  {
    version: "v1.0",
    label: "Production Ready",
    status: "vision",
    color: "#34D399",
    quarter: "2027",
    description:
      "Safety-critical certification, POSIX compliance, FDA clearance, and 10,000+ free certifications.",
    items: [
      {
        done: false,
        text: "Safety-critical certification — DO-178C DAL-A, IEC 61508 SIL-3",
      },
      { done: false, text: "Full POSIX compliance layer for EoS" },
      {
        done: false,
        text: "EAI v1.0 — production-grade on-device LLM with <10ms TTFT",
      },
      {
        done: false,
        text: "ENI v1.0 — FDA Breakthrough Device designation for BCI applications",
      },
      {
        done: false,
        text: "eHealth365 v1.0 — CE Mark + FDA clearance for Smart Ring Pro",
      },
      {
        done: false,
        text: "Long-term support (LTS) release with 5-year security maintenance",
      },
      {
        done: false,
        text: "10,000+ free certifications issued to engineers worldwide",
      },
    ],
  },
];

export default function Roadmap() {
  return (
    <BpPage className="rmap">
      <PageHero
        sig
        label="PUBLIC ROADMAP"
        title={
          <>
            EmbeddedOS <span>Roadmap</span>
          </>
        }
        lead="Our public development roadmap — from v0.1 to v1.0 production-ready. Built transparently, shipped incrementally."
      >
        {/* Phase summary */}
        <ul className="badges rm-pills">
          {phases.map(p => (
            <li
              key={p.version}
              className="dot"
              style={{ "--c": p.color } as CSSProperties}
            >
              {p.version} · {p.quarter}
            </li>
          ))}
        </ul>
      </PageHero>
      <LocalNav
        name="Roadmap"
        items={phases.map(p => ({ id: phaseId(p.version), label: p.version }))}
      />

      {/* Timeline */}
      <section className="sec rm-tl" aria-label="Roadmap phases">
        <div className="wrap">
          <ol className="rm-phases">
            {phases.map(phase => {
              const doneCount = phase.items.filter(i => i.done).length;
              const progress = Math.round(
                (doneCount / phase.items.length) * 100
              );

              return (
                <li
                  key={phase.version}
                  id={phaseId(phase.version)}
                  className="rm-phase"
                  style={{ "--c": phase.color } as CSSProperties}
                >
                  <div className="rm-ph">
                    <div className="rm-pv">
                      <span className="rm-ver">{phase.version}</span>
                      <span className="st">
                        {phase.status.replace("-", " ")}
                      </span>
                    </div>
                    <h2>{phase.label}</h2>
                    <p className="rm-q">{phase.quarter}</p>
                    <p className="rm-d">{phase.description}</p>
                    <div className="rm-prog">
                      <div className="rm-pt">
                        <span>
                          {doneCount}/{phase.items.length} complete
                        </span>
                        <b>{progress}%</b>
                      </div>
                      <div
                        className="rm-bar"
                        role="progressbar"
                        aria-label={`${phase.version} progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                      >
                        <i style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <ul className="rm-items">
                    {phase.items.map(item => (
                      <li
                        key={item.text}
                        className={item.done ? "done" : undefined}
                      >
                        {item.done && <span className="sr-only">Done: </span>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="band">
        <div className="wrap">
          <div className="rm-bt">
            <p className="label rm-chip">Open Source · Community Driven</p>
            <h2>Shape the Roadmap</h2>
            <p className="lead">
              Have a feature request, bug report, or want to contribute? Every
              issue and PR helps define what ships next.
            </p>
          </div>
          <div className="ctas">
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn pri"
            >
              Open an Issue{" "}
              <span className="ar" aria-hidden="true">
                ↗
              </span>
            </a>
            <Link href="/get-involved" className="btn gh">
              Get Involved{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
