/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const calendly = vi.hoisted(() => ({ url: null as string | null }));

vi.mock("../../client/src/data/foundation", async importOriginal => {
  const actual =
    await importOriginal<typeof import("../../client/src/data/foundation")>();
  return {
    ...actual,
    get CALENDLY_EVENT_URL() {
      return calendly.url;
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

import { resetCalendlyLoader } from "../../client/src/components/BookingCalendar";
import { BRAND_COLORS } from "../../client/src/data/brand";
import { BOOKING_TOPICS } from "../../client/src/data/booking";
import {
  CALENDLY_ORIGIN,
  CALENDLY_THEME,
  INITIAL_BOOKING,
  bookingFrameUrl,
  bookingReducer,
  type BookingNotice,
  type BookingState,
} from "../../client/src/lib/booking";
import { OPEN_CONTACT_EVENT } from "../../client/src/lib/contact-form";
import Book from "../../client/src/pages/Book";

const EVENT_URL = "https://calendly.com/embeddedos-team/30min";
const EVENT = "https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2";
const NOTICE: BookingNotice = {
  event_uri: EVENT,
  invitee_uri: `${EVENT}/invitees/AAAAAAAAAAAAAAAA`,
  page: "/book",
};

function mockMatchMedia(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

const radio = (title: string) =>
  screen.getByRole("radio", { name: new RegExp(title) });

const widget = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".calendly-inline-widget");

const currentStep = () =>
  within(screen.getByRole("list", { name: "Booking progress" }))
    .getAllByRole("listitem")
    .findIndex(li => li.getAttribute("aria-current") === "step");

async function schedule(origin = CALENDLY_ORIGIN) {
  await act(async () => {
    window.dispatchEvent(
      new MessageEvent("message", {
        origin,
        data: {
          event: "calendly.event_scheduled",
          payload: {
            event: { uri: NOTICE.event_uri },
            invitee: { uri: NOTICE.invitee_uri },
          },
        },
      })
    );
  });
}

beforeEach(() => {
  calendly.url = null;
  mockMatchMedia(false);
  resetCalendlyLoader();
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
});

afterEach(() => {
  cleanup();
  document.head
    .querySelectorAll(
      '[src^="https://assets.calendly.com"], [href^="https://assets.calendly.com"]'
    )
    .forEach(el => el.remove());
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the booking reducer", () => {
  const picked: BookingState = bookingReducer(INITIAL_BOOKING, {
    type: "select",
    topic: "research",
  });

  it("starts on the topic step with nothing chosen", () => {
    expect(INITIAL_BOOKING).toEqual({
      step: "topic",
      topic: null,
      frame: "idle",
      notice: null,
    });
  });

  it("moves to the time step and starts loading when a topic is picked", () => {
    expect(picked).toEqual({
      step: "time",
      topic: "research",
      frame: "loading",
      notice: null,
    });
  });

  it("ignores picking the topic that is already picked", () => {
    const ready = bookingReducer(picked, { type: "frame-ready" });
    expect(bookingReducer(ready, { type: "select", topic: "research" })).toBe(
      ready
    );
  });

  it("reloads the calendar when the topic changes", () => {
    const ready = bookingReducer(picked, { type: "frame-ready" });
    expect(bookingReducer(ready, { type: "select", topic: "boards" })).toEqual({
      step: "time",
      topic: "boards",
      frame: "loading",
      notice: null,
    });
  });

  it("marks the frame ready or failed only while a time is being picked", () => {
    expect(bookingReducer(picked, { type: "frame-ready" }).frame).toBe("ready");
    expect(bookingReducer(picked, { type: "frame-failed" }).frame).toBe(
      "failed"
    );
    expect(bookingReducer(INITIAL_BOOKING, { type: "frame-ready" })).toBe(
      INITIAL_BOOKING
    );
    expect(bookingReducer(INITIAL_BOOKING, { type: "frame-failed" })).toBe(
      INITIAL_BOOKING
    );
  });

  it("confirms a booking only after a topic and a time step", () => {
    expect(
      bookingReducer(INITIAL_BOOKING, { type: "scheduled", notice: NOTICE })
    ).toBe(INITIAL_BOOKING);
    expect(
      bookingReducer(picked, { type: "scheduled", notice: NOTICE })
    ).toEqual({ ...picked, step: "confirmed", notice: NOTICE });
  });

  it("holds the confirmed state against later picks and messages", () => {
    const done = bookingReducer(picked, { type: "scheduled", notice: NOTICE });
    expect(bookingReducer(done, { type: "select", topic: "boards" })).toBe(
      done
    );
    expect(bookingReducer(done, { type: "scheduled", notice: NOTICE })).toBe(
      done
    );
    expect(bookingReducer(done, { type: "frame-failed" })).toBe(done);
  });

  it("starts over on restart", () => {
    const done = bookingReducer(picked, { type: "scheduled", notice: NOTICE });
    expect(bookingReducer(done, { type: "restart" })).toBe(INITIAL_BOOKING);
  });
});

describe("the calendar URL", () => {
  it("prefills the topic as the first answer and themes the frame", () => {
    const url = new URL(bookingFrameUrl(EVENT_URL, "Research collaboration"));
    expect(url.origin + url.pathname).toBe(EVENT_URL);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      background_color: "0b1d3a",
      text_color: "ffffff",
      primary_color: "f97316",
      a1: "Research collaboration",
    });
  });

  it("encodes the answer so Calendly's widget.js reads it back unchanged", () => {
    const raw = new URL(bookingFrameUrl(EVENT_URL, "EoS boards and hardware"))
      .search;
    expect(raw).not.toContain("+");
    const asWidgetJsReadsIt = Object.fromEntries(
      raw
        .slice(1)
        .split("&")
        .map(pair => pair.split("="))
        .map(([key, value]) => [key, decodeURIComponent(value)])
    );
    expect(asWidgetJsReadsIt.a1).toBe("EoS boards and hardware");
  });

  it("sends no answer before a topic is chosen", () => {
    expect(
      new URL(bookingFrameUrl(EVENT_URL, null)).searchParams.has("a1")
    ).toBe(false);
  });

  it("takes its colours from the site's brand tokens", () => {
    const css = readFileSync(
      path.resolve(__dirname, "../../client/src/index.css"),
      "utf8"
    );
    const token = (name: string) =>
      css
        .match(
          new RegExp(`--color-${name}:[^;]*;\\s*/\\* (#[0-9A-Fa-f]{6}) \\*/`)
        )?.[1]
        ?.toLowerCase();
    const brand = (name: string) =>
      BRAND_COLORS.find(c => c.name === name)?.hex.toLowerCase();
    expect(`#${CALENDLY_THEME.background_color}`).toBe(token("brand-navy"));
    expect(`#${CALENDLY_THEME.background_color}`).toBe(brand("Deep Navy"));
    expect(`#${CALENDLY_THEME.primary_color}`).toBe(token("brand-amber"));
    expect(`#${CALENDLY_THEME.primary_color}`).toBe(brand("Signal Orange"));
  });
});

describe("the topic picker", () => {
  it("offers every topic as a radio card with its duration, none chosen yet", () => {
    render(<Book />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(BOOKING_TOPICS.length);
    expect(BOOKING_TOPICS.length).toBeGreaterThanOrEqual(4);
    for (const topic of BOOKING_TOPICS) {
      const input = radio(topic.title) as HTMLInputElement;
      expect(input.type).toBe("radio");
      expect(input.name).toBe("booking-topic");
      expect(input.checked).toBe(false);
      expect(input.closest("label")).toHaveTextContent(`${topic.minutes} min`);
    }
    expect(screen.getByRole("group", { name: "Topic of the call" })).toBe(
      radios[0].closest("fieldset")
    );
    expect(currentStep()).toBe(0);
  });

  it("advances the stepper and opens the calendar for the chosen topic", () => {
    calendly.url = EVENT_URL;
    const { container } = render(<Book />);
    expect(widget(container)).toBe(null);
    fireEvent.click(radio("Partnership or OEM"));
    expect((radio("Partnership or OEM") as HTMLInputElement).checked).toBe(
      true
    );
    expect(currentStep()).toBe(1);
    expect(widget(container)?.dataset.url).toBe(
      bookingFrameUrl(EVENT_URL, "Partnership or OEM")
    );
    fireEvent.click(radio("EoS boards and hardware"));
    expect(
      new URL(widget(container)?.dataset.url ?? "").searchParams.get("a1")
    ).toBe("EoS boards and hardware");
    expect(
      screen.getByRole("link", {
        name: /open the booking page on calendly.com/,
      })
    ).toHaveAttribute(
      "href",
      bookingFrameUrl(EVENT_URL, "EoS boards and hardware")
    );
  });

  it("without an event URL, offers to arrange the chosen call by email", () => {
    const opened = vi.fn();
    window.addEventListener(OPEN_CONTACT_EVENT, opened);
    const { container } = render(<Book />);
    fireEvent.click(radio("Partnership or OEM"));
    expect(widget(container)).toBe(null);
    fireEvent.click(
      screen.getByRole("button", { name: /Email us to arrange it/ })
    );
    expect(opened).toHaveBeenCalledTimes(1);
    expect((opened.mock.calls[0][0] as CustomEvent).detail).toEqual({
      topic: "partners",
      subject: "Meeting request: Partnership or OEM",
    });
    window.removeEventListener(OPEN_CONTACT_EVENT, opened);
  });

  it("names the chosen topic in the email fallback in its own case", () => {
    render(<Book />);
    fireEvent.click(radio("EoS boards and hardware"));
    expect(
      screen.getByText(
        "Send us a few times that suit you and we will set up your “EoS boards and hardware” call."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/eos boards and hardware/)).toBe(null);
  });
});

describe("the confirmed state", () => {
  it("confirms a booking Calendly reports, notifies the inboxes, and locks the picker", async () => {
    calendly.url = EVENT_URL;
    const post = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", post);
    render(<Book />);
    fireEvent.click(radio("Research collaboration"));
    await schedule();
    const heading = screen.getByRole("heading", { name: "You're booked" });
    expect(heading).toHaveFocus();
    expect(currentStep()).toBe(2);
    expect(
      screen.getByText(/Research collaboration · 30 min/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explore EoS boards/ })
    ).toHaveAttribute("href", "/eos-boards");
    expect(screen.getByRole("link", { name: /Back to home/ })).toHaveAttribute(
      "href",
      "/"
    );
    for (const input of screen.getAllByRole("radio"))
      expect(input).toBeDisabled();
    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0][0]).toBe("/api/booking.php");
    expect(JSON.parse(post.mock.calls[0][1].body)).toEqual(NOTICE);
    expect(document.querySelectorAll(".book-confetti").length).toBeGreaterThan(
      0
    );
  });

  it("ignores a scheduled message from anywhere but calendly.com", async () => {
    calendly.url = EVENT_URL;
    const post = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", post);
    render(<Book />);
    fireEvent.click(radio("Platform demo"));
    await schedule("https://calendly.com.example.com");
    expect(screen.queryByRole("heading", { name: "You're booked" })).toBe(null);
    expect(post).not.toHaveBeenCalled();
    expect(currentStep()).toBe(1);
  });

  it("skips the confetti for reduced motion and can start over", async () => {
    calendly.url = EVENT_URL;
    mockMatchMedia(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    render(<Book />);
    fireEvent.click(radio("University or education"));
    await schedule();
    expect(
      screen.getByRole("heading", { name: "You're booked" })
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".book-confetti")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Book another call" }));
    expect(currentStep()).toBe(0);
    for (const input of screen.getAllByRole("radio")) {
      expect(input).toBeEnabled();
      expect((input as HTMLInputElement).checked).toBe(false);
    }
  });
});

describe("the rest of the page", () => {
  it("has one h1, what to expect, the time-zone note and a FAQ", () => {
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

  it("without an event URL, promises an email reply and no Calendly confirmation", () => {
    const { container } = render(<Book />);
    expect(
      screen.getByText("Choose a topic above to arrange the call by email.")
    ).toBeInTheDocument();
    fireEvent.click(radio("EoS boards and hardware"));
    expect(
      screen.getByText(
        "A 30-minute call, at a time we agree with you by email."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Reply to our email about the call to move or cancel it.",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/confirmation/i);
    expect(text).not.toMatch(/calendly/i);
    expect(text).not.toMatch(/calendar lets you/i);
  });

  it("without an event URL, asks for times by email instead of picking one", () => {
    const { container } = render(<Book />);
    fireEvent.click(radio("EoS boards and hardware"));
    const steps = screen
      .getByRole("list", { name: "Booking progress" })
      .querySelectorAll("li");
    expect([...steps].map(li => li.textContent)).toEqual([
      "Choose a topic (done)",
      "2Suggest times",
      "3Confirmed by email",
    ]);
    expect(
      screen.getByRole("heading", { level: 2, name: "Suggest a few times" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Pick one; it goes into the subject of your email so the right people join."
      )
    ).toBeInTheDocument();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/pick a time/i);
    expect(text).not.toMatch(/into the booking/i);
  });

  it("with an event URL, describes the calendar and Calendly's confirmation", () => {
    calendly.url = EVENT_URL;
    render(<Book />);
    expect(
      screen.getByText("Choose a topic above and the calendar opens here.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A 30-minute video call, with a link in your confirmation email."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Yes. Calendly's confirmation email has links to reschedule or cancel the booking."
      )
    ).toBeInTheDocument();
  });
});
