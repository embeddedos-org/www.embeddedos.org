/**
 * The EmbeddedOS components, for the architecture page.
 *
 * Mirrors docs/ecosystem-graph.json, which records where every field came
 * from. Only the fields the page renders are carried here; the evidence
 * quotes and caveats stay in the JSON so they are not shipped to the browser.
 * tests/unit/ecosystem-graph.test.ts asserts the two agree.
 */

export type ComponentRole =
  "boot" | "os" | "comms" | "ai" | "tooling" | "apps" | "hardware";

export interface EcosystemComponent {
  id: string;
  name: string;
  role: ComponentRole;
  purpose: string;
  maturity: string;
  repository: string;
  license: string;
  version: string | null;
  sitePage: string | null;
}

export const ROLE_LABEL: Record<ComponentRole, string> = {
  boot: "Boot and firmware",
  os: "Operating system",
  comms: "Communication",
  ai: "On-device AI",
  tooling: "Development tooling",
  apps: "Applications and data",
  hardware: "Hardware designs",
};

export const ROLE_ORDER: ComponentRole[] = [
  "hardware",
  "boot",
  "os",
  "comms",
  "ai",
  "apps",
  "tooling",
];

export const ECOSYSTEM: readonly EcosystemComponent[] = [
  {
    id: "eos",
    name: "EoS",
    role: "os",
    purpose:
      "Multi-platform embedded OS framework in C11: RTOS kernel, HAL with host and bare-metal backends, driver framework, networking, power and runtime services.",
    maturity: "Experimental",
    repository: "https://github.com/embeddedos-org/eos",
    license: "MIT",
    version: "0.5.0",
    sitePage: "/eos",
  },
  {
    id: "eboot",
    name: "eBoot",
    role: "boot",
    purpose: "Two-stage secure bootloader.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/eBoot",
    license: "MIT",
    version: "3.0.2",
    sitePage: "/eboot",
  },
  {
    id: "efirmware",
    name: "eFirmware",
    role: "boot",
    purpose:
      "Firmware image toolkit: build, sign-slot, inspect and verify the firmware containers eBoot loads.",
    maturity: "Early",
    repository: "https://github.com/embeddedos-org/eFirmware",
    license: "MIT",
    version: null,
    sitePage: null,
  },
  {
    id: "ebuild",
    name: "ebuild",
    role: "tooling",
    purpose: "Unified embedded build system in Python.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/ebuild",
    license: "MIT",
    version: null,
    sitePage: "/ebuild",
  },
  {
    id: "eipc",
    name: "eIPC",
    role: "comms",
    purpose: "Transport-agnostic inter-process communication library in Go.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/eIPC",
    license: "MIT",
    version: null,
    sitePage: "/eipc",
  },
  {
    id: "eai",
    name: "eAI",
    role: "ai",
    purpose: "On-device AI layer in C.",
    maturity: "Experimental / Research",
    repository: "https://github.com/embeddedos-org/eAI",
    license: "MIT",
    version: "0.2.0",
    sitePage: "/eai",
  },
  {
    id: "eni",
    name: "eNI",
    role: "ai",
    purpose: "Neural-interface adapter in C.",
    maturity: "Experimental / Research",
    repository: "https://github.com/embeddedos-org/eNI",
    license: "MIT",
    version: "0.3.0",
    sitePage: "/eni",
  },
  {
    id: "eosim",
    name: "EoSim",
    role: "tooling",
    purpose:
      "Simulation and validation platform in Python, with a native simulation engine plus QEMU and Renode backends.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/EoSim",
    license: "MIT",
    version: null,
    sitePage: "/eosim",
  },
  {
    id: "eostudio",
    name: "EoStudio",
    role: "tooling",
    purpose:
      "Python development and design platform: a visual editor and design suite with multi-target code generation, driven from a single CLI entry point.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/EoStudio",
    license: "MIT",
    version: "3.1.0",
    sitePage: "/eostudio",
  },
  {
    id: "edb",
    name: "eDB",
    role: "apps",
    purpose: "Embedded multi-model database.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/eDB",
    license: "MIT",
    version: null,
    sitePage: "/edb",
  },
  {
    id: "eosllm",
    name: "eosllm",
    role: "ai",
    purpose: "On-device LLM inference engine in portable ISO C99.",
    maturity: "Experimental / Research",
    repository: "https://github.com/embeddedos-org/eosllm",
    license: "MIT",
    version: "0.1.0",
    sitePage: null,
  },
  {
    id: "ebrowser",
    name: "eBrowser",
    role: "apps",
    purpose:
      "Privacy-oriented web browser in C11 for embedded targets and desktops.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/eBrowser",
    license: "MIT",
    version: null,
    sitePage: "/ebrowser",
  },
  {
    id: "eoffice",
    name: "eOffice",
    role: "apps",
    purpose: "Open-source office suite as a TypeScript/React monorepo.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/eOffice",
    license: "MIT",
    version: "1.0.0",
    sitePage: "/eoffice",
  },
  {
    id: "eapps",
    name: "eApps",
    role: "apps",
    purpose:
      "Unified marketplace and monorepo for EoS applications across native, desktop, mobile, web, browser-extension, dev-tool, CLI and enterprise categories.",
    maturity: "Available project",
    repository: "https://github.com/embeddedos-org/eApps",
    license: "MIT",
    version: null,
    sitePage: "/eapps",
  },
  {
    id: "ecad",
    name: "eCAD-Hardware-Products",
    role: "hardware",
    purpose:
      "Hardware and PCB CAD design collection organised by application domain, with datasheets, BOMs, power-budget scripts and some KiCad schematics.",
    maturity: "Design / Concept",
    repository: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
    license: "MIT",
    version: null,
    sitePage: "/ecad-hardware",
  },
  {
    id: "enet",
    name: "eNet",
    role: "os",
    purpose:
      "Networking subsystem for EmbeddedOS: TCP/IP, UDP, DHCP, DNS, MQTT, CoAP, discovery.",
    maturity: "Planned",
    repository: "https://github.com/embeddedos-org/eNet",
    license: "MIT",
    version: null,
    sitePage: null,
  },
  {
    id: "esec",
    name: "eSec",
    role: "os",
    purpose:
      "Security framework for EmbeddedOS: crypto abstraction, key management, device identity, attestation.",
    maturity: "Planned",
    repository: "https://github.com/embeddedos-org/eSec",
    license: "MIT",
    version: null,
    sitePage: null,
  },
  {
    id: "eflow",
    name: "eFlow",
    role: "tooling",
    purpose:
      "Visual programming and dataflow authoring for EmbeddedOS, layered on EoStudio and ebuild.",
    maturity: "Planned",
    repository: "https://github.com/embeddedos-org/eFlow",
    license: "MIT",
    version: null,
    sitePage: "/eflow",
  },
] as const;

export function componentsInRole(role: ComponentRole): EcosystemComponent[] {
  return ECOSYSTEM.filter(c => c.role === role);
}
