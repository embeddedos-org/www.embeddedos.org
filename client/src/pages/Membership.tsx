import { Link } from "wouter";
import { openContactForm } from "@/lib/contact-form";
import { REPO_COUNT } from "@/data/stack";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Membership.css";

const tiers: Array<{
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  benefits: string[];
  cta: string;
  ctaHref: string;
  /** When set, the CTA opens the contact form instead of following ctaHref. */
  ctaAction?: () => void;
  external: boolean;
  highlight?: boolean;
}> = [
  {
    id: "community",
    name: "Community Member",
    price: "Free",
    period: "",
    description:
      "Join the EmbeddedOS community. Access all open-source repositories, documentation, and community forums.",
    benefits: [
      `Access to all ${REPO_COUNT} open-source repositories`,
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
    ctaHref: "",
    ctaAction: () => openContactForm({ topic: "contact" }),
    external: false,
    highlight: false,
  },
];

const perks = [
  {
    title: "14 Technical Books",
    description:
      "Free access to all EmbeddedOS technical books — kernel, AI, hardware, and more.",
  },
  {
    title: "Foundation First",
    description:
      "Every line of code is MIT-licensed and publicly available on GitHub.",
  },
  {
    title: "Global Community",
    description:
      "Join engineers from 50+ countries building the future of embedded systems.",
  },
  {
    title: "501(c)(3)",
    description: "Donations are tax-deductible to the extent permitted by law.",
  },
  {
    title: "Research Impact",
    description:
      "Your support funds patent-pending health devices and aerospace avionics research.",
  },
  {
    title: "Community Events",
    description: "Hackathons, workshops, and developer conferences worldwide.",
  },
];

export default function Membership() {
  return (
    <BpPage className="membership">
      <PageHero
        sig
        label="FOUNDATION MEMBERSHIP"
        title="Join the EmbeddedOS Foundation"
        lead="Support Foundation embedded systems research. Every contribution funds hardware testing, technical books, security audits, and community events."
      >
        <p className="mb-facts">
          501(c)(3) · Tax-deductible donations · MIT License · No vendor lock-in
        </p>
      </PageHero>

      <Section
        wide
        title="Membership Tiers"
        lead="Choose the level of involvement that works for you. All tiers include full access to the open-source ecosystem."
      >
        <ul className="cards mb-tiers">
          {tiers.map(tier => (
            <li key={tier.id}>
              <div
                className={tier.highlight ? "card hl mb-tier" : "card mb-tier"}
              >
                <div className="top">
                  <h3 className="mb-name">{tier.name}</h3>
                  {tier.highlight && (
                    <span className="mb-pop">MOST POPULAR</span>
                  )}
                </div>
                <p className="mb-price">
                  <b>{tier.price}</b>
                  {tier.period && <span>{tier.period}</span>}
                </p>
                <p>{tier.description}</p>
                <ul className="mb-list">
                  {tier.benefits.map(benefit => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div className="mb-cta">
                  {tier.ctaAction ? (
                    <button
                      type="button"
                      onClick={tier.ctaAction}
                      className={tier.highlight ? "btn or" : "btn gh"}
                    >
                      {tier.cta}
                    </button>
                  ) : tier.external ? (
                    <a
                      href={tier.ctaHref}
                      target={
                        tier.ctaHref.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        tier.ctaHref.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={tier.highlight ? "btn or" : "btn gh"}
                    >
                      {tier.cta}
                    </a>
                  ) : (
                    <Link href={tier.ctaHref} className="mb-wrap">
                      <button
                        type="button"
                        className={tier.highlight ? "btn or" : "btn gh"}
                      >
                        {tier.cta}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Why Join the Foundation?"
        lead="Your membership directly funds open-source embedded systems research for the benefit of humanity."
        alt
      >
        <ul className="cards">
          {perks.map(perk => (
            <li key={perk.title}>
              <div className="card">
                <h3>{perk.title}</h3>
                <p>{perk.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section className="band mb-band">
        <div className="wrap">
          <div>
            <h2>Ready to Support Open-Source Research?</h2>
            <p className="lead">
              Every contribution — big or small — helps advance embedded systems
              research, education, and technology for the benefit of humanity.
            </p>
            <p className="fine">
              Embedded Operating Systems Research Foundation · 501(c)(3) ·
              Donations are tax-deductible to the extent permitted by law.
            </p>
          </div>
          <div className="ctas">
            <Link href="/donate" className="mb-wrap">
              <button type="button" className="btn or">
                Donate Now
              </button>
            </Link>
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn gh"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
