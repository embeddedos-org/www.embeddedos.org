import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Users,
  Star,
  Shield,
  Building2,
  Check,
  Heart,
  Code2,
  BookOpen,
  Globe,
  Award,
} from "lucide-react";

const tiers = [
  {
    id: "community",
    name: "Community Member",
    price: "Free",
    period: "",
    icon: Users,
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    description:
      "Join the EmbeddedOS community. Access all open-source repositories, documentation, and community forums.",
    benefits: [
      "Access to all 22 open-source repositories",
      "Community forum participation",
      "GitHub Discussions access",
      "Newsletter updates",
      "14 free technical books",
      "Hardware Lab documentation",
    ],
    cta: "Join for Free",
    ctaHref: "https://github.com/embeddedos-org",
    external: true,
  },
  {
    id: "supporter",
    name: "Supporter",
    price: "$5",
    period: "/month",
    icon: Heart,
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    description:
      "Support the Foundation's mission with a monthly contribution. Help fund research, documentation, and community events.",
    benefits: [
      "Everything in Community",
      "Supporter badge on GitHub",
      "Early access to announcements",
      "Monthly research digest",
      "Name in annual report",
      "Direct support to open-source research",
    ],
    cta: "Become a Supporter",
    ctaHref: "/donate",
    external: false,
    highlight: false,
  },
  {
    id: "contributor",
    name: "Contributor",
    price: "$25",
    period: "/month",
    icon: Code2,
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300",
    description:
      "For active developers and engineers who want to contribute to the EmbeddedOS ecosystem and shape its direction.",
    benefits: [
      "Everything in Supporter",
      "Contributor badge",
      "Priority issue responses",
      "Access to pre-release builds",
      "Invitation to contributor calls",
      "Vote on roadmap priorities",
      "EmbeddedOS sticker pack",
    ],
    cta: "Become a Contributor",
    ctaHref: "/donate",
    external: false,
    highlight: true,
  },
  {
    id: "sponsor",
    name: "Sponsor",
    price: "$100",
    period: "/month",
    icon: Star,
    color: "from-orange-500/20 to-orange-600/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300",
    description:
      "For companies and individuals who want to sponsor specific research projects or features in the EmbeddedOS ecosystem.",
    benefits: [
      "Everything in Contributor",
      "Sponsor logo on website",
      "Quarterly strategy briefings",
      "Named sponsorship of a feature",
      "Priority support channel",
      "Annual impact report",
      "Speaking opportunity at events",
    ],
    cta: "Become a Sponsor",
    ctaHref: "/donate",
    external: false,
    highlight: false,
  },
  {
    id: "enterprise",
    name: "Enterprise Partner",
    price: "Custom",
    period: "",
    icon: Building2,
    color: "from-teal-500/20 to-teal-600/10",
    border: "border-teal-500/30",
    badge: "bg-teal-500/20 text-teal-300",
    description:
      "For organizations deploying EmbeddedOS in production or wanting to co-develop features for commercial use cases.",
    benefits: [
      "Everything in Sponsor",
      "Dedicated engineering liaison",
      "Custom hardware integration support",
      "Co-development agreements",
      "Commercial licensing consultation",
      "Board advisory seat (annual)",
      "Joint press release opportunity",
    ],
    cta: "Contact Us",
    ctaHref: "mailto:hello@embeddedos.org",
    external: true,
    highlight: false,
  },
];

const perks = [
  {
    icon: BookOpen,
    title: "14 Technical Books",
    description: "Free access to all EmbeddedOS technical books — kernel, AI, hardware, and more.",
  },
  {
    icon: Code2,
    title: "Foundation First",
    description: "Every line of code is MIT-licensed and publicly available on GitHub.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Join engineers from 50+ countries building the future of embedded systems.",
  },
  {
    icon: Shield,
    title: "501(c)(3) · 509(a)(2)",
    description: "Donations are tax-deductible to the extent permitted by law.",
  },
  {
    icon: Award,
    title: "Research Impact",
    description: "Your support funds patent-pending health devices and aerospace avionics research.",
  },
  {
    icon: Users,
    title: "Community Events",
    description: "Hackathons, workshops, and developer conferences worldwide.",
  },
];

export default function Membership() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-background to-background" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              FOUNDATION MEMBERSHIP
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                EmbeddedOS
              </span>{" "}
              Foundation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Support Foundation embedded systems research. Every contribution funds
              hardware testing, technical books, security audits, and community events.
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-400" />
              <span>501(c)(3) · 509(a)(2) · Tax-deductible donations · MIT License · No vendor lock-in</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Membership Tiers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the level of involvement that works for you. All tiers include full access
              to the open-source ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`relative rounded-2xl border ${tier.border} bg-gradient-to-b ${tier.color} p-6 flex flex-col ${
                    tier.highlight ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10" : ""
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${tier.badge}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tier.badge}`}>
                      {tier.name}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      {tier.period && (
                        <span className="text-muted-foreground text-sm">{tier.period}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 flex-1">{tier.description}</p>

                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.external ? (
                    <a
                      href={tier.ctaHref}
                      target={tier.ctaHref.startsWith("http") ? "_blank" : undefined}
                      rel={tier.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                        tier.highlight
                          ? "bg-purple-500 hover:bg-purple-600 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {tier.cta}
                    </a>
                  ) : (
                    <Link href={tier.ctaHref}>
                      <button
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                          tier.highlight
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                      >
                        {tier.cta}
                      </button>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Join the Foundation?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your membership directly funds open-source embedded systems research for the benefit of humanity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="p-6 rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/10 w-fit mb-4">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground">{perk.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Support{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Open-Source Research?
              </span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Every contribution — big or small — helps advance embedded systems research,
              education, and technology for the benefit of humanity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <button className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-all flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Donate Now
                </button>
              </Link>
              <a
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 font-semibold transition-all"
              >
                Star on GitHub
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Embedded Operating Systems Research Foundation · 501(c)(3) · 509(a)(2) ·
              Donations are tax-deductible to the extent permitted by law.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
