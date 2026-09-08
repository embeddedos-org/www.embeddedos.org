<!-- generated: eos-ai-scaffold -->

# Tasks

Working ledger for `www.embeddedos.org`. The planner writes entries; each owning role
updates its own row. Roles are in [AGENTS.md](./AGENTS.md), the workflow in
[ORCHESTRATION.md](./ORCHESTRATION.md), the gate in [VERIFY.md](./VERIFY.md).

Status is one of: `todo`, `in-progress`, `blocked`, `review`, `done`.

## Active

| ID  | Task             | Owner | Mode | Status | Depends on |
| --- | ---------------- | ----- | ---- | ------ | ---------- |
| —   | No active tasks. | —     | —    | —      | —          |

## Completed

| ID    | Task                                                                                                                                                | Owner    | Verified by                | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-001 | Mission & scope and nonprofit transparency for the Google Ad Grants website policy                                                                  | frontend | acceptance + a11y + audits | `pnpm check` PASS · `pnpm test` 321/321 PASS · `pnpm test:e2e` 118/118 PASS (incl. 28 Ad Grants acceptance criteria) · `pnpm audit:site` 0 failures · `pnpm audit:mobile` 25 routes, no overflow. Open items in [docs/unverified-claims.md](./docs/unverified-claims.md); mailing address still unpublished.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| T-002 | Full-site link check ("does every link work") and mobile-compatibility check, requested directly by Aswin after a second Google Ad Grants rejection | frontend | e2e + audits, full build   | Full `pnpm build` (132/132 routes prerendered, 0 thin, 0 degraded) at master `d687923`. `pnpm audit:site` — 0 failures, 0 dup titles/descriptions, 0 warnings across 132 pages. `e2e/links-and-controls.spec.ts` 10/10 PASS — every internal link target resolves non-4xx/5xx across all 132 pages, no placeholder anchors, unknown URL returns real 404, no nameless buttons/links, no duplicate chrome, navbar clickable. `pnpm test:links` (full click-through destination sweep, `--workers=2`) — 117/119 PASS; the 2 failures reproduce this suite's own documented flakes verbatim (`/` — scroll-settle timing under parallel workers; `/ecad-hardware` — an in-motion element intercepting a click, the page this suite's own comments already name as its worst offender) — neither recorded a wrong-destination result. `pnpm audit:mobile` (26 routes, iPhone-SE viewport) — 0 horizontal overflow, 0 sub-12px text, 0 first-party console errors, 0 first-party failed requests; `/donate` renders 3 donation controls with tax-deductible language, EIN and amount presets. Secondary, non-gating finding: every sampled route has 2-16 tap targets under Lighthouse's 24px floor (mostly 16px-tall footer text links); the project's own audit script tracks but does not fail on this. External links (94 unique `http(s)` targets, mostly `github.com/embeddedos-org/*`, plus IRS/social/license/quantum-library pages, and 23 `mailto:` addresses) could **not** be independently verified from this sandbox — its egress proxy blocks generic web fetches outright (even `api.github.com` came back 403/blocked), a sandbox limitation rather than a finding about the site. Playwright's own bundled Chromium download is also blocked here (`cdn.playwright.dev` not on the proxy allowlist), so this run reused the outer sandbox's pre-installed Chromium via a temporary, uncommitted `PW_CHROMIUM_PATH` env override in three files, reverted before finishing — not part of the repo. |
| T-003 | Sitewide mailto→form conversion ("no email needs to be listed in the site, everything can be in the backend" — Aswin, scope confirmed as "Everything sitewide") plus the T-002 mobile tap-target follow-up ("also fix the identified things for the www") | frontend | unit + php + e2e + audits, full build | New `client/public/api/contact.php` (10 topic inboxes, header-injection guards, rate limiting, honeypot — mirrors the production-proven `apply.php` pattern) verified by new `tests/php/contact.test.php`, 73/73 assertions PASS (`pnpm test:php` — 57 (apply) + 73 (contact) = 130/130 PASS). New `ContactFormModal.tsx` (matches `DonateModal.tsx`'s shell/focus-trap pattern) wired sitewide via a centralized `openContactForm()` helper (`client/src/lib/contact-form.ts`), replacing all ~25 `mailto:`/visible-address sites across the app (Contact, Careers, Membership, Footer, EBot, ebot-knowledge, FAQ, Security, Privacy, Terms, categories.ts, and more) with a form trigger; no page prints a declared `@embeddedos.org` address or a `mailto:` link outside two named, reviewed exceptions (the Careers apply-fallback mechanism, and EOffice's fictional demo mockup) — now locked in by two new tests in `tests/unit/foundation-facts.test.ts` ("prints no address anywhere except its one declared home", "writes mailto: only inside the one fallback that still needs it"). Mobile tap-target fixes: `WhatWeDo.tsx` card CTAs and `Footer.tsx`'s `FooterLink` "eAI"/"eNI" labels raised to the 24px Lighthouse floor; inline-prose links correctly left untouched (WCAG 2.5.8 exemption). `pnpm check` PASS (tsc clean). `pnpm test:unit` — 224 passed, 1 skipped (225), 0 failed, across 15 files including the two new invariant tests. `pnpm format:check` PASS. Full `pnpm build` — 132/132 routes prerendered, 0 failed/thin/degraded. `pnpm audit:site` — 0 failures, 0 dup titles/descriptions, 0 warnings across 132 pages. `pnpm audit:mobile` (26 routes, iPhone-SE) — 0 horizontal overflow, 0 sub-12px text, 0 first-party console/request errors; tap-target counts now 0 on `/what-we-do` and every previously-flagged card-CTA route, with only WCAG-exempt inline links remaining on a few pages. `pnpm test:e2e` (controls-interaction, journeys, links-and-controls, link-destinations) — 152 passed, 119 skipped (link-destinations is opt-in via `LINK_SWEEP=1`, correctly skipped), 0 failed — confirms none of the `<a>`→`<button>` conversions broke link resolution, accessible naming, or navigation. As with T-002, this sandbox's own Playwright Chromium download is blocked, so build/audit/e2e reused the outer sandbox's pre-installed Chromium via a temporary, uncommitted `PW_CHROMIUM_PATH` override in three files, reverted (`git checkout --`) before finishing — not part of the repo. **Open, not decided here:** the JSON-LD `"email"` field in `client/index.html`'s structured data (crawler-only, added 2026-08-08 for Google Ad Grants reviewer legitimacy per `MEMORY.md`) still contains a literal address; whether "no email needs to be listed" extends to that machine-readable field is left for Aswin — the new foundation-facts test explicitly exempts this one file with a comment naming the tradeoff rather than deciding it. |

---

## Task template

```markdown
### T-000 — <short title>

Owner: <role>
Mode: <see MODES.md>
Status: todo
Depends on: <task ids, or none>

Goal
: <one sentence: what is true afterwards that is not true now>

Acceptance criteria
: - <observable, checkable statement>

- <observable, checkable statement>

Files in scope
: <paths the owner is expected to touch>

Out of scope
: <what this task deliberately does not change>

Risks
: <what could break, and what would reveal it>

Verification
: | Check | Command | Result |
|-------|---------|--------|
| <name> | `<command>` | `NOT RUN` |
```

## Verification commands for this repository

These commands were derived from the manifests at the repository root. Confirm one works before relying on it; a listed script may still be a stub.

| Check             | Command                 | Default state |
| ----------------- | ----------------------- | ------------- |
| Type check        | `pnpm check`            | `NOT RUN`     |
| Format            | `pnpm format`           | `NOT RUN`     |
| Unit tests        | `pnpm test:unit`        | `NOT RUN`     |
| Integration tests | `pnpm test:integration` | `NOT RUN`     |
| End-to-end tests  | `pnpm test:e2e`         | `NOT RUN`     |
| Build             | `pnpm build`            | `NOT RUN`     |
| Accessibility     | `pnpm test:a11y`        | `NOT RUN`     |
| Performance       | `pnpm test:perf`        | `NOT RUN`     |
| Security          | `pnpm test:security`    | `NOT RUN`     |

## Rules

- One task per unit of work that can be verified on its own.
- Acceptance criteria are written before work starts and are not edited to match
  what was built. If they were wrong, say so and rewrite them explicitly.
- A task reaches `done` only when the definition of done in
  [ORCHESTRATION.md](./ORCHESTRATION.md) is met and the verification commands
  were actually run.
- `blocked` requires a note naming what it is blocked on and who can unblock it.
