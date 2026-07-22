import { motion } from "framer-motion";
import { Shield, AlertTriangle, Lock, Eye, CheckCircle2, Mail, ArrowRight } from "lucide-react";

const policies = [
  { icon: AlertTriangle, color: "#EF4444", title: "Responsible Disclosure", desc: "Email security@embeddedos.org with vulnerability details. We follow a 90-day disclosure timeline. Critical vulnerabilities are patched within 7 days." },
  { icon: Lock, color: "#F97316", title: "Scope", desc: "All EmbeddedOS repositories on GitHub are in scope: EoS kernel, eBootloader, EAI, ENI, EIPC, eBuild, EoSim, EoStudio, eDB, eBrowser, eOffice, and all related tooling." },
  { icon: Eye, color: "#22D3EE", title: "Out of Scope", desc: "Third-party dependencies, GitHub infrastructure, social engineering attacks, and physical attacks on hardware are out of scope." },
  { icon: CheckCircle2, color: "#34D399", title: "Recognition", desc: "Security researchers who responsibly disclose valid vulnerabilities are credited in the security advisory and our Hall of Fame." },
];

const features = [
  { title: "Capability-Based Security", desc: "EoS uses capability tokens for all inter-process communication. Processes cannot access resources they were not explicitly granted at creation time." },
  { title: "Verified Boot Chain", desc: "eBootloader implements a 5-stage verified boot with Ed25519 signatures, hardware root of trust, and rollback protection." },
  { title: "Memory Safety", desc: "EoS enforces strict memory isolation between processes using MPU/MMU. Stack canaries and ASLR are supported on capable hardware." },
  { title: "Cryptographic Primitives", desc: "The EoS crypto module provides AES-256-GCM, ChaCha20-Poly1305, Ed25519, X25519, SHA-3, and BLAKE3 — all with constant-time implementations." },
  { title: "Secure OTA Updates", desc: "All firmware updates are signed with Ed25519 and verified before activation. Version rollback is prevented by a hardware-backed counter." },
  { title: "Post-Quantum Roadmap", desc: "CRYSTALS-Kyber and CRYSTALS-Dilithium are on the v0.3 roadmap for quantum-resistant key exchange and signatures." },
];

export default function Security() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> SECURITY POLICY
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">Security Policy</h1>
            <p className="text-xl text-gray-300">How to report vulnerabilities and how EmbeddedOS is built to be secure.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-semibold mb-1">Report a Vulnerability</div>
              <p className="text-gray-300 text-sm">Do <strong>not</strong> open a public GitHub issue for security vulnerabilities. Email <a href="mailto:security@embeddedos.org" className="text-orange-400 hover:underline">security@embeddedos.org</a> with details. We will respond within 48 hours.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: p.color + "20" }}>
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Security Architecture</h2>
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-1">{f.title}</div>
                    <div className="text-gray-400 text-sm">{f.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Security Team</h2>
          <a href="mailto:security@embeddedos.org" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
            <Mail className="w-4 h-4" /> security@embeddedos.org
          </a>
        </div>
      </section>
    </div>
  );
}
