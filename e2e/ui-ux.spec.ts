/**
 * UI and UX tests, including automated accessibility.
 *
 * Runs on both the desktop and iPhone SE projects. Covers WCAG violations via
 * axe, responsive layout integrity, keyboard operability, focus visibility,
 * heading structure, and reduced-motion support.
 */
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Stop the page fetching the third-party Zeffy donation iframe.
 *
 * /donate holds the load event for ~8.4s on that iframe, against ~0.3s for the
 * same page without it, and when Zeffy's chunks fail and retry the network never
 * goes idle at all. Both uses below wait for a settled page, so that turned a
 * ~2s check into one that ran to the 30s ceiling on a loaded machine.
 *
 * Nothing here audits Zeffy's own markup: the axe run excludes the iframe
 * explicitly, and a cross-origin iframe cannot overflow its parent regardless of
 * what it contains. So blocking it removes a payment provider's response time
 * from the suite without reducing what is checked.
 */
const blockPaymentIframe = (page: Page) =>
  page.route(/zeffy\.com/, r => r.abort());

const PAGES = [
  "/",
  "/about",
  "/mission",
  "/transparency",
  "/industries",
  "/organization",
  "/donate",
  "/contact",
  "/faq",
  "/careers",
  "/get-involved",
  // One page per distinct component added for the Marketing and Research
  // structure. Listing all 33 would treble the suite's runtime to re-test the
  // same four components with different text; listing none would have shipped
  // them unchecked, which is how the last contrast failure reached master.
  //
  // Both states of the category index are here on purpose: the empty branch
  // renders entirely different markup from the populated one, so covering only
  // one of them covers neither.
  "/press-releases", // category index, empty branch
  "/publications", // category index, populated branch
  "/research/security", // research area, populated
  "/research/linux", // research area, empty
  "/programmes", // programme hub
  "/programmes/ambassador", // programme detail
  "/brand", // brand assets
  "/press-kit", // press kit
  "/social", // social accounts
  "/youtube", // channel page
];

test.describe("accessibility (axe, WCAG 2.1 A/AA)", () => {
  for (const route of PAGES) {
    test(`${route} has no serious or critical violations`, async ({ page }) => {
      // axe measures rendered colour, so it has to run on a settled page.
      // domcontentloaded is too early: routes are code-split and the entry point
      // deliberately waits for the route chunk before mounting (see main.tsx),
      // so at DCL the document is still the prerendered snapshot mid-paint and
      // contrast is sampled against backgrounds that have not finished
      // compositing. That produced contrast violations that disappear on a
      // settled page and did not reproduce twice in a row.
      await blockPaymentIframe(page);
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // The Zeffy donation form is a cross-origin iframe rendering Zeffy's own
        // MUI markup. Its link-name and nested-interactive violations are real
        // but are not ours to fix, and leaving them red hides regressions in the
        // markup we do own. Everything outside the iframe is still audited.
        .exclude('iframe[src*="zeffy.com"]')
        .analyze();

      const blocking = results.violations.filter(
        v => v.impact === "serious" || v.impact === "critical"
      );

      const summary = blocking.map(
        v =>
          `${v.impact}: ${v.id} (${v.nodes.length}) — ${v.help}\n    ${v.nodes[0]?.html?.slice(0, 120)}`
      );
      expect(summary, `axe violations on ${route}`).toEqual([]);
    });
  }
});

test.describe("document structure", () => {
  test("each page has exactly one h1 and no skipped heading levels", async ({
    page,
  }) => {
    for (const route of PAGES) {
      // domcontentloaded, not load: heading structure is final as soon as the
      // document parses, while /donate's third-party payment iframe keeps the
      // load event pending for ~7.5s against ~150ms for every other page. That
      // one route was consuming the whole 30s budget for this loop and making
      // the test hostage to a payment provider's uptime. The assertions below
      // are unchanged.
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const levels = await page.evaluate(() =>
        [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h =>
          Number(h.tagName[1])
        )
      );
      expect(levels.filter(l => l === 1).length, `${route} h1 count`).toBe(1);

      let previous = levels[0];
      const skips: string[] = [];
      for (const level of levels.slice(1)) {
        if (level > previous + 1) skips.push(`h${previous} -> h${level}`);
        previous = level;
      }
      expect(skips, `${route} heading level skips`).toEqual([]);
    }
  });

  test("the page declares a language", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("html").getAttribute("lang")).toBeTruthy();
  });

  test("landmarks are present for assistive technology", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    expect(await page.locator("nav, header").count()).toBeGreaterThan(0);
  });
});

test.describe("responsive layout", () => {
  const VIEWPORTS = [
    { name: "iphone-se", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "laptop", width: 1280, height: 800 },
    { name: "wide", width: 1920, height: 1080 },
  ];

  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await blockPaymentIframe(page);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // /careers carries the only real form on the site — a two-column grid of
      // inputs and three comboboxes, which is the layout most likely to burst
      // its container on a narrow screen, and it was not in this sample.
      for (const route of ["/", "/about", "/donate", "/careers"]) {
        await page.goto(route);
        await page.waitForTimeout(400);
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth
        );
        expect(
          overflow,
          `${route} at ${vp.width}px overflows by ${overflow}px`
        ).toBeLessThanOrEqual(1);
      }
    });
  }

  test("body copy is legible on mobile (no text under 12px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForTimeout(500);
    const tiny = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.body.querySelectorAll(
        "p,span,a,li,div,button"
      )) {
        if (el.children.length) continue;
        const text = el.textContent?.trim();
        if (!text) continue;
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < 12) out.push(`${size}px: ${text.slice(0, 30)}`);
      }
      return out;
    });
    expect(tiny).toEqual([]);
  });
});

test.describe("keyboard operability", () => {
  test("primary navigation is reachable by keyboard", async ({ page }) => {
    await page.goto("/");
    const reached: string[] = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el
          ? `${el.tagName}:${(el.textContent ?? "").trim().slice(0, 20)}`
          : "";
      });
      if (info) reached.push(info);
    }
    expect(reached.length).toBeGreaterThan(8);
    expect(reached.some(r => r.startsWith("A") || r.startsWith("BUTTON"))).toBe(
      true
    );
  });

  /**
   * Every control reached by Tab, not just the second one.
   *
   * This previously pressed Tab twice and asserted that the one element it
   * landed on had an indicator, so every other control on the page could have
   * lost its focus ring with the test still green. A keyboard user meets all of
   * them.
   */
  test("focused elements are visibly indicated", async ({ page }) => {
    await page.goto("/");
    // Under parallel load the first Tab can land before the document takes
    // focus, leaving activeElement on <body> and failing for a reason that has
    // nothing to do with focus styling. Wait for a real target first.
    await page
      .locator("header a, nav a")
      .first()
      .waitFor({ state: "visible", timeout: 15000 });

    const unmarked: string[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const result = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;

        const s = getComputedStyle(el);
        const indicated =
          (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) ||
          s.boxShadow !== "none" ||
          s.textDecorationLine !== "none";

        return {
          indicated,
          id: `${el.tagName}#${el.id || ""}.${(el.className || "").toString().slice(0, 40)}`,
          label: (el.textContent ?? "").trim().slice(0, 30),
        };
      });

      if (!result) continue;
      // Tab wraps into browser chrome and back; only judge each control once.
      if (seen.has(result.id + result.label)) continue;
      seen.add(result.id + result.label);

      if (!result.indicated) {
        unmarked.push(`${result.id} "${result.label}"`);
      }
    }

    expect(
      seen.size,
      "Tab reached too few controls to be a real sweep"
    ).toBeGreaterThan(8);
    expect(unmarked, "controls with no visible focus indicator").toEqual([]);
  });

  test("interactive controls are large enough to tap on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // /careers as well as /: a form is where a cramped target actually costs
    // something, and its inputs and comboboxes were never measured.
    for (const route of ["/", "/careers"]) {
      await page.goto(route);
      await page.waitForTimeout(500);
      const tiny = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            "footer a[href], nav a[href], button, main input, main textarea, main select"
          ),
        ]
          .map(el => {
            const r = el.getBoundingClientRect();
            return {
              w: Math.round(r.width),
              h: Math.round(r.height),
              t: (el.textContent ?? "").trim().slice(0, 20) || el.id,
            };
          })
          // Zero-sized elements are hidden — the honeypot is deliberately 1px.
          .filter(b => b.w > 1 && b.h > 1 && b.h < 24)
      );
      expect(tiny, `undersized tap targets on ${route}`).toEqual([]);
    }
  });
});

test.describe("motion preferences", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is fully visible when the user prefers reduced motion", async ({
    page,
  }) => {
    // The `test.use({ reducedMotion: "reduce" })` above does not reach the page
    // in Playwright 1.62.1: inside the test, matchMedia("(prefers-reduced-motion:
    // reduce)").matches reads false, so the media query under test never applied
    // and this asserted reduced-motion behaviour with reduced motion switched
    // off. Emulate explicitly so the precondition is real.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(800);

    // Guard the precondition itself — a silently-inert emulation would make the
    // assertions below pass or fail for the wrong reason.
    expect(
      await page.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches
      ),
      "reduced-motion emulation is not active"
    ).toBe(true);
    const text = await page.locator("main").innerText();
    expect(text.length).toBeGreaterThan(1500);

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("main *")].filter(el => {
          const s = getComputedStyle(el);
          return s.opacity === "0" && (el.textContent ?? "").trim().length > 40;
        }).length
    );
    expect(hidden, "text left invisible under reduced motion").toBe(0);
  });
});

/**
 * The design system, which nothing here covered.
 *
 * The type scale, the vertical rhythm and the hero scrim were added without a
 * single test that fails if they are removed — the suite's other checks are
 * generic enough to pass on any competently-built page, so deleting
 * `.display-1` or the scrim left all of them green.
 *
 * These assert the properties the design actually depends on, not the exact
 * numbers a designer may want to tune: a headline that dominates its viewport,
 * a scale that moves with the viewport rather than stepping, a scrim that
 * covers the 3D layer, and a bounded reading measure.
 */
test.describe("design system", () => {
  test("the hero headline uses the display scale, and it is fluid", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const wide = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      if (!h1) return null;
      const s = getComputedStyle(h1);
      return {
        size: parseFloat(s.fontSize),
        leading: parseFloat(s.lineHeight) / parseFloat(s.fontSize),
      };
    });

    expect(wide, "the homepage must have an h1").not.toBeNull();
    // Default h1 sizing is ~32px; the old hand-picked triple topped out at 60.
    expect(
      wide!.size,
      "hero headline is not on the display scale"
    ).toBeGreaterThan(72);
    // Tight leading is what makes a headline read as one block rather than
    // three stacked sentences; body leading is ~1.6.
    expect(
      wide!.leading,
      "hero headline leading is not tightened"
    ).toBeLessThan(1.15);

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(400);

    const narrow = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.querySelector("h1")!).fontSize)
    );

    // Fluid, not breakpoint-stepped: it must shrink, and must stay legible.
    expect(narrow, "headline did not scale down on a phone").toBeLessThan(
      wide!.size
    );
    expect(
      narrow,
      "headline collapsed to body size on a phone"
    ).toBeGreaterThan(32);
  });

  test("the hero scrim covers the 3D layer rather than sitting under it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const layering = await page.evaluate(() => {
      const scrim = document.querySelector(".hero-scrim");
      if (!scrim) return { present: false };

      const section = scrim.parentElement!;
      const kids = [...section.children];
      const canvasHost = kids.find(k => k.querySelector("canvas"));

      const s = getComputedStyle(scrim);
      return {
        present: true,
        // Paints after the canvas: both are positioned, so DOM order decides.
        afterCanvas: canvasHost
          ? kids.indexOf(scrim) > kids.indexOf(canvasHost)
          : null,
        covers: s.position === "absolute" && s.inset === "0px",
        // A scrim that intercepted clicks would break every hero control.
        clickThrough: s.pointerEvents === "none",
        painted: s.backgroundImage !== "none",
      };
    });

    expect(layering.present, ".hero-scrim is missing").toBe(true);
    expect(layering.covers, "scrim does not cover the hero").toBe(true);
    expect(layering.clickThrough, "scrim would swallow hero clicks").toBe(true);
    expect(layering.painted, "scrim paints nothing").toBe(true);
    expect(layering.afterCanvas, "scrim paints under the 3D canvas").not.toBe(
      false
    );
  });

  test("the scrim switches to its stacked-layout variant below lg", async ({
    page,
  }) => {
    // The @media (max-width: 1023px) branch exists because the hero grid
    // stacks there: a left-weighted wash would leave particles sitting on the
    // right half of every line. Nothing exercised that branch.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const read = async (width: number) => {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(300);
      return page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".hero-scrim")!)
            .backgroundImage
      );
    };

    const stacked = await read(1023);
    const side = await read(1024);

    expect(stacked, "no scrim painted in the stacked layout").not.toBe("none");
    expect(side, "no scrim painted in the side-by-side layout").not.toBe(
      "none"
    );
    expect(stacked, "the stacked-layout scrim variant never applies").not.toBe(
      side
    );
  });

  test("hero body copy is held to a reading measure", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const measured = await page.evaluate(() => {
      const p = document.querySelector("section .measure");
      if (!p) return null;
      const fontSize = parseFloat(getComputedStyle(p).fontSize);
      return {
        width: p.getBoundingClientRect().width,
        // Rough characters-per-line: average glyph ≈ 0.5em.
        approxChars: p.getBoundingClientRect().width / (fontSize * 0.5),
      };
    });

    expect(measured, "no .measure element in the hero").not.toBeNull();
    // Unbounded, this column would run to ~800px at 1920. The cap is 56ch.
    expect(
      measured!.approxChars,
      "reading measure is not bounded"
    ).toBeLessThan(85);
  });
});
