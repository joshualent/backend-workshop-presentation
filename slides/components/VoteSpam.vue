<script setup lang="ts">
import { useNav } from '@slidev/client'
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Slide 26 ambient loop: one user clicks upvote over and over and the count
 * climbs forever. The click cycle is 0.9 s and the counter only ever goes up,
 * so it reads the same from any frame.
 */
const { isPrintMode } = useNav()
const count = ref(isPrintMode.value ? 9999 : 3)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (isPrintMode.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  timer = setInterval(() => { count.value += 1 }, 900)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="spam ambient">
    <div class="who"><ph-user-bold /> same user, every click</div>
    <div class="card">
      <div class="text">Is pineapple on pizza OK?</div>
      <div class="row">
        <button class="upvote" tabindex="-1" aria-hidden="true">
          <ph-arrow-fat-up-bold /> Upvote
          <ph-cursor-click-bold class="cursor" />
        </button>
        <span class="count">{{ count.toLocaleString('en-US') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spam { display: flex; flex-direction: column; gap: 12px; }
.who { display: inline-flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: var(--accent-2); }
.card {
  background: var(--surface);
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.text { font-size: 24px; font-weight: 800; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.upvote {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: inherit;
  font-size: 20px;
  font-weight: 800;
  color: var(--bg);
  background: var(--accent);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 8px 14px;
  animation: press 0.9s var(--ease-out) infinite;
}
.cursor {
  position: absolute;
  right: -22px;
  bottom: -22px;
  font-size: 34px;
  color: var(--text);
  animation: tap 0.9s var(--ease-out) infinite;
}
.count {
  font-family: var(--font-mono);
  font-size: 56px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--error);
}
@keyframes press {
  0%, 30%, 100% { scale: 1; }
  12% { scale: 0.94; }
}
@keyframes tap {
  0%, 30%, 100% { translate: 0 0; }
  12% { translate: -3px -3px; }
}
</style>
