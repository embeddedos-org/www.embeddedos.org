import { motion } from "framer-motion";
import { Handshake, Star, ArrowRight, Mail } from "lucide-react";
import { openContactForm } from "@/lib/contact-form";
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";

const tiers = [
  {
    name: "Platinum Sponsor",
    price: "$50,000/year",
    color: "#E5E7EB",
    perks: [
      "Logo on every page of embeddedos.org",
      "Speaking slot at annual EmbeddedOS Summit",
      "Early access to all releases (30 days)",
      "Dedicated Slack channel with Foundation engineers",
      "Joint press release",
      "4 free enterprise support seats",
    ],
  },
  {
    name: "Gold Sponsor",
    price: "$20,000/year",
    color: "#FBBF24",
    perks: [
      "Logo on homepage and sponsors page",
      "Speaking slot at annual summit",
      "Early access to all releases (14 days)",
      "2 free enterprise support seats",
      "Joint blog post",
    ],
  },
  {
    name: "Silver Sponsor",
    price: "$5,000/year",
    color: "#9CA3AF",
    perks: [
      "Logo on sponsors page",
      "Early access to all releases (7 days)",
      "1 free enterprise support seat",
      "Mention in quarterly newsletter",
    ],
  },
  {
    name: "Community Sponsor",
    price: "$1,000/year",
    color: "#F97316",
    perks: [
      "Logo on sponsors page",
      "Mention in quarterly newsletter",
      "Community recognition badge",
    ],
  },
];

/**
 * Supporting text for the partnerships page (Ad Grants: substantial
 * content). Everything below restates or explains what the tiers above
 * already show: no new prices, no new perks, no invented partners.
 */
const PARTNERS_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "What partnership means here",
    body: [
      "A partnership with the Foundation is a public statement of support for open-source embedded systems research, and a contribution toward sustaining it. The tiers above recognise that support at different levels — from community recognition to a presence across the site and the annual summit.",
      "What a partnership is not: a commercial transaction for influence. A logo here recognises support; it does not buy a say in what gets built. The direction of the Foundation's software is decided in the open, through the public governance process in the repositories — proposals, review, and discussion anyone can read and join.",
    ],
  },
  {
    heading: "Where the money goes",
    body: [
      "All sponsorship fees are reinvested into the mission: open-source development, free certifications, and education. The Foundation is a registered 501(c)(3) nonprofit, EIN 41-4821627, so contributions are tax-deductible to the extent the law allows.",
      "How the money is used is reported like everything else the Foundation does. The transparency page carries the Foundation's financial disclosures, and sponsorship income appears there alongside donations and grants.",
    ],
  },
  {
    heading: "The tiers, plainly",
    body: [
      "Four tiers, priced annually. Community Sponsor at $1,000 a year: a logo on the sponsors page, a mention in the quarterly newsletter, and a community recognition badge. Silver at $5,000 a year: early access to releases and an enterprise support seat, added to the community benefits.",
      "Gold at $20,000 a year: a logo on the homepage and sponsors page, a speaking slot at the annual summit, longer early access, and a joint blog post. Platinum at $50,000 a year: a logo on every page of the site, a summit speaking slot, the earliest access, a dedicated channel with Foundation engineers, a joint press release, and four support seats.",
      "The perks are recognition and access, not control. Every tier's benefits are listed in full above — there are no unpublished benefits and no private arrangements.",
    ],
  },
  {
    heading: "Who partnerships are for",
    body: [
      "Hardware companies shipping or evaluating the stack, cloud providers whose infrastructure touches embedded fleets, universities teaching or researching on open platforms, and research labs working on the problems the Foundation investigates. If your organisation depends on open embedded software, or wants to, this is the formal way to sustain it.",
      "Organisations that are not ready for a tier can still contribute: the codebase is open, the discussions are public, and donations of any size go to the same mission.",
    ],
  },
  {
    heading: "How to start",
    body: [
      "Use the contact form with the partnerships topic, or write to partners@embeddedos.org. Tell us about your organisation and which tier you are considering, and we will reply with the agreement and the next steps.",
      "The tiers are the same public terms for everyone — a nonprofit's partnerships should be as transparent as its code.",
    ],
  },
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" /> PARTNERSHIPS & SPONSORS
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
              Partners & Sponsors
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Support the EmbeddedOS Foundation and get your organization in
              front of 10,000+ embedded engineers worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-8 text-center">
            <p className="text-gray-300">
              All sponsorship fees are reinvested into open-source development,
              free certifications, and education. Donations are{" "}
              <strong className="text-white">tax-deductible</strong> as the
              Foundation is a registered{" "}
              <strong className="text-white">501(c)(3)</strong> nonprofit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">{t.name}</h3>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: t.color }}
                  >
                    {t.price}
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.perks.map(p => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <Star
                        className="w-3 h-3 flex-shrink-0 mt-1"
                        style={{ color: t.color }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openContactForm({ topic: "partners" })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                  style={{ background: t.color + "20", color: t.color }}
                >
                  Become a Sponsor <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Interested in Partnering?
          </h2>
          <p className="text-gray-400 mb-6">
            Hardware companies, cloud providers, universities, and research labs
            — we welcome all partnership discussions.
          </p>
          <button
            type="button"
            onClick={() => openContactForm({ topic: "partners" })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Mail className="w-4 h-4" /> Contact Partnerships
          </button>
        </div>
      </section>

      <AboutSections title="About partnerships" sections={PARTNERS_ABOUT} />
    </div>
  );
}
