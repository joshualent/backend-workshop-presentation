<script setup lang="ts">
import { computed } from 'vue'

/** HTTP method chip. Color always comes with the method name as text. */
const props = withDefaults(defineProps<{
  method: string
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const key = computed(() => {
  const m = props.method.toUpperCase()
  if (m === 'PUT' || m === 'PATCH' || m.includes('PATCH'))
    return 'patch'
  if (m === 'POST')
    return 'post'
  if (m === 'DELETE')
    return 'delete'
  return 'get'
})
</script>

<template>
  <span class="method-badge" :class="[`m-${key}`, `s-${size}`]">{{ method.toUpperCase() }}</span>
</template>

<style scoped>
.method-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--bg);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  line-height: 1;
}
.s-sm { font-size: var(--fs-label); padding: 5px 8px; min-width: 58px; }
.s-md { font-size: 18px; padding: 6px 10px; min-width: 70px; }
.s-lg { font-size: 24px; padding: 8px 14px; min-width: 96px; }
.m-get { background: var(--get); }
.m-post { background: var(--post); }
.m-patch { background: var(--patch); }
.m-delete { background: var(--delete); }
</style>
