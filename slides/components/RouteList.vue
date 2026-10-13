<script setup lang="ts">
/**
 * The six CRUD routes DefaultRouter makes for QuestionViewSet (from the
 * workshop README). `at` reveals them on that click.
 */
withDefaults(defineProps<{ at?: number | string | false, actions?: boolean }>(), { at: false, actions: false })

const ROUTES = [
  { method: 'GET', url: '/api/questions/', what: 'list', action: 'list' },
  { method: 'POST', url: '/api/questions/', what: 'create', action: 'create' },
  { method: 'GET', url: '/api/questions/1/', what: 'read question 1', action: 'retrieve' },
  { method: 'PUT', url: '/api/questions/1/', what: 'replace it', action: 'update' },
  { method: 'PATCH', url: '/api/questions/1/', what: 'update it', action: 'partial_update' },
  { method: 'DELETE', url: '/api/questions/1/', what: 'delete it', action: 'destroy' },
]
</script>

<template>
  <div v-click="at" class="routes">
    <template v-for="r in ROUTES" :key="r.method + r.url">
      <MethodBadge :method="r.method" />
      <code>{{ r.url }}</code>
      <span class="what" :class="{ action: actions }">{{ actions ? r.action : r.what }}</span>
    </template>
  </div>
</template>

<style scoped>
.routes {
  display: grid;
  grid-template-columns: auto auto 1fr;
  column-gap: 14px;
  row-gap: 5px;
  align-items: baseline;
  font-size: var(--fs-code);
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
.what.action {
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
}
</style>
