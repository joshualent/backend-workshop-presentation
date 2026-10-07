<script setup lang="ts">
/**
 * Backstage "projector check": every color token, the minimum text sizes,
 * and the badges, for testing in the room (plan section 5).
 */
const TOKENS = [
  ['--bg', '#15171c'], ['--surface', '#20242b'], ['--border', '#3a404a'], ['--text', '#f4f1ea'],
  ['--text-muted', '#c4c8cf'], ['--accent', '#4fd1b5'], ['--accent-2', '#f5c451'],
  ['--get', '#6cb6ff'], ['--post', '#5fd68a'], ['--patch', '#f5c451'], ['--delete', '#ff7a7a'],
  ['--ok', '#5fd68a'], ['--error', '#ff7a7a'],
]
</script>

<template>
  <div class="check">
    <div class="swatches">
      <div v-for="[name, hex] in TOKENS" :key="name" class="swatch">
        <span class="chip" :style="{ background: `var(${name})` }" />
        <span class="name">{{ name }}</span>
        <span class="hex">{{ hex }}</span>
      </div>
    </div>
    <div class="sizes">
      <div style="font-size: 40px; font-weight: 800">Title 40 px</div>
      <div style="font-size: 24px">Body 24 px: can the back row read this?</div>
      <div class="mono" style="font-size: 18px">code 18 px: queryset = Question.objects.all()</div>
      <div style="font-size: 16px; font-weight: 600">Diagram label 16 px (the smallest text in the deck)</div>
      <div class="muted" style="font-size: 24px">Muted text 24 px (--text-muted)</div>
      <div class="badges">
        <MethodBadge method="GET" /><MethodBadge method="POST" /><MethodBadge method="PATCH" /><MethodBadge method="DELETE" />
        <StatusBadge :code="201" /><StatusBadge :code="403" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.check { display: grid; grid-template-columns: 330px 1fr; gap: 30px; }
.swatches { display: grid; grid-template-columns: 1fr; gap: 3px; }
.swatch { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 10px; }
.chip { width: 34px; height: 26px; border-radius: var(--radius-sm); border: var(--stroke) solid var(--text-muted); }
.name { font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 700; }
.hex { font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 600; color: var(--text-muted); }
.sizes { display: flex; flex-direction: column; gap: 14px; }
.badges { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
