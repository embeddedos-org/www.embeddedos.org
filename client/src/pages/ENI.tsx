import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Activity, Shield, Cpu, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const channels = [
  {
    id: "eeg",
    label: "EEG",
    color: "#A855F7",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
  {
    id: "emg",
    label: "EMG",
    color: "#F97316",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
  {
    id: "ecog",
    label: "ECoG",
    color: "#22D3EE",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
  {
    id: "lfp",
    label: "LFP",
    color: "#34D399",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
];

const pipeline = [
  {
    step: "01",
    title: "Acquisition",
    desc: "Configure acquisition for the attached front end. Channel count and sample rate depend on the acquisition hardware and configuration; limits require measurement on a named setup.",
  },
  {
    step: "02",
    title: "Filtering",
    desc: "Hardware-accelerated bandpass filtering (0.1 Hz – 10 kHz), notch filtering (50/60 Hz), and common-average referencing.",
  },
  {
    step: "03",
    title: "Spike Detection",
    desc: "Threshold-crossing and template-matching spike detection are research pipeline goals; throughput and latency benchmarks are pending for each hardware configuration.",
  },
  {
    step: "04",
    title: "Feature Extraction",
    desc: "Spike waveform features, LFP power bands (delta/theta/alpha/beta/gamma), and coherence measures extracted per channel.",
  },
  {
    step: "05",
    title: "Decoding",
    desc: "EAI-powered neural decoder: population vector decoding, Kalman filter, or deep learning decoder (LSTM/Transformer) for BCI applications.",
  },
  {
    step: "06",
    title: "Output",
    desc: "Decoded neural commands delivered via EIPC to EoS applications, ready for the actuator or downstream service to act on.",
  },
];

const useCases = [
  {
    icon: Brain,
    color: "#A855F7",
    title: "Brain-Computer Interface",
    desc: "Research target: evaluate motor-intent decoding for assistive control and publish protocol-specific accuracy results.",
  },
  {
    icon: Activity,
    color: "#F97316",
    title: "Closed-Loop Neurostimulation",
    desc: "Research target: study detect-stimulate-measure feedback loops. No clinical efficacy or treatment claim is made.",
  },
  {
    icon: Cpu,
    color: "#22D3EE",
    title: "Neural Prosthetics",
    desc: "Cochlear implant signal processing, retinal prosthetics, and somatosensory feedback for prosthetic hands.",
  },
  {
    icon: Shield,
    color: "#34D399",
    title: "Research Platforms",
    desc: "High-density Utah array and Michigan probe support. Compatible with Open Ephys, Blackrock, and Intan hardware.",
  },
];

export default function ENIPage() {
  const [activeChannel, setActiveChannel] = useState("eeg");
  const ch = channels.find(c => c.id === activeChannel)!;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5" />
        {/* Animated neural wave */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg
            viewBox="0 0 1200 200"
            className="w-full absolute top-1/2 -translate-y-1/2"
          >
            {/*
              The wave undulates by flipping vertically. It is animated with
              scaleY rather than by tweening the `d` attribute: framer-motion
              cannot interpolate a path string, and emitted d="undefined"
              mid-tween, which Chrome rejected with "Expected moveto path
              command". The two shapes are exact mirrors about y=100 — the T
              commands reflect each control point, so flipping the whole path
              about the viewBox centre line is the same animation.
            */}
            <motion.path
              d="M0,100 Q150,20 300,100 T600,100 T900,100 T1200,100"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2"
              style={{ transformOrigin: "center", transformBox: "view-box" }}
              animate={{ scaleY: [1, -1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" /> ENI · RESEARCH
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              ENI
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              Embedded Neural Interface Framework
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              An in-development neural acquisition and processing framework.
              Channel count and sample rate depend on the acquisition hardware
              and configuration; performance remains a research target.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Signal Acquisition Modes
          </h2>
          <p className="text-gray-400 text-center mb-8">
            ENI research covers four signal types through configurable
            acquisition pipelines.
          </p>
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {channels.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeChannel === c.id
                    ? {
                        background: c.color + "20",
                        color: c.color,
                        border: "1px solid " + c.color + "40",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {c.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChannel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 grid grid-cols-3 gap-6 text-center"
            >
              <div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: ch.color }}
                >
                  {ch.hz}
                </div>
                <div className="text-gray-500 text-sm">Configured Rate</div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: ch.color }}
                >
                  {ch.bits}
                </div>
                <div className="text-gray-500 text-sm">ADC Configuration</div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: ch.color }}
                >
                  {ch.count}
                </div>
                <div className="text-gray-500 text-sm">Configured Channels</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            ENI Processing Pipeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipeline.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="text-purple-400 font-mono text-xs mb-2">
                  {p.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: u.color + "20" }}
                >
                  <u.icon className="w-5 h-5" style={{ color: u.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{u.title}</h3>
                <p className="text-gray-400 text-sm">{u.desc}</p>
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
              See EAI Integration <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              API Reference
            </Link>
            <Link
              href="/product-eni"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              eNI engineering detail
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
