import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App, { preloadRoute } from "./App";
import { startLogin } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  startLogin();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

const container = document.getElementById("root")!;

const tree = (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

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
  createRoot(container).render(tree);
});
