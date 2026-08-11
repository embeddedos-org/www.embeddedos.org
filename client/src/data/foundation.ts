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
 * Where to reach the Foundation, by subject.
 *
 * This is also the list to check mailboxes against: the site has no server and
 * therefore sends no mail itself, so every address here has to exist as a real
 * cPanel mailbox or the message bounces with nothing on the site to show for it.
 * `sponsors` and `conduct` were previously typed straight into Sponsors.tsx and
 * CodeOfConduct.tsx, which kept them out of exactly that check.
 */
export const CONTACT_EMAILS = {
  general: "hello@embeddedos.org",
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
  facebook: "https://www.facebook.com/profile.php?id=61588978691494",
  discussions: "https://github.com/orgs/embeddedos-org/discussions",
} as const;
