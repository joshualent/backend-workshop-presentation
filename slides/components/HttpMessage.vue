<script setup lang="ts">
import { computed } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/**
 * A request (method, URL, headers, body) that builds part by part on clicks,
 * then the response (status, body) appears beneath it. 5 clicks when stepped.
 */
const props = withDefaults(defineProps<{
  method?: string
  url?: string
  headers?: string[]
  body?: string
  status?: number
  responseBody?: string
  stepped?: boolean
  at?: string | number
}>(), {
  method: 'POST',
  url: '/api/questions/',
  headers: () => ['Content-Type: application/json'],
  body: '{"text": "What is a serializer?"}',
  status: 201,
  responseBody: '{"id": 7, "text": "What is a serializer?",\n "votes": 0, "answered": false,\n "created_at": "2026-10-19T19:07:12-04:00"}',
  stepped: true,
  at: '+1',
})

const { step } = useStepClicks(props.stepped ? 5 : 0, props.at)

// part index → click that reveals it
const PARTS = { method: 1, url: 2, headers: 3, body: 4, response: 5 } as const
type Part = keyof typeof PARTS

const shown = (p: Part) => step.value >= PARTS[p]
const current = (p: Part) => props.stepped && step.value === PARTS[p]
const cls = (p: Part) => computed(() => ({ hidden: !shown(p), current: current(p) }))

const methodCls = cls('method')
const urlCls = cls('url')
const headersCls = cls('headers')
const bodyCls = cls('body')
const responseCls = cls('response')
</script>

<template>
  <div class="http">
    <section class="panel request">
      <div class="panel-title">Request</div>
      <div class="row request-line">
        <span class="tag" :class="methodCls">method</span>
        <span class="part" :class="methodCls"><MethodBadge :method="method" size="lg" /></span>
        <span class="tag tag-inline" :class="urlCls">URL</span>
        <span class="part url" :class="urlCls">{{ url }}</span>
      </div>
      <div class="row">
        <span class="tag" :class="headersCls">headers</span>
        <span class="part code" :class="headersCls">
          <span v-for="h in headers" :key="h" class="line">{{ h }}</span>
        </span>
      </div>
      <div class="row">
        <span class="tag" :class="bodyCls">body</span>
        <span class="part code" :class="bodyCls">{{ body }}</span>
      </div>
    </section>

    <section class="panel response" :class="responseCls">
      <div class="panel-title">Response</div>
      <div class="row">
        <span class="tag">status</span>
        <span class="part"><StatusBadge :code="status" size="lg" /></span>
      </div>
      <div class="row">
        <span class="tag">body</span>
        <span class="part code pre">{{ responseBody }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.http { display: grid; gap: 14px; }
.panel {
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-left: 6px solid var(--accent);
  border-radius: var(--radius);
  padding: 10px 18px 12px;
  transition: opacity var(--dur-step) var(--ease-out), translate var(--dur-step) var(--ease-out);
}
.panel.response { border-left-color: var(--accent-2); }
.panel.response.hidden { opacity: 0; translate: 0 14px; }
.panel-title {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 6px;
}
.response .panel-title { color: var(--accent-2); }

.row {
  display: grid;
  grid-template-columns: 100px auto 1fr;
  align-items: center;
  gap: 4px 14px;
  min-height: 44px;
}
.request-line { grid-template-columns: 100px auto auto 1fr; }
.tag {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 700;
  color: var(--text-muted);
  text-align: right;
}
.tag-inline { text-align: left; }
.part {
  border-radius: var(--radius-sm);
  outline: 3px solid transparent;
  outline-offset: 4px;
  transition: opacity var(--dur-step) var(--ease-out), outline-color var(--dur-fast) var(--ease-out), translate var(--dur-step) var(--ease-out);
}
.part.current { outline-color: var(--accent); }
.tag.current { color: var(--accent); }
.hidden { opacity: 0; translate: 0 8px; }
.tag.hidden { translate: none; }

.url, .code {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text);
}
.url { font-size: 24px; }
.code { font-size: var(--fs-code); line-height: 1.45; }
.line { display: block; }
.pre { white-space: pre; }
</style>
