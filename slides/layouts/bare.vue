<!-- No padding; the slide content positions itself (title directions). -->
<template>
  <div class="slidev-layout bare">
    <slot />
  </div>
</template>

<style scoped>
.bare { position: relative; height: 100%; padding: 0; overflow: hidden; }
</style>
