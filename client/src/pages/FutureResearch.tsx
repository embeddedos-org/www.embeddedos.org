import { motion } from "framer-motion";
import {
  FlaskConical,
  Brain,
  Globe,
  Satellite,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

const directions = [
  {
    icon: Shield,
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
    icon: Brain,
    color: "#A855F7",
    title: "Closed-Loop Neural Interfaces",
    horizon: "2026–2029",
    desc: "Build the first closed-loop BCI system on EoS: real-time neural decoding → stimulation feedback loop with <5ms round-trip latency. Targeting motor cortex prosthetics and seizure detection/suppression.",
    milestones: [
      "1024-channel spike sorting at 30 kHz on RK3588S NPU",
      "Closed-loop stimulation with <5ms decode-to-stimulate latency",
      "FDA Breakthrough Device designation pathway",
    ],
  },
  {
    icon: Globe,
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
    icon: Satellite,
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
    icon: Zap,
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
    icon: FlaskConical,
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
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <FlaskConical className="w-4 h-4" /> FUTURE RESEARCH
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Future Research Directions
            </h1>
            <p className="text-xl text-gray-400">
              Long-term research goals and moonshot projects for the EmbeddedOS
              ecosystem. These are the problems we are working on for the next
              5–10 years.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {directions.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: d.color + "20" }}
                >
                  <d.icon className="w-6 h-6" style={{ color: d.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">{d.title}</h2>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: d.color + "20", color: d.color }}
                    >
                      {d.horizon}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 leading-relaxed">{d.desc}</p>
                  <div className="space-y-2">
                    {d.milestones.map(m => (
                      <div key={m} className="flex items-start gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: d.color }}
                        />
                        <span className="text-gray-300 text-sm">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              Current Research <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Public Roadmap
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
