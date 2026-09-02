import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  // tsconfig sets jsx: "preserve" because Vite's React plugin handles the
  // transform during a real build. Vitest does not load that plugin, so
  // component tests need the automatic runtime declared here — otherwise JSX
  // compiles to React.createElement and fails with "React is not defined",
  // since the app uses the automatic runtime and imports no React.
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "tests/**/*.test.ts",
      // Component tests are .tsx and opt into jsdom with a
      // `@vitest-environment` docblock, so the default stays "node" and
      // the existing suites keep running without a DOM they do not need.
      "tests/**/*.test.tsx",
    ],
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
