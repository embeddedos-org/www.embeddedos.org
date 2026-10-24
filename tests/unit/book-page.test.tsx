/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const google = vi.hoisted(() => ({ embed: null as string | null }));

vi.mock("../../client/src/data/foundation", async importOriginal => {
  const actual =
    await importOriginal<typeof import("../../client/src/data/foundation")>();
  return {
    ...actual,
    get GOOGLE_APPOINTMENTS_EMBED_URL() {
      return google.embed;
    },
  };
});

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
import { BOOKING_TOPICS } from "../../client/src/data/booking";
import { OPEN_CONTACT_EVENT } from "../../client/src/lib/contact-form";
import Book from "../../client/src/pages/Book";

const EMBED =
  "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=?gv=true";

type IoCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let reveal: () => void = () => {};

beforeEach(() => {
  google.embed = null;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
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
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const stepLabels = () =>
  [
    ...screen
      .getByRole("list", { name: "How booking works" })
      .querySelectorAll("li"),
  ].map(li => li.textContent);

describe("the topics", () => {
  it("are guidance with their durations, not inputs", () => {
    google.embed = EMBED;
    const { container } = render(<Book />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(container.querySelector("fieldset, input")).toBe(null);
    expect(BOOKING_TOPICS.length).toBeGreaterThanOrEqual(4);
    const section = screen
      .getByRole("heading", {
        level: 2,
        name: "What would you like to talk about?",
      })
      .closest("section") as HTMLElement;
    const cards = section.querySelectorAll("li");
    expect(cards).toHaveLength(BOOKING_TOPICS.length);
    BOOKING_TOPICS.forEach((topic, i) => {
      expect(cards[i]).toHaveTextContent(topic.title);
      expect(cards[i]).toHaveTextContent(topic.line);
      expect(cards[i]).toHaveTextContent(`${topic.minutes} min`);
    });
    expect(
      screen.getByText(
        "Mention your topic in the booking form so the right people join."
      )
    ).toBeInTheDocument();
  });
});

describe("with an embed URL", () => {
  it("frames the calendar without waiting for a topic", () => {
    google.embed = EMBED;
    const { container } = render(<Book />);
    reveal();
    const frame = screen.getByTitle(CALENDAR_FRAME_TITLE);
    expect(frame.tagName).toBe("IFRAME");
    expect(frame).toHaveAttribute("src", EMBED);
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(
      container.querySelector('[data-booking="google-calendar"]')
    ).not.toBe(null);
    expect(container.querySelector('[data-booking="fallback"]')).toBe(null);
  });

  it("lists the steps as a guide, with no progress state", () => {
    google.embed = EMBED;
    const { container } = render(<Book />);
    expect(stepLabels()).toEqual([
      "1Choose a topic",
      "2Pick a time",
      "3Confirmed",
    ]);
    expect(container.querySelector("[aria-current]")).toBe(null);
    expect(
      screen.getByRole("heading", { level: 2, name: "Pick a time" })
    ).toBeInTheDocument();
  });

  it("describes the calendar and Google's confirmation", () => {
    google.embed = EMBED;
    render(<Book />);
    expect(
      screen.getByText(
        "A 30-minute video call, with a link in your confirmation email."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Check the time zone the calendar shows before you pick a time. Google's confirmation email gives the booked time."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Yes. Google's confirmation email has a link to cancel the booking; to move it, cancel and book a new time."
      )
    ).toBeInTheDocument();
  });

  it("has no confirmed panel: Google's frame reports no booking", () => {
    google.embed = EMBED;
    const { container } = render(<Book />);
    expect(screen.queryByText("You're booked")).toBe(null);
    expect(container.querySelector('[data-booking-state="confirmed"]')).toBe(
      null
    );
  });
});

describe("without an embed URL", () => {
  it("offers to arrange the call by email, under a generic subject", () => {
    const opened = vi.fn();
    window.addEventListener(OPEN_CONTACT_EVENT, opened);
    const { container } = render(<Book />);
    reveal();
    expect(container.querySelector("iframe")).toBe(null);
    expect(
      screen.getByText(
        "Send us a few times that suit you and we will set up your call."
      )
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Email us to arrange it/ })
    );
    expect(opened).toHaveBeenCalledTimes(1);
    expect((opened.mock.calls[0][0] as CustomEvent).detail).toEqual({
      topic: "contact",
      subject: "Meeting request",
    });
    window.removeEventListener(OPEN_CONTACT_EVENT, opened);
  });

  it("promises an email reply and no confirmation from Google", () => {
    const { container } = render(<Book />);
    expect(
      screen.getByText(
        "A 30-minute call, at a time we agree with you by email."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Reply to our email about the call to move or cancel it.",
        { exact: false }
      )
    ).toBeInTheDocument();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/confirmation/i);
    expect(text).not.toMatch(/google/i);
    expect(text).not.toMatch(/calendar shows/i);
  });

  it("asks for times by email instead of picking one", () => {
    const { container } = render(<Book />);
    expect(stepLabels()).toEqual([
      "1Choose a topic",
      "2Suggest times",
      "3Confirmed by email",
    ]);
    expect(
      screen.getByRole("heading", { level: 2, name: "Suggest a few times" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Mention your topic in your email so the right people join."
      )
    ).toBeInTheDocument();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/pick a time/i);
    expect(text).not.toMatch(/booking form/i);
  });
});

describe("the rest of the page", () => {
  it("has one h1, what to expect, the time-zone note and a FAQ", () => {
    google.embed = EMBED;
    const { container } = render(<Book />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Talk to the EmbeddedOS team/,
      })
    ).toBeInTheDocument();
    for (const name of ["What to expect", "Your time zone", "Questions"])
      expect(
        screen.getByRole("heading", { level: 2, name })
      ).toBeInTheDocument();
    const questions = [...container.querySelectorAll("details summary")].map(
      s => s.textContent
    );
    expect(questions).toEqual([
      "How long is the call?",
      "Is it free?",
      "Can I reschedule or cancel?",
      "Who will be there?",
    ]);
    expect(container.querySelector("details[open]")).toBe(null);
  });
});
