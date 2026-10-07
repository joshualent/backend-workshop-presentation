<script setup lang="ts">
/**
 * A small labeled envelope (a request or a JSON body) that travels between
 * boxes. It only renders; the parent positions and animates it.
 */
withDefaults(defineProps<{
  label: string
  /** Optional HTTP method shown as a badge before the label. */
  method?: string
  kind?: 'request' | 'response' | 'error'
}>(), { kind: 'request', method: undefined })
</script>

<template>
  <div class="packet" :class="kind">
    <svg class="flap" viewBox="0 0 28 20" aria-hidden="true">
      <rect x="1.5" y="1.5" width="25" height="17" rx="3" />
      <path d="M2.5 3 L14 11.5 L25.5 3" />
    </svg>
    <MethodBadge v-if="method" :method="method" size="sm" />
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.packet {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: var(--stroke-bold) solid var(--accent);
  border-radius: var(--radius);
  padding: 7px 12px;
  white-space: nowrap;
  box-sizing: border-box;
}
.packet.response { border-color: var(--accent-2); }
.packet.error { border-color: var(--error); }
.label {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 700;
  color: var(--text);
}
.flap {
  width: 26px;
  height: 19px;
  flex: none;
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.response .flap { stroke: var(--accent-2); }
.error .flap { stroke: var(--error); }
</style>
