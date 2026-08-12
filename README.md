# www.embeddedos.org

The public website of the Embedded Operating Systems Research Foundation.

A React single-page application that is **prerendered to static HTML at build
time** — every route ships as a real document with its own `<title>`, meta
description and canonical URL, readable without JavaScript.

**Production has no server process.** The site deploys to cPanel as the static
contents of `dist/public`, served by Apache. There is no `/api/trpc` in
production, and anything that assumes one is broken there even when it works
locally — that is how the careers form silently lost every application it
received, and why eBot and site search now answer entirely in the browser from
`shared/ebot-knowledge.ts` and `shared/site-index.ts`.

The Express + tRPC server in `server/` runs the **development** server and
backs the test suite. Treat any new tRPC procedure as dev-and-test-only unless
the hosting model changes.

---

## Requirements

| Tool    | Version used here | Notes                                                             |
| ------- | ----------------- | ----------------------------------------------------------------- |
| Node.js | 24.19.0           | **Not installed system-wide in this WSL environment** — see below |
| pnpm    | 10.4.1            | Pinned by `packageManager` in `package.json`                      |

Node lives in a local toolchain directory. Put it on `PATH` before running
anything in this repository, in every new shell:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Every command below assumes that has been done. If `pnpm: command not found` is
the first thing you see, this is why.

---

## Quick start

```bash
export PATH="$HOME/.local/node/bin:$PATH"
pnpm install
pnpm dev          # http://localhost:3000 (falls back to the next free port)
```

To run what actually ships — prerendered HTML, real 404s, the storage proxy —
build first and serve the production bundle:

```bash
pnpm build
pnpm start
```

`pnpm build` runs three steps in order, and all three matter:

1. `build:client` — vite builds the SPA into `dist/public`
2. `prerender` — headless Chromium renders all 95 routes to `<route>/index.html`
3. `build:server` — esbuild bundles the API server to `dist/index.js`

Running `pnpm build:client` alone produces a build with **no prerendered
pages**. Never deploy that; see [Deployment](#deployment).

---

## Layout

```
client/          React SPA
  src/pages/     One component per route (97 <Route> declarations in App.tsx,
                 95 of them static and therefore prerendered)
  src/components/  Shared UI; components/ui/ is shadcn/Radix primitives
  public/        Copied verbatim into dist/public — including .htaccess and .cpanel.yml
server/          Express + tRPC API
  _core/         Server bootstrap, auth, storage proxy, vite middleware
  routers.ts     tRPC route definitions
shared/          Types and data used by both sides
scripts/         Build and maintenance tooling (prerender, audits, deploy)
e2e/             Playwright suites
tests/           Vitest suites (unit, integration, security, performance)
drizzle/         Database schema and migrations
dist/            Build output — gitignored, and the source of the deploy branch
```

Governance documents (`CLAUDE.md`, `VERIFY.md`, `TESTING.md`, `SECURITY-STANDARDS.md`,
`AGENTS.md`, …) define how work on this repository is carried out and verified.
`CLAUDE.md` is the entry point and routes to the rest.

---

## Commands

### Build and run

| Command                             | Does                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| `pnpm dev`                          | Development server with HMR                             |
| `pnpm build`                        | Full production build: client → prerender → server      |
| `pnpm build:client`                 | Client only — **no prerendering**, not deployable alone |
| `pnpm prerender`                    | Re-run prerendering against an existing `dist/public`   |
| `pnpm start`                        | Serve the production build                              |
| `pnpm check`                        | TypeScript, no emit                                     |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                                  |
| `pnpm format` / `pnpm format:check` | Prettier                                                |

### Tests

| Command                 | Covers                                                       |
| ----------------------- | ------------------------------------------------------------ |
| `pnpm test`             | All vitest suites (unit, integration, security, performance) |
| `pnpm test:unit`        | `tests/unit`                                                 |
| `pnpm test:integration` | `tests/integration`                                          |
| `pnpm test:security`    | `tests/security`                                             |
| `pnpm test:perf`        | `tests/performance` — payload budgets                        |
| `pnpm test:e2e`         | Every Playwright suite                                       |
| `pnpm test:smoke`       | `e2e/smoke.spec.ts`                                          |
| `pnpm test:regression`  | `e2e/regression.spec.ts` — one guard per fixed defect        |
| `pnpm test:a11y`        | `e2e/ui-ux.spec.ts` — axe accessibility checks               |
| `pnpm test:journeys`    | Navigation journeys, link and control sweeps                 |
| `pnpm test:controls`    | Clicks every in-page control on every route                  |
| `pnpm test:links`       | On-demand: clicks every internal link, checks where it lands |
| `pnpm test:functional`  | `e2e/functional.spec.ts`                                     |
| `pnpm test:acceptance`  | Google Ad Grants policy criteria                             |
| `pnpm test:server`      | `server/**` tRPC router tests                                |
| `pnpm test:all`         | check → lint → build → test → audits → e2e                   |

Three suites cover controls, and the differences matter — each catches what the
one before it cannot:

- `test:journeys` reads the **built HTML** and proves each of the ~9,000
  anchors resolves and each of the ~1,100 buttons carries an accessible name.
  It presses nothing.
- `test:controls` **clicks** every one of the ~340 in-page controls across all
  95 routes, plus the header and footer controls on a sample, and fails on any
  uncaught exception or console error. A control can pass the first suite and
  still throw on click.
- `test:links` clicks each of the ~320 unique internal links **from the bottom
  of its page** and asserts two things the others never check: that it lands on
  the route its href names, and that the page opens at the top.

`test:links` is **opt-in and skipped by `pnpm test:e2e`**, which is why it
needs its own command. It performs ~320 real navigations and proved sensitive
to machine load in a way the rest of the suite is not: under parallel workers a
different page each run reported resting a few hundred pixels down, and none of
it reproduced — twelve controlled navigations from the worst offender measured
y=0 every time, and none of the implicated pages contains scrolling, focus or
iframe code that could explain it. A check that fails one test in eighty for
reasons outside the code teaches people to ignore red, so it is a diagnostic
rather than a gate. The defects it originally found are guarded deterministically
by the scroll tests in `regression.spec.ts`, which fail when the fix is removed.

Run it before a release, and read a failure as "look at this", not "this is broken".

The Playwright suites run against the **production build**, and
`playwright.config.ts` starts `dist/index.js` for them. Run `pnpm build` first,
or the suite tests a stale build. Several tests read `dist/public` directly.

### Audits

| Command                | Does                                          |
| ---------------------- | --------------------------------------------- |
| `pnpm audit:site`      | Crawls the built site for structural problems |
| `pnpm audit:mobile`    | Mobile-viewport audit                         |
| `pnpm optimize:images` | Re-encodes images in `client/public`          |
| `pnpm sync:stack`      | Refreshes generated stack data                |

---

## Deployment

The site is hosted on **cPanel**, served by Apache as static files, and updated
through cPanel's Git Version Control feature.

### How the `deploy` branch works

`deploy` is an **orphan branch** — it shares no history with `master` — whose
root is exactly the contents of `dist/public`. It holds build output, not
source. Its commits read `deploy: rebuild from master <sha>`, which is the only
link back to the source they were built from.

```
master   ──●──●──●──●   source
                  │
                  │  pnpm build  →  dist/public
                  ▼
deploy   ──●──●──●       built site, root = dist/public
                  │
                  ▼  cPanel: Update from Remote → Deploy HEAD Commit
             public_html/
```

Two files make this work, and both live in `client/public/` so that **vite
copies them into every build**:

- **`.htaccess`** — `Options -Indexes` and `ErrorDocument 404 /404.html`.
  Deliberately **no SPA rewrite**: the prerenderer writes every route to
  `<route>/index.html`, so Apache's ordinary file resolution already serves
  them. A blanket rewrite to `/index.html` answers unknown URLs with HTTP 200
  and the homepage — a soft 404 that search engines index as a real page.
- **`.cpanel.yml`** — the tasks cPanel runs on deploy. It copies `*` plus
  `.htaccess` by name, because the `*` glob skips dotfiles. There is no delete
  step: overwriting is safe, emptying a directory is not.

They live in `client/public/` rather than being committed to `deploy` directly
because that was tried and it failed — a file added to the deploy branch by hand
is deleted by the next rebuild, which is exactly how `.htaccess` once went
missing from production. `tests/integration/deploy-config.test.ts` asserts both
files reach `dist/public` and that the rules inside them are still correct.

### Deploying

```bash
export PATH="$HOME/.local/node/bin:$PATH"

# 1. Everything must be green and committed first.
pnpm test:all
git status --porcelain          # must be empty

# 2. Build, then publish the build to the deploy branch.
pnpm build
pnpm deploy:branch              # commits to deploy, does NOT push
git log deploy -1 --stat        # review what is about to ship
pnpm deploy:branch --push       # or: git push origin deploy
```

`scripts/deploy-branch.mjs` does the mechanical part through a throwaway git
worktree, so the checkout you are working in is never switched to `deploy`
mid-run. It refuses to proceed if:

- there is no build in `dist/public`;
- fewer than 50 routes were prerendered (i.e. `build:client` was run without
  `prerender`);
- `.htaccess` or `.cpanel.yml` is missing from the build;
- the working tree is dirty, which would make the recorded source sha a lie.

It replaces the branch contents wholesale, so superseded content-hashed bundles
are pruned from the branch rather than accumulating.

**Pushing is not deploying.** cPanel does not act on a push. Finish in the
cPanel UI:

> Git Version Control → Manage (for this repository) → **Update from Remote**,
> then **Deploy HEAD Commit**.

`DEPLOYPATH` in `.cpanel.yml` is `$HOME/public_html`. Change it if this domain's
document root is elsewhere — an addon domain or subdomain has its own directory.

### Rolling back

The deploy branch is an ordinary branch, so a rollback is a revert plus another
deploy:

```bash
git checkout deploy
git revert --no-edit HEAD        # or: git reset --hard <known-good-sha>
git push origin deploy           # --force-with-lease if you reset
# then in cPanel: Update from Remote → Deploy HEAD Commit
```

Because `.cpanel.yml` has no delete step, files removed in a later build are
**not** removed from the document root by deploying an earlier commit. Files
that must genuinely disappear from production have to be deleted on the server.

---

## Environment variables

There is no `.env.example` in the repository. The following are the variables
referenced in the source; the site builds and serves its static content without
them, but the API features that use them are inert when unset.

| Variable                                           | Used for                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
| `PORT`                                             | Server port (default 3000; the server scans forward for a free one)             |
| `NODE_ENV`                                         | `development` / `production`                                                    |
| `DATABASE_URL`                                     | MySQL connection for drizzle                                                    |
| `JWT_SECRET`                                       | Cookie/session signing                                                          |
| `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `VITE_APP_ID` | OAuth integration                                                               |
| `STRIPE_SECRET_KEY`                                | Donations                                                                       |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Outbound email                                                                  |
| `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Legacy LLM backend — **unused**, eBot answers in the browser                    |
| `SITE_ORIGIN`                                      | Canonical origin used by the prerenderer (default `https://www.embeddedos.org`) |
| `PRERENDER_PORT`, `PRERENDER_CONCURRENCY`          | Prerender tuning                                                                |
| `E2E_PORT`                                         | Port Playwright's server uses (default 42200)                                   |

Database schema changes go through `pnpm db:push` (drizzle-kit generate +
migrate).

---

## Notes for contributors

- **Do not render `<Navbar />` or `<Footer />` inside a page.** `App.tsx`
  renders both around `<main>` for the whole application. A page that adds its
  own produces a second `position: fixed; z-50` header which, being later in the
  DOM, silently swallows every click aimed at the real one. This shipped once
  and disabled the navigation on all 13 product pages and `/patents`.
  `e2e/links-and-controls.spec.ts` now fails the build if it recurs.
- **Every route needs a prerendered page.** Routes are discovered from the
  literal `<Route path="...">` strings in `App.tsx`; anything dynamic is skipped
  and will 404 on the static host. `tests/integration/deploy-config.test.ts`
  checks each discovered route has a file.
- **Never hand-write a stack figure.** Board counts, platform counts, repo
  counts and architecture counts come from `shared/stack-data.ts` via
  `client/src/data/stack.ts` — import the constant, do not type the number.
  Hand-written figures have drifted twice: "52+" survived on seventeen pages,
  and after that purge "63+" survived on nineteen more, describing EoSim's
  150 simulated _platforms_ as 63 _boards_ and colliding with the kernel's 83
  board definitions. `tests/integration/stack-claims.test.ts` scans every built
  page and fails if a retired figure reappears. `/news` is exempt: its posts
  are dated announcements, and rewriting one revises the record rather than
  correcting a claim.
- **`<head>` is stamped twice, by two implementations that must agree.**
  `scripts/prerender.mjs` writes it at build time; `client/src/lib/page-meta.ts`
  rewrites it after a client-side navigation, because wouter swaps the page
  without touching `<head>` and the canonical URL would otherwise keep naming
  the first page visited. The build script cannot be imported into the bundle
  (it pulls in playwright and express), so the logic is deliberately duplicated
  and `tests/unit/page-meta.test.ts` asserts the two agree.
- **A route change must reset the scroll position.** wouter swaps the page
  component and leaves the viewport alone, so a link followed from the footer
  opened the next page already scrolled down — the browser clamps the old
  offset to the new document's height. `ScrollToTop` in `App.tsx` handles it,
  and three cases are easy to get wrong: the jump must be `behavior: "instant"`
  because `index.css` sets `scroll-behavior: smooth` for in-page anchors; a
  link to the route **already open** produces no location change at all, so it
  needs a capture-phase click listener (wouter's `Link` calls `preventDefault`,
  which makes a bubble-phase listener useless); and a `#hash` target must win
  over the jump to the top.
- **Never call `scrollIntoView` to follow a list.** It scrolls _every_ ancestor
  scroll container, including the document. `/demo` auto-scrolled its simulator
  log that way and the effect ran on mount, so opening the page dropped the
  visitor below the heading. Set the container's own `scrollTop` instead.
- **A modal must take focus.** The donate dialog shipped with
  `aria-modal="true"` and focus left on `<body>`, so one Tab reached the
  navigation behind the overlay. If you add an overlay, move focus into it,
  trap Tab, restore focus on close, and close on Escape.
- **`flex-1` without `min-w-0` overflows on a phone.** A flex item defaults to
  `min-width: auto`, so a code block or long string inside sizes the item to its
  content and pushes the document wider than the viewport. Six pages shipped
  this way. Wide tables need their own `overflow-x-auto` wrapper for the same
  reason.
- **framer-motion cannot tween an SVG `d` attribute.** It emits
  `d="undefined"` mid-tween. Animate a transform instead. An entry animation
  that starts at `x: ±20` also overflows a 375px viewport until it settles —
  clip the section.
- Payload budgets are enforced in `tests/performance/budgets.test.ts`; adding a
  large eager import will fail the suite rather than quietly regress the site.

---

## Licence

MIT. See [SECURITY.md](./SECURITY.md) for the vulnerability disclosure policy.
