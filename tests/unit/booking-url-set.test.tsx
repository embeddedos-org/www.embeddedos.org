/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The real constants, not mocks: this file tests the calendar the site ships,
// the owner's Google Calendar appointment schedule.
const EMBED_URL =
  "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=?gv=true";
const BOOKING_PAGE = "https://calendar.app.google/PPzWao4AzvXtZeva6";

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

import { CALENDAR_FRAME_TITLE } from "../../client/src/components/BookingCalendar";
import {
  GOOGLE_APPOINTMENTS_EMBED_URL,
  GOOGLE_BOOKING_PAGE_URL,
} from "../../client/src/data/foundation";
import Contact from "../../client/src/pages/Contact";
import EosBoards from "../../client/src/pages/EosBoards";
import Book from "../../client/src/pages/Book";
import {
  appointmentsEmbedUrl,
  bookingCalendarReady,
  bookingPageLink,
  bookingPageUrl,
} from "../../client/src/lib/booking";

type IoCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let reveal: () => void = () => {};

beforeEach(() => {
  const callbacks: IoCallback[] = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IoCallback) {
        callbacks.push(cb);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
  );
  reveal = () =>
    act(() => {
      for (const cb of callbacks) cb([{ isIntersecting: true }]);
    });
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

describe("the owner's Google Calendar appointment schedule", () => {
  it("is the schedule the owner gave, and passes the page's own URL checks", () => {
    expect(GOOGLE_APPOINTMENTS_EMBED_URL).toBe(EMBED_URL);
    expect(GOOGLE_BOOKING_PAGE_URL).toBe(BOOKING_PAGE);
    expect(appointmentsEmbedUrl(GOOGLE_APPOINTMENTS_EMBED_URL)).toBe(EMBED_URL);
    expect(bookingPageUrl(GOOGLE_BOOKING_PAGE_URL)).toBe(BOOKING_PAGE);
    expect(bookingCalendarReady()).toBe(true);
    expect(bookingPageLink()).toBe(BOOKING_PAGE);
  });

  it("/book frames that schedule, titled, with the booking page as a fallback link", () => {
    const { container } = render(<Book />);
    expect(container.querySelector("iframe")).toBe(null);
    reveal();
    const frames = container.querySelectorAll("iframe");
    expect(frames).toHaveLength(1);
    expect(frames[0]).toHaveAttribute("src", EMBED_URL);
    expect(frames[0]).toHaveAttribute("title", CALENDAR_FRAME_TITLE);
    expect(frames[0]).toHaveAttribute("loading", "lazy");
    const link = screen.getByRole("link", { name: /Open the booking page/ });
    expect(link).toHaveAttribute("href", BOOKING_PAGE);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")?.split(" ")).toContain("noopener");
    expect(container.querySelector('[data-booking="fallback"]')).toBe(null);
  });

  it.each([
    [
      "/contact",
      Contact,
      "Pick a time on our booking page and tell us your topic.",
    ],
    [
      "/eos-boards",
      EosBoards,
      "Pick a time on the booking page and mention EoS boards and hardware.",
    ],
  ] as const)(
    "%s still links to /book rather than framing, and offers a time there",
    (_route, Page, line) => {
      const { container } = render(<Page />);
      expect(container.querySelector("iframe")).toBe(null);
      const teaser = container.querySelector('[data-booking="teaser"]');
      expect(teaser?.querySelector('a[href="/book"]')).not.toBe(null);
      expect(teaser?.textContent).toContain(line);
    }
  );

  it("/book's steps and headings describe picking a time in the calendar", () => {
    render(<Book />);
    const steps = screen
      .getByRole("list", { name: "How booking works" })
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
        "Mention your topic in the booking form so the right people join."
      )
    ).toBeInTheDocument();
  });
});
