<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/**
 * The recurring request-flow map (plan section 4.3):
 * Client → URL router → ViewSet → Serializer → Model → SQLite, JSON back.
 *
 *   <RequestMap />                          the whole map, file labels under each box
 *   <RequestMap :build="1" />               boxes appear left to right from click 1, then the return path
 *   <RequestMap :build="1" explain end="…" />  the same, with the newest part in focus and a sentence
 *                                           under the map about it; `end` replaces it one click later
 *   <RequestMap mini highlight="model" />   a one-line strip with one box in focus
 */
const props = withDefaults(defineProps<{
  /** Box ids in focus: client, router, viewset, serializer, model, db. */
  highlight?: string | string[]
  /** First click of a left-to-right build (boxes, then the return path). */
  build?: number
  /** One-line strip: box names only. */
  mini?: boolean
  /** Show the return path (full map only). */
  back?: boolean
  /** With `build`: focus the newest box (or the return path) and say what it does. */
  explain?: boolean
  /** With `explain`: the sentence for the click after the return path (add 1 to the slide's `clicks:`). */
  end?: string
}>(), { highlight: () => [], build: undefined, mini: false, back: true, explain: false, end: '' })

const BOXES = [
  { id: 'client', name: 'Client', file: 'browser', does: 'The client sends a request to the API. In this workshop, the client is your browser.' },
  { id: 'router', name: 'URL router', file: 'config/urls.py', does: 'The URL router reads the URL and the method, and picks the ViewSet method that handles the request.' },
  { id: 'viewset', name: 'ViewSet', file: 'views.py', does: 'The ViewSet handles the request. It has one method for each action, such as list or create.' },
  { id: 'serializer', name: 'Serializer', file: 'serializers.py', does: 'The serializer checks the JSON that comes in and turns it into a question. It also turns questions back into JSON.' },
  { id: 'model', name: 'Model', file: 'models.py', does: 'The model is a Python class that describes a question and its fields. Django uses it to read and write the database.' },
  { id: 'db', name: 'SQLite', file: 'db.sqlite3', does: 'SQLite is the database. It stores each question as a row in a table, in the file db.sqlite3.' },
]
const BACK_DOES = 'The response goes back to the client with a status code and JSON.'

const W = 900
const SLOT = W / BOXES.length
const BOX_W = 124
const BOX_H = computed(() => (props.mini ? 40 : 64))
const H = computed(() => (props.mini ? BOX_H.value + 2 : BOX_H.value + (props.back ? 82 : 40)))

const { $clicks } = useSlideContext()
/** While explaining: 0–5 is the newest box, 6 the return path, 7 the `end` sentence. */
const step = computed(() => (props.explain && props.build != null ? Math.max(0, $clicks.value - props.build + 1) : -1))
const explanation = computed(() => {
  if (step.value < 0) return ''
  if (step.value < BOXES.length) return BOXES[step.value].does
  return step.value === BOXES.length ? BACK_DOES : props.end || BACK_DOES
})
const backOn = computed(() => step.value === BOXES.length)

const focus = computed(() => {
  if (step.value >= 0) return new Set(step.value < BOXES.length ? [BOXES[step.value].id] : [])
  return new Set(Array.isArray(props.highlight) ? props.highlight : [props.highlight].filter(Boolean))
})
const anyFocus = computed(() => focus.value.size > 0 || backOn.value)

const boxes = computed(() => BOXES.map((b, i) => {
  const x = SLOT * i + (SLOT - BOX_W) / 2
  return { ...b, i, x, cx: x + BOX_W / 2, focused: focus.value.has(b.id) }
}))

/** Click on which box i (and the arrow into it) appears; `false` means always shown (no click). */
const clickFor = (i: number) => (props.build == null || i === 0 ? false : props.build + i - 1)
const backClick = computed(() => (props.build == null ? false : props.build + BOXES.length - 1))

const arrowY = computed(() => (props.mini ? 20 : 32))
const nameY = computed(() => BOX_H.value / 2 + 1)
const backY = computed(() => BOX_H.value + 56)
const client = computed(() => boxes.value[0])

const db = computed(() => boxes.value.at(-1)!)
</script>

<template>
  <div class="request-map-wrap">
    <svg
      class="request-map" :class="{ mini, focused: anyFocus }"
      :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H"
      role="img" aria-label="Client, URL router, ViewSet, Serializer, Model, SQLite, and JSON back to the client"
    >
      <defs>
        <marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="head" />
        </marker>
        <marker id="map-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="head-on" />
        </marker>
      </defs>

      <g v-for="b in boxes" :key="b.id" v-click="clickFor(b.i)" class="node" :class="{ on: b.focused }">
        <line
          v-if="b.i > 0"
          :x1="boxes[b.i - 1].x + BOX_W + 4" :y1="arrowY" :x2="b.x - 5" :y2="arrowY"
          class="edge" marker-end="url(#map-arrow)"
        />
        <rect :x="b.x" y="1" :width="BOX_W" :height="BOX_H - 2" rx="5" class="box" />
        <text :x="b.cx" :y="nameY" class="name">{{ b.name }}</text>
        <text v-if="!mini" :x="b.cx" :y="BOX_H + 24" class="file">{{ b.file }}</text>
      </g>

      <g v-if="back && !mini" v-click="backClick" class="back" :class="{ on: backOn }">
        <path
          :d="`M ${db.cx} ${BOX_H + 34} V ${backY} H ${client.cx} V ${BOX_H + 36}`"
          class="edge" :marker-end="backOn ? 'url(#map-arrow-on)' : 'url(#map-arrow)'"
        />
        <rect :x="W / 2 - 124" :y="backY - 13" width="248" height="26" class="label-bg" />
        <text :x="W / 2" :y="backY + 1" class="back-label">JSON back to the client</text>
      </g>
    </svg>
    <p v-if="explanation" class="explain">
      {{ explanation }}
    </p>
  </div>
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
.explain {
  max-width: 900px;
  margin-top: 28px;
  font-size: var(--fs-body);
  min-height: 2.8em;
}
.back.on .edge {
  stroke: var(--accent);
  stroke-width: 3px;
}
.head-on {
  fill: var(--accent);
}
.back.on .back-label {
  fill: var(--accent);
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
