import { motion } from "framer-motion";
import { Star, Building2, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const tiers = [
  {
    name: "Platinum Sponsor",
    amount: "$50,000+/year",
    color: "#E5E7EB",
    benefits: [
      "Logo on homepage hero section",
      "Logo on all documentation pages",
      "Named in every press release",
      "4 seats at EmbeddedOS Summit",
      "Dedicated technical liaison",
      "Early access to all releases",
      "Joint case study publication",
      "TSC observer seat",
    ],
  },
  {
    name: "Gold Sponsor",
    amount: "$20,000+/year",
    color: "#FBBF24",
    benefits: [
      "Logo on homepage sponsors section",
      "Logo on documentation footer",
      "Named in quarterly newsletter",
      "2 seats at EmbeddedOS Summit",
      "Early access to releases",
      "Joint blog post opportunity",
    ],
  },
  {
    name: "Silver Sponsor",
    amount: "$5,000+/year",
    color: "#9CA3AF",
    benefits: [
      "Logo on sponsors page",
      "Named in annual report",
      "1 seat at EmbeddedOS Summit",
      "Early access to releases",
    ],
  },
  {
    name: "Community Sponsor",
    amount: "$1,000+/year",
    color: "#F97316",
    benefits: [
      "Logo on sponsors page",
      "Named in annual report",
      "Community Discord role",
    ],
  },
];

const benefits = [
  { icon: Star, color: "#FBBF24", title: "Talent Pipeline", desc: "Access to 10,000+ EmbeddedOS-certified engineers. Sponsor job postings reach the most skilled embedded developers globally." },
  { icon: Building2, color: "#22D3EE", title: "R&D Collaboration", desc: "Work directly with the Foundation on research projects. Co-author papers, share IP, and influence the technical roadmap." },
  { icon: Globe, color: "#A855F7", title: "Brand Visibility", desc: "EmbeddedOS reaches 50,000+ developers monthly. Your logo appears on docs, tutorials, and conference materials worldwide." },
  { icon: CheckCircle2, color: "#34D399", title: "ESG & CSR Impact", desc: "Sponsoring a 501(c)(3) nonprofit counts toward ESG goals. Receive a donation receipt for tax deduction purposes." },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4" /> SPONSORSHIP
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">Invest in the Embedded Ecosystem</h1>
            <p className="text-xl text-gray-400">Join leading companies supporting open-source embedded systems. Your sponsorship funds the infrastructure, education, and research that powers the next generation of embedded devices.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Sponsor EmbeddedOS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: b.color + "20" }}>
                  <b.icon className="w-5 h-5" style={{ color: b.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Sponsorship Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                  <span className="font-semibold text-sm" style={{ color: tier.color }}>{tier.amount}</span>
                </div>
                <div className="space-y-2">
                  {tier.benefits.map(b => (
                    <div key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      <span className="text-gray-300 text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-4">Become a Sponsor</h2>
          <p className="text-gray-400 mb-6">Contact us to discuss sponsorship options and get your logo on the EmbeddedOS website.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:sponsors@embeddedos.org" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors">Contact Sponsorship Team <ArrowRight className="w-4 h-4" /></a>
            <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">Individual Donation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
