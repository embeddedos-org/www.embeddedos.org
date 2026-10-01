import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

// scripts/deploy-branch.mjs publishes dist/public as-is. It must refuse a
// dist/ that was not built from the commit being published: on 2026-10-01 a
// stale dist/ went out labelled as a fresh master build.
const SCRIPT = path.resolve(__dirname, "../../scripts/deploy-branch.mjs");

function repoWithBuild(stamp: ((head: string) => object) | null) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deploy-stamp-"));
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
  git("init", "-q");
  git("config", "user.email", "t@example.invalid");
  git("config", "user.name", "t");
  fs.mkdirSync(path.join(dir, "scripts"));
  fs.copyFileSync(SCRIPT, path.join(dir, "scripts", "deploy-branch.mjs"));
  fs.writeFileSync(path.join(dir, ".gitignore"), "dist/\n");
  git("add", "-A");
  git("commit", "-q", "-m", "init");
  fs.mkdirSync(path.join(dir, "dist", "public"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "dist", "public", "index.html"),
    "<html></html>"
  );
  if (stamp) {
    fs.writeFileSync(
      path.join(dir, "dist", "build-stamp.json"),
      JSON.stringify(stamp(git("rev-parse", "HEAD")))
    );
  }
  return dir;
}

const run = (dir: string) =>
  spawnSync("node", [path.join(dir, "scripts", "deploy-branch.mjs")], {
    cwd: dir,
    encoding: "utf8",
  });

describe("deploy-branch refuses builds it cannot attribute", () => {
  it("refuses a dist/ with no build stamp", () => {
    const r = run(repoWithBuild(null));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("build-stamp.json is missing");
  });

  it("refuses a dist/ built from a different commit", () => {
    const r = run(
      repoWithBuild(() => ({ commit: "0".repeat(40), dirty: false }))
    );
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("was built from 00000000, but HEAD is");
  });

  it("refuses a dist/ built from a dirty tree", () => {
    const r = run(repoWithBuild(head => ({ commit: head, dirty: true })));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("uncommitted changes");
  });

  it("gets past the stamp check when the stamp matches HEAD", () => {
    const r = run(repoWithBuild(head => ({ commit: head, dirty: false })));
    // It then fails later, on purpose, because this fake build has no
    // prerendered routes, which proves the stamp check let it through.
    expect(r.stderr).not.toContain("build-stamp");
    expect(r.stderr).toContain("prerendered routes");
  });
});
