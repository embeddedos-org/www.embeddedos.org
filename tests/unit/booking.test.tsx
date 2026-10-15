/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
  resetCalendlyLoader,
} from "../../client/src/components/BookingCalendar";
import { CALENDLY_EVENT_URL } from "../../client/src/data/foundation";
import {
  BOOKING_ENDPOINT,
  CALENDLY_ORIGIN,
  CALENDLY_SCRIPT,
  CALENDLY_STYLESHEET,
  bookingFrameUrl,
  bookingNoticeFrom,
  calendlyEventUrl,
  sendBookingNotice,
} from "../../client/src/lib/booking";
import Contact from "../../client/src/pages/Contact";
import EosBoards from "../../client/src/pages/EosBoards";

const ROOT = path.resolve(__dirname, "../..");
const read = (file: string) => readFileSync(path.join(ROOT, file), "utf8");

const EVENT = "https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2";
const INVITEE = `${EVENT}/invitees/AAAAAAAAAAAAAAAA`;
const PAGE_URL = "https://calendly.com/embeddedos-team/30min";

const scheduled = (event = EVENT, invitee = INVITEE) => ({
  event: "calendly.event_scheduled",
  payload: { event: { uri: event }, invitee: { uri: invitee } },
});

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

const calendlyScript = () =>
  document.head.querySelector<HTMLScriptElement>(
    `script[src="${CALENDLY_SCRIPT}"]`
  );

beforeEach(() => {
  mockMatchMedia();
  resetCalendlyLoader();
});

afterEach(() => {
  cleanup();
  document.head
    .querySelectorAll(
      `script[src^="https://assets.calendly.com"], link[href^="https://assets.calendly.com"]`
    )
    .forEach(el => el.remove());
  delete (window as { Calendly?: unknown }).Calendly;
  delete (window as { __EOS_PRERENDER__?: boolean }).__EOS_PRERENDER__;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the calendly.event_scheduled message", () => {
  it("becomes a notice of exactly the event, the invitee and the page", () => {
    const notice = bookingNoticeFrom(
      { origin: CALENDLY_ORIGIN, data: scheduled() },
      "/contact"
    );
    expect(notice).toEqual({
      event_uri: EVENT,
      invitee_uri: INVITEE,
      page: "/contact",
    });
    expect(Object.keys(notice ?? {})).toEqual([
      "event_uri",
      "invitee_uri",
      "page",
    ]);
  });

  it("accepts the invitee form in Calendly's own example payload", () => {
    const invitee =
      "https://api.calendly.com/api/v2/scheduled_events/GBGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA";
    expect(
      bookingNoticeFrom(
        { origin: CALENDLY_ORIGIN, data: scheduled(EVENT, invitee) },
        "/eos-boards"
      )?.invitee_uri
    ).toBe(invitee);
  });

  it.each([
    "https://calendly.com.example.com",
    "https://example.com",
    "http://calendly.com",
    "https://assets.calendly.com",
    "null",
    "",
  ])("ignores a message from %j", origin => {
    expect(bookingNoticeFrom({ origin, data: scheduled() }, "/contact")).toBe(
      null
    );
  });

  it.each([
    [
      "another Calendly event",
      { ...scheduled(), event: "calendly.page_height" },
    ],
    ["no payload", { event: "calendly.event_scheduled" }],
    ["a string", "calendly.event_scheduled"],
    ["null", null],
    [
      "a numeric URI",
      {
        event: "calendly.event_scheduled",
        payload: { event: { uri: 1 }, invitee: { uri: INVITEE } },
      },
    ],
    ["an event URI with a newline", scheduled(`${EVENT}\n`)],
    ["an event URI with a query", scheduled(`${EVENT}?x=1`)],
    [
      "an event on another host",
      scheduled("https://calendly.com/scheduled_events/GBGBDCAADAEDCRZ2"),
    ],
    [
      "an invitee of another event",
      scheduled(
        EVENT,
        "https://api.calendly.com/scheduled_events/ZZZZ/invitees/AAAA"
      ),
    ],
  ])("ignores %s", (_why, data) => {
    expect(
      bookingNoticeFrom({ origin: CALENDLY_ORIGIN, data }, "/contact")
    ).toBe(null);
  });

  it.each(["https://example.org/contact", "/contact?x=1", "/", "/Contact"])(
    "refuses to report the page %j",
    page => {
      expect(
        bookingNoticeFrom({ origin: CALENDLY_ORIGIN, data: scheduled() }, page)
      ).toBe(null);
    }
  );
});

describe("the notice to /api/booking.php", () => {
  const notice = {
    event_uri: EVENT,
    invitee_uri: INVITEE,
    page: "/contact",
  };

  it("posts the notice as JSON, same-origin, surviving navigation", async () => {
    const post = vi.fn().mockResolvedValue({ ok: true });
    await expect(
      sendBookingNotice(notice, post as unknown as typeof fetch)
    ).resolves.toBe(true);
    expect(post).toHaveBeenCalledTimes(1);
    const [url, init] = post.mock.calls[0];
    expect(url).toBe(BOOKING_ENDPOINT);
    expect(init).toMatchObject({
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
    expect(JSON.parse(init.body)).toEqual(notice);
  });

  it("reports a refused or failed post as false", async () => {
    const refused = vi.fn().mockResolvedValue({ ok: false });
    const offline = vi.fn().mockRejectedValue(new TypeError("offline"));
    await expect(
      sendBookingNotice(notice, refused as unknown as typeof fetch)
    ).resolves.toBe(false);
    await expect(
      sendBookingNotice(notice, offline as unknown as typeof fetch)
    ).resolves.toBe(false);
  });
});

describe("the browser and booking.php agree on what a booking looks like", () => {
  const php = read("client/public/api/booking.php");
  const pattern = (name: string) => {
    const source = php.match(
      new RegExp(`const ${name}\\s*=\\s*'~(.+)~D';`)
    )?.[1];
    expect(source, name).toBeTruthy();
    return new RegExp(source as string);
  };

  it("uses the same event, invitee and page patterns", () => {
    const event = pattern("EVENT_URI_PATTERN");
    const invitee = pattern("INVITEE_URI_PATTERN");
    const page = pattern("PAGE_PATTERN");
    const events = [
      EVENT,
      `${EVENT}\n`,
      `${EVENT}/`,
      "https://api.calendly.com/scheduled_events/6f0c8e2a-1b2c-4d5e-8f90-0123456789ab",
      "https://api.calendly.com/users/GBGB",
      `https://api.calendly.com/scheduled_events/${"A".repeat(65)}`,
    ];
    const invitees = [
      INVITEE,
      "https://api.calendly.com/api/v2/scheduled_events/GBGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA",
      `${INVITEE}?x`,
    ];
    const pages = ["/contact", "/eos-boards", "/a/b", "/", "/Contact", "//x"];
    for (const e of events)
      for (const i of invitees)
        for (const p of pages) {
          const sameEvent =
            event.exec(e)?.[1] !== undefined &&
            event.exec(e)?.[1] === invitee.exec(i)?.[1];
          const phpAccepts =
            event.test(e) && invitee.test(i) && page.test(p) && sameEvent;
          const browserAccepts =
            bookingNoticeFrom(
              { origin: CALENDLY_ORIGIN, data: scheduled(e, i) },
              p
            ) !== null;
          expect(browserAccepts, `${JSON.stringify([e, i, p])}`).toBe(
            phpAccepts
          );
        }
  });

  it("sends booking mail to both work inboxes, from the server only", () => {
    expect(php).toContain("'kartikeydheer@embeddedos.org'");
    expect(php).toContain("'srikanth@embeddedos.org'");
    expect(php).toContain(
      "const BOOKING_SUBJECT = 'New meeting booked via embeddedos.org';"
    );
    for (const file of [
      "client/src/components/BookingCalendar.tsx",
      "client/src/lib/booking.ts",
    ])
      expect(read(file)).not.toMatch(/@embeddedos\.org|@gmail\.com/);
  });
});

describe("the Calendly embed and the CSP", () => {
  const csp =
    read("client/public/.htaccess").match(
      /Content-Security-Policy "([^"]+)"/
    )?.[1] ?? "";
  const directive = (name: string) =>
    csp
      .split(";")
      .map(d => d.trim().split(/\s+/))
      .find(([n]) => n === name)
      ?.slice(1) ?? [];

  it("allows Calendly's script, stylesheet and scheduling frame", () => {
    expect(directive("script-src")).toContain(new URL(CALENDLY_SCRIPT).origin);
    expect(directive("style-src")).toContain(
      new URL(CALENDLY_STYLESHEET).origin
    );
    expect(directive("frame-src")).toContain(CALENDLY_ORIGIN);
  });

  it("allows Calendly nowhere else", () => {
    const elsewhere = csp
      .split(";")
      .map(d => d.trim())
      .filter(
        d =>
          d.includes("calendly") &&
          !/^(script-src|style-src|frame-src) /.test(d)
      );
    expect(elsewhere).toEqual([]);
    expect(csp.match(/calendly\.com/g)?.length).toBe(3);
  });

  it("calms Calendly's loading animation for reduced motion", () => {
    expect(read("client/src/index.css").replace(/\s+/g, " ")).toContain(
      "@media (prefers-reduced-motion: reduce) { .calendly-inline-widget .calendly-spinner > div { animation: none; } }"
    );
  });
});

describe("before the event URL is set", () => {
  it("has no Calendly URL yet", () => {
    expect(CALENDLY_EVENT_URL).toBe(null);
  });

  it.each([
    ["/contact", Contact],
    ["/eos-boards", EosBoards],
  ] as const)(
    "%s shows a compact card linking to /book, and embeds no calendar",
    (_route, Page) => {
      mockIntersectionObserver()();
      const { container } = render(<Page />);
      expect(
        screen.getByRole("heading", { name: "Book a call" })
      ).toBeInTheDocument();
      const teaser = container.querySelector('[data-booking="teaser"]');
      expect(teaser).not.toBe(null);
      expect(teaser?.querySelector('a[href="/book"]')?.textContent).toMatch(
        /Book a call/
      );
      expect(container.querySelector(".calendly-inline-widget")).toBe(null);
      expect(container.querySelector("iframe")).toBe(null);
      expect(calendlyScript()).toBe(null);
    }
  );
});

describe("the event URL", () => {
  it.each([
    PAGE_URL,
    "https://calendly.com/embeddedos-team",
    "https://calendly.com/embeddedos-team/30min/",
  ])("accepts %j", url => {
    expect(calendlyEventUrl(url)).toBe(url);
  });

  it.each([
    "http://calendly.com/embeddedos-team",
    "https://calendly.com.example.com/x",
    "https://calendly.com/x?y=1",
    "https://calendly.com/",
    "javascript:alert(1)",
    "",
    null,
    undefined,
  ])("refuses %j and keeps the fallback", url => {
    expect(calendlyEventUrl(url)).toBe(null);
    const { container } = render(
      <BookingCalendar url={url} page="/contact" fallback={<p>fallback</p>} />
    );
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(container.querySelector(".calendly-inline-widget")).toBe(null);
  });
});

describe("once the event URL is set", () => {
  it("renders the inline widget for that URL and loads Calendly only on scroll", async () => {
    const reveal = mockIntersectionObserver();
    const initInlineWidget = vi.fn();
    const { container } = render(
      <BookingCalendar
        url={PAGE_URL}
        page="/contact"
        fallback={<p>fallback</p>}
      />
    );
    const widget = container.querySelector<HTMLElement>(
      ".calendly-inline-widget"
    );
    expect(widget?.dataset.url).toBe(bookingFrameUrl(PAGE_URL, null));
    expect(widget?.dataset.autoLoad).toBe("false");
    expect(calendlyScript()).toBe(null);
    expect(screen.queryByText("fallback")).toBe(null);
    expect(
      container.querySelector(
        `a[href="${bookingFrameUrl(PAGE_URL, null)}"][target="_blank"]`
      )
    ).not.toBe(null);

    reveal();
    const script = calendlyScript();
    expect(script?.async).toBe(true);
    expect(
      document.head.querySelector(
        `link[rel="stylesheet"][href="${CALENDLY_STYLESHEET}"]`
      )
    ).not.toBe(null);

    (window as { Calendly?: unknown }).Calendly = { initInlineWidget };
    await act(async () => {
      script?.dispatchEvent(new Event("load"));
    });
    expect(initInlineWidget).toHaveBeenCalledWith({
      url: bookingFrameUrl(PAGE_URL, null),
      parentElement: widget,
      resize: false,
    });
  });

  it("falls back to the booking link and the email CTA when the script is blocked", async () => {
    const reveal = mockIntersectionObserver();
    const { container } = render(
      <BookingCalendar
        url={PAGE_URL}
        page="/contact"
        fallback={<p>fallback</p>}
      />
    );
    reveal();
    await act(async () => {
      calendlyScript()?.dispatchEvent(new Event("error"));
    });
    expect(container.querySelector('[data-booking="failed"]')).not.toBe(null);
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(
      container.querySelector(`a[href="${bookingFrameUrl(PAGE_URL, null)}"]`)
    ).not.toBe(null);
    expect(container.querySelector(".calendly-inline-widget")).toBe(null);
  });

  it("does not load Calendly while the site is being prerendered", () => {
    (window as { __EOS_PRERENDER__?: boolean }).__EOS_PRERENDER__ = true;
    const reveal = mockIntersectionObserver();
    render(
      <BookingCalendar
        url={PAGE_URL}
        page="/contact"
        fallback={<p>fallback</p>}
      />
    );
    reveal();
    expect(calendlyScript()).toBe(null);
  });

  it("reports each booking from calendly.com once, and nothing from anywhere else", async () => {
    const post = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", post);
    render(
      <BookingCalendar
        url={PAGE_URL}
        page="/eos-boards"
        fallback={<p>fallback</p>}
      />
    );
    const send = (origin: string) =>
      act(async () => {
        window.dispatchEvent(
          new MessageEvent("message", { origin, data: scheduled() })
        );
      });
    await send("https://example.com");
    expect(post).not.toHaveBeenCalled();
    await send(CALENDLY_ORIGIN);
    await send(CALENDLY_ORIGIN);
    expect(post).toHaveBeenCalledTimes(1);
    expect(JSON.parse(post.mock.calls[0][1].body)).toEqual({
      event_uri: EVENT,
      invitee_uri: INVITEE,
      page: "/eos-boards",
    });
  });
});
