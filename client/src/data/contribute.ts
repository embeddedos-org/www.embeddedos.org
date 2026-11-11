/**
 * Content for `/contribute`: how architecture decisions are reached, how to
 * submit a pull request, the pull request template, and review targets.
 *
 * Per-package entry points. Every package gets a stable anchor on
 * `/contribute`, and other pages link to it through `contributeHref()`, never
 * by typing the URL. When a package later gets its own contribute page, change
 * `contributeHref()` for that package and every link follows. Nothing else has
 * to be edited.
 *
 * No meeting schedule is published here because none is recorded: the TSC
 * "meets on a published cycle" (`/organization`), and times are announced in
 * GitHub Discussions. Do not add a day or time without a source for it.
 */
import { SOCIAL_URLS } from "./foundation";
import { STACK } from "./stack";

export const CONTRIBUTE_PATH = "/contribute";

/**
 * Repositories that answer 404 to the public. See the `repositories` note in
 * `shared/stack-data.ts`. Linking one from a public page is a broken link.
 */
const PRIVATE_REPOS = new Set([
  "embeddedos-org/www.embeddedos.org",
  "embeddedos-org/eVera",
]);

/**
 * The fragment id of a package's entry on `/contribute`.
 *
 * @param name - The package name as written in `STACK.projects`.
 * @returns A lowercase id of letters, digits and single hyphens.
 * @example packageAnchor("eBoot") // "pkg-eboot"
 * @example packageAnchor("embeddedos-org.github.io") // "pkg-embeddedos-org-github-io"
 */
export function packageAnchor(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `pkg-${slug}`;
}

/**
 * Where to send a reader who wants to contribute to one package.
 *
 * @param name - The package name as written in `STACK.projects`.
 * @returns The package's entry on `/contribute`.
 * @example contributeHref("eBoot") // "/contribute#pkg-eboot"
 */
export function contributeHref(name: string): string {
  return `${CONTRIBUTE_PATH}#${packageAnchor(name)}`;
}

/** The public packages, in `STACK.projects` order, with where to contribute. */
export const CONTRIBUTE_PACKAGES = STACK.projects
  .filter(p => !PRIVATE_REPOS.has(p.repo))
  .map(p => ({
    name: p.name,
    area: STACK.tiers[String(p.tier) as keyof typeof STACK.tiers],
    anchor: packageAnchor(p.name),
    repoUrl: `https://github.com/${p.repo}`,
  }));

/**
 * What needs a Technical Steering Committee decision before merge. These are
 * the architecture items from the TSC's remit on `/organization`.
 */
export const ARCHITECTURE_REVIEW_TRIGGERS = [
  "The change crosses component boundaries, for example a new interface between eBoot and the kernel.",
  "The change adds a component to, or removes one from, the supported platform.",
  "The change alters or deprecates a public interface that other components or users depend on.",
];

/** How a topic reaches the TSC, in order. */
export const ARCHITECTURE_STEPS = [
  {
    title: "Open an RFC in GitHub Discussions",
    desc: "Describe the problem, the proposed design, the alternatives you rejected, and which components it touches.",
  },
  {
    title: "Discuss it in public",
    desc: "Maintainers and working groups comment on the thread. Proposals that cross areas are escalated to the TSC.",
  },
  {
    title: "TSC decision",
    desc: "The TSC takes the RFC at its next meeting. Meeting times and agendas are announced in GitHub Discussions, and every decision is recorded on the RFC thread.",
  },
  {
    title: "Link the decision from your pull request",
    desc: "Fill in the Architecture impact section of the pull request template with the RFC and decision links.",
  },
];

export const DISCUSSIONS_URL = SOCIAL_URLS.discussions;

/** Submitting a pull request, in order. */
export const PR_STEPS = [
  {
    title: "Find or open an issue",
    desc: "Every pull request closes an issue in the same repository. Comment on the issue to say you are working on it.",
  },
  {
    title: "Check for architecture impact",
    desc: "If the change meets any architecture review condition above, open the RFC first and wait for the TSC decision.",
  },
  {
    title: "Fork and branch",
    desc: "Fork the repository and work on a branch. Keep the change to one purpose so it can be reviewed and reverted on its own.",
  },
  {
    title: "Test it",
    desc: "Run the repository's checks and tests, and add tests for new behaviour. Record the exact commands and results.",
  },
  {
    title: "Open the pull request",
    desc: "Fill in every section of the template, including Fixes #<issue>. Attach screenshots when the change is visible.",
  },
  {
    title: "Respond to review",
    desc: "Answer each comment, push fixes to the same branch, and ask for re-review. A maintainer of the repository merges it.",
  },
];

/** Review targets. These are targets, not guarantees. */
export const REVIEW_TARGETS = [
  {
    stage: "First maintainer response on a pull request",
    target: "Within 5 business days",
  },
  {
    stage: "TSC decision on an architecture RFC",
    target: "Within 10 business days of the RFC being raised",
  },
];

/**
 * A copy of `.github/PULL_REQUEST_TEMPLATE.md`, shown on the page.
 *
 * It is a copy because the dev server denies every dotfile path
 * (`server.fs.deny` in vite.config.ts), so the page cannot import the file
 * itself. tests/unit/contribute.test.tsx fails if the two differ.
 */
export const PR_TEMPLATE = `## Closing issue

<!-- Required for human-authored pull requests. Use a GitHub closing keyword and an issue in THIS repository. Cross-repository links, plain mentions, and placeholders do not satisfy policy. -->

Fixes #<same-repository issue number>

> Replace the placeholder above with a real issue number before requesting review. The exact trusted automation identities defined by the organization policy are exempt.

## Summary

<!-- Briefly explain what changed and why. -->

## Type of change

<!-- Check all that apply. -->

- [ ] feat - New feature or content
- [ ] fix - Bug fix
- [ ] docs - Documentation only
- [ ] style - Formatting with no behavior change
- [ ] refactor - Restructuring without a behavior change
- [ ] test - Add or fix tests
- [ ] build - Build system or dependency change
- [ ] ci - CI/CD pipeline change
- [ ] chore - Maintenance or housekeeping

## Changes

<!-- List the concrete changes made in this pull request. -->

-

## Architecture impact

<!-- A change that crosses component boundaries, changes which components are part of the supported platform, or changes or deprecates a public interface needs a Technical Steering Committee decision before merge. See https://www.embeddedos.org/contribute/#architecture-review -->

- [ ] None. The change stays inside one component and changes no public interface.
- [ ] Architecture review needed. RFC discussion: <link>. TSC decision: <link>.

## Validation

<!-- List exact commands or manual checks and their results. -->

- [ ] \`pnpm check\`, \`pnpm lint\`, and \`pnpm format:check\` pass.
- [ ] \`pnpm build\` succeeds and relevant Vitest/Playwright suites pass.
- [ ] Links, prerendered routes, and responsive UI were checked when site behavior changed.
- [ ] No secrets, credentials, internal hostnames, or production data are included.
- [ ] User-facing and contributor documentation is updated when behavior changes.

## Risk and rollout

<!-- Describe compatibility concerns, deployment impact, and rollback. Write "None" only when genuinely not applicable. -->

## Screenshots or logs

<!-- Add screenshots or relevant output when the change affects the rendered site. -->

## Additional notes

<!-- Add any other context reviewers should know. -->
`;
