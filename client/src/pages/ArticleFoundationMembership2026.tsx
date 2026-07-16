import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_foundation_membership_2026() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> November 2024</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}><Tag className="w-3 h-3" /> Foundation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Foundation 2026 Membership: Governance, Voting, Working Groups</h1>
            <p className="text-xl text-gray-400 leading-relaxed">The 2026 membership cycle opens with three new working groups (Safety-Certified, Embedded AI Ethics, and Neural Interface Standards) and a refreshed governance charter.</p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">What changed</h2>
        <p className="text-gray-300 leading-relaxed">The 2026 governance charter introduces three changes: (1) The Technical Steering Committee (TSC) expands from 5 to 7 seats, with 2 seats reserved for community-elected members. (2) All TSC votes are now public record, published within 48 hours of the vote. (3) Any Foundation member can submit an RFC; previously only TSC members could.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">New working groups</h2>
        <p className="text-gray-300 leading-relaxed">Three new working groups launch in 2026: Safety-Certified (IEC 62443, ISO 26262 ASIL-B compliance for EoS), Embedded AI Ethics (responsible AI deployment guidelines for eAI and eNI), and Neural Interface Standards (interoperability standards for BCI devices using the eNI protocol). Each working group meets monthly and publishes minutes publicly.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Open voting record</h2>
        <p className="text-gray-300 leading-relaxed">All TSC votes from 2024 onward are published in the Foundation's public governance repository. This includes votes on RFC acceptance, release approvals, and budget allocations. The voting record is signed by each TSC member's GPG key for non-repudiation.</p>
        
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Joining</h2>
        <p className="text-gray-300 leading-relaxed">Foundation membership is open to individuals and organizations. Individual membership is free (Community tier) or $10/month (Supporter tier). Organizational membership starts at $500/year (Sponsor tier). All membership tiers include voting rights on community RFCs. Supporter and above tiers include TSC election voting rights.</p>
        
      </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            
            <Link href="/membership" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />Membership Tiers</Link>
            <Link href="/organization" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />Organization</Link>
            <Link href="/donate" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"><ArrowRight className="w-4 h-4 flex-shrink-0" />Support the Foundation</Link>
            <Link href="/news" className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors text-sm text-orange-400"><ArrowRight className="w-4 h-4" />All Articles</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
