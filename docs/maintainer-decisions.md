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

---

## D-1 — Merge order between #53 and #56

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

|                             | #56                                                     | #53                                    |
| --------------------------- | ------------------------------------------------------- | -------------------------------------- |
| Twitter card tags           | all four                                                | all four                               |
| Per-route `og:image`        | yes                                                     | yes                                    |
| Route description overrides | 11 routes                                               | 52 routes                              |
| Reduced-motion helper       | `client/src/lib/reduced-motion.ts` (not in this branch) | `client/src/hooks/useReducedMotion.ts` |
| Reproducible SEO audit      | —                                                       | `scripts/seo-audit.mjs`                |
| Internal link graph         | —                                                       | `scripts/link-graph.mjs`               |
| Build-to-build SEO diff     | —                                                       | `scripts/seo-diff.mjs`                 |
| Verified ecosystem graph    | —                                                       | `docs/ecosystem-graph.json`            |
| WebP images                 | yes                                                     | —                                      |

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

**Owner:** maintainer, or whoever performs the D-1 rebase.

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

Run `pnpm quality:check` for the current state, and `pnpm quality:check
--network` to include external destinations.
