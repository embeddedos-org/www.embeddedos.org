/**
 * Clicks every in-page control on every prerendered route.
 *
 * links-and-controls.spec.ts proves each of the ~9,000 anchors resolves and
 * each of the ~1,100 buttons carries an accessible name, but it reads the
 * built HTML — it never presses anything. A button can satisfy both checks and
 * still throw the moment it is clicked, which is exactly the class of defect
 * that reaches a visitor first.
 *
 * So: press them. For each route, every visible <button> inside <main> is
 * clicked and the page is watched for an uncaught exception or a console
 * error. Controls are re-queried after each click because clicking one can
 * replace the set (tabs, filters, accordions).
 *
 * Scope is deliberate. The navbar and footer render on all 95 routes; pressing
 * them 95 times would multiply runtime without adding coverage, and they are
 * already driven by the navigation and modal tests in regression.spec.ts. They
 * are exercised here on a small sample instead.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist/public");

const ROUTES = fs
  .globSync("**/index.html", { cwd: DIST })
  .map(f => "/" + f.replace(/(^|\/)index\.html$/, "").replace(/\/$/, ""))
  .map(r => (r === "" ? "/" : r))
  .sort();

/** Console noise that is the environment, not the site. */
const IGNORE =
  /THREE\.Clock|GL Driver Message|WebGL|ReadPixels|React DevTools|requestStorageAccess|fonts\.gstatic\.com|Failed to load resource/i;

/**
 * A page with more controls than this is sampled, and the cap is reported as
 * an annotation rather than passing quietly. It is set above the busiest page
 * in the build (/api-docs, 80 controls) so nothing is currently sampled.
 */
const MAX_CLICKS_PER_PAGE = 120;

/**
 * Pressing dozens of controls one at a time, re-navigating whenever one leaves
 * the route, does not fit the default 30s — and did not, on /ecad-hardware,
 * once the suite ran its workers in parallel.
 */
const SWEEP_TIMEOUT_MS = 150_000;

/**
 * Sections animate in on mount. A control clicked in that window is still
 * moving, and the click misses rather than failing honestly, so settle first.
 */
async function settle(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(600);
}

test.describe.configure({ mode: "parallel" });

for (const route of ROUTES) {
  test(`every control on ${route} survives being clicked`, async ({
    page,
    context,
  }) => {
    test.setTimeout(SWEEP_TIMEOUT_MS);

    // The donate popup fires 20s in and would swallow clicks mid-sweep.
    await context.addInitScript(() =>
      localStorage.setItem("eos-donate-dismissed", String(Date.now()))
    );

    const errors: string[] = [];
    page.on("pageerror", e => errors.push(`${route} :: ${String(e)}`));
    page.on("console", m => {
      if (m.type() === "error" && !IGNORE.test(m.text())) {
        errors.push(`${route} :: ${m.text().slice(0, 200)}`);
      }
    });

    await page.goto(route, { waitUntil: "domcontentloaded" });
    await settle(page);

    const total = await page.locator("main button").count();
    const budget = Math.min(total, MAX_CLICKS_PER_PAGE);
    if (total > MAX_CLICKS_PER_PAGE) {
      test.info().annotations.push({
        type: "sampled",
        description: `${route}: clicked ${budget} of ${total} controls`,
      });
    }

    for (let i = 0; i < budget; i++) {
      const buttons = page.locator("main button");
      if (i >= (await buttons.count())) break;

      const button = buttons.nth(i);
      if (!(await button.isVisible().catch(() => false))) continue;
      if (!(await button.isEnabled().catch(() => false))) continue;

      await button.click({ timeout: 5000, trial: false }).catch(() => {
        // An intercepted or detached control is not itself a defect — a click
        // that throws *inside the page* is, and that lands in `errors`.
      });

      // Clicking can open an overlay or leave the route; reset either way so
      // the next control is reachable.
      await page.keyboard.press("Escape").catch(() => {});
      if (new URL(page.url()).pathname !== route) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await settle(page);
      }
    }

    expect(errors, `controls threw on ${route}`).toEqual([]);
  });
}

test.describe("site chrome controls", () => {
  for (const route of ["/", "/donate", "/careers"]) {
    test(`header and footer controls on ${route} survive being clicked`, async ({
      page,
      context,
    }) => {
      test.setTimeout(SWEEP_TIMEOUT_MS);

      await context.addInitScript(() =>
        localStorage.setItem("eos-donate-dismissed", String(Date.now()))
      );

      const errors: string[] = [];
      page.on("pageerror", e => errors.push(`${route} :: ${String(e)}`));
      page.on("console", m => {
        if (m.type() === "error" && !IGNORE.test(m.text())) {
          errors.push(`${route} :: ${m.text().slice(0, 200)}`);
        }
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });
      await settle(page);

      const chrome = page.locator("header button, footer button");
      const count = await chrome.count();
      expect(count, `${route} renders no chrome controls`).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const button = page.locator("header button, footer button").nth(i);
        if (!(await button.isVisible().catch(() => false))) continue;
        await button.click({ timeout: 5000 }).catch(() => {});
        await page.keyboard.press("Escape").catch(() => {});
        if (new URL(page.url()).pathname !== route) {
          await page.goto(route, { waitUntil: "domcontentloaded" });
          await settle(page);
        }
      }

      expect(errors, `chrome controls threw on ${route}`).toEqual([]);
    });
  }
});
