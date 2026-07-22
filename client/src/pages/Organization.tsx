import { motion } from "framer-motion";
import { Building2, Users, Scale, Globe, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const governance = [
  { role: "Board of Directors", desc: "Sets Foundation strategy, approves budgets, and ensures 501(c)(3) compliance. Meets quarterly.", members: "5 directors" },
  { role: "Technical Steering Committee (TSC)", desc: "Governs technical direction, approves major architectural changes, and manages the release process.", members: "7 members" },
  { role: "Working Groups", desc: "Focused groups for specific areas: Security, Documentation, Education, Hardware Certification, and Community.", members: "Open membership" },
  { role: "Core Maintainers", desc: "Engineers with merge rights to core EoS repositories. Appointed by the TSC based on contribution history.", members: "12 maintainers" },
];

const legal = [
  { label: "Legal Name", value: "Embedded Operating Systems Research Foundation" },
  { label: "Organization Type", value: "501(c)(3) Public Charity" },
  { label: "Public Charity Classification", value: "509(a)(2)" },
  { label: "Jurisdiction", value: "United States" },
  { label: "EIN", value: "41-4821627" },
  { label: "Effective Date of Exemption", value: "March 11, 2026" },
  { label: "Accounting Period Ending", value: "December 31" },
  { label: "Contribution Deductibility", value: "Yes — IRC Section 170" },
  { label: "Primary License", value: "MIT License" },
  { label: "Trademark", value: "EmbeddedOS™, EoS™, eFlow™, EoStudio™" },
];

const principles = [
  "Vendor neutrality — no single company controls EmbeddedOS",
  "Open governance — all technical decisions are made in public",
  "MIT licensing — free forever, no licensing fees",
  "Security-first — every release undergoes security review",
  "Accessibility — free certifications, open curriculum, global internships",
  "Sustainability — Foundation funded by donations and sponsorships, not VC",
];

export default function Organization() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" /> FOUNDATION
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">The EmbeddedOS Foundation</h1>
            <p className="text-xl text-gray-300">A 501(c)(3) nonprofit organization dedicated to building the future of embedded computing through open-source software, education, and research.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Governance Structure</h2>
          <div className="space-y-4">
            {governance.map((g, i) => (
              <motion.div key={g.role} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{g.role}</h3>
                    <p className="text-gray-400 text-sm">{g.desc}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium flex-shrink-0">{g.members}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Legal Information</h2>
            <div className="space-y-3">
              {legal.map((l, i) => (
                <div key={l.label} className="flex items-start justify-between gap-4 py-2 border-b border-white/5">
                  <span className="text-gray-500 text-sm">{l.label}</span>
                  <span className="text-gray-300 text-sm text-right">{l.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Core Principles</h2>
            <div className="space-y-3">
              {principles.map((p, i) => (
                <div key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">Support the Foundation <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/get-involved" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">Get Involved</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
