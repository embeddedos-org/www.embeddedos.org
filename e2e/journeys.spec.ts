/**
 * End-to-end journeys — complete paths a real visitor takes, across pages.
 *
 * These are deliberately multi-step: they fail if any link in the chain breaks,
 * which is what the Ad Grants reviewer will actually experience.
 */
import { test, expect } from "@playwright/test";

test.describe("donor journey", () => {
  test("lands on the homepage, understands the mission, and reaches the donation form", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. The nonprofit identity is visible without scrolling into the footer.
    await expect(page.locator("body")).toContainText("501(c)(3)");

    // 2. The mission section explains what the money supports.
    await expect(
      page.getByRole("heading", { name: /free to learn/i })
    ).toBeVisible();

    // 3. A donation CTA is reachable.
    const cta = page.locator('a[href="/donate"]').first();
    await expect(cta).toBeVisible();
    await cta.click();
    await page.waitForURL("**/donate");

    // 4. The donation page states tax-deductibility and the EIN.
    await expect(page.locator("body")).toContainText(/tax[- ]deductible/i);
    await expect(page.locator("body")).toContainText("41-4821627");
  });
});

test.describe("prospective contributor journey", () => {
  test("homepage -> get involved -> a live GitHub repository", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    await page.goto("/get-involved");
    await expect(page.locator("h1").first()).toBeVisible();

    const repoLinks = await page
      .locator('a[href^="https://github.com/embeddedos-org"]')
      .evaluateAll(els => [...new Set(els.map(e => e.getAttribute("href")!))]);
    expect(repoLinks.length).toBeGreaterThan(3);

    // Every advertised repo must be publicly reachable — private repos 404 for visitors.
    const unreachable: string[] = [];
    for (const href of repoLinks) {
      const res = await request.get(href, { maxRedirects: 5 });
      if (res.status() !== 200) unreachable.push(`${href} -> ${res.status()}`);
    }
    expect(unreachable).toEqual([]);
  });
});

test.describe("researcher journey", () => {
  test("finds the organisation's governance and financial identity", async ({
    page,
  }) => {
    await page.goto("/");
    await page.goto("/organization");
    await expect(page.locator("body")).toContainText("501(c)(3)");
    await expect(page.locator("body")).toContainText("41-4821627");

    await page.goto("/about");
    await expect(page.locator("body")).toContainText(/501\(c\)\(3\)/);
  });

  test("patent claims link to documents that exist", async ({
    page,
    request,
  }) => {
    await page.goto("/patents");
    const links = await page
      .locator('a[href*="github.com"]')
      .evaluateAll(els => [...new Set(els.map(e => e.getAttribute("href")!))]);
    const broken: string[] = [];
    for (const href of links) {
      const res = await request.get(href, { maxRedirects: 5 });
      if (res.status() !== 200) broken.push(`${href} -> ${res.status()}`);
    }
    expect(broken).toEqual([]);
  });
});

test.describe("developer journey", () => {
  test("getting started -> docs -> API reference all render real content", async ({
    page,
  }) => {
    for (const route of ["/getting-started", "/docs", "/api-docs"]) {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible();
      const text = await page.locator("#root").innerText();
      expect(text.length, `${route} content length`).toBeGreaterThan(500);
    }
  });
});

test.describe("no-JavaScript visitor", () => {
  test.use({ javaScriptEnabled: false });

  test("still sees the mission, navigation and calls to action", async ({
    page,
  }) => {
    await page.goto("/");
    const text = await page.locator("body").innerText();

    expect(text.length, "text visible without JS").toBeGreaterThan(2000);
    expect(text).toContain("501(c)(3)");
    expect(text).toMatch(/donat/i);

    // Navigation must be present as real anchors, not JS-only handlers.
    const links = await page.locator("a[href]").count();
    expect(links).toBeGreaterThan(30);
  });

  test("interior pages are readable without JS too", async ({ page }) => {
    for (const route of ["/about", "/donate", "/organization"]) {
      await page.goto(route);
      const text = await page.locator("body").innerText();
      expect(text.length, `${route} without JS`).toBeGreaterThan(1000);
    }
  });
});
