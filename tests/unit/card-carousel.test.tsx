/** @vitest-environment jsdom */

/**
 * CardCarousel: the homepage's long card grids collapse to a single paged
 * row with arrow controls. These tests assert the content contract that
 * matters: every card stays in the DOM (crawlable, links clickable), the
 * arrows page the native scroll container, and reduced motion disables
 * smooth scrolling.
 */
import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CardCarousel from "../../client/src/components/CardCarousel";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function stubMatchMedia(matches: boolean) {
  const mock = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));
  vi.stubGlobal("matchMedia", mock);
  // vi.stubGlobal only touches the Node global; the lib reduced-motion hook
  // reads window.matchMedia, so define it on the jsdom window too.
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: mock,
  });
}

// The lib reduced-motion hook reads window.matchMedia in its useState
// initializer; jsdom doesn't implement it.
beforeEach(() => {
  stubMatchMedia(false);
});

/** jsdom has no layout: give the scroll track a 3-page geometry. */
function mockTrack(track: HTMLElement) {
  Object.defineProperty(track, "clientWidth", {
    configurable: true,
    get: () => 800,
  });
  Object.defineProperty(track, "scrollWidth", {
    configurable: true,
    get: () => 2400,
  });
  const scrollTo = vi.fn();
  track.scrollTo = scrollTo as unknown as typeof track.scrollTo;
  return { track, scrollTo };
}

function renderCarousel() {
  return render(
    <CardCarousel label="Product showcase" itemLabel="products">
      <div data-testid="card">EOS Kernel</div>
      <div data-testid="card">eBoot</div>
      <div data-testid="card">eBrowser</div>
    </CardCarousel>
  );
}

function trackEl(): HTMLElement {
  return screen.getByRole("region", { name: "Product showcase" })
    .firstElementChild as HTMLElement;
}

describe("CardCarousel", () => {
  it("keeps every card in the DOM so content stays crawlable", () => {
    renderCarousel();
    expect(screen.getAllByTestId("card")).toHaveLength(3);
    expect(screen.getByText("EOS Kernel")).toBeInTheDocument();
  });

  it("exposes a labelled carousel region with named arrow controls", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Product showcase" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    const { track } = mockTrack(trackEl());
    fireEvent.scroll(track);
    expect(
      screen.getByRole("button", { name: "Previous products" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next products" })
    ).toBeInTheDocument();
  });

  it("disables previous on the first page and next on the last page", () => {
    renderCarousel();
    const { track } = mockTrack(trackEl());
    // Re-run the layout effect's sync with mocked geometry.
    fireEvent.scroll(track);

    expect(
      screen.getByRole("button", { name: "Previous products" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Next products" })
    ).not.toBeDisabled();

    act(() => {
      track.scrollLeft = 1600;
    });
    fireEvent.scroll(track);
    expect(
      screen.getByRole("button", { name: "Previous products" })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Next products" })
    ).toBeDisabled();
  });

  it("pages the track by one viewport when next is clicked", () => {
    renderCarousel();
    const { track, scrollTo } = mockTrack(trackEl());
    fireEvent.scroll(track);

    fireEvent.click(screen.getByRole("button", { name: "Next products" }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ left: 800, behavior: "smooth" })
    );
  });

  it("announces the current page as the track scrolls", () => {
    renderCarousel();
    const { track } = mockTrack(trackEl());
    fireEvent.scroll(track);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();

    act(() => {
      track.scrollLeft = 800;
    });
    fireEvent.scroll(track);
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("scrolls instantly when the visitor prefers reduced motion", () => {
    stubMatchMedia(true);
    renderCarousel();
    const { track, scrollTo } = mockTrack(trackEl());
    fireEvent.scroll(track);

    fireEvent.click(screen.getByRole("button", { name: "Next products" }));
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" })
    );
  });

  it("hides the controls when every card fits on one page", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Product showcase" });
    const track = region.firstElementChild as HTMLElement;
    Object.defineProperty(track, "clientWidth", {
      configurable: true,
      get: () => 1200,
    });
    Object.defineProperty(track, "scrollWidth", {
      configurable: true,
      get: () => 1200,
    });
    fireEvent.scroll(track);

    expect(
      screen.queryByRole("button", { name: "Previous products" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next products" })
    ).not.toBeInTheDocument();
    // Cards are still all present.
    expect(screen.getAllByTestId("card")).toHaveLength(3);
  });

  it("pages with the keyboard arrow keys", () => {
    renderCarousel();
    const { scrollTo } = mockTrack(trackEl());
    const region = screen.getByRole("region", { name: "Product showcase" });
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ left: 800 })
    );
  });

  it("pages with arrow keys when focus is on the pager buttons", () => {
    renderCarousel();
    const { track, scrollTo } = mockTrack(trackEl());
    fireEvent.scroll(track);
    fireEvent.keyDown(screen.getByRole("button", { name: "Next products" }), {
      key: "ArrowRight",
    });
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ left: 800 })
    );
  });

  it("self-corrects the page count when layout settles after mount", () => {
    // The race this guards: the mount measurement can run before fonts or
    // layout settle, leaving pageCount at 1 and the controls unrendered.
    const callbacks: Array<() => void> = [];
    class MockResizeObserver {
      constructor(cb: () => void) {
        callbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    renderCarousel();
    const region = screen.getByRole("region", { name: "Product showcase" });
    const track = region.firstElementChild as HTMLElement;
    // Late-settling layout: at first everything fits on one page.
    Object.defineProperty(track, "clientWidth", {
      configurable: true,
      get: () => 1200,
    });
    Object.defineProperty(track, "scrollWidth", {
      configurable: true,
      get: () => 1200,
    });
    fireEvent.scroll(track);
    expect(
      screen.queryByRole("button", { name: "Next products" })
    ).not.toBeInTheDocument();

    // Fonts load, cards widen past one viewport: the observer fires and the
    // controls appear without any user interaction.
    Object.defineProperty(track, "scrollWidth", {
      configurable: true,
      get: () => 3600,
    });
    act(() => {
      callbacks.forEach(cb => cb());
    });
    expect(
      screen.getByRole("button", { name: "Next products" })
    ).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
