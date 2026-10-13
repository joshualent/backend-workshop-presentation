<script setup lang="ts">
import { computed } from 'vue'
import tree from '../snippets/checkpoint-0-setup/tree.txt?raw'

/**
 * The starter repo's real file list (snippets/checkpoint-0-setup/tree.txt,
 * from `git ls-tree`), drawn as an indented tree. Files in `highlight` are in focus;
 * files in `hide` are left out to keep it readable.
 */
const props = withDefaults(defineProps<{
  root?: string
  highlight?: string[]
  hide?: string[]
}>(), { root: 'questions-api', highlight: () => [], hide: () => [] })

interface Node { name: string, path: string, children: Map<string, Node> }

const lines = computed(() => {
  const top: Node = { name: props.root, path: '', children: new Map() }
  for (const path of tree.trim().split('\n')) {
    if (props.hide.some(h => path === h || path.startsWith(`${h}/`)))
      continue
    let node = top
    path.split('/').forEach((part, i, all) => {
      const p = all.slice(0, i + 1).join('/')
      if (!node.children.has(part))
        node.children.set(part, { name: part, path: p, children: new Map() })
      node = node.children.get(part)!
    })
  }
  const out: { depth: number, name: string, dir: boolean, on: boolean }[] = []
  const walk = (node: Node, depth: number) => {
    const kids = [...node.children.values()].sort((a, b) => {
      const ad = a.children.size > 0
      const bd = b.children.size > 0
      return ad === bd ? a.name.localeCompare(b.name) : ad ? -1 : 1
    })
    for (const kid of kids) {
      const dir = kid.children.size > 0
      out.push({ depth, name: dir ? `${kid.name}/` : kid.name, dir, on: props.highlight.includes(kid.path) })
      if (dir)
        walk(kid, depth + 1)
    }
  }
  walk(top, 1)
  return out
})
</script>

<template>
  <div class="file-tree">
    <div class="root">
      {{ root }}/
    </div>
    <div v-for="(l, i) in lines" :key="i" :class="{ on: l.on, dir: l.dir }" :style="{ paddingLeft: `${l.depth * 1.5}em` }">
      {{ l.name }}
    </div>
  </div>
</template>

<style scoped>
.file-tree {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 500;
  line-height: 1.45;
  color: var(--text);
}
.root,
.dir {
  color: var(--text-2);
}
.on {
  color: var(--accent);
  font-weight: 700;
}
</style>
