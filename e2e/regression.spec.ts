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
