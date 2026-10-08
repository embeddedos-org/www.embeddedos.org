import { test, expect } from "./fixtures";

const FALLBACK = "The embedded donation form could not load";

test.describe("donation embed fallback", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/zeffy\.com/, () => {});
  });

  test("a visitor whose embed never loads is offered the fallback", async ({
    page,
  }) => {
    await page.goto("/donate", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(FALLBACK)).toBeVisible({ timeout: 10_000 });
  });

  test("a prerender snapshot never captures the fallback", async ({ page }) => {
    await page.addInitScript(() => {
      (window as Window & { __EOS_PRERENDER__?: boolean }).__EOS_PRERENDER__ =
        true;
    });
    await page.goto("/donate", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(8_000);
    await expect(page.getByText(FALLBACK)).toHaveCount(0);
  });
});
