/**
 * The careers endpoint over real HTTP, executed by a real PHP.
 *
 * tests/php/apply.test.php covers the pure functions by requiring the file
 * under the CLI SAPI, which never runs the request handler — so the status
 * codes, the JSON envelope, the honeypot short-circuit and the rate limiter
 * were unexercised. Those are the parts a browser actually meets.
 *
 * This serves dist/public through PHP's built-in server, which is the closest
 * thing available here to the host's behaviour: the file is executed rather
 * than served as source, exactly as it will be in production.
 *
 * What it cannot cover is delivery. mail() hands off to an MTA and there is
 * none on a build machine, so a valid application ends in `send_failed` here
 * and is asserted as such. That is the correct response to mail() returning
 * false, and it proves everything up to the handoff — parse, honeypot, rate
 * limit, validation, header construction — ran.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PORT = 43171;
const URL = `http://127.0.0.1:${PORT}/api/apply.php`;
const DIST = path.resolve(__dirname, "../../dist/public");

/** A payload that passes every rule, so each case can vary one thing. */
const VALID = {
  fullName: "Ada Lovelace",
  email: "ada@example.org",
  roleCategory: "Research Engineer",
  employmentType: "Full-Time",
  workAuthorization: "US Citizen",
  statement:
    "I have spent six years on ARM Cortex-M firmware and would like to work " +
    "on an open-source RTOS where the results are published.",
};

function phpAvailable(): boolean {
  try {
    execFileSync("php", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Forget every recorded request, so the limiter starts from zero. */
function clearRateLimitStore(): void {
  for (const f of fs.readdirSync(os.tmpdir())) {
    if (f.startsWith("eos-apply-") && f.endsWith(".json")) {
      try {
        fs.unlinkSync(path.join(os.tmpdir(), f));
      } catch {
        // Another run's file, or already gone. Not worth failing over.
      }
    }
  }
}

const post = (body: unknown) =>
  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const HAVE_PHP = phpAvailable();
const HAVE_BUILD = fs.existsSync(path.join(DIST, "api/apply.php"));

// Skipped loudly rather than silently passing: a green run that never started
// PHP would say nothing about the endpoint.
describe.skipIf(!HAVE_PHP || !HAVE_BUILD)(
  "careers endpoint (php -S over dist/public)",
  () => {
    let server: ChildProcess;

    beforeAll(async () => {
      server = spawn("php", ["-S", `127.0.0.1:${PORT}`, "-t", DIST], {
        stdio: "ignore",
      });

      // Poll rather than sleep: the built-in server is usually up in ~100ms.
      const deadline = Date.now() + 10_000;
      for (;;) {
        try {
          await fetch(URL, { method: "HEAD" });
          break;
        } catch {
          if (Date.now() > deadline) throw new Error("php -S did not start");
          await new Promise(r => setTimeout(r, 100));
        }
      }
      clearRateLimitStore();
    }, 20_000);

    afterAll(() => {
      server?.kill();
      clearRateLimitStore();
    });

    it("refuses anything but POST", async () => {
      const res = await fetch(URL);
      expect(res.status).toBe(405);
      expect(res.headers.get("allow")).toBe("POST");
      expect(await res.json()).toEqual({
        ok: false,
        error: "method_not_allowed",
      });
    });

    it("rejects a body that is not JSON", async () => {
      const res = await post("not json at all");
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("malformed_json");
    });

    it("names every field that failed validation", async () => {
      const res = await post({
        fullName: "A",
        email: "nope",
        statement: "short",
      });
      expect(res.status).toBe(422);

      const body = await res.json();
      expect(body.error).toBe("invalid");
      // Reported together so an applicant fixes the form once, not six times.
      expect(new Set(body.fields)).toEqual(
        new Set([
          "fullName",
          "email",
          "statement",
          "roleCategory",
          "employmentType",
          "workAuthorization",
        ])
      );
    });

    it("accepts a filled honeypot without sending, and says nothing about it", async () => {
      // 200 on purpose: a bot that learns it was caught retries with the field
      // cleared. Reaching the send path would have produced send_failed here.
      const res = await post({ ...VALID, website: "http://spam.example" });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    });

    it("answers JSON, never HTML, and never caches", async () => {
      const res = await post(VALID);
      expect(res.headers.get("content-type")).toMatch(/application\/json/);
      expect(res.headers.get("cache-control")).toBe("no-store");
      expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    });

    it("runs a valid application all the way to the mail handoff", async () => {
      const res = await post(VALID);

      // No MTA on a build machine, so mail() returns false and this is the
      // honest answer. Reaching it means parse, honeypot, rate limit,
      // validation and header construction all succeeded. On a host with an
      // MTA the same path returns 200 {ok:true}.
      expect([200, 502]).toContain(res.status);
      const body = await res.json();
      if (res.status === 502) {
        expect(body).toEqual({ ok: false, error: "send_failed" });
      } else {
        expect(body).toEqual({ ok: true });
      }
    });

    it("stops a flood from one address", async () => {
      clearRateLimitStore();

      const seen: number[] = [];
      for (let i = 0; i < 7; i++) {
        seen.push((await post(VALID)).status);
      }

      // Five get through the limiter (whatever they then answer), the rest do
      // not. Without this the endpoint is a free mail relay for anyone with a
      // loop.
      expect(seen.filter(s => s !== 429)).toHaveLength(5);
      expect(seen.slice(5)).toEqual([429, 429]);
    }, 20_000);

    it("refuses a body too large to be an application", async () => {
      const res = await post({ ...VALID, statement: "x".repeat(70_000) });
      expect(res.status).toBe(413);
      expect((await res.json()).error).toBe("too_large");
    });
  }
);
