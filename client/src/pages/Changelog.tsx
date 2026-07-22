import { motion } from "framer-motion";
import { GitCommit, Tag, ArrowRight, CheckCircle2, AlertCircle, Zap, Shield, Bug } from "lucide-react";

const releases = [
  {
    version: "v0.1.9", date: "2026-06-15", type: "minor",
    changes: [
      { type: "feat", text: "EAI: Add INT4 quantization support for Cortex-M85 with Helium MVE" },
      { type: "feat", text: "EoS: Add RISC-V RV64 SMP support (up to 8 cores)" },
      { type: "feat", text: "eBootloader: Add ECDSA P-256 signature verification as alternative to Ed25519" },
      { type: "fix", text: "EoS scheduler: Fix priority inversion in mutex implementation" },
      { type: "fix", text: "EIPC: Fix race condition in zero-copy shared memory handoff" },
      { type: "perf", text: "EAI: Reduce INT8 inference latency by 23% on Cortex-M55" },
    ]
  },
  {
    version: "v0.1.8", date: "2026-04-20", type: "minor",
    changes: [
      { type: "feat", text: "ENI: Add 512-channel mode for lower-power BCI applications" },
      { type: "feat", text: "eBuild: Add 8 new product profiles (drone, medical sensor, industrial gateway)" },
      { type: "feat", text: "EoStudio: Add real-time memory profiler and stack usage visualizer" },
      { type: "fix", text: "eBootloader: Fix A/B partition selection on cold boot after power loss" },
      { type: "security", text: "EoS crypto: Fix timing side-channel in AES-256-GCM key schedule" },
    ]
  },
  {
    version: "v0.1.7", date: "2026-02-10", type: "minor",
    changes: [
      { type: "feat", text: "EoSim: Add 15 new platform profiles (ESP32-S3, RP2040, STM32H7)" },
      { type: "feat", text: "eFlow: Add CAD schematic import from KiCad .kicad_sch format" },
      { type: "feat", text: "EAI: Add transformer model support (BERT-tiny, DistilBERT)" },
      { type: "fix", text: "EoS: Fix stack overflow detection on Cortex-M0+ without MPU" },
      { type: "perf", text: "EIPC: Reduce IPC latency from 1.2μs to 0.8μs on Cortex-M7" },
    ]
  },
  {
    version: "v0.1.6", date: "2025-11-30", type: "minor",
    changes: [
      { type: "feat", text: "EoS: Add AMP (asymmetric multiprocessing) support for heterogeneous SoCs" },
      { type: "feat", text: "eDB: Initial release — SQL + Document + Key-Value store in <32KB flash" },
      { type: "feat", text: "eBuild: Add Nix flake support for reproducible builds" },
      { type: "fix", text: "ENI: Fix ADC calibration drift after 72+ hours of continuous operation" },
      { type: "security", text: "eBootloader: Add hardware rollback counter support for STM32 OTP fuses" },
    ]
  },
];

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  feat: { icon: Zap, color: "#34D399", label: "Feature" },
  fix: { icon: Bug, color: "#F97316", label: "Fix" },
  perf: { icon: CheckCircle2, color: "#22D3EE", label: "Performance" },
  security: { icon: Shield, color: "#EF4444", label: "Security" },
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
              <GitCommit className="w-4 h-4" /> CHANGELOG
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">Changelog</h1>
            <p className="text-xl text-gray-300">Release history for all EmbeddedOS products.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {releases.map((r, ri) => (
            <motion.div key={r.version} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ri * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-5 border-b border-white/5 bg-white/3">
                <Tag className="w-5 h-5 text-green-400" />
                <div className="flex-1">
                  <span className="text-white font-bold font-mono text-lg">{r.version}</span>
                  <span className="ml-3 text-gray-500 text-sm">{r.date}</span>
                </div>
                <a href={"https://github.com/embeddedos-org"} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-1">
                  GitHub <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <div className="p-5 space-y-2">
                {r.changes.map((c, ci) => {
                  const cfg = typeConfig[c.type] || typeConfig.feat;
                  return (
                    <div key={ci} className="flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 mt-0.5" style={{ background: cfg.color + "20", color: cfg.color }}>{cfg.label}</span>
                      <span className="text-gray-300 text-sm">{c.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
