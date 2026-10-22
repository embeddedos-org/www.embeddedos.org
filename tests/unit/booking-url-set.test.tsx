/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The real constant, not a mock: this file tests the calendar mode the site
// now ships.
const EVENT_URL = "https://calendly.com/kartikeydheer-embeddedos/30min";

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
import {
  bookingCalendarReady,
  bookingFrameUrl,
  calendlyEventUrl,
} from "../../client/src/lib/booking";

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
  it("is the team's event, and passes the page's own URL check", () => {
    expect(CALENDLY_EVENT_URL).toBe(EVENT_URL);
    expect(calendlyEventUrl(CALENDLY_EVENT_URL)).toBe(EVENT_URL);
    expect(bookingCalendarReady()).toBe(true);
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
    ["/contact", Contact, "Pick a topic and a time on our booking page."],
    [
      "/eos-boards",
      EosBoards,
      "Choose EoS boards and hardware on the booking page and pick a time.",
    ],
  ] as const)(
    "%s still links to /book rather than embedding, and offers a time there",
    (_route, Page, line) => {
      const { container } = render(<Page />);
      expect(container.querySelector(".calendly-inline-widget")).toBe(null);
      const teaser = container.querySelector('[data-booking="teaser"]');
      expect(teaser?.querySelector('a[href="/book"]')).not.toBe(null);
      expect(teaser?.textContent).toContain(line);
    }
  );

  it("/book's stepper and headings describe picking a time in the calendar", () => {
    render(<Book />);
    const steps = screen
      .getByRole("list", { name: "Booking progress" })
      .querySelectorAll("li");
    expect([...steps].map(li => li.textContent)).toEqual([
      "1Choose a topic",
      "2Pick a time",
      "3Confirmed",
    ]);
    expect(
      screen.getByRole("heading", { level: 2, name: "Pick a time" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Pick one; it goes into the booking so the right people join."
      )
    ).toBeInTheDocument();
  });
});
