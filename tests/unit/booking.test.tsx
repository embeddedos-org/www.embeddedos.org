/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The constants are set in foundation.ts. The "without an embed URL" block
// below forces null, the email-fallback mode, through this getter; every other
// test sees the real constants.
const google = vi.hoisted(() => ({ forceNull: false }));
vi.mock("../../client/src/data/foundation", async importOriginal => {
  const actual =
    await importOriginal<typeof import("../../client/src/data/foundation")>();
  return {
    ...actual,
    get GOOGLE_APPOINTMENTS_EMBED_URL() {
      return google.forceNull ? null : actual.GOOGLE_APPOINTMENTS_EMBED_URL;
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

import BookingCalendar, {
  CALENDAR_FRAME_TITLE,
  FRAME_TIMEOUT_MS,
} from "../../client/src/components/BookingCalendar";
import { GOOGLE_APPOINTMENTS_EMBED_URL } from "../../client/src/data/foundation";
import {
  GOOGLE_CALENDAR_ORIGIN,
  appointmentsEmbedUrl,
  bookingPageUrl,
} from "../../client/src/lib/booking";
import Contact from "../../client/src/pages/Contact";
import EosBoards from "../../client/src/pages/EosBoards";

const ROOT = path.resolve(__dirname, "../..");
const read = (file: string) => readFileSync(path.join(ROOT, file), "utf8");

const EMBED =
  "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=?gv=true";
const LINK = "https://calendar.app.google/PPzWao4AzvXtZeva6";

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

type IoCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

function mockIntersectionObserver() {
  const callbacks: IoCallback[] = [];
  class FakeIO {
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
  vi.stubGlobal("IntersectionObserver", FakeIO);
  return () =>
    act(() => {
      for (const cb of callbacks) cb([{ isIntersecting: true }]);
    });
}

const fallback = <p>fallback</p>;

beforeEach(() => {
  mockMatchMedia();
});

afterEach(() => {
  cleanup();
  delete (window as { __EOS_PRERENDER__?: boolean }).__EOS_PRERENDER__;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the embed URL", () => {
  it.each([
    EMBED,
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=?gv=true",
    "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu?gv=true",
  ])("accepts %j", url => {
    expect(appointmentsEmbedUrl(url)).toBe(url);
  });

  it.each([
    "http://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMs=?gv=true",
    "https://calendar.google.com.example.com/calendar/appointments/AcZssZ3QwWoaBjMs=?gv=true",
    "https://x@calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMs=?gv=true",
    "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMs=",
    "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMs=?gv=true&x=1",
    "https://calendar.google.com/calendar/appointments/../embed?src=x&gv=true",
    "https://calendar.google.com/calendar/embed?src=team%40example.com",
    "https://calendar.google.com/calendar/appointments/short?gv=true",
    LINK,
    "javascript:alert(1)",
    "",
    null,
    undefined,
  ])("refuses %j", url => {
    expect(appointmentsEmbedUrl(url)).toBe(null);
  });
});

describe("the booking page URL", () => {
  it.each([
    LINK,
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=",
    "https://calendar.google.com/calendar/appointments/AcZssZ3QwWoaBjMsLfr11qrGiRxBA4URKeZ8Zu-5bv0=",
  ])("accepts %j", url => {
    expect(bookingPageUrl(url)).toBe(url);
  });

  it.each([
    "http://calendar.app.google/PPzWao4AzvXtZeva6",
    "https://calendar.app.google.example.com/PPzWao4AzvXtZeva6",
    "https://calendar.app.google/PPzWao4AzvXtZeva6?x=1",
    "https://calendar.app.google/PPzWao4AzvXtZeva6/",
    "https://calendar.app.google/",
    "https://calendar.app.google/../x",
    EMBED,
    "javascript:alert(1)",
    "",
    null,
    undefined,
  ])("refuses %j", url => {
    expect(bookingPageUrl(url)).toBe(null);
  });
});

describe("the calendar frame", () => {
  it("shows the fallback, and frames nothing, for an invalid embed URL", () => {
    const reveal = mockIntersectionObserver();
    const { container } = render(
      <BookingCalendar url="https://example.com/x" fallback={fallback} />
    );
    reveal();
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(container.querySelector('[data-booking="fallback"]')).not.toBe(null);
    expect(container.querySelector("iframe")).toBe(null);
  });

  it("frames the schedule only once the card nears the viewport", () => {
    const reveal = mockIntersectionObserver();
    const { container } = render(
      <BookingCalendar url={EMBED} link={LINK} fallback={fallback} />
    );
    expect(container.querySelector("iframe")).toBe(null);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading the calendar."
    );
    expect(screen.queryByText("fallback")).toBe(null);

    reveal();
    const frames = container.querySelectorAll("iframe");
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute("src")).toBe(EMBED);
    expect(frames[0].getAttribute("title")).toBe(CALENDAR_FRAME_TITLE);
    expect(frames[0].getAttribute("loading")).toBe("lazy");
    expect(frames[0]).not.toHaveAttribute("sandbox");
    // Under the skeleton, so out of the tab order until it loads.
    expect(frames[0]).toHaveAttribute("inert");
  });

  it("swaps the skeleton for the calendar when the frame loads", () => {
    const reveal = mockIntersectionObserver();
    const { container } = render(
      <BookingCalendar url={EMBED} link={LINK} fallback={fallback} />
    );
    reveal();
    expect(container.querySelector(".book-shimmer")).not.toBe(null);
    const frame = container.querySelector("iframe") as HTMLIFrameElement;
    fireEvent.load(frame);
    expect(container.querySelector(".book-shimmer")).toBe(null);
    expect(screen.getByRole("status")).toHaveTextContent(
      "The calendar has loaded."
    );
    expect(frame).not.toHaveAttribute("inert");
    // Nothing had focus in the card, so the load moves none.
    expect(document.activeElement).toBe(document.body);
  });

  it("offers the booking page in a new tab under the calendar", () => {
    render(<BookingCalendar url={EMBED} link={LINK} fallback={fallback} />);
    const link = screen.getByRole("link", {
      name: "Open the booking page on Google Calendar (opens in a new tab)",
    });
    expect(link).toHaveAttribute("href", LINK);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")?.split(" ")).toContain("noopener");
  });

  it("leaves the link out when the booking page URL is not valid", () => {
    render(
      <BookingCalendar
        url={EMBED}
        link="https://example.com"
        fallback={fallback}
      />
    );
    expect(screen.queryByRole("link")).toBe(null);
  });

  it("offers the booking page and the fallback if the frame does not load in time", () => {
    vi.useFakeTimers();
    const reveal = mockIntersectionObserver();
    const { container } = render(
      <BookingCalendar url={EMBED} link={LINK} fallback={fallback} />
    );
    reveal();
    act(() => {
      vi.advanceTimersByTime(FRAME_TIMEOUT_MS - 1);
    });
    expect(container.querySelector('[data-booking="failed"]')).toBe(null);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const failed = container.querySelector('[data-booking="failed"]');
    expect(failed).not.toBe(null);
    expect(failed).toHaveTextContent("The calendar could not load here.");
    expect(failed?.querySelector(`a[href="${LINK}"]`)).not.toBe(null);
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Open the booking page/ })
    ).toHaveLength(1);
    const frame = container.querySelector("iframe") as HTMLIFrameElement;
    // Behind the overlay, so out of the tab order: the first Tab reaches the
    // overlay's link, not a frame nobody can see.
    expect(frame).toHaveAttribute("inert");
    // The frame stays: if it loads after all, the calendar takes over again,
    // and focus that was in the overlay follows it instead of dropping.
    const link = screen.getByRole("link", { name: /Open the booking page/ });
    link.focus();
    expect(document.activeElement).toBe(link);
    fireEvent.load(frame);
    expect(container.querySelector('[data-booking="failed"]')).toBe(null);
    expect(frame).not.toHaveAttribute("inert");
    expect(document.activeElement).toBe(frame);
  });

  it("prerenders a plain line and the links, not a skeleton, for visitors without JavaScript", () => {
    (window as { __EOS_PRERENDER__?: boolean }).__EOS_PRERENDER__ = true;
    const reveal = mockIntersectionObserver();
    const { container } = render(
      <BookingCalendar url={EMBED} link={LINK} fallback={fallback} />
    );
    reveal();
    expect(container.querySelector("iframe")).toBe(null);
    expect(container.querySelector(".book-shimmer")).toBe(null);
    expect(screen.queryByRole("status")).toBe(null);
    expect(container.textContent).not.toMatch(/loading/i);
    const card = container.querySelector('[data-booking="static"]');
    expect(card).toHaveTextContent(
      "The calendar appears here once the page's scripts run. If it does not, open the booking page on Google Calendar, or email us from our contact page."
    );
    expect(
      screen.getByRole("link", { name: /Open the booking page/ })
    ).toHaveAttribute("href", LINK);
    expect(screen.getByRole("link", { name: "contact page" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});

describe("the CSP for the calendar", () => {
  const csp =
    read("client/public/.htaccess").match(
      /Content-Security-Policy "([^"]+)"/
    )?.[1] ?? "";
  const directives = csp
    .split(";")
    .map(d => d.trim().split(/\s+/))
    .filter(([name]) => name);
  const directive = (name: string) =>
    directives.find(([n]) => n === name)?.slice(1) ?? [];

  it("allows the appointment schedule's frame from calendar.google.com", () => {
    expect(directive("frame-src")).toContain(GOOGLE_CALENDAR_ORIGIN);
    expect(new URL(GOOGLE_APPOINTMENTS_EMBED_URL ?? "").origin).toBe(
      GOOGLE_CALENDAR_ORIGIN
    );
  });

  it("names calendar.google.com in frame-src only, and no other calendar host", () => {
    const elsewhere = directives
      .filter(([name]) => name !== "frame-src")
      .filter(sources => sources.some(s => /calendar|\.app\.google/.test(s)));
    expect(elsewhere).toEqual([]);
    expect(
      directive("frame-src").filter(s => /calendar|app\.google/.test(s))
    ).toEqual([GOOGLE_CALENDAR_ORIGIN]);
  });

  it("no longer names any Calendly host", () => {
    expect(csp).not.toBe("");
    expect(read("client/public/.htaccess")).not.toMatch(/calendly/i);
  });
});

describe("no third-party scheduling code in the client", () => {
  const files = (dir: string): string[] =>
    readdirSync(path.join(ROOT, dir)).flatMap(name => {
      const rel = path.join(dir, name);
      return statSync(path.join(ROOT, rel)).isDirectory() ? files(rel) : [rel];
    });
  const text = [
    "client/index.html",
    ...files("client/src"),
    ...files("client/public").filter(f =>
      /\.(html|php|txt|xml|json|webmanifest|htaccess|yml)$|\/\.[a-z]+$/.test(f)
    ),
  ];

  it("mentions no Calendly host or widget anywhere in the client", () => {
    const hits = text.filter(f => /calendly/i.test(read(f)));
    expect(hits).toEqual([]);
  });

  it("does not load Google's scheduling button script or stylesheet", () => {
    const hits = text.filter(f =>
      /scheduling-button-script|calendar\.google\.com\/calendar\/scheduling-button/.test(
        read(f)
      )
    );
    expect(hits).toEqual([]);
  });

  it("frames the calendar from BookingCalendar only", () => {
    const framing = files("client/src").filter(f =>
      /GOOGLE_APPOINTMENTS_EMBED_URL/.test(read(f))
    );
    expect(framing.sort()).toEqual(
      [
        "client/src/components/BookingCalendar.tsx",
        "client/src/data/foundation.ts",
        "client/src/lib/booking.ts",
      ].sort()
    );
  });
});

describe("the privacy page", () => {
  const privacy = read("client/src/pages/Privacy.tsx");

  it("names Google Calendar as the booking calendar, with Google's policy", () => {
    expect(privacy).toContain(
      "**Google Calendar** (meeting scheduling, Google LLC) — governed by Google's Privacy Policy at policies.google.com/privacy."
    );
    expect(privacy).toContain(
      "The appointment calendar loads from Google only on /book."
    );
  });

  it("counts the Google services it names", () => {
    expect(privacy).toContain(
      "Two Google services are involved in loading every page of this site, and a third on /book."
    );
    expect(privacy).toContain(
      "The third, the Google Calendar booking calendar on /book, is described"
    );
    expect(privacy).not.toMatch(
      /Two Google services are involved in loading this site\./
    );
  });
});

describe("the retired booking-notice endpoint", () => {
  const php = read("client/public/api/booking.php");

  // The file's code without its comment, one statement per line.
  const statements = php
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  it("is exactly: 410 Gone, a JSON type, no-store and a fixed body", () => {
    expect(statements).toEqual([
      "<?php",
      "declare(strict_types=1);",
      "http_response_code(410);",
      "header('Content-Type: application/json; charset=utf-8');",
      "header('Cache-Control: no-store');",
      `echo '{"ok":false,"error":"gone"}';`,
    ]);
  });

  it("reads no request, touches no file or environment and sends no mail", () => {
    const code = statements.join("\n");
    expect(code).not.toMatch(/\bmail\s*\(|error_log|syslog/);
    expect(code).not.toMatch(
      /php:\/\/input|\$_(POST|GET|SERVER|REQUEST|COOKIE|FILES|ENV)|getenv/
    );
    expect(code).not.toMatch(
      /fopen|file_get_contents|file_put_contents|sys_get_temp_dir|\b(include|require)(_once)?\b/
    );
  });

  it("is run by the PHP tests, in test:php and in CI", () => {
    const pkg = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["test:php"]).toContain(
      "php tests/php/booking-retired.test.php"
    );
    expect(read(".github/workflows/ci.yml")).toContain(
      "php tests/php/booking-retired.test.php"
    );
  });

  it("is posted to by nothing in the client", () => {
    for (const file of [
      "client/src/components/BookingCalendar.tsx",
      "client/src/lib/booking.ts",
      "client/src/pages/Book.tsx",
    ])
      expect(read(file)).not.toMatch(
        /booking\.php|fetch\(|postMessage|addEventListener\("message"/
      );
  });
});

describe("without an embed URL (the email fallback, forced)", () => {
  beforeEach(() => {
    google.forceNull = true;
  });
  afterEach(() => {
    google.forceNull = false;
  });

  it("is forced to null for this block", () => {
    expect(GOOGLE_APPOINTMENTS_EMBED_URL).toBe(null);
  });

  it("BookingCalendar falls back by default", () => {
    mockIntersectionObserver()();
    const { container } = render(<BookingCalendar fallback={fallback} />);
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(container.querySelector("iframe")).toBe(null);
  });

  it.each([
    ["/contact", Contact, "Arrange a time by email through our booking page."],
    [
      "/eos-boards",
      EosBoards,
      "Arrange a time by email through the booking page and mention EoS boards and hardware.",
    ],
  ] as const)(
    "%s shows a compact card linking to /book, and frames no calendar",
    (_route, Page, line) => {
      mockIntersectionObserver()();
      const { container } = render(<Page />);
      expect(
        screen.getByRole("heading", { name: "Book a call" })
      ).toBeInTheDocument();
      const teaser = container.querySelector('[data-booking="teaser"]');
      expect(teaser).not.toBe(null);
      expect(teaser?.textContent).toContain(line);
      expect(teaser?.textContent).not.toMatch(/pick a time/i);
      expect(teaser?.querySelector('a[href="/book"]')?.textContent).toMatch(
        /Book a call/
      );
      expect(container.querySelector("iframe")).toBe(null);
    }
  );
});
