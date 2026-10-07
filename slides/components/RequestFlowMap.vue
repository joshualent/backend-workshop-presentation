<script setup lang="ts">
import { useIsSlideActive, useNav } from '@slidev/client'
import gsap from 'gsap'
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/**
 * The deck's spine: Client → Router → ViewSet → Serializer → Model → Database,
 * JSON back along the bottom.
 *
 * - `highlight`: box id(s) to light up ("model", "serializer,viewset", …)
 * - `stepped`: 7 clicks. A request packet walks box by box (1–5), the JSON
 *   response returns along the bottom (6), build-order steps appear (7).
 * - `morph`: 1 click. Labels morph from concept names to code names.
 * - `checks`: 1 click. Every box lights up with a check, plus one short burst.
 * - `labels`: static label set when not morphing.
 * - `mini`: compact one-line strip for step cards.
 */
type BoxId = 'client' | 'router' | 'viewset' | 'serializer' | 'model' | 'db'

const props = withDefaults(defineProps<{
  highlight?: string | string[]
  stepped?: boolean
  morph?: boolean
  checks?: boolean
  labels?: 'concept' | 'code'
  mini?: boolean
  at?: string | number
}>(), {
  highlight: undefined,
  labels: 'concept',
  at: '+1',
})

interface Box { id: BoxId, concept: string, code: string[], file?: string, buildStep?: number }

const BOXES: Box[] = [
  { id: 'client', concept: 'Client', code: ['Browsable', 'API'] },
  { id: 'router', concept: 'Router', code: ['Default', 'Router'], file: 'config/urls.py', buildStep: 3 },
  { id: 'viewset', concept: 'ViewSet', code: ['Question', 'ViewSet'], file: 'views.py', buildStep: 3 },
  { id: 'serializer', concept: 'Serializer', code: ['Question', 'Serializer'], file: 'serializers.py', buildStep: 2 },
  { id: 'model', concept: 'Model', code: ['Question'], file: 'models.py', buildStep: 1 },
  { id: 'db', concept: 'Database', code: ['SQLite'], file: 'db.sqlite3' },
]

// Geometry (SVG user units = CSS px at 1:1).
const W = 880
const BOX_W = 120
const PITCH = 152
const BOX_Y = 66
const BOX_H = 80
const BOX_CY = BOX_Y + BOX_H / 2
const FILE_Y = BOX_Y + BOX_H + 28
const LANE_Y = 232
const H = 262
const boxX = (i: number) => i * PITCH
const boxCX = (i: number) => i * PITCH + BOX_W / 2

// Marker ids must be unique: Slidev keeps neighbouring slides in the DOM.
const uid = `rfm-${useId()}`
const { isPrintMode } = useNav()
// The burst should follow a click made on this slide, never a jump onto it.
const isActive = useIsSlideActive()
let activeSince = 0
watch(isActive, (a) => { activeSince = a ? Date.now() : 0 }, { immediate: true, flush: 'sync' })

const STEPPED_CLICKS = 7
const clickCount = props.stepped ? STEPPED_CLICKS : (props.morph || props.checks) ? 1 : 0
const { step } = useStepClicks(clickCount, props.at)

const highlightSet = computed<Set<string>>(() => {
  if (props.stepped) {
    const s = step.value
    if (s >= 7)
      return new Set(['router', 'viewset', 'serializer', 'model'])
    if (s === 6)
      return new Set(['client'])
    return new Set([BOXES[s].id])
  }
  if (props.checks && step.value >= 1)
    return new Set(BOXES.map(b => b.id))
  const h = props.highlight
  if (!h)
    return new Set()
  return new Set(Array.isArray(h) ? h : h.split(/[\s,]+/).filter(Boolean))
})

const showCode = computed(() => props.morph ? step.value >= 1 : props.labels === 'code')
const showChecks = computed(() => props.checks && step.value >= 1)
const showBuildOrder = computed(() => props.stepped && step.value >= 7)

// ---------- Packets (stepped mode) ----------
const reqEl = ref<HTMLElement>()
const resEl = ref<HTMLElement>()
const burstEl = ref<HTMLElement>()

function packetLeft(el: HTMLElement | undefined, centerX: number) {
  const w = el?.offsetWidth ?? 0
  return Math.max(0, Math.min(W - w, centerX - w / 2))
}

function packetState(s: number) {
  const reqIndex = Math.min(s, 5)
  return {
    req: { x: packetLeft(reqEl.value, boxCX(reqIndex)), autoAlpha: s <= 5 ? 1 : 0 },
    res: {
      x: s >= 6 ? packetLeft(resEl.value, boxCX(0)) : packetLeft(resEl.value, boxCX(5)),
      autoAlpha: s >= 6 ? 1 : 0,
    },
  }
}

function placePackets(s: number, animate: boolean) {
  if (!props.stepped || !reqEl.value || !resEl.value)
    return
  const st = packetState(s)
  const opts = { duration: animate ? 0.6 : 0, ease: 'power2.out', overwrite: true }
  gsap.to(reqEl.value, { ...st.req, ...opts })
  if (animate && s >= 6 && resEl.value) {
    gsap.fromTo(resEl.value, { x: packetLeft(resEl.value, boxCX(5)), autoAlpha: 1 }, { ...st.res, ...opts, duration: 0.7 })
  }
  else {
    gsap.to(resEl.value, { ...st.res, ...opts })
  }
}

// ---------- Burst (checks mode, ≤ 1.5 s, the deck's only celebration) ----------
const BURST_COLORS = ['var(--accent)', 'var(--accent-2)', 'var(--get)', 'var(--post)', 'var(--delete)', 'var(--text)']

function burst() {
  const host = burstEl.value
  if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  const pieces: HTMLElement[] = []
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('span')
    p.className = 'confetti'
    p.style.background = BURST_COLORS[i % BURST_COLORS.length]
    host.appendChild(p)
    pieces.push(p)
  }
  const tl = gsap.timeline({ onComplete: () => pieces.forEach(p => p.remove()) })
  pieces.forEach((p, i) => {
    const angle = (i / pieces.length) * Math.PI * 2 + Math.random() * 0.3
    const dist = 140 + Math.random() * 200
    tl.fromTo(p, { x: 0, y: 0, rotate: 0, autoAlpha: 1, scale: 1 }, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist * 0.6 + 40,
      rotate: (Math.random() - 0.5) * 360,
      duration: 1.1,
      ease: 'power3.out',
    }, 0)
    tl.to(p, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 1.05)
  })
}

onMounted(async () => {
  await nextTick()
  placePackets(step.value, false)
})

watch(step, (s, prev) => {
  placePackets(s, true)
  // Only a real click fires the burst: not a deep link, a jump back, or PDF export.
  if (props.checks && s >= 1 && prev === 0 && !isPrintMode.value && activeSince && Date.now() - activeSince > 400)
    burst()
})
</script>

<template>
  <!-- Compact strip for step cards -->
  <div v-if="mini" class="flow-mini" role="img" :aria-label="`Request flow, highlighting ${[...highlightSet].join(', ')}`">
    <template v-for="(b, i) in BOXES" :key="b.id">
      <span v-if="i > 0" class="mini-arrow">→</span>
      <span class="mini-box" :class="{ on: highlightSet.has(b.id) }">{{ b.concept }}</span>
    </template>
  </div>

  <div v-else class="flow-map" :style="{ width: `${W}px`, height: `${H}px` }">
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" aria-label="Request flow: Client, Router, ViewSet, Serializer, Model, Database, and JSON back to the client">
      <defs>
        <marker :id="`${uid}-a`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="arrowhead" />
        </marker>
        <marker :id="`${uid}-r`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="arrowhead res" />
        </marker>
        <marker :id="`${uid}-b`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="arrowhead build" />
        </marker>
      </defs>

      <!-- request arrows -->
      <line
        v-for="i in 5" :key="`a${i}`"
        :x1="boxX(i - 1) + BOX_W + 2" :y1="BOX_CY" :x2="boxX(i) - 3" :y2="BOX_CY"
        class="link" :marker-end="`url(#${uid}-a)`"
      />

      <!-- JSON return lane -->
      <path
        :d="`M ${W - 2} ${BOX_Y + BOX_H - 10} V ${LANE_Y} H 2 V ${BOX_Y + BOX_H + 4}`"
        class="lane" :marker-end="`url(#${uid}-r)`"
      />
      <g v-if="!stepped" class="lane-label">
        <rect :x="W / 2 - 112" :y="LANE_Y - 15" width="224" height="30" rx="6" />
        <text :x="W / 2" :y="LANE_Y + 6" text-anchor="middle">JSON back to the client</text>
      </g>

      <!-- build order (stepped, last click) -->
      <g class="build-order" :class="{ on: showBuildOrder }">
        <line :x1="boxCX(4) + 34" y1="50" :x2="boxCX(1) - 34" y2="50" class="build-line" :marker-end="`url(#${uid}-b)`" />
        <g v-for="(b, i) in BOXES" :key="`s${b.id}`">
          <g v-if="b.buildStep">
            <rect :x="boxCX(i) - 34" y="10" width="68" height="28" rx="6" class="build-chip" />
            <text :x="boxCX(i)" y="30" text-anchor="middle" class="build-text">STEP {{ b.buildStep }}</text>
          </g>
        </g>
      </g>

      <!-- boxes -->
      <g v-for="(b, i) in BOXES" :key="b.id" class="box" :class="{ on: highlightSet.has(b.id) }">
        <rect :x="boxX(i)" :y="BOX_Y" :width="BOX_W" :height="BOX_H" rx="10" class="box-rect" />
        <text :x="boxCX(i)" :y="BOX_CY + 7" text-anchor="middle" class="box-label concept" :class="{ out: showCode }">{{ b.concept }}</text>
        <text
          v-for="(line, li) in b.code" :key="li"
          :x="boxCX(i)" :y="BOX_CY + 6 + (li - (b.code.length - 1) / 2) * 22"
          text-anchor="middle" class="box-label code" :class="{ in: showCode }"
        >{{ line }}</text>
        <text v-if="b.file" :x="boxCX(i)" :y="FILE_Y" text-anchor="middle" class="file-label">{{ b.file }}</text>
        <g class="check" :class="{ on: showChecks }" :style="{ transitionDelay: `${i * 70}ms` }">
          <circle :cx="boxX(i) + BOX_W - 6" :cy="BOX_Y + 6" r="15" />
          <path :d="`M ${boxX(i) + BOX_W - 13} ${BOX_Y + 6} l 5 5 l 9 -10`" />
        </g>
      </g>
    </svg>

    <template v-if="stepped">
      <div ref="reqEl" class="packet-pos req">
        <Packet method="GET" label="/api/questions/" />
      </div>
      <div ref="resEl" class="packet-pos res">
        <Packet kind="response" label='200 [{"text": …}]' />
      </div>
    </template>

    <div ref="burstEl" class="burst" aria-hidden="true" />
  </div>
</template>

<style scoped>
.flow-map {
  position: relative;
  margin: 0 auto;
}
svg { display: block; overflow: visible; }

.link { stroke: var(--text-muted); stroke-width: var(--stroke-bold); }
.arrowhead { fill: var(--text-muted); }
.arrowhead.res { fill: var(--accent-2); }
.arrowhead.build { fill: var(--accent); }
.lane { fill: none; stroke: var(--accent-2); stroke-width: var(--stroke-bold); stroke-linejoin: round; }
.lane-label rect { fill: var(--bg); }
.lane-label text {
  fill: var(--accent-2);
  font-family: var(--font-sans);
  font-size: 18px;
  font-weight: 700;
}

.box-rect {
  fill: var(--surface);
  stroke: var(--border);
  stroke-width: var(--stroke-bold);
  transition: fill var(--dur-step) var(--ease-out), stroke var(--dur-step) var(--ease-out);
}
.box.on .box-rect {
  fill: color-mix(in srgb, var(--accent) 22%, var(--surface));
  stroke: var(--accent);
}
.box-label {
  fill: var(--text);
  transition: opacity var(--dur-step) var(--ease-out), transform var(--dur-step) var(--ease-out);
}
.box-label.concept { font-family: var(--font-sans); font-size: 20px; font-weight: 800; }
.box-label.concept.out { opacity: 0; transform: translateY(-10px); }
.box-label.code { font-family: var(--font-mono); font-size: 16px; font-weight: 800; opacity: 0; transform: translateY(10px); }
.box-label.code.in { opacity: 1; transform: none; }
.file-label {
  fill: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 600;
}

.check { opacity: 0; transform: scale(0.6); transform-box: fill-box; transform-origin: center; transition: opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out); }
.check.on { opacity: 1; transform: none; }
.check circle { fill: var(--ok); stroke: var(--bg); stroke-width: 3px; }
.check path { fill: none; stroke: var(--bg); stroke-width: 3.5px; stroke-linecap: round; stroke-linejoin: round; }

.build-order { opacity: 0; transition: opacity var(--dur-step) var(--ease-out); }
.build-order.on { opacity: 1; }
.build-chip { fill: var(--accent); }
.build-text { fill: var(--bg); font-family: var(--font-mono); font-size: var(--fs-label); font-weight: 800; }
.build-line { stroke: var(--accent); stroke-width: var(--stroke-bold); }

.packet-pos { position: absolute; left: 0; will-change: transform; }
.packet-pos.req { top: 8px; }
.packet-pos.res { top: calc(232px - 21px); opacity: 0; visibility: hidden; }

.burst { position: absolute; left: 50%; top: 45%; width: 0; height: 0; pointer-events: none; }
.burst :deep(.confetti) {
  position: absolute;
  width: 10px;
  height: 16px;
  border-radius: 2px;
  margin: -8px 0 0 -5px;
}

/* ---------- mini ---------- */
.flow-mini {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}
.mini-box {
  font-family: var(--font-sans);
  font-size: var(--fs-label);
  font-weight: 700;
  color: var(--text);
  background: var(--surface);
  border: var(--stroke) solid var(--border);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  white-space: nowrap;
}
.mini-box.on {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 22%, var(--surface));
}
.mini-arrow {
  color: var(--text-muted);
  font-weight: 800;
  font-size: 18px;
}
</style>
