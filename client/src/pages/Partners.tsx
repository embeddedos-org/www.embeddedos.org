import { motion } from "framer-motion";
import { Handshake, Star, Zap, Globe, ArrowRight, Mail } from "lucide-react";

const tiers = [
  {
    name: "Platinum Sponsor", price: "$50,000/year", color: "#E5E7EB",
    perks: ["Logo on every page of embeddedos.org", "Speaking slot at annual EmbeddedOS Summit", "Early access to all releases (30 days)", "Dedicated Slack channel with Foundation engineers", "Joint press release", "4 free enterprise support seats"],
  },
  {
    name: "Gold Sponsor", price: "$20,000/year", color: "#FBBF24",
    perks: ["Logo on homepage and sponsors page", "Speaking slot at annual summit", "Early access to all releases (14 days)", "2 free enterprise support seats", "Joint blog post"],
  },
  {
    name: "Silver Sponsor", price: "$5,000/year", color: "#9CA3AF",
    perks: ["Logo on sponsors page", "Early access to all releases (7 days)", "1 free enterprise support seat", "Mention in quarterly newsletter"],
  },
  {
    name: "Community Sponsor", price: "$1,000/year", color: "#F97316",
    perks: ["Logo on sponsors page", "Mention in quarterly newsletter", "Community recognition badge"],
  },
];

const partners_list = [
  { name: "Open Positions", type: "Platinum Sponsor", note: "Become our first Platinum Sponsor" },
  { name: "Open Positions", type: "Gold Sponsor", note: "Become our first Gold Sponsor" },
  { name: "Open Positions", type: "Silver Sponsor", note: "Become our first Silver Sponsor" },
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" /> PARTNERSHIPS & SPONSORS
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">Partners & Sponsors</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Support the EmbeddedOS Foundation and get your organization in front of 10,000+ embedded engineers worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-8 text-center">
            <p className="text-gray-300">All sponsorship fees are reinvested into open-source development, free certifications, and education. Donations are <strong className="text-white">tax-deductible</strong> as the Foundation is a registered <strong className="text-white">501(c)(3)</strong> nonprofit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">{t.name}</h3>
                  <span className="text-sm font-semibold" style={{ color: t.color }}>{t.price}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-400">
                      <Star className="w-3 h-3 flex-shrink-0 mt-1" style={{ color: t.color }} />
                      {p}
                    </li>
                  ))}
                </ul>
                <a href="mailto:partners@embeddedos.org" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center" style={{ background: t.color + "20", color: t.color }}>
                  Become a Sponsor <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interested in Partnering?</h2>
          <p className="text-gray-400 mb-6">Hardware companies, cloud providers, universities, and research labs — we welcome all partnership discussions.</p>
          <a href="mailto:partners@embeddedos.org" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
            <Mail className="w-4 h-4" /> partners@embeddedos.org
          </a>
        </div>
      </section>
    </div>
  );
}
