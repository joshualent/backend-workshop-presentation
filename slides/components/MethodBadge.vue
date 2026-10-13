<script setup lang="ts">
import { computed } from 'vue'

/** An HTTP method. One of the two places badges are allowed (plan section 5.2). */
const props = defineProps<{ method: string }>()
const m = computed(() => props.method.toUpperCase())
const color = computed(() => `var(--${m.value.toLowerCase()}, var(--text))`)
</script>

<template>
  <span class="method" :style="{ '--c': color }">{{ m }}</span>
</template>

<style scoped>
.method {
  display: inline-block;
  min-width: 4.3em;
  box-sizing: border-box;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
}
</style>
