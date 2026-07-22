import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Activity, Shield, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const channels = [
  { id: "eeg", label: "EEG", color: "#A855F7", hz: "30 kHz", bits: "24-bit", count: "1,024 ch" },
  { id: "emg", label: "EMG", color: "#F97316", hz: "100 kHz", bits: "16-bit", count: "256 ch" },
  { id: "ecog", label: "ECoG", color: "#22D3EE", hz: "30 kHz", bits: "24-bit", count: "512 ch" },
  { id: "lfp", label: "LFP", color: "#34D399", hz: "10 kHz", bits: "24-bit", count: "128 ch" },
];

const pipeline = [
  { step: "01", title: "Acquisition", desc: "1,024-channel simultaneous neural signal acquisition at up to 100 kHz per channel. 24-bit ADC resolution with <2μV RMS noise floor." },
  { step: "02", title: "Filtering", desc: "Hardware-accelerated bandpass filtering (0.1 Hz – 10 kHz), notch filtering (50/60 Hz), and common-average referencing." },
  { step: "03", title: "Spike Detection", desc: "Real-time spike detection using threshold crossing and template matching. Processes 1,024 channels in <500μs on Cortex-M55." },
  { step: "04", title: "Feature Extraction", desc: "Spike waveform features, LFP power bands (delta/theta/alpha/beta/gamma), and coherence measures extracted per channel." },
  { step: "05", title: "Decoding", desc: "EAI-powered neural decoder: population vector decoding, Kalman filter, or deep learning decoder (LSTM/Transformer) for BCI applications." },
  { step: "06", title: "Output", desc: "Decoded neural commands delivered via EIPC to EoS applications with <10ms end-to-end latency from spike to command." },
];

const useCases = [
  { icon: Brain, color: "#A855F7", title: "Brain-Computer Interface", desc: "Motor cortex decoding for prosthetic limb control. 95%+ decode accuracy for 8-direction cursor control." },
  { icon: Activity, color: "#F97316", title: "Closed-Loop Neurostimulation", desc: "Real-time feedback loop: detect neural biomarkers → trigger stimulation → measure response. For epilepsy, Parkinson's, depression." },
  { icon: Cpu, color: "#22D3EE", title: "Neural Prosthetics", desc: "Cochlear implant signal processing, retinal prosthetics, and somatosensory feedback for prosthetic hands." },
  { icon: Shield, color: "#34D399", title: "Research Platforms", desc: "High-density Utah array and Michigan probe support. Compatible with Open Ephys, Blackrock, and Intan hardware." },
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
          <svg viewBox="0 0 1200 200" className="w-full absolute top-1/2 -translate-y-1/2">
            <motion.path d="M0,100 Q150,20 300,100 T600,100 T900,100 T1200,100" fill="none" stroke="#A855F7" strokeWidth="2"
              animate={{ d: ["M0,100 Q150,20 300,100 T600,100 T900,100 T1200,100", "M0,100 Q150,180 300,100 T600,100 T900,100 T1200,100", "M0,100 Q150,20 300,100 T600,100 T900,100 T1200,100"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" /> ENI
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">ENI</h1>
            <p className="text-2xl text-gray-300 mb-2">Embedded Neural Interface Framework</p>
            <p className="text-gray-400 max-w-2xl mx-auto">1,024-channel neural signal acquisition, real-time spike detection, and AI-powered neural decoding for brain-computer interfaces and closed-loop neurostimulation.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Signal Acquisition Modes</h2>
          <p className="text-gray-400 text-center mb-8">ENI supports four neural signal types with hardware-optimized acquisition pipelines.</p>
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {channels.map(c => (
              <button key={c.id} onClick={() => setActiveChannel(c.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={activeChannel === c.id ? { background: c.color + "20", color: c.color, border: "1px solid " + c.color + "40" } : { background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}>
                {c.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeChannel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 grid grid-cols-3 gap-6 text-center">
              <div><div className="text-3xl font-bold mb-1" style={{ color: ch.color }}>{ch.hz}</div><div className="text-gray-500 text-sm">Sample Rate</div></div>
              <div><div className="text-3xl font-bold mb-1" style={{ color: ch.color }}>{ch.bits}</div><div className="text-gray-500 text-sm">ADC Resolution</div></div>
              <div><div className="text-3xl font-bold mb-1" style={{ color: ch.color }}>{ch.count}</div><div className="text-gray-500 text-sm">Max Channels</div></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">ENI Processing Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipeline.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-purple-400 font-mono text-xs mb-2">{p.step}</div>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((u, i) => (
              <motion.div key={u.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: u.color + "20" }}>
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
            <Link href="/eai" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">See EAI Integration <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/api-docs" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">API Reference</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
