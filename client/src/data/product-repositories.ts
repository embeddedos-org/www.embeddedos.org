/** Public source snapshot checked against repository trees and READMEs on 2026-10-26.
 * Source evidence and limitations: docs/audits/product-repositories-2026-10-26.md.
 */
export interface ProductRepository {
  repo: string;
  title: string;
  summary: string;
  kind: string;
  status: string;
  note: string;
  sourceCommit: string;
  paths: { path: string; label: string; description: string }[];
  commands: string;
}
export const PRODUCT_REPOSITORIES = {
  eos: {
    repo: "eos",
    title: "EoS kernel",
    summary:
      "Explore the kernel, hardware abstraction, drivers, and runtime services in the public C11 framework.",
    kind: "C11 framework",
    status: "Experimental",
    note: "The repository reports no observed hardware boot. Board descriptors are configuration records; they do not establish validated hardware support.",
    sourceCommit: "21cd4eae999af2f063ddf7dd159cb5e451ad1f40",
    paths: [
      {
        path: "kernel",
        label: "Kernel & IPC",
        description: "Tasks, synchronization, and inter-process communication.",
      },
      {
        path: "hal",
        label: "Hardware abstraction",
        description: "Host and bare-metal backend code.",
      },
      {
        path: "examples",
        label: "Example applications",
        description: "Start with the examples and the current build guide.",
      },
    ],
    commands:
      "cmake -B build/host -DCMAKE_BUILD_TYPE=Release\ncmake --build build/host --parallel",
  },
  eboot: {
    repo: "eBoot",
    title: "eBoot bootloader",
    summary:
      "Follow the Stage-0 and Stage-1 boot chain, image verification, and recovery implementation.",
    kind: "C bootloader",
    status: "Source available",
    note: "Choose a target board and provision the production key as documented. Board configuration and security setup are required before deployment.",
    sourceCommit: "de933fcc5a204280487deb210c6b031664b2c8df",
    paths: [
      {
        path: "stage0",
        label: "Stage-0",
        description: "Early hardware initialization and entry into Stage-1.",
      },
      {
        path: "stage1",
        label: "Stage-1",
        description: "Image selection and hand-off to an application or RTOS.",
      },
      {
        path: "core",
        label: "Verification & recovery",
        description:
          "Image authentication, slot management, and recovery code.",
      },
    ],
    commands:
      "cmake -S . -B build -DEBLDR_BUILD_TESTS=ON\ncmake --build build --parallel\nctest --test-dir build --output-on-failure",
  },
  eai: {
    repo: "eAI",
    title: "eAI runtime",
    summary:
      "Inspect the runtime contracts, EAI-Min agent runtime, industrial framework, and model-format modules.",
    kind: "C runtime",
    status: "In development",
    note: "Model compatibility, memory use, and acceleration depend on the selected runtime and target. No universal device or memory guarantee is implied.",
    sourceCommit: "b2ec4bf5df3d07c03daba3151f3024865c1ee71a",
    paths: [
      {
        path: "min",
        label: "EAI-Min",
        description: "Lightweight agent runtime and routing.",
      },
      {
        path: "framework",
        label: "EAI-Framework",
        description: "Industrial runtime and orchestration modules.",
      },
      {
        path: "formats",
        label: "Model formats",
        description: "Inspect the available model-format loaders.",
      },
    ],
    commands:
      "cmake -B build -DEAI_BUILD_TESTS=ON\ncmake --build build --parallel\nctest --test-dir build --output-on-failure",
  },
  eoffice: {
    repo: "eOffice",
    title: "eOffice suite",
    summary:
      "Explore eleven productivity apps and their shared React and TypeScript workspace.",
    kind: "React + TypeScript",
    status: "Source available",
    note: "Web/PWA, Electron, and extension packaging are documented. Feature coverage varies by app; consult the code and current validation notes.",
    sourceCommit: "45f5c90f9591d5689ed9f5ead073961ba30355b8",
    paths: [
      {
        path: "apps",
        label: "Productivity apps",
        description:
          "eDocs, eSheets, eSlides, ePlanner, and the rest of the suite.",
      },
      {
        path: "desktop",
        label: "Desktop wrapper",
        description: "Electron packaging and launch configuration.",
      },
      {
        path: "extensions",
        label: "Browser & editor integrations",
        description: "Extension source and packaging instructions.",
      },
    ],
    commands: "pnpm install\npnpm dev",
  },
  eapps: {
    repo: "eApps",
    title: "eApps marketplace",
    summary:
      "Browse the public app catalog and find native, web, mobile, and desktop application source.",
    kind: "App catalog + source",
    status: "Source available",
    note: "Catalog entries and build workflows do not guarantee a downloadable binary for every platform. Check the selected app\u2019s release assets and installation guide.",
    sourceCommit: "79efd583173216730f1e3043fb83fb45b4ce405d",
    paths: [
      {
        path: "data/apps.json",
        label: "App catalog",
        description: "Inspect app metadata and source locations.",
      },
      {
        path: "apps",
        label: "Native applications",
        description: "Explore the C/LVGL application folders.",
      },
      {
        path: "docs/adding-apps.md",
        label: "Add an application",
        description: "Read the contributor guide for catalog entries.",
      },
    ],
    commands:
      "git clone --recursive https://github.com/embeddedos-org/eApps.git\ncd eApps\n# Follow the README for your selected app and platform.",
  },
} satisfies Record<string, ProductRepository>;
export type ProductRepositoryId = keyof typeof PRODUCT_REPOSITORIES;
export const githubRepositoryUrl = (repo: string) =>
  `https://github.com/embeddedos-org/${repo}`;
