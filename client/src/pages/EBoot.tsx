import { motion } from "framer-motion";
import { Link } from "wouter";
import { Zap, Shield, RefreshCw, Lock, ArrowRight, Check, Terminal, BookOpen, ChevronRight } from "lucide-react";
import { Suspense, lazy } from "react";
const EBootCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EBootCanvas }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  }),
};

const BOOT_STAGES = [
  { step: "01", name: "ROM Bootloader", desc: "Immutable factory code verifies eBoot signature using hardware root-of-trust keys burned into OTP fuses.", color: "#60A5FA", icon: Lock },
  { step: "02", name: "eBoot Stage 1", desc: "Minimal loader initialises clocks, DRAM, and the cryptographic engine. Verifies Stage 2 signature.", color: "#22D3EE", icon: Zap },
  { step: "03", name: "eBoot Stage 2", desc: "Full bootloader environment. Loads EoS kernel image, verifies hash chain, applies OTA staging if pending.", color: "#34D399", icon: RefreshCw },
  { step: "04", name: "EoS Kernel", desc: "Verified kernel image handed control. Device is in a fully attested, trusted state.", color: "#F97316", icon: Shield },
];

const FEATURES = [
  { icon: Shield, color: "#34D399", title: "Verified Boot Chain", desc: "Every stage cryptographically signed. A tampered image cannot boot — the chain breaks and recovery mode activates." },
  { icon: RefreshCw, color: "#22D3EE", title: "OTA Update Pipeline", desc: "Dual-bank A/B update with automatic rollback. Failed updates revert to the last known-good image automatically." },
  { icon: Lock, color: "#F97316", title: "Hardware Root of Trust", desc: "Keys burned into OTP fuses at manufacturing. No software path can override the root verification." },
  { icon: Zap, color: "#F59E0B", title: "Fast Boot (<200ms)", desc: "Optimised stage initialisation gets devices to the EoS kernel in under 200ms on most MCU families." },
  { icon: Terminal, color: "#A78BFA", title: "Recovery Console", desc: "UART recovery shell for field repair. Re-flash firmware without physical access to JTAG." },
  { icon: Check, color: "#60A5FA", title: "52+ Board Support", desc: "Same eBoot codebase across all EoS-supported MCU families. One tool, every device." },
];

export default function EBoot() {
  return (
    <div className="min-h-screen bg-[#080F1E]">

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#F59E0B]/6 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#34D399]/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}>
                  <Zap size={12} /> eBoot Bootloader
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]">
                eBoot<br />
                <span style={{ color: "#F59E0B" }}>Secure Bootloader</span>
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-white/60 text-lg mb-6 leading-relaxed">
                A cryptographically verified, multi-stage bootloader for EmbeddedOS devices.
                Hardware root-of-trust, OTA A/B updates with automatic rollback, and sub-200ms boot time.
              </motion.p>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-wrap gap-3">
                <Link href="/getting-started"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#F59E0B", color: "#000" }}>
                  Get Started <ArrowRight size={15} />
                </Link>
                <Link href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
                  <BookOpen size={15} /> eBoot Docs
                </Link>
              </motion.div>
            </div>

            {/* Boot sequence animation */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="flex flex-col gap-4">
              {/* 3D boot sequence animation */}
              <div className="rounded-2xl border border-white/8 overflow-hidden h-48"
                style={{ background: "rgba(5,10,20,0.85)" }}>
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#FBBF24] border-t-transparent rounded-full animate-spin" /></div>}>
                  <EBootCanvas hovered={false} />
                </Suspense>
              </div>
              <div className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: "rgba(5,10,20,0.85)" }}>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#F0883E]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
                  </div>
                  <span className="text-xs font-mono text-white/30 ml-2">boot-sequence.log</span>
                </div>
                <div className="p-5 font-mono text-xs space-y-3">
                  {[
                    { color: "#60A5FA", prefix: "[ROM]   ", text: "Verifying eBoot Stage 1 signature... OK" },
                    { color: "#22D3EE", prefix: "[BOOT1] ", text: "Initialising clocks @ 480 MHz... OK" },
                    { color: "#22D3EE", prefix: "[BOOT1] ", text: "DRAM init 64MB SDRAM... OK" },
                    { color: "#22D3EE", prefix: "[BOOT1] ", text: "Verifying Stage 2 signature... OK" },
                    { color: "#34D399", prefix: "[BOOT2] ", text: "OTA staging: no pending update" },
                    { color: "#34D399", prefix: "[BOOT2] ", text: "Verifying EoS kernel hash... OK" },
                    { color: "#34D399", prefix: "[BOOT2] ", text: "Handing control to EoS kernel..." },
                    { color: "#F97316", prefix: "[EoS]   ", text: "EmbeddedOS v2.4.1 booting... 187ms" },
                    { color: "#F97316", prefix: "[EoS]   ", text: "All systems nominal. ✓" },
                  ].map((line, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.18, duration: 0.3 }}
                      className="flex gap-2">
                      <span style={{ color: line.color }}>{line.prefix}</span>
                      <span className="text-white/60">{line.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Boot stages */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="font-heading font-black text-3xl text-white mb-2">Boot Sequence</h2>
            <p className="text-white/40 text-base">Four verified stages from silicon to running OS</p>
          </motion.div>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-[#60A5FA] via-[#34D399] to-[#F97316] opacity-30 hidden sm:block" />
            <div className="space-y-4">
              {BOOT_STAGES.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <motion.div key={stage.step}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    className="flex gap-4 items-start rounded-2xl p-5 border"
                    style={{ background: `${stage.color}08`, borderColor: `${stage.color}20` }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${stage.color}18` }}>
                      <Icon size={20} style={{ color: stage.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold" style={{ color: stage.color }}>STAGE {stage.step}</span>
                        <span className="font-heading font-bold text-white">{stage.name}</span>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed">{stage.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="font-heading font-black text-3xl text-white mb-2">eBoot Features</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="rounded-2xl border p-5 card-hover-glow"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: `${f.color}20` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${f.color}15` }}>
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <div className="font-heading font-bold text-white mb-1">{f.title}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{f.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-3xl p-10 text-center border"
            style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
            <h2 className="font-heading font-black text-3xl text-white mb-3">Secure your device from boot</h2>
            <p className="text-white/55 text-lg mb-6 max-w-xl mx-auto">
              eBoot is included with every EoS installation. No separate configuration needed.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#F59E0B", color: "#000" }}>
                Flash eBoot <ArrowRight size={15} />
              </Link>
              <Link href="/eos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
                <ChevronRight size={15} /> EoS Kernel
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
