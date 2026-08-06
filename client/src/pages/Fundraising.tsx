import { motion } from "framer-motion";
import {
  Heart,
  Target,
  Users,
  BookOpen,
  Code,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

const tiers = [
  {
    name: "Supporter",
    amount: "$5/month",
    color: "#34D399",
    perks: [
      "Name in annual report",
      "Community Discord role",
      "Supporter badge on profile",
    ],
  },
  {
    name: "Educator",
    amount: "$25/month",
    color: "#22D3EE",
    perks: [
      "All Supporter perks",
      "Free certification exam voucher",
      "Early access to new courses",
      "Educator Discord channel",
    ],
  },
  {
    name: "Builder",
    amount: "$100/month",
    color: "#F97316",
    perks: [
      "All Educator perks",
      "Monthly 1:1 with a core maintainer",
      "Pre-release firmware access",
      "Builder credits for EoSim cloud",
    ],
  },
  {
    name: "Innovator",
    amount: "$500/month",
    color: "#A855F7",
    perks: [
      "All Builder perks",
      "TSC observer seat",
      "Joint blog post opportunity",
      "Named in press releases",
      "4 Summit tickets",
    ],
  },
];

const uses = [
  {
    icon: Code,
    color: "#F97316",
    title: "OS Development",
    pct: 45,
    desc: "Core kernel development, HAL drivers, security patches, and CI infrastructure.",
  },
  {
    icon: BookOpen,
    color: "#22D3EE",
    title: "Education & Docs",
    pct: 25,
    desc: "Documentation, tutorials, certification curriculum, and EoStudio learning paths.",
  },
  {
    icon: Users,
    color: "#A855F7",
    title: "Community",
    pct: 15,
    desc: "Community events, Discord moderation, contributor onboarding, and hackathons.",
  },
  {
    icon: Target,
    color: "#34D399",
    title: "Research",
    pct: 15,
    desc: "Academic partnerships, formal verification, and long-term research directions.",
  },
];

export default function FundraisingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" /> FUNDRAISING
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
              Every Dollar Makes a Difference
            </h1>
            <p className="text-xl text-gray-400">
              Your donation funds open-source OS development, free
              certifications, and education for embedded engineers worldwide.
              EmbeddedOS Foundation is a 501(c)(3) nonprofit — all donations are
              tax-deductible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            What Your Donation Funds
          </h2>
          <p className="text-gray-400 text-center mb-8">
            100% of donations go directly to the Foundation mission. No
            executive salaries, no overhead.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uses.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: u.color + "20" }}
                    >
                      <u.icon className="w-5 h-5" style={{ color: u.color }} />
                    </div>
                    <h3 className="text-white font-semibold">{u.title}</h3>
                  </div>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: u.color }}
                  >
                    {u.pct}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: u.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: u.pct + "%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
                <p className="text-gray-400 text-sm">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Monthly Giving Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col"
              >
                <h3 className="text-white font-bold text-lg mb-1">
                  {tier.name}
                </h3>
                <div
                  className="text-2xl font-bold mb-4"
                  style={{ color: tier.color }}
                >
                  {tier.amount}
                </div>
                <div className="space-y-2 flex-1">
                  {tier.perks.map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: tier.color }}
                      />
                      <span className="text-gray-300 text-sm">{p}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/donate#donate-now"
                  className="mt-4 w-full py-2 rounded-lg text-sm font-semibold text-center transition-colors block"
                  style={{
                    background: tier.color + "20",
                    color: tier.color,
                    border: "1px solid " + tier.color + "40",
                  }}
                >
                  Donate
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/donate#donate-now"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              Donate Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sponsors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Corporate Sponsorship
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
