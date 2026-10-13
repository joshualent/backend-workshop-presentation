<script setup lang="ts">
import { computed } from 'vue'

/** An HTTP status code: 2xx green, 4xx red (plan section 5.1). */
const props = withDefaults(defineProps<{ code: number | string, text?: string | boolean }>(), { text: true })

const REASONS: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
}
const n = computed(() => Number(props.code))
const label = computed(() => {
  if (props.text === false)
    return String(n.value)
  return `${n.value} ${typeof props.text === 'string' ? props.text : REASONS[n.value] ?? ''}`.trim()
})
const color = computed(() => (n.value < 300 ? 'var(--status-2xx)' : 'var(--status-4xx)'))
</script>

<template>
  <span class="status" :style="{ '--c': color }">{{ label }}</span>
</template>

<style scoped>
.status {
  display: inline-block;
  padding: 1px 7px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1.35;
  white-space: nowrap;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
}
</style>
