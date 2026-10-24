<!-- generated: eos-ai-scaffold -->

# Tasks

Working ledger for `www.embeddedos.org`. The planner writes entries; each owning role
updates its own row. Roles are in [AGENTS.md](./AGENTS.md), the workflow in
[ORCHESTRATION.md](./ORCHESTRATION.md), the gate in [VERIFY.md](./VERIFY.md).

Status is one of: `todo`, `in-progress`, `blocked`, `review`, `done`.

## Active

| ID         | Task                                                        | Owner    | Mode           | Status | Depends on         |
| ---------- | ----------------------------------------------------------- | -------- | -------------- | ------ | ------------------ |
| EOS-BOARDS | Resume original-board catalogue and booking page            | Frontend | Implementation | done   | —                  |
| BOOK-GCAL  | `/book` on the owner's Google Calendar appointment schedule | Frontend | Implementation | review | Independent review |

EOS-BOARDS was merged as PR #94 on 2026-10-23 (`ca73d62d` on master). The
notes below are its record as it stood then; its calendar and booking notices
are replaced by BOOK-GCAL, further down.

Acceptance criteria from the handoff:

- "add batch 2's 8 boards to `/eos-boards` (it shows 7), with links to master."
- "the privacy page must mention Calendly before launch."
- The owner asked to create the Calendly event. Create the 30-minute team event,
  with topic as the first custom question, using the connected account; retain
  email fallback until its real URL and host configuration are verified.

Verification: type check, lint, format, build, Vitest and security, SEO and
sitemap; smoke, accessibility and functional suites with one worker; inspect
desktop/mobile previews; independent review before publication.

Progress on 2026-10-15: the catalogue now contains all 15 merged boards, with
master links, pinned check results and optimized media. Calendly processing is
disclosed in Privacy. The booking notice limiter now locks the whole
read/check/write operation and fails closed; the external booking link preserves
the chosen topic. Independent review cleared both fixes and verified the board
checks and media against upstream commit `28ec996`. A mutation back to the old
limiter was rejected: 8 admissions and 1 stored timestamp instead of 5.

Owner's decision on 2026-10-20: open the pull request now, with `/book` on its
contact-form fallback. `CALENDLY_EVENT_URL` stays `null` and no booking URL is
invented; the Calendly event comes later, in a follow-up, once Calendly access
exists. Until then the email fallback is the page's only booking path.

Progress on 2026-10-20: each board offers its native KiCad schematic and PCB and
its full licence, byte-identical to eCAD-Hardware-Products master (`6ac37a17`).
The README's licence section names those files as all rights reserved
(`50b84a6a`). Without an event URL, `/book` now promises only what the fallback
does and keeps the topic's own case (`24eda785`). Review round 3 (`b34afe7c` to
`9eb25678`): the footer, Terms of Use §3 (effective date now 20 October 2026),
`/get-involved`, `/ecad-hardware` and `/about` carve the EoS boards out of their
MIT and open-hardware statements, and `booking.php` is off by default (503, no
mail) until the Calendly event exists.

Progress on 2026-10-23: the owner created the Calendly event.
`CALENDLY_EVENT_URL` is `https://calendly.com/kartikeydheer-embeddedos/30min`, so
`/book` embeds the live calendar, and `booking.php`'s notices are on with it, to
both inboxes. The endpoint still checks only the Origin header, the shape of the
Calendly identifiers, the page path and 5 requests an hour per address; it
cannot confirm a booking with Calendly. The owner should confirm in Calendly
that the event's first custom question is the topic (the page prefills it as
`a1`); that cannot be checked from the repository.

| Verification at `a8426546` (2026-10-23)               | Result                                                                                                                                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type check, lint and format                           | PASS; ESLint 0 errors and 22 existing warnings                                                                                                                                                                                              |
| Production build                                      | PASS, 139/139 routes, no failed/thin/degraded/error-boundary pages; tree clean after the build                                                                                                                                              |
| Full Vitest                                           | 1,101 passed, 8 skipped, 1 failed: the dependency audit below                                                                                                                                                                               |
| Security suite                                        | FAIL, 20 of 21: `pnpm audit --prod` now reports 1 critical and 3 high advisories (dompurify 3.4.13 via streamdown and mermaid; follow-redirects 1.16.0 via axios). `pnpm-lock.yaml` is identical to master, so this is not from this branch |
| SEO and sitemap                                       | PASS, 0 SEO errors/warnings; 138 sitemap URLs                                                                                                                                                                                               |
| Playwright smoke, accessibility and functional suites | PASS, 16, 88 and 16 tests, one worker, Google hosts blocked (www.recaptcha.net, called by the Calendly frame, only from the independent re-run on; same counts)                                                                             |
| Native PHP 8.4.26                                     | PASS, 316 assertions (booking 149, both switch states)                                                                                                                                                                                      |
| Board files                                           | PASS, all 45 CAD and licence files byte-identical to eCAD-Hardware-Products master `e3ede5e`                                                                                                                                                |
| Visual checks                                         | PASS for the catalogue, downloads, live calendar on `/book` and footer at 1440 px and 375 px; no overflow or page errors                                                                                                                    |

No real booking, Calendly email or notice delivery has been made or verified, and
nothing is deployed.

### BOOK-GCAL

Acceptance criteria from the owner, verbatim: "use this link to add into
website, not your calendar", with these links:

- Booking page (short link): https://calendar.app.google/PPzWao4AzvXtZeva6
- Embed URL: https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=?gv=true

From the brief: embed the schedule in an iframe with the site's own link to the
booking page (new tab, `rel="noopener"`), and do not load Google's
`scheduling-button-script.js` or its stylesheet.

Done on 2026-10-24 (branch `feat/book-google-calendar`): `/book` frames the
schedule from `GOOGLE_APPOINTMENTS_EMBED_URL` and links
`GOOGLE_BOOKING_PAGE_URL` (both in `client/src/data/foundation.ts`, validated
in `client/src/lib/booking.ts`). The topics are guidance ("mention your topic in
the booking form"), because Google's embed takes no prefill, and the steps are
a guide, because the frame reports no booking; the confirmed panel is gone. The
CSP frames `https://calendar.google.com` only and drops the old calendar's
hosts. The Privacy page describes Google Calendar instead (effective date 24
October 2026). The site's own booking notices are removed;
`client/public/api/booking.php` stays only as a 410 tombstone, because the
cPanel deploy never deletes files.

Open, for the owner (not checkable from the repository): the schedule must
offer 30-minute slots with a video link, and its booking form needs an item for
the topic; after the next deploy, delete `public_html/api/booking.php` on the
server, then the tombstone. No browser in this work loaded Google's page, so
the embed is unverified against Google itself, and no real booking has been
made.

| Verification on 2026-10-24                  | Result                                                                                                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type check, lint (changed files) and format | PASS                                                                                                                                                                                  |
| Production build (`www-build.sh`)           | PASS, 139/139 routes, 0 failed/thin/degraded/error-boundary; Google DNS-blocked in the prerender                                                                                      |
| Full Vitest, one worker                     | 1,091 passed, 8 skipped, 1 failed: the dependency audit (zod, body-parser: 2 high), pre-existing; `pnpm-lock.yaml` is unchanged                                                       |
| Booking tests                               | PASS, 64; 9 mutations (CSP, lazy loading, prerender guard, timeout, URL checks, the tombstone) each fail them                                                                         |
| Playwright smoke and UI/UX, one worker      | 110 passed, 2 failed: the `/getting-started` delivery-path axe check (colour contrast), which fails the same way on the master build; every `/book` test passes on desktop and mobile |
| Native PHP                                  | NOT RUN, PHP is not installed here; the booking PHP test is removed and the tombstone is checked statically                                                                           |

## Completed

| ID    | Task                                                                                                                                                                                                                                                      | Owner    | Verified by                           | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-001 | Mission & scope and nonprofit transparency for the Google Ad Grants website policy                                                                                                                                                                        | frontend | acceptance + a11y + audits            | `pnpm check` PASS · `pnpm test` 321/321 PASS · `pnpm test:e2e` 118/118 PASS (incl. 28 Ad Grants acceptance criteria) · `pnpm audit:site` 0 failures · `pnpm audit:mobile` 25 routes, no overflow. Open items in [docs/unverified-claims.md](./docs/unverified-claims.md); mailing address still unpublished.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| T-002 | Full-site link check ("does every link work") and mobile-compatibility check, requested directly by Aswin after a second Google Ad Grants rejection                                                                                                       | frontend | e2e + audits, full build              | Full `pnpm build` (132/132 routes prerendered, 0 thin, 0 degraded) at master `d687923`. `pnpm audit:site` — 0 failures, 0 dup titles/descriptions, 0 warnings across 132 pages. `e2e/links-and-controls.spec.ts` 10/10 PASS — every internal link target resolves non-4xx/5xx across all 132 pages, no placeholder anchors, unknown URL returns real 404, no nameless buttons/links, no duplicate chrome, navbar clickable. `pnpm test:links` (full click-through destination sweep, `--workers=2`) — 117/119 PASS; the 2 failures reproduce this suite's own documented flakes verbatim (`/` — scroll-settle timing under parallel workers; `/ecad-hardware` — an in-motion element intercepting a click, the page this suite's own comments already name as its worst offender) — neither recorded a wrong-destination result. `pnpm audit:mobile` (26 routes, iPhone-SE viewport) — 0 horizontal overflow, 0 sub-12px text, 0 first-party console errors, 0 first-party failed requests; `/donate` renders 3 donation controls with tax-deductible language, EIN and amount presets. Secondary, non-gating finding: every sampled route has 2-16 tap targets under Lighthouse's 24px floor (mostly 16px-tall footer text links); the project's own audit script tracks but does not fail on this. External links (94 unique `http(s)` targets, mostly `github.com/embeddedos-org/*`, plus IRS/social/license/quantum-library pages, and 23 `mailto:` addresses) could **not** be independently verified from this sandbox — its egress proxy blocks generic web fetches outright (even `api.github.com` came back 403/blocked), a sandbox limitation rather than a finding about the site. Playwright's own bundled Chromium download is also blocked here (`cdn.playwright.dev` not on the proxy allowlist), so this run reused the outer sandbox's pre-installed Chromium via a temporary, uncommitted `PW_CHROMIUM_PATH` env override in three files, reverted before finishing — not part of the repo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
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
