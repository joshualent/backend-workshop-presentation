<script setup lang="ts">
import { computed } from 'vue'
import { isPlaceholder, workshop } from '../workshop.config'

/**
 * The Developer Club logo (title and closing slides only, plan section 11).
 * Until the logo file is provided it shows a marked placeholder; set
 * `logo: null` in workshop.config.ts to use the club name as plain text.
 */
withDefaults(defineProps<{ height?: number }>(), { height: 56 })
const logo = workshop.logo
const missing = computed(() => isPlaceholder(logo))
const src = computed(() => (logo && !missing.value ? `${import.meta.env.BASE_URL}${logo.replace(/^\//, '')}` : null))
</script>

<template>
  <img v-if="src" class="club-logo" :src="src" :alt="workshop.host" :style="{ height: `${height}px` }">
  <div v-else-if="missing" class="placeholder" :style="{ height: `${height}px` }">
    Placeholder: Developer Club logo (set logo in workshop.config.ts)
  </div>
  <div v-else class="club-name">
    {{ workshop.host }}
  </div>
</template>

<style scoped>
.club-logo {
  display: block;
  width: auto;
}
.placeholder {
  padding: 4px 16px;
}
.club-name {
  font-size: var(--fs-small);
  font-weight: var(--fw-strong);
  color: var(--text-2);
}
</style>
