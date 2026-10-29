# Product repositories and layout audit — 2026-10-26

The five decorative product scenes have been replaced by static repository
panels on `/eos`, `/eboot`, `/eai`, `/eoffice`, and `/eapps`. `/getting-started`
now links each of its eight ecosystem cards to a product page and the project's
own GitHub repository. Existing tutorial paths and engineering-detail links
remain available.

## Evidence and corrections

| Area            | Finding                                                                                                                                                                | Result                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product visuals | Decorative objects obscured the product's meaning and depended on WebGL.                                                                                               | Removed the scenes and their page-level lazy imports, canvas gates, fixed-height stages, and spinner CSS. Panels use the existing Black Edition tokens and pill buttons.                                                                        |
| EoS             | Copy implied validated board support, published determinism, and completed peripheral capabilities.                                                                    | Hero and feature copy now describe the C11 framework and its experimental status. Board entries are described as configuration descriptors. The panel links to kernel, HAL, examples, and the README.                                           |
| eBoot           | The page advertised a sub-200ms boot and a different stage naming scheme, with a fabricated successful boot transcript.                                                | Removed the timing claim and transcript. The source map and overview now name Stage-0, Stage-1, image authentication, and payload hand-off. Production-key and target configuration requirements are stated.                                    |
| eAI             | The hero implied an agent on every device; examples looked like tested Python APIs and outputs. A universal 256KB requirement and tool capabilities were asserted.     | Replaced API transcripts with source maps, removed universal memory/device claims, and qualified model/backend requirements. Research examples are labeled as potential applications. The neural module links separately to eNI.                |
| eOffice         | App names, native implementation claims, and mock previews did not match the current repository.                                                                       | Picker uses the eleven actual app folders, with a direct GitHub link for each. React/TypeScript, web/PWA, Electron, and extension packaging replace the Flutter/LVGL claims. Fabricated app previews and cloud-independence claims are removed. |
| eApps           | EoSim pointed to EoStudio; eOffice and eBrowser pointed to eApps. Versions, platform coverage, and automatic binary availability were asserted without release checks. | Featured projects link to their own repositories. Content describes source scope and selected examples rather than asserting verified releases. Catalog/build workflows are distinguished from published artifacts.                             |
| Get Started     | Ecosystem cards had no direct source links. eFlow was described as completed production code generation.                                                               | Eight cards now offer product and GitHub links. eFlow is described as a host-side prototype; target code generation and visual editors remain future work, per its README.                                                                      |
| Performance     | Product hero modules imported the shared Three.js scene bundle.                                                                                                        | No product-scene renderer requests were observed on any of the six audited routes. Static panels have no animation, remote fonts, or remote image dependencies. Other website architecture diagrams are outside this change.                    |

## Source snapshots

The panel data records the audited commit. Folder and file destinations were
checked against the GitHub tree at that commit. Panel links use the repository's
`master` branch so visitors reach maintained source rather than an old snapshot.

| Repository | Audited commit                             | Primary evidence                                                                                                                                                                                                 |
| ---------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eos        | `21cd4eae999af2f063ddf7dd159cb5e451ad1f40` | [README](https://github.com/embeddedos-org/eos/blob/21cd4eae999af2f063ddf7dd159cb5e451ad1f40/README.md), [STATUS](https://github.com/embeddedos-org/eos/blob/21cd4eae999af2f063ddf7dd159cb5e451ad1f40/STATUS.md) |
| eBoot      | `de933fcc5a204280487deb210c6b031664b2c8df` | [README](https://github.com/embeddedos-org/eBoot/blob/de933fcc5a204280487deb210c6b031664b2c8df/README.md), repository tree                                                                                       |
| eAI        | `b2ec4bf5df3d07c03daba3151f3024865c1ee71a` | [README](https://github.com/embeddedos-org/eAI/blob/b2ec4bf5df3d07c03daba3151f3024865c1ee71a/README.md), repository tree                                                                                         |
| eOffice    | `45f5c90f9591d5689ed9f5ead073961ba30355b8` | [README](https://github.com/embeddedos-org/eOffice/blob/45f5c90f9591d5689ed9f5ead073961ba30355b8/README.md), `apps/` tree, `APPS_STATUS.md`, `FEATURE_VALIDATION.md`                                             |
| eApps      | `79efd583173216730f1e3043fb83fb45b4ce405d` | [README](https://github.com/embeddedos-org/eApps/blob/79efd583173216730f1e3043fb83fb45b4ce405d/README.md), `data/apps.json`, repository tree                                                                     |
| eNI        | `546bff14d6a9e6a19c6fa4b898ebaff4d57e59cf` | [README](https://github.com/embeddedos-org/eNI/blob/546bff14d6a9e6a19c6fa4b898ebaff4d57e59cf/README.md), repository tree                                                                                         |

Related project READMEs were also read for EoStudio, EoSim, eBrowser, ebuild,
and eFlow. Repo existence and canonical capitalization were checked through
GitHub's API. eOffice's historical status and feature-validation documents
conflict about completion of some features; this change does not publish their
feature-parity percentages or treat them as independent validation. eApps'
manifest metadata is not used as a verified count of functioning apps or releases.

## Validation

| Check                                                                                                                                                    | Result                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                                                                                                                             | PASS                                                                                                          |
| `pnpm exec vitest run tests/unit/product-repository-panel.test.tsx tests/unit/public-claims-policy.test.ts tests/unit/navigation.test.ts --maxWorkers=1` | PASS — 36 tests                                                                                               |
| ESLint on changed TypeScript and TSX files                                                                                                               | PASS                                                                                                          |
| Prettier on changed source and audit files                                                                                                               | PASS                                                                                                          |
| `git diff --check`                                                                                                                                       | PASS                                                                                                          |
| GitHub tree verification                                                                                                                                 | PASS — 31 source paths: 15 panel destinations, 5 READMEs, 11 app folders                                      |
| Chromium at 1440×1000 and 390×844 on all six pages                                                                                                       | PASS — 12 route/viewport combinations; no page errors, horizontal overflow, or broken images; one h1 per page |
| axe scoped to `.bp` page content at both widths                                                                                                          | PASS — zero violations in all 12 combinations; excludes the unchanged global navbar/footer                    |
| Source panel and ecosystem control sizes                                                                                                                 | PASS — checked visible new controls have height at least 44px (1px rounding tolerance)                        |
| Narrow layout at 320px                                                                                                                                   | PASS — no horizontal overflow on the five product pages                                                       |
| eOffice picker                                                                                                                                           | PASS — all eleven app buttons reveal the matching source link, at desktop and phone widths                    |
| Build-guide disclosure                                                                                                                                   | PASS — opens and closes on all five product pages                                                             |
| Get Started source links                                                                                                                                 | PASS — eight direct GitHub anchors at both widths                                                             |
| Product-scene dependency requests                                                                                                                        | PASS — no EoS3D/Three.js scene requests observed                                                              |

Browser checks blocked all non-local requests, including Google hosts. Source
links were inspected as anchors and verified through GitHub API/tree evidence;
the browser audit did not open external destinations. Evidence, screenshots,
source snapshots, and the browser audit script are saved under
`/Users/kartikey/Desktop/task/3d-review/`.

## Limits

This is a source-content and website layout audit. The upstream C/C++/Python
projects were not built or run, hardware/medical/security claims were not
independently validated, and release binaries were not downloaded. Existing
Getting Started tutorial commands were preserved and were not rerun in this
change. No production build, PR, push, merge, or deployment was performed for
this iteration; the local preview is on port 5323.

## Design refinement — 2026-10-27

Reworked the shared panel into an editorial product introduction beside a
clickable repository map. Map nodes link to the same previously checked source
paths; connectors show repository organization, not runtime or hardware claims.
The GitHub URL is visible and the primary button includes the GitHub mark.
Build commands sit in a disclosure with an accessible copy control and success
announcement. The map stacks below the introduction on small screens, and its
hover transitions respect reduced-motion settings. No 3D, remote assets, or
animation loop were added.

Validation for the refinement: TypeScript, ESLint, formatting and diff checks
pass; all 37 focused tests pass. The 12 desktop/phone route checks again found
no horizontal overflow, page errors, broken images, or axe violations in page
content. Narrow 320px checks pass. A real Chromium clipboard read confirmed
that the eApps command block is copied exactly. Updated screenshots are saved
as `3d-review/refined-*.png`. The refinement remains local and is not deployed.

## Release preparation — 2026-10-27

The full production build passed through the Google-blocking wrapper with
139/139 prerendered routes, zero failed/thin/degraded/error-boundary pages, and
138 sitemap URLs. A broader unit/integration run exposed an old `/eos` assertion
requiring the board count. The page intentionally no longer equates descriptors
with supported hardware, so the assertion now checks the experimental status,
no-observed-hardware-boot statement, and descriptor/port distinction instead.
Other board-count contracts remain intact. Hosting FETCH and DEPLOY are reserved
for the owner; no automatic hosting deployment is to be triggered.
