<script setup lang="ts">
/**
 * What a backend does (plan slide 3): a request goes in, the server does
 * the work, a response comes back. Click 1: request. Click 2: the work.
 * Click 3: response.
 */
</script>

<template>
  <svg class="round-trip" viewBox="0 0 900 230" width="900" height="230" role="img" aria-label="A client sends a request to a server, the server does the work, and a response comes back">
    <defs>
      <marker id="rt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" class="head" />
      </marker>
    </defs>

    <rect x="1" y="50" width="180" height="150" rx="6" class="box" />
    <text x="91" y="116" class="name">Client</text>
    <text x="91" y="144" class="sub">browser, app</text>

    <rect x="599" y="50" width="300" height="150" rx="6" class="box" />
    <text x="749" y="92" class="name">Server</text>
    <text x="749" y="120" class="sub">the backend</text>
    <g v-click="2">
      <text x="749" y="158" class="work">reads and writes data,</text>
      <text x="749" y="184" class="work">checks the rules</text>
    </g>

    <g v-click="1">
      <line x1="190" y1="94" x2="588" y2="94" class="edge" marker-end="url(#rt-arrow)" />
      <text x="389" y="78" class="label">request</text>
      <text x="389" y="40" class="code">GET /api/questions/</text>
    </g>

    <g v-click="3">
      <line x1="588" y1="156" x2="192" y2="156" class="edge" marker-end="url(#rt-arrow)" />
      <text x="389" y="186" class="label">response</text>
      <text x="389" y="222" class="code"><tspan class="ok">200 OK</tspan> + questions as JSON</text>
    </g>
  </svg>
</template>

<style scoped>
.round-trip {
  display: block;
  overflow: visible;
  font-family: var(--font-sans);
}
.box {
  fill: var(--bg);
  stroke: var(--stroke);
  stroke-width: var(--stroke-w);
}
.edge {
  stroke: var(--stroke);
  stroke-width: var(--stroke-w);
}
.head {
  fill: var(--stroke);
}
.name {
  fill: var(--text);
  font-size: 24px;
  font-weight: 650;
  text-anchor: middle;
}
.sub {
  fill: var(--text-2);
  font-size: 18px;
  font-weight: 500;
  text-anchor: middle;
}
.label {
  fill: var(--text);
  font-size: 22px;
  font-weight: 650;
  text-anchor: middle;
}
.code {
  fill: var(--text-2);
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
  text-anchor: middle;
}
.ok {
  fill: var(--status-2xx);
  font-weight: 700;
}
.work {
  fill: var(--accent);
  font-size: 20px;
  font-weight: 600;
  text-anchor: middle;
}
</style>
