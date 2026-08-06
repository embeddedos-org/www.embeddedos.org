import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_eboot_secure_boot_deepdive() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> April 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 8 min read
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  color: "#F97316",
                }}
              >
                <Tag className="w-3 h-3" /> Security
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              eBoot Secure Boot: A Measured-Launch Walkthrough
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              An end-to-end tour of eBoot's chain of trust — root-of-trust keys,
              immutable stage 0, signed manifests, anti-rollback counters, and
              the runtime attestation hooks eAI consumes during model loading.
            </p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Chain of trust
            </h2>
            <p className="text-gray-300 leading-relaxed">
              eBoot's chain of trust starts with an immutable ROM stage 0 that
              contains the root-of-trust public key baked into OTP fuses at
              manufacturing. Stage 0 verifies stage 1 (the eBoot main binary)
              using ECDSA-P256. Stage 1 verifies the EoS kernel image and the
              app manifest. No stage executes unless the previous stage's
              signature is valid.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Stage progression
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Stage 0 (ROM, 4 KB) → Stage 1 (eBoot main, 48 KB) → Stage 2 (EoS
              kernel, variable) → Stage 3 (app manifest verification). Each
              stage measures the next stage's hash into a TPM PCR register (or a
              software PCR on devices without hardware TPM). The final PCR chain
              is the device's attestation quote.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Anti-rollback counters
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Each signed image contains a monotonic version counter stored in
              OTP. eBoot refuses to boot any image with a counter value lower
              than the current OTP value. This prevents downgrade attacks where
              an attacker flashes an older, vulnerable firmware version. Counter
              increments are irreversible.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Runtime attestation
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The eAI model loader calls eBoot's attestation API to verify the
              PCR chain before loading any ML model. This ensures that a model
              only executes on a device that booted a known-good firmware stack.
              Compromised firmware cannot load production models, limiting the
              blast radius of a kernel exploit.
            </p>
          </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/eboot"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              eBoot Product Page
            </Link>
            <Link
              href="/security"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              Security Architecture
            </Link>
            <Link
              href="/eos"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              EoS Kernel
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
