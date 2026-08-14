import { motion } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Star,
  BookOpen,
  Cpu,
  Brain,
} from "lucide-react";
import { CONTACT_EMAILS } from "@/data/foundation";

const positions = [
  {
    status: "Open",
    season: "Summer 2026",
    icon: Cpu,
    color: "#F97316",
    title: "Kernel Engineering Intern",
    desc: "Work on the EoS RTOS scheduler, memory management, and IPC subsystems. Requires C/C++ proficiency and familiarity with ARM Cortex-M architecture.",
    location: "Remote",
    duration: "12 weeks",
    compensation: "Stipend",
  },
  {
    status: "Open",
    season: "Summer 2026",
    icon: Brain,
    color: "#A855F7",
    title: "Embedded AI Research Intern",
    desc: "Research INT4/INT8 quantization, model compression, and on-device inference optimization for the eAI platform. Python + C, ML background required.",
    location: "Remote",
    duration: "12 weeks",
    compensation: "Stipend",
  },
  {
    status: "Open",
    season: "Fall 2026",
    icon: Star,
    color: "#22D3EE",
    title: "Neural Interface Engineering Intern",
    desc: "Work on the eNI BCI signal processing pipeline: ADC drivers, digital filter banks, and spike sorting algorithms. DSP and biomedical engineering background preferred.",
    location: "Remote",
    duration: "16 weeks",
    compensation: "Stipend",
  },
  {
    status: "Open",
    season: "Year-Round",
    icon: BookOpen,
    color: "#34D399",
    title: "Documentation & Developer Relations",
    desc: "Write technical documentation, tutorials, and blog posts. Help onboard new contributors and improve the developer experience across all EmbeddedOS components.",
    location: "Remote",
    duration: "Flexible",
    compensation: "Volunteer/Stipend",
  },
];

const fellowship = [
  {
    title: "Research Fellowship",
    duration: "6 months",
    desc: "For graduate students and early-career researchers. Work on a focused research project (kernel verification, AI inference, neural interfaces, or hardware security) with mentorship from Foundation engineers.",
    stipend: "$2,000/month",
  },
  {
    title: "Engineering Fellowship",
    duration: "6 months",
    desc: "For engineers with 2+ years of embedded systems experience. Lead a major feature or subsystem implementation with full Foundation support and public attribution.",
    stipend: "$3,000/month",
  },
];

export default function Internship() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" /> INTERNSHIPS & FELLOWSHIPS
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Internships & Fellowships
            </h1>
            <p className="text-xl text-gray-300">
              Work on cutting-edge embedded systems, neural interfaces, and AI
              at the EmbeddedOS Research Foundation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: p.color + "20" }}
                    >
                      <p.icon className="w-5 h-5" style={{ color: p.color }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{p.title}</div>
                      <div className="text-sm" style={{ color: p.color }}>
                        {p.season}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex-shrink-0">
                    {p.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {p.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {p.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {p.compensation}
                  </span>
                </div>
                <a
                  href={`mailto:${CONTACT_EMAILS.contact}?subject=Internship Application`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: p.color + "20", color: p.color }}
                >
                  Apply Now <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Research Fellowship Program
          </h2>
          <p className="text-gray-400 mb-6">
            The EmbeddedOS Foundation offers 6-month research fellowships for
            graduate students and early-career researchers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fellowship.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <div className="text-orange-400 text-sm mb-3">
                  {f.duration} · {f.stipend}
                </div>
                <p className="text-gray-400 text-sm">{f.desc}</p>
                <a
                  href={`mailto:${CONTACT_EMAILS.contact}?subject=Fellowship Application`}
                  className="mt-4 inline-flex items-center gap-2 text-orange-400 text-sm font-medium hover:underline"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
