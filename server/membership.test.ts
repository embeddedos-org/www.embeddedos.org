import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Membership page — search index", () => {
  it("returns membership page for 'membership' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "membership" });
    expect(result).toHaveProperty("pages");
    expect(result.pages.length).toBeGreaterThan(0);
    const paths = result.pages.map(p => p.path);
    expect(paths).toContain("/membership");
  });

  it("returns membership page for 'supporter' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "supporter" });
    expect(result.pages.length).toBeGreaterThan(0);
    const paths = result.pages.map(p => p.path);
    expect(paths).toContain("/membership");
  });

  it("returns membership page for 'sponsor' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "sponsor" });
    expect(result.pages.length).toBeGreaterThan(0);
    const paths = result.pages.map(p => p.path);
    expect(paths).toContain("/membership");
  });

  it("returns membership page for 'contributor' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "contributor" });
    expect(result.pages.length).toBeGreaterThan(0);
    const paths = result.pages.map(p => p.path);
    expect(paths).toContain("/membership");
  });

  it("returns membership page for 'join foundation' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "join foundation" });
    expect(result.pages.length).toBeGreaterThan(0);
    const paths = result.pages.map(p => p.path);
    expect(paths).toContain("/membership");
  });

  it("membership page title is 'Membership'", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "membership" });
    const membershipPage = result.pages.find(p => p.path === "/membership");
    expect(membershipPage).toBeDefined();
    expect(membershipPage?.title).toBe("Membership");
  });
});
