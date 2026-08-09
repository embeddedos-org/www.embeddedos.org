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

| ID    | Task                                                                               | Owner    | Verified by                | Evidence                                                                                                                                                                                                                                                                                                     |
| ----- | ---------------------------------------------------------------------------------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T-001 | Mission & scope and nonprofit transparency for the Google Ad Grants website policy | frontend | acceptance + a11y + audits | `pnpm check` PASS · `pnpm test` 321/321 PASS · `pnpm test:e2e` 118/118 PASS (incl. 28 Ad Grants acceptance criteria) · `pnpm audit:site` 0 failures · `pnpm audit:mobile` 25 routes, no overflow. Open items in [docs/unverified-claims.md](./docs/unverified-claims.md); mailing address still unpublished. |

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
