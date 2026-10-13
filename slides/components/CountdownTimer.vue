<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/**
 * A countdown that starts on a click (`at`) and resets if you click back
 * before it. Plain digits; the accent marks it as the thing to watch.
 */
const props = withDefaults(defineProps<{ seconds?: number, at?: number }>(), { seconds: 120, at: 1 })
const { $clicks, $renderContext } = useSlideContext()
const { isPrintMode } = useNav()

const left = ref(props.seconds)
let timer: ReturnType<typeof setInterval> | undefined
let endsAt = 0

function stop() {
  if (timer)
    clearInterval(timer)
  timer = undefined
}

function start() {
  stop()
  endsAt = Date.now() + props.seconds * 1000
  left.value = props.seconds
  timer = setInterval(() => {
    left.value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
    if (left.value === 0)
      stop()
  }, 250)
}

const running = computed(() => $clicks.value >= props.at)
watch(running, (on) => {
  // Only the live slide counts down; exports and previews show the full time.
  if (isPrintMode.value || !['slide', 'presenter'].includes($renderContext.value))
    return
  if (on)
    start()
  else {
    stop()
    left.value = props.seconds
  }
}, { immediate: true })

onBeforeUnmount(stop)

const label = computed(() => `${Math.floor(left.value / 60)}:${String(left.value % 60).padStart(2, '0')}`)
</script>

<template>
  <div class="timer" :class="{ running, done: left === 0 }" role="timer" :aria-label="`${label} left`">
    {{ label }}
  </div>
</template>

<style scoped>
.timer {
  font-family: var(--font-mono);
  font-size: 96px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--text-2);
}
.timer.running {
  color: var(--accent);
}
.timer.done {
  color: var(--text);
}
</style>
