<script setup lang="ts">
/**
 * Very slow ambient background: faint request dots drifting along lines
 * between nodes. Pure SVG/SMIL, muted by design, seamless 15 s cycle (every
 * dot's duration divides 15 s and fades in/out at the ends, so any frame
 * makes sense). Sits behind slide content and never takes clicks.
 */
withDefaults(defineProps<{ density?: 'full' | 'light' }>(), { density: 'full' })

type Pt = [number, number]
const NODES: Pt[] = [
  [40, 60], [210, 28], [400, 74], [610, 34], [800, 86], [950, 40],
  [70, 300], [930, 270], [120, 500], [330, 530], [560, 492], [760, 530], [940, 470],
]
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [5, 7], [6, 8], [8, 9], [9, 10], [10, 11], [11, 12], [7, 12], [4, 7], [1, 6],
]

// [edge index, duration s (divides 15), begin offset s, reverse?, color]
type Dot = [number, number, number, boolean, string]
const DOTS: Dot[] = [
  [0, 7.5, 0, false, 'var(--accent)'],
  [2, 15, -4, false, 'var(--get)'],
  [4, 7.5, -2, true, 'var(--post)'],
  [6, 15, -9, false, 'var(--accent)'],
  [8, 7.5, -5, false, 'var(--accent-2)'],
  [10, 15, -1, true, 'var(--get)'],
  [12, 7.5, -6, false, 'var(--accent)'],
  [13, 15, -11, true, 'var(--post)'],
  [1, 15, -7, true, 'var(--accent-2)'],
  [9, 7.5, -3, false, 'var(--accent)'],
]

function pathFor(e: number, reverse = false) {
  const [a, b] = EDGES[e]
  const [p, q] = reverse ? [NODES[b], NODES[a]] : [NODES[a], NODES[b]]
  return `M${p[0]} ${p[1]} L${q[0]} ${q[1]}`
}
</script>

<template>
  <svg class="ambient" :class="density" viewBox="0 0 980 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path v-for="(_, i) in EDGES" :key="`e${i}`" :d="pathFor(i)" class="edge" />
    <circle v-for="(n, i) in NODES" :key="`n${i}`" :cx="n[0]" :cy="n[1]" r="6" class="node" />
    <circle v-for="(d, i) in DOTS" :key="`d${i}`" r="4.5" :fill="d[4]" class="dot" opacity="0">
      <animateMotion :dur="`${d[1]}s`" :begin="`${d[2]}s`" repeatCount="indefinite" :path="pathFor(d[0], d[3])" />
      <animate attributeName="opacity" :dur="`${d[1]}s`" :begin="`${d[2]}s`" repeatCount="indefinite" values="0;0.7;0.7;0" keyTimes="0;0.15;0.85;1" />
    </circle>
  </svg>
</template>

<style scoped>
.ambient {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.edge { stroke: var(--border); stroke-width: var(--stroke); fill: none; }
.node { fill: var(--surface); stroke: var(--border); stroke-width: var(--stroke); }
.light .edge, .light .node { opacity: 0.6; }
</style>
