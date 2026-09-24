/**
 * Largest Contentful Paint on the homepage, measured in headless Chromium.
 *
 * Reads the LCP performance entries the browser records itself — no GPU, no
 * rendering assertions, no screenshots. The threshold is deliberately
 * generous: this is a regression tripwire for something pathological (a
 * render-blocking chain, a hero image that stops loading), not a performance
 * target. The webServer in playwright.config.ts serves the production build,
 * so this measures what actually ships.
 */
import { test, expect, type Page } from "@playwright/test";

// Generous on purpose: local serving plus a cold headless browser. A real
// regression shows up as tens of seconds, not a few hundred milliseconds.
const LCP_BUDGET_MS = 8000;

async function readLCP(page: Page): Promise<number | null> {
  return page.evaluate(
    (timeoutMs: number) =>
      new Promise<number | null>(resolve => {
        const latest = () => {
          const entries = performance.getEntriesByType(
            "largest-contentful-paint"
          ) as PerformanceEntry[];
          return entries.length ? entries[entries.length - 1].startTime : null;
        };
        const done = latest();
        if (done !== null) {
          resolve(done);
          return;
        }
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          if (entries.length) {
            observer.disconnect();
            resolve(entries[entries.length - 1].startTime);
          }
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(latest());
        }, timeoutMs);
      }),
    15000
  );
}

test("homepage records an LCP within a generous budget", async ({ page }) => {
  await page.goto("/");
  // Let the page settle: LCP fires once the largest element paints, and the
  // homepage hero is above the fold by construction.
  await page.waitForLoadState("networkidle");
  const lcp = await readLCP(page);
  expect(lcp, "browser recorded an LCP entry").not.toBeNull();
  expect(
    lcp as number,
    `homepage LCP ${Math.round(lcp as number)}ms exceeds ${LCP_BUDGET_MS}ms`
  ).toBeLessThan(LCP_BUDGET_MS);
});
