<script setup lang="ts">
import { computed } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Slide 22. On click, `?ordering=-votes` is "typed" into the URL bar and the
 * question cards reorder by votes (FLIP via TransitionGroup).
 */
const props = withDefaults(defineProps<{ at?: string | number }>(), { at: '+1' })
const { step } = useStepClicks(1, props.at)

const QUESTIONS = [
  { id: 1, text: 'Django or Flask for a first project?', votes: 2 },
  { id: 2, text: 'Do I need to know SQL?', votes: 7 },
  { id: 3, text: 'How do I deploy this?', votes: 4 },
  { id: 4, text: 'Is DRF used in industry?', votes: 9 },
]
const QUERY = '?ordering=-votes'

const ordered = computed(() => step.value >= 1
  ? [...QUESTIONS].sort((a, b) => b.votes - a.votes)
  : QUESTIONS)
</script>

<template>
  <div class="ordering" :class="{ typed: step >= 1 }">
    <div class="urlbar">
      <MethodBadge method="GET" />
      <span class="url">127.0.0.1:8000/api/questions/<span class="query" :style="{ '--chars': QUERY.length }">{{ QUERY }}</span><span class="caret" /></span>
    </div>
    <TransitionGroup tag="ol" name="flip" class="cards">
      <li v-for="q in ordered" :key="q.id" class="q">
        <span class="votes"><ph-arrow-fat-up-bold class="up" />{{ q.votes }}</span>
        <span class="text">{{ q.text }}</span>
        <span class="id">#{{ q.id }}</span>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.ordering { display: flex; flex-direction: column; gap: 18px; width: 760px; margin: 0 auto; }
.urlbar {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--surface);
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
}
.url { font-family: var(--font-mono); font-size: 22px; font-weight: 700; white-space: nowrap; display: inline-flex; align-items: center; }
.query {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  color: var(--accent-2);
  max-width: 0;
  transition: max-width 360ms steps(16, end);
}
.typed .query { max-width: calc(var(--chars) * 1ch); }
.caret { display: inline-block; width: 3px; height: 26px; margin-left: 2px; background: var(--accent); }

.cards { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.q {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  align-items: center;
  gap: 14px;
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
  margin: 0 !important;
}
.q::before { display: none; }
.votes { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 26px; font-weight: 800; color: var(--text); }
.up { color: var(--accent); font-size: 24px; }
.text { font-size: 22px; font-weight: 700; }
.id { font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 700; color: var(--text-muted); }

.flip-move { transition: transform 500ms var(--ease-out) 160ms; }
</style>
