/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HeroTechStack, {
  HologramErrorBoundary,
  nextStageIndex,
} from "../../client/src/components/HeroTechStack";
import { ARCHITECTURE_STAGES } from "../../client/src/data/architecture";

type MatchMediaOptions = {
  reducedMotion?: boolean;
};

function installBrowserMocks({
  reducedMotion = false,
}: MatchMediaOptions = {}) {
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
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
}

beforeEach(() => installBrowserMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("architecture hologram progressive enhancement", () => {
  it("always exposes the complete semantic stage equivalent", async () => {
    render(<HeroTechStack />);

    expect(
      screen.getByLabelText("Reference architecture stages")
    ).toBeInTheDocument();
    for (const stage of ARCHITECTURE_STAGES) {
      const stageControl = screen.getByText(stage.shortLabel).closest("button");
      expect(stageControl).toBeInTheDocument();
      expect(stageControl).toHaveTextContent(stage.maturity);
    }
    expect(
      screen.getByText(/Illustrative reference architecture/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/eAI Edge = eNI → eIPC → eAI/)).toBeInTheDocument();
    expect(
      await screen.findByText("Static view: WebGL is unavailable")
    ).toBeInTheDocument();
  });

  it("renders the semantic fallback when the interactive renderer fails", () => {
    const onUnavailable = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    function BrokenRenderer(): never {
      throw new Error("renderer initialization failed");
    }

    render(
      <HologramErrorBoundary onUnavailable={onUnavailable}>
        <BrokenRenderer />
      </HologramErrorBoundary>
    );

    expect(
      screen.getByText("Static view: interactive renderer unavailable")
    ).toBeInTheDocument();
    expect(onUnavailable).toHaveBeenCalledTimes(1);
  });

  it("moves stage selection with arrow, Home, and End keys", () => {
    render(<HeroTechStack />);
    const hardware = screen.getByText("Hardware").closest("button");
    const secureBoot = screen.getByText("Secure boot").closest("button");
    const physicalAction = screen
      .getByText("Action + feedback")
      .closest("button");

    expect(hardware).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(hardware!, { key: "ArrowRight" });
    expect(secureBoot).toHaveAttribute("aria-pressed", "true");
    expect(secureBoot).toHaveFocus();

    fireEvent.keyDown(secureBoot!, { key: "End" });
    expect(physicalAction).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(physicalAction!, { key: "Home" });
    expect(hardware).toHaveAttribute("aria-pressed", "true");
  });

  it("provides explicit pause and resume controls", () => {
    render(<HeroTechStack />);
    const pause = screen.getByRole("button", {
      name: "Pause hologram animation",
    });

    fireEvent.click(pause);
    const resume = screen.getByRole("button", {
      name: "Resume hologram animation",
    });
    expect(resume).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(resume);
    expect(
      screen.getByRole("button", { name: "Pause hologram animation" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("starts paused and prevents animation override for reduced motion", async () => {
    installBrowserMocks({ reducedMotion: true });
    render(<HeroTechStack />);

    const control = await screen.findByRole("button", {
      name: "Animation paused for reduced motion",
    });
    expect(control).toBeDisabled();
    expect(control).toHaveAttribute("aria-pressed", "true");
    expect(control).toHaveTextContent("Motion reduced");
  });
});

describe("keyboard stage index", () => {
  it("wraps deterministically without randomness", () => {
    expect(nextStageIndex(0, "ArrowLeft")).toBe(6);
    expect(nextStageIndex(6, "ArrowRight")).toBe(0);
    expect(nextStageIndex(3, "Home")).toBe(0);
    expect(nextStageIndex(3, "End")).toBe(6);
    expect(nextStageIndex(3, "Enter")).toBe(3);
  });
});
