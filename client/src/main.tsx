import { createRoot } from "react-dom/client";
import App, { preloadRoute } from "./App";
import "./index.css";

// NOTE (F-07): this entry used to wrap <App/> in the tRPC + react-query +
// superjson stack (@trpc/client, @trpc/react-query, @tanstack/react-query).
// That stack is dead weight in production: AGENTS.md itself says "Do not
// assume a server process or /api/trpc exists in production", the only
// client reference was a doc comment in an unimported component, and the
// contact/careers forms POST to the PHP endpoints directly. It has been
// removed from the entry so ~100 KB raw never downloads, parses or compiles
// on any page load. The dev/test server (server/) still uses tRPC — that is
// a separate bundle (pnpm build:server), untouched by this change.

const container = document.getElementById("root")!;

// `pnpm prerender` writes real HTML into #root for all 92 routes, and every
// route except "/" is code-split. Mounting React before the route's chunk has
// arrived costs ~300ms of blank <main>: the Suspense fallback replaces the
// prerendered markup with a spinner while the chunk downloads.
//
// The fix is to await the matching chunk before mounting. Until it resolves
// nothing touches the DOM, so the prerendered HTML stays on screen, and React
// then replaces it with the real page in one step. preloadRoute() resolves
// immediately for "/" and for any path that is not code-split, so this costs
// nothing on those routes.
//
// hydrateRoot was tried here and rejected on evidence: the prerenderer snapshots
// a live browser (`page.content()`), so the markup carries client-only state
// (theme class, generated ids, framer-motion inline styles) and none of React's
// Suspense boundary markers. Hydration failed with React error #418 on every
// route and fell back to a client render — the blank window came back, now with
// errors on top. createRoot is the honest choice for snapshot-prerendered HTML.
void preloadRoute(window.location.pathname).then(() => {
  createRoot(container).render(<App />);
});
