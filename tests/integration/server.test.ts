/**
 * Integration tests: the built production server, over real HTTP.
 *
 * Boots `dist/index.js` once and exercises the pieces that only exist when the
 * express app, the static handler, the storage proxy and the prerendered build
 * are wired together. Requires `pnpm build` first.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST_SERVER = path.join(ROOT, "dist", "index.js");
const PORT = Number(process.env.IT_PORT ?? 42101);
const BASE = `http://127.0.0.1:${PORT}`;

let server: ChildProcess;

async function waitForServer(timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE + "/", {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error(`server did not start on ${BASE}`);
}

beforeAll(async () => {
  if (!fs.existsSync(DIST_SERVER)) {
    throw new Error(
      `${DIST_SERVER} missing — run \`pnpm build\` before the integration tests.`
    );
  }
  server = spawn(process.execPath, [DIST_SERVER], {
    env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
    stdio: "ignore",
  });
  await waitForServer();
});

afterAll(() => {
  server?.kill();
});

describe("routing", () => {
  it("serves the prerendered homepage", async () => {
    const res = await fetch(BASE + "/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/html/);
  });

  it.each([
    "/about",
    "/donate",
    "/organization",
    "/contact",
    "/faq",
    "/get-involved",
  ])("serves %s with its own document", async route => {
    const res = await fetch(BASE + route);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<h1/);
    expect(html).toContain(`https://www.embeddedos.org${route}`); // canonical
  });

  it("gives each route a distinct title (no homepage-for-everything bug)", async () => {
    const titles = await Promise.all(
      ["/", "/about", "/donate", "/faq"].map(async r => {
        const html = await (await fetch(BASE + r)).text();
        return html.match(/<title>([\s\S]*?)<\/title>/)![1];
      })
    );
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("returns a real 404 status for unknown paths, not a soft 200", async () => {
    const res = await fetch(BASE + "/definitely-not-a-page-8f7a");
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("404");
  });

  it("404s the route that was removed as a thin duplicate", async () => {
    expect((await fetch(BASE + "/ecosystem-map")).status).toBe(404);
  });
});

describe("crawler files", () => {
  it("serves robots.txt as plain text pointing at the sitemap", async () => {
    const res = await fetch(BASE + "/robots.txt");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/plain/);
    const body = await res.text();
    expect(body).toContain("Sitemap: https://www.embeddedos.org/sitemap.xml");
  });

  it("serves sitemap.xml as XML", async () => {
    const res = await fetch(BASE + "/sitemap.xml");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/xml/);
    const body = await res.text();
    expect(body).toMatch(/^<\?xml/);
    expect((body.match(/<loc>/g) ?? []).length).toBeGreaterThan(80);
  });

  it("every sitemap URL actually resolves", async () => {
    const xml = await (await fetch(BASE + "/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m =>
      m[1].replace("https://www.embeddedos.org", "")
    );
    const statuses = await Promise.all(
      locs.map(async p => [p, (await fetch(BASE + (p || "/"))).status] as const)
    );
    expect(statuses.filter(([, s]) => s !== 200)).toEqual([]);
  });
});

describe("storage proxy", () => {
  it("serves committed images from disk without Forge credentials", async () => {
    const res = await fetch(BASE + "/media/embeddedos-logo-mark_bc053888.jpg");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/^image\//);
  });

  it("sets a long cache lifetime on immutable assets", async () => {
    const res = await fetch(BASE + "/media/embeddedos-logo-mark_bc053888.jpg");
    expect(res.headers.get("cache-control")).toMatch(/max-age=\d{5,}/);
  });

  it("404s an unknown storage key rather than 500ing", async () => {
    const res = await fetch(BASE + "/media/nope-not-real-1234.jpg");
    expect(res.status).toBe(404);
  });

  it("every asset referenced by the build is actually served", async () => {
    // This asserted `^image/` on everything in /media until the product
    // showcase reel landed there, which is the right kind of failure: the
    // directory stopped being images-only and the test said so. Widened to
    // check the served type against the extension rather than dropping the
    // type check, because "200 with the wrong content-type" is exactly how a
    // video ends up downloading instead of playing.
    const EXPECTED_TYPE: Record<string, RegExp> = {
      ".jpg": /^image\/jpeg/,
      ".jpeg": /^image\/jpeg/,
      ".png": /^image\/png/,
      ".webp": /^image\/webp/,
      ".svg": /^image\/svg/,
      ".gif": /^image\/gif/,
      ".avif": /^image\/avif/,
      ".mp4": /^video\/mp4/,
    };

    const dist = path.join(ROOT, "dist", "public", "media");
    const files = fs.readdirSync(dist);
    expect(files.length).toBeGreaterThan(15);

    const bad: string[] = [];
    const unknown: string[] = [];
    for (const f of files) {
      const want = EXPECTED_TYPE[path.extname(f).toLowerCase()];
      // An unrecognised extension is a finding, not something to skip past:
      // it means an asset kind nobody decided how to serve.
      if (!want) {
        unknown.push(f);
        continue;
      }
      const res = await fetch(`${BASE}/media/${f}`);
      if (
        res.status !== 200 ||
        !want.test(res.headers.get("content-type") ?? "")
      )
        bad.push(`${f} -> ${res.status} ${res.headers.get("content-type")}`);
    }
    expect(unknown, "no expected content-type for these").toEqual([]);
    expect(bad).toEqual([]);
  });

  it("serves the showcase reel with range support so it can be seeked", async () => {
    // A <video> that cannot answer a Range request plays only from the start:
    // dragging the scrubber does nothing. Express's sendFile handles this, but
    // it is a property of the route the page depends on, so it gets a test
    // rather than an assumption.
    const res = await fetch(BASE + "/media/product-showcase.mp4", {
      headers: { Range: "bytes=1000-2000" },
    });
    expect(res.status).toBe(206);
    expect(res.headers.get("content-range")).toMatch(/^bytes 1000-2000\/\d+$/);
  });
});

describe("api surface", () => {
  // tRPC legitimately answers 404 for an unknown procedure; what matters is that
  // *tRPC* answered — a JSON error — rather than the SPA fallback serving HTML.
  it("routes /api/trpc to tRPC rather than the SPA fallback", async () => {
    const res = await fetch(BASE + "/api/trpc/nonexistent.procedure");
    expect(res.headers.get("content-type")).toMatch(/json/);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("does not let the SPA fallback shadow the API namespace", async () => {
    const res = await fetch(BASE + "/api/trpc/anything");
    expect(await res.text()).not.toContain('<div id="root">');
  });
});
