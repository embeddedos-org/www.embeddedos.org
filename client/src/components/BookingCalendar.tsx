import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import {
  GOOGLE_APPOINTMENTS_EMBED_URL,
  GOOGLE_BOOKING_PAGE_URL,
} from "@/data/foundation";
import {
  GOOGLE_CALENDAR_ORIGIN,
  appointmentsEmbedUrl,
  bookingPageUrl,
} from "@/lib/booking";

export const CALENDAR_FRAME_TITLE =
  "Google Calendar appointment schedule for a call with the EmbeddedOS team";

/**
 * How long the frame may take to fire its load event before the page offers
 * the booking page and the email option over it. A cross-origin frame reports
 * nothing else, and the browser fires load even for its own error page, so
 * the link under the calendar is always shown as well.
 */
export const FRAME_TIMEOUT_MS = 15_000;

type PrerenderWindow = Window & { __EOS_PRERENDER__?: boolean };

type LoadState = "waiting" | "loading" | "ready" | "failed";

function CalendarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid gap-4 p-6 sm:grid-cols-[1fr_2fr] bg-brand-navy"
    >
      <div className="hidden sm:grid content-start gap-3">
        <div className="book-shimmer h-12 w-12 rounded-full" />
        <div className="book-shimmer h-4 w-2/3 rounded" />
        <div className="book-shimmer h-6 w-5/6 rounded" />
        <div className="book-shimmer h-4 w-1/2 rounded" />
      </div>
      <div className="grid content-start gap-3">
        <div className="book-shimmer h-6 w-1/2 rounded" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="book-shimmer aspect-square rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="book-shimmer h-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The team's Google Calendar appointment schedule in a plain iframe. No Google
 * script or stylesheet loads: the frame is mounted when the card nears the
 * viewport (never while the site is prerendered), and the site's own link to
 * the booking page sits under it.
 *
 * The prerendered HTML is what a visitor without JavaScript keeps, so the
 * prerender writes a plain line and the links instead of the skeleton and its
 * "Loading" status. main.tsx mounts with createRoot, which replaces that HTML,
 * so a visitor with JavaScript gets the live card.
 */
export default function BookingCalendar({
  url = GOOGLE_APPOINTMENTS_EMBED_URL,
  link = GOOGLE_BOOKING_PAGE_URL,
  fallback,
}: {
  url?: string | null;
  link?: string | null;
  fallback: ReactNode;
}) {
  const src = appointmentsEmbedUrl(url);
  const page = bookingPageUrl(link);
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  // Set when the frame loads while focus is in the failed overlay, which then
  // unmounts: focus follows the calendar instead of dropping to <body>.
  const focusFrame = useRef(false);
  // Set when the browser refuses the frame (see the securitypolicyviolation listener below).
  const blocked = useRef(false);
  const [state, setState] = useState<LoadState>("waiting");
  const started = state !== "waiting";
  const prerendering =
    typeof window !== "undefined" &&
    Boolean((window as PrerenderWindow).__EOS_PRERENDER__);

  useEffect(() => {
    const element = ref.current;
    if (!src || !element) return;
    if ((window as PrerenderWindow).__EOS_PRERENDER__) return;
    const start = () =>
      setState(current => (current === "waiting" ? "loading" : current));
    if (typeof IntersectionObserver !== "function") {
      start();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(
      () => setState(current => (current === "loading" ? "failed" : current)),
      FRAME_TIMEOUT_MS
    );
    return () => window.clearTimeout(timer);
  }, [state]);

  // A frame the browser refuses (a Content-Security-Policy without calendar.google.com, as in a strict preview)
  // still fires "load", with the browser's own "content is blocked" page in it. The refusal itself arrives as a
  // securitypolicyviolation event: the card then shows its failed panel and links, never a broken frame.
  useEffect(() => {
    if (!src || !started) return;
    const onRefused = (e: SecurityPolicyViolationEvent) => {
      const directive = e.effectiveDirective || e.violatedDirective || "";
      if (!/^(frame|child|default)-src/.test(directive)) return;
      if (!String(e.blockedURI).startsWith(GOOGLE_CALENDAR_ORIGIN)) return;
      blocked.current = true;
      setState("failed");
    };
    document.addEventListener("securitypolicyviolation", onRefused);
    return () =>
      document.removeEventListener("securitypolicyviolation", onRefused);
  }, [src, started]);

  useEffect(() => {
    if (state !== "ready" || !focusFrame.current) return;
    focusFrame.current = false;
    frame.current?.focus();
  }, [state]);

  const onFrameLoad = () => {
    // the browser's error page for a refused frame: keep the failed panel
    if (blocked.current) return;
    focusFrame.current = Boolean(
      overlay.current?.contains(document.activeElement)
    );
    setState("ready");
  };

  if (!src) return <div data-booking="fallback">{fallback}</div>;

  const pageLink = page && (
    <a
      href={page}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-brand-amber/60 px-4 py-2.5 text-sm font-semibold text-brand-amber-light hover:border-brand-amber hover:bg-brand-amber/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
    >
      Open the booking page{" "}
      <span className="sr-only">on Google Calendar (opens in a new tab)</span>
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );

  if (prerendering)
    return (
      <div
        data-booking="static"
        className="grid gap-4 rounded-xl border border-white/10 bg-brand-navy p-6"
      >
        <p className="text-sm leading-relaxed text-gray-300">
          The calendar appears here once the page&apos;s scripts run. If it does
          not, open the booking page on Google Calendar, or email us from our{" "}
          <a
            href="/contact"
            className="font-semibold text-brand-amber-light underline underline-offset-2"
          >
            contact page
          </a>
          .
        </p>
        {pageLink && <div>{pageLink}</div>}
      </div>
    );

  return (
    <div data-booking="google-calendar" className="grid gap-3 min-w-0">
      <div
        ref={ref}
        className="relative w-full min-w-0 h-[600px] sm:h-[700px] overflow-hidden rounded-xl bg-brand-navy"
      >
        {state !== "waiting" && (
          <iframe
            ref={frame}
            src={src}
            title={CALENDAR_FRAME_TITLE}
            loading="lazy"
            // Covered by the skeleton or the failed overlay until it loads, so
            // out of the tab order and the accessibility tree until then.
            inert={state !== "ready"}
            onLoad={onFrameLoad}
            className="absolute inset-0 h-full w-full border-0 bg-white"
          />
        )}
        {(state === "waiting" || state === "loading") && <CalendarSkeleton />}
        {state === "failed" && (
          <div
            ref={overlay}
            data-booking="failed"
            className="absolute inset-0 grid content-center gap-4 overflow-y-auto bg-brand-navy p-4 sm:p-6"
          >
            <p className="text-sm text-gray-300">
              {page
                ? "The calendar could not load here. You can open the booking page on Google Calendar, or:"
                : "The calendar could not load here."}
            </p>
            {pageLink && <div>{pageLink}</div>}
            {fallback}
          </div>
        )}
        <p role="status" className="sr-only">
          {state === "ready"
            ? "The calendar has loaded."
            : state === "failed"
              ? "The calendar could not load."
              : "Loading the calendar."}
        </p>
      </div>
      {pageLink && state !== "failed" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-300">
            If the calendar does not appear, open the booking page on Google
            Calendar.
          </p>
          {pageLink}
        </div>
      )}
    </div>
  );
}
