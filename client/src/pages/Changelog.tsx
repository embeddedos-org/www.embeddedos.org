import type { CSSProperties } from "react";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import "./Changelog.css";

const releases = [
  {
    version: "v0.1.9",
    date: "2026-06-15",
    type: "minor",
    changes: [
      {
        type: "feat",
        text: "EAI: Add INT4 quantization support for Cortex-M85 with Helium MVE",
      },
      {
        type: "feat",
        text: "EoS: Add RISC-V RV64 SMP support (up to 8 cores)",
      },
      {
        type: "feat",
        text: "eBootloader: Add ECDSA P-256 signature verification as alternative to Ed25519",
      },
      {
        type: "fix",
        text: "EoS scheduler: Fix priority inversion in mutex implementation",
      },
      {
        type: "fix",
        text: "EIPC: Fix race condition in zero-copy shared memory handoff",
      },
      {
        type: "perf",
        text: "EAI: Reduce INT8 inference latency by 23% on Cortex-M55",
      },
    ],
  },
  {
    version: "v0.1.8",
    date: "2026-04-20",
    type: "minor",
    changes: [
      {
        type: "feat",
        text: "ENI: Add 512-channel mode for lower-power BCI applications",
      },
      {
        type: "feat",
        text: "eBuild: Add 8 new product profiles (drone, medical sensor, industrial gateway)",
      },
      {
        type: "feat",
        text: "EoStudio: Add real-time memory profiler and stack usage visualizer",
      },
      {
        type: "fix",
        text: "eBootloader: Fix A/B partition selection on cold boot after power loss",
      },
      {
        type: "security",
        text: "EoS crypto: Fix timing side-channel in AES-256-GCM key schedule",
      },
    ],
  },
  {
    version: "v0.1.7",
    date: "2026-02-10",
    type: "minor",
    changes: [
      {
        type: "feat",
        text: "EoSim: Add 15 new platform profiles (ESP32-S3, RP2040, STM32H7)",
      },
      {
        type: "feat",
        text: "eFlow: Add CAD schematic import from KiCad .kicad_sch format",
      },
      {
        type: "feat",
        text: "EAI: Add transformer model support (BERT-tiny, DistilBERT)",
      },
      {
        type: "fix",
        text: "EoS: Fix stack overflow detection on Cortex-M0+ without MPU",
      },
      {
        type: "perf",
        text: "EIPC: Reduce IPC latency from 1.2μs to 0.8μs on Cortex-M7",
      },
    ],
  },
  {
    version: "v0.1.6",
    date: "2025-11-30",
    type: "minor",
    changes: [
      {
        type: "feat",
        text: "EoS: Add AMP (asymmetric multiprocessing) support for heterogeneous SoCs",
      },
      {
        type: "feat",
        text: "eDB: Initial release — SQL + Document + Key-Value store in <32KB flash",
      },
      {
        type: "feat",
        text: "eBuild: Add Nix flake support for reproducible builds",
      },
      {
        type: "fix",
        text: "ENI: Fix ADC calibration drift after 72+ hours of continuous operation",
      },
      {
        type: "security",
        text: "eBootloader: Add hardware rollback counter support for STM32 OTP fuses",
      },
    ],
  },
];

const typeConfig: Record<string, { color: string; label: string }> = {
  feat: { color: "#34D399", label: "Feature" },
  fix: { color: "#F97316", label: "Fix" },
  perf: { color: "#22D3EE", label: "Performance" },
  security: { color: "#EF4444", label: "Security" },
};

/** An anchor id for a release: "v0.1.9" → "v0-1-9". */
const releaseId = (version: string) => version.replace(/\./g, "-");

export default function Changelog() {
  return (
    <BpPage className="chlog">
      <PageHero
        sig
        label="CHANGELOG"
        title="Changelog"
        lead="Release history for all EmbeddedOS products."
      />
      <LocalNav
        name="Changelog"
        items={releases.map(r => ({
          id: releaseId(r.version),
          label: r.version,
        }))}
      />

      <section className="sec cl-list" aria-label="Releases">
        <div className="wrap">
          <ol className="cl-rels">
            {releases.map(r => (
              <li key={r.version} id={releaseId(r.version)} className="cl-rel">
                <div className="cl-h">
                  <h2>{r.version}</h2>
                  <span className="cl-date">{r.date}</span>
                  <a
                    href={"https://github.com/embeddedos-org"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tl cl-gh"
                  >
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <ul className="cl-chg">
                  {r.changes.map((c, ci) => {
                    const cfg = typeConfig[c.type] || typeConfig.feat;
                    return (
                      <li key={ci}>
                        <span
                          className="cl-t"
                          style={{ "--c": cfg.color } as CSSProperties}
                        >
                          {cfg.label}
                        </span>
                        <span className="cl-x">{c.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </BpPage>
  );
}
