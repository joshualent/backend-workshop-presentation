<!-- Full-bleed slide over the ambient network loop (pre-show, closing). -->
<template>
  <div class="slidev-layout stage">
    <AmbientNetwork density="light" />
    <div class="stage-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.stage { position: relative; height: 100%; overflow: hidden; }
.stage-content { position: relative; z-index: 1; height: 100%; }
</style>
