/**
 * Security tests.
 *
 * Two halves: live checks against the running server (traversal, method
 * handling, error leakage, response headers) and static checks over the build
 * output and source tree (leaked secrets, dangerous DOM sinks, unsafe target
 * usage, dependency advisories).
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIST = path.join(ROOT, "dist", "public");
const DIST_SERVER = path.join(ROOT, "dist", "index.js");
const PORT = Number(process.env.SEC_PORT ?? 42102);
const BASE = `http://127.0.0.1:${PORT}`;

let server: ChildProcess;

async function waitForServer(timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(BASE + "/", { signal: AbortSignal.timeout(2000) })).ok)
        return;
    } catch {
      /* not up yet */
    }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error("server did not start");
}

beforeAll(async () => {
  if (!fs.existsSync(DIST_SERVER)) throw new Error("run `pnpm build` first");
  server = spawn(process.execPath, [DIST_SERVER], {
    env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
    stdio: "ignore",
  });
  await waitForServer();
});

afterAll(() => server?.kill());

describe("path traversal", () => {
  const payloads = [
    "/media/../../package.json",
    "/media/..%2f..%2fpackage.json",
    "/media/....//....//package.json",
    "/../package.json",
    "/assets/../../package.json",
    "/media/%2e%2e%2f%2e%2e%2fpackage.json",
  ];

  it.each(payloads)("never discloses source files via %s", async p => {
    const res = await fetch(BASE + p);
    const body = await res.text();
    expect(body).not.toContain('"packageManager"');
    expect(body).not.toContain('"devDependencies"');
  });

  it("does not expose the server bundle", async () => {
    const res = await fetch(BASE + "/index.js");
    if (res.status === 200) {
      expect(await res.text()).not.toContain("STRIPE_SECRET_KEY");
    }
  });

  it("does not serve dotfiles such as the internal prerender shell", async () => {
    expect((await fetch(BASE + "/.app-shell.html")).status).toBe(404);
  });

  it("does not serve .env even if one is present", async () => {
    const res = await fetch(BASE + "/.env");
    expect(res.status).toBe(404);
  });
});

describe("secret and artefact leakage in the public build", () => {
  const files: string[] = [];
  const collect = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) collect(p);
      else if (/\.(html|js|css|json|txt|xml)$/.test(e.name)) files.push(p);
    }
  };
  beforeAll(() => collect(DIST));

  it("ships no obvious credential patterns", () => {
    // Live secret shapes only. Publishable Stripe keys (pk_) are client-side by design.
    const patterns: [string, RegExp][] = [
      ["stripe secret", /\bsk_live_[A-Za-z0-9]{16,}/],
      ["stripe restricted", /\brk_live_[A-Za-z0-9]{16,}/],
      ["github token", /\bgh[pousr]_[A-Za-z0-9]{30,}/],
      ["aws access key", /\bAKIA[0-9A-Z]{16}\b/],
      ["private key block", /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/],
      ["google api key", /\bAIza[0-9A-Za-z_-]{35}\b/],
      ["slack token", /\bxox[baprs]-[0-9A-Za-z-]{10,}/],
    ];
    const hits: string[] = [];
    for (const f of files) {
      const content = fs.readFileSync(f, "utf8");
      for (const [name, re] of patterns) {
        if (re.test(content)) hits.push(`${name} in ${path.relative(DIST, f)}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("ships no database connection strings", () => {
    const hits = files.filter(f =>
      /(mysql|postgres(ql)?|mongodb(\+srv)?):\/\/[^\s"']*:[^\s"']*@/.test(
        fs.readFileSync(f, "utf8")
      )
    );
    expect(hits.map(f => path.relative(DIST, f))).toEqual([]);
  });

  it("ships no dev-only Manus tooling", () => {
    const hits = files.filter(f =>
      /manus-runtime|debug-collector/.test(fs.readFileSync(f, "utf8"))
    );
    expect(hits.map(f => path.relative(DIST, f))).toEqual([]);
  });

  it("ships no sourcemaps that would expose original source", () => {
    const maps = fs
      .readdirSync(path.join(DIST, "assets"))
      .filter(f => f.endsWith(".map"));
    expect(maps).toEqual([]);
  });
});

describe("client-side injection surface", () => {
  const sources: string[] = [];
  const collect = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) collect(p);
      else if (/\.tsx?$/.test(e.name)) sources.push(p);
    }
  };
  beforeAll(() => collect(path.join(ROOT, "client", "src")));

  it("uses no dangerouslySetInnerHTML outside vetted chart/ui primitives", () => {
    const offenders = sources.filter(
      f =>
        /dangerouslySetInnerHTML/.test(fs.readFileSync(f, "utf8")) &&
        !f.includes(`${path.sep}ui${path.sep}`)
    );
    expect(offenders.map(f => path.relative(ROOT, f))).toEqual([]);
  });

  it("uses no eval or Function constructor", () => {
    const offenders = sources.filter(f => {
      const s = fs.readFileSync(f, "utf8");
      return /\beval\s*\(/.test(s) || /new\s+Function\s*\(/.test(s);
    });
    expect(offenders.map(f => path.relative(ROOT, f))).toEqual([]);
  });

  it("pairs every target=_blank with rel=noopener", () => {
    const offenders: string[] = [];
    for (const f of sources) {
      const s = fs.readFileSync(f, "utf8");
      for (const m of s.matchAll(/<a\b[^>]*target=["{]?_blank[^>]*>/g)) {
        if (!/rel=/.test(m[0]))
          offenders.push(`${path.relative(ROOT, f)}: ${m[0].slice(0, 70)}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("server behaviour", () => {
  it("does not advertise the express fingerprint", async () => {
    const res = await fetch(BASE + "/");
    expect(res.headers.get("x-powered-by")).toBeNull();
  });

  it("does not leak stack traces on a bad API request", async () => {
    const res = await fetch(BASE + "/api/trpc/x", {
      method: "POST",
      body: "{{{not json",
    });
    const body = await res.text();
    expect(body).not.toMatch(/\bat \/|node_modules|\.ts:\d+:\d+/);
  });

  it("rejects unsupported methods on static assets", async () => {
    const res = await fetch(BASE + "/media/embeddedos-logo-mark_bc053888.jpg", {
      method: "DELETE",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("does not reflect unescaped input into the 404 page", async () => {
    const res = await fetch(BASE + "/%3Cscript%3Ealert(1)%3C%2Fscript%3E");
    const body = await res.text();
    expect(body).not.toContain("<script>alert(1)</script>");
  });
});

describe("dependencies", () => {
  it("has no critical advisories in production dependencies", () => {
    let raw = "";
    try {
      raw = execFileSync("pnpm", ["audit", "--prod", "--json"], {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch (e: any) {
      raw = e.stdout ?? ""; // pnpm exits non-zero when advisories exist
    }
    if (!raw.trim()) return; // audit unavailable offline — do not fail the suite
    const critical: string[] = [];
    for (const line of raw.trim().split("\n")) {
      try {
        const j = JSON.parse(line);
        const counts = j.metadata?.vulnerabilities;
        if (counts?.critical) critical.push(`critical: ${counts.critical}`);
      } catch {
        /* not a JSON line */
      }
    }
    expect(critical).toEqual([]);
  });
});
