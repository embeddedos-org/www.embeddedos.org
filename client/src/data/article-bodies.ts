/**
 * The prose of every hosted article, keyed by registry slug.
 *
 * Extracted from the eight ArticleXxx.tsx components this replaces — 1,077
 * lines of React whose only job was to render four headings and five
 * paragraphs apiece inside identical chrome. The extraction was mechanical,
 * and a check confirmed every `<p>` in every source file is accounted for
 * here; nothing was retyped.
 *
 * Kept separate from content.ts so the index stays cheap to import. Pages that
 * list articles need titles and dates, not bodies.
 */

export interface ArticleSection {
  heading: string;
  text: string;
}

export interface ArticleBody {
  /** The standfirst under the title. */
  lede: string;
  sections: readonly ArticleSection[];
}

export const ARTICLE_BODIES: Record<string, ArticleBody> = {
  "eai-llm-bench": {
    lede: "EAI's new quantized inference path squeezes a 1.3B-parameter model into 312 MB of flash and runs at interactive speed on a 480 MHz microcontroller.",
    sections: [
      {
        heading: "The numbers",
        text: "On a Cortex-M85 running at 480 MHz with 512 KB SRAM and 8 MB PSRAM, the INT4 runtime achieves 11 tokens/second on a 1.3B-parameter GGUF model. Peak memory footprint is 312 MB flash + 4.2 MB SRAM for the KV cache. This is the first time interactive-speed LLM inference has been demonstrated on a microcontroller without an NPU.",
      },
      {
        heading: "Block-streamed inference",
        text: "The key insight is block-streamed weight loading: instead of mapping the entire model into PSRAM, the runtime streams 4 KB weight blocks from flash into SRAM just-in-time for each attention layer. This reduces peak SRAM usage by 94% compared to a naive full-model load, at the cost of 12% throughput reduction from flash read latency.",
      },
      {
        heading: "Quantization quality",
        text: "INT4 quantization uses per-channel symmetric quantization with outlier clamping. On the MMLU benchmark, the INT4 model scores 58.2% vs 61.4% for the FP16 reference — a 3.2 percentage point drop. For on-device use cases (intent classification, command parsing, sensor data summarization), this quality level is acceptable.",
      },
      {
        heading: "What this enables",
        text: "With 11 tok/s on a $4 MCU, natural language device control (eBot) becomes viable without cloud connectivity. A device can parse free-form commands, generate sensor summaries, and respond to queries entirely on-chip. This is the foundation for the eAI Edge stack's offline-first design.",
      },
    ],
  },
  "eboot-secure-boot-deepdive": {
    lede: "An end-to-end tour of eBoot's chain of trust — root-of-trust keys, immutable stage 0, signed manifests, anti-rollback counters, and the runtime attestation hooks eAI consumes during model loading.",
    sections: [
      {
        heading: "Chain of trust",
        text: "eBoot's chain of trust starts with an immutable ROM stage 0 that contains the root-of-trust public key baked into OTP fuses at manufacturing. Stage 0 verifies stage 1 (the eBoot main binary) using ECDSA-P256. Stage 1 verifies the EoS kernel image and the app manifest. No stage executes unless the previous stage's signature is valid.",
      },
      {
        heading: "Stage progression",
        text: "Stage 0 (ROM, 4 KB) → Stage 1 (eBoot main, 48 KB) → Stage 2 (EoS kernel, variable) → Stage 3 (app manifest verification). Each stage measures the next stage's hash into a TPM PCR register (or a software PCR on devices without hardware TPM). The final PCR chain is the device's attestation quote.",
      },
      {
        heading: "Anti-rollback counters",
        text: "Each signed image contains a monotonic version counter stored in OTP. eBoot refuses to boot any image with a counter value lower than the current OTP value. This prevents downgrade attacks where an attacker flashes an older, vulnerable firmware version. Counter increments are irreversible.",
      },
      {
        heading: "Runtime attestation",
        text: "The eAI model loader calls eBoot's attestation API to verify the PCR chain before loading any ML model. This ensures that a model only executes on a device that booted a known-good firmware stack. Compromised firmware cannot load production models, limiting the blast radius of a kernel exploit.",
      },
    ],
  },
  "edb-encryption-at-rest": {
    lede: "eDB's new storage layer adds page-level AES-XTS encryption with hardware-key offload on supported MCUs. The catch: it had to fit in 6 KB of code on the smallest target.",
    sections: [
      {
        heading: "The constraint",
        text: "The smallest eDB target is an STM32L0 with 64 KB flash and 8 KB SRAM. The encryption layer had to fit in 6 KB of code, use at most 512 bytes of SRAM for the cipher state, and add no more than 15% throughput overhead on a 32 MHz CPU. These constraints ruled out most existing embedded crypto libraries.",
      },
      {
        heading: "Why AES-XTS",
        text: "AES-XTS (XEX-based tweaked-codebook mode with ciphertext stealing) is the standard for disk encryption (IEEE P1619). Unlike AES-CBC, XTS is parallelizable and does not propagate errors across pages. Each 512-byte database page is encrypted independently with a tweak derived from the page number, so a single corrupted page does not affect adjacent pages.",
      },
      {
        heading: "Hardware key offload",
        text: "On MCUs with hardware AES (STM32H7, ESP32-S3, nRF5340), the key never leaves the hardware key store. The CPU provides the plaintext and tweak; the hardware returns ciphertext. The master key is derived from a device-unique secret in OTP using HKDF-SHA256, so it is never stored in flash.",
      },
      {
        heading: "What we cut",
        text: "To meet the 6 KB code budget, we dropped authenticated encryption (AEAD). eDB uses AES-XTS for confidentiality and a separate HMAC-SHA256 page MAC for integrity. This adds 32 bytes per page (6.25% overhead on 512-byte pages) but keeps the cipher and MAC implementations separate and auditable.",
      },
    ],
  },
  "eni-1024-channel-pipeline": {
    lede: "A research plan for measuring configurable neural acquisition, filtering, and decoding pipelines without treating unverified throughput targets as benchmark results.",
    sections: [
      {
        heading: "Why determinism needs measured evidence",
        text: "Closed-loop neural research depends on worst-case latency, not only average throughput. ENI does not yet publish a verified end-to-end deadline: each result must name the acquisition front end, channel map, sample rate, processing stages, hardware target, dataset, and measurement method.",
      },
      {
        heading: "Configuration-specific frames",
        text: "Channel count and sample rate depend on the acquisition hardware and configuration. A benchmark should report the resulting input bandwidth and measure each stage separately: filtering, threshold detection, waveform extraction, feature extraction, cluster assignment, and EIPC publication.",
      },
      {
        heading: "Memory scheduling research",
        text: "The research design evaluates staged buffers and hardware-specific memory placement to reduce contention. Any improvement percentage remains unverified until the repository publishes a reproducible benchmark and baseline for the named target.",
      },
      {
        heading: "Open benchmark requirements",
        text: "A publishable result needs a versioned dataset, benchmark harness, target configuration, raw measurements, and license. Until those artifacts are linked and reproducible, this article describes the intended methodology rather than achieved ENI performance.",
      },
    ],
  },
  "eos-platform-launch": {
    lede: "After eighteen months of incremental releases, the eos-platform meta-distribution reaches 1.0 with stable APIs, a unified package manifest, and a reproducible-build goal across the supported board set.",
    sections: [
      {
        heading: "What is eos-platform?",
        text: "eos-platform is the meta-distribution layer that sits above the EoS kernel. It bundles the kernel, HAL drivers, system services (eDB, eIPC, eLogger, eNet), and the eApps runtime into a single versioned manifest. Before 1.0, each component had its own release cadence, making reproducible builds difficult. Now, a single manifest.yml pins every component to a tested combination.",
      },
      {
        heading: "Stable API surface",
        text: "The 1.0 release freezes the public C API for all 14 modules (HAL, Kernel, Multicore, Crypto, OTA, Sensors, Motor, Filesystem, Power, Networking, Debug, Drivers, Services, Logging). Any code written against the 1.0 API will compile without changes on any future 1.x release. Breaking changes require a 2.0 bump.",
      },
      {
        heading: "Unified package manifest",
        text: "The new manifest.yml format specifies the board target, kernel profile (minimal, standard, full), enabled services, and pinned app versions. ebuild reads this manifest and produces a deterministic firmware image. The same manifest checked into git produces the same binary on any CI machine.",
      },
      {
        heading: "Reproducible builds",
        text: "A reproducible-build claim must identify the manifest revision, build environment, target set, and binary-comparison results. Until those artifacts are published, reproducibility remains a release goal rather than an achieved property.",
      },
    ],
  },
  "eos-roadmap-2026": {
    lede: "Three large RTOS research targets for 2026: a tickless scheduler targeting sub-microsecond wake latency, RT-IPC primitives sharing memory across security domains, and a formally verified context-switch path.",
    sections: [
      {
        heading: "1. Tickless idle",
        text: "The current EoS scheduler uses a 1 ms tick interrupt. This prevents the CPU from entering deep sleep for more than 1 ms, wasting power on battery devices. The 2026 tickless scheduler programs the RTC to wake the CPU only when the next task deadline arrives. On a typical IoT workload (1 Hz sensor read, 10 Hz display update), this reduces idle power from 8 mA to 0.4 mA — a 20× improvement.",
      },
      {
        heading: "2. RT-IPC across security domains",
        text: "Today, eIPC uses copy-based message passing across MPU domain boundaries. For high-bandwidth use cases (neural data, video), copy overhead is prohibitive. RT-IPC introduces a shared-memory window with hardware-enforced read/write permissions: the producer domain has write access, the consumer domain has read access, and neither can access the other's private memory. This enables zero-copy neural data transfer at 61 MB/s.",
      },
      {
        heading: "3. Formal verification of the context switch",
        text: "The context switch is the most security-critical code in any RTOS. A bug here can corrupt task state, leak secrets across security domains, or enable privilege escalation. We are using TLA+ to specify the context-switch state machine and Coq to prove that the implementation matches the spec. The verified context switch will ship in EoS 2.0.",
      },
      {
        heading: "What's not on the list",
        text: "We are explicitly not adding a POSIX compatibility layer, a dynamic linker, or a general-purpose memory allocator in 2026. These features would increase the kernel's attack surface and binary size. EoS remains a purpose-built embedded RTOS, not a general-purpose OS.",
      },
    ],
  },
  "eosim-hil-bridge": {
    lede: "EoSim 2.4 introduces a bidirectional hardware-in-the-loop bridge: drive simulated EoS images from a real PHY, or drive real boards from a simulated MMIO bus.",
    sections: [
      {
        heading: "What is HIL good for, anyway?",
        text: "Hardware-in-the-loop testing connects a simulated firmware image to real physical hardware. The canonical use case: test a motor controller firmware image against a real motor driver IC, without flashing the firmware to a real MCU. This catches hardware-software interface bugs (wrong SPI clock polarity, missing pull-up) that pure simulation misses.",
      },
      {
        heading: "The ezbus protocol",
        text: "EoSim 2.4 introduces ezbus, a lightweight USB protocol that bridges simulated MMIO registers to real hardware. A USB-connected ezbus adapter (based on the RP2040) exposes up to 16 virtual peripherals. The EoSim image writes to a simulated SPI register; ezbus translates the write to a real SPI transaction on the adapter's hardware SPI port.",
      },
      {
        heading: "Two directions",
        text: "The bridge works in both directions. Direction 1 (sim → real): the EoSim image drives real hardware via ezbus. Direction 2 (real → sim): a real EoS board drives a simulated peripheral model in EoSim. Direction 2 is useful for testing sensor fusion algorithms: inject synthetic sensor data from EoSim into a real board running production firmware.",
      },
      {
        heading: "Performance",
        text: "The ezbus adapter adds 180 µs of round-trip latency for a single SPI transaction. For most HIL use cases (motor control at 10 kHz, sensor reads at 1 kHz), this latency is acceptable. For sub-100 µs use cases (high-speed ADC, PWM generation), direct hardware testing is still required.",
      },
    ],
  },
  "newsletter-issue-01": {
    lede: "The first issue of the EmbeddedOS Foundation newsletter: who we are, what shipped recently, what is being designed next, and how to get involved.",
    sections: [
      {
        heading: "Welcome",
        text: "This is the first issue of the EmbeddedOS Foundation newsletter \u2014 a periodic email for people who want to stay in touch without watching every repository. Each issue rounds up what actually shipped, what is being designed, and where help is needed. Every issue stays readable on the web at this address; there is no subscriber-only content. The Foundation is the Embedded Operating Systems Research Foundation, a 501(c)(3) public charity (EIN 41-4821627) building an open-source operating system for embedded devices. Our five programmes are Open-Source Platform Engineering, Education and Free Curriculum, Research and Publication, Workforce Development, and Community and Ecosystem Stewardship.",
      },
      {
        heading: "What shipped recently",
        text: "The website now publishes across three feeds. News carries announcements as they happen: recent items include the eAI and eNI releases, the EoSim 2.4 simulator with its hardware-in-the-loop bridge, AES-XTS at-rest encryption in eDB, and the 2026 membership cycle with its three new working groups. The Blog carries longer pieces, such as the eBoot measured-launch walkthrough and the ENI neural-pipeline benchmark plan. The documentation, API reference, free technical books, and Kids Edition are all live and linked from the Resources section of the site.",
      },
      {
        heading: "What is next",
        text: "On the roadmap: the EoS RTOS work for 2026 (tickless idle, RT-IPC primitives, a formally verified context-switch path), continued eAI edge-runtime development, and steady publishing \u2014 at least one article a month \u2014 across News and the Blog. The newsletter itself will go out periodically rather than on a fixed schedule; we would rather send six substantive issues a year than twelve thin ones.",
      },
      {
        heading: "How to get involved",
        text: "Everything the Foundation makes is MIT-licensed and on GitHub under the embeddedos-org organization. Start with the Getting Started guide, browse the open issues, join the discussions, or come to a community event. Financial support goes through the Donate page, which uses a Zeffy-hosted donation form with no platform fee. To be notified of new newsletter issues, use the contact page and mention the newsletter \u2014 we will add you to the mailing list and confirm.",
      },
    ],
  },
  "foundation-membership-2026": {
    lede: "The 2026 membership cycle opens with three new working groups (Safety-Certified, Embedded AI Ethics, and Neural Interface Standards) and a refreshed governance charter.",
    sections: [
      {
        heading: "What changed",
        text: "The 2026 governance charter introduces three changes: (1) The Technical Steering Committee (TSC) expands from 5 to 7 seats, with 2 seats reserved for community-elected members. (2) All TSC votes are now public record, published within 48 hours of the vote. (3) Any Foundation member can submit an RFC; previously only TSC members could.",
      },
      {
        heading: "New working groups",
        text: "Three new working groups launch in 2026: Safety-Certified (IEC 62443, ISO 26262 ASIL-B compliance for EoS), Embedded AI Ethics (responsible AI deployment guidelines for eAI and eNI), and Neural Interface Standards (interoperability standards for BCI devices using the eNI protocol). Each working group meets monthly and publishes minutes publicly.",
      },
      {
        heading: "Open voting record",
        text: "All TSC votes from 2024 onward are published in the Foundation's public governance repository. This includes votes on RFC acceptance, release approvals, and budget allocations. The voting record is signed by each TSC member's GPG key for non-repudiation.",
      },
      {
        heading: "Joining",
        text: "Foundation membership is open to individuals and organizations. Individual membership is free (Community tier) or $10/month (Supporter tier). Organizational membership starts at $500/year (Sponsor tier). All membership tiers include voting rights on community RFCs. Supporter and above tiers include TSC election voting rights.",
      },
    ],
  },
  "this-week-in-embeddedos-2026-10-07": {
    lede: "Zephyr Developer Summit opens in Prague, onsemi rewrites its $7B Synaptics bid for edge-AI silicon, and Apple readies a Thread/Matter home hub — the week's signal for EmbeddedOS.",
    sections: [
      {
        heading: "Zephyr Developer Summit, Day 1 (Prague)",
        text: "The Maintainers Forum ran Oct 6 ahead of the main summit (Oct 7–9): 40+ sessions and 45+ speakers across functional safety, CRA readiness, and automotive/space/industrial tracks. Today the summit announced the first-ever Zephyr Community Awards. Also this week: MCP is now a Linux Foundation project, giving Zephyr shared governance with the agent protocol — directly relevant to the org's Agent fabric work.",
      },
      {
        heading: "Synaptics bidding war",
        text: "A competing bid forced onsemi to rewrite its $7B Synaptics deal — $1.3B less, all cash. The prize is Synaptics' Astra edge-AI MCU platform (Cortex-M52 + Ethos-U55, Zephyr RTOS): exactly the silicon class eos targets. The commercial benchmark for Zephyr on edge-AI silicon keeps getting more serious.",
      },
      {
        heading: "Watch: Apple Oct 13",
        text: "Apple is expected to announce a smart-home hub alongside LG-built Thread/Matter accessories. If Thread becomes the default, the Thread Border Router story becomes table stakes — one to watch for eNet.",
      },
      {
        heading: "In the org",
        text: "Kartikey's www audit wave (#77–#80) is in progress; review-only today. Issue #77 is linked to Aswin's #26 (Grants rework) — scope stays put, no expansion. All review findings ship in the daily reports.",
      },
    ],
  },
  "this-week-in-embeddedos-2026-10-08": {
    lede: "Zephyr Developer Summit day 2 digs into functional safety and CRA readiness, the org lands a ~45-issue audit-fix merge wave, four new boards join the platform roster, ESP-IDF v6.1 brings ESP32-P4 Wi-Fi back — and two MCP CVEs turn protocol warnings into patch notes.",
    sections: [
      {
        heading: "Zephyr Developer Summit, Day 2 (Prague)",
        text: "Day 2 centered on functional safety and CRA readiness — the two tracks the eos-aero safety work exists for. The assessor's view of evidence formats is the takeaway: a hazard log should show the reasoning that closed each hazard, not just the list of what could go wrong. CRA's 24h/72h/14d reporting duties (live since September 11) framed the embedded sessions; aerospace products are in scope.",
      },
      {
        heading: "The merge wave",
        text: "Roughly 45 audit findings landed across the org in two waves — Kartikey's fix PRs merged on eBoot, ebuild, eAI, eNI, EoSim, eDB, eApps, eBrowser, eos-health, www, and .github, closing the issues with them. The loop reviewed the open remainder (ebuild#179, eosllm#18) and is building on post-merge master everywhere.",
      },
      {
        heading: "Four new boards",
        text: "DEBIX M8391-01 (MediaTek Genio 720, 9-TOPS NPU850, industrial temperature range) for mid-tier NPU vision; Arduino VENTUNO Q (Qualcomm Dragonwing IQ-8275 plus STM32H5F5 — the dual-brain pattern in hardware, with ROS 2); NXP FRDM-IMXRT1186 (dual GbE TSN plus EtherCAT-capable Ethernet, the deterministic-comms reference); and the Upbeat Bluemag Pi (SiFive E3+E2 RISC-V flight controller with onboard AI, demoing at CEATEC next week). All four have EoSim platform definitions as of today.",
      },
      {
        heading: "ESP-IDF v6.1: P4 Wi-Fi lives, ECDSA-SBv2 dies",
        text: "Espressif's v6.1 release unblocks ESP32-P4 Wi-Fi (the blocker since July is closed) and fixes the LP-SPI MISO bug — but it disables ECDSA Secure Boot V2 on the H2, C5, and P4 for a security vulnerability in the ECDSA secure-boot flow, details pending in the chip errata. eBoot's threat model and eFirmware's bring-up baseline both carry the watch item: do not provision new devices against that flow.",
      },
      {
        heading: "MCP security: from warnings to CVEs",
        text: "Two disclosures this week convert the MCP protocol warnings into patch-level evidence: CVE-2026-105697 (CVSS 9.9) — Langflow's MCP server config executed user-typed commands via bash with no allowlist — and CVE-2026-104120 (SSRF in mcp-server-fetch). The org's answer is the hostile-protocol posture now documented across eSec, eIPC, eosllm, and eVera: tool-registration command allowlists, pinned versions, credential isolation, and no intra-network trust.",
      },
    ],
  },
  "this-week-in-embeddedos-2026-10-09": {
    lede: "The billing split resolves: eVera's CI is restored and ships a fail-closed parameter fix, while embeddedos-stack keeps landing docs-only. eCAD normalizes 70 KiCad files after a generator defect, MCP security gets a six-class taxonomy, and the silicon roster grows — Sapphire RV64, ESP32-S31, a DAL-A credit card, and the S100P.",
    sections: [
      {
        heading: "Billing split: eVera back, stack still queued",
        text: 'eVera\'s Actions billing is restored — 9/9 Test jobs green — so the day-one #52 fix (tools that accepted parameters and ignored them: screenshot region, weather units, broker action, the "rest" routing bug) landed with tests and CI verification. embeddedos-stack is still 0-step killed, so its improvements land docs-only and CI-unverified per standing policy, including a new legacy-CPE rule for the KEV gate: D-Link DAP-1360 CVE-2026-95675 (9.8, device retired 2020) means unpatchable hardware routes to isolation recommendations, never a blocked build.',
      },
      {
        heading: "eCAD: the generator defect",
        text: 'The KiCad export generator was emitting 4 stray ";" comment lines per board — a parser-visible defect in generated files. Fixed at the generator and normalized across 70 files (431 lines stripped, verified no ";" outside string literals), with a never-again unit test scanning every .kicad_pcb/.kicad_sch on every run. The 139 other KiCad files in the org and the vendor mirror lane were verified clean and untouched.',
      },
      {
        heading: "MCP security week: six classes, named controls",
        text: "The Enterprise MCP Guide's six attack classes (prompt injection, tool description poisoning, OAuth token theft, excessive tool permissions, shadow MCP servers, tool impersonation) are now mapped to controls across eSec, eIPC, eVera, and eosllm — fail-closed defaults, allowlists, no intra-network trust. Context: ClawSecure's Vol 2 counts 68 CVEs in a month, and the Mohiuddin protocol-pivoting research shows the same MCP flaw class at Google, JPMorgan, and two governments. The threat model is no longer theoretical.",
      },
      {
        heading: "Silicon week",
        text: "Four additions to the tracking roster: Efinix Sapphire (RISC-V RV64, 2.5W) as the low-power FPGA+CPU reference; ESP32-S31 preview support in eos board definitions and eFirmware's v6.1-rc1 bring-up notes; the Northrop Grumman Italia + DDC-I Deos credit-card A53 SBC — full DO-178C/DO-254 DAL-A artifacts, FACE-conformant — as the named commercial benchmark for the eos-aero safety case; and the D-Robotics S100P (6xA78AE plus lockstep R52+) as the dual-brain safety reference in silicon.",
      },
      {
        heading: "The device-CVE series keeps score",
        text: "The monthly \"Open-Source Device CVEs\" series is now the org's standing input to the KEV/CRA workflow. This week's datapoints: Moxa's CVE-2026-86326 (10.0, unauthenticated root on EDR-810) as fail-closed evidence in eBoot's threat model, and the JPEG decoder bad-picture fix (GHSA-v6r2-f6p2-88cj) logged for the camera-adjacent firmware watch list.",
      },
      {
        heading: "In the org",
        text: "EoStudio's coverage ratchet (#36) closed — both gates at 35 with CI green. ebuild gains an `ebuild test` command (ctest-to-pytest auto-detect, fail-closed exit codes). eNet documents the hardware bridge surface (mcp2serial/mcp2mqtt/modbus-mcp/probe-rs/xds110); eOffice states its offline-first guarantees; eFlow gets its llms.txt; the open-hardware lane moves in step — Kartikey's /open-hardware PR #92 passed the full acceptance review (self-hosted images, WebP siblings, caption tracks, search-index entry, green CI) and the eCAD KiCad work above keeps its evidence current.",
      },
    ],
  },
};

/** The body for a slug, or undefined when the item is a link-out. */
export function bodyOf(slug: string): ArticleBody | undefined {
  return ARTICLE_BODIES[slug];
}
