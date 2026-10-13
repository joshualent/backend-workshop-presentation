#!/usr/bin/env bash
# Runs every request from plan section 2 against each checkpoint branch, in
# throwaway worktrees with fresh databases, and prints status codes and bodies.
#
#   scripts/verify-responses.sh [checkpoint-N-…]
#
# Compare the output with the responses on the slides (plan section 2).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
repo="$root/vendor/questions-api"
tmp="$(mktemp -d)"
trap 'for w in "$tmp"/*; do git -C "$repo" worktree remove --force "$w" >/dev/null 2>&1 || true; done; rm -rf "$tmp"' EXIT

branches=("${@:-checkpoint-0-setup checkpoint-1-crud checkpoint-2-actions checkpoint-3-auth checkpoint-4-m2m}")
for branch in ${branches[@]}; do
  wt="$tmp/$branch"
  git -C "$repo" worktree add --quiet --detach "$wt" "origin/$branch"
  (
    cd "$wt"
    uv sync --locked --quiet
    uv run --quiet manage.py migrate --verbosity 0
    uv run --quiet python "$root/scripts/verify-responses.py" "$branch"
  )
done
