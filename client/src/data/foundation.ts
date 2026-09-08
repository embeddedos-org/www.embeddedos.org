/**
 * The Foundation's legal identity, mission and programmes — one source of truth.
 *
 * Before this module the same facts were retyped on each page that needed them,
 * and they had already drifted: `/organization` and `/donate` published EIN
 * 41-4821627 while `/contact` said the EIN was "available upon request". A
 * reviewer reading both pages sees a contradiction about the single number that
 * proves charitable status. Everything legal or numeric that appears on more
 * than one page belongs here so there is only one place to correct it.
 *
 * Every value below is transcribed from the Foundation's IRS determination or
 * from a page that already published it. Nothing here may be estimated: if a
 * figure is not known, it is absent rather than approximated.
 */

/** Legal identity as it appears on the IRS determination letter. */
export const FOUNDATION = {
  legalName: "Embedded Operating Systems Research Foundation",
  shortName: "EmbeddedOS Foundation",
  ein: "41-4821627",
  taxStatus: "501(c)(3) Public Charity",
  publicCharityClassification: "509(a)(2)",
  exemptionEffective: "March 11, 2026",
  /** IRS ruling year — the tax year the exemption first applies to. */
  firstFiscalYear: "2026",
  accountingPeriodEnds: "December 31",
  deductibility: "Contributions are deductible under IRC Section 170",
  jurisdiction: "United States",
  website: "https://www.embeddedos.org",
  softwareLicense: "MIT License",
} as const;

/**
 * The Foundation's address of record, split so the same values feed the
 * `/contact` page and the PostalAddress in the JSON-LD without being retyped.
 * A verifiable address is one of the things an Ad Grants reviewer looks for, and
 * it was previously absent from every page.
 */
export const MAILING_ADDRESS = {
  street: "2601 Cortez Dr",
  city: "Santa Clara",
  region: "CA",
  postalCode: "95051",
  country: "United States",
  countryCode: "US",
} as const;

/**
 * The IRS's public lookup for exempt organisations. Linked rather than deep
 * linked by EIN: the Tax Exempt Organization Search takes its query through a
 * POST-backed form, so an EIN-bearing URL is not stable enough to publish.
 */
export const IRS_LOOKUP_URL = "https://apps.irs.gov/app/eos/";

/**
 * The mission statement. Quoted verbatim on `/`, `/mission` and `/about`; edit
 * it here and every page follows.
 */
export const MISSION_STATEMENT =
  "To advance open-source embedded systems research, education and technology " +
  "for the public benefit — so that every embedded device, from a $2 " +
  "microcontroller to an aircraft flight computer, can run software that anyone " +
  "is free to read, audit, learn from and build on.";

/**
 * The charitable purposes the Foundation operates under. Phrased against the
 * exempt purposes named in IRC 501(c)(3) so the connection between what the
 * Foundation does and why it is exempt is legible without a lawyer.
 */
export const CHARITABLE_PURPOSES = [
  {
    purpose: "Scientific",
    detail:
      "Conducting and publishing research into real-time operating systems, " +
      "on-device machine learning, and safety-critical embedded architecture, " +
      "with results released openly rather than licensed.",
  },
  {
    purpose: "Educational",
    detail:
      "Producing free technical books, curriculum, reference documentation and " +
      "a children's edition, and running internships that teach embedded " +
      "engineering to people who cannot pay for training.",
  },
  {
    purpose: "Charitable",
    detail:
      "Lessening the burden on public-interest developers — universities, " +
      "hospitals, other nonprofits and independent engineers — by maintaining " +
      "infrastructure they would otherwise have to license or rebuild.",
  },
] as const;

/**
 * What the Foundation does, and where each programme is documented. `href`
 * points at the page that describes the programme in depth, so this array
 * doubles as the navigation between the mission and the work itself.
 */
export const PROGRAMS = [
  {
    id: "platform",
    name: "Open-Source Platform Engineering",
    summary:
      "Design, build and maintain the EoS real-time kernel and the components " +
      "around it — bootloader, inter-process communication, storage, build " +
      "tooling and simulation — released under the MIT License.",
    activities: [
      "Maintain the EoS kernel and its supporting repositories in public",
      "Review, test and merge community contributions under open governance",
      "Publish tagged releases with changelogs and upgrade notes",
      "Run security review on every release and disclose findings responsibly",
    ],
    serves:
      "Engineers and organisations building embedded products who need a " +
      "dependable base they are permitted to inspect and modify.",
    href: "/projects",
  },
  {
    id: "education",
    name: "Education and Free Curriculum",
    summary:
      "Publish the teaching material that embedded engineering normally hides " +
      "behind paid training: full-length technical books, API references, " +
      "guided tutorials and a version written for children.",
    activities: [
      "Write and maintain free technical books covering the whole stack",
      "Keep reference documentation current with each release",
      "Maintain a Kids Edition that introduces embedded computing without cost",
      "Answer learner questions in public so the answers stay searchable",
    ],
    serves:
      "Students, career changers, teachers and self-taught engineers — " +
      "particularly outside regions with established embedded industries.",
    href: "/books",
  },
  {
    id: "research",
    name: "Research and Publication",
    summary:
      "Investigate problems the commercial market under-serves — health " +
      "monitoring hardware, neural interfaces, avionics and quantum control " +
      "systems — and publish the results, including patent filings, openly.",
    activities: [
      "Run research programmes in health, aerospace and edge AI",
      "Publish findings, designs and filings rather than licensing them",
      "Share hardware designs so results can be independently reproduced",
    ],
    serves:
      "Clinicians, universities and other nonprofits who can build on the work " +
      "instead of paying to license it.",
    href: "/research",
  },
  {
    id: "workforce",
    name: "Workforce Development",
    summary:
      "Bring people into embedded engineering through structured internships, " +
      "mentored contribution and free certification, with no fee to the " +
      "participant at any stage.",
    activities: [
      "Run internships and research placements with assigned mentors",
      "Offer certification at no cost to the candidate",
      "Pair newcomers with maintainers on real, shipping work",
    ],
    serves:
      "Early-career engineers and students who need verifiable experience " +
      "before they can be hired.",
    href: "/internship",
  },
  {
    id: "community",
    name: "Community and Ecosystem Stewardship",
    summary:
      "Hold the project's governance, code of conduct and public forums, so " +
      "that technical direction is decided in the open and remains independent " +
      "of any single company.",
    activities: [
      "Govern technical direction through a public steering process",
      "Enforce a code of conduct across every Foundation space",
      "Run community events and keep decision records public",
    ],
    serves:
      "Every contributor and user of the project, and anyone who needs to know " +
      "who decides what before they depend on it.",
    href: "/community",
  },
] as const;

/**
 * The boundary of the work. Stated as plainly as the programmes are, because
 * "what a nonprofit does not do" is the half that is usually left implicit — and
 * it is what distinguishes a charitable programme from a commercial one.
 */
export const OUT_OF_SCOPE = [
  {
    claim: "We do not sell software, licences or access.",
    detail:
      "Every Foundation repository is MIT licensed. There is no paid tier, no " +
      "commercial edition and no feature withheld from the free release.",
  },
  {
    claim: "We do not carry advertising or monetise visitors.",
    detail:
      "This site runs no ad network, no affiliate links and no third-party " +
      "advertising scripts. Nothing on it is paid placement.",
  },
  {
    claim: "We do not accept funding that buys technical influence.",
    detail:
      "Sponsorship and membership confer recognition, not authority over the " +
      "roadmap. Technical decisions are made through the public governance " +
      "process regardless of who funds the Foundation.",
  },
  {
    claim: "We do not certify devices for regulatory approval.",
    detail:
      "Foundation software is a building block. Safety, medical and aviation " +
      "certification remain the responsibility of the organisation bringing a " +
      "device to market.",
  },
  {
    claim: "We do not give medical, clinical or legal advice.",
    detail:
      "Health-related research describes the technology, not treatment. It is " +
      "not a substitute for advice from a qualified professional.",
  },
] as const;

/**
 * Where the Foundation's mail actually goes, by subject.
 *
 * No page renders these anymore — the contact form (`ContactFormModal`,
 * built from `CONTACT_TOPICS` below) is the only thing visitors see, and it
 * posts a topic key to `client/public/api/contact.php`, whose own
 * `TOPIC_INBOXES` is what resolves a key to a mailbox on the server. This
 * constant stays as the client-side record of what those addresses are — the
 * thing `tests/unit/foundation-facts.test.ts` cross-checks every other file
 * against so a stray or undeclared `@embeddedos.org` address (a typo, a
 * leftover literal) is still caught even though nothing links to one
 * directly — and it is kept in step with `TOPIC_INBOXES` by hand; the two
 * cannot import each other (one is TypeScript, one is PHP).
 *
 * Every address here still has to exist as a real cPanel mailbox or a
 * message bounces with nothing to show for it. `sponsors` and `conduct` were
 * previously typed straight into Sponsors.tsx and CodeOfConduct.tsx, which
 * kept them out of exactly that check.
 *
 * `contact` and `support` replaced a single `hello@`, which carried
 * everything from legal notices to build failures. They are split by what
 * the sender wants: `contact` for the Foundation as an organisation —
 * enquiries, press, events, membership, and what the privacy and terms pages
 * point at — and `support` for people who are stuck on the software.
 */
export const CONTACT_EMAILS = {
  contact: "contact@embeddedos.org",
  support: "support@embeddedos.org",
  security: "security@embeddedos.org",
  press: "press@embeddedos.org",
  partners: "partners@embeddedos.org",
  careers: "careers@embeddedos.org",
  donations: "donate@embeddedos.org",
  finance: "foundation@embeddedos.org",
  sponsors: "sponsors@embeddedos.org",
  conduct: "conduct@embeddedos.org",
} as const;

/**
 * The client-facing description of each `CONTACT_EMAILS` key, deliberately
 * without the address itself. The contact form (`ContactFormModal`) and every
 * page that used to print a `mailto:` link now show this list instead: the
 * visitor picks a topic, the form posts to `/api/contact.php`, and the PHP
 * endpoint — not this bundle — is the only place that resolves a topic to an
 * inbox (see `client/public/api/contact.php`'s `TOPIC_INBOXES`). Keep this
 * list's keys in lockstep with `CONTACT_EMAILS` and with `TOPIC_INBOXES`;
 * `tests/unit/foundation-facts.test.ts` and `tests/php/contact.test.php`
 * cross-check both.
 */
export const CONTACT_TOPICS = [
  {
    key: "contact",
    label: "General Inquiries",
    description:
      "Questions about EmbeddedOS products, partnerships, or the Foundation.",
  },
  {
    key: "support",
    label: "Technical Support",
    description:
      "Build failures, board bring-up, toolchain setup, and questions the documentation does not answer.",
  },
  {
    key: "security",
    label: "Security Vulnerabilities",
    description:
      "Report security vulnerabilities via responsible disclosure. Do not use GitHub issues.",
  },
  {
    key: "press",
    label: "Press & Media",
    description:
      "Press inquiries, interview requests, and media kit downloads.",
  },
  {
    key: "partners",
    label: "Partnerships",
    description:
      "Corporate sponsorships, hardware partnerships, and research collaborations.",
  },
  {
    key: "careers",
    label: "Careers & Internships",
    description:
      "Job applications, internship inquiries, and fellowship applications.",
  },
  {
    key: "donations",
    label: "Donations & Fundraising",
    description:
      "Tax-deductible donations, grant applications, and fundraising questions.",
  },
  {
    key: "finance",
    label: "Finance & Governance",
    description:
      "Registration documents, donation receipts, wire and check gifts, grant paperwork.",
  },
  {
    key: "sponsors",
    label: "Sponsorship",
    description:
      "Becoming a sponsor, sponsorship tiers, and existing-sponsor questions.",
  },
  {
    key: "conduct",
    label: "Code of Conduct",
    description: "Report a Code of Conduct concern in a Foundation space.",
  },
] as const satisfies ReadonlyArray<{
  key: keyof typeof CONTACT_EMAILS;
  label: string;
  description: string;
}>;

export type ContactTopicKey = (typeof CONTACT_TOPICS)[number]["key"];

/**
 * The Foundation's accounts, as one list. `/contact` previously linked
 * `twitter.com/embeddedos` while the footer and `/about` linked
 * `x.com/EmbeddedOS_ORG`; only the latter is the Foundation's.
 */
export const SOCIAL_URLS = {
  github: "https://github.com/embeddedos-org",
  x: "https://x.com/EmbeddedOS_ORG",
  linkedin:
    "https://www.linkedin.com/company/embedded-operating-systems-research-foundation",
  youtube: "https://www.youtube.com/@EmbeddedOS_ORG",
  instagram: "https://www.instagram.com/embeddedos_org",
  facebook: "https://www.facebook.com/profile.php?id=61588978691494",
  discussions: "https://github.com/orgs/embeddedos-org/discussions",
} as const;
