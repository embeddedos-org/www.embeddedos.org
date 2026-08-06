/**
 * Acceptance tests — the Google Ad Grants website policy, expressed as
 * executable criteria.
 *
 * Source: support.google.com/nonprofits/answer/1657899. Each test maps to a
 * stated requirement or a listed rejection reason, so a pass here is evidence
 * the site satisfies the policy items that are testable without the live URL.
 *
 * Not covered here (require the public URL): PageSpeed Insights score, Google's
 * Mobile-Friendly Test, and domain-ownership verification in Google Ads.
 */
import { test, expect } from "@playwright/test";

test.describe("clear mission", () => {
  test("the homepage states the nonprofit mission above the footer", async ({
    page,
  }) => {
    await page.goto("/");
    const main = await page.locator("main").innerText();
    expect(main).toContain("501(c)(3)");
    expect(main).toMatch(/mission/i);
    expect(main).toMatch(/nonprofit|foundation/i);
  });

  test("the registration number is published", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toContainText("41-4821627");
  });

  test("a dedicated About page describes activities and programmes", async ({
    page,
  }) => {
    await page.goto("/about");
    const text = await page.locator("main").innerText();
    expect(text.length).toBeGreaterThan(1500);
    expect(text).toMatch(/501\(c\)\(3\)/);
  });
});

test.describe("substantial, original content", () => {
  const SAMPLE = [
    "/",
    "/about",
    "/what-we-do",
    "/organization",
    "/getting-started",
    "/kids",
  ];

  for (const route of SAMPLE) {
    test(`${route} carries substantial body text`, async ({ page }) => {
      await page.goto(route);
      const text = await page.locator("main").innerText();
      expect(
        text.replace(/\s+/g, " ").trim().length,
        `${route} text`
      ).toBeGreaterThan(1000);
    });
  }

  test("key pages are not merely lists of links", async ({ page }) => {
    for (const route of ["/", "/about", "/what-we-do"]) {
      await page.goto(route);
      const ratio = await page.evaluate(() => {
        const main = document.querySelector("main")!;
        const all = (main.innerText || "").replace(/\s+/g, " ").trim().length;
        const linkText = [...main.querySelectorAll("a")]
          .map(a => (a.innerText || "").replace(/\s+/g, " ").trim().length)
          .reduce((a, b) => a + b, 0);
        return linkText / Math.max(all, 1);
      });
      expect(ratio, `${route} link-text ratio`).toBeLessThan(0.5);
    }
  });
});

test.describe("navigation and working links", () => {
  test("a persistent navigation menu is present on every sampled page", async ({
    page,
  }) => {
    for (const route of ["/", "/about", "/donate", "/faq"]) {
      await page.goto(route);
      await expect(page.locator("nav, header").first()).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    }
  });

  test("no internal link anywhere in the sampled pages is broken", async ({
    page,
    request,
  }) => {
    const checked = new Set<string>();
    const broken: string[] = [];

    for (const route of [
      "/",
      "/about",
      "/get-involved",
      "/resources",
      "/donate",
    ]) {
      await page.goto(route);
      const hrefs = await page
        .locator("a[href^='/']")
        .evaluateAll(els => els.map(e => e.getAttribute("href")!));
      for (const href of hrefs) {
        const clean = href.split("#")[0].split("?")[0];
        if (!clean || checked.has(clean)) continue;
        checked.add(clean);
        const res = await request.get(clean);
        if (res.status() >= 400) broken.push(`${clean} -> ${res.status()}`);
      }
    }
    expect(checked.size).toBeGreaterThan(25);
    expect(broken).toEqual([]);
  });
});

test.describe("functioning donation process", () => {
  test("a donation call to action is reachable from the homepage in one click", async ({
    page,
  }) => {
    await page.goto("/");
    const donate = page.locator('a[href="/donate"]').first();
    await expect(donate).toBeVisible();
  });

  test("the donation page offers a secure, working path to give", async ({
    page,
    request,
  }) => {
    await page.goto("/donate");
    const frame = page.locator("iframe[src]");
    await expect(frame).toHaveCount(1);
    const src = await frame.getAttribute("src");
    expect(src, "donation form must be served over HTTPS").toMatch(/^https:/);

    // The provider endpoint must be live and embeddable.
    const res = await request.get(src!, { maxRedirects: 5 });
    expect(res.status(), "donation provider reachable").toBe(200);
  });
});

test.describe("prohibited content", () => {
  test("no advertising or affiliate scripts anywhere in the build", async ({
    page,
  }) => {
    await page.goto("/");
    const html = await page.content();
    for (const banned of [
      "adsbygoogle",
      "pagead",
      "doubleclick",
      "amazon-adsystem",
    ]) {
      expect(html, `must not contain ${banned}`).not.toContain(banned);
    }
  });

  test("no third-party ad iframes are injected", async ({ page }) => {
    await page.goto("/");
    const srcs = await page
      .locator("iframe")
      .evaluateAll(f => f.map(x => x.getAttribute("src") ?? ""));
    expect(
      srcs.filter(s => /doubleclick|googlesyndication|adservice/.test(s))
    ).toEqual([]);
  });
});

test.describe("secure and crawlable", () => {
  test("robots.txt permits crawling and advertises the sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/^User-agent: \*/m);
    expect(body).toContain("Sitemap:");
    expect(body).not.toMatch(/^Disallow: \/$/m); // must not block the whole site
  });

  test("the sitemap lists the mission-critical pages", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    for (const p of [
      "/about",
      "/donate",
      "/organization",
      "/contact",
      "/get-involved",
    ]) {
      expect(body, `sitemap missing ${p}`).toContain(
        `https://www.embeddedos.org${p}`
      );
    }
  });

  test("no page requests an insecure http:// subresource", async ({ page }) => {
    const insecure: string[] = [];
    page.on("request", r => {
      if (r.url().startsWith("http://") && !r.url().includes("127.0.0.1"))
        insecure.push(r.url());
    });
    for (const route of ["/", "/about", "/donate"]) await page.goto(route);
    expect(insecure).toEqual([]);
  });
});
