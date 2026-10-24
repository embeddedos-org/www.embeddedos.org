import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./AIOS.css";

const stack = [
  {
    layer: "Application",
    items: ["eBot Agent", "eNI BCI Apps", "eHealth AI", "eRadar AI"],
    color: "#F97316",
  },
  {
    layer: "EAI Runtime",
    items: [
      "Model Inference",
      "Neural Decoder",
      "Feature Extraction",
      "Quantization",
    ],
    color: "#FBBF24",
  },
  {
    layer: "EAI Middleware",
    items: [
      "Model Registry",
      "Manifest Pinning",
      "Version Control",
      "A/B Testing",
    ],
    color: "#22D3EE",
  },
  {
    layer: "EoS Kernel",
    items: ["Task Scheduler", "Memory Manager", "EIPC", "HAL"],
    color: "#A855F7",
  },
  {
    layer: "Hardware",
    items: ["NPU (6 TOPS)", "DSP", "SIMD/NEON", "DMA"],
    color: "#34D399",
  },
];

const capabilities = [
  {
    color: "#A855F7",
    title: "On-Device LLM Inference",
    desc: "Run quantized LLMs (1B–7B parameters) on devices with 512 MB+ RAM. Supports GGUF, ONNX, and TFLite formats.",
  },
  {
    color: "#F97316",
    title: "NPU Acceleration",
    desc: "Hardware NPU support for RK3588S (6 TOPS), Cortex-M55 (Helium), and ESP32-S3 (vector extensions). Automatic NPU offload.",
  },
  {
    color: "#22D3EE",
    title: "Optimised Inference Pipeline",
    desc: "INT8/INT4 quantization, layer fusion, and memory-mapped model loading, tuned for models small enough to run on an MCU.",
  },
  {
    color: "#34D399",
    title: "Manifest-Pinned Models",
    desc: "Every AI model is pinned to a specific version in the EAI manifest. No silent model updates — full audit trail of what ran on each device.",
  },
  {
    color: "#FBBF24",
    title: "Multi-Framework Support",
    desc: "TensorFlow Lite, ONNX Runtime, and llama.cpp backends. Unified EAI API regardless of model format or framework.",
  },
  {
    color: "#F472B6",
    title: "eBot Agent Runtime",
    desc: "Full LLM agent runtime with tool calling, memory, and multi-step reasoning. Deploy autonomous agents on embedded hardware.",
  },
];

export default function AIOSPage() {
  return (
    <BpPage className="aios">
      <PageHero
        sig
        label="AI-NATIVE OS"
        title="AI-Native OS"
        sub="EmbeddedOS + EAI Platform"
        lead="EmbeddedOS is designed from the ground up to run AI workloads on constrained hardware — from 64 KB microcontrollers to 8-core NPU boards. On-device LLM inference, neural decoding, and autonomous agent runtime."
      />

      <Section title="EAI Stack Architecture">
        <ol className="aios-stack">
          {stack.map(layer => (
            <li
              key={layer.layer}
              style={{ "--c": layer.color } as CSSProperties}
            >
              <span className="aios-layer">{layer.layer}</span>
              <ul>
                {layer.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="EAI Capabilities">
        <ul className="cards">
          {capabilities.map(c => (
            <li key={c.title}>
              <div className="card">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tight>
        <div className="ctas">
          <Link href="/eai" className="btn pri">
            EAI Platform{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/eni" className="btn gh">
            ENI Neural Interface
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
