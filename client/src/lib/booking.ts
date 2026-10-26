import {
  GOOGLE_APPOINTMENTS_EMBED_URL,
  GOOGLE_BOOKING_PAGE_URL,
} from "@/data/foundation";

/**
 * The one host /book frames. client/public/.htaccess allows it in frame-src
 * and nowhere else; no Google script or stylesheet loads on the page.
 */
export const GOOGLE_CALENDAR_ORIGIN = "https://calendar.google.com";

/*
 * An appointment schedule's embed code frames
 * https://calendar.google.com/calendar/appointments/<id>?gv=true (some
 * schedules put "schedules/" before the id). Its booking page is either that
 * address without the query, or the short link https://calendar.app.google/<id>.
 * Nothing else is accepted: no other host, no http, no other query.
 */
const EMBED_URL =
  /^https:\/\/calendar\.google\.com\/calendar\/appointments\/(?:schedules\/)?[A-Za-z0-9_-]{8,128}={0,2}\?gv=true$/;
const BOOKING_PAGE_URL =
  /^(?:https:\/\/calendar\.app\.google\/[A-Za-z0-9]{8,64}|https:\/\/calendar\.google\.com\/calendar\/appointments\/(?:schedules\/)?[A-Za-z0-9_-]{8,128}={0,2})$/;

/** The embed URL if it is a Google appointment schedule's embed, else null. */
export function appointmentsEmbedUrl(
  url: string | null | undefined
): string | null {
  return typeof url === "string" && EMBED_URL.test(url) ? url : null;
}

/** The booking page URL if it is a Google appointment schedule's, else null. */
export function bookingPageUrl(url: string | null | undefined): string | null {
  return typeof url === "string" && BOOKING_PAGE_URL.test(url) ? url : null;
}

export type BookingStep = "topic" | "time" | "confirmed";

/*
 * The steps are a guide, not a progress bar: Google's embedded calendar tells
 * the page nothing about a booking, so /book cannot know which step a visitor
 * has reached.
 */
export const BOOKING_STEPS: readonly { step: BookingStep; label: string }[] = [
  { step: "topic", label: "Choose a topic" },
  { step: "time", label: "Pick a time" },
  { step: "confirmed", label: "Confirmed" },
];

/** The same steps while there is no calendar: the time is agreed by email. */
export const BOOKING_STEPS_BY_EMAIL: readonly {
  step: BookingStep;
  label: string;
}[] = [
  { step: "topic", label: "Choose a topic" },
  { step: "time", label: "Suggest times" },
  { step: "confirmed", label: "Confirmed by email" },
];

/**
 * True once GOOGLE_APPOINTMENTS_EMBED_URL is a valid embed URL, the test
 * BookingCalendar applies before it frames anything. Until then /book offers
 * the contact form instead, so no copy may promise picking a time or a
 * confirmation from Google.
 */
export function bookingCalendarReady(): boolean {
  return appointmentsEmbedUrl(GOOGLE_APPOINTMENTS_EMBED_URL) !== null;
}

/** The booking page link under the calendar, or null if it is not valid. */
export function bookingPageLink(): string | null {
  return bookingPageUrl(GOOGLE_BOOKING_PAGE_URL);
}
