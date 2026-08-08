import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Scale,
  Globe,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { FOUNDATION, IRS_LOOKUP_URL } from "@/data/foundation";

/**
 * The four bodies that govern the Foundation. Each entry says what the body
 * decides, how someone joins it, and how often it meets — the questions a
 * reader actually has when deciding whether a project's direction is captured
 * by one company. Individual directors and maintainers are not listed here;
 * current maintainership is visible on each repository, which stays accurate
 * without this page having to be edited.
 */
const governance = [
  {
    role: "Board of Directors",
    members: "5 directors",
    desc: "Sets Foundation strategy, approves budgets, and ensures 501(c)(3) compliance. Meets quarterly.",
    decides: [
      "Annual budget and the allocation of donated funds across programmes",
      "Legal and tax compliance, including the annual return",
      "Appointment and removal of officers",
      "Acceptance of restricted gifts, sponsorships and grants",
    ],
    appointment:
      "Directors are elected by the sitting board and serve fixed terms. " +
      "Directors with a financial interest in a matter recuse themselves from " +
      "the decision.",
    cadence: "Meets quarterly",
  },
  {
    role: "Technical Steering Committee (TSC)",
    members: "7 members",
    desc: "Governs technical direction, approves major architectural changes, and manages the release process.",
    decides: [
      "Architecture changes that cross component boundaries",
      "Which components are part of the supported platform",
      "Release scope, timing and the deprecation of public interfaces",
      "Appointment of core maintainers",
    ],
    appointment:
      "Seats are earned through sustained technical contribution, not " +
      "purchased. Sponsorship and membership confer no seat and no vote.",
    cadence: "Meets on a published cycle; decisions are recorded in public",
  },
  {
    role: "Working Groups",
    members: "Open membership",
    desc: "Focused groups for specific areas: Security, Documentation, Education, Hardware Certification, and Community.",
    decides: [
      "Day-to-day direction within their own area",
      "Standards and review criteria the wider project then follows",
      "Proposals escalated to the TSC when they cross into other areas",
    ],
    appointment:
      "Open to anyone who turns up and does the work. No membership, " +
      "employer or donation is required to join or to be heard.",
    cadence: "Each group sets its own cadence and publishes its notes",
  },
  {
    role: "Core Maintainers",
    members: "12 maintainers",
    desc: "Engineers with merge rights to core EoS repositories. Appointed by the TSC based on contribution history.",
    decides: [
      "Whether a change is merged into the repository they maintain",
      "Code review standards and the test bar for their component",
      "Security fixes under coordinated disclosure",
    ],
    appointment:
      "Appointed by the TSC on the strength of a public contribution record. " +
      "Merge rights follow demonstrated review judgement, not employment.",
    cadence: "Continuous; all review happens in public pull requests",
  },
];

const legal = [
  { label: "Legal Name", value: FOUNDATION.legalName },
  { label: "Organization Type", value: FOUNDATION.taxStatus },
  {
    label: "Public Charity Classification",
    value: FOUNDATION.publicCharityClassification,
  },
  { label: "Jurisdiction", value: FOUNDATION.jurisdiction },
  { label: "EIN", value: FOUNDATION.ein },
  {
    label: "Effective Date of Exemption",
    value: FOUNDATION.exemptionEffective,
  },
  { label: "Accounting Period Ending", value: FOUNDATION.accountingPeriodEnds },
  { label: "Contribution Deductibility", value: "Yes — IRC Section 170" },
  { label: "Primary License", value: FOUNDATION.softwareLicense },
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" /> FOUNDATION
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              The EmbeddedOS Foundation
            </h1>
            <p className="text-xl text-gray-300">
              A 501(c)(3) nonprofit organization dedicated to building the
              future of embedded computing through open-source software,
              education, and research.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-3">
            Governance Structure
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
            Four bodies govern the Foundation. Each one below states what it
            decides, how a person joins it, and how often it meets — because
            "open governance" only means something if you can see where a
            decision is made and who is allowed to make it.
          </p>
          <div className="space-y-4">
            {governance.map((g, i) => (
              <motion.div
                key={g.role}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{g.role}</h3>
                    <p className="text-gray-400 text-sm">{g.desc}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium flex-shrink-0">
                    {g.members}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-white/5">
                  <div>
                    <h4 className="text-gray-500 text-[10px] uppercase tracking-[0.18em] font-bold mb-2.5">
                      What it decides
                    </h4>
                    <ul className="space-y-1.5">
                      {g.decides.map(d => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed"
                        >
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-500 text-[10px] uppercase tracking-[0.18em] font-bold mb-2">
                        How people join
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {g.appointment}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users
                        className="w-3.5 h-3.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>{g.cadence}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Legal Information
            </h2>
            <div className="space-y-3">
              {legal.map((l, i) => (
                <div
                  key={l.label}
                  className="flex items-start justify-between gap-4 py-2 border-b border-white/5"
                >
                  <span className="text-gray-500 text-sm">{l.label}</span>
                  <span className="text-gray-300 text-sm text-right">
                    {l.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Core Principles
            </h2>
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

        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-white/5 border border-blue-500/20 rounded-xl p-5">
            <p className="text-gray-400 text-sm leading-relaxed">
              The Internal Revenue Service publishes its own record of every
              exempt organization. Confirm the details above independently by
              searching the{" "}
              {/* Underlined, not merely coloured: an in-paragraph link
                  distinguished by colour alone is a WCAG 1.4.1 failure that the
                  accessibility suite enforces on this page. */}
              <a
                href={IRS_LOOKUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline underline-offset-2 inline-flex items-center gap-1"
              >
                Tax Exempt Organization Search
                <ExternalLink className="w-3 h-3" />
              </a>{" "}
              for EIN{" "}
              <span className="text-gray-200 font-medium">
                {FOUNDATION.ein}
              </span>
              . Full registration details, the use-of-funds policy and the
              financial reporting timetable are on the{" "}
              <Link
                href="/transparency"
                className="text-blue-400 underline underline-offset-2"
              >
                transparency page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* blue-600, not blue-500: white on blue-500 measures 3.68:1, under
                the 4.5:1 WCAG AA floor for this text size. blue-600 reaches
                5.17:1 and keeps the page's blue palette. */}
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Support the Foundation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mission"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Mission &amp; Scope
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
