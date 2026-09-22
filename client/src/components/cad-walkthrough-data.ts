/**
 * cad-walkthrough-data — pure data for the Architecture page's CAD-to-product
 * walkthrough (client/src/components/CadWalkthrough3D.tsx).
 *
 * The walkthrough has 8 steps: step 0 is the bare CAD drawing, steps 1..7
 * mirror ARCHITECTURE_STAGES in order. Every fact shown in the UI comes from
 * client/src/data/architecture.ts — nothing here invents stage↔repo mappings
 * or product claims.
 */
import {
  ARCHITECTURE_STAGES,
  type ArchitectureStageId,
  type MaturityStatus,
} from "@/data/architecture";

/** One stop on the CAD-to-product walkthrough. */
export type WalkthroughStep = {
  key: "cad" | ArchitectureStageId;
  label: string;
  shortLabel: string;
  description: string;
  /** Null for the CAD drawing step, which has no maturity. */
  maturity: MaturityStatus | null;
  products: readonly string[];
  /** Null for the CAD drawing step, which links nowhere. */
  href: string | null;
  color: string;
  /** Index into ARCHITECTURE_STAGES, or null for the CAD drawing step. */
  stageIndex: number | null;
};

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    key: "cad",
    label: "CAD drawing",
    shortLabel: "CAD",
    description:
      "The reference device as a CAD drawing: a bare printed circuit board rendered blueprint-style, before any architecture stage is built.",
    maturity: null,
    products: [],
    href: null,
    color: "#38BDF8",
    stageIndex: null,
  },
  ...ARCHITECTURE_STAGES.map((s, i): WalkthroughStep => ({
    key: s.id,
    label: s.label,
    shortLabel: s.shortLabel,
    description: s.description,
    maturity: s.maturity,
    products: s.products,
    href: s.href,
    color: s.color,
    stageIndex: i,
  })),
];

/**
 * A tangible part bolted onto the board. `buildStep` is the 1-based step
 * whose activation adds it (1..7); `labelAt` anchors the floating label in
 * the 3D scene. Positions match the geometry in CadWalkthroughScene.tsx.
 */
export type BoardPart = {
  id: string;
  buildStep: number;
  label: string;
  labelAt: [number, number, number];
};

export const BOARD_PARTS: BoardPart[] = [
  // Step 1 — hardware / sensors
  {
    id: "sensor-modules",
    buildStep: 1,
    label: "Sensor modules",
    labelAt: [-2.5, 0.8, 1.5],
  },
  {
    id: "mounting-holes",
    buildStep: 1,
    label: "Mounting holes",
    labelAt: [2.9, 0.35, -2.0],
  },
  // Step 2 — secure boot
  {
    id: "spi-flash",
    buildStep: 2,
    label: "SPI flash",
    labelAt: [-2.2, 0.65, 0.4],
  },
  {
    id: "secure-element",
    buildStep: 2,
    label: "Secure element",
    labelAt: [-2.2, 1.0, -0.75],
  },
  // Step 3 — EoS kernel / drivers
  { id: "eos-soc", buildStep: 3, label: "EoS SoC", labelAt: [0, 1.05, 0] },
  {
    id: "heat-spreader",
    buildStep: 3,
    label: "Heat spreader",
    labelAt: [1.2, 0.8, 0.95],
  },
  // Step 4 — IPC / data / storage
  {
    id: "bus-traces",
    buildStep: 4,
    label: "Bus traces",
    labelAt: [1.35, 0.4, 0.55],
  },
  {
    id: "comm-module",
    buildStep: 4,
    label: "Comm module",
    labelAt: [2.3, 0.8, 0.6],
  },
  {
    id: "antenna",
    buildStep: 4,
    label: "Antenna",
    labelAt: [-2.95, 1.65, 1.75],
  },
  // Step 5 — applications
  { id: "display", buildStep: 5, label: "Display", labelAt: [0, 2.7, -1.9] },
  {
    id: "app-layer",
    buildStep: 5,
    label: "App layer",
    labelAt: [1.4, 1.8, 1.2],
  },
  // Step 6 — on-device AI
  { id: "npu", buildStep: 6, label: "NPU", labelAt: [2.0, 1.2, -0.5] },
  {
    id: "heatsink-fins",
    buildStep: 6,
    label: "Heatsink fins",
    labelAt: [2.0, 1.55, -0.5],
  },
  // Step 7 — physical action / feedback
  {
    id: "actuator-drivers",
    buildStep: 7,
    label: "Actuator drivers",
    labelAt: [-1.8, 0.9, 1.9],
  },
  {
    id: "feedback-sensor",
    buildStep: 7,
    label: "Feedback sensor",
    labelAt: [0, 0.75, 1.9],
  },
  {
    id: "status-led",
    buildStep: 7,
    label: "Status LED",
    labelAt: [0.9, 0.7, 2.05],
  },
];

/** A part group is built once the walkthrough reaches its step. */
export function isPartBuilt(step: number, buildStep: number): boolean {
  return step >= buildStep;
}

/** Every part visible once the walkthrough reaches `step`
 *  (0 = the bare CAD drawing, nothing built yet). */
export function builtParts(step: number): BoardPart[] {
  return BOARD_PARTS.filter(p => isPartBuilt(step, p.buildStep));
}

/**
 * Floating labels for the newly added parts of the active step — capped so
 * the DOM overlay stays small no matter how detailed the board gets.
 */
export const MAX_PART_LABELS = 3;

export function activeStepLabels(step: number): BoardPart[] {
  return BOARD_PARTS.filter(p => p.buildStep === step).slice(
    0,
    MAX_PART_LABELS
  );
}

/** Maturity dot colors for the legend (mirrors the hero's maturity key). */
export const MATURITY_DOT: Record<MaturityStatus, string> = {
  "Shipped profile": "#34D399",
  "Available project": "#22D3EE",
  "Experimental / Research": "#FBBF24",
  Planned: "#F472B6",
  "Design / Concept": "#94A3B8",
};

/**
 * Keyboard navigation across the 8 walkthrough steps (mirrors the hero's
 * nextStageIndex, which is typed for exactly 7 stages).
 */
export function nextWalkthroughStep(current: number, key: string): number {
  const total = WALKTHROUGH_STEPS.length;
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  if (key === "ArrowRight" || key === "ArrowDown") return (current + 1) % total;
  if (key === "ArrowLeft" || key === "ArrowUp")
    return (current - 1 + total) % total;
  return current;
}
