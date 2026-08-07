/**
 * GENERATED FILE — do not edit by hand.
 *
 * Regenerate with `pnpm sync:stack`, which counts and copies from the sibling
 * EmbeddedOS repositories. Every figure here is derived from a source repo, so
 * the website cannot drift from the stack the way it did when these numbers
 * were written by hand.
 *
 * See scripts/sync-stack-data.mjs for what is deliberately not included.
 */

export const STACK = {
  "source": {
    "manifest": "embeddedos-org/eos-stack-manifest",
    "manifestUpdated": "2026-06-01T00:00:00Z",
    "boards": "embeddedos-org/eos (boards/*.yaml)"
  },
  "totals": {
    "repositories": 22,
    "projects": 22,
    "boards": 83,
    "architectures": 55,
    "families": 75,
    "vendors": 37,
    "architectureList": [
      "8051",
      "aarch64",
      "alpha",
      "arc",
      "arm",
      "arm-cortex-m",
      "arm64",
      "avr",
      "avr32",
      "blackfin",
      "c166",
      "c28x",
      "c6000",
      "ceva",
      "cris",
      "dspic",
      "frv",
      "h8300",
      "hexagon",
      "hybrid",
      "ia64",
      "kalimba",
      "lm32",
      "loongarch",
      "m68k",
      "microblaze",
      "mips",
      "mips64",
      "mn103",
      "msp430",
      "nios2",
      "openrisc",
      "parisc",
      "pic16",
      "pic18",
      "pic24",
      "pic32",
      "powerpc",
      "ppc64",
      "pru",
      "riscv32",
      "riscv64",
      "rl78",
      "rx",
      "s390",
      "sh",
      "sharc",
      "sparc",
      "sparc64",
      "tricore",
      "v850",
      "x86",
      "x86_64",
      "xtensa",
      "xtensa-hifi"
    ],
    "vendorList": [
      "ARM",
      "Analog Devices",
      "Axis",
      "Broadcom",
      "CEVA Inc",
      "Cadence",
      "DEC/Compaq",
      "Espressif",
      "Espressif/SiFive",
      "Fujitsu",
      "Gaisler",
      "HP",
      "IBM",
      "Infineon",
      "Intel",
      "Intel/Altera",
      "Lattice",
      "Loongson",
      "MIPS",
      "MIPS/Imagination",
      "Microchip",
      "NXP",
      "Nordic Semiconductor",
      "Open-source",
      "Panasonic",
      "Qualcomm",
      "Qualcomm/CSR",
      "Renesas",
      "Rockchip",
      "ST Microelectronics",
      "STC/Silicon Labs",
      "SiFive",
      "Sun/Oracle",
      "Synopsys",
      "TI",
      "Texas Instruments",
      "Xilinx/AMD"
    ],
    "simulatedPlatforms": 150
  },
  "tiers": {
    "1": "Core OS",
    "2": "Platform Tools",
    "3": "Applications",
    "4": "Web & Docs",
    "5": "Meta"
  },
  "projects": [
    {
      "name": "eos",
      "repo": "embeddedos-org/eos",
      "tier": 1,
      "type": "rtos",
      "platform": "firmware",
      "language": "C",
      "description": "SMP multi-core RTOS with sub-1μs context switch, A/B OTA, TPM 2.0."
    },
    {
      "name": "eBoot",
      "repo": "embeddedos-org/eBoot",
      "tier": 1,
      "type": "firmware",
      "platform": "firmware",
      "language": "C",
      "description": "Bootloader for any hardware"
    },
    {
      "name": "eAI",
      "repo": "embeddedos-org/eAI",
      "tier": 1,
      "type": "firmware",
      "platform": "firmware",
      "language": "C",
      "description": "AI Layer (AIL→eBot)"
    },
    {
      "name": "eDB",
      "repo": "embeddedos-org/eDB",
      "tier": 1,
      "type": "backend",
      "platform": "desktop",
      "language": "Python",
      "description": "Lightweight embedded database manager"
    },
    {
      "name": "eIPC",
      "repo": "embeddedos-org/eIPC",
      "tier": 1,
      "type": "backend",
      "platform": "desktop",
      "language": "Go",
      "description": "Secure IPC (NIA → AIL)"
    },
    {
      "name": "eosllm",
      "repo": "embeddedos-org/eosllm",
      "tier": 1,
      "type": "firmware",
      "platform": "firmware",
      "language": "C",
      "description": "On-device LLM runtime"
    },
    {
      "name": "ebuild",
      "repo": "embeddedos-org/ebuild",
      "tier": 1,
      "type": "tool",
      "platform": "desktop",
      "language": "C",
      "description": "Next-gen embedded OS build tool"
    },
    {
      "name": "EoSim",
      "repo": "embeddedos-org/EoSim",
      "tier": 2,
      "type": "desktop",
      "platform": "desktop",
      "language": "Python",
      "description": "Hardware and platform simulator"
    },
    {
      "name": "EoStudio",
      "repo": "embeddedos-org/EoStudio",
      "tier": 2,
      "type": "desktop",
      "platform": "desktop",
      "language": "Python",
      "description": "Visual design IDE"
    },
    {
      "name": "eVera",
      "repo": "embeddedos-org/eVera",
      "tier": 2,
      "type": "ai",
      "platform": "desktop",
      "language": "Python",
      "description": "Fully autonomous personal AI agent"
    },
    {
      "name": "eBrowser",
      "repo": "embeddedos-org/eBrowser",
      "tier": 2,
      "type": "desktop",
      "platform": "desktop",
      "language": "C",
      "description": "Privacy-first web browser with custom rendering engine."
    },
    {
      "name": "eCAD-Hardware-Products",
      "repo": "embeddedos-org/eCAD-Hardware-Products",
      "tier": 2,
      "type": "hardware",
      "platform": "hardware",
      "language": "HTML",
      "description": "Hardware designs, EE docs, board datasheets for multiple EmbeddedOS products."
    },
    {
      "name": "eNI",
      "repo": "embeddedos-org/eNI",
      "tier": 3,
      "type": "firmware",
      "platform": "firmware",
      "language": "C",
      "description": "Neural Interface Adapter"
    },
    {
      "name": "HEALTH-BAND-Neuro",
      "repo": "embeddedos-org/HEALTH-BAND-Neuro",
      "tier": 3,
      "type": "firmware",
      "platform": "firmware",
      "language": "C",
      "description": "14-channel EEG, sEMG gesture recognition, TENS therapy wearable."
    },
    {
      "name": "HealthKey-Ulta",
      "repo": "embeddedos-org/HealthKey-Ulta",
      "tier": 3,
      "type": "mobile",
      "platform": "mobile",
      "language": "TypeScript",
      "description": "Health monitoring and wellness app for EoS wearables."
    },
    {
      "name": "eOffice",
      "repo": "embeddedos-org/eOffice",
      "tier": 3,
      "type": "desktop",
      "platform": "desktop",
      "language": "TypeScript",
      "description": "Full office suite: eDocs, eSheets, eSlides, ePlanner, eNotes"
    },
    {
      "name": "eApps",
      "repo": "embeddedos-org/eApps",
      "tier": 3,
      "type": "web",
      "platform": "web",
      "language": "HTML",
      "description": "EoS Unified Marketplace and App Store for all EmbeddedOS applications."
    },
    {
      "name": "www.embeddedos.org",
      "repo": "embeddedos-org/www.embeddedos.org",
      "tier": 4,
      "type": "web",
      "platform": "web",
      "language": "TypeScript",
      "description": "10 pages, Stripe donation portal, GPS volunteer matching, admin dashboard."
    },
    {
      "name": "embeddedos-org.github.io",
      "repo": "embeddedos-org/embeddedos-org.github.io",
      "tier": 4,
      "type": "web",
      "platform": "web",
      "language": "HTML",
      "description": "developer documentation, API references, and project guides."
    },
    {
      "name": ".github",
      "repo": "embeddedos-org/.github",
      "tier": 5,
      "type": "meta",
      "platform": "meta",
      "language": "Python",
      "description": "issue templates, PR templates, community health files."
    },
    {
      "name": "embeddedos-org",
      "repo": "embeddedos-org/embeddedos-org",
      "tier": 5,
      "type": "meta",
      "platform": "meta",
      "language": "Python",
      "description": ""
    },
    {
      "name": "eos-stack-manifest",
      "repo": "embeddedos-org/eos-stack-manifest",
      "tier": 5,
      "type": "meta",
      "platform": "meta",
      "language": "JavaScript",
      "description": "orchestrates all repos in the embeddedos-org organization."
    }
  ],
  "roadmap": [
    {
      "version": "0.1.0",
      "profile": "eai-edge",
      "repos": [
        "eNI",
        "eIPC",
        "eAI"
      ],
      "useCase": "Intelligent edge node with neural-interface input. ENI ➜ EIPC ➜ eAI.",
      "shipped": true,
      "status": "Shipped"
    },
    {
      "version": "0.2",
      "profile": "embedded-core",
      "repos": [
        "eos",
        "eBoot",
        "ebuild"
      ],
      "useCase": "Minimum boot-and-run for any embedded target.",
      "shipped": false,
      "status": "Planned"
    },
    {
      "version": "0.3",
      "profile": "smart-edge",
      "repos": [
        "eos",
        "eBoot",
        "ebuild",
        "eIPC",
        "eAI"
      ],
      "useCase": "Production AI on MCU / Cortex-A; no BCI.",
      "shipped": false,
      "status": "Planned"
    },
    {
      "version": "0.4",
      "profile": "devkit",
      "repos": [
        "ebuild",
        "EoSim",
        "EoStudio"
      ],
      "useCase": "Desktop developer tooling stack.",
      "shipped": false,
      "status": "Planned"
    },
    {
      "version": "0.5",
      "profile": "appsuite",
      "repos": [
        "eApps",
        "eOffice",
        "eBrowser",
        "eDB"
      ],
      "useCase": "User-facing applications stack (server + browser + office + DB).",
      "shipped": false,
      "status": "Planned"
    },
    {
      "version": "1.0",
      "profile": "full-system",
      "repos": [
        "All canonical 13 (sans dev tools)"
      ],
      "useCase": "Reference deployment of the entire EmbeddedOS runtime.",
      "shipped": false,
      "status": "Planned"
    }
  ]
} as const;

export type StackProject = (typeof STACK.projects)[number];
export type RoadmapEntry = (typeof STACK.roadmap)[number];
