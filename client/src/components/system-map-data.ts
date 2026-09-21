/**
 * system-map-data — pure data + layout math for the Architecture page's 3D
 * system map. Deliberately free of three.js and React so it stays cheap to
 * unit-test: every edge, position and camera fit below is deterministic.
 */
import {
  ARCHITECTURE_STAGES,
  type ArchitectureStageId,
  type MaturityStatus,
} from "@/data/architecture";

export type Vec3 = [number, number, number];

/** A stage node placed in map space (x right, y up, z toward viewer). */
export interface PlacedNode {
  id: ArchitectureStageId;
  x: number;
  y: number;
  z: number;
  /** Box footprint: width, height, depth. */
  w: number;
  h: number;
  d: number;
}

/**
 * One honest, defensible stage-level relationship. `evidence` is a short
 * human-readable citation; the matching code comment above each entry quotes
 * the source it came from. Only relationships verifiable in the components'
 * own documentation are drawn — nothing inferred.
 */
export interface SystemMapEdge {
  from: ArchitectureStageId;
  to: ArchitectureStageId;
  evidence: string;
  /** The shipped eAI Edge integration profile path — drawn distinctly. */
  highlight?: boolean;
  /** Lateral bow of the curved link (0 = straight). */
  bow?: number;
  /** Axis the bow is applied on. */
  bowAxis?: "x" | "y";
}

// The main data-flow chain runs bottom-to-top: hardware at the base,
// physical action at the crown. `applications` is a side node — it is not on
// the boot→kernel→AI critical path, it consumes IPC bidirectionally.
const CHAIN_ORDER: ArchitectureStageId[] = [
  "hardware-sensors",
  "secure-boot",
  "eos-kernel-drivers",
  "ipc-data-storage",
  "on-device-ai",
  "physical-action-feedback",
];

const CHAIN_X = 0;
const CHAIN_Y0 = -2.5;
const CHAIN_DY = 1.0;
const CHAIN_SIZE: Vec3 = [2.6, 0.5, 1.0];

// `applications` sits beside the IPC stage it talks to.
const APPS_POS: Vec3 = [2.9, 0.5, 0];
const APPS_SIZE: Vec3 = [2.2, 0.5, 1.0];

// Recenters the map on x=0 (chain spans ±1.3, apps reaches 4.0 → center 1.35).
const X_OFFSET = -1.35;

export const SYSTEM_MAP_EDGES: SystemMapEdge[] = [
  // eFirmware README: "the firmware containers eBoot loads" — the open
  // hardware/sensor designs produce the images eBoot verifies at startup.
  {
    from: "hardware-sensors",
    to: "secure-boot",
    evidence: "eFirmware README: the firmware containers eBoot loads",
  },
  // eBoot README: "providing verified boot for EoS and other payloads".
  {
    from: "secure-boot",
    to: "eos-kernel-drivers",
    evidence: "eBoot README: providing verified boot for EoS",
  },
  // eIPC README: "it provides the messaging layer between services" — the
  // IPC/data services run as isolated processes on EoS.
  {
    from: "eos-kernel-drivers",
    to: "ipc-data-storage",
    evidence: "eIPC README: the messaging layer between services on EoS",
  },
  // EAI_EDGE_PROFILE (client/src/data/architecture.ts): the shipped profile
  // with sequence ["eNI", "eIPC", "eAI"] — neural input through IPC to AI.
  {
    from: "ipc-data-storage",
    to: "on-device-ai",
    evidence: "EAI_EDGE_PROFILE: shipped eNI → eIPC → eAI sequence",
    highlight: true,
  },
  // architecture.ts stage description: "close the loop from inference to
  // actuators and measured feedback".
  {
    from: "on-device-ai",
    to: "physical-action-feedback",
    evidence: "architecture.ts: close the loop from inference to actuators",
  },
  // EoS README: "EoS is the OS core of the EmbeddedOS ecosystem, alongside
  // eBoot …, eAI …, and eNI" — the kernel hosts on-device AI, both directions.
  {
    from: "eos-kernel-drivers",
    to: "on-device-ai",
    evidence: "EoS README: the OS core alongside eAI",
    bow: 1.5,
    bowAxis: "x",
  },
  {
    from: "on-device-ai",
    to: "eos-kernel-drivers",
    evidence: "EoS README: the OS core alongside eAI",
    bow: 2.3,
    bowAxis: "x",
  },
  // eIPC README: "it provides the messaging layer between services" —
  // applications both consume IPC messages and publish back through it.
  {
    from: "ipc-data-storage",
    to: "applications",
    evidence: "eIPC README: the messaging layer between services",
    bow: 0.9,
    bowAxis: "y",
  },
  {
    from: "applications",
    to: "ipc-data-storage",
    evidence: "eIPC README: the messaging layer between services",
    bow: -0.9,
    bowAxis: "y",
  },
];

/** Deterministic node placement for the map. */
export function systemMapLayout(): PlacedNode[] {
  return ARCHITECTURE_STAGES.map(stage => {
    if (stage.id === "applications") {
      return {
        id: stage.id,
        x: APPS_POS[0] + X_OFFSET,
        y: APPS_POS[1],
        z: APPS_POS[2],
        w: APPS_SIZE[0],
        h: APPS_SIZE[1],
        d: APPS_SIZE[2],
      };
    }
    const chainIndex = CHAIN_ORDER.indexOf(stage.id);
    return {
      id: stage.id,
      x: CHAIN_X + X_OFFSET,
      y: CHAIN_Y0 + chainIndex * CHAIN_DY,
      z: 0,
      w: CHAIN_SIZE[0],
      h: CHAIN_SIZE[1],
      d: CHAIN_SIZE[2],
    };
  });
}

/**
 * Quadratic-bezier link geometry in map space: endpoints pulled back to the
 * node box faces, control point bowed off the straight line. Both the 3D
 * tubes and the 2D SVG fallback project these same points.
 */
export function edgeCurve(
  edge: SystemMapEdge,
  nodes: PlacedNode[]
): { a: Vec3; b: Vec3; c: Vec3 } {
  const from = nodes.find(n => n.id === edge.from);
  const to = nodes.find(n => n.id === edge.to);
  if (!from || !to) throw new Error(`unknown edge endpoint: ${edge.from}`);
  const a = surfacePoint(from, to);
  const b = surfacePoint(to, from);
  const bow = edge.bow ?? 0;
  const axis = edge.bowAxis ?? "x";
  const c: Vec3 =
    axis === "x"
      ? [(a[0] + b[0]) / 2 + bow, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
      : [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + bow, (a[2] + b[2]) / 2];
  return { a, b, c };
}

/** Pulls an endpoint back to the face of `node`'s box facing `other`. */
function surfacePoint(node: PlacedNode, other: PlacedNode): Vec3 {
  const dx = other.x - node.x;
  const dy = other.y - node.y;
  const dz = other.z - node.z;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  const az = Math.abs(dz);
  if (ax >= ay && ax >= az)
    return [node.x + (Math.sign(dx) * node.w) / 2, node.y, node.z];
  if (ay >= az) return [node.x, node.y + (Math.sign(dy) * node.h) / 2, node.z];
  return [node.x, node.y, node.z + (Math.sign(dz) * node.d) / 2];
}

/** Maturity → dot color, matching the STATUS_TONES used across the site. */
export const MATURITY_DOT: Record<MaturityStatus, string> = {
  "Shipped profile": "#34D399",
  "Available project": "#22D3EE",
  "Experimental / Research": "#FBBF24",
  Planned: "#F472B6",
  "Design / Concept": "#94A3B8",
};

/**
 * Camera distance that fits the whole map for a viewport aspect ratio
 * (fov 42°). Narrow screens push the camera back instead of clipping the
 * applications node.
 */
export function systemMapCameraDistance(aspect: number): number {
  const halfFovTan = Math.tan((42 * Math.PI) / 360);
  const safeAspect = Math.max(aspect, 0.4);
  const fitWidth = 3.1 / (halfFovTan * safeAspect);
  const fitHeight = 3.4 / halfFovTan;
  return Math.max(fitWidth, fitHeight);
}
