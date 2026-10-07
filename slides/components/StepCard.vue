<script setup lang="ts">
import { computed } from 'vue'

/**
 * "Now in VS Code" card for each coding step: the step, the file(s), the
 * command(s), and what you should see. Stays useful as a reference if anyone
 * glances back at the slides.
 */
const props = withDefaults(defineProps<{
  step: string | number
  title: string
  file?: string | string[]
  command?: string | string[]
  expect?: string
  highlight?: string
  mode?: string
}>(), {
  file: undefined,
  command: undefined,
  expect: undefined,
  highlight: undefined,
  mode: 'Now in VS Code',
})

const files = computed(() => props.file ? ([] as string[]).concat(props.file) : [])
const commands = computed(() => props.command ? ([] as string[]).concat(props.command) : [])
</script>

<template>
  <div class="step-card">
    <header>
      <div class="kicker">Step {{ step }} · {{ mode }}</div>
      <h1>{{ title }}</h1>
      <RequestFlowMap v-if="highlight" mini :highlight="highlight" class="map" />
    </header>

    <dl class="rows">
      <template v-if="files.length">
        <dt>File</dt>
        <dd class="files">
          <code v-for="f in files" :key="f">{{ f }}</code>
        </dd>
      </template>
      <template v-if="commands.length">
        <dt>Run</dt>
        <dd class="terminal">
          <span v-for="c in commands" :key="c" class="cmd"><span class="prompt">$</span> {{ c }}</span>
        </dd>
      </template>
      <template v-if="expect || $slots.expect">
        <dt>See</dt>
        <dd class="expect">
          <slot name="expect">{{ expect }}</slot>
        </dd>
      </template>
    </dl>

    <div v-if="$slots.default" class="extra">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.step-card { display: flex; flex-direction: column; gap: 16px; height: 100%; }
header h1 { margin: 2px 0 10px !important; }
.map { margin-top: 2px; }
.rows {
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 12px 18px;
  align-items: start;
  margin: 0;
}
dt {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  padding-top: 8px;
}
dd { margin: 0; }
.files { display: flex; flex-wrap: wrap; gap: 10px; }
.files code { font-size: 20px !important; }
.terminal {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
}
.cmd {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  white-space: pre;
}
.prompt { color: var(--accent); font-weight: 800; }
.expect {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  padding-top: 4px;
}
.extra { margin-top: 2px; }
</style>
