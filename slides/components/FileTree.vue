<script setup lang="ts">
/**
 * Slide 13: the starter repo's tree. `star` rows are the four files we edit
 * (in accent); `note` adds a short annotation on the right.
 */
interface Row { depth: number, name: string, dir?: boolean, star?: boolean, note?: string }

withDefaults(defineProps<{ root?: string }>(), { root: 'questions-api/' })

const ROWS: Row[] = [
  { depth: 1, name: 'config/', dir: true },
  { depth: 2, name: 'settings.py', note: 'DRF + questions app already wired' },
  { depth: 2, name: 'urls.py', star: true, note: 'router, commented out' },
  { depth: 1, name: 'questions/', dir: true },
  { depth: 2, name: 'models.py', star: true, note: 'step 1' },
  { depth: 2, name: 'serializers.py', star: true, note: 'step 2' },
  { depth: 2, name: 'views.py', star: true, note: 'steps 3–5' },
  { depth: 2, name: 'migrations/', dir: true },
  { depth: 1, name: 'manage.py', note: 'every command goes through this' },
]
</script>

<template>
  <div class="tree">
    <div class="root">{{ root }}</div>
    <div v-for="r in ROWS" :key="r.name" class="row" :class="{ star: r.star, dir: r.dir }">
      <span class="name" :style="{ paddingLeft: `${(r.depth - 1) * 32 + 8}px` }">
        <span class="branch">└</span>{{ r.name }}
      </span>
      <span v-if="r.note" class="note">{{ r.note }}</span>
    </div>
  </div>
</template>

<style scoped>
.tree {
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-radius: var(--radius);
  padding: 14px 20px;
  font-family: var(--font-mono);
}
.root { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
.row {
  display: grid;
  grid-template-columns: 300px 1fr;
  align-items: center;
  min-height: 35px;
  border-radius: var(--radius-sm);
}
.name { font-size: 20px; font-weight: 600; color: var(--text); white-space: nowrap; }
.branch { color: var(--text-muted); margin-right: 10px; }
.dir .name { color: var(--text-muted); font-weight: 700; }
.star { background: color-mix(in srgb, var(--accent) 16%, var(--surface)); }
.star .name { color: var(--accent); font-weight: 800; }
.note { font-family: var(--font-sans); font-size: 18px; font-weight: 600; color: var(--text-muted); }
.star .note { color: var(--text); }
</style>
