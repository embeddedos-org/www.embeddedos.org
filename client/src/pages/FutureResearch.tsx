import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import "./FutureResearch.css";

/** An anchor id for a research direction: "Space-Grade EoS" → "space-grade-eos". */
const directionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const directions = [
  {
    color: "#F97316",
    title: "Formal Verification",
    horizon: "2026–2028",
    desc: "Apply TLA+ and Coq formal verification to the EoS kernel scheduler, EIPC protocol, and secure boot chain. Goal: mathematical proof of absence of deadlocks, race conditions, and memory safety violations in the kernel core.",
    milestones: [
      "Formalize EIPC message ordering invariants in TLA+",
      "Verify MPU configuration correctness with Coq",
      "Automated verification in CI pipeline for kernel patches",
    ],
  },
  {
    color: "#A855F7",
    title: "Closed-Loop Neural Interfaces",
    horizon: "2026–2029",
    desc: "Build the first closed-loop BCI system on EoS: real-time neural decoding → stimulation feedback loop, targeting a round-trip latency under 5 ms. Targeting motor cortex prosthetics and seizure detection/suppression.",
    milestones: [
      "1024-channel spike sorting at 30 kHz on RK3588S NPU",
      "Closed-loop stimulation targeting <5ms decode-to-stimulate latency",
      "FDA Breakthrough Device designation pathway",
    ],
  },
  {
    color: "#22D3EE",
    title: "Distributed Embedded OS",
    horizon: "2027–2030",
    desc: "Extend EoS to support distributed operation across multiple physical devices as a single logical system. A swarm of 100 microcontrollers appears as one EoS instance with distributed task scheduling and shared memory.",
    milestones: [
      "Distributed EIPC over mesh networking (Thread/Zigbee)",
      "Consensus-based distributed task scheduler",
      "Single-image OTA update for device swarms",
    ],
  },
  {
    color: "#34D399",
    title: "Space-Grade EoS",
    horizon: "2027–2031",
    desc: "Harden EoS for space environments: radiation-tolerant memory management, triple-modular redundancy for critical tasks, and DO-178C Level A certification. Targeting CubeSat and small satellite platforms.",
    milestones: [
      "Radiation-hardened memory allocator with ECC scrubbing",
      "TMR task execution with automatic fault recovery",
      "DO-178C Level A certification for EoS kernel",
    ],
  },
  {
    color: "#FBBF24",
    title: "Sub-mW AI Inference",
    horizon: "2026–2028",
    desc: "Achieve <1mW AI inference for always-on keyword spotting, gesture recognition, and anomaly detection on Cortex-M0+ class devices. Combining extreme quantization (2-bit), sparse activation, and custom SIMD kernels.",
    milestones: [
      "2-bit quantized keyword spotting model at 800μW",
      "Sparse activation runtime for Cortex-M0+",
      "EAI manifest support for ultra-low-power model variants",
    ],
  },
  {
    color: "#F472B6",
    title: "Neuromorphic Computing",
    horizon: "2028–2032",
    desc: "Integrate neuromorphic processors (Intel Loihi 2, BrainScaleS) into the EoS HAL. Enable spiking neural network inference at 1000x lower energy than conventional deep learning for always-on sensor processing.",
    milestones: [
      "EoS HAL driver for Intel Loihi 2 via USB3",
      "SNN inference runtime with EIPC integration",
      "Benchmark: SNN vs CNN on EAI edge workloads",
    ],
  },
];

export default function FutureResearchPage() {
  return (
    <BpPage className="fres">
      <PageHero
        sig
        label="FUTURE RESEARCH"
        title="Future Research Directions"
        lead="Long-term research goals and moonshot projects for the EmbeddedOS ecosystem. These are the problems we are working on for the next 5–10 years."
      />
      <LocalNav
        name="Future Research"
        items={directions.map(d => ({
          id: directionId(d.title),
          label: d.title,
        }))}
      />

      {directions.map(d => (
        <section
          key={d.title}
          id={directionId(d.title)}
          className="sec fr-dir"
          style={{ "--c": d.color } as CSSProperties}
        >
          <div className="wrap fr-row">
            <div className="fr-h">
              <span className="fr-hz">{d.horizon}</span>
              <h2>{d.title}</h2>
            </div>
            <div className="fr-b">
              <p>{d.desc}</p>
              <ul className="fr-ms">
                {d.milestones.map(m => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="sec tight fr-end">
        <div className="wrap">
          <div className="ctas">
            <Link href="/research" className="btn or">
              Current Research{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/roadmap" className="btn gh">
              Public Roadmap
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
