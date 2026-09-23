/** @vitest-environment jsdom */

/**
 * HealthShowcase waveform loop (P-01). PageSpeed attributed 26.6s of
 * main-thread CPU to this chunk: the canvas ran an uncapped 60fps rAF loop
 * with shadowBlur on every frame, forever, even offscreen. These tests pin
 * the fixed behavior with a stubbed 2D context and a controllable rAF
 * queue, so a regression reintroduces the loop visibly.
 */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HealthShowcase from "../../client/src/components/HealthShowcase";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

type Ctx = {
  clearRect: ReturnType<typeof vi.fn>;
  [k: string]: unknown;
};

function mock2dContext(): Ctx {
  const gradient = { addColorStop: vi.fn() };
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    fillRect: vi.fn(),
  };
}

type IoCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

function mockIO() {
  let cb: IoCallback | null = null;
  const disconnect = vi.fn();
  class FakeIO {
    constructor(c: IoCallback) {
      cb = c;
    }
    observe() {}
    disconnect = disconnect;
    unobserve() {}
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);
  return {
    disconnect,
    fire(intersecting: boolean) {
      act(() => {
        cb?.([{ isIntersecting: intersecting }]);
      });
    },
  };
}

// Controllable rAF: callbacks run only when the test pumps them.
const rafQueue = new Map<number, FrameRequestCallback>();
let rafId = 0;
function mockRaf() {
  rafQueue.clear();
  rafId = 0;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    rafId += 1;
    rafQueue.set(rafId, cb);
    return rafId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    rafQueue.delete(id);
  });
}
/** Pump every queued frame once, 40ms apart (above the 33ms throttle). */
function pumpFrames(n: number, t0 = 10_000) {
  for (let i = 0; i < n; i++) {
    const cbs = [...rafQueue.values()];
    rafQueue.clear();
    cbs.forEach(cb => act(() => cb(t0 + i * 40)));
  }
}

function setup(reduced: boolean) {
  mockMatchMedia(reduced);
  const ctx = mock2dContext();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D
  );
  mockRaf();
  const io = mockIO();
  return { ctx, io };
}

describe("HealthShowcase waveform loop", () => {
  it("paints one frame immediately, then only loops while intersecting", () => {
    const { ctx, io } = setup(false);
    render(<HealthShowcase />);

    // Prerender/snapshot guarantee: the first frame paints on mount, before
    // any observer fires.
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    // Offscreen: no rAF loop scheduled.
    expect(rafQueue.size).toBe(0);

    io.fire(true);
    expect(rafQueue.size).toBe(1);

    pumpFrames(3);
    // 1 initial + 3 throttled frames.
    expect(ctx.clearRect).toHaveBeenCalledTimes(4);

    // Scrolled away: the loop stops entirely instead of burning frames.
    io.fire(false);
    expect(rafQueue.size).toBe(0);
  });

  it("never uses shadowBlur (the per-frame offscreen blur pass)", () => {
    const { ctx, io } = setup(false);
    render(<HealthShowcase />);
    io.fire(true);
    pumpFrames(5);
    expect((ctx as Record<string, unknown>).shadowBlur).toBeUndefined();
    // The glow is a halo stroke instead: stroke still runs every frame.
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it("paints a single static frame under reduced motion and never loops", () => {
    const { ctx, io } = setup(true);
    render(<HealthShowcase />);
    io.fire(true);
    pumpFrames(3);
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(rafQueue.size).toBe(0);
  });

  it("renders the device showcase content", () => {
    setup(false);
    render(<HealthShowcase />);
    expect(
      screen.getByRole("heading", { name: "HEALTH-KEY ULTRA" })
    ).toBeInTheDocument();
    expect(screen.getByText("Simulated Signal")).toBeInTheDocument();
  });
});
