<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * The real POST /api/questions/ request and its real 201 response
 * (plan section 2), with one part in focus per click. Needs `clicks: 6`.
 * Headers are trimmed to the ones that matter; the values are real.
 */
const { $clicks } = useSlideContext()

const STEPS = [
  { part: '', say: 'One request and its response. Real ones, with a few headers left out.' },
  { part: 'method', say: 'The method says what to do. POST means create something.' },
  { part: 'url', say: 'The URL says which resource. This one is the list of questions.' },
  { part: 'headers', say: 'Headers describe the message. This body is JSON.' },
  { part: 'body', say: 'The body is the data you send.' },
  { part: 'status', say: 'The status code says what happened. 201 means created.' },
  { part: 'resBody', say: 'The server filled in id, votes, answered, and created_at.' },
]

const step = computed(() => STEPS[Math.min($clicks.value, STEPS.length - 1)])
const focus = computed(() => step.value.part)
const dim = (part: string) => (focus.value && focus.value !== part ? 'dim' : '')
const showResponse = computed(() => $clicks.value >= 5)
</script>

<template>
  <div class="anatomy">
    <div class="panels">
      <div class="panel">
        <div class="file-label">
          Request
        </div>
        <pre><span :class="dim('method')"><span class="post">POST</span></span> <span :class="dim('url')">/api/questions/</span> <span :class="dim('none')">HTTP/1.1</span>
<span :class="dim('headers')">Host: 127.0.0.1:8000
Content-Type: application/json</span>

<span :class="dim('body')">{"text": "What does a serializer do?"}</span></pre>
      </div>
      <div class="panel" :class="{ hidden: !showResponse }">
        <div class="file-label">
          Response
        </div>
        <pre><span :class="dim('status')">HTTP/1.1 <span class="ok">201 Created</span></span>
<span :class="dim('resHeaders')">Content-Type: application/json</span>

<span :class="dim('resBody')">{"id": 1,
 "text": "What does a serializer do?",
 "votes": 0,
 "answered": false,
 "created_at": "…"}</span></pre>
      </div>
    </div>
    <p class="say">
      {{ step.say }}
    </p>
  </div>
</template>

<style scoped>
.anatomy {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.panel {
  transition: opacity var(--t-build) ease;
}
.panel.hidden {
  opacity: 0;
}
pre {
  margin: 0;
  padding: var(--code-pad-y) var(--code-pad-x);
  background: var(--surface);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  line-height: var(--lh-code);
  color: var(--text);
  min-height: calc(8 * var(--lh-code) * var(--fs-code));
}
.dim {
  opacity: 0.4;
}
span {
  transition: opacity var(--t-build) ease;
}
.post {
  color: var(--post);
  font-weight: 700;
}
.ok {
  color: var(--status-2xx);
  font-weight: 700;
}
.say {
  font-size: var(--fs-body);
  min-height: 1.4em;
}
</style>
