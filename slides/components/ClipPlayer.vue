<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed, ref } from 'vue'

/**
 * A pre-rendered showpiece clip from slides/public/media/clips/<name>.{webm,mp4,png}.
 * Muted, autoplay, seamless loop, playsinline. PDF export shows the poster.
 */
const props = withDefaults(defineProps<{
  name: string
  alt: string
  width?: string
  /** Show the poster frame only (backstage clip stills). */
  still?: boolean
}>(), { width: '100%', still: false })

const { isPrintMode } = useNav()
const base = `${import.meta.env.BASE_URL}media/clips/${props.name}`
const missing = ref(false)
const poster = computed(() => `${base}.png`)
</script>

<template>
  <div class="clip" :style="{ width }">
    <img v-if="(still || isPrintMode) && !missing" :src="poster" :alt="alt" @error="missing = true">
    <video
      v-else-if="!missing"
      :poster="poster"
      autoplay muted loop playsinline disablepictureinpicture
      preload="auto"
      :aria-label="alt"
      @error="missing = true"
    >
      <source :src="`${base}.webm`" type="video/webm">
      <source :src="`${base}.mp4`" type="video/mp4" @error="missing = true">
    </video>
    <div v-else class="placeholder missing">
      Clip "{{ name }}" not rendered yet: see animations/README.md
    </div>
  </div>
</template>

<style scoped>
.clip {
  aspect-ratio: 16 / 9;
  border-radius: var(--radius);
  overflow: hidden;
  border: var(--stroke) solid var(--border);
  background: var(--bg);
}
video, img { width: 100%; height: 100%; display: block; object-fit: cover; }
.missing { width: 100%; height: 100%; box-sizing: border-box; }
</style>
