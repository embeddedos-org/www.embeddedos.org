import { useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Brain,
  Wifi,
  Terminal,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Activity,
  Cpu,
  Shield,
} from "lucide-react";
const EAINetworkCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EAINetworkCanvas }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.07,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

const PRODUCTS = [
  {
    id: "eai",
    icon: Brain,
    color: "#34D399",
    name: "EAI Engine",
    tagline: "On-device AI inference — no cloud required",
    desc: "EAI runs TFLite, ONNX, and GGUF models directly on microcontrollers. 4-bit quantization fits a 7B parameter model on 4MB of RAM. Supports vision, NLP, time-series classification, and anomaly detection.",
    specs: [
      { label: "Runtimes", value: "TFLite · ONNX · GGUF" },
      { label: "Quantization", value: "4-bit, 8-bit, FP16" },
      { label: "Min RAM", value: "256KB (classification)" },
      { label: "LLM RAM", value: "4MB (7B 4-bit)" },
      { label: "Tasks", value: "Vision · NLP · Time-series · Anomaly" },
      { label: "Acceleration", value: "CMSIS-NN · Helium · RISC-V V-ext" },
    ],
    demo: [
      ">>> eai.load('gesture_classifier.tflite')",
      ">>> eai.run(sensor_data)",
      "{'class': 'wave_right', 'confidence': 0.97}",
      ">>> eai.load('phi3-mini-4bit.gguf')",
      ">>> eai.chat('What is the sensor reading?')",
      "'Temperature is 23.4°C, humidity 61%. All nominal.'",
    ],
  },
  {
    id: "eni",
    icon: Wifi,
    color: "#A78BFA",
    name: "ENI Adapter",
    tagline: "Neural interface for BCI devices over standard buses",
    desc: "ENI (Embedded Neural Interface) is a hardware abstraction layer for brain-computer interface devices. It normalises raw EEG, EMG, and ECoG signals into a standard EoS event stream, enabling any EoS app to consume neural data.",
    specs: [
      { label: "Signal types", value: "EEG · EMG · ECoG · EOG" },
      { label: "Buses", value: "SPI · I²C · UART · USB" },
      { label: "Sampling", value: "Up to 32kHz per channel" },
      { label: "Channels", value: "1–256 channels" },
      { label: "Latency", value: "<500µs end-to-end" },
      { label: "Output", value: "EoS event stream + raw buffer" },
    ],
    demo: [
      ">>> eni.init(bus='SPI', channels=8, rate=1000)",
      ">>> eni.stream.subscribe(on_sample)",
      "Sample: ch[0..7] = [12.3, -4.1, 8.7, ...]",
      ">>> eni.classify('motor_imagery')",
      "{'intent': 'left_hand', 'confidence': 0.91}",
      ">>> eni.trigger_haptic(intensity=0.5)",
    ],
  },
  {
    id: "ebot",
    icon: Terminal,
    color: "#F97316",
    name: "eBot Agent",
    tagline: "AI assistant embedded in every EoS device",
    desc: "eBot is an always-available AI agent running on every EmbeddedOS device. It can answer questions about the device state, execute shell commands, debug firmware, and communicate with external APIs — all from a simple chat interface.",
    specs: [
      { label: "Interface", value: "Chat · CLI · REST API" },
      { label: "Models", value: "Local GGUF · Cloud LLM" },
      { label: "Tools", value: "Shell · Sensor read · GPIO · OTA" },
      { label: "Context", value: "Device state · Logs · Docs" },
      { label: "Offline", value: "Full offline mode (GGUF)" },
      { label: "Platform", value: "All EoS devices + web" },
    ],
    demo: [
      "User: What's the CPU temperature?",
      "eBot: CPU is at 42°C. Fan at 35% duty cycle.",
      "User: Increase fan speed to 60%",
      "eBot: Done. Fan now at 60%. Temp dropping.",
      "User: Show me the last 10 error logs",
      "eBot: [WARN] SPI timeout x3, [ERR] OTA hash...",
    ],
  },
];

export default function EAI() {
  const [active, setActive] = useState("eai");
  const product = PRODUCTS.find(p => p.id === active)!;
  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#34D399]/6 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[#A78BFA]/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.3)",
                color: "#34D399",
              }}
            >
              <Brain size={12} /> ENI / EAI
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]"
          >
            Neural Interface
            <br />
            <span style={{ color: "#34D399" }}>& Edge AI</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Run AI models directly on microcontrollers. Connect brain-computer
            interface devices. Deploy an AI agent on every EoS device — all
            without cloud dependency.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#34D399", color: "#000" }}
            >
              Get Started <ArrowRight size={15} />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
            >
              <BookOpen size={15} /> EAI Docs
            </Link>
          </motion.div>
          {/* 3D Neural Network Animation */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-10 rounded-2xl border border-white/8 overflow-hidden h-56 max-w-lg mx-auto"
            style={{ background: "rgba(5,10,20,0.8)" }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <EAINetworkCanvas hovered={false} />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Product selector */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {PRODUCTS.map(p => {
              const PIcon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                  style={
                    active === p.id
                      ? {
                          background: p.color,
                          color: p.id === "eai" ? "#000" : "#fff",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                >
                  <PIcon size={14} /> {p.name}
                </button>
              );
            })}
          </div>

          {/* Product detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Info panel */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: `${product.color}06`,
                borderColor: `${product.color}20`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${product.color}18` }}
                >
                  <Icon size={22} style={{ color: product.color }} />
                </div>
                <div>
                  <h2 className="font-heading font-black text-xl text-white">
                    {product.name}
                  </h2>
                  <p className="text-sm" style={{ color: product.color }}>
                    {product.tagline}
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                {product.desc}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map(s => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="text-xs text-white/40 mb-0.5">
                      {s.label}
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code demo */}
            <div
              className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(5,10,20,0.85)" }}
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#F0883E]/60" />
                  <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
                </div>
                <span className="text-xs font-mono text-white/30 ml-2">
                  {product.id}-demo.py
                </span>
              </div>
              <div className="p-5 font-mono text-xs space-y-2">
                {product.demo.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.3 }}
                  >
                    <span
                      style={{
                        color: line.startsWith(">>>")
                          ? product.color
                          : line.startsWith("'") || line.startsWith("{")
                            ? "#34D399"
                            : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use cases */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl text-white mb-2">
              Use Cases
            </h2>
            <p className="text-white/40 text-base">
              What you can build with ENI/EAI
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Activity,
                color: "#F85149",
                title: "Medical Wearables",
                desc: "Classify ECG arrhythmias, detect falls, and monitor sleep stages — all on-device with no PHI leaving the hardware.",
              },
              {
                icon: Brain,
                color: "#A78BFA",
                title: "Brain-Computer Interface",
                desc: "Read motor imagery signals from EEG headsets and translate them into device commands via ENI.",
              },
              {
                icon: Cpu,
                color: "#22D3EE",
                title: "Industrial Predictive Maintenance",
                desc: "Run vibration anomaly detection models on factory sensors. Alert before failures occur.",
              },
              {
                icon: Wifi,
                color: "#34D399",
                title: "Edge Vision",
                desc: "Object detection and image classification on camera modules with no cloud upload.",
              },
              {
                icon: Terminal,
                color: "#F97316",
                title: "AI-Assisted Debugging",
                desc: "eBot reads device logs and suggests fixes in plain language. Ship firmware faster.",
              },
              {
                icon: Shield,
                color: "#60A5FA",
                title: "Secure AI Inference",
                desc: "Models run in isolated memory partitions. Inference results are signed and attestable.",
              },
            ].map((uc, i) => {
              const UCIcon = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border p-5 card-hover-glow"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: `${uc.color}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${uc.color}15` }}
                  >
                    <UCIcon size={18} style={{ color: uc.color }} />
                  </div>
                  <div className="font-heading font-bold text-white mb-1">
                    {uc.title}
                  </div>
                  <div className="text-white/50 text-sm leading-relaxed">
                    {uc.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl p-10 text-center border"
            style={{
              background: "rgba(52,211,153,0.06)",
              borderColor: "rgba(52,211,153,0.2)",
            }}
          >
            <h2 className="font-heading font-black text-3xl text-white mb-3">
              Run AI on your embedded device today
            </h2>
            <p className="text-white/55 text-lg mb-6 max-w-xl mx-auto">
              EAI and ENI ship with every EoS installation. No separate SDK
              needed.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#34D399", color: "#000" }}
              >
                Get Started <ArrowRight size={15} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
              >
                <ChevronRight size={15} /> EAI API Reference
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
