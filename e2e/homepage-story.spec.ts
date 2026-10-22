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
    await page.route(
      /\/media\/home-[^/]+\/story\/[dhm]\/s\d{3}\.avif$/,
      route => {
        blocked++;
        return route.abort("failed");
      }
    );
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

  test("a link to a chapter lands on it", async ({ page }) => {
    await page.goto("/#ch-emedical");
    await expect(page.locator("#bk-ct-emedical")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // the chapter is brought into view once the story has its full length
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const r = document
              .getElementById("ch-emedical")!
              .getBoundingClientRect();
            return r.top >= 0 && r.top < innerHeight / 2;
          }),
        { timeout: 5_000 }
      )
      .toBe(true);
  });

  test("the chapter list answers Home and End", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("#bk-ct-ehealth365");
    await first.scrollIntoViewIfNeeded();
    await first.focus();
    await page.keyboard.press("End");
    await expect(page.locator("#bk-ct-every")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#bk-ct-every")).toBeFocused();
    await page.keyboard.press("Home");
    await expect(first).toHaveAttribute("aria-selected", "true");
  });

  test("neither the chapters nor the boards change by themselves", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#industries").scrollIntoViewIfNeeded();
    await page.waitForTimeout(8_000);
    await expect(page.locator("#bk-ct-ehealth365")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await page.locator("#bshow").scrollIntoViewIfNeeded();
    await page.waitForTimeout(8_000);
    await expect(page.locator("#bt-learn-rp2350")).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("a software renderer gets the light mode", async ({ page }) => {
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (type: string, opts?: unknown) => unknown;
      };
      const real = proto.getContext;
      proto.getContext = function (this: unknown, type, opts) {
        if (type.startsWith("webgl") || type === "experimental-webgl")
          return {
            getExtension: (n: string) =>
              n === "WEBGL_debug_renderer_info"
                ? { UNMASKED_RENDERER_WEBGL: 0x9246 }
                : null,
            getParameter: () => "Google SwiftShader",
          };
        return real.call(this, type, opts);
      };
    });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator(".bk")).toHaveClass(/\blite\b/, {
      timeout: 10_000,
    });
    await expect(page.locator("#hero-heading")).toBeVisible();
    expect(errors).toEqual([]);
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
    let after = 0;
    let left = false;
    page.on("request", r => {
      if (left && /\/media\/home-[^/]+\/story\//.test(r.url())) after++;
    });
    await page.locator('a[href="/donate"]').first().click();
    await page.waitForURL("**/donate");
    left = true;
    await page.waitForTimeout(1_500);
    expect(after).toBe(0);
    await expect(page.locator("canvas.seq")).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.querySelectorAll('link[rel="preload"][href*="/story/"]')
              .length
        )
      )
      .toBe(0);
  });
});
