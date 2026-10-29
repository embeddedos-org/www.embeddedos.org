/**
 * The confirmation pages, and the one way the site opens them.
 *
 * Opened this way, a confirmation page sends the completion to the Google Ads
 * account's existing conversion action ("Page view") by its send_to label,
 * from the Google tag snippet every prerendered page carries
 * (client/index.html). So each page opens only once the action it confirms
 * has really completed: a message the contact endpoint accepted, an
 * application the apply endpoint delivered, a card payment Stripe confirmed.
 * No failure path, and no fallback that leaves the outcome uncertain, may
 * open one.
 *
 * That action counts one conversion per ad click, so a second load after the
 * same click cannot count twice, and the token below stops reloads and direct
 * visits. URL-based conversion rules for /thank-you/ must not also be created
 * in the Ads account: every completion would then count twice.
 *
 * The trailing slash is the URL Apache serves a prerendered route's
 * index.html at; without it the load would pass through a 301 first.
 */
export const CONFIRMATION_PAGES = {
  contact: "/thank-you/contact/",
  application: "/thank-you/application/",
  donation: "/thank-you/donation/",
} as const;

export type ConfirmedAction = keyof typeof CONFIRMATION_PAGES;

/**
 * The sessionStorage key of the one-time token that lets a confirmation page
 * count. The Google tag snippet in client/index.html reads and removes it, and
 * on a confirmation page configures the tag and sends the conversion only when
 * the token names that exact page, so a reload, a bookmark or a direct visit
 * sends nothing.
 */
export const CONFIRMATION_TOKEN_KEY = "eos-confirmation";

/**
 * Open the confirmation page for a completed action.
 *
 * A full page load, never a wouter navigation: the Google tag records page
 * loads, and a client-side route change loads nothing it can see.
 *
 * Where sessionStorage is unavailable (blocked, or full) the token cannot be
 * written, so the page opens but the completion goes uncounted. That is the
 * intended direction to fail: undercounting is acceptable, overcounting is
 * not.
 *
 * @param action - the action that completed.
 * @example openConfirmationPage("contact"); // loads /thank-you/contact/
 */
export function openConfirmationPage(action: ConfirmedAction): void {
  const target = CONFIRMATION_PAGES[action];
  try {
    window.sessionStorage.setItem(CONFIRMATION_TOKEN_KEY, target);
  } catch {
    // Uncounted rather than miscounted; see above.
  }
  window.location.assign(target);
}
