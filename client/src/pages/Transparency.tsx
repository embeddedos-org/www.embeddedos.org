import { Link } from "wouter";
import { FOUNDATION, IRS_LOOKUP_URL, OUT_OF_SCOPE } from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Transparency.css";

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

/** When the Foundation's figures become public, in order. */
const REPORTING = [
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
];

export default function Transparency() {
  return (
    <BpPage className="transparency">
      {/* Hero */}
      <PageHero
        sig
        label="Accountability"
        title="Transparency & Accountability"
        lead="Who the Foundation legally is, how to verify that independently, what happens to money given to it, and when its financial reports become public. Where a figure does not exist yet, this page says so rather than estimating one."
      />
      <LocalNav
        name="Transparency"
        items={[
          { id: "registration", label: "Registration" },
          { id: "use-of-funds", label: "Use of Funds" },
          { id: "reporting", label: "Financial Reporting" },
          { id: "commitments", label: "Commitments" },
          { id: "documents", label: "Public Documents" },
        ]}
      />

      {/* Registration */}
      <Section
        id="registration"
        label="Registration"
        title="Nonprofit registration details"
        lead="The Foundation is a tax-exempt organisation recognised by the United States Internal Revenue Service. These are the details as they appear on its determination."
      >
        <dl className="kv">
          {REGISTRATION.map(row => (
            <div key={row.label} className="tr-kv">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="card hl tr-verify">
          <h3>Verify this without taking our word for it</h3>
          <p>
            The IRS publishes its own record of every exempt organisation.
            Search the Tax Exempt Organization Search for EIN{" "}
            <b>{FOUNDATION.ein}</b> to confirm the Foundation's status,
            classification and deductibility directly from the source.
          </p>
          <div className="ctas">
            <a
              href={IRS_LOOKUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn pri"
            >
              Open the IRS Tax Exempt Organization Search
              <span className="ar" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </Section>

      {/* Where the money goes */}
      <Section
        id="use-of-funds"
        label="Use of Funds"
        title="What happens to money given to the Foundation"
        lead="The Foundation is funded by donations, membership and corporate sponsorship. It does not sell software, licences or support contracts, so contributions are the whole of its income."
        alt
      >
        <ul className="cards two">
          {FUND_POLICY.map(item => (
            <li key={item.title}>
              <div className="card">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Financial reporting timetable */}
      <Section
        id="reporting"
        label="Financial Reporting"
        title="When the numbers become public"
        lead={
          <p>
            The Foundation's exemption took effect on{" "}
            {FOUNDATION.exemptionEffective}, so {FOUNDATION.firstFiscalYear} is
            its first tax year. That year has not closed, which means no annual
            return exists yet — for anyone, including us. Rather than publish an
            estimate, here is the schedule on which real figures arrive.
          </p>
        }
      >
        <ol className="tr-tl">
          {REPORTING.map(step => (
            <li key={step.what}>
              <p className="tr-when">{step.when}</p>
              <div>
                <h3>{step.what}</h3>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Commitments — reuse of the scope boundary, framed as donor assurance */}
      <Section
        id="commitments"
        label="Commitments"
        title="What we commit not to do"
        lead="These constraints are part of the Foundation's scope, repeated here because they are what a donor is actually relying on."
        alt
      >
        <ul className="cards two">
          {OUT_OF_SCOPE.map(item => (
            <li key={item.claim}>
              <div className="card">
                <h3>{item.claim}</h3>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Public documents */}
      <Section
        id="documents"
        label="Public Documents"
        title="The policies that govern the Foundation"
        lead="Every policy the Foundation operates under is published as a web page on this site — readable without a download, an account or a PDF reader."
      >
        <ul className="cards">
          {PUBLIC_DOCUMENTS.map(doc => (
            <li key={doc.href}>
              <Link href={doc.href} className="card">
                <div className="top">
                  <h3>{doc.name}</h3>
                </div>
                <p>{doc.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ask */}
      <section className="band tr-band">
        <div className="wrap">
          <div>
            <h2>Something here not answered?</h2>
            <p className="lead">
              Financial, governance and donation-receipt questions go to the
              Foundation directly, and are answered in writing. If you need
              documentation for a grant application or a donor-advised fund, ask
              and we will send it.
            </p>
          </div>
          <div className="ctas">
            <button
              type="button"
              onClick={() => openContactForm({ topic: "finance" })}
              className="btn pri"
            >
              Contact Finance &amp; Governance
            </button>
            <Link href="/contact" className="btn gh">
              All contact routes{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
