# Maintainer decision register

Findings from the website audit that **cannot be resolved inside this
repository**. Each one is either a choice between two defensible options, a
change to infrastructure this repository does not control, or a fact only the
Foundation can confirm.

Nothing here is blocked on more engineering. Everything that could be fixed in
code has been, in the pull requests listed at the end.

Evidence labels follow [CLAUDE.md](../CLAUDE.md): **Verified** means a command
was run and its output read.

Recorded 2026-09-19 against `master` and the nine open pull requests.
Updated 2026-09-22 after PR #56 merged and `master` (e0bbfad) was merged into
PR #53: D-1 and D-10 are resolved, D-2, D-9 and D-11 are no longer blocked,
and D-14 to D-19 are new.

---

## D-1 — Merge order between #53 and #56

**Resolved.** #56 merged into `master` on 2026-09-19. `master` was then merged
into #53 twice, in c5a5026 and d2f8f72, with the five conflicting files
resolved by hand and no history rewritten. The trial-merge analysis below is
kept as the record of why that order was recommended.

**Decision:** which of the two overlapping pull requests lands first, and who
rebases.

#56 _Site compliance rework: Ad Grants + Google standards_ (Aswin-V, 100 files,
+2921/−256) and #53 _seo: reproducible audit, per-route social metadata_
(Kartikey1306, 8 commits) change thirteen files in common.

**Verified** by a trial merge in a throwaway worktree:

- #56 merges into `master` cleanly.
- #53 merged **after** #56 conflicts in four files:
  - `client/src/lib/page-meta.ts`
  - `client/src/pages/Home.tsx`
  - `scripts/prerender.mjs`
  - `tests/unit/page-meta.test.ts`

The conflicts are not accidental: both changes add Twitter card tags, per-route
`og:image`, and a title/description override table, having started from the
same defects.

|                                 | #56                                                     | #53                                    |
| ------------------------------- | ------------------------------------------------------- | -------------------------------------- |
| Twitter card tags               | all four                                                | all four                               |
| Per-route `og:image`            | yes                                                     | yes                                    |
| Route description overrides     | 11 routes                                               | 52 routes                              |
| Reduced-motion helper           | `client/src/lib/reduced-motion.ts` (not in this branch) | `client/src/hooks/useReducedMotion.ts` |
| Reproducible SEO audit          | —                                                       | `scripts/seo-audit.mjs`                |
| Internal link graph             | —                                                       | `scripts/link-graph.mjs`               |
| Build-to-build SEO diff         | —                                                       | `scripts/seo-diff.mjs`                 |
| Verified ecosystem graph        | —                                                       | `docs/ecosystem-graph.json`            |
| WebP images                     | yes                                                     | —                                      |
| Homepage image dimensions (CLS) | yes — the 3 in-flow images                              | —                                      |

A later check reinforced this. Three homepage images are in flow with an
automatic height, so they reserve no space before they load; they are the only
images on the site that can shift layout. #56 already gives all three their
intrinsic dimensions (1376x768, 1600x900, 1600x900), matching what this audit
measured independently. Nothing in #53 touches them, deliberately.

**Recommendation:** merge #56 first — it is larger, it carries the Ad Grants
compliance work, and it is the harder of the two to rebase. #53 is then rebased
onto it, keeping the 52-route description table (a superset of the 11) and the
four tools #56 does not have. Whoever rebases should expect to delete roughly
half of #53's metadata changes as already-landed.

**Owner:** maintainer. Nobody should rebase until the order is chosen, because
rebasing the wrong one twice is the only way to get this wrong.

---

## D-2 — Which reduced-motion helper survives

Both pull requests add a helper honouring `prefers-reduced-motion`, in
different places and with different shapes. Two helpers doing one job is the
kind of duplication that quietly diverges.

**Recommendation:** keep whichever lands first and delete the other in the
rebase. There is no technical reason to prefer either.

**Resolved 2026-09-24.** The lib helper (`usePrefersReducedMotion` in
client/src/lib/reduced-motion.ts) won: the hooks/useReducedMotion.ts file
was deleted along with the local copies in `CadEvolutionHero` and
`HeroTechStack`, and all importers now use the lib hook. One helper, one
shape.

**Owner:** maintainer.

---

## D-3 — The website repository is private

**Verified.** `repos/embeddedos-org/www.embeddedos.org` reports
`"private": true`. Anonymous requests — which is what every visitor and
Googlebot sends — return 404:

```
404  https://github.com/embeddedos-org/www.embeddedos.org
404  https://github.com/embeddedos-org/www.embeddedos.org/blob/master/AGENTS.md
404  https://github.com/embeddedos-org/www.embeddedos.org/issues
404  https://github.com/embeddedos-org/www.embeddedos.org/wiki
200  https://github.com/embeddedos-org
```

The three deep links appear in the footer of **all 132 pages**. The files and
features they point at all exist; `has_issues` and `has_wiki` are both true and
`AGENTS.md` is present on `master`. They are unreachable only because the
repository is private.

This is a decision, not a bug. Two options:

1. Make the repository public — it is the website of an open-source
   foundation, and the links were written expecting this.
2. Keep it private and remove the three links.

Deleting the links without deciding would hide the question. `pnpm
seo:integrity` reports the cause rather than just the status code, so this
cannot silently be re-diagnosed as a broken link later.

**Owner:** Foundation. Option 1 also fixes it for every other page that links
to the repository.

---

## D-4 — `eos-stack-manifest` does not exist

**Verified.** `repos/embeddedos-org/eos-stack-manifest` returns 404 to an
authenticated request, so the repository is absent rather than private. It is
linked from `/projects` and `/stacks`.

Either the repository was renamed or never published. #56 already removes these
links; if the repository is coming back, that removal should be reverted
instead.

**Owner:** maintainer — only someone who knows the project's history can say
which.

---

## D-5 — Production serves a bot challenge to Googlebot

**Verified**, requested as Googlebot from this network:

| URL            | Status | Content-Type | Server             |
| -------------- | ------ | ------------ | ------------------ |
| `/robots.txt`  | 200    | `text/html`  | openresty/1.31.1.1 |
| `/sitemap.xml` | 200    | `text/html`  | openresty/1.31.1.1 |
| `/`            | 200    | `text/html`  | openresty/1.31.1.1 |

All three return an HTML JavaScript challenge page with **HTTP 200**.

The status code is what makes this severe. A 503 would tell Google to come
back; a 200 tells Google the challenge page _is_ the content. Google will read
an HTML document as `robots.txt`, fail to parse a sitemap that is not XML, and
index the challenge page instead of the site.

No change in this repository can affect it. The site is static files behind an
edge proxy the repository does not configure; this is tracked as issue #54.

**Owner:** whoever administers the openresty edge / hosting. The fix is to
allow verified search-engine crawlers, or at minimum to exempt `/robots.txt`
and `/sitemap.xml`.

---

## D-6 — Duplicate URL architecture

**Verified** present in the build: `/eos` and `/product-eos` both exist, as do
`/flow` and `/eflow`.

Two URLs serving one subject split the ranking signal between them. The
standard remedies are a redirect or a `rel=canonical` from one to the other.

No change has been made. Both pairs are deliberate as far as this repository
shows, and picking the survivor decides which URL any existing inbound link
should point at — a content decision with consequences outside the codebase.

**Owner:** maintainer.

---

## D-7 — Product claims that need a factual source

Two superlatives were changed in #53 because nothing in the repository
supports them:

| Page                | Was             | Now             |
| ------------------- | --------------- | --------------- |
| `/eos`              | "fastest"       | "low-overhead"  |
| `/product-eostudio` | "best-in-class" | "full-featured" |

The replacements are weaker on purpose. If a benchmark or comparison exists,
the original wording can be restored **with a citation**; a claim on a
nonprofit's site should be traceable to something.

`tests/unit/superlative-claims.test.ts` fails the build if an unsupported
superlative is reintroduced, so this stays decided either way.

**Owner:** Foundation, if the evidence exists.

---

## D-8 — `/eai-edge` states a version nothing verifies

**Verified.** `client/src/pages/EAIEdge.tsx` presents two figures as headline
statistics: **v0.1.0** labelled "Current Version" and **v0.1** labelled
"Profile".

Neither matches anything recorded in `docs/ecosystem-graph.json`. The page
describes "an in-development concept for a manifest-pinned eNI → eIPC → eAI
research workflow", so the version does not belong to a single component: eAI's
own README declares 0.2.0, eNI 0.3.0. A workflow or profile version may well
exist, but no repository this audit can read states it.

The identical string on the product pages was a placeholder and has been
replaced there with each component's README-declared version. This one was
left alone, because guessing which artefact it describes would replace an
unverified number with a wrong one.

**Options:** name the artefact and its version, or drop the two statistics.

**Owner:** maintainer — only someone who knows what the profile refers to can
say which.

---

## D-9 — The homepage's content links are the site's discovery bottleneck

**Verified** from the built HTML. The homepage's `<main>` links 14 internal
pages. None of them is `/architecture`, `/ecosystem`, `/products`,
`/downloads`, `/stacks`, or any component page. Following in-content links
only — which is what a crawler does, and what a reader who never opens the
mega-menu does — every one of those was unreachable from the homepage.

The navigation reaches them in one click, so a person using the menu is fine.
A crawler weighing in-content links, and anyone browsing without the menu, is
not.

**Corrected.** This entry said none of the homepage's 14 in-content links is a
component page. Five of the named hubs are indeed absent, but two of the 14
_are_ component pages as `docs/ecosystem-graph.json` defines them: `/eapps` and
`/ecad-hardware` are both recorded `sitePage` values. The homepage is less
isolated than the entry claimed, though the hubs it misses are the ones that
matter.

`client/src/pages/Home.tsx` is one of the four files PR #56 conflicts in, so
this was not changed here. `/getting-started` now carries the same links,
which puts each target two clicks from the homepage instead of unreachable.

**No longer blocked, still open.** After the merge the homepage `<main>`
still links 14 internal pages, and `/getting-started` is the only hub among
them; `/architecture`, `/ecosystem`, `/products`, `/downloads` and `/stacks`
are still absent. Verified from the 2026-09-22 build. The homepage is the
page #56 reworked for Ad Grants, so which hubs it names, and where, is left
to the maintainer.

**Owner:** maintainer.

---

## D-10 — One page still renders only its active tab

**Resolved.** Every page that mounted content only behind a click now ships
it in the prerendered HTML, hidden until selected, with tab or disclosure
semantics. Verified from the 2026-09-22 build; each row is guarded by
`tests/integration/crawlable-content.test.ts`.

| Page               | In source      | In prerendered HTML | Status                             |
| ------------------ | -------------- | ------------------- | ---------------------------------- |
| `/getting-started` | 51 titles      | 8 → **51**          | fixed                              |
| `/eflow`           | 20 names       | 5 → **20**          | fixed                              |
| `/architecture`    | 8 panels       | 1 → **8**           | fixed, one WebGL canvas            |
| `/api-docs`        | 261 signatures | 32 → **261**        | fixed, 24 panels                   |
| `/eosuite`         | 55 apps        | 11 → **55**         | fixed, 6 panels                    |
| `/faq`             | 15 answers     | 0 → **15**          | fixed, disclosure buttons          |
| `/books`           | 14             | 14                  | no gate — earlier report was wrong |
| `/health-compare`  | 32             | 32                  | no gate — earlier report was wrong |

The earlier analysis of `/architecture`, kept below, describes why that page
needed a different fix from the others.

`/architecture`'s loss is larger than this entry first recorded: 24 of 40 layer
names, 6 of 7 descriptions, 6 of 7 "why it matters" paragraphs and 22 of 28
statistic labels are absent, not only the descriptions and layer labels.

`/architecture` is left open deliberately. Its seven panels each embed
`ArchitectureDiagram3D`, and a WebGL canvas inside a `hidden` panel
initialises at zero size, so the fix has to keep the canvas mounted for the
active diagram only while the six other text panels render. That is a
different change from the two done here, and worth its own review. Its
diagram titles and subtitles are already in the HTML; what is missing is the
descriptions and the layer labels.

`/api-docs` and `/eosuite` are the larger losses — 60 and 44 titles — and both
files belong to PR #56.

**Owner:** none; nothing remains.

---

## D-11 — Two 3D components still have no WebGL or reduced-motion guard

**Corrected.** An earlier pass listed four unguarded components. A closer read
found that claim was wrong about one of them: `CircuitHero` has no internal
check, but its only call site in `client/src/pages/Home.tsx` already applies
both the WebGL probe and `useReducedMotion`, so it cannot mount without them.
Adding a guard inside it would be dead code. No change was made.

The remaining position, after this branch:

| Component                    | WebGL        | Reduced motion | Used by                                        | Status                             |
| ---------------------------- | ------------ | -------------- | ---------------------------------------------- | ---------------------------------- |
| `ArchitectureDiagram3D`      | yes          | yes            | `/architecture`, `/ecad-hardware`              | already guarded                    |
| `ArchitectureHologramCanvas` | yes          | at call site   | homepage hero                                  | already guarded                    |
| `CircuitHero`                | at call site | at call site   | homepage                                       | already guarded, no change needed  |
| `EoS3D` (5 canvases)         | **added**    | **added**      | `/eos`, `/eboot`, `/eai`, `/eoffice`, `/eapps` | fixed here                         |
| `AeroSwift3D` (2 canvases)   | **added**    | **added**      | `/aerospace`                                   | fixed here                         |
| `HealthDevice3D`             | no           | #56 adds it    | `/health`                                      | **blocked, WebGL still unguarded** |

**Corrected.** This entry said `HealthDevice3D` has neither guard. PR #56 does
add `usePrefersReducedMotion` to it, but adds no WebGL check and no `frameloop`
handling, so after #56 lands `/health` still mounts four unguarded WebGL
contexts.

`HealthDevice3D` is blocked on both ends: the component and its only consumer
`client/src/pages/Health.tsx` are both owned by PR #56, so there is no
un-owned file through which a guard could be added.

All of these are decorative. None imports `Text` or `Html` from drei, so no
information exists inside any canvas that is not also in the surrounding DOM,
and two of the pages label them "Concept 3D Render" and "Illustrative 3D
Concept" themselves. The guard therefore hides the canvas when WebGL is
absent and switches `frameloop` to `demand` under reduced motion, matching
what `ArchitectureDiagram3D` already does.

There is no critical-path cost either way: the homepage preloads no three.js
chunk, and the 872 KB `react-three-fiber` bundle is fetched only by routes
that use it.

**No longer blocked, still open.** #56 has merged. On the merged tree
`client/src/components/HealthDevice3D.tsx` calls `usePrefersReducedMotion` at
five sites and contains no WebGL probe, so `/health` still mounts its
canvases without one. Adding the probe is ordinary work; it carries no SEO
change, so it was not done in #53.

**Owner:** maintainer.

---

## D-12 — Two device repositories sit outside the ecosystem graph

**Verified.** `docs/ecosystem-graph.json` records eighteen components. A sweep
of every `github.com/embeddedos-org/*` URL in the built site and in
`client/src` found two public repositories the graph does not carry:

| Repository   | Language   | Licence | Linked from  | In graph |
| ------------ | ---------- | ------- | ------------ | -------- |
| `eos-health` | C          | MIT     | `/downloads` | no       |
| `eos-aero`   | TypeScript | none    | site content | no       |

Both are device or application product lines rather than operating-system
components, which is why this is a decision and not an omission: the graph
models the EmbeddedOS stack, though it already carries
`eCAD-Hardware-Products`, so hardware is not automatically out of scope.

`eos-aero` carries no licence at all, which matters more than its absence from
the graph — every other repository in the organisation is MIT, and the site
says so.

The sweep also confirmed what is _not_ a gap: `embeddedos-org`,
`embeddedos-org.github.io` and `.github` are org-infrastructure repositories,
`eVera` and `www.embeddedos.org` are private, and `eos-stack-manifest` and
`eFab` return 404 to an authenticated request, so they do not exist.

`eos-health`'s README claims its four devices cover "~95% of all clinically
relevant health metrics". The website does not repeat it, and C-005 already
retired coverage claims of that kind from the health pages.

**Owner:** maintainer, for both the taxonomy and the `eos-aero` licence.

---

## D-13 — The install command on the primary onboarding path does not work

**Verified independently.** `/getting-started` is one click from the homepage
behind "Get Started Free", and it prints `pip install embeddedos-ebuild
embeddedos-eosim`. None of those packages exists:

| Package             | pypi.org/pypi/&lt;name&gt;/json |
| ------------------- | ------------------------------- |
| `embeddedos-ebuild` | 404                             |
| `embeddedos-eosim`  | 404                             |
| `eosim`             | 404                             |
| `embeddedos`        | 404                             |
| `numpy` (control)   | 200                             |

The command appears six times across `/getting-started`, `/ebuild` and
`/product-ebuild`. A reader who searches PyPI for the nearest name finds
`ebuild`, which is an unrelated project by another author.

ebuild's own README documents the working method instead:

```
Requires Python 3.8+.
pip install -e .        # from the repo root
./install.sh            # puts the 'ebuild' command on your PATH
```

It also warns that the `ninja` **pip package** specifically is required, and
the site states Python 3.10+ where the README says 3.8+.

**Not implemented here, deliberately.** The correct replacement depends on
intent: if these packages are meant to be published to PyPI, the commands are
right and the packages are missing; if they are not, the site should document
the source install. Those are opposite fixes, and this is the site's primary
call to action — a wrong guess there is worse than a recorded defect.

**Owner:** maintainer. Either publish the packages or change the six commands
to the README's.

---

## D-14 — Which URL is an article's identity

**Decision:** whether an article lives at `/article-<slug>` or
`/article/<slug>`.

**Verified** on the 2026-09-22 build. Every crawlable signal says
`/article-<slug>`: the eight prerendered pages, their `<link rel="canonical">`
(`https://www.embeddedos.org/article-eos-platform-launch`), the sitemap
(eight `/article-` locations, zero `/article/`), and every internal link. The
structured data says `/article/<slug>`: `ArticleJsonLd.tsx:30` builds
`@id` and `mainEntityOfPage` from `${ORIGIN}/article/${slug}`, and
`tests/integration/article-jsonld.test.ts` asserts that value as "the
canonical URL, even though this file was built from a legacy /article-xxx
route". So the intent is on record, and it is the opposite of what is
served: `/article/:slug` is a wouter parameter route (`App.tsx:984`) that
the prerenderer never builds, so no `dist/public/article/` directory
exists, and a crawler following the JSON-LD `@id` reaches a URL the static
host answers with the 404 page.

Two ways to make them agree:

- Keep `/article-<slug>` as the identity: derive `@id` and
  `mainEntityOfPage` from the served canonical, and change the test to
  match. Small, and confined to files this branch owns.
- Make `/article/<slug>` real: prerender the eight parameter routes, add
  them to the sitemap, canonicalise the legacy pages to them, and redirect
  or keep the legacy addresses. Larger, and it changes eight published URLs.

Neither was done, because the test states a deliberate choice, and reversing
it without the author is exactly the kind of change this register exists
to prevent.

**Owner:** maintainer.

---

## D-15 — Every published URL is a redirect on the live host

**Decision:** whether to serve `/about` directly, or keep redirecting it to
`/about/`.

Each route is prerendered as a directory (`/about/index.html`), and the
host's directory handling answers the slash-less form with a 301 to the
slash form. The maintainer's own `e2e/regression.spec.ts` records this
("the live host 301s `/donate` to `/donate/`"). Every URL the site publishes
is slash-less: 130 of the sitemap's 131 locations, all 132 canonicals, and
every internal link. So each canonical names a URL that redirects to the
page, and each sitemap entry costs a redirect before the page is fetched.

**Verified** in a local Apache: `DirectorySlash Off` plus a rewrite of
directory requests to their `index.html` answers `/about` with 200 and the
right title and canonical, keeps `/about/` working, and leaves unknown
paths on the 404 page. Not applied, because `client/public/.htaccess`
records that the host runs LiteSpeed, and LiteSpeed's support for
`DirectorySlash` could not be confirmed from its documentation. The
alternative, publishing slash-terminated URLs everywhere, changes every
canonical and sitemap entry on the site, which is not a change to make
without the maintainer.

**Owner:** maintainer, with access to the host to test either option.

---

## D-16 — Products described as shipped with no repository behind them

**Decision:** per product, whether it is labelled a concept or removed.

`eos-platform` has no repository: `gh api repos/embeddedos-org/eos-platform`
returns 404. It is nevertheless the subject of a release article
(`/article-eos-platform-launch`: "the eos-platform meta-distribution reaches
1.0 with stable APIs"), a download card on `/downloads` with a version and a
file size whose link goes to the `eos` repository, a product page, and a
changelog. The same class, a named product with nothing published behind it,
already has one row in `docs/unverified-claims.md` (EoS Language); the
discovery pass found the surfaces are wider than that row.

`/product-eos-platform`'s meta description already calls it a concept, and
`/what-we-do` labels design-stage work with a "Design / Concept" badge, so
the site has a house pattern for this. Applying it, or removing the pages,
is a content decision.

**Owner:** maintainer.

---

## D-17 — Component pages that contradict their own README

**Decision:** the replacement wording, per component.

`docs/ecosystem-graph.json` names each component's README as the source of
truth, and the register retired the timing claims on these pages. The
capability descriptions were left, and some of them describe different
software from the README. The clearest case: `/product-edb` describes an
embedded database for EoS devices with AES-256 at-rest encryption rooted in
the eBoot chain of trust and a footprint under 64 KB; the eDB README
describes "a Python engine (built on SQLite)" exposing SQL, document,
key-value, graph and full-text interfaces, served as a library, a FastAPI
HTTP API or a React database-manager UI, requiring Python 3.11+. The
discovery pass found six component pages in this class, with eDB the
clearest; the JSON-LD on each product page now takes its language and name
from the graph, so the structured data is right while the prose is not.

What each page should say instead is the Foundation's to write. The
register rows quoting README against page, one per component, are the
next step and need no decision.

**Owner:** maintainer, for the wording.

---

## D-18 — One inventory, several published values

**Decision:** the canonical value of each inventory figure.

The number of supported boards is published as 24, 63, 83, 84 and 150 on
different pages; architectures as 7, 10 and 55; and `shared/stack-data.ts`,
which exists so that one value is used everywhere, is imported by only some
of the pages that print these figures. The figures the register already
covers (300+, 14, 60+, 33, 41, 64 KB) are a different set.

Once a value is chosen per figure, the code change is mechanical: route
every page through `STACK` and add a test that no inventory literal remains
in `client/src`.

**Owner:** maintainer, for the values.

---

## D-19 — Two product pages share another product's repository

**Decision:** what `/product-eos-platform` and `/product-eserviceapps` are.

`/product-eos-platform` resolves to the `eos` repository and
`/product-eserviceapps` to `eApps`, and each describes something its
repository's README does not. Until 5c0d112 both pages published the
repository's version and language as their own, so a cloud fleet-management
product carried the kernel's `v0.5.0`. They now keep their own title and
badge and claim no language or version from a repository that describes
something else; `codeRepository` still points at the shared repository,
which is the one fact on record. Whether each is a concept, an alias of the
component it points to, or a product with a repository not yet published,
decides what the page should say.

**Owner:** maintainer.

---

## What was fixed without a decision

| PR  | Fix                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- |
| #45 | Three footer links that returned 404                                                                                                  |
| #46 | 13 product pages with no inbound link, linked from `/products`                                                                        |
| #47 | Webfont stylesheet no longer render-blocking after prerender                                                                          |
| #48 | Build now fails when a route prerenders a crashed page                                                                                |
| #49 | `lastmod` removed — it stamped every URL with the build date                                                                          |
| #50 | PHP endpoint tests now run in CI                                                                                                      |
| #51 | Non-ASCII mail subjects encoded per RFC 2047                                                                                          |
| #53 | Per-route social metadata, heading structure, 52 descriptions, and the audit tooling                                                  |
| #53 | Product pages published `v0.1.0`; they now show each component's README-declared version, or the licence alone where none is verified |
| #53 | Product pages gained a visible breadcrumb, `BreadcrumbList` and `SoftwareSourceCode`, all describing content already on the page      |
| #53 | Eight `Learn more` and nine `View CAD Files` links now carry the name of what they link to, for anyone navigating by link text        |
| #53 | `img-no-dimensions` reported 34 images across 18 pages; 30 of them cannot move anything, so it now reports only the 3 that can        |
| #53 | `/faq` shipped 15 questions and no answers; every answer is now in the HTML behind a disclosure button                                |
| #53 | `/api-docs` shipped one module of 24; all 261 signatures, 24 headings and 263 return values and examples are now in the HTML          |
| #53 | 29 API signatures rendered wrong (`void *eos_shmem_alloc` shown as `void eos_shmem_allocc`); every signature now renders as written   |
| #53 | `/eosuite` shipped 11 apps of 55; all six categories are now in the HTML                                                              |
| #53 | Tablists had roving tabindex and no arrow keys, so a keyboard user could reach only the selected tab; arrow, Home and End keys work   |
| #53 | Product-page JSON-LD language disagreed with the visible badge on 11 of 13 pages; both now come from the ecosystem graph              |
| #53 | Master's link-destinations spec could not reach a link inside a collapsed tab panel; it now selects the panel's tab first             |

Open and safe, not done in #53: `/404` is prerendered as a 200 page with a
canonical and no `noindex`. A `<meta name="robots" content="noindex">` added
by `NotFound.tsx` on mount and removed on unmount, with a test for the
cleanup, closes it.

Run `pnpm quality:check` for the current state, and `pnpm quality:check
--network` to include external destinations.
