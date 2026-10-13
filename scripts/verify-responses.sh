#!/usr/bin/env bash
# Runs every request from plan section 2 against each checkpoint branch, in
# throwaway worktrees with fresh databases, and prints status codes and bodies.
# With checkpoint-4-m2m it also checks lesson 4's in-between state (new model,
# old serializer) that the presenter shows in the browser.
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

# Lesson 4 halfway: checkpoint-4-m2m's model and migration with checkpoint-3-auth's
# serializer, the state between "change the field" and the serializer line.
if [[ "${branches[*]}" == *checkpoint-4-m2m* ]]; then
  wt="$tmp/before-serializer"
  git -C "$repo" worktree add --quiet --detach "$wt" origin/checkpoint-4-m2m
  (
    cd "$wt"
    git show origin/checkpoint-3-auth:questions/serializers.py > questions/serializers.py
    uv sync --locked --quiet
    uv run --quiet manage.py migrate --verbosity 0
    uv run --quiet python "$root/scripts/verify-responses.py" checkpoint-4-m2m-before-serializer
  )
fi
