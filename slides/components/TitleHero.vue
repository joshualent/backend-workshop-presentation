<script setup lang="ts">
/**
 * Title slide in three visual directions (plan phase 1). Slide 1 uses the
 * chosen one; the other two live backstage for comparison.
 *   a: stacked display type     b: title + terminal     c: request line
 */
withDefaults(defineProps<{ variant?: 'a' | 'b' | 'c' }>(), { variant: 'a' })
</script>

<template>
  <div class="hero" :class="`v-${variant}`">
    <AmbientNetwork :density="variant === 'a' ? 'full' : 'light'" />

    <!-- A: stacked display type -->
    <div v-if="variant === 'a'" class="content a">
      <ClubWordmark :height="52" />
      <div class="stack">
        <div class="kicker">Backend Workshop</div>
        <h1 class="display big">Build a Q&amp;A API</h1>
        <div class="sub">with Python, Django &amp; Django REST Framework</div>
      </div>
      <div class="meta">Monday, Oct 19 · Floyd Hall D-109</div>
    </div>

    <!-- B: title + terminal -->
    <div v-else-if="variant === 'b'" class="content b">
      <div class="left">
        <ClubWordmark :height="44" />
        <h1 class="display mid">Build a<br>Q&amp;A API</h1>
        <div class="sub">Python · Django · DRF</div>
        <div class="meta">Mon, Oct 19 · Floyd Hall D-109</div>
      </div>
      <div class="terminal">
        <div class="prompt-line"><span class="p">$</span> curl …/questions/?ordering=-votes</div>
        <pre class="json">[
  {
    "id": 4,
    "text": "Do I need SQL?",
    "votes": 9,
    "answered": false
  },
  …
]</pre>
      </div>
    </div>

    <!-- C: request line -->
    <div v-else class="content c">
      <ClubWordmark :height="44" />
      <div class="request">
        <MethodBadge method="POST" size="lg" />
        <span class="path">/api/questions/</span>
        <StatusBadge :code="201" size="lg" />
      </div>
      <h1 class="display mid">Build a Q&amp;A API</h1>
      <div class="sub">with Python, Django &amp; Django REST Framework</div>
      <div class="meta">Monday, Oct 19 · Floyd Hall D-109</div>
    </div>
  </div>
</template>

<style scoped>
.hero { position: absolute; inset: 0; overflow: hidden; }
.content { position: relative; z-index: 1; height: 100%; box-sizing: border-box; padding: 40px 56px; }
.display { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; color: var(--text); margin: 0 !important; line-height: 0.95 !important; letter-spacing: 0.005em; }
.display.big { font-size: 112px !important; }
.display.mid { font-size: 88px !important; }
.sub { font-size: 30px; font-weight: 600; color: var(--text); }
.meta { font-size: 24px; font-weight: 700; color: var(--accent); }

.a { display: flex; flex-direction: column; justify-content: space-between; }
.a .stack { display: flex; flex-direction: column; gap: 14px; }
.a .kicker { font-size: 20px; }

.b { display: grid; grid-template-columns: 1fr 440px; gap: 36px; align-items: center; }
.b .left { display: flex; flex-direction: column; gap: 18px; }
.terminal {
  background: var(--surface);
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 600;
}
.prompt-line { color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.p { color: var(--accent); font-weight: 800; }
.json { margin: 10px 0 0; color: var(--accent-2); font: inherit; line-height: 1.45; }

.c { display: flex; flex-direction: column; justify-content: center; gap: 18px; }
.c .request { display: flex; align-items: center; gap: 18px; margin-top: 30px; }
.c .path { font-family: var(--font-mono); font-size: 40px; font-weight: 800; }
.c :deep(.wordmark), .c :deep(.wordmark-ph) { position: absolute; top: 40px; left: 56px; }
</style>
