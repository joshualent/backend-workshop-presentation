<script setup lang="ts">
/**
 * Projector check (plan section 5.1): every color token, the smallest text
 * sizes, and badges. Put it up in the room before the talk; everything here
 * should be readable from the back row.
 */
const SWATCHES = [
  ['--bg', 'background'],
  ['--surface', 'code surface'],
  ['--text', 'text'],
  ['--text-2', 'secondary text'],
  ['--stroke', 'diagram lines'],
  ['--rule', 'table rules'],
  ['--accent', 'accent'],
  ['--get', 'GET'],
  ['--post', 'POST'],
  ['--patch', 'PUT / PATCH'],
  ['--delete', 'DELETE'],
  ['--status-2xx', '2xx'],
  ['--status-4xx', '4xx'],
]
</script>

<template>
  <div class="check">
    <div class="swatches">
      <div v-for="[v, label] in SWATCHES" :key="v" class="swatch">
        <span class="chip" :style="{ background: `var(${v})` }" />
        <span class="label">{{ label }}</span>
      </div>
    </div>
    <div class="sizes">
      <p class="body">
        Body text, 24 px: the smallest body size in the deck.
      </p>
      <p class="secondary">
        Secondary text, 24 px: still readable at the back?
      </p>
      <p class="code">
        Code, 18 px: question.votes.add(request.user)
      </p>
      <p class="label-size">
        Diagram label, 16 px: config/urls.py · serializers.py · db.sqlite3
      </p>
      <p class="badges">
        <MethodBadge method="GET" /> <MethodBadge method="POST" /> <MethodBadge method="PATCH" /> <MethodBadge method="DELETE" />
        <StatusBadge :code="201" /> <StatusBadge :code="403" />
      </p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.check {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 28px;
}
.swatches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  align-content: start;
}
.swatch {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chip {
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: var(--radius-sm);
  border: 1px solid var(--rule);
}
.label {
  font-size: var(--fs-label);
  font-weight: 600;
}
.sizes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.body {
  font-size: var(--fs-small);
}
.secondary {
  font-size: var(--fs-small);
  color: var(--text-2);
}
.code {
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  background: var(--surface);
  border-radius: var(--radius);
  padding: var(--code-pad-y) var(--code-pad-x);
}
.label-size {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  color: var(--text-2);
}
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--fs-code);
}
</style>
