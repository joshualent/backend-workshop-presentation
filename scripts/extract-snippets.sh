#!/usr/bin/env bash
# Copies the real workshop code from each checkpoint branch onto the slides.
#
#   scripts/extract-snippets.sh
#
# 1. Clones joshualent/questions-api into vendor/questions-api (read-only
#    reference, gitignored) or fetches it if it is already there.
# 2. For every file that changes at any checkpoint, writes its contents at
#    every checkpoint to slides/snippets/<branch>/<path> (`git show`).
# 3. Writes each checkpoint's diff to slides/snippets/diffs/<branch>.diff.
# 4. Regenerates everything derived from those files: the Magic Move and
#    code-window blocks inside slides/pages/*.md and notes/cheat-sheet.md.
#
# If the workshop repo changes, rerunning this script is the only step needed.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
repo="$root/vendor/questions-api"
url="https://github.com/joshualent/questions-api.git"
out="$root/slides/snippets"
branches=(checkpoint-0-setup checkpoint-1-crud checkpoint-2-actions checkpoint-3-auth checkpoint-4-m2m)

if [ ! -d "$repo/.git" ]; then
  mkdir -p "$root/vendor"
  git clone --quiet "$url" "$repo"
fi
git -C "$repo" fetch --quiet --prune origin

ref() { echo "refs/remotes/origin/$1"; }
for b in "${branches[@]}"; do
  git -C "$repo" rev-parse --verify --quiet "$(ref "$b")" >/dev/null \
    || { echo "Missing branch origin/$b in $url" >&2; exit 1; }
done

# Every file that changes between consecutive checkpoints.
files=()
while IFS= read -r f; do files+=("$f"); done < <(
  for i in 1 2 3 4; do
    git -C "$repo" diff --name-only "$(ref "${branches[i-1]}")" "$(ref "${branches[i]}")"
  done | sort -u
)

rm -rf "$out"
mkdir -p "$out/diffs"

for b in "${branches[@]}"; do
  for f in "${files[@]}"; do
    if git -C "$repo" cat-file -e "$(ref "$b"):$f" 2>/dev/null; then
      mkdir -p "$out/$b/$(dirname "$f")"
      git -C "$repo" show "$(ref "$b"):$f" > "$out/$b/$f"
    fi
  done
done

# The starter repo's file list (the file-tree slide) and its setup files.
git -C "$repo" ls-tree -r --name-only "$(ref checkpoint-0-setup)" > "$out/checkpoint-0-setup/tree.txt"

for i in 1 2 3 4; do
  git -C "$repo" diff "$(ref "${branches[i-1]}")" "$(ref "${branches[i]}")" > "$out/diffs/${branches[i]}.diff"
done

{
  echo "Source: $url"
  for b in "${branches[@]}"; do
    git -C "$repo" log -1 --format="$b %h %s" "$(ref "$b")"
  done
} > "$out/SOURCE.txt"

echo "Snippets: ${#files[@]} files × ${#branches[@]} checkpoints → slides/snippets/"
cat "$out/SOURCE.txt"

node "$root/scripts/build-code-blocks.mjs"
node "$root/scripts/build-cheat-sheet.mjs"
