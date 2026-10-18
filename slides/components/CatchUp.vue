<script setup lang="ts">
/**
 * The one line to run if you fall behind, at the bottom of the first slide of
 * parts 2–4: stash your work, switch to the last checkpoint, and update the
 * database. `;` separates commands in bash, zsh,
 * and PowerShell alike.
 */
defineProps<{ branch: string }>()
</script>

<template>
  <div class="catch-up">
    <div class="file-label">If you're behind, run this in your second terminal:</div>
    <code>git stash -u; git switch {{ branch }}; uv run manage.py migrate</code>
  </div>
</template>

<style scoped>
.catch-up {
  display: flex;
  flex-direction: column;
}
code {
  display: block;
  width: fit-content;
  padding: var(--code-pad-y) var(--code-pad-x);
  background: var(--surface);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
}
</style>
