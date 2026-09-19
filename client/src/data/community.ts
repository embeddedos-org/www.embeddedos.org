// NOTE (Ad Grants link-integrity, 2026-09-19): the entries that pointed at
// github.com/embeddedos-org/www.embeddedos.org (Wiki, Issues, AGENTS.md) were
// removed. That repository is private, so those links 404 for every public
// visitor — including an Ad Grants website review — and there is no public
// equivalent to repoint them at. They live on in git history if the repo ever
// goes public.
export const COMMUNITY_LINKS = [
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
    name: "Projects",
    href: "https://github.com/orgs/embeddedos-org/projects",
    description: "Organization planning and delivery boards",
  },
] as const;
