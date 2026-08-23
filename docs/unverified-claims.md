# Unverified performance claims

Figures the site states as present-tense fact that no repository in
`/home/srpatcha/eos` is known to measure. Each needs one of three decisions
from the project owner:

1. **Publish the measurement** — cite a benchmark, report or datasheet, and
   link it from the page.
2. **Move it to a target** — restate on `/roadmap` as a dated goal, the way the
   eFab profiles already are.
3. **Retire it** — replace with the capability, as was done for the kernel.

Until then they are neither confirmed nor contradicted here: the evidence is
absent, not negative. `tests/integration/stack-claims.test.ts` deliberately
does not fail on these, because failing them would assert they are false.

## Already resolved

The kernel's timing **was** provably unsourced and self-contradictory —
`/eos` said "Sub-1ms interrupt latency", `/architecture` said `<1µs`
scheduling, `/ecosystem` said `≤10μs context switch`, and the manifest said
"sub-1μs". `embeddedos-org/eos` has no context-switch or interrupt-latency
benchmark; `tests/test_performance_benchmarks.c` times a host loop and asserts
`<100 ns` per iteration, which measures the host, not the kernel. All four were
replaced with the capability they described, and the test guards that.

Also resolved: the platform count (`52+` on seventeen pages → 83 board
definitions across 55 architectures, counted from `eos/boards/*.yaml`) and
EoSim's simulated platforms (quoted as the same `52+` → 150, counted from
`EoSim/platforms/`).

Also resolved, 2026-08-23 — nine of the ten rows this section used to list
below. No repository this project can see measures any of these, so "publish
the measurement" was not available; each was retired to a capability
description (no number), or, for the two rows with a specific alternative
already established elsewhere, brought in line with it:

- `/product-eos` — the `< 1 µs` IRQ latency and `< 200 ns` context-switch
  figures (subtitle, stat, feature and spec) are gone, replaced with
  "Deterministic IRQ Handling" / bounded, priority-driven dispatch — the same
  treatment `/eos`, `/architecture` and `/ecosystem` already got.
- `/product-eni` and `/eni` — both figures retired. `/product-eni` no longer
  claims `< 1 ms`; `/eni`'s Output step and `/product-eni`'s own BCI usage
  example no longer claim `< 10 ms`. The two pages had, between them, three
  different numbers for essentially the same path — a stronger version of the
  kernel-timing contradiction.
- `/product-eipc` — brought in line with `/eipc`'s existing relative-ordering
  model (shared memory lowest, then SPI, then UART, then TCP highest) instead
  of the absolute `< 1 ms` / `< 100 µs` figures it had been stating on its own.
- `/product-edb` — the `< 1 ms` query latency is retired; the page now
  describes the index structure (B-tree/hash/inverted) and says plainly that
  latency depends on storage medium and workload, per the original note.
- `/product-eai` — the `< 50 ms` vision inference figure is retired; the stat
  slot now shows the backend count (4), which the specs table already
  supported.
- `/neural-link-ai` — the `< 5 ms` decode figure and the `< 10 ms` motor-
  prosthetic figure are both retired.
- `/what-we-do` — the `< 10 ms` EAI threat-detection figure is retired.
- `/research` — retitled from "EoS Kernel: Deterministic Scheduling with
  Sub-10μs Context Switch" / "Performance Report" to "EoS Kernel:
  Deterministic Scheduling Architecture" / "Architecture Overview", since no
  such report exists to publish.
- `/future-research` — kept as a target per the original note, but reworded
  so the `< 5 ms` round-trip figure reads unambiguously as something the
  2026–2029 closed-loop-BCI research direction is aiming for, not a claim
  about what exists today.

Verified: `pnpm check`, `pnpm build` (client + prerender, 95/95 routes, 0
failed/thin) and `pnpm build:server` all pass; `pnpm test:unit` (124 passed,
1 pre-existing skip) and `pnpm test:integration` (146 passed, including all
16 `stack-claims.test.ts` cases) both pass against the rebuilt site.

## Open

| Page         | Claim                   | Note                                                                                                                                                                                            |
| ------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/eradar360` | `< 50 ms` alert latency | Reviewed 2026-08-23 — still unsourced, and not resolvable as "plausibly a design requirement" without the actual spec. Owner asked to leave it unchanged for now rather than guess; still open. |

## Other numbers worth confirming

Not performance figures, so not covered by the tests above, but stated as fact
and not derived from any repository:

- `5 directors`, `7 members` (TSC), `12 maintainers` (`/organization`) — governance
  headcounts. Nothing in the repositories or on the site establishes them. The
  surrounding text was expanded on 2026-08-08 to describe each body's mandate and
  joining process, which is verifiable; the counts themselves were left alone
  because removing them was not the option chosen. Either confirm them against
  the board minutes and the TSC roster, or drop the badges and let the mandate
  text stand on its own.
- `300+ APIs`, `14 books`, `60+ apps`, `4 health devices` (`/`, `/about`)
- `33 HAL drivers`, `41 form factors`, `64KB min RAM` (`/architecture`)
- Patent application numbers on `/about` and `/patents` — these are of the form
  `64/073,334`, and US provisional applications are numbered in the `63/`
  series. Worth checking against the filing receipts.
