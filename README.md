# EmbeddedOS (EoS) Research Foundation

[![Validate & Deploy](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/deploy.yml)
[![Website Tests](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/tests.yml/badge.svg)](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/tests.yml)
[![Weekly Release](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/weekly-release.yml/badge.svg)](https://github.com/embeddedos-org/www.embeddedos.org/actions/workflows/weekly-release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Pages](https://img.shields.io/badge/Pages-26-green.svg)](#site-structure)
[![Tests](https://img.shields.io/badge/Tests-66%20Passing-brightgreen.svg)](#test-suite)

> A complete embedded AI systems stack — from bare-metal boot to top-level IoT integration.

🌐 **Live site:** [embeddedos.org.safecodeg.com](https://embeddedos.org.safecodeg.com)

---

## Ecosystem

| Project | Version | Language | Description |
|---------|---------|----------|-------------|
| [**EoS**](https://github.com/embeddedos-org/eos) | v0.5.0 | C11 | Embedded Operating System — 25 boards, 41 products, vtable HAL |
| [**eBootloader**](https://github.com/embeddedos-org/eboot) | v0.3.0 | C11 | Staged boot platform — Stage-0/1, A/B slots, CRC32, auto-rollback |
| [**eBuild**](https://github.com/embeddedos-org/ebuild) | v0.4.0 | Python | Build system + AI hardware analyzer — 100+ MCU database, 6 backends |
| [**EAI**](https://github.com/embeddedos-org/eai) | v0.1.0 | C11 | AI runtime — 64 tools, MQTT/OPC-UA/Modbus/CAN, zero dependencies |
| [**ENI**](https://github.com/embeddedos-org/eni) | v0.1.0 | C11 | Neural interface — BCI adapter, 16 providers, 3-tier safety policy |
| [**EIPC**](https://github.com/embeddedos-org/eipc) | v0.1.0 | Go + C | Secure IPC — HMAC-SHA256, capability auth, audit logging |

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
├── css/style.css            Design system (67KB)
├── js/main.js               Navigation + animations
├── js/monitor.js            Sentry error monitoring
├── js/forms.js              Contact + donate forms
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

## License

MIT — see [LICENSE](licenses.html) for details.

© 2026 EmbeddedOS (EoS) Research Foundation. A 501(c)(3) nonprofit.
