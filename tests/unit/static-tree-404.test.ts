/**
 * Unknown paths must serve the 404 page — in the static tree and through the
 * production server alike.
 *
 * Production is Apache/cPanel serving static files, where an ErrorDocument
 * falls back to /404.html; the local production server (server/_core/vite.ts)
 * resolves unknown paths to the same file with a 404 status. If the two
 * disagree, crawlers and visitors see different "not found" behaviour between
 * dev and prod. Requires `pnpm build` first.
 */
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");
const NOT_FOUND = path.join(DIST, "404.html");
const NOT_FOUND_ROUTE = path.join(DIST, "404", "index.html");

const notFoundHtml = () =>
  fs.readFileSync(NOT_FOUND, "utf8").replace(/\r\n/g, "\n");

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      s.close(() => (port ? resolve(port) : reject(new Error("no port"))));
    });
    s.on("error", reject);
  });
}

describe("the static tree carries a real 404 page", () => {
  it("exposes the NotFound snapshot at the conventional /404.html", () => {
    expect(fs.existsSync(NOT_FOUND), "dist/public/404.html exists").toBe(true);
    expect(
      fs.existsSync(NOT_FOUND_ROUTE),
      "dist/public/404/index.html exists"
    ).toBe(true);
  });

  it("serves the same 404 page from /404.html and the /404 route snapshot", () => {
    const viaFile = notFoundHtml();
    const viaRoute = fs
      .readFileSync(NOT_FOUND_ROUTE, "utf8")
      .replace(/\r\n/g, "\n");
    expect(viaFile).toBe(viaRoute);
  });

  it("is an actual not-found page, not a soft-200 shell", () => {
    const html = notFoundHtml();
    expect(html).toMatch(/404|not found|page not found/i);
    expect(html).not.toMatch(/<div id="root"><\/div>/);
  });
});

describe("the production server answers unknown paths with the 404 page", () => {
  let proc: ChildProcess | null = null;
  let base = "";

  beforeAll(async () => {
    if (!fs.existsSync(NOT_FOUND)) throw new Error("run `pnpm build` first");
    const port = await freePort();
    proc = spawn(process.execPath, [path.join(ROOT, "dist", "index.js")], {
      env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    base = `http://127.0.0.1:${port}`;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("production server did not start in time")),
        25000
      );
      proc!.stdout!.on("data", (d: Buffer) => {
        if (d.toString().includes("Server running on")) {
          clearTimeout(timer);
          resolve();
        }
      });
      proc!.on("error", reject);
      proc!.on("exit", code =>
        reject(new Error(`production server exited with ${code}`))
      );
    });
  }, 30000);

  afterAll(() => {
    proc?.kill("SIGTERM");
    proc = null;
  });

  const get = async (p: string) => {
    const res = await fetch(base + p, { redirect: "manual" });
    return { status: res.status, body: await res.text() };
  };

  it.each(["/no-such-page", "/definitely/not/here", "/old-link.html"])(
    "returns 404 with the 404 page for %s",
    async p => {
      const { status, body } = await get(p);
      expect(status).toBe(404);
      expect(body.replace(/\r\n/g, "\n")).toBe(notFoundHtml());
    }
  );

  it("still serves real routes with 200", async () => {
    for (const p of ["/", "/about"]) {
      const { status } = await get(p);
      expect(status, `GET ${p}`).toBe(200);
    }
  });
});
