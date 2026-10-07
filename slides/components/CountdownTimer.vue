<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Two modes:
 * - `:seconds="120"`: owns one click on its slide and starts counting on it.
 * - `until="18:55"`: counts down to a wall-clock time, no click needed
 *   (the pre-show loop).
 */
const props = withDefaults(defineProps<{
  seconds?: number
  until?: string
  label?: string
  size?: 'md' | 'lg'
  at?: string | number
}>(), { seconds: 0, until: undefined, label: undefined, size: 'lg', at: '+1' })

const { isPrintMode } = useNav()
const clickMode = !props.until
const { step } = useStepClicks(clickMode ? 1 : 0, props.at)

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined
const startedAt = ref<number | null>(null)

function tick() {
  now.value = Date.now()
}
function run() {
  if (!timer)
    timer = setInterval(tick, 250)
}
function stop() {
  clearInterval(timer)
  timer = undefined
}

function untilTarget(): number {
  const [h, m] = (props.until ?? '0:0').split(':').map(Number)
  const t = new Date()
  t.setHours(h, m, 0, 0)
  return t.getTime()
}

if (!clickMode && !isPrintMode.value)
  run()

watch(step, (s) => {
  if (!clickMode)
    return
  if (s >= 1 && startedAt.value == null && !isPrintMode.value) {
    startedAt.value = Date.now()
    tick()
    run()
  }
  else if (s < 1) {
    startedAt.value = null
    stop()
  }
}, { immediate: true })

onUnmounted(stop)

const remainingMs = computed(() => {
  if (!clickMode)
    return Math.max(0, untilTarget() - now.value)
  if (startedAt.value == null)
    return props.seconds * 1000
  return Math.max(0, props.seconds * 1000 - (now.value - startedAt.value))
})

const total = computed(() => clickMode ? props.seconds * 1000 : 25 * 60 * 1000)
const progress = computed(() => Math.min(1, remainingMs.value / total.value))
const done = computed(() => remainingMs.value <= 0 && (!clickMode || startedAt.value != null))

// Far from the start (e.g. testing at home) show the target time, not "690:29".
const farAway = computed(() => !clickMode && remainingMs.value > 60 * 60 * 1000)

const display = computed(() => {
  if (farAway.value) {
    const [h, m] = (props.until ?? '0:0').split(':').map(Number)
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}`
  }
  const s = Math.ceil(remainingMs.value / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
})
</script>

<template>
  <div class="countdown" :class="[`s-${size}`, { done, idle: clickMode && startedAt == null }]" role="timer" aria-live="off">
    <div v-if="label" class="label">{{ farAway ? 'We start at' : label }}</div>
    <div class="digits">{{ done ? (clickMode ? "Time's up" : 'Starting') : display }}</div>
    <div class="bar"><div class="fill" :style="{ transform: `scaleX(${progress})` }" /></div>
  </div>
</template>

<style scoped>
.countdown { display: inline-flex; flex-direction: column; gap: 8px; min-width: 200px; }
.label {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.digits {
  font-family: var(--font-mono);
  font-weight: 800;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.s-lg .digits { font-size: 88px; }
.s-md .digits { font-size: 48px; }
.done .digits { color: var(--accent-2); }
.bar {
  height: 10px;
  border-radius: 5px;
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  overflow: hidden;
}
.fill {
  height: 100%;
  background: var(--accent);
  transform-origin: left center;
  transition: transform 250ms linear;
}
.done .fill { background: var(--accent-2); }
</style>
