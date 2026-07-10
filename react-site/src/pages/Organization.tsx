import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Users, Globe, Shield, BookOpen } from "lucide-react";

const pillars = [
  { icon: Users, title: "Community Governance", desc: "All major decisions are made by elected Technical Steering Committee members. No single company controls the roadmap." },
  { icon: Globe, title: "Open Membership", desc: "Any individual or organization can become a member. Corporate sponsors receive recognition but not voting control." },
  { icon: Shield, title: "Transparent Operations", desc: "Financials, meeting minutes, and roadmap decisions are published publicly. Nothing is decided behind closed doors." },
  { icon: BookOpen, title: "Apache-Inspired Model", desc: "Governance modeled after the Apache Software Foundation — meritocracy, consensus, and long-term sustainability." },
];

const committees = [
  { name: "Technical Steering Committee", role: "Oversees technical direction, architecture decisions, and release management." },
  { name: "Security Working Group", role: "Responsible for security policy, vulnerability disclosure, and cryptographic standards." },
  { name: "Documentation Committee", role: "Maintains all official documentation, API references, and educational content." },
  { name: "Community Committee", role: "Manages contributor onboarding, events, mentorship, and community health." },
  { name: "Finance & Legal Committee", role: "Oversees foundation finances, grant applications, and license compliance." },
];

export default function Organization() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Foundation</p>
          <h1 className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl text-white mb-6">
            Our <span className="text-gold-gradient">Organization</span>
          </h1>
          <p className="text-[#666] text-xl max-w-2xl mx-auto">
            EmbeddedOS is governed as an open-source foundation — transparent, community-driven,
            and structured for long-term sustainability.
          </p>
        </motion.div>

        {/* Governance pillars */}
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#C9A84C]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Committees */}
        <div className="mb-16">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-white mb-8 text-center">Working Groups & Committees</h2>
          <div className="space-y-3">
            {committees.map(({ name, role }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">{name}</h3>
                  <p className="text-[#555] text-sm">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Get involved CTA */}
        <div className="glass-card rounded-3xl p-10 text-center">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-white mb-4">Get Involved</h2>
          <p className="text-[#666] mb-8 max-w-lg mx-auto">
            Join a committee, sponsor the foundation, or contribute code. Every form of participation strengthens the ecosystem.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/careers" className="btn-gold px-8 py-4 rounded-xl font-semibold flex items-center gap-2">
              Join the Team <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-outline-gold px-8 py-4 rounded-xl font-semibold">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
