/**
 * Record which commit dist/ was built from, for scripts/deploy-branch.mjs.
 *
 * The deploy script publishes whatever is in dist/public. Without this stamp
 * it had no way to tell a fresh build from a stale one: on 2026-10-01 it
 * published a dist/ left behind by an older checkout as "rebuild from master
 * 0b0628d6", and production kept serving the previous guide.
 *
 * Written to dist/build-stamp.json, outside dist/public, so it is never
 * itself deployed.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const git = args =>
  execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();

const stamp = {
  commit: git(["rev-parse", "HEAD"]),
  // Tracked changes only: an untracked scratch file does not change the build.
  dirty: git(["status", "--porcelain", "--untracked-files=no"]) !== "",
  builtAt: new Date().toISOString(),
};
fs.mkdirSync(path.join(ROOT, "dist"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "dist", "build-stamp.json"),
  JSON.stringify(stamp, null, 2) + "\n"
);
console.log(
  `[build-stamp] ${stamp.commit.slice(0, 8)}${stamp.dirty ? " (dirty)" : ""}`
);
