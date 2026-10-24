import { test, expect } from "./fixtures";
import { BOARD_PARTS } from "../client/src/black/parts";

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

  test("the showcase marks each board's parts, and a part's card stays while read and closes with Escape", async ({
    page,
  }) => {
    // reduced motion keeps the board still (no lean, no settle), so the card is where it was measured
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const show = page.locator("#bshow");
    // jump, not glide (the page scrolls smoothly), so nothing moves between measuring and pointing
    await show
      .locator(".bs-stage")
      .evaluate(e =>
        e.scrollIntoView({ block: "center", behavior: "instant" })
      );
    const dots = show.locator(".bs-dot");
    const card = show.locator(".bs-card");
    const parts = BOARD_PARTS["learn-rp2350"];
    await expect(dots).toHaveCount(parts.length);
    await expect(dots.first()).toBeVisible();
    await dots.first().hover();
    await expect(card).toBeVisible();
    await expect(card.locator("b")).toHaveText(
      `${parts[0].ref} · ${parts[0].name}`
    );
    await expect(dots.first()).toHaveAttribute("aria-expanded", "true");
    // the pointer can move onto the card and rest there (WCAG 1.4.13)
    const d = (await dots.first().boundingBox())!;
    const c = (await card.boundingBox())!;
    const cy = Math.min(
      Math.max(d.y + d.height / 2, c.y + 10),
      c.y + c.height - 10
    );
    await page.mouse.move(c.x > d.x ? c.x + 10 : c.x + c.width - 10, cy, {
      steps: 3,
    });
    await page.waitForTimeout(400);
    await expect(card).toBeVisible();
    // Escape closes it with focus anywhere
    await page.keyboard.press("Escape");
    await expect(card).toBeHidden();
    await expect(dots.first()).toHaveAttribute("aria-expanded", "false");
    // another board brings its own parts
    await page.locator("#bt-cm5-base").click();
    await expect(dots).toHaveCount(BOARD_PARTS["cm5-base"].length);
  });

  test("a part's card opens from the keyboard", async ({ page }) => {
    await page.goto("/");
    await page.locator("#bshow .bs-stage").scrollIntoViewIfNeeded();
    const dot = page.locator("#bshow .bs-dot").first();
    await expect(dot).toBeVisible();
    await dot.focus();
    await expect(page.locator("#bshow .bs-card")).toBeVisible();
    // the dot itself carries its part's name and note, whichever card was last open
    const [p0, p1] = BOARD_PARTS["learn-rp2350"];
    await expect(dot).toHaveAccessibleName(`${p0.ref}, ${p0.name}`);
    await expect(dot).toHaveAccessibleDescription(p0.note);
    await expect(
      page.locator("#bshow .bs-dot").nth(1)
    ).toHaveAccessibleDescription(p1.note);
    await page.keyboard.press("Escape");
    await expect(page.locator("#bshow .bs-card")).toBeHidden();
  });

  test("the dots stay on their parts when the window is resized", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const show = page.locator("#bshow");
    const parts = BOARD_PARTS["learn-rp2350"];
    for (const width of [1440, 1300, 1279, 1061, 1000, 760]) {
      await page.setViewportSize({ width, height: 900 });
      await show
        .locator(".bs-stage")
        .evaluate(e =>
          e.scrollIntoView({ block: "center", behavior: "instant" })
        );
      await expect(show.locator(".bs-dot").first()).toBeVisible();
      await expect
        .poll(async () => {
          const img = (await show.locator(".bs-img.on img").boundingBox())!;
          let worst = 0;
          for (const [k, p] of parts.entries()) {
            const b = (await show.locator(".bs-dot").nth(k).boundingBox())!;
            worst = Math.max(
              worst,
              Math.abs(b.x + b.width / 2 - (img.x + p.x * img.width)),
              Math.abs(b.y + b.height / 2 - (img.y + p.y * img.height))
            );
          }
          return worst;
        })
        .toBeLessThan(2);
    }
  });

  for (const width of [640, 420])
    test(`in a ${width}px window the pointer can move onto a part's card and read it`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const show = page.locator("#bshow");
      await show
        .locator(".bs-stage")
        .evaluate(e =>
          e.scrollIntoView({ block: "center", behavior: "instant" })
        );
      const dots = show.locator(".bs-dot");
      const card = show.locator(".bs-card");
      await expect(dots.first()).toBeVisible();
      for (const k of [0, 1, 2]) {
        await dots.nth(k).hover();
        await expect(card).toBeVisible();
        const d = (await dots.nth(k).boundingBox())!;
        const c = (await card.boundingBox())!;
        // aim at the card's point nearest the dot, slowly
        const tx = Math.min(
          Math.max(d.x + d.width / 2, c.x + 8),
          c.x + c.width - 8
        );
        const ty = Math.min(
          Math.max(d.y + d.height / 2, c.y + 8),
          c.y + c.height - 8
        );
        await page.mouse.move(tx, ty, { steps: 12 });
        await page.waitForTimeout(1_000);
        await expect(card).toBeVisible();
        await page.mouse.move(2, 2);
        await expect(card).toBeHidden();
      }
    });

  test.describe("on a phone", () => {
    test.use({
      viewport: { width: 390, height: 844 },
      // a phone's 2x screen: Chrome then moves a tap's click onto a nearby target, which the dots must not follow
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: true,
    });

    test("a tap opens the part tapped on every board, even where two dots sit close", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      const show = page.locator("#bshow");
      const stage = show.locator(".bs-stage");
      const dots = show.locator(".bs-dot");
      const card = show.locator(".bs-card");
      for (const [slug, parts] of Object.entries(BOARD_PARTS)) {
        if (slug !== "learn-rp2350") await page.locator(`#bt-${slug}`).click();
        await expect(dots).toHaveCount(parts.length);
        // the new board's dots, not the last board's
        await expect(dots.first()).toHaveAttribute(
          "aria-label",
          `${parts[0].ref}, ${parts[0].name}`
        );
        await stage.evaluate(e =>
          e.scrollIntoView({ block: "center", behavior: "instant" })
        );
        // the dots show once the board image has loaded and sized their layer
        await expect(dots.first()).toBeVisible();
        for (const [k, p] of parts.entries()) {
          const b = (await dots.nth(k).boundingBox())!;
          await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
          await expect(card.locator("b")).toHaveText(`${p.ref} · ${p.name}`);
          await page.keyboard.press("Escape");
          await expect(card).toBeHidden();
        }
      }
    });
  });

  test("the shelf shows all fourteen books, each cover lazy and sized", async ({
    page,
  }) => {
    await page.goto("/");
    const books = page.locator(".hp-shelf > li");
    await expect(books).toHaveCount(14);
    await expect(books.locator('a[href="/books"]')).toHaveCount(14);
    const covers = page.locator(".hp-shelf img");
    // two books share another's cover, so their titles are set in type instead
    await expect(covers).toHaveCount(12);
    for (const img of await covers.all()) {
      await expect(img).toHaveAttribute("loading", "lazy");
      await expect(img).toHaveAttribute("width", "240");
      await expect(img).toHaveAttribute("height", "360");
    }
    // one row wider than the page: its buttons page through it
    const shelf = page.locator(".hp-shelf");
    const [prev, next] = await page.locator(".hp-shelf-nav button").all();
    await shelf.evaluate(e =>
      e.scrollIntoView({ block: "center", behavior: "instant" })
    );
    await expect(page.locator(".hp-shelf-nav")).toBeVisible();
    await expect(prev).toBeDisabled();
    await next.click();
    await expect
      .poll(() => shelf.evaluate(e => e.scrollLeft))
      .toBeGreaterThan(100);
    await expect(prev).toBeEnabled();
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
