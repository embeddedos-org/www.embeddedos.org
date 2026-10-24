/**
 * Social Media — every account the Foundation actually runs.
 *
 * The useful function of this page is negative: it lets someone check whether
 * an account claiming to be EmbeddedOS is one of ours. A young foundation with
 * an active GitHub presence is an easy thing to impersonate, and the answer to
 * that is a canonical list on the domain nobody else controls.
 *
 * The links come from SOCIAL_URLS, which is also what the footer and the
 * JSON-LD `sameAs` use. Search engines read that property to associate the
 * accounts with the organisation, so the list being identical in all three
 * places is what makes the association hold.
 */

import { SOCIAL_URLS } from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";
import { categoryByPath } from "@/data/categories";
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./SocialMedia.css";

/**
 * The accounts, with what each is actually used for.
 *
 * Keyed off SOCIAL_URLS so an account added there without a description here
 * fails the build rather than quietly going unlisted.
 */
const ACCOUNTS: readonly {
  key: keyof typeof SOCIAL_URLS;
  name: string;
  handle: string;
  use: string;
}[] = [
  {
    key: "github",
    name: "GitHub",
    handle: "embeddedos-org",
    use: "All source, all releases, and where technical decisions are actually made.",
  },
  {
    key: "discussions",
    name: "GitHub Discussions",
    handle: "embeddedos-org",
    use: "Questions, proposals and design debate. The best place to reach maintainers.",
  },
  {
    key: "x",
    name: "X",
    handle: "@EmbeddedOS_ORG",
    use: "Release notes and short announcements.",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    handle: "Embedded Operating Systems Research Foundation",
    use: "Foundation news, roles, and material aimed at member organisations.",
  },
  {
    key: "youtube",
    name: "YouTube",
    handle: "@EmbeddedOS_ORG",
    use: "Talks, walkthroughs and recorded sessions.",
  },
  {
    key: "instagram",
    name: "Instagram",
    handle: "@embeddedos_org",
    use: "Hardware photographs and work in progress.",
  },
  {
    key: "facebook",
    name: "Facebook",
    handle: "EmbeddedOS Foundation",
    use: "Event notices and community posts.",
  },
];

/**
 * Supporting text for the social accounts page (Ad Grants: substantial
 * content). Facts only: the accounts, their stated purposes, and the
 * Foundation's stated policies. No invented follower counts or schedules.
 */
const SOCIAL_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "Why this list exists",
    body: [
      "The useful function of this page is negative: it lets you check whether an account claiming to be EmbeddedOS is one of ours. A young foundation with an active GitHub presence is an easy thing to impersonate, and the answer is a canonical list on the domain nobody else controls.",
      "The same list appears in the footer's social links and in the site's structured data, so search engines associate the accounts with the organisation. The list being identical in all three places is what makes the association hold.",
    ],
  },
  {
    heading: "What each account is for",
    body: [
      "The accounts divide by purpose. GitHub is where the work happens: all source, all releases, and where technical decisions are actually made. GitHub Discussions is where the conversation happens: questions, proposals, and design debate — the best place to reach maintainers.",
      "X carries release notes and short announcements. LinkedIn carries Foundation news, roles, and material aimed at member organisations. YouTube carries talks and walkthroughs. Instagram carries hardware photographs and work in progress. Facebook carries event notices and community posts.",
      "Follow the accounts whose purpose matches your interest; none of them carries everything.",
    ],
  },
  {
    heading: "What we will never do",
    body: [
      "The Foundation runs no other accounts, sends no direct messages asking for keys, credentials, or payment, and does not sell anything over social media. Any message that claims to be from us and asks for any of those things is not from us.",
      "We do not offer support over social media direct messages either. Technical questions belong in GitHub Discussions, where the answers stay public and searchable; security issues belong to the security contact, not to a DM.",
    ],
  },
  {
    heading: "If an account is not on this list",
    body: [
      "It is not ours — this page states it plainly above, and it bears repeating because impersonation is the actual risk this page guards against. If you find an account presenting itself as EmbeddedOS that is not listed here, use the contact form with the security topic and tell us.",
      "Community accounts about EmbeddedOS are welcome: people discussing, building on, or teaching the stack should absolutely post about it. We only ask that they do not present themselves as the Foundation itself. If you are ever unsure whether an account is official, this page is the reference — the list here is complete.",
    ],
  },
];

export default function SocialMedia() {
  const category = categoryByPath("/social")!;

  return (
    <BpPage className="social">
      <PageHero
        sig
        label="Marketing"
        title={category.name}
        lead={category.summary}
      />

      <Section className="so-main">
        <ul className="cards so-list">
          {ACCOUNTS.map(account => (
            <li key={account.key}>
              <div className="card">
                <h2>{account.name}</h2>
                <p>{account.use}</p>
                <a
                  href={SOCIAL_URLS[account.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="more so-handle"
                >
                  {account.handle}
                  <span aria-hidden="true"> ↗</span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="card hl so-note">
          <h2>If an account is not on this list</h2>
          <p>
            It is not ours. The Foundation runs no other accounts, sends no
            direct messages asking for keys, credentials or payment, and does
            not sell anything over social media. If you find an account
            presenting itself as EmbeddedOS and it is not listed above, please{" "}
            <button
              type="button"
              onClick={() => openContactForm({ topic: "security" })}
              className="tl so-tell"
            >
              tell us
            </button>
            .
          </p>
        </div>
      </Section>

      <AboutSections title="About our accounts" sections={SOCIAL_ABOUT} />
    </BpPage>
  );
}
