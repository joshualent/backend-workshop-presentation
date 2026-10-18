<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * Presenter-only tag with the part of the night this slide belongs to
 * ("API basics", "Lesson 3", "Appendix"), from its `part:` frontmatter.
 * Never shown on the projector or in exports.
 */
const { $frontmatter, $renderContext } = useSlideContext()
const show = computed(() => ['presenter', 'previewNext'].includes($renderContext.value) && $frontmatter.part != null)
</script>

<template>
  <div v-if="show" class="part-tag">
    {{ $frontmatter.part }}
  </div>
</template>

<style scoped>
.part-tag {
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
