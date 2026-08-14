/**
 * Smoke tests — the fastest "is the site fundamentally alive" pass.
 *
 * Runs on both desktop and mobile projects. If any of these fail, nothing else
 * is worth running.
 */
import { test, expect } from "@playwright/test";

const CRITICAL_ROUTES = ["/", "/about", "/donate", "/contact", "/get-involved"];

/**
 * Routes whose `load` event is gated on third-party iframes.
 *
 * `/donate` embeds Zeffy, which nests Stripe, hCaptcha and reCAPTCHA. Measured
 * on the mobile project with one worker, its navigation takes 14.0–17.9s — under
 * 2x margin against the 30s default, which the full parallel suite exceeded.
 * The assertions below need none of those frames, but dropping to
 * `domcontentloaded` would also shorten the window in which a first-party error
 * is caught, so the wait is kept and the budget raised instead. Every other
 * route stays on the strict default: a slow `/` should still fail fast.
 */
const THIRD_PARTY_EMBED_ROUTES = new Set(["/donate"]);
const THIRD_PARTY_TIMEOUT_MS = 90_000;

test.describe("smoke", () => {
  for (const route of CRITICAL_ROUTES) {
    test(`${route} loads, renders a heading, and logs no console errors`, async ({
      page,
      baseURL,
    }) => {
      if (THIRD_PARTY_EMBED_ROUTES.has(route)) {
        test.setTimeout(THIRD_PARTY_TIMEOUT_MS);
      }

      const errors: string[] = [];

      // Only first-party errors count. /donate embeds Zeffy's donation form,
      // which in turn loads Stripe, hCaptcha and Google reCAPTCHA in nested
      // cross-origin iframes; reCAPTCHA logs "requestStorageAccess: Permission
      // denied" in a headless context every time. Asserting on those makes the
      // check fail for something this project cannot change, which is how a
      // smoke test stops being read. Errors raised by our own scripts still
      // fail here, and pageerror is always first-party.
      page.on("console", m => {
        if (m.type() !== "error") return;
        const from = m.location()?.url ?? "";
        if (from && baseURL && !from.startsWith(baseURL)) return;
        errors.push(m.text());
      });
      page.on("pageerror", e => errors.push(String(e)));

      const response = await page.goto(route);
      expect(response?.status(), `${route} HTTP status`).toBe(200);

      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("#root")).not.toBeEmpty();
      expect(errors, `console errors on ${route}`).toEqual([]);
    });
  }

  test("the site logo image actually loads", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator("header img, nav img").first();
    await expect(logo).toBeVisible();
    const ok = await logo.evaluate(
      (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
    );
    expect(ok, "logo failed to load (broken image)").toBe(true);
  });

  test("an unknown URL returns a real 404 page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-42");
    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).toContainText("404");
  });
});
