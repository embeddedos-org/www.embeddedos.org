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

describe("search.query", () => {
  it("returns page results for 'health' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "health" });

    expect(result).toHaveProperty("pages");
    expect(result).toHaveProperty("repos");
    expect(result.pages.length).toBeGreaterThan(0);

    const titles = result.pages.map(p => p.title.toLowerCase());
    const hasHealthPage = titles.some(t => t.includes("health"));
    expect(hasHealthPage).toBe(true);
  });

  it("returns aerospace results for 'aeroswift' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "aeroswift" });

    expect(result.pages.length).toBeGreaterThan(0);
    const titles = result.pages.map(p => p.title.toLowerCase());
    const hasAero = titles.some(t => t.includes("aero") || t.includes("aerospace"));
    expect(hasAero).toBe(true);
  });

  it("returns product-level results for 'health key ultra' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "health key ultra" });

    expect(result.pages.length).toBeGreaterThan(0);
    const titles = result.pages.map(p => p.title);
    const hasKeyUltra = titles.some(t => t.includes("HEALTH-KEY ULTRA"));
    expect(hasKeyUltra).toBe(true);
  });

  it("returns hardware results for 'stm32' query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "stm32" });

    expect(result.pages.length).toBeGreaterThan(0);
    const titles = result.pages.map(p => p.title.toLowerCase());
    const hasHardware = titles.some(t => t.includes("hardware"));
    expect(hasHardware).toBe(true);
  });

  it("returns empty results for nonsense query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "xyzzy123nonsense" });

    expect(result.pages).toHaveLength(0);
    expect(result.repos).toHaveLength(0);
  });

  it("scores exact title matches higher than partial matches", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "books" });

    expect(result.pages.length).toBeGreaterThan(0);
    // Books page should be the top result for "books"
    const topTitle = result.pages[0]?.title.toLowerCase();
    expect(topTitle).toContain("book");
  });

  it("rejects query shorter than 1 character", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.search.query({ q: "" })).rejects.toThrow();
  });

  it("rejects query longer than 200 characters", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.search.query({ q: "a".repeat(201) })).rejects.toThrow();
  });
});
