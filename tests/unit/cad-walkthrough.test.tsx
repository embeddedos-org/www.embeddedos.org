/** @vitest-environment jsdom */

/**
 * CAD-to-product walkthrough — the Architecture page's default diagram.
 *
 * The pure step/part data is unit-tested directly; the component shell is
 * tested through its no-WebGL static fallback (the path every CI/test
 * environment takes), which must carry the same 8 steps, selection behavior,
 * and keyboard operability as the 3D scene.
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

// The lazy 3D scene is stubbed: the shell's contract with it (step,
// reducedMotion, motionPaused) is what these tests verify. The scene's own
// gating of autoRotate / build animation / pulsing on those props lives in
// CadWalkthroughScene.tsx.
vi.mock("../../client/src/components/CadWalkthroughScene", () => ({
  default: ({
    step,
    reducedMotion,
    motionPaused,
  }: {
    step: number;
    reducedMotion: boolean;
    motionPaused: boolean;
  }) => (
    <div
      data-testid="cad-scene-stub"
      data-step={step}
      data-reduced-motion={String(reducedMotion)}
      data-motion-paused={String(motionPaused)}
    />
  ),
}));

import CadWalkthrough3D from "../../client/src/components/CadWalkthrough3D";
import { ARCHITECTURE_STAGES } from "../../client/src/data/architecture";
import {
  BOARD_PARTS,
  MATURITY_DOT,
  MAX_PART_LABELS,
  WALKTHROUGH_STEPS,
  activeStepLabels,
  builtParts,
  isPartBuilt,
  nextWalkthroughStep,
} from "../../client/src/components/cad-walkthrough-data";

function installBrowserMocks({
  reducedMotion = false,
  webgl = false,
}: {
  reducedMotion?: boolean;
  webgl?: boolean;
} = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  // WebGL available or not per test: the shell must render its static
  // fallback when the canvas has no context.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    webgl ? ({} as unknown as WebGLRenderingContext) : null
  );
}

beforeEach(() => installBrowserMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("walkthrough steps", () => {
  it("has 8 steps: the CAD drawing plus the seven architecture stages", () => {
    expect(WALKTHROUGH_STEPS).toHaveLength(8);
    const [cad, ...stages] = WALKTHROUGH_STEPS;
    expect(cad.key).toBe("cad");
    expect(cad.label).toBe("CAD drawing");
    expect(cad.maturity).toBeNull();
    expect(cad.href).toBeNull();
    expect(cad.stageIndex).toBeNull();
    expect(stages.map(s => s.key)).toEqual(ARCHITECTURE_STAGES.map(s => s.id));
  });

  it("mirrors the stage data 1:1 with no invented facts", () => {
    for (const step of WALKTHROUGH_STEPS.slice(1)) {
      const stage = ARCHITECTURE_STAGES[step.stageIndex!];
      expect(step.label).toBe(stage.label);
      expect(step.description).toBe(stage.description);
      expect(step.maturity).toBe(stage.maturity);
      expect(step.products).toEqual([...stage.products]);
      expect(step.href).toBe(stage.href);
      expect(step.color).toBe(stage.color);
    }
  });
});

describe("board parts", () => {
  it("builds parts monotonically: every step adds at least one part", () => {
    let previous = 0;
    for (let step = 0; step <= 7; step++) {
      const count = builtParts(step).length;
      if (step === 0) {
        // Step 0 is the bare CAD drawing: nothing built yet.
        expect(count).toBe(0);
      } else {
        expect(count).toBeGreaterThan(previous);
      }
      previous = count;
    }
    expect(previous).toBe(BOARD_PARTS.length);
  });

  it("assigns every part to a real stage step (1..7)", () => {
    for (const part of BOARD_PARTS) {
      expect(part.buildStep).toBeGreaterThanOrEqual(1);
      expect(part.buildStep).toBeLessThanOrEqual(7);
      expect(isPartBuilt(part.buildStep, part.buildStep)).toBe(true);
      expect(isPartBuilt(part.buildStep - 1, part.buildStep)).toBe(false);
    }
  });

  it("labels the active step's new parts, capped for perf", () => {
    for (let step = 0; step <= 7; step++) {
      const labels = activeStepLabels(step);
      expect(labels.length).toBeLessThanOrEqual(MAX_PART_LABELS);
      for (const part of labels) {
        expect(part.buildStep).toBe(step);
        expect(part.label.trim().length).toBeGreaterThan(0);
        expect(part.labelAt).toHaveLength(3);
        expect(part.labelAt.every(v => Number.isFinite(v))).toBe(true);
      }
    }
    // Step 0 adds nothing, so it labels nothing.
    expect(activeStepLabels(0)).toHaveLength(0);
  });

  it("maps every maturity status to a distinct hex color", () => {
    const statuses = new Set(ARCHITECTURE_STAGES.map(s => s.maturity));
    for (const m of statuses) {
      expect(MATURITY_DOT[m]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    const colors = Object.values(MATURITY_DOT);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it("navigates all 8 steps with arrows, Home/End, and wrap-around", () => {
    expect(nextWalkthroughStep(0, "ArrowRight")).toBe(1);
    expect(nextWalkthroughStep(7, "ArrowRight")).toBe(0);
    expect(nextWalkthroughStep(0, "ArrowLeft")).toBe(7);
    expect(nextWalkthroughStep(3, "ArrowDown")).toBe(4);
    expect(nextWalkthroughStep(3, "ArrowUp")).toBe(2);
    expect(nextWalkthroughStep(4, "Home")).toBe(0);
    expect(nextWalkthroughStep(4, "End")).toBe(7);
    expect(nextWalkthroughStep(4, "Enter")).toBe(4);
  });
});

describe("CadWalkthrough3D static fallback (no WebGL)", () => {
  it("renders the static SVG exploded view with a reason, never a canvas", () => {
    const { container } = render(<CadWalkthrough3D height={400} />);
    expect(container.querySelector("canvas")).toBeNull();
    const view = screen.getByRole("img", { name: /static exploded view/i });
    expect(view.tagName.toLowerCase()).toBe("svg");
    expect(
      screen.getByText("Static view: WebGL is unavailable")
    ).toBeInTheDocument();
  });

  it("draws one selectable step per walkthrough step in the static view", () => {
    render(<CadWalkthrough3D />);
    const view = screen.getByRole("img", { name: /static exploded view/i });
    const steps = within(view).getAllByRole("button");
    expect(steps).toHaveLength(8);
    // Default selection is the CAD drawing.
    expect(steps[0]).toHaveAttribute("aria-pressed", "true");
    expect(steps[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("CAD drawing")
    );
  });

  it("selecting a step updates the detail panel and its explore link", () => {
    const { container } = render(<CadWalkthrough3D />);
    const panel = () =>
      container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(panel().textContent).toContain("CAD drawing");

    const nav = screen.getByRole("navigation", {
      name: /cad walkthrough steps/i,
    });
    fireEvent.click(within(nav).getByRole("button", { name: /on-device ai/i }));

    expect(panel().textContent).toContain("On-device AI");
    expect(panel().textContent).toContain("Experimental / Research");
    expect(panel().querySelector('a[href="/eai"]')).not.toBeNull();

    // The static view reflects the same selection.
    const view = screen.getByRole("img", { name: /static exploded view/i });
    const aiStep = within(view).getByRole("button", {
      name: /on-device ai/i,
    });
    expect(aiStep).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the shipped eAI edge profile on the on-device AI step", () => {
    const { container } = render(<CadWalkthrough3D />);
    const panel = () =>
      container.querySelector('[aria-live="polite"]') as HTMLElement;
    const nav = screen.getByRole("navigation", {
      name: /cad walkthrough steps/i,
    });
    fireEvent.click(within(nav).getByRole("button", { name: /on-device ai/i }));
    expect(panel().textContent).toMatch(/eAI Edge/);
    expect(panel().textContent).toMatch(/eNI → eIPC → eAI/);
  });

  it("supports arrow-key and Home/End navigation across the stepper", () => {
    const { container } = render(<CadWalkthrough3D />);
    const panel = () =>
      container.querySelector('[aria-live="polite"]') as HTMLElement;
    const nav = screen.getByRole("navigation", {
      name: /cad walkthrough steps/i,
    });
    const buttons = within(nav).getAllByRole("button");
    expect(buttons).toHaveLength(8);

    buttons[0].focus();
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "ArrowRight",
    });
    expect(panel().textContent).toContain("Hardware / sensors");

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "End" });
    expect(panel().textContent).toContain("Physical action / feedback");

    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "Home",
    });
    expect(panel().textContent).toContain("CAD drawing");
  });

  it("disables the pause control and labels it when reduced motion is on", async () => {
    installBrowserMocks({ webgl: true, reducedMotion: true });
    render(<CadWalkthrough3D />);
    // The 3D path renders (stubbed scene) and is told to hold still.
    const stub = await screen.findByTestId("cad-scene-stub");
    expect(stub).toHaveAttribute("data-reduced-motion", "true");
    expect(stub).toHaveAttribute("data-motion-paused", "true");
    const pause = screen.getByRole("button", {
      name: /animation paused for reduced motion/i,
    });
    expect(pause).toBeDisabled();
    expect(pause).toHaveTextContent(/motion reduced/i);
  });
});

describe("CadWalkthrough3D motion gating (WebGL path)", () => {
  beforeEach(() => installBrowserMocks({ webgl: true }));

  it("orbits by default: the scene gets motionPaused=false", async () => {
    render(<CadWalkthrough3D />);
    const stub = await screen.findByTestId("cad-scene-stub");
    expect(stub).toHaveAttribute("data-reduced-motion", "false");
    expect(stub).toHaveAttribute("data-motion-paused", "false");
  });

  it("pausing the auto-orbit flips motionPaused on the scene", async () => {
    render(<CadWalkthrough3D />);
    await screen.findByTestId("cad-scene-stub");
    fireEvent.click(screen.getByRole("button", { name: /pause auto-orbit/i }));
    expect(screen.getByTestId("cad-scene-stub")).toHaveAttribute(
      "data-motion-paused",
      "true"
    );
    expect(
      screen.getByRole("button", { name: /resume auto-orbit/i })
    ).toBeInTheDocument();
  });

  it("advancing the stepper updates the step passed to the scene", async () => {
    render(<CadWalkthrough3D />);
    await screen.findByTestId("cad-scene-stub");
    const nav = screen.getByRole("navigation", {
      name: /cad walkthrough steps/i,
    });
    fireEvent.click(within(nav).getByRole("button", { name: /secure boot/i }));
    expect(screen.getByTestId("cad-scene-stub")).toHaveAttribute(
      "data-step",
      "2"
    );
  });
});
