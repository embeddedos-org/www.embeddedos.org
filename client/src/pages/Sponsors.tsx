import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import { openContactForm } from "@/lib/contact-form";
import "./Sponsors.css";

const tiers = [
  {
    name: "Platinum Sponsor",
    amount: "$50,000+/year",
    color: "#E5E7EB",
    benefits: [
      "Logo on homepage hero section",
      "Logo on all documentation pages",
      "Named in every press release",
      "4 seats at EmbeddedOS Summit",
      "Dedicated technical liaison",
      "Early access to all releases",
      "Joint case study publication",
      "TSC observer seat",
    ],
  },
  {
    name: "Gold Sponsor",
    amount: "$20,000+/year",
    color: "#FBBF24",
    benefits: [
      "Logo on homepage sponsors section",
      "Logo on documentation footer",
      "Named in quarterly newsletter",
      "2 seats at EmbeddedOS Summit",
      "Early access to releases",
      "Joint blog post opportunity",
    ],
  },
  {
    name: "Silver Sponsor",
    amount: "$5,000+/year",
    color: "#9CA3AF",
    benefits: [
      "Logo on sponsors page",
      "Named in annual report",
      "1 seat at EmbeddedOS Summit",
      "Early access to releases",
    ],
  },
  {
    name: "Community Sponsor",
    amount: "$1,000+/year",
    color: "#F97316",
    benefits: [
      "Logo on sponsors page",
      "Named in annual report",
      "Community Discord role",
    ],
  },
];

const benefits = [
  {
    title: "Talent Pipeline",
    desc: "Access to 10,000+ EmbeddedOS-certified engineers. Sponsor job postings reach the most skilled embedded developers globally.",
  },
  {
    title: "R&D Collaboration",
    desc: "Work directly with the Foundation on research projects. Co-author papers, share IP, and influence the technical roadmap.",
  },
  {
    title: "Brand Visibility",
    desc: "EmbeddedOS reaches 50,000+ developers monthly. Your logo appears on docs, tutorials, and conference materials worldwide.",
  },
  {
    title: "ESG & CSR Impact",
    desc: "Sponsoring a 501(c)(3) nonprofit counts toward ESG goals. Receive a donation receipt for tax deduction purposes.",
  },
];

export default function SponsorsPage() {
  return (
    <BpPage className="sponsors">
      <PageHero
        sig
        label="SPONSORSHIP"
        title="Invest in the Embedded Ecosystem"
        lead="Join leading companies supporting open-source embedded systems. Your sponsorship funds the infrastructure, education, and research that powers the next generation of embedded devices."
      />

      <Section title="Why Sponsor EmbeddedOS?">
        <ul className="cards two">
          {benefits.map(b => (
            <li key={b.title}>
              <div className="card">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Sponsorship Tiers" alt>
        <ul className="cards two">
          {tiers.map(tier => (
            <li key={tier.name}>
              <div
                className="card sp-tier"
                style={{ "--c": tier.color } as CSSProperties}
              >
                <div className="top">
                  <h3>{tier.name}</h3>
                  <span className="sp-amt">{tier.amount}</span>
                </div>
                <ul className="sp-list">
                  {tier.benefits.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section className="band">
        <div className="wrap">
          <div>
            <h2>Become a Sponsor</h2>
            <p className="lead">
              Contact us to discuss sponsorship options and get your logo on the
              EmbeddedOS website.
            </p>
          </div>
          <div className="ctas">
            <button
              type="button"
              onClick={() => openContactForm({ topic: "sponsors" })}
              className="btn or"
            >
              Contact Sponsorship Team{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </button>
            <Link href="/donate" className="btn gh">
              Individual Donation
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
