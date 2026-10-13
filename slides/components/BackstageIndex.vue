<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'

/**
 * The hidden appendix, with live slide numbers for the `g` (go to) dialog.
 * Lists every slide with `backstage: true` except this one.
 */
const nav = useNav()
const entries = computed(() => nav.slides.value
  .filter(s => s.meta?.slide?.frontmatter?.backstage && !s.meta?.slide?.frontmatter?.backstageIndex)
  .map(s => ({ no: s.no, title: s.meta?.slide?.title ?? '' })))
</script>

<template>
  <div class="index">
    <template v-for="e in entries" :key="e.no">
      <span class="no">{{ e.no }}</span><span>{{ e.title }}</span>
    </template>
  </div>
</template>

<style scoped>
.index {
  display: grid;
  grid-template-columns: 48px 1fr 48px 1fr;
  gap: 6px 14px;
  font-size: var(--fs-small);
  align-items: baseline;
}
.no {
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 700;
  color: var(--text-2);
  text-align: right;
}
</style>
