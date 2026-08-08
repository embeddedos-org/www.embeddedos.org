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

  test("the mission page states the mission, the scope and the programmes", async ({
    page,
  }) => {
    await page.goto("/mission");
    const text = await page.locator("main").innerText();

    // The statement itself, not merely the word "mission".
    expect(text).toMatch(/advance open-source embedded systems research/i);
    expect(text).toContain("41-4821627");

    // Scope has to have an edge: both halves must be present.
    expect(text).toMatch(/what the Foundation does not do/i);
    expect(text).toMatch(/do not sell software/i);

    // Every programme is named on the page.
    for (const programme of [
      "Open-Source Platform Engineering",
      "Education and Free Curriculum",
      "Research and Publication",
      "Workforce Development",
      "Community and Ecosystem Stewardship",
    ]) {
      expect(text, `missing programme: ${programme}`).toContain(programme);
    }
  });

  test("the mission is reachable from the homepage in one click", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/mission"]').first()).toBeVisible();
  });
});

test.describe("industries and activities", () => {
  test("the industries page explains the work and covers every sector", async ({
    page,
  }) => {
    await page.goto("/industries");
    const text = await page.locator("main").innerText();

    // The CAD -> board -> OS -> certification pipeline is the explanation of
    // what the Foundation actually does across sectors.
    expect(text).toMatch(/Schematic & CAD/i);
    expect(text).toMatch(/Operating system & drivers/i);

    // A representative sector from each end of the list.
    for (const sector of [
      "Aerospace",
      "Rail & Transit",
      "Water & Wastewater",
      "Sustainable & Circular Electronics",
    ]) {
      expect(text, `missing sector: ${sector}`).toContain(sector);
    }
  });

  test("every industry card carries a standard, a maturity and a funding theme", async ({
    page,
  }) => {
    await page.goto("/industries");
    const counts = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("main article")];
      return {
        cards: cards.length,
        withStandards: cards.filter(c =>
          /Target standards/i.test(c.textContent ?? "")
        ).length,
        withMaturity: cards.filter(c => /Maturity/i.test(c.textContent ?? ""))
          .length,
        withDesignField: cards.filter(c =>
          /Reference design/i.test(c.textContent ?? "")
        ).length,
      };
    });
    expect(counts.cards).toBeGreaterThanOrEqual(38);
    expect(counts.withStandards).toBe(counts.cards);
    expect(counts.withMaturity).toBe(counts.cards);
    expect(counts.withDesignField).toBe(counts.cards);
  });

  test("standards are stated as targets, never as certifications held", async ({
    page,
  }) => {
    await page.goto("/industries");
    const text = await page.locator("main").innerText();

    // The repositories hold no certification from any authority. Two source
    // datasheets overstate this ("DO-178C Level A certified software",
    // "ISO 13485 QMS certified"); neither wording may reach the site.
    expect(text).toMatch(/Target standards are targets, not certifications held/i);
    expect(text, "no page copy may claim a held certification").not.toMatch(
      /\b(?:is|are)\s+certified\b|certified\s+(?:software|hardware)/i
    );
  });

  test("TRL is disclosed as self-assessed and never claims qualification", async ({
    page,
  }) => {
    await page.goto("/industries");
    const text = await page.locator("main").innerText();

    expect(text).toMatch(/self-assessed/i);
    expect(text).toMatch(/TRL 1-2|TRL 2-3|TRL 3-4/);

    // Assert on the badges rather than the prose: the legend deliberately
    // contains the sentence "nothing here claims TRL 5 or above", which is a
    // disclaimer, not a claim. What must not exceed TRL 4 is what each card
    // asserts about a design, so read the cards.
    const badges = await page
      .locator("main article")
      .evaluateAll(cards =>
        cards
          .map(c => (c.textContent ?? "").match(/TRL\s*[\d-]+/)?.[0] ?? "")
          .filter(Boolean)
      );
    expect(badges.length).toBeGreaterThanOrEqual(30);
    const overstated = badges.filter(b => /TRL\s*[5-9]/.test(b));
    expect(
      overstated,
      "no card may assert TRL 5+ without a qualification campaign"
    ).toEqual([]);
  });

  test("a sector with no design says so instead of borrowing one", async ({
    page,
  }) => {
    await page.goto("/industries");
    const text = await page.locator("main").innerText();
    expect(text).toMatch(/No reference design yet/i);
    expect(text).toMatch(/Not yet assessed/i);
  });
});

test.describe("nonprofit transparency", () => {
  test("registration details are published, not withheld", async ({ page }) => {
    await page.goto("/transparency");
    const text = await page.locator("main").innerText();

    expect(text).toContain("41-4821627");
    expect(text).toMatch(/501\(c\)\(3\)/);
    expect(text).toMatch(/509\(a\)\(2\)/);
    expect(text).toMatch(/Embedded Operating Systems Research Foundation/);
  });

  test("the page links the IRS record so status can be verified independently", async ({
    page,
  }) => {
    await page.goto("/transparency");
    const irs = page.locator('a[href^="https://apps.irs.gov"]');
    await expect(irs.first()).toBeVisible();
  });

  test("the contact page publishes the EIN rather than offering it on request", async ({
    page,
  }) => {
    await page.goto("/contact");
    const text = await page.locator("main").innerText();
    expect(text).toContain("41-4821627");
    expect(text).not.toMatch(/EIN available upon request/i);
  });

  test("a verifiable postal address is published", async ({ page }) => {
    await page.goto("/contact");
    const address = page.locator("main address");
    await expect(address).toBeVisible();
    const text = await address.innerText();
    expect(text).toMatch(/2601 Cortez Dr/);
    expect(text).toMatch(/Santa Clara, CA 95051/);
  });

  test("use-of-funds is stated and no financial figure is invented", async ({
    page,
  }) => {
    await page.goto("/transparency");
    const text = await page.locator("main").innerText();

    expect(text).toMatch(/what happens to money given to the Foundation/i);

    // The first tax year is still open, so the page must say when real numbers
    // arrive rather than print a dollar amount it cannot support.
    expect(text).toMatch(/no annual return exists yet|first tax year/i);
    expect(
      text,
      "no currency figure may appear before a return is filed"
    ).not.toMatch(/\$\s?[\d,]{4,}/);
  });

  test("the shell carries nonprofit structured data", async ({ page }) => {
    await page.goto("/");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const data = JSON.parse(raw ?? "{}");
    expect(data["@type"]).toBe("NGO");
    expect(data.taxID).toBe("41-4821627");
    expect(data.nonprofitStatus).toBe("Nonprofit501c3");
  });
});

test.describe("substantial, original content", () => {
  const SAMPLE = [
    "/",
    "/about",
    "/mission",
    "/transparency",
    "/industries",
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
