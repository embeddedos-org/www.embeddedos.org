import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Fundraising.css";

const tiers = [
  {
    name: "Supporter",
    amount: "$5/month",
    perks: [
      "Name in annual report",
      "Community Discord role",
      "Supporter badge on profile",
    ],
  },
  {
    name: "Educator",
    amount: "$25/month",
    perks: [
      "All Supporter perks",
      "Free certification exam voucher",
      "Early access to new courses",
      "Educator Discord channel",
    ],
  },
  {
    name: "Builder",
    amount: "$100/month",
    perks: [
      "All Educator perks",
      "Monthly 1:1 with a core maintainer",
      "Pre-release firmware access",
      "Builder credits for EoSim cloud",
    ],
  },
  {
    name: "Innovator",
    amount: "$500/month",
    perks: [
      "All Builder perks",
      "TSC observer seat",
      "Joint blog post opportunity",
      "Named in press releases",
      "4 Summit tickets",
    ],
  },
];

const uses = [
  {
    title: "OS Development",
    pct: 45,
    desc: "Core kernel development, HAL drivers, security patches, and CI infrastructure.",
  },
  {
    title: "Education & Docs",
    pct: 25,
    desc: "Documentation, tutorials, certification curriculum, and EoStudio learning paths.",
  },
  {
    title: "Community",
    pct: 15,
    desc: "Community events, Discord moderation, contributor onboarding, and hackathons.",
  },
  {
    title: "Research",
    pct: 15,
    desc: "Academic partnerships, formal verification, and long-term research directions.",
  },
];

export default function FundraisingPage() {
  return (
    <BpPage className="fundraising">
      <PageHero
        sig
        label="FUNDRAISING"
        title="Every Dollar Makes a Difference"
        lead="Your donation funds open-source OS development, free certifications, and education for embedded engineers worldwide. EmbeddedOS Foundation is a 501(c)(3) nonprofit — all donations are tax-deductible."
      />

      <Section
        title="What Your Donation Funds"
        lead="100% of donations go directly to the Foundation mission. No executive salaries, no overhead."
      >
        <ul className="cards two">
          {uses.map(u => (
            <li key={u.title}>
              <div className="card fr-use">
                <div className="top">
                  <h3>{u.title}</h3>
                  <span className="fr-pct">{u.pct}%</span>
                </div>
                <div className="fr-bar" aria-hidden="true">
                  <i style={{ "--w": u.pct + "%" } as CSSProperties} />
                </div>
                <p>{u.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Monthly Giving Tiers" alt>
        <ul className="cards four">
          {tiers.map(tier => (
            <li key={tier.name}>
              <div className="card fr-tier">
                <h3>{tier.name}</h3>
                <p className="fr-amt">{tier.amount}</p>
                <ul className="fr-perks">
                  {tier.perks.map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link href="/donate#donate-now" className="btn gh fr-give">
                  Donate
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section className="sec tight fr-end">
        <div className="wrap">
          <div className="ctas">
            <Link href="/donate#donate-now" className="btn or">
              Donate Now{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/sponsors" className="btn gh">
              Corporate Sponsorship
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
