/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CadEvolutionHero, {
  TOTAL_STEPS,
  clampStepIndex,
  nextStepIndex,
  prevStepIndex,
} from "../../client/src/components/CadEvolutionHero";
import { ARCHITECTURE_STAGES } from "../../client/src/data/architecture";

function installBrowserMocks({
  reducedMotion = false,
}: { reducedMotion?: boolean } = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") && reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  // No WebGL in the test env: the component must render its semantic fallback.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
}

beforeEach(() => installBrowserMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("cad evolution step helpers", () => {
  it("covers every architecture stage exactly once", () => {
    expect(TOTAL_STEPS).toBe(ARCHITECTURE_STAGES.length);
    expect(TOTAL_STEPS).toBe(7);
  });

  it("advances and retreats one step, clamped at both ends", () => {
    expect(nextStepIndex(0)).toBe(1);
    expect(nextStepIndex(6)).toBe(6);
    expect(prevStepIndex(6)).toBe(5);
    expect(prevStepIndex(0)).toBe(0);
    expect(clampStepIndex(-3)).toBe(0);
    expect(clampStepIndex(99)).toBe(6);
  });
});

describe("cad evolution hero (semantic fallback)", () => {
  it("exposes every stage as a stepper button with its short label", () => {
    render(<CadEvolutionHero />);
    expect(screen.getByLabelText("Ecosystem build steps")).toBeInTheDocument();
    for (const stage of ARCHITECTURE_STAGES) {
      const button = screen.getByRole("button", {
        name: new RegExp(`Step \\d+: ${stage.label}`),
      });
      expect(button).toBeInTheDocument();
    }
    // First stage is active initially (autoplay starts from the CAD design).
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
  });

  it("updates the explainer panel when a step is selected", () => {
    render(<CadEvolutionHero />);
    const target = ARCHITECTURE_STAGES[3];
    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`Step 4: ${target.label}`),
      })
    );
    expect(screen.getByText("Step 4 of 7")).toBeInTheDocument();
    expect(screen.getByText(target.description)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: `Explore ${target.shortLabel}` })
    ).toHaveAttribute("href", target.href);
    // Active step is marked for assistive tech.
    expect(
      screen
        .getByRole("button", { name: new RegExp(`Step 4: ${target.label}`) })
        .getAttribute("aria-current")
    ).toBe("step");
  });

  it("moves with prev/next controls and keyboard arrows", () => {
    render(<CadEvolutionHero />);
    fireEvent.click(screen.getByRole("button", { name: "Next build step" }));
    expect(screen.getByText("Step 2 of 7")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Previous build step" })
    );
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();

    const stepper = screen.getByLabelText("Ecosystem build steps");
    fireEvent.keyDown(stepper, { key: "ArrowRight" });
    expect(screen.getByText("Step 2 of 7")).toBeInTheDocument();
    fireEvent.keyDown(stepper, { key: "End" });
    expect(screen.getByText("Step 7 of 7")).toBeInTheDocument();
    fireEvent.keyDown(stepper, { key: "Home" });
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
  });

  it("auto-plays the build and stops on the finished ecosystem", () => {
    vi.useFakeTimers();
    render(<CadEvolutionHero />);
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
    // One act() per interval: each advance must flush so the effect
    // re-arms the next timeout before time moves on.
    for (let i = 0; i < 6; i++) {
      act(() => {
        vi.advanceTimersByTime(3200);
      });
    }
    expect(screen.getByText("Step 7 of 7")).toBeInTheDocument();
    // Further time does not loop back.
    act(() => {
      vi.advanceTimersByTime(3200 * 3);
    });
    expect(screen.getByText("Step 7 of 7")).toBeInTheDocument();
    // Replay restarts from the bare CAD design.
    fireEvent.click(
      screen.getByRole("button", { name: "Replay build animation" })
    );
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
  });

  it("renders the finished ecosystem statically for reduced-motion users", () => {
    installBrowserMocks({ reducedMotion: true });
    render(<CadEvolutionHero />);
    expect(screen.getByText("Step 7 of 7")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Replay build animation" })
    ).toBeInTheDocument();
  });

  it("describes the fallback when WebGL is unavailable", () => {
    render(<CadEvolutionHero />);
    expect(
      screen.getByText(/3D preview unavailable on this device/)
    ).toBeInTheDocument();
    // The story is still fully navigable.
    expect(screen.getByLabelText("Ecosystem build steps")).toBeInTheDocument();
  });
});
