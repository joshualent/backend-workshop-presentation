<script setup lang="ts">
/**
 * One real request and its real response (plan section 2), on two lines.
 * `at` reveals the response on that click; leave it out to show both.
 */
withDefaults(defineProps<{
  method: string
  url: string
  body?: string
  who?: string
  status: number
  statusText?: string | boolean
  response?: string
  at?: number | string | false
}>(), { body: undefined, who: undefined, statusText: true, response: undefined, at: false })
</script>

<template>
  <div class="exchange">
    <div class="req">
      <span v-if="who" class="who">{{ who }}</span>
      <MethodBadge :method="method" />
      <code class="url">{{ url }}</code>
      <code v-if="body" class="body">{{ body }}</code>
    </div>
    <div v-click="at" class="res">
      <span v-if="who" class="who" aria-hidden="true" />
      <StatusBadge :code="status" :text="statusText" />
      <code v-if="response" class="json">{{ response }}</code>
    </div>
  </div>
</template>

<style scoped>
.exchange {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--fs-code);
}
.req,
.res {
  display: flex;
  align-items: baseline;
  gap: 12px;
  white-space: nowrap;
}
.who {
  flex: none;
  width: 108px;
  font-family: var(--font-sans);
  font-size: var(--fs-small);
  font-weight: var(--fw-strong);
  color: var(--text);
}
code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  color: var(--text);
}
.body,
.json {
  color: var(--text-2);
}
</style>
