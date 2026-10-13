<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * The questions_question table that Question becomes. Column names and types
 * come from `sqlmigrate questions 0001`; the row is the first real POST.
 * Each column appears on its click (text, votes, answered, created_at, then
 * the id Django adds), in step with the model's highlighted line.
 */
const { $clicks } = useSlideContext()

const COLS = [
  { name: 'id', type: 'integer', value: '1', at: 5 },
  { name: 'text', type: 'varchar(300)', value: 'What does a serializer do?', at: 1 },
  { name: 'votes', type: 'integer', value: '0', at: 2 },
  { name: 'answered', type: 'bool', value: '0', at: 3 },
  { name: 'created_at', type: 'datetime', value: '2026-10-19 …', at: 4 },
]

const cols = computed(() => COLS.map(c => ({ ...c, shown: $clicks.value >= c.at, on: $clicks.value === c.at })))
</script>

<template>
  <div class="table-wrap">
    <div class="file-label">
      questions_question
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="c in cols" :key="c.name" :class="{ hidden: !c.shown, on: c.on }">
            {{ c.name }}<span class="type">{{ c.type }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="c in cols" :key="c.name" :class="{ hidden: !c.shown }">
            {{ c.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
}
th,
td {
  border: var(--stroke-w) solid var(--rule);
  padding: 5px 12px;
  text-align: left;
  white-space: nowrap;
  transition: opacity var(--t-build) ease, color var(--t-build) ease;
}
th {
  font-weight: 700;
  color: var(--text);
  vertical-align: top;
}
th.on {
  color: var(--accent);
}
.type {
  display: block;
  font-size: var(--fs-label);
  font-weight: 500;
  color: var(--text-2);
}
td {
  font-weight: 500;
  color: var(--text-2);
}
.hidden {
  opacity: 0;
}
</style>
