import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShieldCheck,
  ExternalLink,
  FileText,
  Landmark,
  CalendarClock,
  Scale,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  FOUNDATION,
  IRS_LOOKUP_URL,
  CONTACT_EMAILS,
  OUT_OF_SCOPE,
} from "@/data/foundation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

/** Legal identity, as published on the IRS determination. */
const REGISTRATION = [
  { label: "Legal name", value: FOUNDATION.legalName },
  { label: "Organisation type", value: FOUNDATION.taxStatus },
  {
    label: "Public charity classification",
    value: FOUNDATION.publicCharityClassification,
  },
  { label: "Employer Identification Number (EIN)", value: FOUNDATION.ein },
  {
    label: "Effective date of exemption",
    value: FOUNDATION.exemptionEffective,
  },
  { label: "Jurisdiction", value: FOUNDATION.jurisdiction },
  {
    label: "Accounting period ends",
    value: FOUNDATION.accountingPeriodEnds,
  },
  { label: "Contribution deductibility", value: FOUNDATION.deductibility },
] as const;

/**
 * How donated money is allowed to be used. Stated as policy, not as a spend
 * breakdown: the Foundation's first tax year is still open, so no audited
 * figures exist yet and publishing estimates would be worse than publishing
 * nothing. The reporting timetable below says exactly when numbers arrive.
 */
const FUND_POLICY = [
  {
    title: "Donations fund programmes, not products",
    detail:
      "Contributions are spent on the five programmes described on the " +
      "Mission & Scope page: platform engineering, education, research, " +
      "workforce development and community stewardship. Nothing the Foundation " +
      "builds with donated funds is then sold back.",
  },
  {
    title: "No platform fee is taken from your gift",
    detail:
      "Online donations are processed by Zeffy, which charges the Foundation " +
      "no platform fee. Zeffy may offer you an optional tip toward its own " +
      "costs at checkout; that tip is separate from your donation and can be " +
      "set to zero.",
  },
  {
    title: "Restricted gifts stay restricted",
    detail:
      "Where a donor designates a gift for a specific programme, it is used " +
      "for that programme. If the Foundation cannot use it as designated, the " +
      "donor is asked before it is redirected.",
  },
  {
    title: "Funding does not buy technical direction",
    detail:
      "Sponsorship and membership are recognised publicly but confer no " +
      "authority over the roadmap. Technical decisions run through the same " +
      "public governance process for everyone.",
  },
] as const;

/**
 * The public documents that govern the Foundation. Each links to the page that
 * holds it, so "our policies" is a set of readable documents rather than a
 * claim.
 */
const PUBLIC_DOCUMENTS = [
  {
    name: "Governance structure",
    desc: "The board, steering committee, working groups and how decisions are made.",
    href: "/organization",
  },
  {
    name: "Mission & Scope",
    desc: "Charitable purpose, the five programmes, and what the Foundation does not do.",
    href: "/mission",
  },
  {
    name: "Code of Conduct",
    desc: "The behavioural standard for every Foundation space, and how it is enforced.",
    href: "/code-of-conduct",
  },
  {
    name: "Security policy",
    desc: "How to report a vulnerability and how the Foundation responds to one.",
    href: "/security",
  },
  {
    name: "Privacy policy",
    desc: "What this site collects, what it does not, and who it is shared with.",
    href: "/privacy",
  },
  {
    name: "Terms of use",
    desc: "The terms covering use of this site and the Foundation's services.",
    href: "/terms",
  },
  {
    name: "Software licences",
    desc: `Every Foundation repository is released under the ${FOUNDATION.softwareLicense}.`,
    href: "/licenses",
  },
] as const;

export default function Transparency() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Accountability
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-6">
              Transparency &amp;{" "}
              <span className="text-gradient">Accountability</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Who the Foundation legally is, how to verify that independently,
              what happens to money given to it, and when its financial reports
              become public. Where a figure does not exist yet, this page says
              so rather than estimating one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
              <Landmark size={12} />
              Registration
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              Nonprofit registration details
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 max-w-2xl">
              The Foundation is a tax-exempt organisation recognised by the
              United States Internal Revenue Service. These are the details as
              they appear on its determination.
            </p>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <dl>
                {REGISTRATION.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-5 sm:px-6 py-4 ${
                      i > 0 ? "border-t border-white/5" : ""
                    }`}
                  >
                    <dt className="text-white/40 text-xs uppercase tracking-widest sm:w-64 sm:shrink-0">
                      {row.label}
                    </dt>
                    <dd className="text-white text-sm">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 glass rounded-2xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-5 sm:p-6">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#22D3EE]" />
                Verify this without taking our word for it
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                The IRS publishes its own record of every exempt organisation.
                Search the Tax Exempt Organization Search for EIN{" "}
                <span className="text-white font-medium">{FOUNDATION.ein}</span>{" "}
                to confirm the Foundation's status, classification and
                deductibility directly from the source.
              </p>
              <a
                href={IRS_LOOKUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/15 transition-colors"
              >
                Open the IRS Tax Exempt Organization Search
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Where the money goes */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="badge-purple mb-4 inline-flex items-center gap-1.5">
              <Scale size={12} />
              Use of Funds
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              What happens to money given to the Foundation
            </h2>
            <p className="text-white/60 leading-relaxed max-w-2xl">
              The Foundation is funded by donations, membership and corporate
              sponsorship. It does not sell software, licences or support
              contracts, so contributions are the whole of its income.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {FUND_POLICY.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-5 border border-white/5"
              >
                <h3 className="font-semibold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial reporting timetable */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
              <CalendarClock size={12} />
              Financial Reporting
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              When the numbers become public
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 max-w-2xl">
              The Foundation's exemption took effect on{" "}
              {FOUNDATION.exemptionEffective}, so {FOUNDATION.firstFiscalYear}{" "}
              is its first tax year. That year has not closed, which means no
              annual return exists yet — for anyone, including us. Rather than
              publish an estimate, here is the schedule on which real figures
              arrive.
            </p>

            <ol className="relative space-y-6 border-l border-white/10 pl-6 ml-2">
              {[
                {
                  when: `${FOUNDATION.exemptionEffective}`,
                  what: "Exemption effective",
                  detail: `The IRS recognises the Foundation as a ${FOUNDATION.taxStatus}. Contributions made from this date forward are deductible.`,
                },
                {
                  when: `${FOUNDATION.accountingPeriodEnds}, ${FOUNDATION.firstFiscalYear}`,
                  what: "First accounting period closes",
                  detail:
                    "The Foundation's fiscal year ends. Income and expenditure for the year are final from this point and can be compiled.",
                },
                {
                  // The IRS deadline is the 15th day of the 5th month after the
                  // accounting period ends, so a 31 December 2026 year-end falls
                  // due 15 May 2027. Stated with the extension caveat because a
                  // Form 8868 extension is routine and would move it.
                  when: "May 15, 2027",
                  what: "First annual return due",
                  detail:
                    "The Foundation files the Form 990-series return required for its size with the IRS — due the fifteenth day of the fifth month after the accounting period ends, later if an extension is filed. Filed returns are public records and are republished by the IRS.",
                },
                {
                  when: "After filing",
                  what: "Published here",
                  detail:
                    "The filed return and a plain-language annual report are linked from this page. Until they exist, this page carries no financial figures.",
                },
              ].map((step, i) => (
                <motion.li
                  key={step.what}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="relative"
                >
                  <span
                    className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#F97316] ring-4 ring-[#080F1E]"
                    aria-hidden="true"
                  />
                  <div className="text-[#F97316] text-xs font-bold uppercase tracking-widest mb-1">
                    {step.when}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{step.what}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.detail}
                  </p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Commitments — reuse of the scope boundary, framed as donor assurance */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="badge-teal mb-4 inline-flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Commitments
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              What we commit not to do
            </h2>
            <p className="text-white/60 leading-relaxed max-w-2xl">
              These constraints are part of the Foundation's scope, repeated
              here because they are what a donor is actually relying on.
            </p>
          </motion.div>

          <ul className="space-y-3">
            {OUT_OF_SCOPE.map((item, i) => (
              <motion.li
                key={item.claim}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-xl p-5 border border-white/5"
              >
                <h3 className="font-semibold text-white text-sm mb-1.5">
                  {item.claim}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.detail}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Public documents */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="badge-purple mb-4 inline-flex items-center gap-1.5">
              <FileText size={12} />
              Public Documents
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              The policies that govern the Foundation
            </h2>
            <p className="text-white/60 leading-relaxed max-w-2xl">
              Every policy the Foundation operates under is published as a web
              page on this site — readable without a download, an account or a
              PDF reader.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {PUBLIC_DOCUMENTS.map((doc, i) => (
              <motion.div
                key={doc.href}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  href={doc.href}
                  className="group block glass rounded-xl p-5 border border-white/5 hover:border-white/15 transition-colors h-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="font-semibold text-white">{doc.name}</h3>
                    <ArrowRight
                      size={15}
                      className="text-white/25 group-hover:text-[#F97316] transition-colors shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {doc.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl border border-white/10 p-6 sm:p-8 text-center"
          >
            <Mail
              size={22}
              className="text-[#F97316] mx-auto mb-3"
              aria-hidden="true"
            />
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Something here not answered?
            </h2>
            <p className="text-white/55 leading-relaxed mb-6">
              Financial, governance and donation-receipt questions go to the
              Foundation directly, and are answered in writing. If you need
              documentation for a grant application or a donor-advised fund, ask
              and we will send it.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAILS.finance}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl btn-press transition-colors"
              >
                <Mail size={16} aria-hidden="true" />
                {CONTACT_EMAILS.finance}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press border border-white/10 transition-colors"
              >
                All contact routes
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
