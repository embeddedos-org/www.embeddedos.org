import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const readSource = (file: string) =>
  fs.readFileSync(path.join(ROOT, file), "utf8");

const HOME = readSource("client/src/pages/Home.tsx");
const HOLOGRAM = readSource("client/src/components/HeroTechStack.tsx");
const CANVAS = readSource(
  "client/src/components/ArchitectureHologramCanvas.tsx"
);
const VITE_CONFIG = readSource("vite.config.ts");

describe("architecture visualization loading", () => {
  it("keeps the semantic wrapper eager and the Three.js canvas lazy", () => {
    expect(HOME).toContain(
      'import HeroTechStack from "../components/HeroTechStack"'
    );
    expect(HOLOGRAM).toMatch(
      /lazy\(\s*\(\)\s*=>\s*import\("\.\/ArchitectureHologramCanvas"\)/
    );
    expect(HOLOGRAM).not.toMatch(/@react-three|from ["']three["']/);
    expect(CANVAS).toContain('from "@react-three/fiber"');
    expect(CANVAS).toContain('from "three"');
  });

  it("uses deterministic geometry and leaves Three.js out of manual chunks", () => {
    expect(`${HOLOGRAM}\n${CANVAS}`).not.toContain("Math.random");
    expect(VITE_CONFIG).not.toMatch(/manualChunks[\s\S]*["']three["']/);
  });

  it("checks WebGL and falls back if the renderer context is lost", () => {
    expect(HOLOGRAM).toContain("supportsWebGL()");
    expect(HOLOGRAM).toContain("webGLAvailable ?");
    expect(HOLOGRAM).toContain("architecture-static-fallback");
    expect(HOLOGRAM).toContain("onRendererUnavailable");
    expect(CANVAS).toContain("webglcontextlost");
  });
});
