<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * Presenter-only tag with the plan slides this slide stands for: "13",
 * "14–15", "31, 34" (merged slides), or A1… in the appendix. Never shown on
 * the projector or in exports.
 */
const { $frontmatter, $renderContext } = useSlideContext()
const show = computed(() => ['presenter', 'previewNext'].includes($renderContext.value) && $frontmatter.plan != null)
</script>

<template>
  <div v-if="show" class="plan-tag">
    plan {{ $frontmatter.plan }}
  </div>
</template>

<style scoped>
.plan-tag {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 100;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 700;
  color: var(--bg);
  background: var(--text-2);
  border-radius: var(--radius-sm);
  padding: 1px 8px;
  pointer-events: none;
}
</style>
