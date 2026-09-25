/**
 * Fail CI when the `deploy` branch has drifted from what the build produces.
 *
 * The deploy branch is an orphan branch whose root must be exactly the
 * contents of dist/public; scripts/deploy-branch.mjs replaces it wholesale
 * from a fresh build. Doing it by hand once broke it (.htaccess was added to
 * the branch directly and the next rebuild silently dropped it), so this
 * check diffs the branch tree against the current build and fails on files
 * the build could never have produced.
 *
 * Two drift classes are expected and only warn:
 *   - lag: the build has files the branch does not (the deploy is manual, so
 *     the branch legitimately trails master between deploys);
 *   - removed routes: the branch still serves index.html for routes the
 *     current App.tsx no longer declares (cleaned up by the next deploy).
 *
 * Content-hashed output (assets/, media/) is compared by presence only in the
 * warn direction: filenames change every build, so a stale hash on the
 * branch is lag, never evidence of a hand edit.
 *
 * Usage: node scripts/check-deploy-drift.mjs [--ref=origin/deploy]
 * Exits 0 when the branch is missing (nothing deployed yet) or only the
 * expected classes are found; exits 1 on unexpected files.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { discoverRoutes } from "./discover-routes.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const refArg = process.argv.find(a => a.startsWith("--ref="));
const REF = refArg ? refArg.slice("--ref=".length) : "origin/deploy";

// Directories whose filenames are content hashes: stale entries here are lag.
const HASHED_DIRS = ["assets/", "media/"];

function walk(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full, rel));
    else if (e.isFile() || e.isSymbolicLink()) out.push(rel);
  }
  return out;
}

function deployTree(ref) {
  try {
    const out = execFileSync("git", ["ls-tree", "-r", "--name-only", ref], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

function routeForIndexHtml(rel) {
  // "about/index.html" -> "/about"; "index.html" -> "/"
  if (rel === "index.html") return "/";
  const m = rel.match(/^(.*)\/index\.html$/);
  return m ? `/${m[1]}` : null;
}

function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error(
      `[deploy-drift] no build at ${DIST} — run "pnpm build" first.`
    );
    process.exit(1);
  }
  const branchFiles = deployTree(REF);
  if (!branchFiles) {
    console.log(
      `[deploy-drift] ref ${REF} not found — nothing deployed yet, skipping.`
    );
    return;
  }

  const buildFiles = new Set(walk(DIST));
  const branchSet = new Set(branchFiles);
  const routes = new Set(discoverRoutes());

  const inHashedDir = f => HASHED_DIRS.some(d => f.startsWith(d));
  const unexpected = [];
  const removedRoutes = [];
  for (const f of branchFiles) {
    if (buildFiles.has(f)) continue;
    if (inHashedDir(f)) continue; // stale hash: lag, handled below
    const route = routeForIndexHtml(f);
    if (route && !routes.has(route)) {
      removedRoutes.push(f);
      continue;
    }
    unexpected.push(f);
  }
  const lag = [...buildFiles].filter(f => !branchSet.has(f) && !inHashedDir(f));

  if (removedRoutes.length) {
    console.log(
      `[deploy-drift] WARN ${removedRoutes.length} file(s) on ${REF} belong to routes App.tsx no longer declares (cleared by the next deploy):`
    );
    for (const f of removedRoutes.slice(0, 10)) console.log(`  ${f}`);
    if (removedRoutes.length > 10)
      console.log(`  … ${removedRoutes.length - 10} more`);
  }
  if (lag.length) {
    console.log(
      `[deploy-drift] WARN ${lag.length} build file(s) are not on ${REF} yet (deploy lags the build):`
    );
    for (const f of lag.slice(0, 10)) console.log(`  ${f}`);
    if (lag.length > 10) console.log(`  … ${lag.length - 10} more`);
  }
  if (unexpected.length) {
    console.error(
      `[deploy-drift] FAIL ${unexpected.length} file(s) on ${REF} are not produced by the build:`
    );
    for (const f of unexpected) console.error(`  ${f}`);
    console.error(
      `[deploy-drift] The deploy branch must be exactly the build output — ` +
        `remove these with scripts/deploy-branch.mjs, never by hand.`
    );
    process.exit(1);
  }
  console.log(
    `[deploy-drift] ${REF} has no unexpected files ` +
      `(${removedRoutes.length} removed-route, ${lag.length} lagging — both expected).`
  );
}

main();
