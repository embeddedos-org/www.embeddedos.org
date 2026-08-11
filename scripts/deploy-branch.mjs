/**
 * Publish dist/public to the `deploy` branch.
 *
 * `deploy` is an orphan branch — it shares no history with master — whose root
 * is exactly the contents of dist/public. cPanel's Git Version Control checks
 * that branch out and runs the `deployment.tasks` in .cpanel.yml, copying the
 * files into the document root.
 *
 * Doing this by hand is what broke it before: .htaccess was once added to the
 * deploy branch directly, and the next rebuild silently dropped it. This script
 * replaces the branch's contents wholesale from a fresh build, so whatever vite
 * emitted is exactly what ships — no more, no less.
 *
 *   node scripts/deploy-branch.mjs           # build the commit, stop, let you look
 *   node scripts/deploy-branch.mjs --push    # ...and push it to origin
 *
 * Pushing is opt-in on purpose: a push is the irreversible half of this, and it
 * should be a decision rather than a side effect.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const BRANCH = "deploy";
const REMOTE = "origin";

const PUSH = process.argv.includes("--push");

const git = (args, opts = {}) =>
  execFileSync("git", args, {
    cwd: opts.cwd ?? ROOT,
    encoding: "utf8",
    stdio: opts.stdio ?? ["ignore", "pipe", "pipe"],
  }).trim();

const die = msg => {
  console.error(`\n[deploy] ${msg}\n`);
  process.exit(1);
};

// ---------------------------------------------------------------------------
// Preconditions
// ---------------------------------------------------------------------------

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  die(`No build found at ${DIST}. Run "pnpm build" first.`);
}

// A prerendered build is the whole point of this branch; a bare SPA shell would
// deploy a site with no crawlable content and no per-route <title>.
const routeDirs = fs
  .readdirSync(DIST, { withFileTypes: true })
  .filter(e => e.isDirectory() && e.name !== "assets")
  .filter(e => fs.existsSync(path.join(DIST, e.name, "index.html")));
if (routeDirs.length < 50) {
  die(
    `Only ${routeDirs.length} prerendered routes in the build. Expected 90+ — ` +
      `run the full "pnpm build" (build:client -> prerender), not "pnpm build:client".`
  );
}

for (const required of [".htaccess", ".cpanel.yml"]) {
  if (!fs.existsSync(path.join(DIST, required))) {
    die(
      `${required} is missing from the build. It lives in client/public/ so vite ` +
        `copies it on every build — check it was not deleted.`
    );
  }
}

if (git(["status", "--porcelain"])) {
  die(
    "The working tree has uncommitted changes. Commit or stash them first, so " +
      "the source commit recorded in the deploy message actually describes what shipped."
  );
}

const sourceBranch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
const sourceSha = git(["rev-parse", "--short", "HEAD"]);

// ---------------------------------------------------------------------------
// Publish through a throwaway worktree, so the checkout you are sitting in is
// never switched to the deploy branch mid-run.
// ---------------------------------------------------------------------------

const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "eos-deploy-"));
let added = false;

try {
  const branchExists = (() => {
    try {
      git(["rev-parse", "--verify", `refs/heads/${BRANCH}`]);
      return true;
    } catch {
      return false;
    }
  })();

  if (branchExists) {
    git(["worktree", "add", "--force", worktree, BRANCH]);
  } else {
    git(["worktree", "add", "--force", "--orphan", "-b", BRANCH, worktree]);
  }
  added = true;

  // Clear everything the branch tracks. Removing by git rather than rm -rf keeps
  // .git out of harm's way and makes deletions show up in the diff.
  const tracked = git(["ls-files"], { cwd: worktree });
  if (tracked)
    git(["rm", "-r", "--quiet", "--ignore-unmatch", "."], { cwd: worktree });

  // dist/ is gitignored in this repo; the deploy branch needs those exact files,
  // so copy them in and add with --force.
  fs.cpSync(DIST, worktree, { recursive: true, dereference: true });

  git(["add", "--force", "--all", "."], { cwd: worktree });

  const staged = git(["status", "--porcelain"], { cwd: worktree });
  if (!staged) {
    console.log(
      `\n[deploy] ${BRANCH} already matches this build — nothing to commit.\n`
    );
  } else {
    const message = `deploy: rebuild from ${sourceBranch} ${sourceSha}`;
    git(["commit", "--quiet", "-m", message], { cwd: worktree });
    const sha = git(["rev-parse", "--short", "HEAD"], { cwd: worktree });
    const count = git(["ls-files"], { cwd: worktree }).split("\n").length;
    console.log(
      `\n[deploy] committed ${sha} on ${BRANCH} — ${count} files, ` +
        `${routeDirs.length} prerendered routes\n         "${message}"`
    );
  }

  if (PUSH) {
    git(["push", REMOTE, BRANCH], { stdio: ["ignore", "inherit", "inherit"] });
    console.log(`[deploy] pushed ${BRANCH} to ${REMOTE}.`);
    console.log(
      "[deploy] Now finish in cPanel: Git Version Control -> Manage -> " +
        '"Update from Remote", then "Deploy HEAD Commit". A push alone does not deploy.'
    );
  } else {
    console.log(
      `[deploy] Not pushed. Review with:\n` +
        `           git log ${BRANCH} -1 --stat\n` +
        `         then publish with:\n` +
        `           git push ${REMOTE} ${BRANCH}\n` +
        `         or re-run this script with --push.\n`
    );
  }
} finally {
  if (added) {
    try {
      git(["worktree", "remove", "--force", worktree]);
    } catch {
      console.warn(
        `[deploy] Could not remove the temporary worktree at ${worktree}. ` +
          `Clean up with: git worktree remove --force ${worktree}`
      );
    }
  }
}
