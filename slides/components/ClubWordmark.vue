<script setup lang="ts">
import { isPlaceholder, workshop } from '../workshop.config'

/**
 * Developer Club wordmark (title, pre-show, closing slides only). Uses the
 * supplied file; until then a marked placeholder. Never recreated by hand.
 */
withDefaults(defineProps<{ height?: number }>(), { height: 56 })
const base = import.meta.env.BASE_URL
const src = workshop.logoSrc
</script>

<template>
  <img
    v-if="!isPlaceholder(src)"
    class="wordmark" :src="`${base}${src.replace(/^\//, '')}`"
    alt="Developer Club" :style="{ height: `${height}px` }"
  >
  <div v-else class="placeholder wordmark-ph" :style="{ height: `${height}px` }">
    Developer Club wordmark · {{ src }}
  </div>
</template>

<style scoped>
.wordmark { display: block; width: auto; align-self: flex-start; }
.wordmark-ph { display: inline-grid; padding: 0 16px; align-self: flex-start; justify-self: start; width: max-content; }
</style>
