import { useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, BookOpen, ArrowRight, Shield } from "lucide-react";
import { Link } from "wouter";

const tracks = [
  { id: "eos", name: "EoS Developer", color: "#F97316", certs: ["EoS Fundamentals (EoSF)", "EoS Advanced (EoSA)", "EoS Expert (EoSE)", "EoS Architect (EoSAr)"], exams: 4 },
  { id: "security", name: "Security", color: "#EF4444", certs: ["Embedded Security Fundamentals (ESF)", "Secure Boot Specialist (SBS)", "Crypto & PKI (CPK)", "Security Architect (ESA)"], exams: 4 },
  { id: "ai", name: "AI/ML", color: "#A855F7", certs: ["EAI Fundamentals (EAIF)", "EAI Practitioner (EAIP)", "Neural Interface Specialist (NIS)", "AI Architect (EAIAr)"], exams: 4 },
  { id: "health", name: "Health Devices", color: "#34D399", certs: ["eHealth365 Developer (EHD)", "Medical Device Compliance (MDC)", "BCI Specialist (BCIS)", "Health Architect (EHA)"], exams: 4 },
  { id: "aerospace", name: "Aerospace", color: "#22D3EE", certs: ["Aerospace Fundamentals (AEF)", "DO-178C Compliance (DO178)", "ARINC 653 Specialist (A653)", "Aerospace Architect (AEA)"], exams: 4 },
  { id: "rtos", name: "RTOS & Kernel", color: "#FBBF24", certs: ["RTOS Fundamentals (RTOSF)", "Kernel Internals (KI)", "Driver Development (DD)", "RTOS Architect (RTOSA)"], exams: 4 },
];

const steps = [
  { num: "01", title: "Choose a Track", desc: "Select the certification track that matches your role and goals. All tracks start with a Fundamentals exam." },
  { num: "02", title: "Study the Curriculum", desc: "Use EoStudio's built-in learning paths, the official documentation, and the EmbeddedOS Books library to prepare." },
  { num: "03", title: "Practice in EoSim", desc: "All certification exams include a practical component. Use EoSim to practice the hands-on tasks before exam day." },
  { num: "04", title: "Take the Exam", desc: "Exams are proctored online. Each exam is 90 minutes: 60 multiple-choice questions + 2 practical tasks in EoSim." },
  { num: "05", title: "Earn Your Badge", desc: "Pass the exam to receive a digital badge (Credly) and a PDF certificate. Badges are verifiable by employers." },
];

export default function CertificationPage() {
  const [activeTrack, setActiveTrack] = useState("eos");
  const track = tracks.find(t => t.id === activeTrack)!;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Award className="w-4 h-4" /> CERTIFICATION
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">Professional Certifications</h1>
            <p className="text-xl text-gray-400">60 industry-recognized credentials across 12 tracks. Free to attempt, verifiable by employers, and backed by the EmbeddedOS 501(c)(3) · 509(a)(2) Foundation.</p>
            <div className="flex flex-wrap gap-6 justify-center mt-8">
              <div className="text-center"><div className="text-3xl font-bold text-orange-400">60</div><div className="text-gray-500 text-sm">Certifications</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-cyan-400">12</div><div className="text-gray-500 text-sm">Tracks</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-purple-400">Free</div><div className="text-gray-500 text-sm">To Attempt</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-green-400">Credly</div><div className="text-gray-500 text-sm">Digital Badges</div></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Certification Tracks</h2>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {tracks.map(t => (
              <button key={t.id} onClick={() => setActiveTrack(t.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={activeTrack === t.id ? { background: t.color + "20", color: t.color, border: "1px solid " + t.color + "40" } : { background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}>
                {t.name}
              </button>
            ))}
          </div>
          <motion.div key={activeTrack} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">{track.name} Track</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: track.color + "20", color: track.color }}>{track.exams} exams</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {track.certs.map((cert, i) => (
                <div key={cert} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: track.color + "20", color: track.color }}>{i + 1}</div>
                  <span className="text-gray-300 text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How to Earn Your Certification</h2>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-2xl font-black font-mono text-orange-400/40 flex-shrink-0">{s.num}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/getting-started" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">Start Studying <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/internship" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">Internship Program</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
