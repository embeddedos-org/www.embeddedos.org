# EmbeddedOS Website TODO

## Phase 1 — Setup & Assets

- [x] Upload all brand images and icons to webdev storage
- [x] Install GSAP + Three.js
- [x] Configure global theme, CSS variables, Sora + Inter fonts

## Phase 2 — Core Layout

- [x] Navbar with full Projects + Products mega-menu (real GitHub repos)
  - [x] Projects: Core OS, AI & Neural, Dev Tools, Aerospace
  - [x] Products: Applications, Health Devices, Hardware
  - [x] Docs: Learn, Build sections
  - [x] Community menu
  - [x] Mobile slide-over with expandable sections
- [x] Footer: Projects + Products + Resources + Community columns

## Phase 3 — Homepage

- [x] GSAP hero section with staggered text reveal
- [x] Animated stats counter bar (22 repos, 52+ platforms, 300+ APIs, 60+ apps, 4 health devices, 14 books)
- [x] Framer Motion product grid (12 products)
- [x] Architecture diagram section
- [x] Health section: 4 devices + 2 patents pending
- [x] Community section with illustration
- [x] Open-source mission banner

## Phase 4 — Inner Pages (all content preserved)

- [x] /getting-started — Getting Started page (5 learning paths)
- [x] /docs — Documentation index
- [x] /books — Books page (14 books)
- [x] /flow — eFlow page
- [x] /hardware-lab — Hardware Lab page (52+ boards, 7 families)
- [x] /kids — Kids Edition page (3 learning levels)
- [x] /get-involved — Get Involved page (6 ways to contribute)
- [x] /stacks — Stacks page (6 technology stacks)
- [x] /eapps — eApps page (60+ apps, 6 categories)
- [x] /health — Health page (4 devices, 2 patents)
- [x] /aerospace — Aerospace page (AeroSwift Personal + Transit)
- [x] /projects — Projects page (all 22 repos in 6 groups)
- [x] /404 — Custom 404 page

## Phase 5 — Features

- [x] eBot AI chat assistant (LLM-powered, bottom-right FAB)
- [x] Cmd/Ctrl+K search overlay filtering all pages and products
- [x] tRPC backend routes for eBot and search
- [x] Three.js animated hero (3D circuit board / particle field)
- [x] Health page: 3D device renders + live biometric waveform simulations
- [x] Aerospace page: 3D aircraft models + live flight telemetry simulation

## Phase 6 — Quality

- [x] Full mobile responsiveness across all breakpoints
- [x] Zero TypeScript errors
- [x] Vitest unit tests (9 tests passing: 8 search + 1 auth)
- [x] Push static HTML changes to embeddedos-org GitHub repo
- [x] Final screenshots and checkpoint

## Phase 7 — Advanced Features

- [x] Three.js animated hero — circuit board particle field with floating nodes
- [x] eBot AI chat assistant — LLM-powered FAB (bottom-right), tRPC backend route
- [x] Cmd+K global search modal — fuzzy search across all 13 pages + repos
- [x] Health page — 3D device renders (KEY, BAND, RING, LAB) + biometric waveforms
- [x] Aerospace page — 3D aircraft simulation (AeroSwift Personal + Transit)
- [x] Simulation visuals — live biometric waveforms + flight telemetry charts
- [x] Vitest unit tests for eBot and search routes (8 tests)
- [x] Push static HTML changes to embeddedos-org GitHub repo (commit 443c4ae)

## Phase 9 — Full Button & Route Audit

- [x] Fix hero badge: removed V1.0.0, changed Apache 2.0 → MIT LICENSE
- [x] Create /about page (Foundation About — mission, values, timeline, legal details)
- [x] Create /donate page (Zeffy embed only, no fake stats)
- [x] Create /news page (8 real announcements with GitHub links)
- [x] Create /privacy page (full Privacy Policy)
- [x] Create /terms page (full Terms of Use)
- [x] Fix all footer links that 404 (/about, /donate, /news, /privacy, /terms)
- [x] Fix all navbar links that 404 (EoSim, EoStudio → GitHub repos)
- [x] Fix Docs page: all 14 doc cards now link to real GitHub repos
- [x] Fix eBot system prompt: MIT license corrected
- [x] Search index updated with 5 new pages
- [x] 9 Vitest tests passing, zero TypeScript errors
- [x] Create /membership page (Foundation membership tiers — 5 tiers: Community, Supporter, Contributor, Sponsor, Enterprise)
- [x] Verify eBot chat LLM endpoint works end-to-end (returns real LLM responses)
- [x] Verify Cmd+K search returns results (6 pages + 1 repo for 'health' query)

## Phase 10 — Session Fixes (Jul 14 2026)

- [x] DonateModal.tsx: Fix hardcoded embeddedos.org/donate.html link → /donate internal route
- [x] Books.tsx: Fix plain <a href='/docs'> → wouter <Link href='/docs'> for SPA navigation
- [x] Create /membership page in static HTML site (www-embeddedos) — rebuilt to 5-tier structure (Community/Supporter/Contributor/Sponsor/Enterprise Partner), Zeffy-only donation links, pushed to GitHub (commit 62e79e6)
- [x] EoSim interactive demo page (/demo) — in-browser board simulator with GPIO toggles, UART output, 3 programs (LED Blink, UART Echo, GPIO Scanner), 3 boards (STM32F4, ESP32, RPi Pico)
- [x] Health device comparison table (/health-compare) — full spec comparison for all 4 devices with category filter, feature count summary cards, CTA section
- [x] Vitest unit tests for Membership page — 6 tests added (membership.test.ts), 15 total tests passing

## Phase 11 — Products Ecosystem Pages (Jul 14 2026)

- [x] Build /products — "What We Build" ecosystem overview with all 6 product families
- [x] Build /eos — EmbeddedOS kernel/platform product page with animated architecture diagram
- [x] Build /eboot — eBoot bootloader product page with boot sequence animation
- [x] Build /eai — ENI/EAI neural interface & AI product page
- [x] Build /eoffice — eOffice Suite product page with all 11 apps and live demo
- [x] Update Navbar Products dropdown to link to individual product pages (added Platform section: All Products, EoS Kernel, eBoot, ENI/EAI)
- [x] Add all new routes to App.tsx and search index (5 new pages + 5 search entries)

## Phase 12 — Developer Onboarding & Product Explainers (Jul 14 2026)

- [x] Rebuild /getting-started — full onboarding flow, 5 paths (Simulator, RPi, STM32, App Dev, Hardware Design), 8+ steps per path, no-hardware-needed callout, ecosystem map
- [x] Build /eflow — what eFlow is, block library (5 categories, 20 blocks), 8-step pipeline, 4 real-world use cases, eFlow vs manual C comparison table, CAD integration section
- [x] Build /ebuild — full developer workflow (5 phases: Design/Develop/Simulate/Validate/Deploy), 6 command groups, complete ebuild.toml reference, CAD→Firmware pipeline diagram
- [x] Update Navbar Docs → Build section: eFlow now links to /eflow, added eBuild → /ebuild
- [x] Update Navbar Projects → Core OS: ebuild now links to /ebuild (internal page)
- [x] Add /eflow, /ebuild, /getting-started to search index (3 new entries)
- [x] All 15 Vitest tests passing, 0 TypeScript errors

## Phase 13 — API Docs, Missing Products & Animated Hardware Showcases (Jul 14 2026)

- [x] Build /api-docs — comprehensive API reference (14 modules, 197 function signatures from docs/eos.html)
- [x] Build /edb — eDB multi-model database product page with animated query demos (built in Phase 15)
- [x] Build /eipc — eIPC IPC protocol page with wire format diagram and latency animation (built in Phase 15)
- [x] Build /ebrowser — eBrowser embedded browser page with rendering engine showcase (built in Phase 15)
- [x] Build /eostudio — EoStudio IDE page with 10-editor showcase and AI tutor demo (built in Phase 15)
- [x] Build /eosim-product — EoSim product page (separate from /demo) with CLI reference (built in Phase 15 as /eosim)
- [x] Build /ecosystem — full ecosystem map with interactive layer diagram (built in Phase 15)
- [x] Build /roadmap — public roadmap page (built in Phase 15)
- [x] Build /research — research page (built in Phase 15)
- [x] Build /eradar360 + /ehealth365 + /hardware-lab — eCAD hardware animated product pages (eRadar360 Aegis One, eHealth365 Smart Ring/Patch, 18-family HardwareLab hub)
- [x] Update Navbar: API Reference → /api-docs, eFlow → /eflow, footer links fixed
- [x] Add all new pages to search index (api-docs, eradar360, ehealth365, careers + previous)
- [x] Push all changes to www-embeddedos static HTML site (careers.html rebuilt, membership.html rebuilt, Zeffy links fixed)

## Phase 14 — Careers & Branch Cleanup (Jul 14 2026)

- [x] Audit careers content across all three repos (found 8 shallow positions in careers.html)
- [x] Build enriched Careers page with 13 detailed positions in React app (/careers) + search index
- [x] Sync careers.html to www.embeddedos.org static site (13 positions, pushed commit 41495ef)
- [x] Delete all branches except master and deploy-v2 from www.embeddedos.org repo (deleted: 4 dependabot, react-v2, release)

## Phase 15 — Full Gap Fill (Jul 15 2026)

### Group A — Organization / Foundation

- [x] /vision — Foundation vision & long-term mission
- [x] /organization — Foundation governance, legal, 501(c)(3) details
- [x] /community — Community hub (forums, Discord, events, contributors)
- [x] /contact — Contact page (email, social, office)
- [x] /faq — Frequently Asked Questions (20+ questions)
- [x] /partners — Partners & collaborators
- [x] /sponsors — Sponsors page
- [x] /certification — Certification program
- [x] /internship — Internship program
- [x] /fundraising — Fundraising campaign page
- [x] /licenses — MIT license, third-party licenses, patent notice
- [x] /security — Security architecture (Defence-in-Depth)
- [x] /code-of-conduct — Code of Conduct
- [x] /changelog — Changelog / release history
- [x] /events — Events page

### Group B — Product Pages

- [x] /edb — eDB multi-model database product page
- [x] /eipc — EIPC secure IPC protocol page
- [x] /eni — ENI neural interface framework page
- [x] /eosim — EoSim simulator product page (CLI reference, 63 platforms)
- [x] /eostudio — EoStudio IDE page (12 editors, 4 learning paths)
- [x] /eosuite — eOSuite / eApps full breakdown (60+ apps)
- [x] /eserviceapps — eServiceApps Flutter mobile apps page
- [x] /ebrowser — eBrowser embedded web browser engine page
- [x] /eai-edge — eAI Edge stack page
- [x] /neural-link-ai — Neural Link AI / ENI BCI product page

### Group C — Content Pages

- [x] /roadmap — Public roadmap
- [x] /research — Research page
- [x] /future-research — Long-term research directions
- [x] /building-os — How EmbeddedOS was designed and built
- [x] /ai-os — AI-Native OS / eAI platform overview
- [x] /ecosystem — Ecosystem overview
- [x] /ecosystem-map — Interactive ecosystem map
- [x] /resources — Resources page
- [x] /downloads — Downloads page (6 categories, 16 packages, MIT license notice, quick-install guide)

### Group D — Article Pages

- [x] /article-eos-platform-launch
- [x] /article-eai-llm-bench
- [x] /article-eboot-secure-boot-deepdive
- [x] /article-edb-encryption-at-rest
- [x] /article-eni-1024-channel-pipeline
- [x] /article-eos-roadmap-2026
- [x] /article-eosim-hil-bridge
- [x] /article-foundation-membership-2026

### Infrastructure

- [x] Update Navbar with all new pages
- [x] Add all new pages to search index (83 total entries)
- [x] Run all tests and verify 0 TypeScript errors (15 tests passing)
- [x] Save checkpoint (version a30741f0)

## Phase 16 — Full API Documentation from docs site (Jul 15 2026)

- [x] Crawl embeddedos-org.github.io/docs/index.html and all sub-pages
- [x] Extract all API modules, function signatures, parameters, return types, and examples
- [x] Build comprehensive /api-docs page matching the full docs site structure (13 modules)
- [x] Update search index with all API entries
- [x] Run tests and save checkpoint

## Phase 16 — Comprehensive Audit & Fix (Jul 15 2026)

- [x] Crawl www.embeddedos.org and embeddedos-org.github.io — map all pages and bugs
- [x] Fix all broken links and bugs on both sites
- [x] Build full API documentation (13 modules from docs site)
- [x] Enrich Careers page with all job positions from all repos (13 positions confirmed)
- [x] Push all enriched content to www.embeddedos.org GitHub (master branch)
- [x] Delete all branches except master and deploy from www.embeddedos.org repo
- [x] Run all tests and save checkpoint

## Phase 17 — Product Detail Pages, API Docs Expansion & GitHub Push (Jul 15 2026)

- [x] Build /patents — Patents & IP page (Health-Key Ultra, Health-Band Neuro provisional patents)
- [x] Build /product-eos — EoS kernel product detail page
- [x] Build /product-eos-platform — eos-platform form-factor profiles detail page
- [x] Build /product-eboot — eBootloader product detail page
- [x] Build /product-eai — EAI runtime product detail page
- [x] Build /product-eni — ENI neural interface product detail page
- [x] Build /product-eipc — EIPC secure IPC product detail page
- [x] Build /product-edb — eDB database product detail page
- [x] Build /product-ebuild — eBuild build system product detail page
- [x] Build /product-eosim — EoSim simulator product detail page
- [x] Build /product-eostudio — EoStudio IDE product detail page
- [x] Build /product-eoffice — eOffice suite product detail page
- [x] Build /product-eapps — eApps 60+ apps product detail page
- [x] Build /product-eserviceapps — eServiceApps Flutter super-app product detail page
- [x] Expand /api-docs to 13 modules (added EAI, ENI, EIPC, eDB, eBoot, eBuild, EoSim, EoStudio, eOffice, eBrowser)
- [x] Update Navbar Products section to link all new product detail pages
- [x] Add all new pages to search index (15 new entries)
- [x] Run all tests (15 passing, 0 TypeScript errors)
- [x] Save checkpoint and push to GitHub www.embeddedos.org

## Phase 18 — Comprehensive Enrichment (Jul 15 2026)

### Animated Product Showcases (Three.js / React Three Fiber)

- [x] Build /what-we-do — "What We Do" company overview page (EoS+eBoot+ENI/EAI+eOffice+eApps stack, use cases per industry)
- [x] Build /ecad-hardware — eCAD Hardware Products showcase (9 design categories with animated cards)
- [x] Animate EoS page (/eos) — 3D kernel architecture rotating diagram
- [x] Animate eBoot page (/eboot) — 3D boot sequence animation
- [x] Animate ENI/EAI page (/eai) — 3D neural signal visualization
- [x] Animate eOffice page (/eoffice) — 3D app suite showcase
- [x] Animate eApps page (/eapps) — 3D canvas animation added to hero section
- [x] Add eCAD product categories to Home page (15 categories grid with links, between Health and Features sections)

### API Documentation Enrichment

- [x] Add eOffice full API (createDocsEditor, CollabSession, eBot AI endpoints) to /api-docs
- [x] Add eBrowser full API (eb_create, eb_navigate, DOM query API) to /api-docs
- [x] Add eOSuite full API (43 app CLI commands, platform matrix) to /api-docs
- [x] Add eServiceApps full API (SocialService, MapView, AuthGuard, AppTheme) to /api-docs

### Missing Pages

- [x] Build /stacks — Technology stacks page (6 stacks from org repo) — already existed
- [x] Build /downloads — Downloads page with all packages — already existed
- [x] Sync all new React pages to www.embeddedos.org static HTML (what-we-do.html, ecad-hardware.html pushed commit 87230de)

### Infrastructure

- [x] Update Navbar with new pages (/what-we-do, /ecad-hardware)
- [x] Add all new pages to search index
- [x] Run all tests (15 passing, 0 TypeScript errors)
- [x] Save checkpoint (version 56addb70) and push to GitHub

## Phase 19 — Architecture Diagrams, Button Fixes & Comprehensive Testing (Jul 15 2026)

### Stub Button Audit & Fixes

- [x] Audit all pages for stub/placeholder buttons (toast "coming soon" or href="#")
- [x] Fix Research.tsx: 6 paper links now point to real GitHub/arXiv URLs
- [x] Fix Events.tsx: 4 event Register buttons now point to GitHub Discussions
- [x] All remaining href="#" are in ComponentShowcase (intentional demo stubs)

### 3D Architecture & Block Diagrams

- [x] Build ArchitectureDiagram3D.tsx — reusable animated 3D layered block diagram component
- [x] Build /architecture page — 7 interactive diagrams: EoS Kernel, eBoot Boot Sequence, ENI/EAI Neural Pipeline, eOffice Suite, eDB Multi-Model, eRadar360 Sensor Fusion, Full EmbeddedOS Stack
- [x] Add eCAD hardware block diagrams: eHealth365 sensor pipeline, eRadar360 sensor fusion, eAerospace flight control
- [x] Add /architecture to Navbar (Docs section) and search index

### Comprehensive Test Suite (116 tests, 5 test files)

- [x] Unit tests — search scoring, auth.me, auth.logout (15 tests in comprehensive.test.ts)
- [x] Integration tests — auth+search, logout+me, multi-category search (6 tests)
- [x] Functional tests — all major page routes discoverable, auth flows correct (15 tests)
- [x] Security tests — input validation, XSS/SQLi/null-byte safety, cookie security flags, auth boundaries (15 tests)
- [x] E2E tests — full user journeys, router structure integrity (8 tests)
- [x] Acceptance tests — all product names searchable, all categories discoverable, result shapes valid (10 tests)
- [x] Performance tests — search <100ms, auth <10ms, 10 concurrent queries (5 tests)
- [x] Smoke tests — router defined, all procedures exist, valid response shapes (8 tests)
- [x] Regression tests — scoring, cookie options, result limits, undefined vs null, special chars, new pages searchable (14 tests)
- [x] UI/UX tests — navigation discoverability (18 pages), content quality, search relevance, data integrity, accessibility (30 tests in ui-ux.test.ts)

### Infrastructure

- [x] All 116 tests passing (5 test files: auth.logout, membership, ebot.search, ui-ux, comprehensive)
- [x] 0 TypeScript errors
- [x] Save checkpoint and push to GitHub (Phase 19 final)

### Playwright E2E Tests (75 tests)

- [x] Smoke tests (5) — homepage, nav, footer, API health
- [x] Functional route tests (29) — all major routes render without errors
- [x] E2E user flows (6) — search, navigation, careers, API docs, architecture, 404
- [x] Acceptance tests (8) — brand, careers, patents, API docs, eCAD, what-we-do, architecture, homepage
- [x] Performance tests (5) — homepage <5s, search <500ms, auth <200ms
- [x] Regression tests (10) — all new pages render, /donate /about /privacy /terms work
- [x] UI/UX tests (9) — heading visible, keyboard nav, lang attr, responsive 375px+768px, alt attrs, page titles, dark theme, search Escape
- [x] Security tests (3) — no source path leaks, XSS protection, server health
- [x] All 75 Playwright tests passing, 116 Vitest tests passing = 191 total tests

## Phase 20 — Image Generation, Logo Creation & Button Fixes (Jul 15 2026)

### Image Audit

- [x] Audit live site for all broken/missing images (22 image refs found across 19 files)
- [x] Identify all placeholder/missing logos (logo mark was using wrong hash)

### Image Generation (15 images generated and uploaded)

- [x] EmbeddedOS main logo (dark bg, circuit-board motif, orange accent) → embeddedos-logo-mark_bc053888.png
- [x] Hero background image (dark PCB/circuit board with glowing traces) → hero-background_1bafea1c.png
- [x] EoS kernel product image (3D chip/processor render) → product-eos-kernel_0ca24d8d.png
- [x] eBoot product image (boot sequence / secure lock icon) → product-eboot_90e7936e.png
- [x] EAI / ENI product image (neural network / brain-chip interface) → product-eai-eni_b3c861de.png
- [x] eOffice product image (app suite / productivity icons) → product-eoffice_97012a7b.png
- [x] eApps product image (60+ apps grid / app store) → product-eapps_88dd40ab.png
- [x] eCAD hardware product image (PCB layout / hardware design) → product-ecad-hardware_f5806032.png
- [x] Health devices product image (smartwatch + ring + patch) → product-health-devices_800a4d9d.png
- [x] Aerospace product image (drone / aircraft) → product-aerospace_dafd0e80.png
- [x] eDB product image (database / storage) → product-edb_b631f074.png
- [x] eBot AI assistant avatar image → ebot-avatar_44488228.png
- [x] "What We Do" company overview illustration → what-we-do-illustration_4c2ad2f7.png
- [x] Community illustration → community-illustration_56a5f528.png
- [x] Architecture diagram hero → architecture-diagram-hero_72436b3f.png

### Button / Navigation Fixes

- [x] Fix 72 nested Link+anchor patterns causing wrong button navigation (Python script fix_nested_links.py, 19 files fixed)
- [x] Fix Research.tsx: 6 paper links → real GitHub/arXiv URLs
- [x] Fix Events.tsx: 4 Register buttons → GitHub Discussions
- [x] Footer product links verified and corrected

### Infrastructure

- [x] Upload all 15 images to webdev storage (manus-upload-file --webdev)
- [x] Wire all images into React components (22 replacements across 19 files)
- [x] Run all tests (116 Vitest + 75 Playwright = 191 total passing)
- [x] Save checkpoint (b7445f7e) and push deploy branch to GitHub (commit d4d4186)

## Phase 21 — Donate Page Fix & Architecture Visual Enhancement (Jul 15 2026)

### Donate Page Fix

- [x] Audit current /donate page — found wrong Zeffy slug (embeddedos vs donate-to-change-lives-17596)
- [x] Validate Zeffy URL: https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-17596 — VALID (confirmed in browser, shows "Donate to Change Technology" by Embedded Operating Systems Research Foundation)
- [x] Fix Zeffy iframe embed — correct embed URL: https://www.zeffy.com/en-US/embed/donation-form/donate-to-change-lives-17596, 700px height, loading spinner, fallback link
- [x] Add direct fallback link button below iframe (opens Zeffy in new tab)
- [x] Add trust signals (501c3, 0% fees, tax receipt, secure payment, impact stats)
- [x] Test donate page renders correctly — confirmed in devserver HMR

### Architecture Page Enhancement

- [x] Add product images to each architecture diagram section (4 images: EoS, eBoot, EAI, eOffice)
- [x] Add richer text explanations for each layer/component (per-diagram desc + layer sublabels)
- [x] Add "Why this matters" callout boxes for donors (7 diagrams × 1 callout each)
- [x] Add use-case examples per architecture diagram (real-world impact per diagram)
- [x] Add visual stats (latency <1µs, 1024 channels, 52+ platforms, 33 HAL drivers, etc.)

### Image Generation

- [x] Generate EoS kernel architecture illustration → arch-eos-kernel_d7d1b4a5.png
- [x] Generate eBoot secure boot chain illustration → arch-eboot-chain_b9f999b5.png
- [x] Generate ENI/EAI neural pipeline illustration → arch-eai-neural_4d7964d2.png
- [x] Generate eOffice app suite illustration → arch-eoffice-suite_d63eacf5.png
- [x] Generate "impact for donors" hero illustration → donate-impact-hero_generated.png

### Infrastructure

- [x] Run all tests — 116 Vitest passing, 0 TypeScript errors
- [x] Save checkpoint (6e79e983) and push deploy branch to GitHub (commit e3f3d6d)

## Phase 22 — Donate Page Fix (Jul 15 2026)

- [x] Research Zeffy embed URL parameters — confirmed no URL param can suppress the optional tip (must be disabled from Zeffy org admin dashboard)
- [x] Add info note below iframe explaining donors can set the optional tip to 0% using the dropdown
- [x] Fix iframe loading: add 4s auto-timeout useEffect so spinner auto-hides even if onLoad doesn't fire
- [x] Increase iframe height from 640px to 800px for better form visibility
- [x] Add useEffect import to Donate.tsx
- [x] Run all tests — 116 Vitest passing, 0 TypeScript errors
- [x] Save checkpoint and push deploy branch to GitHub

## Phase 23 — Architecture Diagrams Redesign (Jul 15 2026)

- [x] Audit Architecture.tsx — found duplicate images (3 diagrams shared same 2 images) and all 7 used identical layered-stack visual mode
- [x] Redesign ArchitectureDiagram3D component with 5 distinct visual modes: layered, radial, pipeline, tree, matrix
- [x] Assign each diagram a unique mode: Full Stack=matrix, EoS Kernel=layered, eBoot=pipeline, ENI/EAI=radial, eOffice=tree, eDB=pipeline, eRadar360=radial
- [x] Each diagram now has unique color palette, content, sublabels, and stats
- [x] Add mode badge on 3D canvas and mode label below canvas
- [x] Add "5 Visualization Modes" explainer section
- [x] Add color-band header to diagram grid cards
- [x] Fix all TypeScript errors (LucideIcon type, layer width fields)
- [x] All 116 Vitest tests passing, 0 TypeScript errors
- [x] Save checkpoint and push to GitHub

## Phase 24 — Fix /manus-storage/ Proxy on Live Server (Jul 15 2026)

- [ ] Add .htaccess RewriteRule to www-embeddedos master branch to proxy /manus-storage/* to Manus CDN
- [ ] Verify the proxy rule syntax for LiteSpeed compatibility
- [ ] Push master branch to GitHub
- [ ] Verify images load correctly on www.embeddedos.org

## Phase 25 — Quantum Computing (eQC) Section (Jul 15 2026)

- [ ] Research IBM, Google, Microsoft, IonQ, Rigetti quantum hardware specs and APIs
- [ ] Create /quantum page (eQC product) with vendor ecosystem, kernel features, hardware support table
- [ ] Add eQC to navbar Projects dropdown
- [ ] Add eQC to home page ecosystem strip
- [ ] Add quantum computing cross-links in Architecture and relevant product pages
- [ ] Run tests, save checkpoint, push to GitHub

## Phase 26 — Quarterly Donation + Full UI/UX Overhaul (Jul 15 2026)

- [ ] Add "quarterly" frequency option to Donate.tsx (4 buttons: one-time, monthly, quarterly, annual)
- [ ] Update donationRouter.ts to handle quarterly Stripe interval (every 3 months)
- [ ] Deep-read ui-ux-pro-max-skill and 21st.dev for advanced patterns
- [ ] Upgrade Home page: hero, product grid, features, stats, community sections
- [ ] Upgrade Donate page: visual hierarchy, trust signals, impact section
- [ ] Upgrade Navbar and Footer: motion, depth, accessibility
- [ ] Upgrade Quantum, Architecture, Products, Roadmap pages
- [ ] Run full test suite, save checkpoint, push to GitHub

## Phase 28 — Careers Navbar & Footer Fix (Jul 22 2026)

- [x] Add Careers link to Navbar Community → Participate section (top position, orange)
- [x] Add Internships link to Navbar Community → Participate section
- [x] Add Careers link to Footer Foundation column (position 2, after About)
- [x] Add Internships link to Footer Foundation column (position 3)
- [x] Import Briefcase + GraduationCap icons in Navbar.tsx
- [x] 0 TypeScript errors, HMR confirmed

## Phase 27 — Product Page Enhancement: How It Works + Usage Examples + Ecosystem Role (Jul 15 2026)

- [x] Audit all routes — confirmed no 404s from missing route definitions; root cause was thin/empty content
- [x] Upgraded ProductDetailPage component with 3 new sections: How It Works (numbered workflow), Usage Examples (tabbed code panel), Role in the EoS Ecosystem (importance badge + summary + depends-on/enables-by)
- [x] ProductEoS — 5-step workflow, 3 usage examples (IoT sensor, motor controller, CAN gateway), ecosystem role: Critical/Foundation
- [x] ProductEBoot — 5-step workflow, 2 usage examples (OTA update, measured boot), ecosystem role: Critical/Secure Boot Foundation
- [x] ProductEAI — 5-step workflow, 3 usage examples (KWS, defect detection, on-device LLM), ecosystem role: High/AI Intelligence Layer
- [x] ProductENI — 5-step workflow, 2 usage examples (motor BCI, seizure detection), ecosystem role: High/Biosignal Acquisition Layer
- [x] ProductEIPC — 4-step workflow, 2 usage examples (sensor-to-AI, multi-board robot), ecosystem role: Critical/Communication Backbone
- [x] ProductEDB — 4-step workflow, 2 usage examples (sensor logger, AI model registry), ecosystem role: High/Persistent Storage Layer
- [x] ProductEBuild — 5-step workflow, 2 usage examples (CI/CD pipeline, multi-board workspace), ecosystem role: Critical/Build and Toolchain Foundation
- [x] ProductEoSim — 5-step workflow, 2 usage examples (automated testing, multi-board simulation), ecosystem role: High/Development Acceleration Layer
- [x] ProductEoStudio — 5-step workflow, 2 usage examples (new project in 5 min, eFlow block programming), ecosystem role: High/Developer Experience Layer
- [x] ProductEOffice — 4-step workflow, 2 usage examples (automotive infotainment, medical documentation), ecosystem role: Medium/User-Facing Application Layer
- [x] ProductEApps — 3-step workflow, 1 usage example (smart home hub), ecosystem role: Medium/Application Ecosystem
- [x] ProductEServiceApps — 3-step workflow, 1 usage example (eHealth365 Mobile), ecosystem role: Medium/Consumer Service Layer
- [x] ProductEoSPlatform — 4-step workflow, 1 usage example (fleet OTA rollout), ecosystem role: High/Fleet Management and Cloud Bridge
- [x] Fixed TypeScript error in ProductEoSim specs array
- [x] 0 TypeScript errors confirmed, all pages render correctly
