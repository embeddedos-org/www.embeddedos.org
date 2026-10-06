#!/usr/bin/env bash
#
# One-command full deploy for www.embeddedos.org:
#
#   ./deploy.sh          # build -> publish to deploy branch -> push
#   ./deploy.sh --no-push  # build + publish to local deploy branch, stop for review
#
# This is a thin wrapper around the repo's own pipeline. The safety checks
# live in scripts/deploy-branch.mjs (fresh build stamp, >=50 prerendered
# routes, required files present, clean tree) — this script only chains the
# steps in the order README.md documents, so a deploy is always:
#   1. full production build (client -> prerender -> sitemap -> server)
#   2. publish dist/public to the deploy branch
#   3. push deploy to origin (unless --no-push)
#
# After this finishes, the last step is still manual: cPanel does not act on
# a push. Finish in cPanel under Git Version Control -> Manage ->
# "Update from Remote", then "Deploy HEAD Commit".
#
set -euo pipefail

cd "$(dirname "$0")"

NO_PUSH=0
for arg in "$@"; do
  case "$arg" in
    --no-push) NO_PUSH=1 ;;
    -h|--help)
      echo "Usage: ./deploy.sh [--no-push]"
      echo "  --no-push   Commit to the local deploy branch but do not push."
      exit 0
      ;;
    *) echo "Unknown option: $arg (try --help)" >&2; exit 1 ;;
  esac
done

echo "==> [1/3] Building production site (pnpm build)..."
pnpm build

echo "==> [2/3] Publishing dist/public to the deploy branch..."
if [ "$NO_PUSH" -eq 1 ]; then
  node scripts/deploy-branch.mjs
else
  node scripts/deploy-branch.mjs --push
fi

echo "==> [3/3] Verifying..."
git log deploy -1 --format="deploy branch is now at %h (%s)"
echo
echo "Next (manual, in cPanel): Git Version Control -> Manage ->"
echo "\"Update from Remote\", then \"Deploy HEAD Commit\"."
