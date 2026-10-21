import { test, expect } from "./fixtures";

/**
 * The homepage's ray-traced story (client/src/black). These replace the 3D
 * story's tests one for one: the content is in the static HTML, the story
 * mounts cleanly, it goes live, it falls back to the poster when it cannot,
 * and leaving the page releases it. The 25 industry chapters and their part
 * cards moved from the 3D stage into the explorer, so their count is still
 * pinned here.
 */
test.describe("homepage story", () => {
  test("the static HTML carries the story, the chapters and the sections, without runtime state", async ({
    page,
  }) => {
    const res = await page.request.get("/");
    const html = await res.text();

    expect(html).toContain('id="hero-heading"');
    // the hero card plus the 25 chapter cards
    expect(html.match(/<article class="card[ "]/g)?.length).toBe(26);
    expect(html.match(/<article class="spot"/g)?.length).toBe(24);
    expect(html).toContain('id="board-map"');
    for (let n = 1; n <= 25; n++) {
      expect(html).toContain(
        `<span class="eyebrow">${String(n).padStart(2, "0")} · `
      );
    }
    const chips = html.match(
      /<div class="stack-chips fin-chips">([\s\S]*?)<\/div>/
    )?.[1];
    expect(chips?.match(/<span\b/g)?.length).toBe(20);
    // the fifteen boards, each with its pane, and the film's chapters
    expect(html.match(/class="bs-pane[ "]/g)?.length).toBe(15);
    expect(html.match(/<button type="button" data-t="/g)?.length).toBe(8);
    // no state from the browser that took the snapshot
    expect(html).not.toMatch(/class="bk [^"]*\b(cine|live)\b/);
    expect(html).not.toContain('class="seq"');
    expect(html).not.toContain('class="w"');
  });

  test("the story mounts without page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator(".bk")).toHaveClass(/\bcine\b/);
    await expect(page.locator(".bk canvas.seq")).toHaveCount(1);
    await expect(page.locator("#hero-heading")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the story draws a ray-traced frame and the page stays responsive", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".bk")).toHaveClass(/\blive\b/, {
      timeout: 15_000,
    });
    const started = Date.now();
    await page.evaluate(() => document.title);
    expect(Date.now() - started).toBeLessThan(1000);
  });

  test("without web workers the frames are drawn on the main thread", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Worker", { value: undefined });
    });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator(".bk")).toHaveClass(/\blive\b/, {
      timeout: 15_000,
    });
    expect(errors).toEqual([]);
  });

  test("if the frames cannot download, the poster stays", async ({ page }) => {
    let blocked = 0;
    await page.route(/\/media\/story\/[dhm]\/s\d{3}\.avif$/, route => {
      blocked++;
      return route.abort("failed");
    });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/");
    await page.mouse.wheel(0, 300);
    await expect(page.locator(".bk")).toHaveClass(/\bcine\b/);
    await expect.poll(() => blocked).toBeGreaterThan(0);
    await expect(page.locator(".bk")).not.toHaveClass(/\blive\b/);
    await expect(page.locator(".bk-poster")).toBeVisible();
    await expect(page.locator("#hero-heading")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("with reduced motion the story reads as a still page", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#hero-heading")).toBeVisible();
    await expect(page.locator(".bk-poster")).toBeVisible();
    await expect(page.locator(".bk")).not.toHaveClass(/\bcine\b/);
    await page.locator("#bk-sc1 h2").scrollIntoViewIfNeeded();
    await expect(page.locator("#bk-sc1 h2")).toBeVisible();
  });

  test("an industry chapter opens from the list and from a link", async ({
    page,
  }) => {
    await page.goto("/");
    const tab = page.locator("#bk-ct-emedical");
    await tab.scrollIntoViewIfNeeded();
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#ch-emedical")).toBeVisible();
    await expect(page.locator("#ch-ehealth365")).toBeHidden();

    await page.goto("/#ch-rbt-hands");
    await expect(page.locator("#bk-ct-rbt-hands")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#ch-rbt-hands .spot")).toHaveCount(2);
  });

  test("the board showcase selects a board", async ({ page }) => {
    await page.goto("/");
    const tab = page.locator("#bt-cm5-base");
    await tab.scrollIntoViewIfNeeded();
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#bp-cm5-base")).toBeVisible();
    await expect(page.locator("#bp-learn-rp2350")).toBeHidden();
    await expect(page.locator(".bs-count b")).toHaveText("04");
  });

  test("a board-map part opens its details", async ({ page }) => {
    await page.goto("/");
    const map = page.locator("#board-map");
    await map.scrollIntoViewIfNeeded();
    const part = map.locator(".hp-parts button", { hasText: /^U6$/ });
    await expect(part).toBeVisible();
    await part.click();
    await expect(part).toHaveAttribute("aria-pressed", "true");
    await expect(map.locator(".hp-detail h3")).toHaveText("LPDDR4 SDRAM");
  });

  test("leaving the homepage releases the story", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".bk canvas.seq")).toHaveCount(1);
    await page.locator('a[href="/donate"]').first().click();
    await page.waitForURL("**/donate");
    await expect(page.locator("canvas.seq")).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.querySelectorAll('link[rel="preload"][href*="/media/story/"]')
              .length
        )
      )
      .toBe(0);
  });
});
