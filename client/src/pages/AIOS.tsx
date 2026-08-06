import { motion } from "framer-motion";
import { Brain, Cpu, Zap, Shield, ArrowRight, Layers } from "lucide-react";
import { Link } from "wouter";

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
    icon: Brain,
    color: "#A855F7",
    title: "On-Device LLM Inference",
    desc: "Run quantized LLMs (1B–7B parameters) on devices with 512 MB+ RAM. Supports GGUF, ONNX, and TFLite formats.",
  },
  {
    icon: Cpu,
    color: "#F97316",
    title: "NPU Acceleration",
    desc: "Hardware NPU support for RK3588S (6 TOPS), Cortex-M55 (Helium), and ESP32-S3 (vector extensions). Automatic NPU offload.",
  },
  {
    icon: Zap,
    color: "#22D3EE",
    title: "Sub-10ms Inference",
    desc: "Optimized inference pipeline: INT8/INT4 quantization, layer fusion, and memory-mapped model loading. <10ms for 1M parameter models.",
  },
  {
    icon: Shield,
    color: "#34D399",
    title: "Manifest-Pinned Models",
    desc: "Every AI model is pinned to a specific version in the EAI manifest. No silent model updates — full audit trail of what ran on each device.",
  },
  {
    icon: Layers,
    color: "#FBBF24",
    title: "Multi-Framework Support",
    desc: "TensorFlow Lite, ONNX Runtime, and llama.cpp backends. Unified EAI API regardless of model format or framework.",
  },
  {
    icon: Brain,
    color: "#F472B6",
    title: "eBot Agent Runtime",
    desc: "Full LLM agent runtime with tool calling, memory, and multi-step reasoning. Deploy autonomous agents on embedded hardware.",
  },
];

export default function AIOSPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" /> AI-NATIVE OS
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              AI-Native OS
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              EmbeddedOS + EAI Platform
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              EmbeddedOS is designed from the ground up to run AI workloads on
              constrained hardware — from 64 KB microcontrollers to 8-core NPU
              boards. On-device LLM inference, neural decoding, and autonomous
              agent runtime.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            EAI Stack Architecture
          </h2>
          <div className="space-y-2">
            {stack.map((layer, i) => (
              <motion.div
                key={layer.layer}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="w-32 flex-shrink-0">
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: layer.color + "20",
                      color: layer.color,
                    }}
                  >
                    {layer.layer}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map(item => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            EAI Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: c.color + "20" }}
                >
                  <c.icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{c.title}</h3>
                <p className="text-gray-400 text-sm">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/eai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              EAI Platform <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/eni"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              ENI Neural Interface
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
