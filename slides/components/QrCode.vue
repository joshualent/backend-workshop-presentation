<script setup lang="ts">
import QRCode from 'qrcode'
import { computed } from 'vue'
import { displayUrl, isPlaceholder } from '../workshop.config'

/**
 * QR code drawn from the bundled `qrcode` library (no network, no image
 * fetch). Dark modules on the light token so phones scan it off a projector.
 * A `{{…}}` placeholder URL renders a clearly marked "not set" box instead.
 */
const props = withDefaults(defineProps<{
  url: string
  size?: number
  caption?: string
  showUrl?: boolean
}>(), { size: 180, caption: undefined, showUrl: true })

const missing = computed(() => isPlaceholder(props.url))

const qr = computed(() => {
  if (missing.value)
    return null
  const { modules } = QRCode.create(props.url, { errorCorrectionLevel: 'M' })
  const n = modules.size
  let d = ''
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (modules.get(x, y))
        d += `M${x} ${y}h1v1h-1z`
    }
  }
  return { n, d }
})

const QUIET = 3
</script>

<template>
  <figure class="qr">
    <svg
      v-if="qr" :width="size" :height="size"
      :viewBox="`${-QUIET} ${-QUIET} ${qr.n + QUIET * 2} ${qr.n + QUIET * 2}`"
      shape-rendering="crispEdges" role="img" :aria-label="`QR code for ${url}`"
    >
      <rect :x="-QUIET" :y="-QUIET" :width="qr.n + QUIET * 2" :height="qr.n + QUIET * 2" class="light" />
      <path :d="qr.d" class="dark" />
    </svg>
    <div v-else class="placeholder" :style="{ width: `${size}px`, height: `${size}px` }">
      QR appears when<br>{{ url }}<br>is set
    </div>
    <figcaption v-if="caption || showUrl">
      <span v-if="caption" class="caption">{{ caption }}</span>
      <span v-if="showUrl && !missing" class="url">{{ displayUrl(url) }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.qr { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }
svg { display: block; border-radius: var(--radius-sm); }
.light { fill: var(--text); }
.dark { fill: var(--bg); }
figcaption { display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
.caption { font-size: 18px; font-weight: 700; color: var(--text); white-space: nowrap; }
.url {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}
.placeholder { font-size: var(--fs-label); line-height: 1.35; overflow-wrap: anywhere; box-sizing: border-box; }
</style>
