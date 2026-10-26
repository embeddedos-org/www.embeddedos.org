import type { CSSProperties } from "react";
import { openContactForm } from "@/lib/contact-form";
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./Partners.css";

const tiers = [
  {
    name: "Platinum Sponsor",
    price: "$50,000/year",
    color: "#E5E7EB",
    perks: [
      "Logo on every page of embeddedos.org",
      "Speaking slot at annual EmbeddedOS Summit",
      "Early access to all releases (30 days)",
      "Dedicated Slack channel with Foundation engineers",
      "Joint press release",
      "4 free enterprise support seats",
    ],
  },
  {
    name: "Gold Sponsor",
    price: "$20,000/year",
    color: "#FBBF24",
    perks: [
      "Logo on homepage and sponsors page",
      "Speaking slot at annual summit",
      "Early access to all releases (14 days)",
      "2 free enterprise support seats",
      "Joint blog post",
    ],
  },
  {
    name: "Silver Sponsor",
    price: "$5,000/year",
    color: "#9CA3AF",
    perks: [
      "Logo on sponsors page",
      "Early access to all releases (7 days)",
      "1 free enterprise support seat",
      "Mention in quarterly newsletter",
    ],
  },
  {
    name: "Community Sponsor",
    price: "$1,000/year",
    color: "#F97316",
    perks: [
      "Logo on sponsors page",
      "Mention in quarterly newsletter",
      "Community recognition badge",
    ],
  },
];

/**
 * Supporting text for the partnerships page (Ad Grants: substantial
 * content). Everything below restates or explains what the tiers above
 * already show: no new prices, no new perks, no invented partners.
 */
const PARTNERS_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "What partnership means here",
    body: [
      "A partnership with the Foundation is a public statement of support for open-source embedded systems research, and a contribution toward sustaining it. The tiers above recognise that support at different levels — from community recognition to a presence across the site and the annual summit.",
      "What a partnership is not: a commercial transaction for influence. A logo here recognises support; it does not buy a say in what gets built. The direction of the Foundation's software is decided in the open, through the public governance process in the repositories — proposals, review, and discussion anyone can read and join.",
    ],
  },
  {
    heading: "Where the money goes",
    body: [
      "All sponsorship fees are reinvested into the mission: open-source development, free certifications, and education. The Foundation is a registered 501(c)(3) nonprofit, EIN 41-4821627, so contributions are tax-deductible to the extent the law allows.",
      "How the money is used is reported like everything else the Foundation does. The transparency page carries the Foundation's financial disclosures, and sponsorship income appears there alongside donations and grants.",
    ],
  },
  {
    heading: "The tiers, plainly",
    body: [
      "Four tiers, priced annually. Community Sponsor at $1,000 a year: a logo on the sponsors page, a mention in the quarterly newsletter, and a community recognition badge. Silver at $5,000 a year: early access to releases and an enterprise support seat, added to the community benefits.",
      "Gold at $20,000 a year: a logo on the homepage and sponsors page, a speaking slot at the annual summit, longer early access, and a joint blog post. Platinum at $50,000 a year: a logo on every page of the site, a summit speaking slot, the earliest access, a dedicated channel with Foundation engineers, a joint press release, and four support seats.",
      "The perks are recognition and access, not control. Every tier's benefits are listed in full above — there are no unpublished benefits and no private arrangements.",
    ],
  },
  {
    heading: "Who partnerships are for",
    body: [
      "Hardware companies shipping or evaluating the stack, cloud providers whose infrastructure touches embedded fleets, universities teaching or researching on open platforms, and research labs working on the problems the Foundation investigates. If your organisation depends on open embedded software, or wants to, this is the formal way to sustain it.",
      "Organisations that are not ready for a tier can still contribute: the codebase is open, the discussions are public, and donations of any size go to the same mission.",
    ],
  },
  {
    heading: "How to start",
    body: [
      "Use the contact form with the partnerships topic. Tell us about your organisation and which tier you are considering, and we will reply with the agreement and the next steps.",
      "The tiers are the same public terms for everyone — a nonprofit's partnerships should be as transparent as its code.",
    ],
  },
];

export default function Partners() {
  return (
    <BpPage className="partners">
      <PageHero
        sig
        label="PARTNERSHIPS & SPONSORS"
        title="Partners & Sponsors"
        lead="Support the EmbeddedOS Foundation and get your organization in front of 10,000+ embedded engineers worldwide."
      />

      <Section className="pt-tiers">
        <p className="gnote pt-note">
          All sponsorship fees are reinvested into open-source development, free
          certifications, and education. Donations are{" "}
          <strong>tax-deductible</strong> as the Foundation is a registered{" "}
          <strong>501(c)(3)</strong> nonprofit.
        </p>
        <ul className="cards two">
          {tiers.map(t => (
            <li key={t.name}>
              <div
                className="card pt-tier"
                style={{ "--c": t.color } as CSSProperties}
              >
                <div className="top">
                  <h2>{t.name}</h2>
                  <span className="pt-price">{t.price}</span>
                </div>
                <ul className="pt-perks">
                  {t.perks.map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openContactForm({ topic: "partners" })}
                  className="btn gh pt-cta"
                >
                  Become a Sponsor{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Interested in Partnering?"
        lead="Hardware companies, cloud providers, universities, and research labs — we welcome all partnership discussions."
      >
        <button
          type="button"
          onClick={() => openContactForm({ topic: "partners" })}
          className="btn pri"
        >
          Contact Partnerships
        </button>
      </Band>

      <AboutSections title="About partnerships" sections={PARTNERS_ABOUT} />
    </BpPage>
  );
}
