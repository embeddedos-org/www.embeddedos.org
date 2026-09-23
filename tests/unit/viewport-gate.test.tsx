/** @vitest-environment jsdom */

/**
 * ViewportGate (P-02): 3D chunks must not download until the canvas is near
 * the viewport. These tests drive a mocked IntersectionObserver and assert
 * the gate stays shut until intersection, then opens exactly once.
 */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ViewportGate from "../../client/src/components/ViewportGate";

afterEach(cleanup);
beforeEach(() => {
  vi.unstubAllGlobals();
});

type IoCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

function mockIO() {
  let cb: IoCallback | null = null;
  const observe = vi.fn();
  const disconnect = vi.fn();
  class FakeIO {
    constructor(c: IoCallback) {
      cb = c;
    }
    observe = observe;
    disconnect = disconnect;
    unobserve() {}
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);
  return {
    observe,
    disconnect,
    fire(intersecting: boolean) {
      act(() => {
        cb?.([{ isIntersecting: intersecting }]);
      });
    },
  };
}

describe("ViewportGate", () => {
  it("withholds children until the wrapper intersects, then reveals once", () => {
    const io = mockIO();
    render(
      <ViewportGate waitForIdle={false}>
        <span>canvas</span>
      </ViewportGate>
    );
    expect(io.observe).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("canvas")).not.toBeInTheDocument();

    io.fire(false);
    expect(screen.queryByText("canvas")).not.toBeInTheDocument();

    io.fire(true);
    expect(screen.getByText("canvas")).toBeInTheDocument();
    // One-shot: the observer is torn down after the first intersection.
    expect(io.disconnect).toHaveBeenCalled();
  });

  it("renders children immediately when IntersectionObserver is unavailable", () => {
    // jsdom has no IntersectionObserver unless a test stubs one.
    expect(typeof IntersectionObserver).toBe("undefined");
    render(
      <ViewportGate waitForIdle={false}>
        <span>canvas</span>
      </ViewportGate>
    );
    expect(screen.getByText("canvas")).toBeInTheDocument();
  });

  it("waits for an idle callback before revealing when waitForIdle", () => {
    const io = mockIO();
    const ric = vi.fn((cb: () => void) => {
      cb();
      return 7;
    });
    const cic = vi.fn();
    vi.stubGlobal("requestIdleCallback", ric);
    vi.stubGlobal("cancelIdleCallback", cic);

    render(
      <ViewportGate>
        <span>canvas</span>
      </ViewportGate>
    );
    io.fire(true);
    expect(ric).toHaveBeenCalledTimes(1);
    expect(screen.getByText("canvas")).toBeInTheDocument();
  });

  it("does not touch requestIdleCallback when waitForIdle is false", () => {
    const io = mockIO();
    const ric = vi.fn();
    vi.stubGlobal("requestIdleCallback", ric);
    vi.stubGlobal("cancelIdleCallback", vi.fn());

    render(
      <ViewportGate waitForIdle={false}>
        <span>canvas</span>
      </ViewportGate>
    );
    io.fire(true);
    expect(ric).not.toHaveBeenCalled();
    expect(screen.getByText("canvas")).toBeInTheDocument();
  });
});
