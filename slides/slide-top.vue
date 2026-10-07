<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * Presenter-only tag with the plan's slide number (P1, 1–35, A…). Slidev
 * numbers run one ahead of the plan because the pre-show loop is slide 1.
 * Never shown on the projector or in exports.
 */
const { $frontmatter, $renderContext } = useSlideContext()
const show = computed(() => ['presenter', 'previewNext'].includes($renderContext.value) && $frontmatter.plan != null)
</script>

<template>
  <div v-if="show" class="plan-tag">plan {{ $frontmatter.plan }}</div>
</template>

<style scoped>
.plan-tag {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 100;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 800;
  color: var(--bg);
  background: var(--accent-2);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  pointer-events: none;
}
</style>
