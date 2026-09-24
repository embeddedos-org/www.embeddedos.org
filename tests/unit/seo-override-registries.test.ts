/**
 * The prerenderer's SEO meta-description overrides hardcode two registry
 * values: the Foundation EIN and the public repository count.
 *
 * DESCRIPTION_OVERRIDES in scripts/prerender.mjs is a deliberate copy of the
 * client-side table in client/src/lib/page-meta.ts (the copy contract is
 * enforced by tests/unit/page-meta.test.ts), so tying the prerenderer's copy
 * to the registries covers both. If the EIN or the repo count changes in
 * client/src/data/foundation.ts or shared/stack-data.ts, the override strings
 * must change with them — this test fails until they do, instead of letting
 * the metadata drift silently.
 */
import { describe, expect, it } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import { DESCRIPTION_OVERRIDES } from "../../scripts/prerender.mjs";
import { FOUNDATION } from "../../client/src/data/foundation";
import { STACK } from "../../shared/stack-data";

describe("seo meta-description overrides track the registries", () => {
  it("states the current EIN from the foundation registry", () => {
    const ein = FOUNDATION.ein;
    expect(ein).toMatch(/^\d{2}-\d{7}$/);
    for (const route of ["/donate", "/about"]) {
      const description: string = DESCRIPTION_OVERRIDES[route];
      expect(description, `${route} override must carry EIN ${ein}`).toContain(
        ein
      );
    }
  });

  it("states the current public repository count from the stack registry", () => {
    const count: number = STACK.totals.repositories;
    const description: string = DESCRIPTION_OVERRIDES["/projects"];
    expect(
      description,
      `/projects override must start with the registry count ${count}`
    ).toMatch(new RegExp(`^${count} open-source repositor(y|ies)`));
  });

  it("keeps the override routes themselves stable", () => {
    // A renamed override route silently drops back to the fallback
    // description; the registry test above would then pass vacuously.
    for (const route of ["/donate", "/about", "/projects"]) {
      expect(
        DESCRIPTION_OVERRIDES[route],
        `override for ${route}`
      ).toBeTruthy();
    }
  });
});
