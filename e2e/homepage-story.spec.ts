import { test, expect } from "./fixtures";

test.describe("homepage 3D story", () => {
  test("the static HTML carries the story and the sections, without runtime state", async ({
    page,
  }) => {
    const res = await page.request.get("/");
    const html = await res.text();

    expect(html).toContain('id="hero-heading"');
    expect(html.match(/<article class="card[ "]/g)?.length).toBe(26);
    expect(html).toContain('id="board-map"');
    for (let n = 1; n <= 20; n++) {
      expect(html).toContain(
        `<span class="eyebrow">${String(n).padStart(2, "0")} · `
      );
    }
    const chips = html.match(
      /<div class="stack-chips fin-chips">([\s\S]*?)<\/div>/
    )?.[1];
    expect(chips?.match(/<span\b/g)?.length).toBe(20);
    expect(html).not.toMatch(/class="hs [^"]*gl-ready/);
    expect(html).not.toContain('class="w"');
  });

  test("the story mounts without page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/");
    await expect
      .poll(() => page.evaluate(() => typeof (window as { IO?: unknown }).IO))
      .toBe("object");
    await expect(page.locator("#hero-heading")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the 3D stage settles and the page stays responsive", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".hs")).toHaveClass(/\b(gl-ready|no-gl)\b/, {
      timeout: 15_000,
    });
    const started = Date.now();
    await page.evaluate(() => document.title);
    expect(Date.now() - started).toBeLessThan(1000);
  });

  test("without hardware graphics the still image shows at once", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (
          type: string,
          opts?: { failIfMajorPerformanceCaveat?: boolean }
        ) => unknown;
      };
      const real = proto.getContext;
      proto.getContext = function (this: unknown, type, opts) {
        if (type.startsWith("webgl") && opts?.failIfMajorPerformanceCaveat) {
          return null;
        }
        return real.call(this, type, opts);
      };
    });
    await page.goto("/");
    await expect(page.locator(".hs")).toHaveClass(/\bno-gl\b/);
    await expect(page.locator(".hs .poster")).toBeVisible();
    await expect(page.locator("#hero-heading")).toBeVisible();
  });

  for (const { name, width, height, chapters } of [
    { name: "phone", width: 390, height: 664, chapters: [2, 5, 8, 13] },
    { name: "desktop", width: 1440, height: 900, chapters: [2, 5] },
  ]) {
    test(`on a ${name} a chapter's card stays up past its middle`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as { IO?: { bounds?: number[] } }).IO?.bounds?.length ?? 0
          )
        )
        .toBeGreaterThan(20);
      for (const i of chapters) {
        await page.evaluate(i => {
          const b = (window as unknown as { IO: { bounds: number[] } }).IO
            .bounds;
          window.scrollTo({
            top: b[i] + (b[i + 1] - b[i]) * 0.7,
            behavior: "instant",
          });
        }, i);
        const card = page.locator(".hs article.card").nth(i);
        await expect(card).toHaveCSS("opacity", "1");
        await expect(card.locator("h2")).toBeVisible();
      }
    });
  }

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
    await expect
      .poll(() => page.evaluate(() => typeof (window as { IO?: unknown }).IO))
      .toBe("object");
    await page.locator('a[href="/donate"]').first().click();
    await page.waitForURL("**/donate");
    await expect
      .poll(() => page.evaluate(() => typeof (window as { IO?: unknown }).IO))
      .toBe("undefined");
  });
});
