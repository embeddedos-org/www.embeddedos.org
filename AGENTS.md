# Repository guidance for coding agents

This repository builds the public website of the Embedded Operating Systems
Research Foundation. Treat this file as practical guidance for automated
contributors; use `README.md`, `package.json`, and the source tree as the
current source of truth when they disagree with older generated documents.

## Architecture

- `client/` is a React 19 single-page application built with Vite. Routes and
  the global `Navbar`/`Footer` shell are declared in `client/src/App.tsx`.
- `scripts/prerender.mjs` renders every static route to `dist/public`. Production
  is served as static files by Apache/cPanel, so a route is not complete unless
  the full build emits its HTML document.
- `server/` provides the local development/test server and tRPC support. Do not
  assume a server process or `/api/trpc` exists in production.
- `shared/` contains data and types used on both sides. Browser-only production
  features such as search and eBot use the checked-in shared data rather than a
  production API.
- `client/public/` is copied into the production bundle. Deployment controls
  such as `.htaccess` and `.cpanel.yml` belong there, not directly on the
  generated `deploy` branch.
- `tests/` contains Vitest unit, integration, security, and performance suites;
  `e2e/` contains Playwright coverage against the production build.
- `docs/wiki/` mirrors the repository wiki for review with source changes. Keep
  mirrored files byte-for-byte identical to their wiki source when refreshing
  them.

## Roles and review

Roles describe responsibilities, not a required number of agents. One person or
agent may cover several roles, but implementation and final approval should be
separate when the workflow allows it.

- **Planner:** preserve acceptance criteria, decompose the work, and track
  dependencies and blockers.
- **Architect:** choose changes that fit the existing static-site architecture
  and record consequential design decisions.
- **Frontend:** implement React UI, routing, responsive behavior, and
  accessibility using the established components and styles.
- **Backend:** maintain the development/test server, PHP production endpoints,
  database code, and shared contracts without assuming the Node server ships.
- **Testing:** add deterministic coverage that fails when the behavior regresses
  and run the applicable verification matrix.
- **Security:** review trust boundaries, input handling, permissions, secrets,
  dependencies, and disclosure-sensitive changes.
- **Performance:** measure bundle, prerender, runtime, or payload impact when a
  change affects a hot path or adds shipped bytes.
- **Documentation:** keep the README, repository guidance, and public community
  resources consistent with actual behavior.
- **Reviewer:** independently inspect requirements, code, tests, and evidence;
  do not approve solely on the implementer's own assessment.
- **Release:** prepare deployment and rollback evidence only when deployment is
  explicitly in scope.

Record active work and handoffs using `TASKS.md` and `ORCHESTRATION.md` when that
process is in use. Do not invent or follow links to absent role files.

## Working rules

- Make source changes on a feature branch based on `master`. Do not edit the
  orphan `deploy` branch or generated `dist/` output by hand.
- Keep changes scoped. Do not rewrite unrelated code, generated assets, or
  repository metadata while implementing a focused request.
- Reuse existing components and data sources. The global navigation shell is in
  `client/src/components/Navbar.tsx` and `client/src/components/Footer.tsx`;
  pages must not render another navbar or footer.
- Add static routes with literal `<Route path="...">` declarations in
  `client/src/App.tsx`, and keep its lazy-page registry consistent. Dynamic
  route construction is not discovered by the prerenderer.
- Preserve client-side navigation scroll behavior in `ScrollToTop`. Hash links
  must retain their targets, and ordinary route changes must open at the top.
- Put facts repeated across pages in the existing shared registries. Foundation
  facts and public account URLs live in `client/src/data/foundation.ts`; stack
  counts come from `shared/stack-data.ts` through `client/src/data/stack.ts`.
- Treat accessibility as behavior: interactive controls need accessible names,
  dialogs need focus management, and external links that open a new tab use
  `target="_blank"` with `rel="noopener noreferrer"`.
- Do not add secrets, credentials, private endpoints, personal data, or
  production records to source, fixtures, logs, or documentation.

## Install, build, and run

The repository pins pnpm in `package.json`. The README documents a local Node
installation for its WSL environment; ensure the required Node and pnpm versions
are available before running commands.

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

`pnpm build` is the deployable build. It runs the client build, prerenderer,
sitemap generation, and server bundle. `pnpm build:client` alone is not a
complete production artifact.

## Verification

Run checks that match the change, and report the exact commands and results.
The normal baseline is:

```bash
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test:unit
pnpm test:integration
```

For user-visible changes, also run the focused Playwright suite after the build:

```bash
pnpm test:functional
pnpm test:smoke
pnpm test:a11y
```

Other useful suites are `pnpm test:security`, `pnpm test:perf`,
`pnpm test:regression`, and `pnpm test:e2e`. `pnpm test:links` is an opt-in,
network- and load-sensitive diagnostic; run it deliberately and report any
instability rather than treating a skipped sweep as a pass.

When adding behavior, add a focused test that fails without the change. Existing
navigation contracts are in `tests/unit/navigation.test.ts` and the Playwright
specs under `e2e/`. Several suites inspect `dist/public`, so rebuild before
running them.

## Pull requests

- Use a GitHub closing keyword for an open issue in this repository, for example
  `Fixes #123`. Cross-repository issue references and plain mentions do not
  satisfy the linked-issue policy.
- Describe user-visible behavior, verification evidence, risk, and rollback.
- Keep documentation and public navigation aligned when adding or moving a
  community resource.
- Never merge, deploy, change repository settings, or publish generated build
  output unless the task explicitly authorizes that operation.
