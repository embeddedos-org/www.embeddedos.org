import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_edb_encryption_at_rest() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> March 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 6 min read
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  color: "#F97316",
                }}
              >
                <Tag className="w-3 h-3" /> Engineering
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              eDB Ships AES-XTS At-Rest Encryption — Even on 64 KB Devices
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              eDB's new storage layer adds page-level AES-XTS encryption with
              hardware-key offload on supported MCUs. The catch: it had to fit
              in 6 KB of code on the smallest target.
            </p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              The constraint
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The smallest eDB target is an STM32L0 with 64 KB flash and 8 KB
              SRAM. The encryption layer had to fit in 6 KB of code, use at most
              512 bytes of SRAM for the cipher state, and add no more than 15%
              throughput overhead on a 32 MHz CPU. These constraints ruled out
              most existing embedded crypto libraries.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Why AES-XTS</h2>
            <p className="text-gray-300 leading-relaxed">
              AES-XTS (XEX-based tweaked-codebook mode with ciphertext stealing)
              is the standard for disk encryption (IEEE P1619). Unlike AES-CBC,
              XTS is parallelizable and does not propagate errors across pages.
              Each 512-byte database page is encrypted independently with a
              tweak derived from the page number, so a single corrupted page
              does not affect adjacent pages.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Hardware key offload
            </h2>
            <p className="text-gray-300 leading-relaxed">
              On MCUs with hardware AES (STM32H7, ESP32-S3, nRF5340), the key
              never leaves the hardware key store. The CPU provides the
              plaintext and tweak; the hardware returns ciphertext. The master
              key is derived from a device-unique secret in OTP using
              HKDF-SHA256, so it is never stored in flash.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">What we cut</h2>
            <p className="text-gray-300 leading-relaxed">
              To meet the 6 KB code budget, we dropped authenticated encryption
              (AEAD). eDB uses AES-XTS for confidentiality and a separate
              HMAC-SHA256 page MAC for integrity. This adds 32 bytes per page
              (6.25% overhead on 512-byte pages) but keeps the cipher and MAC
              implementations separate and auditable.
            </p>
          </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/edb"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              eDB Product Page
            </Link>
            <Link
              href="/security"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              Security Architecture
            </Link>
            <Link
              href="/eipc"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              eIPC Protocol
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
