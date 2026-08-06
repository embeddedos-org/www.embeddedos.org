import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Twitter,
  MessageSquare,
  MapPin,
  ArrowRight,
  Globe,
} from "lucide-react";

const contacts = [
  {
    icon: Mail,
    color: "#F97316",
    title: "General Inquiries",
    email: "hello@embeddedos.org",
    desc: "Questions about EmbeddedOS products, partnerships, or the Foundation.",
  },
  {
    icon: Mail,
    color: "#EF4444",
    title: "Security Vulnerabilities",
    email: "security@embeddedos.org",
    desc: "Report security vulnerabilities via responsible disclosure. Do not use GitHub issues.",
  },
  {
    icon: Mail,
    color: "#22D3EE",
    title: "Press & Media",
    email: "press@embeddedos.org",
    desc: "Press inquiries, interview requests, and media kit downloads.",
  },
  {
    icon: Mail,
    color: "#A855F7",
    title: "Partnerships & Sponsors",
    email: "partners@embeddedos.org",
    desc: "Corporate sponsorships, hardware partnerships, and research collaborations.",
  },
  {
    icon: Mail,
    color: "#34D399",
    title: "Careers & Internships",
    email: "careers@embeddedos.org",
    desc: "Job applications, internship inquiries, and fellowship applications.",
  },
  {
    icon: Mail,
    color: "#FBBF24",
    title: "Donations & Fundraising",
    email: "donate@embeddedos.org",
    desc: "Tax-deductible donations, grant applications, and fundraising questions.",
  },
];

const social = [
  {
    icon: Github,
    color: "#E5E7EB",
    name: "GitHub",
    handle: "@embeddedos-org",
    href: "https://github.com/embeddedos-org",
  },
  {
    icon: Twitter,
    color: "#1D9BF0",
    name: "X / Twitter",
    handle: "@embeddedos",
    href: "https://twitter.com/embeddedos",
  },
  {
    icon: MessageSquare,
    color: "#5865F2",
    name: "GitHub Discussions",
    handle: "EmbeddedOS Community",
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
  {
    icon: Globe,
    color: "#F97316",
    name: "Website",
    handle: "www.embeddedos.org",
    href: "https://www.embeddedos.org",
  },
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
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">
                  EmbeddedOS Research Foundation
                </div>
                <div className="text-gray-400 text-sm">
                  501(c)(3) Nonprofit Organization
                </div>
                <div className="text-gray-400 text-sm mt-1">United States</div>
                <div className="text-gray-500 text-xs mt-2">
                  EIN available upon request for donation tax receipts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
