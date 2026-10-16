<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * How the Question model becomes the questions_question table, one field per
 * row: the Django field type on the left, the column it becomes on the right.
 * Field types come from migration 0001 (Django adds the `id` field itself);
 * column types from `sqlmigrate questions 0001`. Rows appear on their
 * click (text, votes, answered, created_at, then the id Django adds); the
 * newest row is in focus. Clicks come from the slide's `clicks:`.
 */
const { $clicks } = useSlideContext()

const ROWS = [
  { name: 'text', field: 'CharField', column: 'varchar(300)', means: 'at most 300 characters', at: 1 },
  { name: 'votes', field: 'IntegerField', column: 'integer', means: 'defaults to 0', at: 2 },
  { name: 'answered', field: 'BooleanField', column: 'bool', means: 'defaults to false', at: 3 },
  { name: 'created_at', field: 'DateTimeField', column: 'datetime', means: "set when it's created", at: 4 },
  { name: 'id', field: 'BigAutoField', column: 'integer', means: 'Django adds it: 1, 2, 3, …', at: 5 },
]

const rows = computed(() => ROWS.map(r => ({ ...r, shown: $clicks.value >= r.at, on: $clicks.value === r.at })))
</script>

<template>
  <div class="fields">
    <span />
    <span class="head">models.py</span>
    <span />
    <span class="head">questions_question</span>
    <span />
    <template v-for="r in rows" :key="r.name">
      <code class="name" :class="{ hidden: !r.shown, on: r.on }">{{ r.name }}</code>
      <code class="field" :class="{ hidden: !r.shown }">{{ r.field }}</code>
      <span class="arrow" :class="{ hidden: !r.shown }" aria-hidden="true">→</span>
      <code class="column" :class="{ hidden: !r.shown }">{{ r.column }}</code>
      <span class="means" :class="{ hidden: !r.shown }">{{ r.means }}</span>
    </template>
  </div>
</template>

<style scoped>
.fields {
  display: grid;
  grid-template-columns: 150px auto 48px auto 1fr;
  align-items: baseline;
  column-gap: 14px;
  row-gap: 6px;
}
.head {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--text-2);
  padding-bottom: 4px;
}
code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  color: var(--text);
}
.name {
  font-weight: 700;
  transition: opacity var(--t-build) ease, color var(--t-build) ease;
}
.name.on {
  color: var(--accent);
}
.arrow {
  color: var(--stroke);
  text-align: center;
  font-size: var(--fs-small);
}
.means {
  font-size: var(--fs-small);
  color: var(--text-2);
  padding-left: 12px;
}
.hidden {
  opacity: 0;
}
.fields > * {
  transition: opacity var(--t-build) ease;
}
</style>
