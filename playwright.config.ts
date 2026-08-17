import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 42200);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /**
   * Four under CI, not one.
   *
   * A single worker serialises ~1,000 CPU-seconds of real browser work into
   * about 17 minutes, which no longer fits any sane gate: the verification gate
   * skipped e2e entirely at its 257s per-check timeout and then ran out of its
   * 780s total budget before the performance tests, so two categories reported
   * nothing at all. Four workers put the same 370 tests at ~3m40s, measured.
   *
   * This changes concurrency, never coverage — the same tests run with the same
   * assertions. Retries stay at 2, so genuine order-dependence still surfaces
   * rather than being hidden. The one suite with a documented parallel-flake
   * problem, link-destinations, is opt-in and skipped unless LINK_SWEEP is set;
   * run that one with --workers=1, which is how its 83/83 pass was obtained.
   *
   * Bounded rather than unlimited: this machine has 8 cores, and leaving
   * headroom keeps the timing-sensitive checks from competing with the
   * webServer for CPU.
   */
  workers: process.env.CI ? 4 : undefined,
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
