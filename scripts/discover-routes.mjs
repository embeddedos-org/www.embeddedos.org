/**
 * Route discovery for build scripts.
 *
 * Dependency-free on purpose: scripts/check-deploy-drift.mjs runs in a CI
 * job with no node_modules installed, so this module must not import
 * anything beyond node builtins. scripts/prerender.mjs re-exports these
 * helpers so its existing importers keep working.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP_TSX = path.join(ROOT, "client", "src", "App.tsx");

/**
 * Strip JS/JSX comments from source before route scraping.
 *
 * discoverRoutes() and the route-preload sync test find routes with a regex
 * over `<Route path="...">` literals. A commented-out route — or the standing
 * instruction in App.tsx not to write a Route literal in a comment — would
 * otherwise be scraped as a real route, and the build would try to prerender
 * a page that does not exist. The scan is string-aware so `//` inside string
 * literals (e.g. "https://…") is preserved; template-literal interpolations
 * are treated as opaque, which is fine for the route-declaration region of
 * App.tsx.
 */
export function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      out += c;
      i++;
      while (i < n) {
        const d = src[i];
        out += d;
        i++;
        if (d === "\\") {
          if (i < n) {
            out += src[i];
            i++;
          }
        } else if (d === quote) {
          break;
        }
      }
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Read every literal `<Route path="...">` out of App.tsx. */
export function discoverRoutes() {
  const src = stripComments(fs.readFileSync(APP_TSX, "utf8"));
  const found = [...src.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1]);
  const routes = new Set(["/"]);
  for (const r of found) {
    // Skip parameterised/wildcard routes — they have no single static output.
    if (!r.startsWith("/") || r.includes(":") || r.includes("*")) continue;
    routes.add(r);
  }
  if (routes.size < 10) {
    throw new Error(
      `Only ${routes.size} routes discovered in App.tsx — the <Route path="..."> ` +
        `pattern probably changed. Refusing to emit a near-empty prerender.`
    );
  }
  return [...routes];
}
