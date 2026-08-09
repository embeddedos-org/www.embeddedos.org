/**
 * UI/UX Tests — EmbeddedOS Website
 *
 * Tests DOM-level concerns: content correctness, accessibility attributes,
 * navigation structure, and key page content checks.
 * These are server-side tests that validate the data layer that drives the UI.
 */

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

// ─── UI/UX Tests ─────────────────────────────────────────────────────────────

describe("UI/UX Tests", () => {
  describe("Navigation — all key pages are discoverable via search", () => {
    const KEY_PAGES = [
      { label: "Home", q: "embeddedos foundation", path: "/" },
      { label: "Products", q: "products", path: "/products" },
      { label: "EoS Kernel", q: "eos kernel", path: "/eos" },
      { label: "Health Devices", q: "health devices", path: "/health" },
      { label: "API Docs", q: "api reference", path: "/api-docs" },
      {
        label: "Getting Started",
        q: "getting started",
        path: "/getting-started",
      },
      { label: "Careers", q: "careers", path: "/careers" },
      { label: "About", q: "about", path: "/about" },
      { label: "Patents", q: "patents", path: "/patents" },
      { label: "What We Do", q: "what we do", path: "/what-we-do" },
      { label: "eCAD Hardware", q: "ecad hardware", path: "/ecad-hardware" },
      { label: "Community", q: "community", path: "/community" },
      { label: "Research", q: "research", path: "/research" },
      { label: "Downloads", q: "downloads", path: "/downloads" },
      { label: "Stacks", q: "stacks", path: "/stacks" },
      { label: "Events", q: "events", path: "/events" },
      { label: "News", q: "news", path: "/news" },
      { label: "Membership", q: "membership", path: "/membership" },
    ];

    KEY_PAGES.forEach(({ label, q, path }) => {
      it(`${label} page (${path}) is discoverable via search`, async () => {
        const { ctx } = makeCtx();
        const caller = appRouter.createCaller(ctx);
        const result = await caller.search.query({ q });
        const found = result.pages.some(p => p.path === path);
        expect(found).toBe(true);
      });
    });
  });

  describe("Content quality — search result titles are descriptive", () => {
    it("all page titles contain at least 3 characters", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "embedded" });
      result.pages.forEach(p => {
        // Short product names like 'eAI', 'eNI', 'EoSim', 'Home' are valid
        expect(p.title.length).toBeGreaterThan(2);
      });
    });

    it("page titles don't contain raw HTML tags", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "product" });
      result.pages.forEach(p => {
        expect(p.title).not.toMatch(/<[^>]+>/);
      });
    });

    it("repo titles are recognizable product names", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "kernel" });
      result.repos.forEach(r => {
        expect(r.title.length).toBeGreaterThan(2);
        expect(r.title).not.toMatch(/<[^>]+>/);
      });
    });
  });

  describe("Search UX — result relevance", () => {
    it("'health key' returns health-related pages first", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "health key" });
      if (result.pages.length > 0) {
        // Top result should be health-related
        const topPage = result.pages[0];
        const isHealthRelated =
          topPage.path.includes("health") ||
          topPage.title.toLowerCase().includes("health");
        expect(isHealthRelated).toBe(true);
      }
    });

    it("'api docs' query returns /api-docs as a top result", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "api docs" });
      const apiPage = result.pages.find(p => p.path === "/api-docs");
      expect(apiPage).toBeDefined();
      // Should be in top 3
      const idx = result.pages.indexOf(apiPage!);
      expect(idx).toBeLessThan(3);
    });

    it("'careers jobs' query returns careers page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "careers jobs" });
      const careersPage = result.pages.find(p => p.path === "/careers");
      expect(careersPage).toBeDefined();
    });
  });

  describe("Data integrity — search result structure", () => {
    it("all page results have required fields: title, path, type", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "eos" });
      result.pages.forEach(p => {
        expect(p).toHaveProperty("title");
        expect(p).toHaveProperty("path");
        expect(p).toHaveProperty("type");
        expect(p.type).toBe("page");
      });
    });

    it("all repo results have required fields: title, path, type", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "eos" });
      result.repos.forEach(r => {
        expect(r).toHaveProperty("title");
        expect(r).toHaveProperty("path");
        expect(r).toHaveProperty("type");
        expect(r.type).toBe("repo");
      });
    });

    it("page paths start with /", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "product" });
      result.pages.forEach(p => {
        expect(p.path).toMatch(/^\//);
      });
    });

    it("repo paths start with https://github.com", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "kernel" });
      result.repos.forEach(r => {
        expect(r.path).toMatch(/^https:\/\/github\.com/);
      });
    });
  });

  describe("Accessibility — auth state data", () => {
    it("user object has displayable name field", async () => {
      const user = {
        id: 1,
        openId: "test",
        email: "test@embeddedos.org",
        name: "Test User",
        loginMethod: "manus" as const,
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
      const ctx: TrpcContext = {
        user,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: () => {} } as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result?.name).toBe("Test User");
      expect(result?.name.length).toBeGreaterThan(0);
    });

    it("user email is a valid email format", async () => {
      const user = {
        id: 1,
        openId: "test",
        email: "test@embeddedos.org",
        name: "Test User",
        loginMethod: "manus" as const,
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
      const ctx: TrpcContext = {
        user,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: () => {} } as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result?.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });
});
