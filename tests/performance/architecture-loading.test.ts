import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const readSource = (file: string) =>
  fs.readFileSync(path.join(ROOT, file), "utf8");

const HOME = readSource("client/src/pages/Home.tsx");
const HERO = readSource("client/src/components/CadEvolutionHero.tsx");
const SCENE = readSource("client/src/components/CadEvolutionScene.tsx");
const VITE_CONFIG = readSource("vite.config.ts");

describe("architecture visualization loading", () => {
  it("keeps the semantic wrapper eager and the Three.js canvas lazy", () => {
    // The page code-splits the whole hero; the hero code-splits the 3D scene.
    expect(HOME).toMatch(
      /lazy\(\s*\(\)\s*=>\s*import\("\.\.\/components\/CadEvolutionHero"\)/
    );
    expect(HERO).toMatch(
      /lazy\(\s*\(\)\s*=>\s*import\("\.\/CadEvolutionScene"\)/
    );
    // The eager wrapper must not pull Three.js into the initial chunk.
    expect(HERO).not.toMatch(/@react-three|from ["']three["']/);
    // The lazy scene is where the 3D stack lives.
    expect(SCENE).toContain('from "@react-three/fiber"');
    expect(SCENE).toContain('from "three"');
  });

  it("uses deterministic geometry and leaves Three.js out of manual chunks", () => {
    expect(`${HERO}\n${SCENE}`).not.toContain("Math.random");
    expect(VITE_CONFIG).not.toMatch(/manualChunks[\s\S]*["']three["']/);
  });

  it("checks WebGL and falls back if the renderer context is lost", () => {
    expect(HERO).toContain("supportsWebGL()");
    expect(HERO).toContain("onRendererUnavailable");
    expect(HERO).toContain("3D preview unavailable on this device");
    expect(SCENE).toContain("webglcontextlost");
  });
});
