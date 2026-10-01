import { test as base } from "@playwright/test";

/**
 * Shared Playwright fixtures for every spec in e2e/.
 *
 * client/index.html ships the disclosed Google Ads tag (AW-18484485270).
 * In a browser under test that tag calls out to Google on every page load,
 * which caused two problems:
 *   - Tests depended on third-party network access, which CI runners and
 *     sandboxes do not reliably have.
 *   - The tag's requests kept `waitUntil: "networkidle"` from settling, so
 *     every axe check timed out at 30 s. Failed requests also surfaced as
 *     "TypeError: Failed to fetch" page errors in the controls specs.
 * Google's endpoints are answered locally with an empty script, so gtag()
 * still exists and the page behaves normally. Nothing leaves the machine.
 * What the tag is allowed to be is pinned separately, by
 * tests/unit/public-claims-policy.test.ts.
 */
const GOOGLE_TAG_HOSTS =
  /^https?:\/\/([a-z0-9-]+\.)*(googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|googlesyndication\.com)\//;

/**
 * /donate embeds Zeffy's donation form. Inside that cross-origin frame Zeffy
 * runs its own Amplitude, Clarity, Sprig, Stripe, hCaptcha and reCAPTCHA, and
 * when Amplitude cannot reach api2.amplitude.com it logs "Amplitude Logger
 * [Error]: Failed to fetch" to the console — an error from Zeffy's code, in
 * Zeffy's frame, that failed the /donate controls sweep whenever the runner's
 * network hiccupped. None of it is ours to fix, so the embed is answered with
 * a placeholder document. The <iframe> and its src are still our markup and
 * still asserted; that Zeffy itself is live is checked over HTTP by
 * acceptance-adgrants.spec.ts, which this route does not affect.
 */
const ZEFFY_EMBED = /^https:\/\/www\.zeffy\.com\/[^?#]*\/embed\//;

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(GOOGLE_TAG_HOSTS, route =>
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "",
      })
    );
    await context.route(ZEFFY_EMBED, route =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Zeffy donation form (e2e placeholder)</title>",
      })
    );
    await use(context);
  },
});

export * from "@playwright/test";
