/**
 * Functional tests — does each feature behave the way a user expects?
 *
 * Navigation, client-side routing, the donation surface, footer wiring, images,
 * and the metadata a search engine reads.
 */
import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("the header exposes the primary menus", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav, header").first();
    await expect(nav).toBeVisible();
    for (const label of ["Projects", "Products", "Docs"]) {
      await expect(
        nav.getByText(label, { exact: false }).first()
      ).toBeVisible();
    }
  });

  test("client-side routing changes the page without a full reload", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => ((window as any).__stillHere = true));

    await page.getByRole("link", { name: /about/i }).first().click();
    await page.waitForURL("**/about");

    await expect(page.locator("h1").first()).toBeVisible();
    // If the SPA router handled it, our marker survived.
    expect(await page.evaluate(() => (window as any).__stillHere)).toBe(true);
  });

  test("the footer links to the pages that used to be orphans", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const href of [
      "/faq",
      "/downloads",
      "/community",
      "/events",
      "/changelog",
      "/resources",
      "/vision",
      "/partners",
      "/fundraising",
      "/code-of-conduct",
      "/ecosystem",
      "/eosuite",
    ]) {
      await expect(
        footer.locator(`a[href="${href}"]`),
        `footer link ${href}`
      ).toHaveCount(1);
    }
  });

  test("every footer link resolves to a real page", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("footer a[href^='/']")
      .evaluateAll(els => [...new Set(els.map(e => e.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThan(20);

    const broken: string[] = [];
    for (const href of hrefs) {
      const res = await request.get(href);
      if (res.status() !== 200) broken.push(`${href} -> ${res.status()}`);
    }
    expect(broken).toEqual([]);
  });

  test("the skip-to-content link is the first focusable element", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        text: el?.textContent?.trim() ?? "",
        href: el?.getAttribute("href") ?? "",
      };
    });
    expect(`${focused.text} ${focused.href}`.toLowerCase()).toContain(
      "content"
    );
  });
});

test.describe("donation surface", () => {
  test("the donate page presents a usable giving path", async ({ page }) => {
    await page.goto("/donate");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/tax[- ]deductible/i);
    await expect(page.locator("body")).toContainText("41-4821627");
    // Either the embed renders, or the fallback link to the hosted form is offered.
    const iframe = page.locator('iframe[title*="Donation" i]');
    await expect(iframe).toHaveCount(1);
  });

  test("donation entry points exist on the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/donate"]').first()).toBeVisible();
  });

  test("the homepage donate CTA navigates to the donate page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator('a[href="/donate"]').first().click();
    await page.waitForURL("**/donate");
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("images", () => {
  test("no broken images on the key pages", async ({ page }) => {
    for (const route of ["/", "/about", "/what-we-do"]) {
      await page.goto(route);
      await page.waitForLoadState("networkidle").catch(() => {});
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter(img => img.complete && img.naturalWidth === 0)
          .map(img => img.currentSrc || img.src)
      );
      expect(broken, `broken images on ${route}`).toEqual([]);
    }
  });

  test("every image carries an alt attribute", async ({ page }) => {
    await page.goto("/");
    const missing = await page.evaluate(() =>
      [...document.images].filter(i => !i.hasAttribute("alt")).map(i => i.src)
    );
    expect(missing).toEqual([]);
  });
});

test.describe("metadata", () => {
  test("each page carries its own title, description and canonical", async ({
    page,
  }) => {
    const seen = new Map<string, string>();
    for (const route of ["/", "/about", "/donate", "/faq", "/organization"]) {
      // domcontentloaded, not load: title, description and canonical are all in
      // <head> and final as soon as the document parses. /donate's third-party
      // payment iframe keeps the load event pending for ~7.5s against ~150ms
      // elsewhere, which put this five-route loop at the edge of its 30s budget
      // and made it fail intermittently. The assertions below are unchanged.
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const meta = await page.evaluate(() => ({
        title: document.title,
        description:
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") ?? "",
        canonical:
          document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href") ?? "",
      }));
      expect(meta.title.length, `${route} title`).toBeGreaterThan(10);
      expect(meta.description.length, `${route} description`).toBeGreaterThan(
        50
      );
      expect(meta.canonical, `${route} canonical`).toContain(
        route === "/" ? "/" : route
      );
      expect(seen.has(meta.title), `duplicate title on ${route}`).toBe(false);
      seen.set(meta.title, route);
    }
  });
});
