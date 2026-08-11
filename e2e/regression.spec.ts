/**
 * Regression tests — one guard per defect actually found and fixed.
 *
 * Each test names the bug it prevents from coming back. If any of these fail,
 * a specific, previously-shipped defect has returned.
 */
import { test, expect } from "@playwright/test";

test.describe("build output regressions", () => {
  test("the 367 KB Manus dev runtime is not inlined into the document", async ({
    page,
  }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toContain("manus-runtime");
    expect(html).not.toContain("__MANUS_HOST_DEV__");
  });

  test("the dev debug collector is not shipped", async ({ page, request }) => {
    await page.goto("/");
    expect(await page.content()).not.toContain("debug-collector");
    expect((await request.get("/__manus__/debug-collector.js")).status()).toBe(
      404
    );
  });

  test("the analytics placeholder does not become a live request", async ({
    page,
  }) => {
    const bad: string[] = [];
    page.on("request", r => r.url().includes("%VITE_") && bad.push(r.url()));
    await page.goto("/");
    expect(bad).toEqual([]);
  });
});

test.describe("prerender regressions", () => {
  test("statistics render their real values, not a mid-animation zero", async ({
    page,
  }) => {
    // Read the static HTML, before any JS runs.
    const res = await page.request.get("/");
    const html = await res.text();
    const body = html
      .slice(html.indexOf("<body"))
      .replace(/<script[\s\S]*?<\/script>/g, "");
    const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

    expect(text).toContain("22 Repositories");
    expect(text).toContain("14 Books");
    expect(text).not.toMatch(/\b0 Repositories\b/);
    expect(text).not.toMatch(/\b0 \+ Platforms\b/);
  });

  test("every route serves its own snapshot, not the homepage", async ({
    request,
  }) => {
    const titles = await Promise.all(
      ["/", "/about", "/donate", "/kids", "/faq"].map(async r => {
        const html = await (await request.get(r)).text();
        return html.match(/<title>([\s\S]*?)<\/title>/)![1];
      })
    );
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("runtime-injected modulepreloads are not baked into the static HTML", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();
    const preloads = [
      ...html.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g),
    ].map(m => m[1]);
    expect(
      preloads.filter(p => /three|CircuitHero|ParticleField/i.test(p))
    ).toEqual([]);
  });

  test("prerendered text is not left invisible by opacity:0", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();
    expect(html).not.toMatch(/style="[^"]*opacity:\s*0[;"]/);
  });
});

test.describe("link regressions", () => {
  test("no link points at a private or non-existent repository", async ({
    page,
  }) => {
    const dead = [
      "github.com/embeddedos-org/eos-aero",
      "github.com/embeddedos-org/eos-programming-language",
      "github.com/embeddedos-org/eos-platform",
      "github.com/embeddedos-org/eai-edge",
      "github.com/embeddedos-org/embeddedos/releases",
      "HealthKey-Ulta",
      "HEALTH-BAND-Neuro/tree",
      "discord.gg/embeddedos",
    ];
    for (const route of [
      "/",
      "/projects",
      "/patents",
      "/downloads",
      "/resources",
      "/contact",
    ]) {
      await page.goto(route);
      const html = await page.content();
      for (const d of dead) {
        expect(html, `${route} still links to ${d}`).not.toContain(d);
      }
    }
  });

  test("wouter Link does not emit nested anchors", async ({ page }) => {
    for (const route of ["/news", "/resources", "/ecosystem"]) {
      await page.goto(route);
      const nested = await page.locator("a a").count();
      expect(nested, `nested anchors on ${route}`).toBe(0);
    }
  });
});

test.describe("server regressions", () => {
  test("images do not 500 without Manus Forge credentials", async ({
    request,
  }) => {
    const res = await request.get(
      "/manus-storage/embeddedos-logo-mark_bc053888.jpg"
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\//);
  });

  test("unknown paths are hard 404s, not soft 200s", async ({ request }) => {
    for (const p of ["/nope", "/robots.txt.bak", "/ecosystem-map"]) {
      expect((await request.get(p)).status(), p).toBe(404);
    }
  });

  test("robots.txt and sitemap.xml are not shadowed by the SPA fallback", async ({
    request,
  }) => {
    expect(
      (await request.get("/robots.txt")).headers()["content-type"]
    ).toMatch(/text\/plain/);
    expect(
      (await request.get("/sitemap.xml")).headers()["content-type"]
    ).toMatch(/xml/);
  });

  test("the framework fingerprint header is suppressed", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.headers()["x-powered-by"]).toBeUndefined();
  });
});

test.describe("navigation regressions", () => {
  /**
   * The desktop dropdown was left uncontrolled, so Radix only closed it on an
   * outside click, a blur or Escape. A wouter <Link> is none of those: clicking
   * an item navigated the page and left the panel open on top of the new route,
   * covering it and swallowing every click that landed on the panel.
   */
  test("the desktop dropdown closes after navigating through it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /Community/i }).first();
    await trigger.click();

    const item = page.locator('a[href="/mission"]').first();
    await expect(item).toBeVisible();
    await item.click();

    await expect(page).toHaveURL(/\/mission$/);
    await expect(
      page.locator('[data-state="open"]'),
      "dropdown must not stay open over the page it navigated to"
    ).toHaveCount(0);
  });

  test("the page navigated to is actually clickable afterwards", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await page
      .getByRole("button", { name: /Community/i })
      .first()
      .click();
    await page.locator('a[href="/mission"]').first().click();
    await expect(page).toHaveURL(/\/mission$/);

    // If the panel were still covering the route, this heading would be
    // obscured and a click at its position would hit the overlay instead.
    const heading = page.locator("main h1").first();
    await expect(heading).toBeVisible();
    const covered = await heading.evaluate(el => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(
        r.x + r.width / 2,
        r.y + r.height / 2
      );
      return !!top && !el.contains(top) && top !== el;
    });
    expect(covered, "an overlay is intercepting clicks on the page").toBe(
      false
    );
  });

  test("clicking through to the route already open still closes the menu", async ({
    page,
  }) => {
    // Same-route navigation does not change location, so the route effect never
    // fires; the item's own click handler has to close the panel.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/mission");

    await page
      .getByRole("button", { name: /Community/i })
      .first()
      .click();
    await page.locator('a[href="/mission"]').first().click();
    await expect(page.locator('[data-state="open"]')).toHaveCount(0);
  });

  test("the mobile menu closes after navigating through it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await page
      .getByRole("button", { name: /open menu/i })
      .first()
      .click();

    // The mobile panel is an accordion: a section has to be expanded before its
    // items exist, so scope the item lookup to the panel rather than the page —
    // /get-involved also appears in the footer.
    //
    // This used to navigate via /about. The header no longer carries the
    // Foundation's institutional pages: those live in the footer, and the
    // Community menu is about contributing. /get-involved is the equivalent
    // in-menu destination.
    const panel = page.locator("#mobile-menu");
    await expect(panel).toBeVisible();
    await panel.getByRole("button", { name: "Community" }).click();

    const item = panel.locator('a[href="/get-involved"]').first();
    await expect(item).toBeVisible();
    await item.click();

    await expect(page).toHaveURL(/\/get-involved$/);
    await expect(
      panel,
      "the mobile panel must close on navigation"
    ).toHaveCount(0);
  });
});

test.describe("modal regressions", () => {
  /**
   * The search overlay rendered as a bare motion.div: no role, no aria-modal,
   * no accessible name. Focus moved into an unlabelled text field with nothing
   * announcing that a dialog had opened. DonateModal already carried all three
   * attributes, so the two modals disagreed.
   */
  test("the search modal is announced as a dialog", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-label*="Search" i]').first().click();

    const dialog = page.getByRole("dialog", { name: /search/i });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    const field = dialog.getByRole("textbox");
    await expect(field).toBeFocused();
  });

  test("the search modal closes on Escape and on a backdrop click", async ({
    page,
  }) => {
    await page.goto("/");
    const open = page.locator('button[aria-label*="Search" i]').first();
    const dialog = page.getByRole("dialog", { name: /search/i });

    await open.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    await open.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(15, 15);
    await expect(dialog).toHaveCount(0);
  });

  /**
   * /mission, /industries and /transparency were added to the router and the
   * sitemap but not to the search index in server/routers.ts, so searching
   * "mission" returned /vision and /about and never the mission page itself.
   * Results render as buttons, not links, so assert on the button label.
   */
  test("newly added pages are reachable from search", async ({ page }) => {
    for (const [query, label] of [
      ["mission", /Mission & Scope/i],
      ["industries", /Industries We Serve/i],
      ["transparency", /Transparency & Accountability/i],
    ] as const) {
      await page.goto("/");
      await page.locator('button[aria-label*="Search" i]').first().click();
      const dialog = page.getByRole("dialog", { name: /search/i });
      await expect(dialog).toBeVisible();
      // fill(), not keyboard.type(): the modal focuses its input on a 100ms
      // timeout, and typing before that lands drops the keystrokes on the floor.
      await dialog.getByRole("textbox").fill(query);
      await expect(
        dialog.getByRole("button", { name: label }),
        `search "${query}" must surface ${label}`
      ).toBeVisible();
      await page.keyboard.press("Escape");
    }
  });
});

test.describe("rendering regressions", () => {
  /**
   * ENI's hero wave was a <motion.path> whose `d` attribute was tweened
   * between three path strings. framer-motion cannot interpolate a path
   * string: it wrote d="undefined" mid-tween and Chrome rejected the frame
   * with "Expected moveto path command ('M' or 'm')". The wave is now flipped
   * with scaleY, which is the same animation on a property motion can
   * actually interpolate.
   *
   * The assertion is deliberately whole-site: no page may paint an SVG whose
   * geometry contains "undefined" or "NaN".
   */
  const SVG_ATTRS = ["d", "x1", "y1", "x2", "y2", "cx", "cy", "r", "points"];

  for (const route of ["/eni", "/", "/architecture"]) {
    test(`no SVG on ${route} is drawn with an undefined geometry`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on("console", m => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });

      // Sample across the animation rather than once: the broken frame only
      // appeared partway through the 3s tween.
      const seen = new Set<string>();
      for (let i = 0; i < 40; i++) {
        const bad = await page.evaluate(attrs => {
          const els = document.querySelectorAll(
            "path, line, circle, rect, polyline, polygon"
          );
          return [...els]
            .filter(el =>
              attrs.some(a => {
                const v = el.getAttribute(a);
                return v !== null && /undefined|NaN/.test(v);
              })
            )
            .map(el => `<${el.tagName} ${el.getAttribute("d") ?? ""}>`);
        }, SVG_ATTRS);
        bad.forEach(b => seen.add(b));
        await page.waitForTimeout(60);
      }

      expect(
        [...seen],
        `SVG elements with broken geometry on ${route}`
      ).toEqual([]);
      expect(
        consoleErrors.filter(e => /path|moveto|attribute/i.test(e)),
        `SVG console errors on ${route}`
      ).toEqual([]);
    });
  }
});

test.describe("metadata regressions", () => {
  /**
   * The prerenderer gives every route its own <title>, description, canonical
   * and og:* tags, but nothing updated them once wouter swapped the page.
   * From the second page onward the tab, the history entry and — worst —
   * <link rel="canonical"> still described whichever page was landed on first.
   */
  test("a client-side navigation restamps title, canonical and og:url", async ({
    page,
  }) => {
    await page.goto("/eni");
    await expect(page).toHaveTitle(/^ENI\b/);

    const canonicalHref = () =>
      page.locator('link[rel="canonical"]').getAttribute("href");
    expect(await canonicalHref()).toBe("https://www.embeddedos.org/eni");

    await page.locator('footer a[href="/getting-started"]').first().click();
    await expect(page).toHaveURL(/\/getting-started$/);

    // The heading arrives with the lazy chunk, so wait on the title itself
    // rather than assuming the swap is synchronous.
    await expect(page).toHaveTitle(/Start Building/);
    expect(await canonicalHref()).toBe(
      "https://www.embeddedos.org/getting-started"
    );
    expect(
      await page.locator('meta[property="og:url"]').getAttribute("content")
    ).toBe("https://www.embeddedos.org/getting-started");

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description, "description still describes /eni").not.toMatch(
      /1,024-channel/
    );
  });

  test("the landing route keeps the metadata the prerenderer wrote", async ({
    page,
  }) => {
    await page.goto("/product-eos-platform");
    expect(
      await page.locator('link[rel="canonical"]').getAttribute("href")
    ).toBe("https://www.embeddedos.org/product-eos-platform");
  });
});

test.describe("responsive regressions", () => {
  /**
   * These six pages pushed the document wider than a phone screen. Two causes:
   * ProductDetailPage's step card was a flex item without `min-w-0`, so the
   * code block inside sized it to its longest line; and the specification
   * table was wrapped in `overflow-hidden` rather than given its own
   * horizontal scroll.
   *
   * ui-ux.spec.ts checks four hand-picked routes, none of them product pages,
   * which is why this shipped green.
   */
  const OVERFLOWED = [
    "/product-eipc",
    "/product-eserviceapps",
    "/product-eos-platform",
    "/product-eboot",
    "/product-eostudio",
    "/eradar360",
  ];

  for (const route of OVERFLOWED) {
    test(`${route} does not overflow horizontally at 375px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(route, { waitUntil: "networkidle" });

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow, `${route} overflows by ${overflow}px`).toBe(0);
    });
  }
});

test.describe("focus regressions", () => {
  /**
   * The donate dialog set role="dialog" and aria-modal="true" but never moved
   * focus into itself, so one Tab reached the navigation behind the overlay —
   * a keyboard user was walking a page hidden under a modal.
   */
  test("the donate dialog holds focus inside itself", async ({ page }) => {
    await page.goto("/");
    await page.locator("header button", { hasText: "Donate" }).first().click();

    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"][aria-modal="true"]');
        return d ? d.contains(document.activeElement) : false;
      });
      expect(
        inside,
        `focus escaped the donate dialog after ${i + 1} tabs`
      ).toBe(true);
    }
  });
});

test.describe("chat regressions", () => {
  test.beforeEach(async ({ context }) => {
    // Stop the 20s donate popup from covering the assistant mid-test.
    await context.addInitScript(() =>
      localStorage.setItem("eos-donate-dismissed", String(Date.now()))
    );
  });

  /**
   * eBot answers without moving focus, so with no live region a screen reader
   * announced nothing at all. It was also the one overlay Escape did not
   * close, unlike the search and donate dialogs.
   */
  test("replies land in a live region", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-label="Open eBot AI assistant"]').click();

    const panel = page.locator('[role="dialog"][aria-label*="eBot"]');
    await expect(panel).toBeVisible();

    const log = panel.locator('[aria-live="polite"]');
    await expect(log).toHaveCount(1);

    await page
      .locator("button", { hasText: "What boards does EmbeddedOS support?" })
      .click();
    await expect(log).toContainText("board definitions", { timeout: 10_000 });
  });

  test("Escape closes the assistant", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-label="Open eBot AI assistant"]').click();

    const panel = page.locator('[role="dialog"][aria-label*="eBot"]');
    await expect(panel).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });
});
