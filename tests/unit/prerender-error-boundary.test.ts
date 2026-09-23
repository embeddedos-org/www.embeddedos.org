/**
 * Unit tests for the prerenderer's ErrorBoundary detection.
 *
 * Issue: a route that crashes into the React ErrorBoundary used to prerender
 * as a "successful" snapshot — the error screen shipped as the route's HTML.
 * `shippedErrorBoundary` scans each snapshot for the boundary fallback's
 * marker and the prerenderer fails the build on a match.
 */
// @ts-expect-error - plain .mjs script, no type declarations
import {
  shippedErrorBoundary,
  ERROR_BOUNDARY_MARKER,
} from "../../scripts/prerender.mjs";
import { describe, expect, it } from "vitest";

// Mirrors what client/src/components/ErrorBoundary.tsx renders when a route
// throws: the heading plus the "Reload Page" button and the stack <pre>.
const ERROR_SCREEN = `<!doctype html><html lang="en"><head>
<title>EmbeddedOS — The Operating System for Every Device</title>
</head><body><div id="root"><div class="flex items-center justify-center min-h-screen p-8 bg-background">
<div class="flex flex-col items-center w-full max-w-2xl p-8">
<svg class="lucide lucide-triangle-alert" width="48" height="48"></svg>
<h2 class="text-xl mb-4">An unexpected error occurred.</h2>
<div class="p-4 w-full rounded bg-muted overflow-auto mb-6">
<pre class="text-sm text-muted-foreground whitespace-break-spaces">Error: something broke
    at BrokenPage (app.js:1:1)</pre>
</div>
<button>Reload Page</button>
</div></div></div></body></html>`;

// A healthy snapshot: real page content, navbar/footer shell, no error copy.
const HEALTHY_PAGE = `<!doctype html><html lang="en"><head>
<title>About | EmbeddedOS Foundation</title>
<meta name="description" content="The Embedded Operating Systems Research Foundation" />
</head><body><div id="root"><header>nav</header><main>
<h1>About the Foundation</h1>
<p>EmbeddedOS is a 501(c)(3) nonprofit foundation building an open-source
operating system for embedded devices.</p>
<p>We document everything openly and publish our research for the public benefit.</p>
</main><footer>footer</footer></div></body></html>`;

describe("shippedErrorBoundary", () => {
  it("flags HTML containing the ErrorBoundary fallback marker", () => {
    expect(shippedErrorBoundary(ERROR_SCREEN)).toBe(true);
  });

  it("flags the marker on its own, without the surrounding fallback markup", () => {
    expect(shippedErrorBoundary(`<h2>${ERROR_BOUNDARY_MARKER}</h2>`)).toBe(
      true
    );
  });

  it("does not flag a healthy page snapshot", () => {
    expect(shippedErrorBoundary(HEALTHY_PAGE)).toBe(false);
  });

  it("does not flag an empty shell or the pristine SPA shell", () => {
    expect(
      shippedErrorBoundary(
        `<!doctype html><html><head><title>x</title></head>` +
          `<body><div id="root"></div></body></html>`
      )
    ).toBe(false);
  });

  it("does not flag docs-style prose that merely mentions errors", () => {
    const docsProse =
      `<main><h1>Debugging guide</h1>` +
      `<p>If an error occurs while flashing firmware, check the serial ` +
      `output. Common causes include a bad cable or a mismatched baud rate.</p></main>`;
    expect(docsProse).not.toContain(ERROR_BOUNDARY_MARKER);
    expect(shippedErrorBoundary(docsProse)).toBe(false);
  });
});
