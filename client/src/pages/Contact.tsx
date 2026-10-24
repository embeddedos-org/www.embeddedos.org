import { Link } from "wouter";
import {
  CONTACT_EMAILS,
  FOUNDATION,
  SOCIAL_URLS,
  formatMailingAddress,
  type ContactTopicKey,
} from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Contact.css";

/**
 * The topics shown on this page, in display order. Deliberately a subset of `CONTACT_TOPICS`:
 * `sponsors` and `conduct` are reached from `/sponsors` and `/code-of-conduct`
 * instead, same as before this page had a form.
 *
 * No email address appears in these cards: clicking one opens
 * `ContactFormModal` via `openContactForm`, and the topic key is the only thing
 * that travels to the server; see client/public/api/contact.php's
 * `TOPIC_INBOXES` for where it resolves to a mailbox.
 */
const contacts: Array<{
  key: ContactTopicKey;
  title: string;
  desc: string;
}> = [
  {
    key: "contact",
    title: "General Inquiries",
    desc: "Questions about EmbeddedOS products, partnerships, or the Foundation.",
  },
  {
    key: "support",
    title: "Technical Support",
    desc: "Build failures, board bring-up, toolchain setup, and questions the documentation does not answer.",
  },
  {
    key: "security",
    title: "Security Vulnerabilities",
    desc: "Report security vulnerabilities via responsible disclosure. Do not use GitHub issues.",
  },
  {
    key: "press",
    title: "Press & Media",
    desc: "Press inquiries, interview requests, and media kit downloads.",
  },
  {
    key: "partners",
    title: "Partnerships & Sponsors",
    desc: "Corporate sponsorships, hardware partnerships, and research collaborations.",
  },
  {
    key: "careers",
    title: "Careers & Internships",
    desc: "Job applications, internship inquiries, and fellowship applications.",
  },
  {
    key: "donations",
    title: "Donations & Fundraising",
    desc: "Tax-deductible donations, grant applications, and fundraising questions.",
  },
  {
    key: "finance",
    title: "Finance & Governance",
    desc: "Registration documents, donation receipts, wire and check gifts, grant paperwork.",
  },
];

const social = [
  {
    name: "GitHub",
    handle: "@embeddedos-org",
    href: SOCIAL_URLS.github,
  },
  {
    name: "X / Twitter",
    handle: "@EmbeddedOS_ORG",
    href: SOCIAL_URLS.x,
  },
  {
    name: "GitHub Discussions",
    handle: "EmbeddedOS Community",
    href: SOCIAL_URLS.discussions,
  },
  {
    name: "Website",
    handle: "www.embeddedos.org",
    href: FOUNDATION.website,
  },
];

/**
 * The legal identity of the organisation behind every address above. Published
 * in full rather than "available on request": the EIN is what lets a donor or a
 * reviewer confirm the Foundation independently, and withholding it while
 * `/donate` and `/organization` print it was a contradiction on the one number
 * that proves charitable status.
 */
const REGISTRATION = [
  { label: "Legal name", value: FOUNDATION.legalName },
  { label: "Status", value: FOUNDATION.taxStatus },
  { label: "EIN", value: FOUNDATION.ein },
  { label: "Jurisdiction", value: FOUNDATION.jurisdiction },
];

export default function Contact() {
  return (
    <BpPage className="contact">
      <PageHero
        sig
        label="CONTACT"
        title="Contact Us"
        lead="Get in touch with the EmbeddedOS Foundation team."
      >
        <p className="ct-fine">
          Every topic below reaches a person, not a queue. Security reports are
          answered within 48 hours under the{" "}
          <Link href="/security" className="tl">
            security policy
          </Link>
          ; other enquiries are answered in the order they arrive.
        </p>
      </PageHero>
      <LocalNav
        name="Contact Us"
        items={[
          { id: "get-in-touch", label: "Get in Touch" },
          { id: "email", label: "Prefer email?" },
          { id: "social", label: "Social & Community" },
          { id: "organization", label: "The Organization" },
        ]}
      />

      <Section id="get-in-touch" title="Get in Touch">
        {/*
          F-34: the topic cards below open a JavaScript form dialog. Without
          JS they are inert, so no-JS visitors get a plain-HTML pointer to
          the published mailbox (which is also prerendered further down).
        */}
        <noscript>
          <p className="gnote ct-nojs">
            The topic form needs JavaScript. You can reach us directly by email
            instead — see "Prefer email?" below.
          </p>
        </noscript>
        <ul className="cards two">
          {contacts.map(c => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => openContactForm({ topic: c.key })}
                className="card ct-topic"
              >
                <span className="ct-t">{c.title}</span>
                <span className="more">Send a message</span>
                <span className="ct-d">{c.desc}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/*
        A published, crawler-visible mailbox alongside the topic form. The form
        above stays the primary path; this link is for reviewers, crawlers and
        anyone whose mail client is the tool they trust — see F-03.
      */}
      <section id="email" className="sec tight ct-email">
        <div className="wrap">
          <div className="card hl ct-mail">
            <div>
              <h2>Prefer email?</h2>
              <p>
                Write to us directly — the same people read this inbox as the
                form above.
              </p>
            </div>
            <a href={`mailto:${CONTACT_EMAILS.contact}`} className="tl ct-addr">
              {CONTACT_EMAILS.contact}
            </a>
          </div>
        </div>
      </section>

      <Section id="social" title="Social & Community" alt>
        <ul className="cards four">
          {social.map(s => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card ct-soc"
              >
                <span className="ct-t">{s.name}</span>
                <span className="ct-h">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="organization" title="The Organization You Are Contacting">
        <div className="ct-org">
          <p className="ct-intro">
            All of the addresses above belong to one registered nonprofit. Its
            details are published in full so you can confirm who you are writing
            to before you write.
          </p>

          <dl className="kv">
            {REGISTRATION.map(row => (
              <div key={row.label} className="ct-kv">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="ct-addrblock">
            <p className="label">Mailing address</p>
            {/* The JSON-LD in client/index.html is static, so unit tests
                keep its PostalAddress in sync with this canonical value. */}
            <address>
              {FOUNDATION.legalName}
              <br />
              {formatMailingAddress()}
            </address>
            <p className="ct-fin">
              {/* Inline links inside a paragraph carry a persistent
                  underline: colour alone is a WCAG 1.4.1 failure (axe
                  link-in-text-block), enforced on this page. */}
              For wire transfers, gifts by check or a donation receipt,{" "}
              <button
                type="button"
                onClick={() => openContactForm({ topic: "finance" })}
                className="tl"
              >
                contact Finance &amp; Governance
              </button>
              .
            </p>
          </div>

          <div className="ctas">
            <Link href="/transparency" className="btn gh">
              Registration &amp; finances{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/mission" className="btn gh">
              Mission &amp; scope{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <p className="fine">
            The Foundation is a volunteer-supported {FOUNDATION.taxStatus}.
            Replies come from maintainers and staff rather than a support desk,
            so please allow time for a considered answer.
          </p>
        </div>
      </Section>
    </BpPage>
  );
}
