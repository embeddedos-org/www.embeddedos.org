import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, X, Upload, ChevronDown, MapPin, Clock, Briefcase, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const WEB3FORMS_KEY = "97f985ce-75d3-47e8-b941-3e85db2e7395";

const openings = [
  // Kernel & Core OS
  { id: 1, title: "Senior Kernel Engineer", dept: "Kernel & OS", location: "Remote", type: "Full-time", level: "Senior", desc: "Design and implement core RTOS features for ARM Cortex-M and RISC-V targets. Own scheduling, memory management, and interrupt handling." },
  { id: 2, title: "Embedded Systems Architect", dept: "Kernel & OS", location: "Remote", type: "Full-time", level: "Staff", desc: "Define the technical roadmap for EoS kernel architecture. Drive cross-team alignment on ABI stability, security boundaries, and platform profiles." },
  { id: 3, title: "Bootloader Engineer", dept: "Kernel & OS", location: "Remote", type: "Full-time", level: "Mid", desc: "Develop and maintain eBootloader across 24+ reference boards. Own A/B slot logic, secure boot chain, and OTA update reliability." },
  { id: 4, title: "BSP Engineer", dept: "Kernel & OS", location: "Remote", type: "Full-time", level: "Mid", desc: "Port EoS to new hardware targets. Write board support packages, device drivers, and HAL layers for MCU and SoC platforms." },
  // AI & ML
  { id: 5, title: "Embedded AI Engineer", dept: "AI & ML", location: "Remote", type: "Full-time", level: "Senior", desc: "Optimize LLM and small-model inference for constrained hardware. Work on quantization, model pruning, and EAI runtime performance." },
  { id: 6, title: "ML Compiler Engineer", dept: "AI & ML", location: "Remote", type: "Full-time", level: "Senior", desc: "Build and optimize the ML compilation pipeline for embedded targets. Work with MLIR, TVM, and custom hardware backends." },
  { id: 7, title: "Neural Interface Engineer", dept: "AI & ML", location: "Remote", type: "Full-time", level: "Senior", desc: "Develop the ENI neural interface stack — signal acquisition, real-time spike sorting, and closed-loop stimulation algorithms." },
  // Tooling & SDK
  { id: 8, title: "SDK Engineer — eBuild", dept: "Tooling & SDK", location: "Remote", type: "Full-time", level: "Mid", desc: "Extend and maintain the eBuild CLI. Add new board targets, improve cross-compilation pipelines, and build developer ergonomics." },
  { id: 9, title: "IDE Engineer — EoStudio", dept: "Tooling & SDK", location: "Remote", type: "Full-time", level: "Mid", desc: "Build features in EoStudio — domain editors, code generators, RTOS task inspector, and hardware-in-the-loop debugger." },
  { id: 10, title: "Simulator Engineer — EoSim", dept: "Tooling & SDK", location: "Remote", type: "Full-time", level: "Mid", desc: "Improve EoSim's QEMU/Renode harness and HIL bridge. Build automated test infrastructure for EoS images." },
  // Security
  { id: 11, title: "Security Engineer — EIPC", dept: "Security", location: "Remote", type: "Full-time", level: "Senior", desc: "Own the EIPC capability-based IPC security model. Conduct threat modeling, implement cryptographic primitives, and audit component boundaries." },
  { id: 12, title: "Cryptography Engineer", dept: "Security", location: "Remote", type: "Full-time", level: "Senior", desc: "Design and implement cryptographic protocols for embedded targets — secure boot, attestation, key management, and TLS on constrained devices." },
  // Applications
  { id: 13, title: "Embedded App Developer", dept: "Applications", location: "Remote", type: "Full-time", level: "Mid", desc: "Build and maintain apps in the eApps catalog. Work across media, productivity, and system utility apps optimized for embedded hardware." },
  { id: 14, title: "Flutter/Dart Engineer — eServiceApps", dept: "Applications", location: "Remote", type: "Full-time", level: "Mid", desc: "Develop eServiceApps (eSocial, eRide, eTravel, eTrack, eWallet) in Dart/Flutter for embedded and mobile targets." },
  { id: 15, title: "Browser Engine Engineer — eBowser", dept: "Applications", location: "Remote", type: "Full-time", level: "Senior", desc: "Develop the eBowser HTML5/CSS/JS rendering engine. Optimize layout, painting, and JavaScript execution for embedded displays." },
  // Research
  { id: 16, title: "Research Engineer — Embedded Systems", dept: "Research", location: "Remote", type: "Full-time", level: "Senior", desc: "Conduct applied research on next-generation embedded OS topics — formal verification, hardware security, real-time ML, and edge computing." },
  { id: 17, title: "Hardware Lab Engineer", dept: "Research", location: "San Jose, CA", type: "Full-time", level: "Mid", desc: "Manage the hardware lab — board bring-up, HIL testing infrastructure, and validation of EoS on new silicon." },
  // Community & Docs
  { id: 18, title: "Developer Advocate", dept: "Community", location: "Remote", type: "Full-time", level: "Mid", desc: "Grow the EmbeddedOS developer community. Create tutorials, demos, conference talks, and technical blog posts." },
  { id: 19, title: "Technical Writer", dept: "Community", location: "Remote", type: "Full-time", level: "Mid", desc: "Write and maintain comprehensive documentation for all 14 EmbeddedOS products. Own the docs site, API references, and getting-started guides." },
  // Internships
  { id: 20, title: "Kernel Engineering Intern", dept: "Kernel & OS", location: "Remote", type: "Internship", level: "Intern", desc: "Work alongside kernel engineers on EoS features. Ideal for CS/EE students with embedded systems coursework." },
  { id: 21, title: "AI Research Intern", dept: "AI & ML", location: "Remote", type: "Internship", level: "Intern", desc: "Research on-device AI optimization techniques. Work with EAI runtime team on model quantization and inference benchmarks." },
  { id: 22, title: "Security Research Intern", dept: "Security", location: "Remote", type: "Internship", level: "Intern", desc: "Assist with security audits, threat modeling, and cryptographic implementation reviews across EmbeddedOS components." },
];

const depts = ["All", "Kernel & OS", "AI & ML", "Tooling & SDK", "Security", "Applications", "Research", "Community"];

const faqs = [
  { q: "Do you sponsor work visas?", a: "Yes. EmbeddedOS Foundation sponsors H-1B, O-1, and TN visas for exceptional candidates. We also support green card sponsorship for long-term team members. Our People team will walk you through the process during the offer stage." },
  { q: "What is the interview process?", a: "Our process has 4 stages: (1) a 30-minute intro call with a recruiter, (2) a take-home technical assessment (3–4 hours, paid), (3) a 90-minute technical deep-dive with the hiring team, and (4) a 45-minute culture and values conversation. Total time from application to offer is typically 3–4 weeks." },
  { q: "Are roles equity-eligible?", a: "Yes. All full-time roles include equity in the EmbeddedOS Foundation's future commercial entity. We use a transparent equity calculator based on level and role. Equity vests over 4 years with a 1-year cliff." },
  { q: "Is the work fully remote?", a: "Yes — we are remote-first globally. The only exception is the Hardware Lab Engineer role in San Jose, CA, which requires on-site access to physical hardware. All other roles are fully remote with no location restrictions." },
  { q: "What is the tech stack?", a: "Kernel: C, Assembly (ARM/RISC-V). Tooling: Python, Rust, CMake. IDE: TypeScript, Electron. AI Runtime: C++, Python, ONNX. Apps: Dart/Flutter, C. Web: React, TypeScript, Astro. We value depth over breadth — you don't need to know everything." },
  { q: "What benefits do you offer?", a: "Competitive salary benchmarked to top-10% of market, equity, unlimited PTO, $3,000/year learning budget, home office stipend ($1,500 setup + $100/month), conference travel budget, and full health/dental/vision for US employees. International employees receive a benefits equivalent allowance." },
  { q: "Can I contribute to EmbeddedOS before applying?", a: "Absolutely — and we encourage it. Open-source contributions are the best way to demonstrate your skills. Many of our team members were contributors first. Check our GitHub for good-first-issue labels." },
  { q: "Do you hire people without a CS degree?", a: "Yes. We evaluate candidates on demonstrated skills, not credentials. Many of our engineers are self-taught or have non-traditional backgrounds. What matters is your ability to build and reason about embedded systems." },
];

interface ApplicationForm {
  name: string;
  email: string;
  linkedin: string;
  message: string;
  resume: File | null;
}

export default function Careers() {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [applyJob, setApplyJob] = useState<typeof openings[0] | null>(null);
  const [form, setForm] = useState<ApplicationForm>({ name: "", email: "", linkedin: "", message: "", resume: null });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = openings.filter((j) => {
    const matchDept = activeDept === "All" || j.dept === activeDept;
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.dept.toLowerCase().includes(search.toLowerCase()) ||
      j.desc.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_KEY);
      fd.append("subject", `Job Application: ${applyJob?.title} — ${form.name}`);
      fd.append("from_name", form.name);
      fd.append("email", form.email);
      fd.append("Position", applyJob?.title || "");
      fd.append("Department", applyJob?.dept || "");
      fd.append("LinkedIn", form.linkedin);
      fd.append("Message", form.message);
      if (form.resume) fd.append("resume", form.resume);

      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Submission failed. Please try again or email us directly.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setApplyJob(null);
    setSubmitted(false);
    setError("");
    setForm({ name: "", email: "", linkedin: "", message: "", resume: null });
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">We're Hiring</p>
          <h1 className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl text-white mb-6">
            Build the <span className="text-gold-gradient">Future</span>
            <br />of Embedded Systems
          </h1>
          <p className="text-[#666] text-xl max-w-2xl mx-auto leading-relaxed">
            Join a world-class open-source team building OS infrastructure for billions of devices.
            Remote-first, mission-driven, equity-eligible.
          </p>
        </motion.div>

        {/* Perks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Remote-First", sub: "Work from anywhere" },
            { label: "Equity", sub: "4-year vest, 1-year cliff" },
            { label: "$3K Learning", sub: "Annual education budget" },
            { label: "Visa Sponsorship", sub: "H-1B, O-1, TN, GC" },
          ].map(({ label, sub }) => (
            <div key={label} className="glass-card rounded-2xl p-5 text-center">
              <div className="text-white font-semibold mb-1">{label}</div>
              <div className="text-[#555] text-xs">{sub}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {depts.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDept(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeDept === d
                  ? "bg-[#C9A84C] text-black"
                  : "bg-[rgba(255,255,255,0.04)] text-[#666] border border-[rgba(255,255,255,0.08)] hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Job listings */}
        <div className="space-y-3 mb-20">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl p-5 sm:p-6 group hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white text-lg group-hover:text-[#E8C97A] transition-colors">{job.title}</h3>
                    <span className={`badge ${job.type === "Internship" ? "bg-[rgba(255,255,255,0.05)] text-[#666] border border-[rgba(255,255,255,0.1)]" : "bg-[rgba(201,168,76,0.1)] text-[#C9A84C] border border-[rgba(201,168,76,0.2)]"}`}>
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[#555] mb-3">
                    <span className="flex items-center gap-1"><Briefcase size={12} />{job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{job.level}</span>
                  </div>
                  <p className="text-[#555] text-sm leading-relaxed">{job.desc}</p>
                </div>
                <button
                  onClick={() => setApplyJob(job)}
                  className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold shrink-0 flex items-center gap-2"
                >
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#444]">
              <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
              <p>No roles match your search. Try a different department or keyword.</p>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-['Playfair_Display'] font-bold text-4xl text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-[#555] text-lg">Everything you need to know about working at EmbeddedOS.</p>
          </motion.div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-white pr-4">{q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#C9A84C] shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[#666] text-sm leading-relaxed border-t border-[rgba(255,255,255,0.05)] pt-4">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Open application CTA */}
        <div className="glass-card rounded-3xl p-10 text-center">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-white mb-4">Don't See Your Role?</h2>
          <p className="text-[#666] mb-6 max-w-lg mx-auto">Send us an open application. We're always looking for exceptional embedded systems engineers.</p>
          <button
            onClick={() => setApplyJob({ id: 0, title: "Open Application", dept: "General", location: "Remote", type: "Full-time", level: "Any", desc: "Open application for any role at EmbeddedOS." })}
            className="btn-gold px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2"
          >
            Send Open Application <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {applyJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="bg-[#0d0d0d] border border-[rgba(201,168,76,0.2)] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-['Playfair_Display'] font-bold text-2xl text-white mb-1">Apply Now</h2>
                    <p className="text-[#C9A84C] text-sm">{applyJob.title}</p>
                  </div>
                  <button onClick={closeModal} className="text-[#555] hover:text-white transition-colors p-1">
                    <X size={22} />
                  </button>
                </div>

                {submitted ? (
                  <div className="text-center py-10">
                    <CheckCircle size={48} className="text-[#C9A84C] mx-auto mb-4" />
                    <h3 className="font-semibold text-white text-xl mb-2">Application Received!</h3>
                    <p className="text-[#666] text-sm mb-6">We'll review your application and get back to you within 5 business days.</p>
                    <button onClick={closeModal} className="btn-gold px-6 py-3 rounded-xl font-semibold">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">LinkedIn / GitHub / Portfolio</label>
                      <input
                        value={form.linkedin}
                        onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Why EmbeddedOS? *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
                        placeholder="Tell us about your background and why you want to join..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Resume / CV</label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full border border-dashed border-[rgba(201,168,76,0.3)] rounded-xl py-4 px-4 text-sm text-[#555] hover:border-[rgba(201,168,76,0.6)] hover:text-[#C9A84C] transition-all flex items-center justify-center gap-2"
                      >
                        <Upload size={16} />
                        {form.resume ? form.resume.name : "Upload PDF, DOC, or DOCX (max 5MB)"}
                      </button>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold w-full py-4 rounded-xl font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <p className="text-[#444] text-xs text-center">
                      Application sent to contact@embeddedos.org via Web3Forms
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
