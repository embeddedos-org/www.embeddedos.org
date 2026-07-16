import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_eos_roadmap_2026() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> January 2025</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 6 min read</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}><Tag className="w-3 h-3" /> Roadmap</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">EoS RTOS Roadmap 2026: Tickless Idle, RT-IPC, Formal Verification</h1>
            <p className="text-xl text-gray-400 leading-relaxed">Three large RTOS bets for 2026: a tickless scheduler with sub-microsecond wake latency, RT-IPC primitives sharing memory across security domains, and a formally verified context-switch path.</p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">1. Tickless idle</h2>
        <p className="text-gray-300 leading-relaxed">The current EoS scheduler uses a 1 ms tick interrupt. This prevents the CPU from entering deep sleep for more than 1 ms, wasting power on battery devices. The 2026 tickless scheduler programs the RTC to wake the CPU only when the next task deadline arrives. On a typical IoT workload (1 Hz sensor read, 10 Hz display update), this reduces idle power from 8 mA to 0.4 mA — a 20× improvement.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">2. RT-IPC across security domains</h2>
        <p className="text-gray-300 leading-relaxed">Today, eIPC uses copy-based message passing across MPU domain boundaries. For high-bandwidth use cases (neural data, video), copy overhead is prohibitive. RT-IPC introduces a shared-memory window with hardware-enforced read/write permissions: the producer domain has write access, the consumer domain has read access, and neither can access the other's private memory. This enables zero-copy neural data transfer at 61 MB/s.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">3. Formal verification of the context switch</h2>
        <p className="text-gray-300 leading-relaxed">The context switch is the most security-critical code in any RTOS. A bug here can corrupt task state, leak secrets across security domains, or enable privilege escalation. We are using TLA+ to specify the context-switch state machine and Coq to prove that the implementation matches the spec. The verified context switch will ship in EoS 2.0.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">What's not on the list</h2>
        <p className="text-gray-300 leading-relaxed">We are explicitly not adding a POSIX compatibility layer, a dynamic linker, or a general-purpose memory allocator in 2026. These features would increase the kernel's attack surface and binary size. EoS remains a purpose-built embedded RTOS, not a general-purpose OS.</p>
        
      </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            
            <Link href="/roadmap" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />Full Roadmap</Link>
            <Link href="/eos" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />EoS Kernel</Link>
            <Link href="/research" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />Research</Link>
            <Link href="/news" className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors text-sm text-orange-400"><ArrowRight className="w-4 h-4" />All Articles</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
