<script setup lang="ts">
import { onSlideEnter, onSlideLeave, useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, ref, watch } from 'vue'
import videos from '../data/videos.json'

/**
 * A pre-rendered explainer video from public/media/videos/<name>.{webm,mp4,png}
 * (plan section 6.3). Stops come from data/videos.json, written by
 * animations/render.mjs, so they always match the rendered file.
 *
 *   <StepVideo name="v2-life-of-a-post" />   stepped: each click plays to the next stop
 *                                           and holds; a reverse click jumps back
 *   <StepVideo name="v1-…" loop />          loops silently while the slide is up
 *   <StepVideo name="v1-…" still />         the final frame only (appendix stills)
 *
 * Stepped videos need `clicks: <stops − 1>` in the slide frontmatter.
 * PDF export and the overview show the final frame, a complete summary.
 */
const props = withDefaults(defineProps<{ name: string, alt: string, loop?: boolean, still?: boolean }>(), { loop: false, still: false })

interface VideoMeta { duration: number, stops: number[] }
const meta = (videos as Record<string, VideoMeta>)[props.name]
const stops = meta?.stops ?? [0]

const { $clicks, $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
const isActive = useIsSlideActive()

const base = `${import.meta.env.BASE_URL}media/videos/${props.name}`
const video = ref<HTMLVideoElement>()
const failed = ref(!meta)
const posterMissing = ref(false)

const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const posterOnly = computed(() => props.still || isPrintMode.value || !live.value || failed.value)

const stopFor = (clicks: number) => stops[Math.max(0, Math.min(clicks, stops.length - 1))]

let raf = 0
let target = 0

function hold(t: number) {
  const v = video.value
  if (!v)
    return
  cancelAnimationFrame(raf)
  v.pause()
  if (Math.abs(v.currentTime - t) > 0.001)
    v.currentTime = t
}

/** Play forward from wherever the video is, and hold on the stop. */
function playTo(t: number) {
  const v = video.value
  if (!v)
    return
  target = t
  if (v.currentTime >= t - 0.01)
    return hold(t)
  cancelAnimationFrame(raf)
  v.play().catch(() => hold(t))
  const tick = () => {
    if (v.currentTime >= target - 1 / 60 || v.ended)
      return hold(target)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function sync(clicks: number, previous?: number) {
  if (props.loop || posterOnly.value)
    return
  if (isActive.value && previous != null && clicks === previous + 1)
    playTo(stopFor(clicks))
  else
    hold(stopFor(clicks))
}

watch($clicks, (now, before) => sync(now, before))

function onReady() {
  if (props.loop) {
    if (isActive.value && live.value)
      video.value?.play().catch(() => {})
  }
  else {
    hold(stopFor($clicks.value))
  }
}

onSlideEnter(() => {
  if (props.loop)
    video.value?.play().catch(() => {})
  else
    hold(stopFor($clicks.value))
})

onSlideLeave(() => {
  cancelAnimationFrame(raf)
  video.value?.pause()
})
</script>

<template>
  <div class="step-video">
    <div v-if="posterMissing" class="placeholder missing">
      Video "{{ name }}" isn't rendered yet: see animations/README.md
    </div>
    <img v-else-if="posterOnly" :src="`${base}.png`" :alt="alt" @error="posterMissing = true">
    <video
      v-else
      ref="video"
      :poster="`${base}.png`"
      muted playsinline disablepictureinpicture preload="auto"
      :loop="loop"
      :aria-label="alt"
      @loadedmetadata="onReady"
      @error="failed = true"
    >
      <source :src="`${base}.webm`" type="video/webm">
      <source :src="`${base}.mp4`" type="video/mp4" @error="failed = true">
    </video>
  </div>
</template>

<style scoped>
.step-video {
  /* The space under a title on the 980 × 552 canvas, at 16:9. */
  width: 760px;
  height: 428px;
  background: var(--bg);
}
.missing {
  height: 100%;
}
img,
video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
