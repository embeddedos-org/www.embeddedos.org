import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_eai_llm_bench() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> May 2025</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 7 min read</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}><Tag className="w-3 h-3" /> Engineering</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">EAI 0.9: INT4 LLM Runtime — 11 tok/s on Cortex-M85</h1>
            <p className="text-xl text-gray-400 leading-relaxed">EAI's new quantized inference path squeezes a 1.3B-parameter model into 312 MB of flash and runs at interactive speed on a 480 MHz microcontroller.</p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">The numbers</h2>
        <p className="text-gray-300 leading-relaxed">On a Cortex-M85 running at 480 MHz with 512 KB SRAM and 8 MB PSRAM, the INT4 runtime achieves 11 tokens/second on a 1.3B-parameter GGUF model. Peak memory footprint is 312 MB flash + 4.2 MB SRAM for the KV cache. This is the first time interactive-speed LLM inference has been demonstrated on a microcontroller without an NPU.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Block-streamed inference</h2>
        <p className="text-gray-300 leading-relaxed">The key insight is block-streamed weight loading: instead of mapping the entire model into PSRAM, the runtime streams 4 KB weight blocks from flash into SRAM just-in-time for each attention layer. This reduces peak SRAM usage by 94% compared to a naive full-model load, at the cost of 12% throughput reduction from flash read latency.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Quantization quality</h2>
        <p className="text-gray-300 leading-relaxed">INT4 quantization uses per-channel symmetric quantization with outlier clamping. On the MMLU benchmark, the INT4 model scores 58.2% vs 61.4% for the FP16 reference — a 3.2 percentage point drop. For on-device use cases (intent classification, command parsing, sensor data summarization), this quality level is acceptable.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">What this enables</h2>
        <p className="text-gray-300 leading-relaxed">With 11 tok/s on a $4 MCU, natural language device control (eBot) becomes viable without cloud connectivity. A device can parse free-form commands, generate sensor summaries, and respond to queries entirely on-chip. This is the foundation for the eAI Edge stack's offline-first design.</p>
        
      </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            
            <Link href="/eai" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />EAI Platform</Link>
            <Link href="/eai-edge" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />eAI Edge Stack</Link>
            <Link href="/neural-link-ai" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />Neural Link AI</Link>
            <Link href="/news" className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors text-sm text-orange-400"><ArrowRight className="w-4 h-4" />All Articles</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
