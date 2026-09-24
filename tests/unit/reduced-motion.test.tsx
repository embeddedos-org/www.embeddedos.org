/** @vitest-environment jsdom */

/**
 * prefers-reduced-motion hook (F-23).
 *
 * Canvas components gate their ambient rAF loops behind this hook: with
 * reduced motion they paint one static frame instead of looping forever.
 */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "../../client/src/lib/reduced-motion";

afterEach(cleanup);

function mockMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  const mq = {
    get matches() {
      return current;
    },
    addEventListener: vi.fn((_t: string, cb: () => void) => {
      listeners.add(cb);
    }),
    removeEventListener: vi.fn((_t: string, cb: () => void) => {
      listeners.delete(cb);
    }),
  };
  let current = initial;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue(mq),
  });
  return {
    setMatches(v: boolean) {
      current = v;
      listeners.forEach(cb => cb());
    },
  };
}

function Probe() {
  const reduced = usePrefersReducedMotion();
  return <span data-testid="probe">{reduced ? "reduced" : "full"}</span>;
}

describe("usePrefersReducedMotion", () => {
  it("returns true when the OS asks for reduced motion", () => {
    mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("reduced");
  });

  it("returns false otherwise", () => {
    mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("full");
  });

  it("reacts when the OS preference changes live", () => {
    const { setMatches } = mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("full");
    act(() => {
      setMatches(true);
    });
    expect(screen.getByTestId("probe")).toHaveTextContent("reduced");
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)"
    );
  });

  it("reads the initial preference synchronously (no flash of motion)", () => {
    // The value comes from the useState initializer, not a post-mount
    // effect: the very first paint already reflects the OS preference.
    mockMatchMedia(true);
    const { unmount } = render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("reduced");
    unmount();
  });

  it("tracks the preference toggling back and forth", () => {
    const { setMatches } = mockMatchMedia(false);
    render(<Probe />);
    act(() => {
      setMatches(true);
    });
    expect(screen.getByTestId("probe")).toHaveTextContent("reduced");
    act(() => {
      setMatches(false);
    });
    expect(screen.getByTestId("probe")).toHaveTextContent("full");
  });

  it("unsubscribes the media-query listener on unmount", () => {
    mockMatchMedia(false);
    const { unmount } = render(<Probe />);
    const mq = (window.matchMedia as unknown as ReturnType<typeof vi.fn>).mock
      .results[0].value as {
      addEventListener: ReturnType<typeof vi.fn>;
      removeEventListener: ReturnType<typeof vi.fn>;
    };
    expect(mq.addEventListener).toHaveBeenCalledTimes(1);
    expect(mq.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    const onChange = mq.addEventListener.mock.calls[0][1];
    unmount();
    expect(mq.removeEventListener).toHaveBeenCalledTimes(1);
    expect(mq.removeEventListener).toHaveBeenCalledWith("change", onChange);
    expect(screen.queryByTestId("probe")).not.toBeInTheDocument();
  });
});
