/**
 * Homepage carousel paging (CardCarousel).
 *
 * Pure-DOM assertions — no WebGL, no GPU: clicks the Next/Prev arrows of the
 * "Product showcase" carousel and asserts the page indicator text and the
 * track's scroll position both change.
 *
 * NOTE: the repo's playwright config uses testDir "./e2e"; this file lives
 * under tests/e2e per the task brief, so run it explicitly, e.g.
 *   pnpm exec playwright test --config <config> tests/e2e/homepage-carousel.spec.ts
 * or move it under e2e/ to join the default suite.
 */
import { test, expect } from "@playwright/test";

test("homepage product carousel pages with Next/Prev arrows", async ({
  page,
}) => {
  await page.goto("/");

  const region = page.getByRole("region", { name: "Product showcase" });
  await region.scrollIntoViewIfNeeded();
  await expect(region).toBeVisible();

  const nextButton = page.getByRole("button", { name: "Next products" });
  const prevButton = page.getByRole("button", { name: "Previous products" });

  // The arrows only render when there is more than one page of cards.
  await expect(nextButton).toBeVisible();
  await expect(prevButton).toBeVisible();

  // The page indicator lives in the controls row next to the arrows.
  const controls = nextButton.locator("xpath=ancestor::div[2]");
  const indicator = controls.getByText(/^Page \d+ of \d+$/);
  await expect(indicator).toBeVisible();

  const trackScrollLeft = () =>
    region.evaluate(
      el => (el.firstElementChild as HTMLElement | null)?.scrollLeft ?? -1
    );

  const firstPage = (await indicator.textContent()) ?? "";
  expect(firstPage).toMatch(/^Page 1 of \d+$/);
  expect(await trackScrollLeft()).toBe(0);
  await expect(prevButton).toBeDisabled();

  // Next: indicator advances and the track scrolls.
  await nextButton.click();
  await expect(indicator).not.toHaveText(firstPage);
  const secondPage = (await indicator.textContent()) ?? "";
  expect(secondPage).toMatch(/^Page 2 of \d+$/);
  expect(await trackScrollLeft()).toBeGreaterThan(0);
  await expect(prevButton).toBeEnabled();

  // Prev: back to the first page and scroll position. The scroll is
  // smooth-animated, so poll until it settles.
  await prevButton.click();
  await expect(indicator).toHaveText(firstPage);
  await expect.poll(() => trackScrollLeft(), { timeout: 5000 }).toBe(0);
});

test("homepage carousel scroll track is keyboard-focusable", async ({
  page,
}) => {
  // Guards the axe "scrollable-region-focusable" gate: the overflow-x-auto
  // track must be reachable by keyboard so users can scroll it.
  await page.goto("/");

  const region = page.getByRole("region", { name: "Product showcase" });
  await region.scrollIntoViewIfNeeded();
  const track = region.locator(":scope > div").first();

  await expect(track).toHaveAttribute("tabindex", "0");
  await track.focus();
  await expect(track).toBeFocused();
});
