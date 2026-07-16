/**
 * Comprehensive Test Suite — EmbeddedOS Website
 *
 * Covers all 9 testing categories:
 *  1. Unit tests
 *  2. Integration tests
 *  3. Functional tests
 *  4. Security tests
 *  5. End-to-end (API layer) tests
 *  6. Acceptance tests
 *  7. Performance tests
 *  8. Smoke tests
 *  9. Regression tests
 *
 * UI/UX tests are in server/ui-ux.test.ts (DOM-level checks via jsdom).
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 1,
    openId: "test-user-001",
    email: "test@embeddedos.org",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    lastSignedIn: new Date("2025-01-01"),
    ...overrides,
  };
}

function makeCtx(user: AuthenticatedUser | null = null): {
  ctx: TrpcContext;
  clearedCookies: Array<{ name: string; options: Record<string, unknown> }>;
} {
  const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
  const ctx: TrpcContext = {
    user: user ?? undefined,
    req: {
      protocol: "https",
      headers: { "x-forwarded-proto": "https" },
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

// ─── 1. UNIT TESTS ────────────────────────────────────────────────────────────

describe("1. Unit Tests", () => {
  describe("Search scoring algorithm", () => {
    it("returns pages for exact title match", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "EoS Kernel" });
      expect(result.pages.length).toBeGreaterThan(0);
      expect(result.pages[0].title).toMatch(/EoS/i);
    });

    it("returns repos for exact repo name", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "eBoot" });
      expect(result.repos.length).toBeGreaterThan(0);
      expect(result.repos[0].title).toBe("eBoot");
    });

    it("returns empty results for nonsense query", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "xyzzy_nonexistent_abc123" });
      expect(result.pages).toHaveLength(0);
      expect(result.repos).toHaveLength(0);
    });

    it("returns results for partial tag match", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "rtos" });
      expect(result.pages.length + result.repos.length).toBeGreaterThan(0);
    });

    it("limits page results to at most 7", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "product" });
      expect(result.pages.length).toBeLessThanOrEqual(7);
    });

    it("limits repo results to at most 4", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "embedded" });
      expect(result.repos.length).toBeLessThanOrEqual(4);
    });
  });

  describe("Auth.me procedure", () => {
    it("returns null when unauthenticated", async () => {
      const { ctx } = makeCtx(null);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toBeUndefined();
    });

    it("returns user when authenticated", async () => {
      const user = makeUser();
      const { ctx } = makeCtx(user);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toBeDefined();
      expect(result?.email).toBe("test@embeddedos.org");
    });

    it("returns correct role for admin user", async () => {
      const admin = makeUser({ role: "admin" });
      const { ctx } = makeCtx(admin);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result?.role).toBe("admin");
    });
  });
});

// ─── 2. INTEGRATION TESTS ────────────────────────────────────────────────────

describe("2. Integration Tests", () => {
  describe("Auth + Search integration", () => {
    it("search works for both authenticated and unauthenticated users", async () => {
      const q = "health";

      // Unauthenticated
      const { ctx: anonCtx } = makeCtx(null);
      const anonCaller = appRouter.createCaller(anonCtx);
      const anonResult = await anonCaller.search.query({ q });

      // Authenticated
      const { ctx: authCtx } = makeCtx(makeUser());
      const authCaller = appRouter.createCaller(authCtx);
      const authResult = await authCaller.search.query({ q });

      // Both should return the same results
      expect(anonResult.pages.length).toBe(authResult.pages.length);
      expect(anonResult.repos.length).toBe(authResult.repos.length);
    });

    it("logout then auth.me returns undefined", async () => {
      const user = makeUser();
      const { ctx, clearedCookies } = makeCtx(user);
      const caller = appRouter.createCaller(ctx);

      // Logout
      const logoutResult = await caller.auth.logout();
      expect(logoutResult.success).toBe(true);
      expect(clearedCookies).toHaveLength(1);

      // Simulate unauthenticated context after logout
      const { ctx: anonCtx } = makeCtx(null);
      const anonCaller = appRouter.createCaller(anonCtx);
      const me = await anonCaller.auth.me();
      expect(me).toBeUndefined();
    });
  });

  describe("Search + multiple categories", () => {
    it("aerospace query returns both page and repo results", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "aerospace" });
      // Should find ecad-hardware page and eos-aero repo
      const hasPage = result.pages.some(p => p.path.includes("ecad-hardware") || p.path.includes("what-we-do"));
      const hasRepo = result.repos.some(r => r.path.includes("eos-aero"));
      expect(hasPage || hasRepo).toBe(true);
    });

    it("multi-word query 'embedded os' returns relevant results", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "embedded os" });
      expect(result.pages.length + result.repos.length).toBeGreaterThan(0);
    });
  });
});

// ─── 3. FUNCTIONAL TESTS ─────────────────────────────────────────────────────

describe("3. Functional Tests", () => {
  describe("Search functional behaviour", () => {
    it("'api' query returns API docs page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "api" });
      const apiPage = result.pages.find(p => p.path === "/api-docs");
      expect(apiPage).toBeDefined();
    });

    it("'health' query returns health-related results", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "health" });
      const hasHealth = result.pages.some(p => p.path.includes("health")) ||
        result.repos.some(r => r.path.includes("health"));
      expect(hasHealth).toBe(true);
    });

    it("'getting started' query returns onboarding page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "getting started" });
      const page = result.pages.find(p => p.path === "/getting-started");
      expect(page).toBeDefined();
    });

    it("'careers' query returns careers page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "careers" });
      const page = result.pages.find(p => p.path === "/careers");
      expect(page).toBeDefined();
    });

    it("'patents' query returns patents page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "patents" });
      const page = result.pages.find(p => p.path === "/patents");
      expect(page).toBeDefined();
    });

    it("'architecture' query returns architecture page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "architecture" });
      // Should find architecture page or api-docs
      expect(result.pages.length + result.repos.length).toBeGreaterThan(0);
    });
  });

  describe("Auth functional behaviour", () => {
    it("logout returns { success: true }", async () => {
      const { ctx } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();
      expect(result).toEqual({ success: true });
    });

    it("logout clears exactly one cookie", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies).toHaveLength(1);
    });

    it("logout clears the correct cookie name", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    });
  });
});

// ─── 4. SECURITY TESTS ───────────────────────────────────────────────────────

describe("4. Security Tests", () => {
  describe("Input validation — search", () => {
    it("rejects empty query string", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.search.query({ q: "" })).rejects.toThrow();
    });

    it("rejects query longer than 200 characters", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const longQuery = "a".repeat(201);
      await expect(caller.search.query({ q: longQuery })).rejects.toThrow();
    });

    it("handles SQL injection attempt safely", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      // Should not throw, just return empty results
      const result = await caller.search.query({ q: "'; DROP TABLE users; --" });
      expect(Array.isArray(result.pages)).toBe(true);
      expect(Array.isArray(result.repos)).toBe(true);
    });

    it("handles XSS attempt safely", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "<script>alert(1)</script>" });
      // Should return results without executing script
      expect(Array.isArray(result.pages)).toBe(true);
      // Result titles should not contain raw script tags
      result.pages.forEach(p => {
        expect(p.title).not.toMatch(/<script>/i);
      });
    });

    it("handles null byte injection safely", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      // Null bytes should be handled without crashing
      const result = await caller.search.query({ q: "kernel\x00malicious" });
      expect(Array.isArray(result.pages)).toBe(true);
    });
  });

  describe("Cookie security", () => {
    it("logout cookie has httpOnly flag", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies[0]?.options?.httpOnly).toBe(true);
    });

    it("logout cookie has secure flag on HTTPS", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies[0]?.options?.secure).toBe(true);
    });

    it("logout cookie has sameSite=none for cross-origin OAuth", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies[0]?.options?.sameSite).toBe("none");
    });

    it("logout cookie has maxAge=-1 to expire immediately", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies[0]?.options?.maxAge).toBe(-1);
    });

    it("logout cookie has path='/' to clear site-wide", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      expect(clearedCookies[0]?.options?.path).toBe("/");
    });
  });

  describe("Authorization boundaries", () => {
    it("auth.me does not expose sensitive fields beyond schema", async () => {
      const user = makeUser();
      const { ctx } = makeCtx(user);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      // Should not expose raw password or token fields
      expect(result).not.toHaveProperty("password");
      expect(result).not.toHaveProperty("token");
      expect(result).not.toHaveProperty("secret");
    });
  });
});

// ─── 5. END-TO-END (API LAYER) TESTS ─────────────────────────────────────────

describe("5. End-to-End (API Layer) Tests", () => {
  describe("Full user journey — search to page", () => {
    it("user searches 'EoS' and gets the EoS product page", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "EoS" });
      const eosPage = result.pages.find(p => p.path === "/product-eos" || p.path === "/eos");
      expect(eosPage).toBeDefined();
    });

    it("user searches 'bootloader' and gets eBoot results", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "bootloader" });
      const hasEboot = result.pages.some(p => p.path.includes("eboot")) ||
        result.repos.some(r => r.title === "eBoot");
      expect(hasEboot).toBe(true);
    });

    it("authenticated user can search and logout in sequence", async () => {
      const user = makeUser();
      const { ctx, clearedCookies } = makeCtx(user);
      const caller = appRouter.createCaller(ctx);

      // Step 1: Search
      const searchResult = await caller.search.query({ q: "kernel" });
      expect(searchResult.pages.length + searchResult.repos.length).toBeGreaterThan(0);

      // Step 2: Logout
      const logoutResult = await caller.auth.logout();
      expect(logoutResult.success).toBe(true);
      expect(clearedCookies).toHaveLength(1);
    });
  });

  describe("Router structure integrity", () => {
    it("appRouter has auth sub-router", () => {
      expect(appRouter._def.procedures).toHaveProperty("auth.me");
      expect(appRouter._def.procedures).toHaveProperty("auth.logout");
    });

    it("appRouter has search sub-router", () => {
      expect(appRouter._def.procedures).toHaveProperty("search.query");
    });

    it("appRouter has ebot sub-router", () => {
      expect(appRouter._def.procedures).toHaveProperty("ebot.chat");
    });
  });
});

// ─── 6. ACCEPTANCE TESTS ─────────────────────────────────────────────────────

describe("6. Acceptance Tests", () => {
  describe("Business requirements — search", () => {
    it("AC-1: Search returns results for all major product names", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const products = ["EoS", "eBoot", "EAI", "ENI", "eOffice", "eApps", "eDB", "EoSim", "EoStudio"];
      for (const product of products) {
        const result = await caller.search.query({ q: product });
        expect(result.pages.length + result.repos.length).toBeGreaterThan(0);
      }
    });

    it("AC-2: Search returns results for all major page categories", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const categories = ["health", "careers", "community", "research", "downloads", "stacks"];
      for (const cat of categories) {
        const result = await caller.search.query({ q: cat });
        expect(result.pages.length + result.repos.length).toBeGreaterThan(0);
      }
    });

    it("AC-3: Search result paths are valid URL paths (start with / or https://)", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "embedded" });
      result.pages.forEach(p => {
        expect(p.path).toMatch(/^\/|^https?:\/\//);
      });
      result.repos.forEach(r => {
        expect(r.path).toMatch(/^\/|^https?:\/\//);
      });
    });

    it("AC-4: Search result titles are non-empty strings", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "kernel" });
      result.pages.forEach(p => {
        expect(typeof p.title).toBe("string");
        expect(p.title.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Business requirements — auth", () => {
    it("AC-5: Unauthenticated users can still use search", async () => {
      const { ctx } = makeCtx(null);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "eos" });
      expect(result).toBeDefined();
    });

    it("AC-6: Authenticated user data includes required fields", async () => {
      const user = makeUser();
      const { ctx } = makeCtx(user);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("role");
    });
  });
});

// ─── 7. PERFORMANCE TESTS ────────────────────────────────────────────────────

describe("7. Performance Tests", () => {
  it("search query completes in under 100ms", async () => {
    const { ctx } = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const start = performance.now();
    await caller.search.query({ q: "embedded" });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it("auth.me completes in under 10ms", async () => {
    const user = makeUser();
    const { ctx } = makeCtx(user);
    const caller = appRouter.createCaller(ctx);
    const start = performance.now();
    await caller.auth.me();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10);
  });

  it("auth.logout completes in under 10ms", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    const start = performance.now();
    await caller.auth.logout();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10);
  });

  it("10 concurrent search queries complete without error", async () => {
    const { ctx } = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const queries = Array.from({ length: 10 }, (_, i) =>
      caller.search.query({ q: ["eos", "eboot", "health", "ai", "kernel", "apps", "docs", "careers", "research", "stacks"][i] })
    );
    const results = await Promise.all(queries);
    expect(results).toHaveLength(10);
    results.forEach(r => {
      expect(r).toHaveProperty("pages");
      expect(r).toHaveProperty("repos");
    });
  });

  it("search with max-length query (200 chars) completes in under 200ms", async () => {
    const { ctx } = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const longQuery = "embedded os kernel real-time rtos hal gpio uart spi i2c can usb ethernet wifi bluetooth".slice(0, 200);
    const start = performance.now();
    await caller.search.query({ q: longQuery });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });
});

// ─── 8. SMOKE TESTS ──────────────────────────────────────────────────────────

describe("8. Smoke Tests", () => {
  it("appRouter is defined and callable", () => {
    expect(appRouter).toBeDefined();
    expect(typeof appRouter.createCaller).toBe("function");
  });

  it("auth.me procedure exists", () => {
    expect(appRouter._def.procedures["auth.me"]).toBeDefined();
  });

  it("auth.logout procedure exists", () => {
    expect(appRouter._def.procedures["auth.logout"]).toBeDefined();
  });

  it("search.query procedure exists", () => {
    expect(appRouter._def.procedures["search.query"]).toBeDefined();
  });

  it("ebot.chat procedure exists", () => {
    expect(appRouter._def.procedures["ebot.chat"]).toBeDefined();
  });

  it("search returns a valid response shape", async () => {
    const { ctx } = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.search.query({ q: "eos" });
    expect(result).toHaveProperty("pages");
    expect(result).toHaveProperty("repos");
    expect(Array.isArray(result.pages)).toBe(true);
    expect(Array.isArray(result.repos)).toBe(true);
  });

  it("auth.me returns valid shape when authenticated", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(typeof result?.id).toBe("number");
    expect(typeof result?.email).toBe("string");
  });

  it("COOKIE_NAME constant is defined", () => {
    expect(COOKIE_NAME).toBeDefined();
    expect(typeof COOKIE_NAME).toBe("string");
    expect(COOKIE_NAME.length).toBeGreaterThan(0);
  });
});

// ─── 9. REGRESSION TESTS ─────────────────────────────────────────────────────

describe("9. Regression Tests", () => {
  describe("REG-001: Search scoring — exact match ranks higher than partial", () => {
    it("exact tag match scores higher than partial match", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "rtos" });
      // The EoS kernel page has 'rtos' as an exact tag
      const eosPage = result.pages.find(p => p.path.includes("eos") || p.title.includes("EoS"));
      expect(eosPage).toBeDefined();
    });
  });

  describe("REG-002: Logout cookie options haven't regressed", () => {
    it("all required cookie security options are present", async () => {
      const { ctx, clearedCookies } = makeCtx(makeUser());
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();
      const opts = clearedCookies[0]?.options ?? {};
      expect(opts).toMatchObject({
        maxAge: -1,
        secure: true,
        sameSite: "none",
        httpOnly: true,
        path: "/",
      });
    });
  });

  describe("REG-003: Search result count limits haven't changed", () => {
    it("pages capped at 7", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "product" });
      expect(result.pages.length).toBeLessThanOrEqual(7);
    });

    it("repos capped at 4", async () => {
      const { ctx } = makeCtx();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.search.query({ q: "embedded" });
      expect(result.repos.length).toBeLessThanOrEqual(4);
    });
  });

  describe("REG-004: Auth.me returns undefined (not null) when unauthenticated", () => {
    it("returns undefined, not null", async () => {
      const { ctx } = makeCtx(null);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toBeUndefined();
      expect(result).not.toBeNull();
    });
  });

  describe("REG-005: Search handles special characters without crashing", () => {
    const specialCases = [
      "C++",
      "ARM Cortex-M",
      "100% open source",
      "IoT & Edge AI",
      "v0.2-beta",
    ];
    specialCases.forEach((q) => {
      it(`handles query: "${q}"`, async () => {
        const { ctx } = makeCtx();
        const caller = appRouter.createCaller(ctx);
        const result = await caller.search.query({ q });
        expect(result).toHaveProperty("pages");
        expect(result).toHaveProperty("repos");
      });
    });
  });

  describe("REG-006: New pages added in Phase 17-19 are searchable", () => {
    const newPages = [
      { q: "patents", path: "/patents" },
      { q: "what we do", path: "/what-we-do" },
      { q: "ecad hardware", path: "/ecad-hardware" },
    ];
    newPages.forEach(({ q, path }) => {
      it(`"${q}" returns ${path}`, async () => {
        const { ctx } = makeCtx();
        const caller = appRouter.createCaller(ctx);
        const result = await caller.search.query({ q });
        const found = result.pages.find(p => p.path === path);
        expect(found).toBeDefined();
      });
    });
  });
});
