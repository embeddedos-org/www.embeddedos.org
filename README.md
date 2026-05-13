# EmbeddedOS (EoS) Research Foundation

[![Validate & Deploy](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/deploy.yml)
[![Website Tests](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/tests.yml/badge.svg)](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/tests.yml)
[![Weekly Release](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/weekly-release.yml/badge.svg)](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/weekly-release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Pages](https://img.shields.io/badge/Pages-35-green.svg)](#site-structure)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](#test-suite)

> A complete embedded AI systems stack — from bare-metal boot to top-level IoT integration.

🌐 **Live site:** [www.embeddedos.org](https://www.embeddedos.org)

📖 **Developer Portal:** [embeddedos-org.github.io](https://embeddedos-org.github.io)

🏪 **App Store:** [embeddedos-org.github.io/eApps](https://embeddedos-org.github.io/eApps/)

---

## Ecosystem (14 Components)

| Project | Version | Language | Description |
|---------|---------|----------|-------------|
| [**EoS**](https://github.com/embeddedos-org/eos) | v0.1.0 | C11 | Embedded OS — 33 HAL peripherals, 41 product profiles, RTOS kernel, multicore SMP/AMP, crypto, OTA, sensor, motor control, GDB stub, loadable drivers, device tree |
| [**eBootloader**](https://github.com/embeddedos-org/eboot) | v0.1.0 | C11 | Staged boot — 24 boards across 10 architectures, A/B slots, CRC32, auto-rollback, UEFI device table, multicore boot |
| [**eBuild**](https://github.com/embeddedos-org/ebuild) | v0.1.0 | Python | Build system — 18 CLI commands, SDK generator (14 targets), hardware analyzer, deliverable packager, 6 templates |
| [**EAI**](https://github.com/embeddedos-org/eai) | v0.1.0 | C11 | AI runtime — two-tier (Min 50KB + Framework), 12 LLM models, ReAct agents, LoRA fine-tuning, federated learning, 8-layer security |
| [**ENI**](https://github.com/embeddedos-org/eni) | v0.1.0 | C11 | Neural interface — Neuralink adapter (1024ch/30kHz), EEG provider, DSP, neural net, intent decoder, neurofeedback, stimulator safety |
| [**EIPC**](https://github.com/embeddedos-org/eipc) | v0.1.0 | Go + C | Secure IPC — HMAC-SHA256, capability auth, TCP/Unix/SHM transports, priority lanes, policy engine, audit logging |
| [**eApps**](https://github.com/embeddedos-org/eApps) | v0.1.0 | Multi | **Unified App Store** — 60+ apps: 46 native C/LVGL, 32 mobile Flutter, 34 web PWAs, 20 browser extensions, 14 dev tools, 22 CLI tools, 16 enterprise deployments |
| [**EoSim**](https://github.com/embeddedos-org/eosim) | v0.1.0 | Python | Simulator — 52+ platforms, 12 architectures, EoSim native engine, QEMU/Renode/HIL bridge |
| [**EoStudio**](https://github.com/embeddedos-org/EoStudio) | v0.1.0 | Python | Design suite — 12 editors (3D, CAD, UI, game, hardware), 30+ code generators, LLM integration |
| [**eDB**](https://github.com/embeddedos-org/eDB) | v0.1.0 | Python | Database — SQL + Document + Key-Value, REST API, JWT auth, AES-256, eBot AI queries |
| [**eBowser**](https://github.com/embeddedos-org/eBowser) | v0.1.0 | C | Browser engine — HTML5/CSS rendering for embedded/IoT, modular architecture, plugin system |
| [**eOffice**](https://github.com/embeddedos-org/eOffice) | v0.1.0 | JS/TS | Office suite — 11 apps (eDocs, eSheets, eSlides, eMail, eDrive), eBot AI assistant |
| [**eServiceApps**](https://github.com/embeddedos-org/eServiceApps) | v0.1.0 | Dart | Mobile apps — eSocial, eRide, eTravel, eTrack, eWallet (Flutter) |
| [**eos-platform**](https://github.com/embeddedos-org/eos-platform) | v0.1.0 | C | Platform layer — Desktop, TV, Laptop, Tablet, Kiosk profiles on EoS |

## eApps — Unified Marketplace

All desktop/mobile/web/extension apps are consolidated in the [eApps](https://github.com/embeddedos-org/eApps) repository:

| Category | Count | Technologies | Delivery |
|---|---|---|---|
| Native Apps | 46 | C + LVGL | Binaries, WASM |
| Desktop Apps | 4 | Electron, Python, C/SDL2 | `.exe` `.dmg` `.AppImage` |
| Mobile Apps | 32 | Flutter (Android + iOS) | `.apk` `.aab` `.ipa` |
| Web Apps | 34 | HTML5/JS/WASM PWA | GitHub Pages |
| Browser Extensions | 20 | WebExtensions Manifest V3 | `.zip` `.crx` `.xpi` |
| Dev Tools | 14 | VS Code, JetBrains, Vim | `.vsix` `.jar` |
| CLI Tools | 22 | Node.js, Python | npm, pip |
| Enterprise | 16 | Docker, Helm, MSI | Images, charts |

**Headline Products:** eOffice (11-app office suite), EoStudio (12-editor IDE), EoSim (52+ platform simulator), eBrowser (embedded web engine), eServiceApps (5 Flutter mobile apps)

🏪 **[Browse the App Store →](https://embeddedos-org.github.io/eApps/)**

## Site Structure

```
www.embeddedos.org/          26 pages
├── index.html               Homepage
├── ecosystem.html           Ecosystem overview
├── product-eos.html         EoS product page
├── product-eboot.html       eBootloader product page
├── product-ebuild.html      eBuild product page
├── product-eai.html         EAI product page
├── product-eni.html         ENI product page
├── product-eipc.html        EIPC product page
├── product-eapps.html       eApps & App Store product page
├── product-eosim.html       EoSim product page
├── product-eostudio.html    EoStudio product page
├── product-edb.html         eDB product page
├── product-ebowser.html     eBowser product page
├── product-eoffice.html     eOffice product page
├── product-eserviceapps.html eServiceApps product page
├── about.html               About the foundation
├── contact.html             Contact form (Web3Forms)
├── donate.html              Donations (Stripe)
├── membership.html          Membership tiers
├── certification.html       Certification programs
├── careers.html             Job listings
├── internship.html          Internship program
├── documentation.html       Technical docs
├── resources.html           Research resources
├── research.html            Neural link research
├── neural-link-ai.html      Neural link + AI
├── ai-os.html               AI operating systems
├── building-os.html         Building OS guide
├── future-research.html     Future research
├── privacy.html             Privacy policy
├── terms.html               Terms of service
├── code-of-conduct.html     Code of conduct
├── licenses.html            Open source licenses
├── 404.html                 Custom 404 page
├── css/style.css            Design system (67KB)
├── js/main.js               Navigation + animations
├── js/monitor.js            Sentry error monitoring
├── js/forms.js              Contact + donate forms
├── js/cookies.js            Cookie consent
├── js/search.js             Client-side search
├── sitemap.xml              22 URLs
├── robots.txt               Crawler config
└── tests/run-tests.ps1      66 automated tests
```

## Test Suite

**66 tests across 8 categories** — run locally:

```powershell
pwsh tests/run-tests.ps1
```

| # | Category | Tests | What It Checks |
|---|----------|-------|----------------|
| 1 | Functional | 16 | Links, forms, nav, buttons, JS/CSS files |
| 2 | Usability | 5 | `<h1>`, breadcrumbs, alt text, CTAs |
| 3 | Performance | 7 | File sizes, lazy loading, preconnect, no inline styles |
| 4 | Compatibility | 9 | DOCTYPE, viewport, responsive, dark mode, print |
| 5 | Security | 7 | XSS prevention, HTTPS, honeypot, no API keys |
| 6 | SEO | 8 | Title, OG tags, JSON-LD, sitemap, lang |
| 7 | Accessibility | 7 | Skip-link, ARIA, focus-visible, semantic HTML |
| 8 | Regression | 7 | CSS ref, project names, copyright, JS loaded |

## CI/CD Pipeline

```
git push → GitHub Actions
├── Website Tests        66 tests (required for PR merge)
├── Validate HTML        Lint + broken link check (required)
├── Build                Minify CSS + inject API keys
├── Deploy (GitHub Pages)
├── Deploy (HostGator FTP)
└── Lighthouse CI        5 pages audited (perf ≥70%, a11y ≥85%, SEO ≥85%)
```

**Weekly releases:** Every Monday at 6:00 AM UTC — auto-tag + changelog + deploy.

## Configuration

API keys are injected at deploy time via GitHub variables (never committed to source):

```bash
gh variable set WEB3FORMS_KEY --body "your-key"        # Contact form
gh variable set STRIPE_DONATE_URL --body "https://..."  # Donations
gh variable set SENTRY_DSN --body "https://...@sentry"  # Error monitoring
```

## Tech Stack

- **HTML5** — Semantic elements, ARIA roles, OG meta tags
- **CSS3** — Custom properties, Grid/Flexbox, dark mode, animations, 67KB design system
- **JavaScript** — Vanilla ES5, IntersectionObserver, animated counters, zero frameworks
- **Hosting** — GitHub Pages + HostGator FTP (dual deploy)
- **CI/CD** — GitHub Actions (3 workflows)
- **Monitoring** — Sentry SDK (lazy-loaded)
- **Forms** — Web3Forms (contact) + Stripe Payment Links (donate)

## Related Sites

| Site | Purpose |
|------|---------|
| [embeddedos-org.github.io](https://embeddedos-org.github.io) | Developer portal — docs, getting started, hardware lab |
| [embeddedos-org.github.io/eApps](https://embeddedos-org.github.io/eApps/) | App Store — browse/download 60+ apps |
| [github.com/embeddedos-org](https://github.com/embeddedos-org) | GitHub organization — all source code |

## License

MIT — see [LICENSE](licenses.html) for details.

© 2026 EmbeddedOS (EoS) Research Foundation. A 501(c)(3) nonprofit.
