import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  ARCHITECTURE_STAGES,
  EAI_EDGE_PROFILE,
  MATURITY_STATUSES,
} from "../../client/src/data/architecture";

const ROOT = path.resolve(import.meta.dirname, "../..");
const HOME_SOURCE = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Home.tsx"),
  "utf8"
);
const WHAT_WE_DO_SOURCE = fs.readFileSync(
  path.join(ROOT, "client/src/pages/WhatWeDo.tsx"),
  "utf8"
);
const compact = (source: string) => source.replace(/\s+/g, " ");

describe("architecture truth model", () => {
  it("keeps the approved maturity vocabulary exact", () => {
    expect(MATURITY_STATUSES).toEqual([
      "Shipped profile",
      "Available project",
      "Experimental / Research",
      "Planned",
      "Design / Concept",
    ]);
    expect(
      ARCHITECTURE_STAGES.every(stage =>
        MATURITY_STATUSES.includes(stage.maturity)
      )
    ).toBe(true);
  });

  it("orders the physical-device stages from sensing through feedback", () => {
    expect(ARCHITECTURE_STAGES.map(stage => stage.label)).toEqual([
      "Hardware / sensors",
      "Secure boot",
      "EoS kernel / drivers",
      "IPC / data / storage",
      "Applications",
      "On-device AI",
      "Physical action / feedback",
    ]);
    expect(new Set(ARCHITECTURE_STAGES.map(stage => stage.id)).size).toBe(
      ARCHITECTURE_STAGES.length
    );
  });

  it("records the shipped eAI Edge profile without upgrading stage maturity", () => {
    expect(EAI_EDGE_PROFILE).toMatchObject({
      name: "eAI Edge",
      maturity: "Shipped profile",
      sequence: ["eNI", "eIPC", "eAI"],
    });
    expect(
      ARCHITECTURE_STAGES.find(stage => stage.id === "on-device-ai")?.maturity
    ).toBe("Experimental / Research");
  });

  it("places AGI in the research horizon without claiming it is achieved", () => {
    const aiStage = ARCHITECTURE_STAGES.find(
      stage => stage.id === "on-device-ai"
    );
    expect(aiStage?.maturity).toBe("Experimental / Research");
    expect(aiStage?.products).toContain("AGI research");
    expect(aiStage?.description).toContain(
      "no AGI system is claimed as achieved"
    );
  });
});

describe("narrative hierarchy", () => {
  it("puts the primary Home positioning before its support and campaign", () => {
    const home = compact(HOME_SOURCE);
    const heading =
      "Open-source embedded systems for intelligent physical devices";
    const support =
      "From open hardware and secure boot to a real-time OS, developer tools, and on-device AI.";
    const campaign = "Open infrastructure for physical AI.";

    expect(home).toContain(`<h1 id="hero-heading"`);
    expect(home).toContain(heading);
    expect(home).toContain(support);
    expect(home).toContain(campaign);
    expect(home.indexOf(heading)).toBeLessThan(home.indexOf(support));
    expect(home.indexOf(support)).toBeLessThan(home.indexOf(campaign));
    expect(home).toContain(
      "No achieved AGI system is claimed as available today"
    );
    expect(compact(WHAT_WE_DO_SOURCE)).toContain(
      "artificial general intelligence (AGI) research"
    );
  });

  it("labels architecture views as illustrative and maturity-specific", () => {
    const home = compact(HOME_SOURCE);
    const whatWeDo = compact(WHAT_WE_DO_SOURCE);

    expect(home).toContain("An Illustrative Reference Architecture");
    expect(home).toContain("planned elements are not yet available products");
    expect(whatWeDo).toContain("Architecture by Maturity");
    expect(whatWeDo).toContain(
      "not a claim that every stage is available as one production system"
    );
  });

  it("does not restore the previous complete or universal assertions", () => {
    expect(WHAT_WE_DO_SOURCE).not.toMatch(/complete software stack/i);
    expect(WHAT_WE_DO_SOURCE).not.toMatch(/complete solutions/i);
    expect(WHAT_WE_DO_SOURCE).not.toMatch(/Every line of code/i);
    expect(WHAT_WE_DO_SOURCE).not.toMatch(/powering every device category/i);
  });
});
