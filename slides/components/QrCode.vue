<script setup lang="ts">
import QRCode from 'qrcode'
import { computed } from 'vue'
import { displayUrl, isPlaceholder } from '../workshop.config'

/**
 * A QR code drawn from the bundled `qrcode` library: no network, no image
 * fetch. Dark modules on the light text color so phones scan it off a
 * projector. A {{placeholder}} URL shows a marked placeholder box instead.
 */
const props = withDefaults(defineProps<{
  url: string
  size?: number
  showUrl?: boolean
}>(), { size: 170, showUrl: true })

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
      Placeholder: QR code. Set the URL in workshop.config.ts
    </div>
    <figcaption v-if="showUrl && !missing">
      <template v-for="(part, i) in displayUrl(url).split('/')" :key="i">{{ i ? '/' : '' }}<wbr v-if="i">{{ part }}</template>
    </figcaption>
  </figure>
</template>

<style scoped>
.qr {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
svg {
  display: block;
  border-radius: var(--radius-sm);
}
.light {
  fill: var(--text);
}
.dark {
  fill: var(--bg);
}
figcaption {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--text-2);
  text-align: center;
  max-width: 100%;
}
</style>
