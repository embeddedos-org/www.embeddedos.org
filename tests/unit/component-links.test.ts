import { describe, it, expect } from "vitest";
import {
  componentRouteFor,
  splitRelationship,
} from "../../client/src/lib/component-links";
import { ECOSYSTEM } from "../../client/src/data/ecosystem";

const KNOWN = [
  "EIPC",
  "EoS Kernel",
  "eBoot",
  "eBoot (eBootloader)",
  "eBuild",
  "eDB",
  "eAI",
  "eNI",
  "EoSim",
  "EoStudio",
  "eOffice",
  "eFlow",
];

const NOT_COMPONENTS = [
  "CI/CD pipelines",
  "ROM bootloader",
  "All EoS developers",
  "End users",
  "eHealth365",
  "OTA update system",
  "eVault (eOffice)",
  "eAI Edge Stack",
  "eNI edge stack",
  "eOffice Suite",
  "Hardware BSP",
  "Students",
];

describe("splitRelationship", () => {
  it("separates the entity from its explanation", () => {
    expect(splitRelationship("eDB — app data storage")).toEqual({
      head: "eDB",
      rest: " — app data storage",
    });
  });

  it("treats a string with no separator as all entity", () => {
    expect(splitRelationship("eDB")).toEqual({ head: "eDB", rest: "" });
  });
});

describe("componentRouteFor", () => {
  it.each(KNOWN)("resolves %s to a page the ecosystem graph records", head => {
    const route = componentRouteFor(head);
    expect(route).toBeTruthy();
    expect(ECOSYSTEM.map(c => c.sitePage)).toContain(route);
  });

  it.each(NOT_COMPONENTS)("refuses to link %s, which is not a component", h => {
    expect(componentRouteFor(h)).toBeNull();
  });

  it("links nothing the ecosystem graph has no page for", () => {
    const unroutable = ECOSYSTEM.filter(c => !c.sitePage).map(c => c.name);
    for (const name of unroutable) expect(componentRouteFor(name)).toBeNull();
  });
});
