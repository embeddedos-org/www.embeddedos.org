import { Link } from "wouter";
import { FOUNDATION, IRS_LOOKUP_URL } from "@/data/foundation";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Organization.css";

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
  { label: "SAM.gov Unique Entity ID (UEI)", value: FOUNDATION.uei },
  { label: "D-U-N-S Number", value: FOUNDATION.duns },
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
    <BpPage className="organization">
      <PageHero
        sig
        label="FOUNDATION"
        title="The EmbeddedOS Foundation"
        lead="A 501(c)(3) nonprofit organization dedicated to building the future of embedded computing through open-source software, education, and research."
      />

      <Section
        title="Governance Structure"
        lead={
          <p>
            Four bodies govern the Foundation. Each one below states what it
            decides, how a person joins it, and how often it meets — because
            "open governance" only means something if you can see where a
            decision is made and who is allowed to make it.
          </p>
        }
      >
        <ul className="cards two">
          {governance.map(g => (
            <li key={g.role}>
              <article className="card og-body">
                <div className="top">
                  <h3>{g.role}</h3>
                  <span className="og-n">{g.members}</span>
                </div>
                <p>{g.desc}</p>
                <div className="og-cols">
                  <div>
                    <h4>What it decides</h4>
                    <ul>
                      {g.decides.map(d => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>How people join</h4>
                    <p>{g.appointment}</p>
                    <p className="og-cad">{g.cadence}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <section className="sec alt">
        <div className="wrap">
          <div className="og-two">
            <div>
              <h2 className="og-h">Legal Information</h2>
              <dl className="kv">
                {legal.map(l => (
                  <div key={l.label} className="og-kv">
                    <dt>{l.label}</dt>
                    <dd>{l.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="og-h">Core Principles</h2>
              <ul className="og-pr">
                {principles.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="gnote og-irs">
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
              className="tl"
            >
              Tax Exempt Organization Search
            </a>{" "}
            for EIN <b>{FOUNDATION.ein}</b>. Full registration details, the
            use-of-funds policy and the financial reporting timetable are on the{" "}
            <Link href="/transparency" className="tl">
              transparency page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="sec tight og-end">
        <div className="wrap">
          <div className="ctas">
            <Link href="/donate" className="btn or">
              Support the Foundation{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/mission" className="btn gh">
              Mission &amp; Scope
            </Link>
            <Link href="/get-involved" className="btn gh">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
