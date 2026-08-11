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

/**
 * Decoding matters: "<1us" is written to the HTML as "&lt;1μs", so a check that
 * only looks for "<" silently passes. That hole let six pages keep an unsourced
 * latency figure through the first run of these tests.
 */
const decode = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));

const allPages = () =>
  fs.globSync("**/index.html", { cwd: DIST }).map(f => ({
    route: "/" + f.replace(/index\.html$/, "").replace(/\/$/, ""),
    text: decode(
      fs
        .readFileSync(path.join(DIST, f), "utf8")
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<style[\s\S]*?<\/style>/g, "")
        .replace(/<[^>]+>/g, " ")
    ).replace(/\s+/g, " "),
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

  it("states no kernel timing figure the eos repository does not measure", () => {
    // Scoped deliberately to the kernel's own timing. That claim is provably
    // unsourced: embeddedos-org/eos has no context-switch or interrupt-latency
    // benchmark at all — tests/test_performance_benchmarks.c times a host loop
    // — and the site stated it three incompatible ways at once ("Sub-1ms
    // interrupt latency", "<1us" scheduling, "<=10us context switch").
    //
    // Product-level figures (eRadar360 alert latency, eNI end-to-end, eDB
    // query) are NOT covered here. They may be design targets or measured on
    // hardware this repository cannot see; failing them would assert they are
    // false, which the evidence does not support either way. They are listed in
    // docs/unverified-claims.md for the owner to confirm or retire.
    const pattern =
      /(sub-?\s*\d+\s*(ms|[μµ]s)|[<≤]\s*\d+\s*(ms|[μµ]s))[^.]{0,40}(context switch|interrupt latency|scheduling latency)/i;

    // /roadmap and /research state these as dated targets and a report title
    // respectively, which is where an unmeasured number can honestly live.
    const EXEMPT = new Set(["/roadmap", "/research"]);

    const offenders = allPages()
      .filter(p => !EXEMPT.has(p.route))
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

describe("retired simulator figures stay retired", () => {
  /**
   * "63+ boards" outlived the "52+" purge on nineteen pages — the roadmap, the
   * getting-started walkthrough, both EoSim product pages, downloads, docs and
   * the ecosystem grid — while EoSim's registry held 150 platforms. It also
   * described them as *boards*, conflating the simulator's coverage with the
   * kernel's 83 board definitions, which is the exact confusion
   * SIM_PLATFORM_COUNT exists to prevent.
   *
   * A site applying for grants cannot publish three different numbers for the
   * same thing, so this scans every built page rather than a sample.
   */
  const RETIRED = [/\b63\+/, /\b63 (boards|platforms|virtual)/i, /\b52\+/];

  const routes = fs
    .globSync("**/index.html", { cwd: DIST })
    .map(f => "/" + f.replace(/(^|\/)index\.html$/, "").replace(/\/$/, ""))
    .map(r => (r === "" ? "/" : r));

  it("covers every prerendered page", () => {
    expect(routes.length).toBeGreaterThan(90);
  });

  it.each(RETIRED)("no page still claims %s", pattern => {
    const offenders = routes.filter(r => pattern.test(decode(pageText(r))));

    // /news carries dated release announcements. Rewriting a past headline
    // would be revising the record, not correcting a claim, so it is exempt
    // and reviewed by hand instead.
    expect(offenders.filter(r => r !== "/news")).toEqual([]);
  });

  it("states the simulator count the stack data actually holds", () => {
    expect(pageText("/product-eosim")).toContain(
      String(STACK.totals.simulatedPlatforms)
    );
    expect(pageText("/roadmap")).toContain(
      String(STACK.totals.simulatedPlatforms)
    );
  });
});
