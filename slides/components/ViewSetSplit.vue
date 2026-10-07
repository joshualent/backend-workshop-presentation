<script setup lang="ts">
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Slide 18. Click 1: one ModelViewSet box splits into five actions.
 * Click 2: the router writes a method + URL for each.
 */
const props = withDefaults(defineProps<{ at?: string | number }>(), { at: '+1' })
const { step } = useStepClicks(2, props.at)

const ROWS = [
  { action: 'list', method: 'GET', url: '/api/questions/' },
  { action: 'create', method: 'POST', url: '/api/questions/' },
  { action: 'retrieve', method: 'GET', url: '/api/questions/5/' },
  { action: 'update', method: 'PATCH', url: '/api/questions/5/' },
  { action: 'destroy', method: 'DELETE', url: '/api/questions/5/' },
]
const ROW_H = 58
</script>

<template>
  <div class="split" :class="{ open: step >= 1, routed: step >= 2 }">
    <div class="heads">
      <span class="head-left">QuestionViewSet</span>
      <span class="router-tag"><span class="mono">DefaultRouter</span> writes the URLs</span>
    </div>
    <div class="stack" :style="{ height: `${ROWS.length * ROW_H}px` }">
      <div
        v-for="(r, i) in ROWS" :key="r.action"
        class="row"
        :style="{
          transform: step >= 1 ? `translateY(${i * ROW_H}px)` : `translateY(${2 * ROW_H}px)`,
          transitionDelay: `${i * 40}ms`,
          zIndex: ROWS.length - i,
        }"
      >
        <div class="action">
          <span class="whole">QuestionViewSet</span>
          <span class="part">{{ r.action }}</span>
        </div>
        <div class="route" :style="{ transitionDelay: `${i * 50}ms` }">
          <MethodBadge :method="r.method" />
          <span class="url">{{ r.url }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.split { position: relative; width: 760px; margin: 0 auto; }
.heads { display: grid; grid-template-columns: 260px 1fr; gap: 24px; height: 34px; align-items: center; margin-bottom: 8px; }
.head-left { font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--text-muted); text-align: center; opacity: 0; transition: opacity var(--dur-step) var(--ease-out); }
.open .head-left { opacity: 1; }
.router-tag {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  opacity: 0;
  transition: opacity var(--dur-step) var(--ease-out);
}
.routed .router-tag { opacity: 1; }
.router-tag .mono { font-family: var(--font-mono); font-weight: 800; }
.stack { position: relative; }
.row {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: grid;
  grid-template-columns: 260px 1fr;
  align-items: center;
  gap: 24px;
  transition: transform 550ms var(--ease-out);
}
.action {
  position: relative;
  height: 100%;
  display: grid;
  place-items: center;
  background: var(--surface);
  border: var(--stroke-bold) solid var(--accent);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 22px;
}
.whole, .part { grid-area: 1 / 1; transition: opacity var(--dur-fast) var(--ease-out); }
.whole { opacity: 1; }
.part { opacity: 0; }
.open .whole { opacity: 0; }
.open .part { opacity: 1; }
.route {
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0;
  translate: -16px 0;
  transition: opacity var(--dur-step) var(--ease-out), translate var(--dur-step) var(--ease-out);
}
.routed .route { opacity: 1; translate: 0 0; }
.url { font-family: var(--font-mono); font-size: 22px; font-weight: 700; }
</style>
