<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { displayUrl, isPlaceholder, workshop } from '../workshop.config'

/**
 * The deployed board in an iframe. If the network is down (probe fails or the
 * browser goes offline) it swaps itself for the screenshot, so the slide never
 * shows a browser error page. `b` still jumps to the backstage fallback slide
 * for failures the probe can't see (e.g. the board refusing to be framed).
 */
const props = withDefaults(defineProps<{
  src?: string
  fallback?: string
  height?: number
  /** Scales the page inside the frame: 1 = 1:1, 0.8 = fit more rows. */
  zoom?: number
  /** Force the screenshot (used by the backstage fallback slides). */
  screenshot?: boolean
}>(), {
  src: () => workshop.liveBoardUrl,
  fallback: 'media/board/board-fallback.png',
  height: 420,
  zoom: 1,
  screenshot: false,
})

const { isPrintMode } = useNav()
type State = 'checking' | 'live' | 'offline' | 'unset'
const state = ref<State>(isPlaceholder(props.src) ? 'unset' : 'checking')
const imgMissing = ref(false)

const base = import.meta.env.BASE_URL
const fallbackSrc = computed(() => `${base}${props.fallback.replace(/^\//, '')}`)
const showFrame = computed(() => !props.screenshot && !isPrintMode.value && (state.value === 'live' || state.value === 'checking'))

async function probe() {
  if (state.value === 'unset' || props.screenshot || isPrintMode.value)
    return
  if (!navigator.onLine) {
    state.value = 'offline'
    return
  }
  try {
    await fetch(props.src, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(5000) })
    state.value = 'live'
  }
  catch {
    state.value = 'offline'
  }
}

const goOffline = () => { state.value = 'offline' }
const goOnline = () => { state.value = 'checking'; probe() }

onMounted(() => {
  probe()
  window.addEventListener('offline', goOffline)
  window.addEventListener('online', goOnline)
})
onUnmounted(() => {
  window.removeEventListener('offline', goOffline)
  window.removeEventListener('online', goOnline)
})

const badge = computed(() => showFrame.value ? 'Live' : 'Screenshot')
const frameStyle = computed(() => ({
  width: `${100 / props.zoom}%`,
  height: `${(props.height - 44) / props.zoom}px`,
  transform: `scale(${props.zoom})`,
}))
</script>

<template>
  <div class="board" :style="{ height: `${height}px` }">
    <div class="chrome">
      <span class="dots"><i /><i /><i /></span>
      <span class="address">{{ isPlaceholder(src) ? src : displayUrl(src) }}</span>
      <span class="badge" :class="showFrame ? 'live' : 'shot'">{{ badge }}</span>
    </div>
    <div class="viewport">
      <iframe
        v-if="showFrame"
        :src="src"
        :style="frameStyle"
        title="Live Q&A board"
        referrerpolicy="no-referrer"
      />
      <img
        v-else-if="!imgMissing"
        :src="fallbackSrc"
        alt="Screenshot of the Q&A board"
        @error="imgMissing = true"
      >
      <div v-else class="placeholder fill">
        No screenshot yet: run `pnpm capture:board` (saves {{ fallback }})
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
}
.chrome {
  height: 44px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 14px;
  border-bottom: var(--stroke) solid var(--border);
}
.dots { display: inline-flex; gap: 7px; }
.dots i { width: 12px; height: 12px; border-radius: 50%; background: var(--border); }
.address {
  flex: 1;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--text);
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.badge {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--bg);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
}
.badge.live { background: var(--ok); }
.badge.shot { background: var(--accent-2); }
.viewport { position: relative; flex: 1; overflow: hidden; background: var(--text); }
iframe { border: 0; display: block; transform-origin: 0 0; background: var(--text); }
img { width: 100%; height: 100%; object-fit: cover; object-position: top left; display: block; }
.fill { position: absolute; inset: 12px; background: var(--surface); }
</style>
