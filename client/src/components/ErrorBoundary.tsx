import { cn } from "@/lib/utils";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Chunk-load failures happen when a new deployment invalidates the hashed JS
// chunks the open page references (or a CDN hiccups mid-download): the app
// shell is fine, the page just needs one fresh load to pick up the new
// files. Auto-reloading on every such error would loop forever if the chunk
// is genuinely missing, so the reload is offered exactly once per session.
const CHUNK_LOAD_PATTERN =
  /loading chunk|chunkloaderror|failed to fetch dynamically imported module|importing a module script failed/i;
const CHUNK_RELOAD_KEY = "eos-chunk-reload-attempted";

function isChunkLoadError(error: Error | null): boolean {
  if (!error) return false;
  return CHUNK_LOAD_PATTERN.test(
    `${error.name} ${error.message} ${error.stack ?? ""}`
  );
}

function chunkReloadAttempted(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
  } catch {
    return false;
  }
}

function markChunkReloadAttempted(): void {
  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  } catch {
    // Storage unavailable (private mode): the one-shot guard degrades to a
    // plain reload offer rather than throwing inside the fallback UI.
  }
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const chunkError = isChunkLoadError(this.state.error);
      // Once the one-shot reload has been used, never offer it again —
      // that is the loop guard.
      const canOfferReload = !chunkError || !chunkReloadAttempted();
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            {/* NOTE: this exact heading is the prerenderer's
                ERROR_BOUNDARY_MARKER (scripts/prerender.mjs) — it must stay
                byte-identical in every fallback branch. */}
            <h2 className="text-xl mb-4">An unexpected error occurred.</h2>

            {chunkError && (
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                {canOfferReload
                  ? "The site was likely updated while this page was open, so part of it failed to load. Reload once to pick up the latest files."
                  : "Reloading didn't fix it — the update may still be propagating. Head back home and try again in a moment."}
              </p>
            )}

            {/* Stack traces are a development aid, never production output. */}
            {import.meta.env.DEV && this.state.error?.stack && (
              <div className="p-4 w-full rounded bg-muted overflow-auto mb-6">
                <pre className="text-sm text-muted-foreground whitespace-break-spaces">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              {canOfferReload && (
                <button
                  onClick={() => {
                    if (chunkError) markChunkReloadAttempted();
                    window.location.reload();
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                    "bg-primary text-primary-foreground",
                    "hover:opacity-90 cursor-pointer"
                  )}
                >
                  <RotateCcw size={16} />
                  Reload Page
                </button>
              )}
              <a
                href="/"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "border border-input bg-background",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Home size={16} />
                Back to home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
