import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Mail,
  Github,
  Twitter,
  MessageSquare,
  MapPin,
  ArrowRight,
  Globe,
  Landmark,
  Clock,
} from "lucide-react";
import {
  FOUNDATION,
  CONTACT_EMAILS,
  SOCIAL_URLS,
  MAILING_ADDRESS,
} from "@/data/foundation";

const contacts = [
  {
    icon: Mail,
    color: "#F97316",
    title: "General Inquiries",
    email: CONTACT_EMAILS.general,
    desc: "Questions about EmbeddedOS products, partnerships, or the Foundation.",
  },
  {
    icon: Mail,
    color: "#EF4444",
    title: "Security Vulnerabilities",
    email: CONTACT_EMAILS.security,
    desc: "Report security vulnerabilities via responsible disclosure. Do not use GitHub issues.",
  },
  {
    icon: Mail,
    color: "#22D3EE",
    title: "Press & Media",
    email: CONTACT_EMAILS.press,
    desc: "Press inquiries, interview requests, and media kit downloads.",
  },
  {
    icon: Mail,
    color: "#A855F7",
    title: "Partnerships & Sponsors",
    email: CONTACT_EMAILS.partners,
    desc: "Corporate sponsorships, hardware partnerships, and research collaborations.",
  },
  {
    icon: Mail,
    color: "#34D399",
    title: "Careers & Internships",
    email: CONTACT_EMAILS.careers,
    desc: "Job applications, internship inquiries, and fellowship applications.",
  },
  {
    icon: Mail,
    color: "#FBBF24",
    title: "Donations & Fundraising",
    email: CONTACT_EMAILS.donations,
    desc: "Tax-deductible donations, grant applications, and fundraising questions.",
  },
  {
    icon: Mail,
    color: "#60A5FA",
    title: "Finance & Governance",
    email: CONTACT_EMAILS.finance,
    desc: "Registration documents, donation receipts, wire and check gifts, grant paperwork.",
  },
];

const social = [
  {
    icon: Github,
    color: "#E5E7EB",
    name: "GitHub",
    handle: "@embeddedos-org",
    href: SOCIAL_URLS.github,
  },
  {
    icon: Twitter,
    color: "#1D9BF0",
    name: "X / Twitter",
    handle: "@EmbeddedOS_ORG",
    href: SOCIAL_URLS.x,
  },
  {
    icon: MessageSquare,
    color: "#5865F2",
    name: "GitHub Discussions",
    handle: "EmbeddedOS Community",
    href: SOCIAL_URLS.discussions,
  },
  {
    icon: Globe,
    color: "#F97316",
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
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Mail className="w-4 h-4" /> CONTACT
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300">
              Get in touch with the EmbeddedOS Foundation team.
            </p>
            <p className="text-sm text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Every address below reaches a person, not a queue. Security
              reports are answered within 48 hours under the{" "}
              <Link
                href="/security"
                className="text-orange-400 underline underline-offset-2"
              >
                security policy
              </Link>
              ; other enquiries are answered in the order they arrive.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Email Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((c, i) => (
              <motion.div
                key={c.email}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: c.color + "20" }}
                  >
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-0.5">
                      {c.title}
                    </div>
                    <a
                      href={"mailto:" + c.email}
                      className="text-orange-400 text-sm hover:underline"
                    >
                      {c.email}
                    </a>
                    <p className="text-gray-500 text-xs mt-1">{c.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            Social & Community
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {social.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-white/20 transition-all block"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: s.color + "20" }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-white font-medium text-sm mb-0.5">
                  {s.name}
                </div>
                <div className="text-gray-500 text-xs">{s.handle}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            The Organization You Are Contacting
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-5">
              <Landmark className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-400 text-sm leading-relaxed">
                All of the addresses above belong to one registered nonprofit.
                Its details are published in full so you can confirm who you are
                writing to before you write.
              </p>
            </div>

            <dl className="space-y-3">
              {REGISTRATION.map(row => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 py-2 border-b border-white/5"
                >
                  <dt className="text-gray-500 text-sm">{row.label}</dt>
                  <dd className="text-gray-300 text-sm text-right">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex items-start gap-3 mt-5 pt-5 border-t border-white/5">
              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
                  Mailing address
                </div>
                {/* itemProp/address markup mirrors the PostalAddress in the
                    JSON-LD in client/index.html; both read MAILING_ADDRESS. */}
                <address className="text-gray-300 text-sm not-italic leading-relaxed">
                  {FOUNDATION.legalName}
                  <br />
                  {MAILING_ADDRESS.street}
                  <br />
                  {MAILING_ADDRESS.city}, {MAILING_ADDRESS.region}{" "}
                  {MAILING_ADDRESS.postalCode}
                  <br />
                  {MAILING_ADDRESS.country}
                </address>
                <p className="text-gray-500 text-xs leading-relaxed mt-2">
                  {/* Inline links inside a paragraph carry a persistent
                      underline: colour alone is a WCAG 1.4.1 failure (axe
                      link-in-text-block), enforced on this page. */}
                  For wire transfers, gifts by check or a donation receipt,
                  email{" "}
                  <a
                    href={`mailto:${CONTACT_EMAILS.finance}`}
                    className="text-orange-400 underline underline-offset-2"
                  >
                    {CONTACT_EMAILS.finance}
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/transparency"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg border border-white/15 transition-colors"
              >
                Registration &amp; finances
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg border border-white/15 transition-colors"
              >
                Mission &amp; scope
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 text-gray-500 text-xs">
            <Clock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              The Foundation is a volunteer-supported {FOUNDATION.taxStatus}.
              Replies come from maintainers and staff rather than a support
              desk, so please allow time for a considered answer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
