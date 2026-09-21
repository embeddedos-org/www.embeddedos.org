/** @vitest-environment jsdom */

/**
 * Architecture system map — the detailed 3D explorer on /architecture.
 *
 * The pure layout/edge data is unit-tested directly; the component shell is
 * tested through its no-WebGL static fallback (the path every CI/test
 * environment takes), which must carry the same stages, edges, selection
 * behavior, and keyboard operability as the 3D scene.
 */
import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// wouter's Link needs no router here; render it as a plain anchor.
vi.mock("wouter", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import ArchitectureSystemMap3D from "../../client/src/components/ArchitectureSystemMap3D";
import {
  ARCHITECTURE_STAGES,
  EAI_EDGE_PROFILE,
} from "../../client/src/data/architecture";
import {
  MATURITY_DOT,
  SYSTEM_MAP_EDGES,
  edgeCurve,
  systemMapCameraDistance,
  systemMapLayout,
  type PlacedNode,
  type SystemMapEdge,
  type Vec3,
} from "../../client/src/components/system-map-data";

function installBrowserMocks() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  // No WebGL in the test env: the component must render its static fallback.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
}

beforeEach(() => installBrowserMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** True when p sits exactly on one of the node's six box faces. */
function onBoxSurface(p: Vec3, node: PlacedNode): boolean {
  const faces: Vec3[] = [
    [node.x + node.w / 2, node.y, node.z],
    [node.x - node.w / 2, node.y, node.z],
    [node.x, node.y + node.h / 2, node.z],
    [node.x, node.y - node.h / 2, node.z],
    [node.x, node.y, node.z + node.d / 2],
    [node.x, node.y, node.z - node.d / 2],
  ];
  return faces.some(
    f =>
      Math.abs(p[0] - f[0]) < 1e-9 &&
      Math.abs(p[1] - f[1]) < 1e-9 &&
      Math.abs(p[2] - f[2]) < 1e-9
  );
}

describe("system map layout data", () => {
  it("covers every architecture stage exactly once", () => {
    const nodes = systemMapLayout();
    expect(nodes).toHaveLength(ARCHITECTURE_STAGES.length);
    expect(nodes).toHaveLength(7);
    expect(nodes.map(n => n.id)).toEqual(ARCHITECTURE_STAGES.map(s => s.id));
  });

  it("stacks the chain base-to-crown with applications parked off-chain", () => {
    const nodes = systemMapLayout();
    const chain = nodes.filter(n => n.id !== "applications");
    // Bottom-to-top order, one shared vertical axis.
    const ys = chain.map(n => n.y);
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    expect(new Set(chain.map(n => n.x)).size).toBe(1);
    // Applications sits beside the IPC stage it talks to, off the axis.
    const apps = nodes.find(n => n.id === "applications");
    expect(apps).toBeDefined();
    expect(Math.abs(apps!.x - chain[0].x)).toBeGreaterThan(1);
    expect(apps!.y).toBeGreaterThan(0);
    expect(apps!.y).toBeLessThan(1);
  });

  it("draws only documented links, each carrying its evidence", () => {
    const ids = new Set(ARCHITECTURE_STAGES.map(s => s.id));
    expect(SYSTEM_MAP_EDGES.length).toBe(9);
    for (const e of SYSTEM_MAP_EDGES) {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
      expect(e.evidence.trim().length).toBeGreaterThan(10);
    }
  });

  it("highlights exactly the shipped eAI edge profile path", () => {
    const highlighted = SYSTEM_MAP_EDGES.filter(e => e.highlight).map(
      e => `${e.from}->${e.to}`
    );
    // EAI_EDGE_PROFILE is the shipped eNI -> eIPC -> eAI sequence: the IPC
    // handoff into on-device AI is the one distinctly-drawn link.
    expect(highlighted).toEqual(["ipc-data-storage->on-device-ai"]);
    expect(EAI_EDGE_PROFILE.sequence).toEqual(["eNI", "eIPC", "eAI"]);
  });

  it("anchors every edge on node faces with the declared bow", () => {
    const nodes = systemMapLayout();
    for (const e of SYSTEM_MAP_EDGES) {
      const { a, b, c } = edgeCurve(e, nodes);
      for (const p of [a, b, c]) {
        expect(p).toHaveLength(3);
        expect(p.every(v => Number.isFinite(v))).toBe(true);
      }
      // Endpoints sit on the faces pointing at each other.
      const from = nodes.find(n => n.id === e.from);
      const to = nodes.find(n => n.id === e.to);
      expect(from).toBeDefined();
      expect(to).toBeDefined();
      expect(onBoxSurface(a, from!)).toBe(true);
      expect(onBoxSurface(b, to!)).toBe(true);
      // Control point is the midpoint plus the declared bow on its axis.
      const bow = e.bow ?? 0;
      const axis = e.bowAxis ?? "x";
      expect(c[0]).toBeCloseTo(
        (a[0] + b[0]) / 2 + (axis === "x" ? bow : 0),
        10
      );
      expect(c[1]).toBeCloseTo(
        (a[1] + b[1]) / 2 + (axis === "y" ? bow : 0),
        10
      );
      expect(c[2]).toBeCloseTo((a[2] + b[2]) / 2, 10);
    }
  });

  it("bows reciprocal links apart so they never overlap", () => {
    const nodes = systemMapLayout();
    const byPair = new Map<string, SystemMapEdge[]>();
    for (const e of SYSTEM_MAP_EDGES) {
      const key = [e.from, e.to].sort().join("<->");
      byPair.set(key, [...(byPair.get(key) ?? []), e]);
    }
    const reciprocal = [...byPair.values()].filter(pair => pair.length === 2);
    // eos<->ai and ipc<->applications are the bidirectional pairs.
    expect(reciprocal).toHaveLength(2);
    for (const [first, second] of reciprocal) {
      const c1 = edgeCurve(first, nodes).c;
      const c2 = edgeCurve(second, nodes).c;
      const dist = Math.hypot(c1[0] - c2[0], c1[1] - c2[1], c1[2] - c2[2]);
      expect(dist).toBeGreaterThan(0.5);
    }
  });

  it("fits the camera: narrower viewports sit farther back", () => {
    const portrait = systemMapCameraDistance(0.6);
    const square = systemMapCameraDistance(1);
    const wide = systemMapCameraDistance(16 / 9);
    expect(portrait).toBeGreaterThan(square);
    // Square and wide are both height-dominated, so they agree.
    expect(square).toBeCloseTo(wide, 10);
    expect(wide).toBeGreaterThan(8);
  });

  it("maps every maturity status to a distinct hex color", () => {
    const statuses = new Set(ARCHITECTURE_STAGES.map(s => s.maturity));
    for (const m of statuses) {
      expect(MATURITY_DOT[m]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    const colors = Object.values(MATURITY_DOT);
    expect(new Set(colors).size).toBe(colors.length);
  });
});

describe("ArchitectureSystemMap3D static fallback (no WebGL)", () => {
  it("renders the static SVG map with a reason, never a canvas", () => {
    const { container } = render(<ArchitectureSystemMap3D height={400} />);
    expect(container.querySelector("canvas")).toBeNull();
    const map = screen.getByRole("img", { name: /static system map/i });
    expect(map.tagName.toLowerCase()).toBe("svg");
    expect(
      screen.getByText("Static view: WebGL is unavailable")
    ).toBeInTheDocument();
  });

  it("draws one selectable node per stage in the static map", () => {
    render(<ArchitectureSystemMap3D />);
    const map = screen.getByRole("img", { name: /static system map/i });
    const nodes = within(map).getAllByRole("button");
    expect(nodes).toHaveLength(7);
    // Default selection is the base of the stack.
    expect(nodes[0]).toHaveAttribute("aria-pressed", "true");
    expect(nodes[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Hardware / sensors")
    );
  });

  it("selecting a stage updates the detail panel and its explore link", () => {
    const { container } = render(<ArchitectureSystemMap3D />);
    const panel = () =>
      container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(panel().textContent).toContain("Hardware / sensors");

    const nav = screen.getByRole("navigation", {
      name: /system map stages/i,
    });
    fireEvent.click(within(nav).getByRole("button", { name: /on-device ai/i }));

    expect(panel().textContent).toContain("On-device AI");
    expect(panel().textContent).toContain("Experimental / Research");
    expect(panel().querySelector('a[href="/eai"]')).not.toBeNull();

    // The static map reflects the same selection.
    const map = screen.getByRole("img", { name: /static system map/i });
    const aiNode = within(map).getByRole("button", {
      name: /on-device ai/i,
    });
    expect(aiNode).toHaveAttribute("aria-pressed", "true");
  });

  it("supports arrow-key and Home/End navigation across the stage list", () => {
    const { container } = render(<ArchitectureSystemMap3D />);
    const panel = () =>
      container.querySelector('[aria-live="polite"]') as HTMLElement;
    const nav = screen.getByRole("navigation", {
      name: /system map stages/i,
    });
    const buttons = within(nav).getAllByRole("button");
    expect(buttons).toHaveLength(7);

    buttons[0].focus();
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "ArrowRight",
    });
    expect(panel().textContent).toContain("Secure boot");

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "End" });
    expect(panel().textContent).toContain("Physical action / feedback");

    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "Home",
    });
    expect(panel().textContent).toContain("Hardware / sensors");
  });

  it("legends the shipped profile path alongside stages and maturity", () => {
    render(<ArchitectureSystemMap3D />);
    expect(screen.getByText(/shipped profile: eai edge/i)).toBeInTheDocument();
  });
});
