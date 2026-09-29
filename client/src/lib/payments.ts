/**
 * Public payment configuration for the /donate page.
 *
 * Only publishable values live here. The Stripe publishable key (`pk_live_…`)
 * is public by design — Stripe.js needs it in the browser to tokenise cards,
 * and it cannot move money on its own. The SECRET key lives only in the
 * server environment (STRIPE_SECRET_KEY, read by
 * client/public/api/stripe-intent.php) and must never appear in this
 * repository — a test in tests/unit/public-claims-policy.test.ts fails the
 * build if anything looking like a secret key is committed.
 */

export const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51TtZzqC2PVTFBSpdQ9epm11qjOL6uz7y4CpJcZUQ3544vbn27FKnNug3FVQ7YzmXtsxLKRn3m32sPgxPGaZ401Ka00u0SnmOJy";

/** Server endpoint that creates one-off PaymentIntents (see its header). */
export const STRIPE_INTENT_ENDPOINT = "/api/stripe-intent.php";

/** PayPal hosted-donate button (Foundation account, nonprofit rate). */
export const PAYPAL_HOSTED_BUTTON_ID = "LWZFJG5G6C544";
export const PAYPAL_DONATE_URL = "https://www.paypal.com/donate";

/** Stripe.js CDN. Loaded lazily, only when the visitor opens the Card tab. */
export const STRIPE_JS_URL = "https://js.stripe.com/basil/stripe.js";

export interface StripePaymentElement {
  mount: (el: HTMLElement) => void;
  unmount: () => void;
  on: (
    event: string,
    handler: (e: { error?: { message?: string } }) => void
  ) => void;
}

export interface StripeElements {
  create: (
    type: "payment",
    opts?: Record<string, unknown>
  ) => StripePaymentElement;
}

export interface StripeInstance {
  elements: (opts: { clientSecret: string }) => StripeElements;
  confirmPayment: (opts: {
    elements: unknown;
    confirmParams: { return_url: string };
    redirect: "if_required";
  }) => Promise<{ error?: { message?: string } }>;
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

/** Load Stripe.js once, on demand. Resolves false when blocked. */
let stripeJsPromise: Promise<boolean> | null = null;
export function loadStripeJs(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Stripe) return Promise.resolve(true);
  if (!stripeJsPromise) {
    stripeJsPromise = new Promise(resolve => {
      const script = document.createElement("script");
      script.src = STRIPE_JS_URL;
      script.async = true;
      script.onload = () => resolve(typeof window.Stripe !== "undefined");
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }
  return stripeJsPromise;
}
