# Ecosystem graph

`ecosystem-graph.json` is a factual model of the EmbeddedOS components, their
maturity and the relationships between them.

## Rules

1. **Every field comes from the component's own repository.** Purpose and
   maturity are taken from its README on the default branch. Nothing is
   inferred from a component's name.
2. **Every relationship carries an `evidence` string** quoting the sentence
   that establishes it. A relationship that cannot be quoted is not recorded.
3. **Maturity is the maintainers' own word**, not an assessment. Where a
   README says `Experimental`, `Planned` or `early`, that is what appears
   here, with the sentence in `maturityEvidence`.
4. **`caveats` carries limits the component states about itself** — stubbed
   crypto, unvalidated board descriptors, planned networking. These exist so
   that anything built from this data cannot overstate a component.
5. **No performance figures.** No component in the ecosystem publishes a
   reproducible benchmark, so none is recorded. See `unverified-claims.md`.

## What it is for

The architecture explorer proposed in issue #52 needs one source for component
names, purposes, maturity, repositories and relationships. Those facts are
currently spread across `client/src/data/architecture.ts`,
`shared/stack-data.ts`, `client/src/pages/Products.tsx` and
`client/src/components/Navbar.tsx`, which is how they drift.

This file is **not yet wired into the site**. It is the verified input for
that work, and `tests/unit/ecosystem-graph.test.ts` keeps it internally
consistent in the meantime.

## Known source problems

- `eos-stack-manifest` and `eFab` are referenced by `shared/stack-data.ts`,
  `client/src/data/stack.ts` and `scripts/sync-stack-data.mjs`, and both
  return HTTP 404. `pnpm sync:stack` therefore cannot run, and the generated
  figures in `stack-data.ts` are not currently reproducible from source.
- Four components have no page on the site: `eFirmware`, `eosllm`, `eNet`
  and `eSec`. The last two are `Planned` with no implementation, so a page
  would have little to say; the first two are real code with no route.
