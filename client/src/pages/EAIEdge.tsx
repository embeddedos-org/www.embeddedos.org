import { motion } from "framer-motion";
import { Brain, Shield, ArrowRight, Cpu } from "lucide-react";
import { Link } from "wouter";

const pipeline = [
  {
    id: "eni",
    name: "eNI",
    subtitle: "Neural / Sensor Input",
    color: "#A855F7",
    desc: "Research design for configuration-specific neural and sensor acquisition. Planned processing stages include filtering, spike sorting, and structured EIPC output.",
    icon: Brain,
  },
  {
    id: "eipc",
    name: "eIPC",
    subtitle: "Secure Transport",
    color: "#22D3EE",
    desc: "Intended to route research data between eNI and eAI using configuration-specific integrity, encryption, and transport options.",
    icon: Shield,
  },
  {
    id: "eai",
    name: "eAI",
    subtitle: "On-Device Inference",
    color: "#F97316",
    desc: "Intended to evaluate manifest-pinned ML models on configured device accelerators or CPUs and publish research outputs through EIPC.",
    icon: Cpu,
  },
];

const useCases = [
  {
    title: "Motor BCI Research",
    desc: "Concept pipeline for configuration-specific ECoG acquisition, experimental decoding, and assistive-control research.",
    color: "#A855F7",
  },
  {
    title: "Seizure-Pattern Research",
    desc: "Concept pipeline for EEG pattern-classification research. No detection performance, stimulation behavior, or treatment outcome is claimed.",
    color: "#F97316",
  },
  {
    title: "Gesture Research",
    desc: "Concept pipeline for configuration-specific EMG acquisition and experimental gesture classification.",
    color: "#22D3EE",
  },
  {
    title: "Cognitive-Indicator Research",
    desc: "Concept pipeline for studying EEG-derived fatigue indicators. No safety-critical monitoring performance is claimed.",
    color: "#34D399",
  },
];

export default function EAIEdgePage() {
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
              <Brain className="w-4 h-4" /> EAI EDGE RESEARCH CONCEPT
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-orange-300 bg-clip-text text-transparent">
              eAI Edge
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              Intelligent Edge Node with Neural-Interface Input
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              An in-development concept for a manifest-pinned eNI → eIPC → eAI
              research workflow. Hardware support, setup steps, and performance
              require validation on a named configuration.
            </p>
            <div className="flex flex-wrap gap-6 justify-center mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">v0.1.0</div>
                <div className="text-gray-500 text-sm">Current Version</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">v0.1</div>
                <div className="text-gray-500 text-sm">Profile</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">Config.</div>
                <div className="text-gray-500 text-sm">
                  Hardware-Defined Channels
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">Pending</div>
                <div className="text-gray-500 text-sm">Power Validation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Planned Pipeline
          </h2>
          <p className="text-gray-400 text-center mb-8">
            The concept links three planned stages for acquisition, transport,
            and experimental inference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pipeline.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: p.color }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: p.color + "20" }}
                >
                  <p.icon className="w-6 h-6" style={{ color: p.color }} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-xl">{p.name}</h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: p.color + "20", color: p.color }}
                  >
                    {p.subtitle}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Illustrative Setup
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Conceptual commands for a proposed workflow, not a verified
            deployment recipe.
          </p>
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 font-mono text-sm space-y-2">
            <div>
              <span className="text-gray-500"># Clone the eAI Edge stack</span>
            </div>
            <div>
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">
                git clone https://github.com/embeddedos-org/eAI
              </span>
            </div>
            <div>
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">
                cmake -B build -DPLATFORM=rk3588s -DMANIFEST=manifest.yml
              </span>
            </div>
            <div>
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">
                cmake --build build && ebuild flash
              </span>
            </div>
            <div className="mt-4 text-gray-500">
              # Smoke test: verify all 3 pipeline stages are running
            </div>
            <div>
              <span className="text-green-400">$</span>{" "}
              <span className="text-white">
                ebuild monitor --filter eai-edge
              </span>
            </div>
            <div className="text-cyan-400">
              [simulated] eNI: configuration detected
            </div>
            <div className="text-cyan-400">
              [simulated] eIPC: transport check pending
            </div>
            <div className="text-cyan-400">
              [simulated] eAI: research model placeholder
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Research Use Cases
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
                <h3
                  className="text-white font-semibold mb-2"
                  style={{ color: u.color }}
                >
                  {u.title}
                </h3>
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
              EAI Platform <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/neural-link-ai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Neural Link AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
