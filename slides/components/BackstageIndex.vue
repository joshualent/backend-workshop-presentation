<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'
import { isBackstage } from '../composables/backstage'

/** Lists every backstage slide with the number to type after `g`. */
const { slides } = useNav()
const rows = computed(() => slides.value
  .filter(s => isBackstage(s))
  .map(s => ({
    no: s.no,
    plan: s.meta.slide?.frontmatter?.plan,
    title: s.meta.slide?.frontmatter?.backstageTitle ?? s.meta.slide?.title ?? '',
  }))
  .filter(r => r.plan !== 'A0'))
</script>

<template>
  <div class="index">
    <div v-for="r in rows" :key="r.no" class="row">
      <span class="no">{{ r.no }}</span>
      <span class="title">{{ r.title }}</span>
    </div>
  </div>
</template>

<style scoped>
.index { columns: 2; column-gap: 32px; }
.row { display: grid; grid-template-columns: 52px 1fr; align-items: baseline; break-inside: avoid; margin-bottom: 6px; }
.no { font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: var(--accent); }
.title { font-size: 18px; font-weight: 600; }
</style>
