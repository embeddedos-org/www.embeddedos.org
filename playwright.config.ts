import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 42200);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      // devices["iPhone SE"] defaults to WebKit; pin Chromium so the suite runs
      // with only the Chromium browser installed. The viewport, touch support
      // and device scale factor are what these tests actually exercise.
      name: "mobile",
      use: { ...devices["iPhone SE"], browserName: "chromium" },
      testMatch: /(ui-ux|smoke)\.spec\.ts/,
    },
  ],
  // Serve the real production build, so e2e exercises what actually ships:
  // prerendered HTML, the storage proxy and the real 404 handler.
  webServer: {
    command: `NODE_ENV=production PORT=${PORT} node dist/index.js`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
