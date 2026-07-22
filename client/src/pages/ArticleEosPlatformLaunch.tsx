import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_eos_platform_launch() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> June 2025</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 6 min read</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}><Tag className="w-3 h-3" /> Release</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">eos-platform 1.0: One Toolchain, Every EoS Profile</h1>
            <p className="text-xl text-gray-400 leading-relaxed">After eighteen months of incremental releases, the eos-platform meta-distribution reaches 1.0 with stable APIs, a unified package manifest, and reproducible builds across all 52 supported boards.</p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">What is eos-platform?</h2>
        <p className="text-gray-300 leading-relaxed">eos-platform is the meta-distribution layer that sits above the EoS kernel. It bundles the kernel, HAL drivers, system services (eDB, eIPC, eLogger, eNet), and the eApps runtime into a single versioned manifest. Before 1.0, each component had its own release cadence, making reproducible builds difficult. Now, a single manifest.yml pins every component to a tested combination.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Stable API surface</h2>
        <p className="text-gray-300 leading-relaxed">The 1.0 release freezes the public C API for all 14 modules (HAL, Kernel, Multicore, Crypto, OTA, Sensors, Motor, Filesystem, Power, Networking, Debug, Drivers, Services, Logging). Any code written against the 1.0 API will compile without changes on any future 1.x release. Breaking changes require a 2.0 bump.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Unified package manifest</h2>
        <p className="text-gray-300 leading-relaxed">The new manifest.yml format specifies the board target, kernel profile (minimal, standard, full), enabled services, and pinned app versions. ebuild reads this manifest and produces a deterministic firmware image. The same manifest checked into git produces the same binary on any CI machine.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Reproducible builds</h2>
        <p className="text-gray-300 leading-relaxed">All 52 board targets now produce bit-for-bit identical binaries when built from the same manifest and source tree. This is a prerequisite for the upcoming safety-certified profile (IEC 62443, ISO 26262 ASIL-B) where binary reproducibility is a compliance requirement.</p>
        
      </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            
            <Link href="/eos" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />EoS Kernel</Link>
            <Link href="/ebuild" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />eBuild Reference</Link>
            <Link href="/api-docs" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />API Reference</Link>
            <Link href="/news" className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors text-sm text-orange-400"><ArrowRight className="w-4 h-4" />All Articles</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
