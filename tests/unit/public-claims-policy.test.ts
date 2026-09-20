import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(ROOT, relativePath), "utf8");

const PUBLIC_SOURCES = [
  "client/index.html",
  "client/src/components/HealthShowcase.tsx",
  "client/src/components/Navbar.tsx",
  "client/src/data/article-bodies.ts",
  "client/src/data/category-about.ts",
  "client/src/data/content.ts",
  "client/src/data/programme-details.ts",
  "client/src/pages/Aerospace.tsx",
  "client/src/pages/ApiDocs.tsx",
  "client/src/pages/Architecture.tsx",
  "client/src/pages/Books.tsx",
  "client/src/pages/Downloads.tsx",
  "client/src/pages/EAI.tsx",
  "client/src/pages/EAIEdge.tsx",
  "client/src/pages/ENI.tsx",
  "client/src/pages/ERadar360.tsx",
  "client/src/pages/EcadHardware.tsx",
  "client/src/pages/Ecosystem.tsx",
  "client/src/pages/EHealth365.tsx",
  "client/src/pages/HardwareLab.tsx",
  "client/src/pages/Health.tsx",
  "client/src/pages/HealthCompare.tsx",
  "client/src/pages/Home.tsx",
  "client/src/pages/NeuralLinkAI.tsx",
  "client/src/pages/ProductEAI.tsx",
  "client/src/pages/ProductENI.tsx",
  "client/src/pages/ProductEoS.tsx",
  "client/src/pages/Products.tsx",
  "client/src/pages/Stacks.tsx",
  "client/src/pages/WhatWeDo.tsx",
] as const;

const publicSources = PUBLIC_SOURCES.map(file => ({ file, text: read(file) }));

function offenders(pattern: RegExp): string[] {
  return publicSources
    .filter(({ text }) => pattern.test(text))
    .map(({ file }) => file);
}

describe("critical public claim policy", () => {
  it("keeps retired false and unsupported strings out of public sources", () => {
    const retired = [
      /sub-microsecond latency/i,
      /4-bit quantization fits a 7B parameter model on 4MB of RAM/i,
      /4MB \(7B 4-bit\)/i,
      /processes 1,024 channels in <500[μµ]s/i,
      /7B[^\n]{0,80}4.?bit[^\n]{0,80}4\s*MB|4\s*MB[^\n]{0,80}7B/i,
      /full documentation complete for all major markets/i,
      /open-source medical-grade hardware covering ~95%/i,
    ];

    for (const pattern of retired) {
      expect(offenders(pattern), `public sources matching ${pattern}`).toEqual(
        []
      );
    }
  });

  it("states neural channel and sample rates as configuration-specific", () => {
    for (const file of [
      "client/src/pages/EAI.tsx",
      "client/src/pages/ENI.tsx",
      "client/src/pages/NeuralLinkAI.tsx",
      "client/src/pages/ProductENI.tsx",
    ]) {
      expect(read(file).replace(/\s+/g, " "), file).toMatch(
        /channel count and sample rate depend on the acquisition hardware and configuration/i
      );
    }
  });

  it("labels concept and simulated health, aerospace, and radar presentations", () => {
    expect(read("client/src/pages/Health.tsx")).toContain(
      "Illustrative 3D Concept"
    );
    expect(read("client/src/components/HealthShowcase.tsx")).toContain(
      "Simulated Signal"
    );
    expect(read("client/src/pages/EHealth365.tsx")).toContain(
      "Simulated Concept Data"
    );
    expect(read("client/src/pages/Aerospace.tsx")).toContain(
      "Concept 3D Render"
    );
    expect(read("client/src/pages/Aerospace.tsx")).toContain(
      "Simulated Flight Telemetry"
    );
    expect(read("client/src/pages/ERadar360.tsx")).toContain(
      "Illustrative Radar Simulation"
    );
    expect(read("client/src/pages/ERadar360.tsx")).toContain(
      "Simulated Alert Feed"
    );

    expect(read("client/src/pages/EcadHardware.tsx")).not.toMatch(
      /status:\s*"Production"/
    );
    expect(read("client/src/pages/EcadHardware.tsx")).toContain(
      "Target standards:"
    );
    expect(read("client/src/pages/HealthCompare.tsx")).not.toMatch(
      /status:\s*"Patent Pending"/
    );
  });

  it("keeps analytics and donation policy consistent with the shipped boundary", () => {
    const index = read("client/index.html");
    const privacy = read("client/src/pages/Privacy.tsx");
    const terms = read("client/src/pages/Terms.tsx");

    expect(index).not.toMatch(
      /googletagmanager|G-VTNZKL95DQ|\bgtag\s*\(|VITE_ANALYTICS|\/umami/i
    );
    expect(privacy).toContain(
      "does not currently load a browser analytics service"
    );
    expect(privacy).toContain("Zeffy-hosted donation form");
    expect(privacy).not.toMatch(/\bStripe\b/);
    expect(terms).toContain("Zeffy-hosted donation form");
    expect(terms).toContain("does not provide tax or legal advice");
    expect(terms).not.toMatch(/\bStripe\b/);
  });
});
