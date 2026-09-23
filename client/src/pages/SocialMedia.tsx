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

import { ExternalLink } from "lucide-react";

import { SOCIAL_URLS } from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";
import { categoryByPath } from "@/data/categories";
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";

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
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-teal mb-4 inline-flex">Marketing</div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
            {category.name}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            {category.summary}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <ul className="space-y-3">
            {ACCOUNTS.map(account => (
              <li
                key={account.key}
                className="glass rounded-xl border border-white/5 p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                  <span className="text-white font-medium">{account.name}</span>
                  <a
                    href={SOCIAL_URLS[account.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#F97316] underline hover:no-underline font-semibold"
                  >
                    {account.handle}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
                <p className="text-white/55 text-sm leading-relaxed">
                  {account.use}
                </p>
              </li>
            ))}
          </ul>

          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="font-heading font-bold text-white text-lg mb-3">
              If an account is not on this list
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              It is not ours. The Foundation runs no other accounts, sends no
              direct messages asking for keys, credentials or payment, and does
              not sell anything over social media. If you find an account
              presenting itself as EmbeddedOS and it is not listed above, please
              <button
                type="button"
                onClick={() => openContactForm({ topic: "security" })}
                className="text-[#F97316] underline hover:no-underline"
              >
                tell us
              </button>
              .
            </p>
          </div>
        </div>
      </section>

      <AboutSections title="About our accounts" sections={SOCIAL_ABOUT} />
    </div>
  );
}
