<script setup lang="ts">
/**
 * Three users × three actions at checkpoint-3-auth, with the real status
 * codes (plan section 2). One row per click; the 403 bodies appear with the
 * first row that gets them.
 */
const COLS = ['Upvote', 'Toggle answered', 'Edit (PATCH)']
const ROWS = [
  { who: 'Logged out', codes: [403, 403, 403], at: 1 },
  { who: 'sam', codes: [200, 403, 403], at: 2 },
  { who: 'mod (staff)', codes: [200, 200, 200], at: 3 },
]
</script>

<template>
  <div class="user-grid">
    <table>
      <thead>
        <tr>
          <th />
          <th v-for="c in COLS" :key="c">
            {{ c }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in ROWS" :key="r.who">
          <th>{{ r.who }}</th>
          <td v-for="(code, i) in r.codes" :key="i">
            <span v-click="r.at"><StatusBadge :code="code" /></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="bodies">
      <div v-click="1">
        <span class="who">Logged out</span><code>{"detail": "Authentication credentials were not provided."}</code>
      </div>
      <div v-click="2">
        <span class="who">sam</span><code>{"detail": "You do not have permission to perform this action."}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-grid {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
table {
  border-collapse: collapse;
  font-size: var(--fs-small);
}
th,
td {
  border-bottom: var(--stroke-w) solid var(--rule);
  padding: 7px 18px 7px 0;
  text-align: left;
  white-space: nowrap;
}
thead th {
  font-weight: var(--fw-strong);
  color: var(--text-2);
}
tbody th {
  font-weight: var(--fw-strong);
  width: 170px;
}
td {
  width: 220px;
  font-size: var(--fs-code);
}
.bodies {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bodies > div {
  display: flex;
  align-items: baseline;
}
.who {
  width: 130px;
  flex: none;
  font-size: var(--fs-label);
  font-weight: var(--fw-strong);
  color: var(--text-2);
}
code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
}
</style>
