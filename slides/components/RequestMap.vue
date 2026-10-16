<script setup lang="ts">
import { computed } from 'vue'

/**
 * The recurring request-flow map (plan section 4.3), laid out in the order we
 * build it: SQLite, Model, Serializer, ViewSet, URL router, Client. Requests
 * travel right to left along the arrows; the JSON goes back underneath.
 *
 *   <RequestMap />                          the whole map, file labels under each box
 *   <RequestMap :build="1" />               boxes appear left to right from click 1, then the return path
 *   <RequestMap mini highlight="model" />   a one-line strip with one box in focus
 *   <RequestMap permission />               a permission check inside the ViewSet box (lesson 3)
 */
const props = withDefaults(defineProps<{
  /** Box ids in focus: client, router, viewset, serializer, model, db. */
  highlight?: string | string[]
  /** First click of a left-to-right build (boxes, then the return path). */
  build?: number
  /** Show the permission check inside ViewSet; a number reveals it on that click. */
  permission?: boolean | number
  /** One-line strip: box names only. */
  mini?: boolean
  /** Show the return path (full map only). */
  back?: boolean
}>(), { highlight: () => [], build: undefined, permission: false, mini: false, back: true })

const BOXES = [
  { id: 'db', name: 'SQLite', file: 'db.sqlite3' },
  { id: 'model', name: 'Model', file: 'models.py' },
  { id: 'serializer', name: 'Serializer', file: 'serializers.py' },
  { id: 'viewset', name: 'ViewSet', file: 'views.py' },
  { id: 'router', name: 'URL router', file: 'config/urls.py' },
  { id: 'client', name: 'Client', file: 'browser, curl' },
]

const W = 900
const SLOT = W / BOXES.length
const BOX_W = 124
const showPermission = computed(() => props.permission !== false)
const BOX_H = computed(() => (props.mini ? (showPermission.value ? 64 : 40) : showPermission.value ? 86 : 64))
const H = computed(() => (props.mini ? BOX_H.value + 2 : BOX_H.value + (props.back ? 82 : 40)))

const focus = computed(() => new Set(Array.isArray(props.highlight) ? props.highlight : [props.highlight].filter(Boolean)))
const anyFocus = computed(() => focus.value.size > 0)

const boxes = computed(() => BOXES.map((b, i) => {
  const x = SLOT * i + (SLOT - BOX_W) / 2
  return { ...b, i, x, cx: x + BOX_W / 2, focused: focus.value.has(b.id) }
}))

/** Click on which box i (and the arrow into it) appears; `false` means always shown (no click). */
const clickFor = (i: number) => (props.build == null || i === 0 ? false : props.build + i - 1)
const backClick = computed(() => (props.build == null ? false : props.build + BOXES.length - 1))
const permissionClick = computed(() => (typeof props.permission === 'number' ? props.permission : false))

const arrowY = computed(() => (props.mini ? (showPermission.value ? 18 : 20) : 32))
const nameY = computed(() => (showPermission.value ? (props.mini ? 18 : 28) : BOX_H.value / 2 + 1))
const permY = computed(() => (props.mini ? 30 : 44))
const backY = computed(() => BOX_H.value + 56)
const client = computed(() => boxes.value.find(b => b.id === 'client')!)
const db = computed(() => boxes.value.find(b => b.id === 'db')!)
</script>

<template>
  <svg
    class="request-map" :class="{ mini, focused: anyFocus }"
    :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H"
    role="img" aria-label="SQLite, Model, Serializer, ViewSet, URL router, and Client. Requests go from the client to SQLite, and JSON goes back to the client"
  >
    <defs>
      <marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" class="head" />
      </marker>
    </defs>

    <g v-for="b in boxes" :key="b.id" v-click="clickFor(b.i)" class="node" :class="{ on: b.focused }">
      <line
        v-if="b.i > 0"
        :x1="boxes[b.i - 1].x + BOX_W + 5" :y1="arrowY" :x2="b.x - 4" :y2="arrowY"
        class="edge" marker-start="url(#map-arrow)"
      />
      <rect :x="b.x" y="1" :width="BOX_W" :height="BOX_H - 2" rx="5" class="box" />
      <text :x="b.cx" :y="nameY" class="name">{{ b.name }}</text>
      <text v-if="!mini" :x="b.cx" :y="BOX_H + 24" class="file">{{ b.file }}</text>
      <g v-if="b.id === 'viewset' && showPermission" v-click="permissionClick" class="perm">
        <rect :x="b.x + 7" :y="permY" :width="BOX_W - 14" height="28" rx="4" />
        <text :x="b.cx" :y="permY + 15">permissions</text>
      </g>
    </g>

    <g v-if="back && !mini" v-click="backClick" class="back">
      <path
        :d="`M ${db.cx} ${BOX_H + 34} V ${backY} H ${client.cx} V ${BOX_H + 36}`"
        class="edge" marker-end="url(#map-arrow)"
      />
      <rect :x="W / 2 - 124" :y="backY - 13" width="248" height="26" class="label-bg" />
      <text :x="W / 2" :y="backY + 1" class="back-label">JSON back to the client</text>
    </g>
  </svg>
</template>

<style scoped>
.request-map {
  display: block;
  overflow: visible;
  font-family: var(--font-sans);
}
.box {
  fill: var(--bg);
  stroke: var(--stroke);
  stroke-width: var(--stroke-w);
}
.edge {
  fill: none;
  stroke: var(--stroke);
  stroke-width: var(--stroke-w);
}
.head {
  fill: var(--stroke);
}
.name {
  fill: var(--text);
  font-size: 19px;
  font-weight: 650;
  text-anchor: middle;
  dominant-baseline: middle;
}
.mini .name {
  font-size: var(--fs-label);
}
.file {
  fill: var(--text-2);
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 500;
  text-anchor: middle;
}
.focused .node:not(.on) .name {
  fill: var(--text-2);
}
.node.on .box {
  stroke: var(--accent);
  stroke-width: 3px;
}
.node.on .name {
  fill: var(--accent);
}
.perm rect {
  fill: var(--surface);
  stroke: var(--accent);
  stroke-width: var(--stroke-w);
}
.perm text {
  fill: var(--accent);
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
}
.label-bg {
  fill: var(--bg);
}
.back-label {
  fill: var(--text-2);
  font-size: var(--fs-label);
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
}
</style>
