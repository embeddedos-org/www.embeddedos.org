import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Shield, Activity, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const specs = [
  {
    label: "Channel Count",
    value: "Config.",
    unit: "hardware-defined",
    color: "#A855F7",
  },
  {
    label: "Sample Rate",
    value: "Config.",
    unit: "hardware-defined",
    color: "#F97316",
  },
  { label: "Applications", value: "4", unit: "use cases", color: "#22D3EE" },
  {
    label: "Research Modalities",
    value: "6",
    unit: "modalities",
    color: "#34D399",
  },
];

const signalTypes = [
  {
    id: "eeg",
    name: "EEG",
    desc: "Scalp-level electrical activity considered for BCI, sleep, and seizure-pattern research. Performance depends on the protocol, electrodes, and acquisition hardware.",
    color: "#A855F7",
  },
  {
    id: "emg",
    name: "EMG",
    desc: "Muscle electrical activity considered for assistive-control and gesture research. Performance depends on the protocol, electrodes, and acquisition hardware.",
    color: "#F97316",
  },
  {
    id: "ecog",
    name: "ECoG",
    desc: "Cortical-surface recording modality considered for motor-interface research. Clinical use is outside the current platform claim.",
    color: "#22D3EE",
  },
  {
    id: "lfp",
    name: "LFP",
    desc: "Deep-brain recording modality considered for laboratory research. No therapeutic or clinical use is claimed.",
    color: "#34D399",
  },
  {
    id: "spikes",
    name: "Spikes",
    desc: "Single-unit action-potential research. Acquisition and resolution depend on the electrode and hardware configuration.",
    color: "#FBBF24",
  },
  {
    id: "fnirs",
    name: "fNIRS",
    desc: "Optical hemodynamic-response modality considered for non-invasive research. Hardware support requires configuration-specific validation.",
    color: "#F472B6",
  },
];

const applications = [
  {
    icon: Activity,
    color: "#A855F7",
    title: "Motor Assistive-Control Research",
    desc: "Research target: evaluate motor-intent decoding for assistive control using a configuration documented with the acquisition hardware.",
  },
  {
    icon: Brain,
    color: "#F97316",
    title: "Seizure-Pattern Research",
    desc: "Research target: study seizure-pattern detection from scalp EEG. No clinical performance or treatment outcome is claimed.",
  },
  {
    icon: Zap,
    color: "#22D3EE",
    title: "BCI Communication Research",
    desc: "Research target: evaluate P300- and SSVEP-based communication with protocol-specific accuracy and throughput reporting.",
  },
  {
    icon: Shield,
    color: "#34D399",
    title: "Cognitive-Indicator Research",
    desc: "Research target: investigate cognitive-load and fatigue indicators; safety-critical use would require independent validation and approval.",
  },
];

export default function NeuralLinkAIPage() {
  const [activeSignal, setActiveSignal] = useState("eeg");
  const signal = signalTypes.find(s => s.id === activeSignal)!;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-orange-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" /> NEURAL LINK AI · RESEARCH
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Neural Link AI
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              eNI — Embedded Neural Interface Platform
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              An in-development neural-interface research platform. Channel
              count and sample rate depend on the acquisition hardware and
              configuration; no clinical performance is claimed.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {specs.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-gray-500 text-xs">{s.unit}</div>
                <div className="text-gray-400 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Research Signal Modalities
          </h2>
          <p className="text-gray-400 text-center mb-8">
            The research design considers six neural signal modalities. Hardware
            support and performance require configuration-specific validation.
          </p>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {signalTypes.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSignal(s.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeSignal === s.id
                    ? {
                        background: s.color + "20",
                        color: s.color,
                        border: "1px solid " + s.color + "40",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {s.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSignal}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3
                className="text-white font-bold text-lg mb-2"
                style={{ color: signal.color }}
              >
                {signal.name}
              </h3>
              <p className="text-gray-400">{signal.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: a.color + "20" }}
                >
                  <a.icon className="w-5 h-5" style={{ color: a.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{a.title}</h3>
                <p className="text-gray-400 text-sm">{a.desc}</p>
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
              href="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              API Reference
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
