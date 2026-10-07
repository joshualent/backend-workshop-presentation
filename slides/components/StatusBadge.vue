<script setup lang="ts">
import { computed } from 'vue'

/** HTTP status chip: 2xx green, 4xx/5xx red, always with the number (and reason) as text. */
const props = withDefaults(defineProps<{
  code: number | string
  /** Reason phrase; defaults to the standard one. Pass `false` to show the number only. */
  text?: string | false
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md', text: undefined })

const REASONS: Record<string, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Server Error',
}

const ok = computed(() => +props.code < 400)
const reason = computed(() => props.text === false ? '' : (props.text ?? REASONS[props.code] ?? ''))
</script>

<template>
  <span class="status-badge" :class="[ok ? 'ok' : 'error', `s-${size}`]">
    <span class="code">{{ code }}</span>
    <span v-if="reason" class="reason">{{ reason }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  font-family: var(--font-mono);
  font-weight: 800;
  color: var(--bg);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  line-height: 1;
}
.reason { font-family: var(--font-sans); font-weight: 700; }
.s-sm { font-size: var(--fs-label); padding: 5px 8px; }
.s-md { font-size: 18px; padding: 6px 10px; }
.s-lg { font-size: 24px; padding: 8px 14px; }
.ok { background: var(--ok); }
.error { background: var(--error); }
</style>
