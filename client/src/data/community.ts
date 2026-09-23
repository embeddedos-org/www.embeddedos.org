/**
 * The community destinations shown in the footer (every page) and on
 * `/community`.
 *
 * Every href here must be reachable by a logged-out visitor. Three of these
 * previously pointed into `embeddedos-org/www.embeddedos.org` — this
 * repository, which is private — so `/wiki`, `/issues` and `/blob/master/
 * AGENTS.md` answered 404 for the public on all 132 prerendered pages while
 * looking correct to a maintainer who is signed in and a member of the
 * organisation. They now point at the public EoS repository, which carries
 * the same three things for the platform itself.
 *
 * tests/unit/navigation.test.ts pins the exact destinations and refuses any
 * link back into this repository.
 */
export const COMMUNITY_LINKS = [
  {
    name: "Wiki",
    href: "https://github.com/embeddedos-org/eos/wiki",
    description: "Platform guides and project documentation",
  },
  {
    name: "Discussions",
    href: "https://github.com/orgs/embeddedos-org/discussions",
    description: "Questions, proposals, and community conversations",
  },
  {
    name: "Discord",
    href: "https://discord.gg/n6Kd9fwja",
    description: "Real-time community chat and collaboration",
  },
  {
    name: "Issues",
    href: "https://github.com/embeddedos-org/eos/issues",
    description: "Bug reports, feature requests, and tracked work",
  },
  {
    name: "Projects",
    href: "https://github.com/orgs/embeddedos-org/projects",
    description: "Organization planning and delivery boards",
  },
  {
    name: "AGENTS.md",
    href: "https://github.com/embeddedos-org/eos/blob/master/AGENTS.md",
    description: "Repository-specific guidance for coding agents",
  },
] as const;
