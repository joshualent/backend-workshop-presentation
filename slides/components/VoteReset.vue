<script setup lang="ts">
import gsap from 'gsap'
import { ref, watch } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/** Slide 30. On click the vote counter drops to 0 (old votes have no voter attached). */
const props = withDefaults(defineProps<{ from?: number, at?: string | number }>(), { from: 12, at: '+1' })
const { step } = useStepClicks(1, props.at)

const shown = ref(step.value >= 1 ? 0 : props.from)
const t = { v: shown.value }
watch(step, (s) => {
  gsap.to(t, {
    v: s >= 1 ? 0 : props.from,
    duration: 0.6,
    ease: 'power2.out',
    onUpdate: () => { shown.value = Math.round(t.v) },
  })
})
</script>

<template>
  <div class="reset" :class="{ dropped: step >= 1 }">
    <div class="text">Is DRF used in industry?</div>
    <div class="before">
      <span class="field">votes</span>
      <span class="count">{{ shown }}</span>
    </div>
    <div class="after">
      <span class="field">voters</span>
      <span class="list">[ ]</span>
    </div>
  </div>
</template>

<style scoped>
.reset {
  background: var(--surface);
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  display: grid;
  gap: 10px;
  width: 340px;
  transition: border-color var(--dur-step) var(--ease-out);
}
.dropped { border-color: var(--accent-2); }
.text { font-size: 24px; font-weight: 800; }
.before, .after { display: flex; align-items: baseline; gap: 14px; }
.field { font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--text-muted); min-width: 80px; }
.count { font-family: var(--font-mono); font-size: 72px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.dropped .count { color: var(--accent-2); }
.list { font-family: var(--font-mono); font-size: 28px; font-weight: 800; }
.after { opacity: 0; translate: 0 8px; transition: opacity var(--dur-step) var(--ease-out) 200ms, translate var(--dur-step) var(--ease-out) 200ms; }
.dropped .after { opacity: 1; translate: 0 0; }
</style>
