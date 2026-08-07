/**
 * Guards the factual claims the site makes about the EmbeddedOS stack.
 *
 * These numbers were written by hand and drifted from the repositories they
 * describe: "52+" appeared on seventeen pages while embeddedos-org/eos held 83
 * board definitions, EoSim's simulated-platform count was quoted as the same
 * "52+" when its platforms/ directory holds 150, and the kernel's timing was
 * stated as "sub-1ms", "<=10us" and "<1us" on three different pages — a
 * thousandfold spread for a figure nothing in the repository measures.
 *
 * Page copy now reads from shared/stack-data.ts, which `pnpm sync:stack`
 * regenerates by counting the source repos. These tests check the generated
 * data is sane and that the retired figures cannot come back.
 *
 * Requires `pnpm build` first.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { STACK } from "../../shared/stack-data";

const DIST = path.resolve(import.meta.dirname, "../../dist/public");

const pageText = (route: string) => {
  const file =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route.replace(/^\//, ""), "index.html");
  return fs
    .readFileSync(file, "utf8")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
};

const allPages = () =>
  fs.globSync("**/index.html", { cwd: DIST }).map(f => ({
    route: "/" + f.replace(/index\.html$/, "").replace(/\/$/, ""),
    text: fs
      .readFileSync(path.join(DIST, f), "utf8")
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  }));

describe("generated stack data", () => {
  it("counts every repository in the manifest", () => {
    expect(STACK.totals.repositories).toBe(22);
    expect(STACK.projects).toHaveLength(STACK.totals.repositories);
  });

  it("places every project in a known tier", () => {
    for (const p of STACK.projects) {
      expect(Object.keys(STACK.tiers)).toContain(String(p.tier));
    }
  });

  it("derives hardware counts that are internally consistent", () => {
    const { boards, architectures, families, vendors } = STACK.totals;
    // Every board declares one arch, family and vendor, so each distinct count
    // can never exceed the number of boards.
    for (const n of [architectures, families, vendors]) {
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThanOrEqual(boards);
    }
  });

  it("records at least one shipped roadmap profile", () => {
    expect(STACK.roadmap.filter(r => r.shipped).length).toBeGreaterThan(0);
  });
});

describe("retired claims do not reappear", () => {
  it("states no '52+' platform count anywhere", () => {
    const offenders = allPages()
      .filter(p => /\b52\s*\+/.test(p.text))
      .map(p => p.route);

    expect(
      offenders,
      `"52+" is stale — eos/boards holds ${STACK.totals.boards} board definitions`
    ).toEqual([]);
  });

  it("asserts no kernel latency figure the repository does not measure", () => {
    // eos has no context-switch or interrupt-latency benchmark: its only
    // performance test times a host loop. Any such figure here would be
    // unsourced, and the three that existed contradicted each other.
    const pattern =
      /(sub-?1\s*ms|≤\s*10\s*[μµ]s|<\s*1\s*[μµ]s)[^.]{0,30}(latency|context switch)/i;

    const offenders = allPages()
      .filter(p => pattern.test(p.text))
      .map(p => p.route);

    expect(offenders).toEqual([]);
  });
});

describe("verified figures reach the rendered pages", () => {
  it.each(["/", "/about", "/eos", "/architecture"])(
    "%s states the real board count",
    route => {
      expect(pageText(route)).toContain(String(STACK.totals.boards));
    }
  );

  it("keeps the simulator's platform count distinct from the board count", () => {
    // One number was used for both, which understated EoSim by roughly 3x.
    expect(STACK.totals.simulatedPlatforms).not.toBe(STACK.totals.boards);
    expect(pageText("/what-we-do")).toContain(
      String(STACK.totals.simulatedPlatforms)
    );
  });
});
