<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * Presenter-only tag with the plan's slide number (plan 0–45, A1…). Slidev
 * numbers run one ahead of the plan because the setup slide (plan 0) is
 * slide 1. Never shown on the projector or in exports.
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
