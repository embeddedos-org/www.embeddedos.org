import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// Dev-only tooling (jsx source locations) must never reach the public build.
const devOnlyPlugins = [jsxLocPlugin()];

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(command === "serve" ? devOnlyPlugins : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Split only the vendors that are genuinely eager (react/router, and
    // framer-motion which 85 modules import statically) out of the entry chunk.
    //
    // Do NOT add three/@react-three or recharts here: they are reached only
    // through React.lazy boundaries, and naming them in manualChunks promotes
    // them into the entry's static graph, which makes Vite emit a
    // <link rel="modulepreload"> for the 1.1 MB three.js chunk on every page.
    rollupOptions: {
      output: {
        // Function form: the object form does exact module-id matching, so
        // "react-dom" matched react-dom/index.js but NOT react-dom/client.js
        // (imported by main.tsx) — 6 react-dom modules sat in the entry
        // while 5 sat in vendor-react (F-14). Matching on the package path
        // keeps the whole package in its vendor chunk.
        //
        // F-17: gsap/@gsap are deliberately NOT listed here. They were the
        // only static gsap consumer's dependency (Home.tsx) yet rode in
        // vendor-motion, modulepreloaded on all 131 pages. Home now imports
        // gsap dynamically, so it ships as its own async chunk loaded only
        // on the homepage.
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/wouter/")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-motion";
          }
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
