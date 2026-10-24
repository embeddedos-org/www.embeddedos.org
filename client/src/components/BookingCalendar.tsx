import { useEffect, useRef, useState, type ReactNode } from "react";
import "./BookingCalendar.css";
import {
  GOOGLE_APPOINTMENTS_EMBED_URL,
  GOOGLE_BOOKING_PAGE_URL,
} from "@/data/foundation";
import { appointmentsEmbedUrl, bookingPageUrl } from "@/lib/booking";

export const CALENDAR_FRAME_TITLE =
  "Google Calendar appointment schedule for a call with the EmbeddedOS team";

/**
 * How long the frame may take to fire its load event before the page offers
 * the booking page and the email option over it. A cross-origin frame reports
 * nothing else, and the browser fires load even for its own error page, so
 * the link under the calendar is always shown as well.
 */
export const FRAME_TIMEOUT_MS = 15_000;
/** The schedule's frame, or the Google sign-in and consent pages it may
 * redirect to; never other Google frames (an ad tag's, say). */
const GOOGLE_FRAME =
  /^https:\/\/(calendar|accounts|consent)\.google\.com(?:[/:?#]|$)/i;

type PrerenderWindow = Window & { __EOS_PRERENDER__?: boolean };

type LoadState = "waiting" | "loading" | "ready" | "failed";

function CalendarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bkc-skel absolute inset-0 grid gap-4 p-6 sm:grid-cols-[1fr_2fr]"
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
  // Set when the browser refuses the frame (the listener below).
  const blocked = useRef(false);
  // Set once the calendar frame exists: refusals before it are not ours.
  const live = useRef(false);
  const [state, setState] = useState<LoadState>("waiting");
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

  // A frame the browser refuses still fires "load", with the browser's own
  // "content is blocked" page in it: a policy without calendar.google.com
  // (a strict preview), or the schedule redirecting to another Google page
  // the policy leaves out. The refusal itself is a securitypolicyviolation
  // event, and the card then shows its failed panel and links instead.
  // Report-only policies block nothing, so they are ignored.
  useEffect(() => {
    if (!src) return;
    const onRefused = (e: SecurityPolicyViolationEvent) => {
      if (!live.current || e.disposition === "report") return;
      const directive = e.effectiveDirective || e.violatedDirective || "";
      if (!/^(frame|child|default)-src/.test(directive)) return;
      if (!GOOGLE_FRAME.test(String(e.blockedURI))) return;
      blocked.current = true;
      setState("failed");
    };
    document.addEventListener("securitypolicyviolation", onRefused);
    return () =>
      document.removeEventListener("securitypolicyviolation", onRefused);
  }, [src]);

  useEffect(() => {
    live.current = state !== "waiting";
  }, [state]);

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
      className="btn gh shrink-0"
    >
      Open the booking page{" "}
      <span className="sr-only">on Google Calendar (opens in a new tab)</span>
      <span aria-hidden="true">↗</span>
    </a>
  );

  if (prerendering)
    return (
      <div data-booking="static" className="card bkc-static">
        <p>
          The calendar appears here once the page&apos;s scripts run. If it does
          not, open the booking page on Google Calendar, or email us from our{" "}
          <a href="/contact" className="tl">
            contact page
          </a>
          .
        </p>
        {pageLink && <div>{pageLink}</div>}
      </div>
    );

  return (
    <div data-booking="google-calendar" className="bkc">
      <div ref={ref} className="bkc-stage">
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
            className="bkc-frame"
          />
        )}
        {(state === "waiting" || state === "loading") && <CalendarSkeleton />}
        {state === "failed" && (
          <div ref={overlay} data-booking="failed" className="bkc-failed">
            <p>
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
        <div className="bkc-under">
          <p>
            If the calendar does not appear, open the booking page on Google
            Calendar.
          </p>
          {pageLink}
        </div>
      )}
    </div>
  );
}
