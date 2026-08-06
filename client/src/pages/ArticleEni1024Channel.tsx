import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_eni_1024_channel_pipeline() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> February 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 7 min read
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  color: "#F97316",
                }}
              >
                <Tag className="w-3 h-3" /> Research
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              ENI's 1,024-Channel Pipeline: Deterministic Spike Sorting in 800
              µs
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              How the Embedded Neural Interface stack moves a thousand-electrode
              array through filtering, sorting, and decoding inside a single
              RTOS frame — and why the hardest part was not the math.
            </p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why determinism matters more than throughput
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A neural decoder that processes 1,024 channels in 800 µs on
              average but occasionally takes 2 ms is useless for closed-loop
              stimulation. The stimulator fires based on decoded intent; a
              missed deadline means the stimulus arrives after the neural event
              it was supposed to respond to. Determinism — guaranteed worst-case
              latency — is the hard constraint.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">The frame</h2>
            <p className="text-gray-300 leading-relaxed">
              eNI processes neural data in 1 ms frames. Each frame contains
              1,024 channels × 30 kHz × 16-bit = 61.44 MB/s of raw data. The
              pipeline runs in 800 µs, leaving 200 µs margin for the RTOS
              scheduler and eIPC transport. The pipeline stages are: bandpass
              filter (300–6000 Hz) → threshold detection → waveform extraction →
              PCA feature extraction → k-means cluster assignment → EIPC
              publish.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Memory bank scheduling
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The RK3588S has 4 independent memory banks. The pipeline assigns
              each stage to a different bank to eliminate bank conflicts. The
              filter stage reads from bank 0 and writes to bank 1. The threshold
              stage reads from bank 1. The waveform extractor reads from bank 1
              and writes to bank 2. This scheduling reduces memory latency by
              40% compared to a single-bank layout.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Open data</h2>
            <p className="text-gray-300 leading-relaxed">
              The 1,024-channel test dataset (synthetic Poisson spike trains
              with realistic noise) is available on GitHub under CC-BY-4.0. The
              eNI pipeline benchmark harness is included in the eNI repository
              and runs on any EoS device with 8+ MB PSRAM.
            </p>
          </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/neural-link-ai"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              Neural Link AI
            </Link>
            <Link
              href="/eai-edge"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              eAI Edge Stack
            </Link>
            <Link
              href="/future-research"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              Future Research
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors text-sm text-orange-400"
            >
              <ArrowRight className="w-4 h-4" />
              All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
