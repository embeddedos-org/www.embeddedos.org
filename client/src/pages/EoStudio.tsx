import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Terminal, Cpu, Zap, Brain, BookOpen, ArrowRight, CheckCircle2, Play } from "lucide-react";
import { Link } from "wouter";

const editors = [
  { id: "code", icon: Code2, color: "#F97316", name: "Code Editor", desc: "Monaco-based editor with EoS-aware syntax highlighting, auto-complete for all 197 EoS APIs, and inline documentation." },
  { id: "flow", icon: Zap, color: "#22D3EE", name: "eFlow Visual Editor", desc: "Drag-and-drop block programming for GPIO, timers, UART, SPI, I²C, PWM, ADC, and AI inference blocks." },
  { id: "debug", icon: Terminal, color: "#A855F7", name: "Debugger", desc: "GDB-based debugger with EoS-aware task and memory views. Set breakpoints in EoS kernel code and user tasks simultaneously." },
  { id: "sim", icon: Cpu, color: "#34D399", name: "EoSim Integration", desc: "One-click simulation of your firmware on 63+ virtual boards. No hardware required to test your application." },
  { id: "ai", icon: Brain, color: "#F472B6", name: "AI Tutor", desc: "Built-in AI assistant trained on EoS documentation. Ask questions, get code examples, and debug errors in natural language." },
  { id: "learn", icon: BookOpen, color: "#FBBF24", name: "Learning Paths", desc: "4 structured learning paths from beginner to advanced. Interactive exercises with instant feedback in the simulator." },
];

const paths = [
  { level: "Beginner", title: "EoS Fundamentals", modules: 8, hours: "12h", color: "#34D399", topics: ["GPIO & Interrupts", "UART & SPI", "Timers & PWM", "Task Scheduling"] },
  { level: "Intermediate", title: "RTOS & Drivers", modules: 12, hours: "20h", color: "#22D3EE", topics: ["Kernel Internals", "Device Drivers", "Filesystem", "Networking"] },
  { level: "Advanced", title: "Security & AI", modules: 10, hours: "18h", color: "#A855F7", topics: ["Secure Boot", "Crypto APIs", "EAI Inference", "ENI Integration"] },
  { level: "Expert", title: "Safety-Critical", modules: 8, hours: "16h", color: "#F97316", topics: ["MISRA C", "Formal Verification", "DO-178C", "IEC 61508"] },
];

export default function EoStudioPage() {
  const [activeEditor, setActiveEditor] = useState("code");
  const editor = editors.find(e => e.id === activeEditor)!;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Code2 className="w-4 h-4" /> EOSTUDIO
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">EoStudio</h1>
            <p className="text-2xl text-gray-300 mb-2">The Embedded IDE for EmbeddedOS</p>
            <p className="text-gray-400 max-w-2xl mx-auto">12 specialized editors, 4 learning paths, AI tutor, and built-in EoSim integration — everything you need to build EoS applications in one environment.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">12 Specialized Editors</h2>
          <p className="text-gray-400 text-center mb-8">Each editor is purpose-built for a specific aspect of embedded development.</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {editors.map(e => (
              <button key={e.id} onClick={() => setActiveEditor(e.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all"
                style={activeEditor === e.id ? { background: e.color + "20", color: e.color, border: "1px solid " + e.color + "40" } : { background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}>
                <e.icon className="w-5 h-5" />
                <span>{e.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeEditor} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: editor.color + "20" }}>
                  <editor.icon className="w-6 h-6" style={{ color: editor.color }} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{editor.name}</h3>
                  <p className="text-gray-400">{editor.desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">4 Learning Paths</h2>
          <p className="text-gray-400 text-center mb-8">Structured curriculum from beginner to safety-critical expert. Interactive exercises with instant feedback in EoSim.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: p.color + "20", color: p.color }}>{p.level}</span>
                  <span className="text-gray-500 text-sm">{p.modules} modules · {p.hours}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{p.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {p.topics.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs">{t}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-4">Start Learning for Free</h2>
          <p className="text-gray-400 mb-6">EoStudio is free and open-source. Download it or use the web version to start building EoS applications today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"><Play className="w-4 h-4" /> Try in Browser</Link>
            <Link href="/getting-started" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">Getting Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
