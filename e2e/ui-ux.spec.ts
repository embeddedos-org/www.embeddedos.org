/**
 * UI and UX tests, including automated accessibility.
 *
 * Runs on both the desktop and iPhone SE projects. Covers WCAG violations via
 * axe, responsive layout integrity, keyboard operability, focus visibility,
 * heading structure, and reduced-motion support.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
      await page.goto(route);
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
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const route of ["/", "/about", "/donate"]) {
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

  test("focused elements are visibly indicated", async ({ page }) => {
    await page.goto("/");
    // Under parallel load the first Tab can land before the document takes
    // focus, leaving activeElement on <body> and failing for a reason that has
    // nothing to do with focus styling. Wait for a real target first.
    await page
      .locator("header a, nav a")
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const visible = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return false;
      const s = getComputedStyle(el);
      return (
        (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) ||
        s.boxShadow !== "none" ||
        s.textDecorationLine !== "none"
      );
    });
    expect(visible, "no visible focus indicator").toBe(true);
  });

  test("interactive controls are large enough to tap on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForTimeout(500);
    const tiny = await page.evaluate(() =>
      [...document.querySelectorAll("footer a[href], nav a[href], button")]
        .map(el => {
          const r = el.getBoundingClientRect();
          return {
            w: Math.round(r.width),
            h: Math.round(r.height),
            t: (el.textContent ?? "").trim().slice(0, 20),
          };
        })
        .filter(b => b.w > 0 && b.h > 0 && b.h < 24)
    );
    expect(tiny).toEqual([]);
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
