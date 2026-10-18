<script setup lang="ts">
/**
 * The six CRUD routes DefaultRouter makes for QuestionViewSet (from the
 * workshop README). `steps` gives the click that reveals each row; without
 * it every row shows at once.
 */
const props = defineProps<{ steps?: number[] }>()

const ROUTES = [
  { method: 'GET', url: '/api/questions/', what: 'list all questions' },
  { method: 'POST', url: '/api/questions/', what: 'create a question' },
  { method: 'GET', url: '/api/questions/1/', what: 'read question 1' },
  { method: 'PUT', url: '/api/questions/1/', what: 'replace question 1' },
  { method: 'PATCH', url: '/api/questions/1/', what: 'change part of question 1' },
  { method: 'DELETE', url: '/api/questions/1/', what: 'delete question 1' },
]
const at = (i: number) => props.steps?.[i] ?? false
</script>

<template>
  <div class="routes">
    <div v-for="(r, i) in ROUTES" :key="r.method + r.url" v-click="at(i)" class="row">
      <MethodBadge :method="r.method" />
      <code>{{ r.url }}</code>
      <span class="what">{{ r.what }}</span>
    </div>
  </div>
</template>

<style scoped>
.routes {
  display: grid;
  grid-template-columns: auto auto 1fr;
  column-gap: 14px;
  row-gap: 5px;
  font-size: var(--fs-code);
}
.row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: baseline;
}
code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  color: var(--text);
}
.what {
  font-size: var(--fs-small);
  line-height: 1.25;
  color: var(--text-2);
}
</style>
