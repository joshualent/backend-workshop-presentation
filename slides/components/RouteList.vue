<script setup lang="ts">
/**
 * The six CRUD routes DefaultRouter makes for QuestionViewSet (from the
 * workshop README). `steps` gives the click that reveals each row; without
 * it every row shows at once. `actions` adds the ViewSet method each route calls.
 */
const props = withDefaults(defineProps<{ steps?: number[], actions?: boolean }>(), { actions: false })

const ROUTES = [
  { method: 'GET', url: '/api/questions/', what: 'list all questions', action: 'list' },
  { method: 'POST', url: '/api/questions/', what: 'create a question', action: 'create' },
  { method: 'GET', url: '/api/questions/1/', what: 'read question 1', action: 'retrieve' },
  { method: 'PUT', url: '/api/questions/1/', what: 'replace question 1', action: 'update' },
  { method: 'PATCH', url: '/api/questions/1/', what: 'change part of question 1', action: 'partial_update' },
  { method: 'DELETE', url: '/api/questions/1/', what: 'delete question 1', action: 'destroy' },
]
const at = (i: number) => props.steps?.[i] ?? false
</script>

<template>
  <div class="routes" :class="{ actions }">
    <div v-for="(r, i) in ROUTES" :key="r.method + r.url" v-click="at(i)" class="row">
      <MethodBadge :method="r.method" />
      <code>{{ r.url }}</code>
      <span class="what">{{ r.what }}</span>
      <code v-if="actions" class="action">{{ r.action }}</code>
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
.routes.actions {
  grid-template-columns: auto auto auto 1fr;
  column-gap: 22px;
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
.action {
  color: var(--accent);
}
</style>
