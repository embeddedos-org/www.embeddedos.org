<!-- generated: eos-ai-scaffold -->
# Memory

Durable context for `www.embeddedos.org` — decisions and constraints that outlive one
session and are not recoverable from the code or the git history.

Write here when a future reader would otherwise repeat an argument that was
already settled, or repeat a mistake that was already made.

## What belongs here

- Decisions and the reason behind them, especially the options rejected.
- Constraints that are not visible in the code — a deadline, a compatibility
  promise, a hardware limitation, an external dependency's behaviour.
- Traps: things that look wrong but are deliberate, and things that look safe
  but break.

## What does not

- Anything derivable by reading the code.
- Anything in the git log.
- Task status — that is [TASKS.md](./TASKS.md).
- Standards — those are [QUALITY.md](./QUALITY.md),
  [TESTING.md](./TESTING.md) and [SECURITY-STANDARDS.md](./SECURITY-STANDARDS.md).

## Decisions

Format: what was chosen, why, and what was rejected. The rejected option is the
valuable half — without it the decision gets re-argued every time someone new
notices the obvious-looking alternative.

| Date | Decision | Reason | Rejected alternative |
|------|----------|--------|----------------------|
| 2026-08-08 | `client/src/data/foundation.ts` is the only place the Foundation's legal facts are written | The same facts were retyped per page and had already drifted: `/contact` said the EIN was "available upon request" while `/donate` and `/organization` printed it — a contradiction on the one number that proves charitable status, which is exactly what an Ad Grants reviewer checks. `tests/unit/foundation-facts.test.ts` now fails on drift between the module, the JSON-LD in `client/index.html`, and `sitemap.xml`. | Leaving the values inline per page — rejected because the drift had already happened once and nothing would have caught the second time |
| 2026-08-08 | `/transparency` publishes use-of-funds **policy** and a filing timetable, not financial figures | Exemption is effective 2026-03-11, so FY2026 is the first tax year and has not closed; no Form 990 exists yet for anyone. Google asks for "EIN and/or an annual report", and a page that says when real numbers arrive is defensible where an estimate is not. An acceptance test asserts no currency figure appears on the page. | Publishing estimated revenue/expense or a program-expense ratio — rejected as unverifiable; publishing nothing beyond the EIN — rejected as the weakest reading of the policy |
| 2026-08-08 | Governance bodies on `/organization` describe mandate, joining process and cadence; individual directors and maintainers are not named | Named leadership is stronger transparency evidence, but no verified roster was available and inventing people on a nonprofit's site is not an option. Repository maintainership is already visible per repo and stays accurate without editing this page. | Naming directors from inference — rejected outright. Deleting the "5 directors / 7 members / 12 maintainers" counts — deferred; the counts are still unsourced (see below) |

<!-- Example of the level of detail worth recording:
| 2026-03-14 | Queue writes in-process rather than via Redis | Deploy target has no
network sidecar; measured throughput was sufficient at 4x expected peak |
Redis Streams — rejected on operational cost, not on capability. Revisit if
peak exceeds 8x. |
-->

## Constraints

| Constraint | Source | Consequence if broken |
|------------|--------|-----------------------|
| —          | —      | —                     |

## Traps

Things that look wrong but are deliberate, and things that look safe but break.
Add an entry the first time something here costs someone an hour — that is the
threshold, and it is deliberately low.

None recorded yet.

---

Rules for this file:

- Absolute dates. Never "last week" or "recently".
- One entry per fact. A paragraph covering three decisions gets skimmed.
- Delete an entry when it becomes false. A stale note is worse than a missing
  one, because it is trusted.
- If an entry is derivable from the code or the git log, it does not belong
  here.
