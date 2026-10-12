/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const EVENT_URL = "https://calendly.com/embeddedos-team/30min";

vi.mock("../../client/src/data/foundation", async importOriginal => ({
  ...(await importOriginal<
    typeof import("../../client/src/data/foundation")
  >()),
  CALENDLY_EVENT_URL: "https://calendly.com/embeddedos-team/30min",
}));

vi.mock("wouter", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { CALENDLY_EVENT_URL } from "../../client/src/data/foundation";
import Contact from "../../client/src/pages/Contact";
import EosBoards from "../../client/src/pages/EosBoards";
import Book from "../../client/src/pages/Book";
import { bookingFrameUrl } from "../../client/src/lib/booking";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
  );
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("once CALENDLY_EVENT_URL is set", () => {
  it("is set for this file", () => {
    expect(CALENDLY_EVENT_URL).toBe(EVENT_URL);
  });

  it("/book embeds the calendar for that URL once a topic is chosen", () => {
    const { container } = render(<Book />);
    expect(container.querySelector(".calendly-inline-widget")).toBe(null);
    fireEvent.click(screen.getByRole("radio", { name: /Platform demo/ }));
    const widgets = container.querySelectorAll<HTMLElement>(
      ".calendly-inline-widget"
    );
    expect(widgets.length).toBe(1);
    expect(widgets[0].dataset.url).toBe(
      bookingFrameUrl(EVENT_URL, "Platform demo")
    );
    expect(container.querySelector('[data-booking="calendly"]')).not.toBe(null);
    expect(container.querySelector('[data-booking="fallback"]')).toBe(null);
  });

  it.each([
    ["/contact", Contact],
    ["/eos-boards", EosBoards],
  ] as const)(
    "%s still links to /book rather than embedding",
    (_route, Page) => {
      const { container } = render(<Page />);
      expect(container.querySelector(".calendly-inline-widget")).toBe(null);
      expect(
        container.querySelector('[data-booking="teaser"] a[href="/book"]')
      ).not.toBe(null);
    }
  );
});
