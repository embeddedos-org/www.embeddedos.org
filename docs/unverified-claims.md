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

## Open

| Page                   | Claim                                     | Note                                                                                |
| ---------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `/product-eos`         | `< 1 µs` IRQ latency                      | Same unmeasured kernel figure, on a product page                                    |
| `/product-eni`, `/eni` | `< 1 ms` and `< 10 ms` end-to-end latency | Two different figures for the same path                                             |
| `/product-eipc`        | `< 1 ms` latency, `< 1 ms` cross-board    | `/eipc` now states relative ordering instead                                        |
| `/product-edb`         | `< 1 ms` query latency                    | Depends on workload and medium; needs conditions                                    |
| `/product-eai`         | `< 50 ms` inference latency               | Needs model, quantisation and target MCU                                            |
| `/neural-link-ai`      | `< 5 ms` decode, `< 10 ms` latency        |                                                                                     |
| `/eradar360`           | `< 50 ms` alert latency                   | Plausibly a design requirement — say so if it is                                    |
| `/what-we-do`          | `< 10 ms` latency                         |                                                                                     |
| `/future-research`     | `< 5 ms` round-trip                       | Research targets; likely fine to keep as targets                                    |
| `/research`            | "Sub-10μs Context Switch"                 | Listed as a published performance report. Either publish the measurement or retitle |

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
