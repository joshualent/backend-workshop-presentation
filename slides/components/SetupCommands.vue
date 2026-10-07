<script setup lang="ts">
import { computed } from 'vue'
import { repoDirName, workshop } from '../workshop.config'

/** The four setup steps on the pre-show slide, built from workshop.config.ts. */
const cloneUrl = computed(() => `${workshop.starterRepoUrl.replace(/\/+$/, '')}.git`)
const STEPS = computed(() => [
  [`git clone ${cloneUrl.value}`, `cd ${repoDirName()}`],
  ['uv sync'],
  ['uv run python manage.py migrate'],
  ['uv run python manage.py runserver'],
])
</script>

<template>
  <div class="setup">
    <ol class="steps">
      <li v-for="(lines, i) in STEPS" :key="i">
        <span class="n">{{ i + 1 }}</span>
        <span class="lines">
          <code v-for="l in lines" :key="l">{{ l }}</code>
        </span>
      </li>
    </ol>
    <p class="done">
      <ph-check-circle-bold class="ok" />
      <span>Done? Open <span class="url">{{ workshop.localAdminUrl }}</span>, then scan the second QR code and ask a question.</span>
    </p>
  </div>
</template>

<style scoped>
.setup { display: flex; flex-direction: column; gap: 16px; }
.steps {
  list-style: none;
  margin: 0;
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-radius: var(--radius);
}
.steps li { display: grid; grid-template-columns: 30px 1fr; align-items: start; margin: 0; padding: 0; }
.steps li::before { display: none; }
.n { font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: var(--accent); line-height: 1.5; }
.lines { display: flex; flex-direction: column; }
.lines code {
  all: unset;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 600;
  color: var(--text);
  line-height: 1.6;
  white-space: nowrap;
}
.done { display: flex; gap: 12px; align-items: flex-start; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.35; }
.ok { flex: none; font-size: 30px; color: var(--ok); margin-top: 1px; }
.url { font-family: var(--font-mono); font-weight: 700; font-size: 21px; color: var(--accent); }
</style>
