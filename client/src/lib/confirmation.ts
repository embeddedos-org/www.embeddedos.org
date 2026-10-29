/**
 * The confirmation pages, and the one way the site opens them.
 *
 * Google Ads counts a conversion when the Google tag, which the shell carries
 * on every prerendered page, loads one of these URLs. So each page opens only
 * once the action it confirms has really completed: a message the contact
 * endpoint accepted, an application the apply endpoint delivered, a card
 * payment Stripe confirmed. No failure path, and no fallback that leaves the
 * outcome uncertain, may open one.
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
 * Open the confirmation page for a completed action.
 *
 * A full page load, never a wouter navigation: the Google tag records page
 * loads, and a client-side route change loads nothing it can see.
 *
 * @param action - the action that completed.
 * @example openConfirmationPage("contact"); // loads /thank-you/contact/
 */
export function openConfirmationPage(action: ConfirmedAction): void {
  window.location.assign(CONFIRMATION_PAGES[action]);
}
