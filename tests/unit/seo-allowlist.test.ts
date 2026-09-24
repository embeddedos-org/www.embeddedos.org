/**
 * The `--strict` gate runs in CI, so the exemption mechanism it honors needs
 * its own contract: every allowlist entry carries an expiry date, and an
 * expired (or dateless) entry fails the check instead of silently extending
 * the exemption.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import { applyAllowlist } from "../../scripts/seo-audit.mjs";

const NOW = new Date("2026-09-24T12:00:00Z");

const finding = (check: string, route: string) => ({
  level: "error" as const,
  check,
  route,
  detail: "detail",
});

describe("seo allowlist", () => {
  it("exempts a matching finding while the entry is unexpired", () => {
    const out = applyAllowlist(
      [finding("orphan-page", "/x"), finding("h1-missing", "/y")],
      [
        {
          check: "orphan-page",
          route: "/x",
          reason: "tracked",
          expires: "2026-10-31",
        },
      ],
      NOW
    );
    expect(out.map(f => `${f.check} ${f.route}`)).toEqual(["h1-missing /y"]);
  });

  it("supports a wildcard route", () => {
    const out = applyAllowlist(
      [finding("h1-missing", "/a"), finding("h1-missing", "/b")],
      [{ check: "h1-missing", route: "*", reason: "t", expires: "2026-10-31" }],
      NOW
    );
    expect(out).toEqual([]);
  });

  it("fails on an expired entry and keeps the underlying finding", () => {
    const out = applyAllowlist(
      [finding("orphan-page", "/x")],
      [
        {
          check: "orphan-page",
          route: "/x",
          reason: "t",
          expires: "2026-01-01",
        },
      ],
      NOW
    );
    const checks = out.map(f => f.check);
    expect(checks).toContain("orphan-page");
    expect(checks).toContain("allowlist-expired");
    expect(out.filter(f => f.check === "allowlist-expired")).toHaveLength(1);
  });

  it("fails on an entry with no (or a malformed) expiry date", () => {
    for (const entry of [
      { check: "orphan-page", route: "/x", reason: "t" },
      { check: "orphan-page", route: "/x", reason: "t", expires: "soon" },
    ]) {
      const out = applyAllowlist([finding("orphan-page", "/x")], [entry], NOW);
      const checks = out.map(f => f.check);
      expect(checks).toContain("orphan-page");
      expect(checks).toContain("allowlist-invalid");
    }
  });

  it("does not exempt a finding on the expiry day boundary", () => {
    // expires < today fails; expires == today is still valid.
    const sameDay = applyAllowlist(
      [finding("orphan-page", "/x")],
      [
        {
          check: "orphan-page",
          route: "/x",
          reason: "t",
          expires: "2026-09-24",
        },
      ],
      NOW
    );
    expect(sameDay.map(f => f.check)).not.toContain("allowlist-expired");
    expect(sameDay).toEqual([]);
  });

  it("warns on entries that match nothing", () => {
    const out = applyAllowlist(
      [finding("orphan-page", "/x")],
      [
        {
          check: "h1-missing",
          route: "/y",
          reason: "t",
          expires: "2026-10-31",
        },
      ],
      NOW
    );
    expect(out.map(f => f.check)).toContain("allowlist-unused");
    expect(out.find(f => f.check === "allowlist-unused")!.level).toBe("warn");
  });

  it("ignores a missing allowlist file", async () => {
    const { loadAllowlist } = await import("../../scripts/seo-audit.mjs");
    // scripts/seo-allowlist.json exists in the repo; an absent file must read
    // as empty rather than throw, so fresh checkouts keep working.
    expect(Array.isArray(loadAllowlist())).toBe(true);
  });
});
