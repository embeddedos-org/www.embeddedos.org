/** @vitest-environment jsdom */

/**
 * A first load arrives at the served URL, which ends in a slash
 * (/thank-you/application/), while the preload registry is keyed by the
 * declared route (/thank-you/application). The lookup used the raw pathname,
 * so a preloaded alias route missed its component and showed the spinner over
 * the prerendered page before the real one replaced it.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App, { preloadRoute, routeKey } from "../../client/src/App";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("route preload keys", () => {
  it("strips trailing slashes and keeps the root", () => {
    expect(routeKey("/thank-you/application/")).toBe("/thank-you/application");
    expect(routeKey("/about")).toBe("/about");
    expect(routeKey("/")).toBe("/");
  });

  it("mounts a preloaded alias route at once when the URL has a slash", async () => {
    window.history.replaceState({}, "", "/thank-you/application/");
    await preloadRoute("/thank-you/application/");
    render(<App />);
    // Synchronously: no Suspense fallback in between.
    expect(
      screen.getByRole("heading", { level: 1, name: "Application received" })
    ).toBeInTheDocument();
  });
});
