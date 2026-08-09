# Security Policy

This is the vulnerability disclosure policy for the EmbeddedOS Foundation, and
the file GitHub surfaces when someone clicks **Report a vulnerability**.

Secure engineering requirements for changes _inside_ this repository are a
separate document: [SECURITY-STANDARDS.md](./SECURITY-STANDARDS.md). This file
tells you how to report a problem; that one tells a contributor how to avoid
introducing one.

The policy below restates what is published at
[www.embeddedos.org/security](https://www.embeddedos.org/security). If the two
ever disagree, the website is authoritative and this file is the defect.

## Reporting a vulnerability

Email **security@embeddedos.org** with the details.

Please include, as far as you can establish it:

- the affected repository, component and version or commit
- what an attacker gains, and what access they need to start
- the steps to reproduce, ideally a minimal case
- any logs, crash output or proof-of-concept you already have

Please do not open a public issue for a security defect, and please do not
disclose it publicly until the timeline below has run.

## What happens next

- **Disclosure timeline:** 90 days.
- **Critical vulnerabilities:** patched within 7 days.

## Scope

In scope: all EmbeddedOS repositories on GitHub — the EoS kernel, eBootloader,
EAI, ENI, EIPC, eBuild, EoSim, EoStudio, eDB, eBrowser, eOffice, and all
related tooling.

Out of scope: third-party dependencies, GitHub infrastructure, social
engineering, and physical attacks on hardware.

A report that falls outside the scope above is still worth sending if you
believe it matters — scope is a statement about what the Foundation can act on,
not a filter on what it wants to hear about.

## Recognition

Researchers who responsibly disclose a valid vulnerability are credited in the
resulting security advisory and in the Foundation's Hall of Fame.

## This website

For defects in this repository specifically — `www.embeddedos.org` — the same
address and timeline apply. The site is a static, prerendered front end with a
small Express server; the areas most worth your attention are the session
cookie handling in `server/_core/cookies.ts`, the storage proxy, and the tRPC
procedures under `server/`.
