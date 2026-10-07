<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, ref, watch } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Slide 20. Click 1: PATCH {"votes": 9999} is refused (the field is
 * read-only, so the count stays 3). Click 2: POST …/upvote/ succeeds and the
 * count ticks from 3 to 4.
 */
const props = withDefaults(defineProps<{ at?: string | number }>(), { at: '+1' })
const { step } = useStepClicks(2, props.at)

const shown = ref(step.value >= 2 ? 4 : 3)
const tweened = { v: shown.value }
const countEl = ref<HTMLElement>()

watch(step, (s) => {
  const target = s >= 2 ? 4 : 3
  gsap.to(tweened, {
    v: target,
    duration: 0.5,
    ease: 'power2.out',
    onUpdate: () => { shown.value = Math.round(tweened.v) },
  })
  if (s === 2 && countEl.value)
    gsap.fromTo(countEl.value, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: 'power2.out' })
})

onMounted(() => { shown.value = step.value >= 2 ? 4 : 3 })
</script>

<template>
  <div class="actions-demo">
    <div class="requests">
      <div class="req" :class="{ on: step >= 1 }">
        <div class="line"><MethodBadge method="PATCH" /> <span class="url">/api/questions/5/</span></div>
        <div class="body">{"votes": <span class="nope">9999</span>}</div>
        <div class="result bad"><ph-x-circle-bold /> votes is read-only: change ignored</div>
      </div>
      <div class="req" :class="{ on: step >= 2 }">
        <div class="line"><MethodBadge method="POST" /> <span class="url">/api/questions/5/upvote/</span></div>
        <div class="body muted-body">no body needed</div>
        <div class="result good"><StatusBadge :code="200" size="sm" /> the server adds exactly one</div>
      </div>
    </div>

    <div class="card">
      <div class="card-id">question 5</div>
      <div class="card-text">What is REST?</div>
      <div class="votes">
        <ph-arrow-fat-up-bold class="up" />
        <span ref="countEl" class="count">{{ shown }}</span>
        <span class="votes-label">votes</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actions-demo { display: grid; grid-template-columns: 1fr 250px; gap: 36px; align-items: center; }
.requests { display: flex; flex-direction: column; gap: 18px; }
.req {
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  translate: 0 12px;
  transition: opacity var(--dur-step) var(--ease-out), translate var(--dur-step) var(--ease-out);
}
.req.on { opacity: 1; translate: 0 0; }
.line { display: flex; align-items: center; gap: 12px; }
.url, .body { font-family: var(--font-mono); font-weight: 700; }
.url { font-size: 22px; }
.body { font-size: 20px; color: var(--text); }
.muted-body { color: var(--text-muted); font-family: var(--font-sans); font-size: 18px; }
.nope { transition: color var(--dur-fast) var(--ease-out) 250ms; }
.req.on .nope { color: var(--error); text-decoration: line-through 3px; }
.result { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; }
.result.bad { color: var(--error); }
.result.good { color: var(--ok); }

.card {
  background: var(--surface);
  border: var(--stroke-bold) solid var(--accent);
  border-radius: var(--radius);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-id { font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 700; color: var(--text-muted); }
.card-text { font-size: 26px; font-weight: 800; }
.votes { display: flex; align-items: center; gap: 10px; }
.up { font-size: 40px; color: var(--accent); }
.count { font-family: var(--font-mono); font-size: 64px; font-weight: 800; line-height: 1; display: inline-block; font-variant-numeric: tabular-nums; }
.votes-label { font-size: 20px; font-weight: 700; color: var(--text-muted); }
</style>
