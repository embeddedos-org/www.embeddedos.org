import { BRAND_COLORS } from "@/data/brand";

export const CALENDLY_ORIGIN = "https://calendly.com";
export const CALENDLY_SCRIPT =
  "https://assets.calendly.com/assets/external/widget.js";
export const CALENDLY_STYLESHEET =
  "https://assets.calendly.com/assets/external/widget.css";
export const BOOKING_ENDPOINT = "/api/booking.php";

const EVENT_PAGE =
  /^https:\/\/calendly\.com\/[A-Za-z0-9_-]{1,64}(?:\/[A-Za-z0-9_-]{1,64})?\/?$/;
const EVENT_URI =
  /^https:\/\/api\.calendly\.com\/scheduled_events\/([A-Za-z0-9-]{1,64})$/;
const INVITEE_URI =
  /^https:\/\/api\.calendly\.com\/(?:api\/v2\/)?scheduled_events\/([A-Za-z0-9-]{1,64})\/invitees\/[A-Za-z0-9-]{1,64}$/;
const SITE_PATH = /^\/[a-z0-9-]{1,64}(?:\/[a-z0-9-]{1,64})*$/;

export interface BookingNotice {
  readonly event_uri: string;
  readonly invitee_uri: string;
  readonly page: string;
}

export function calendlyEventUrl(
  url: string | null | undefined
): string | null {
  return typeof url === "string" && EVENT_PAGE.test(url) ? url : null;
}

const field = (value: unknown, key: string): unknown =>
  value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)[key]
    : undefined;

export function bookingNoticeFrom(
  message: { origin: string; data: unknown },
  page: string
): BookingNotice | null {
  if (message.origin !== CALENDLY_ORIGIN) return null;
  if (field(message.data, "event") !== "calendly.event_scheduled") return null;
  const payload = field(message.data, "payload");
  const eventUri = field(field(payload, "event"), "uri");
  const inviteeUri = field(field(payload, "invitee"), "uri");
  if (typeof eventUri !== "string" || typeof inviteeUri !== "string")
    return null;
  const event = EVENT_URI.exec(eventUri);
  const invitee = INVITEE_URI.exec(inviteeUri);
  if (!event || !invitee || event[1] !== invitee[1]) return null;
  if (!SITE_PATH.test(page)) return null;
  return { event_uri: eventUri, invitee_uri: inviteeUri, page };
}

export async function sendBookingNotice(
  notice: BookingNotice,
  post: typeof fetch = fetch
): Promise<boolean> {
  try {
    const response = await post(BOOKING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notice),
      credentials: "same-origin",
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

const hex = (color: string) => color.replace(/^#/, "").toLowerCase();

export const CALENDLY_THEME = {
  background_color: hex(
    BRAND_COLORS.find(c => c.name === "Deep Navy")?.hex ?? "#0B1D3A"
  ),
  text_color: "ffffff",
  primary_color: hex(
    BRAND_COLORS.find(c => c.name === "Signal Orange")?.hex ?? "#F97316"
  ),
} as const;

export function bookingFrameUrl(
  eventUrl: string,
  topic: string | null
): string {
  const params: [string, string][] = [
    ...Object.entries(CALENDLY_THEME),
    ["hide_gdpr_banner", "1"],
  ];
  if (topic) params.push(["a1", topic]);
  const query = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${eventUrl}?${query}`;
}

export type BookingStep = "topic" | "time" | "confirmed";
export type FrameState = "idle" | "loading" | "ready" | "failed";

export interface BookingState {
  readonly step: BookingStep;
  readonly topic: string | null;
  readonly frame: FrameState;
  readonly notice: BookingNotice | null;
}

export type BookingAction =
  | { readonly type: "select"; readonly topic: string }
  | { readonly type: "frame-ready" }
  | { readonly type: "frame-failed" }
  | { readonly type: "scheduled"; readonly notice: BookingNotice }
  | { readonly type: "restart" };

export const INITIAL_BOOKING: BookingState = {
  step: "topic",
  topic: null,
  frame: "idle",
  notice: null,
};

export function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "select":
      if (state.step === "confirmed" || state.topic === action.topic)
        return state;
      return {
        step: "time",
        topic: action.topic,
        frame: "loading",
        notice: null,
      };
    case "frame-ready":
      return state.step === "time" && state.frame === "loading"
        ? { ...state, frame: "ready" }
        : state;
    case "frame-failed":
      return state.step === "time" ? { ...state, frame: "failed" } : state;
    case "scheduled":
      return state.step === "time" && state.topic !== null
        ? { ...state, step: "confirmed", notice: action.notice }
        : state;
    case "restart":
      return INITIAL_BOOKING;
  }
}

export const BOOKING_STEPS: readonly { step: BookingStep; label: string }[] = [
  { step: "topic", label: "Choose a topic" },
  { step: "time", label: "Pick a time" },
  { step: "confirmed", label: "Confirmed" },
];
