import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { CALENDLY_EVENT_URL } from "@/data/foundation";
import {
  CALENDLY_ORIGIN,
  CALENDLY_SCRIPT,
  CALENDLY_STYLESHEET,
  bookingFrameUrl,
  bookingNoticeFrom,
  calendlyEventUrl,
  sendBookingNotice,
  type BookingNotice,
} from "@/lib/booking";

interface CalendlyApi {
  initInlineWidget(options: {
    url: string;
    parentElement: HTMLElement;
    resize?: boolean;
  }): void;
}

type CalendlyWindow = Window & {
  Calendly?: CalendlyApi;
  __EOS_PRERENDER__?: boolean;
};

let loader: Promise<CalendlyApi> | null = null;

export function loadCalendly(): Promise<CalendlyApi> {
  if (loader) return loader;
  const win = window as CalendlyWindow;
  loader = new Promise<CalendlyApi>((resolve, reject) => {
    if (win.Calendly?.initInlineWidget) return resolve(win.Calendly);
    if (!document.querySelector(`link[href="${CALENDLY_STYLESHEET}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CALENDLY_STYLESHEET;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    script.onload = () =>
      win.Calendly?.initInlineWidget
        ? resolve(win.Calendly)
        : reject(new Error("Calendly's widget script loaded without its API"));
    script.onerror = () => {
      script.remove();
      reject(new Error("Calendly's widget script was blocked or failed"));
    };
    document.head.appendChild(script);
  });
  loader.catch(() => {
    loader = null;
  });
  return loader;
}

export function resetCalendlyLoader(): void {
  loader = null;
}

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

export default function BookingCalendar({
  url = CALENDLY_EVENT_URL,
  topic = null,
  page,
  fallback,
  onReady,
  onFailed,
  onScheduled,
}: {
  url?: string | null;
  topic?: string | null;
  page: string;
  fallback: ReactNode;
  onReady?: () => void;
  onFailed?: () => void;
  onScheduled?: (notice: BookingNotice) => void;
}) {
  const base = calendlyEventUrl(url);
  const frameUrl = base ? bookingFrameUrl(base, topic) : null;
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<LoadState>("waiting");
  const callbacks = useRef({ onReady, onFailed, onScheduled });
  callbacks.current = { onReady, onFailed, onScheduled };

  useEffect(() => {
    const element = ref.current;
    if (!frameUrl || !element) return;
    if ((window as CalendlyWindow).__EOS_PRERENDER__) return;
    let cancelled = false;
    const ready = () => {
      if (cancelled) return;
      setState(current => (current === "loading" ? "ready" : current));
      callbacks.current.onReady?.();
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== CALENDLY_ORIGIN) return;
      const name = (event.data as { event?: unknown } | null)?.event;
      if (typeof name === "string" && name.startsWith("calendly.")) ready();
    };
    window.addEventListener("message", onMessage);
    const start = () => {
      setState("loading");
      loadCalendly()
        .then(api => {
          if (cancelled) return;
          element.replaceChildren();
          api.initInlineWidget({
            url: frameUrl,
            parentElement: element,
            resize: false,
          });
          element
            .querySelector("iframe")
            ?.addEventListener("load", ready, { once: true });
        })
        .catch(() => {
          if (cancelled) return;
          setState("failed");
          callbacks.current.onFailed?.();
        });
    };
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "function") start();
    else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          start();
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(element);
    }
    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, [frameUrl]);

  useEffect(() => {
    if (!frameUrl) return;
    const sent = new Set<string>();
    const onMessage = (event: MessageEvent) => {
      const notice = bookingNoticeFrom(event, page);
      if (!notice || sent.has(notice.event_uri)) return;
      sent.add(notice.event_uri);
      void sendBookingNotice(notice);
      callbacks.current.onScheduled?.(notice);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [frameUrl, page]);

  if (!base) return <div data-booking="fallback">{fallback}</div>;

  const pageLink = (
    <a
      href={frameUrl ?? base}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold text-brand-amber-light underline underline-offset-2 break-words"
    >
      open the booking page on calendly.com
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );

  if (state === "failed")
    return (
      <div data-booking="failed" className="grid gap-4">
        <p className="text-sm text-gray-300">
          The calendar could not load here. You can {pageLink}, or:
        </p>
        {fallback}
      </div>
    );

  return (
    <div data-booking="calendly" className="grid gap-3 min-w-0">
      <div className="relative w-full min-w-0 h-[700px] overflow-hidden rounded-xl bg-brand-navy">
        {state !== "ready" && <CalendarSkeleton />}
        <p role="status" className="sr-only">
          {state === "ready"
            ? "The calendar has loaded."
            : "Loading the calendar."}
        </p>
        <div
          ref={ref}
          className="calendly-inline-widget relative h-full w-full min-w-0"
          data-url={frameUrl ?? undefined}
          data-auto-load="false"
        />
      </div>
      <p className="text-sm text-gray-300">
        If the calendar does not appear, {pageLink}.
      </p>
    </div>
  );
}
