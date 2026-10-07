<script setup lang="ts">
import { computed } from 'vue'
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Slide 4. Click 1: a request packet travels client → server.
 * Click 2: the server pulses (does the work). Click 3: JSON travels back.
 */
const props = withDefaults(defineProps<{ at?: string | number }>(), { at: '+1' })
const { step } = useStepClicks(3, props.at)

const reqSent = computed(() => step.value >= 1)
const working = computed(() => step.value === 2)
const worked = computed(() => step.value >= 2)
const resSent = computed(() => step.value >= 3)
</script>

<template>
  <div class="trip">
    <div class="node client" :class="{ on: resSent }">
      <ph-laptop-bold class="icon" />
      <div class="name">Client</div>
      <div class="sub">browser · phone · curl</div>
    </div>

    <div class="lanes">
      <div class="lane top"><span class="lane-label">request</span></div>
      <div class="lane bottom"><span class="lane-label">response</span></div>

      <div class="packet-slot top" :class="{ go: reqSent, absorbed: worked }">
        <Packet method="GET" label="/api/questions/" />
      </div>
      <div class="packet-slot bottom" :class="{ go: resSent }">
        <Packet kind="response" label='200 [{"text": …}]' />
      </div>
    </div>

    <div class="node server" :class="{ on: worked && !resSent, pulse: working }">
      <ph-hard-drives-bold class="icon" />
      <div class="name">Server</div>
      <div class="sub">Django + DRF</div>
      <div class="work" :class="{ show: worked }">
        <ph-database-bold class="work-icon" /> finds the questions
      </div>
    </div>
  </div>
</template>

<style scoped>
.trip {
  display: grid;
  grid-template-columns: 230px 1fr 230px;
  align-items: center;
  gap: 0;
  height: 330px;
}
.node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 22px 12px;
  background: var(--surface);
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  transition: border-color var(--dur-step) var(--ease-out), background-color var(--dur-step) var(--ease-out);
}
.node.on {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 18%, var(--surface));
}
.node.pulse { animation: pulse 600ms var(--ease-out); }
@keyframes pulse {
  0% { scale: 1; }
  40% { scale: 1.07; }
  100% { scale: 1; }
}
.icon { font-size: 64px; color: var(--text); }
.name { font-size: 28px; font-weight: 800; }
.sub { font-size: var(--fs-label); font-weight: 600; color: var(--text-muted); }
.work {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  translate: -50% 6px;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transition: opacity var(--dur-step) var(--ease-out), translate var(--dur-step) var(--ease-out);
}
.work.show { opacity: 1; translate: -50% 0; }
.work-icon { font-size: 22px; }

.lanes { position: relative; height: 100%; margin: 0 14px; }
.lane {
  position: absolute;
  left: 0;
  right: 0;
  border-top: var(--stroke-bold) dashed var(--border);
}
.lane.top { top: 108px; }
.lane.bottom { top: 222px; }
.lane-label {
  position: absolute;
  top: 8px;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 700;
  color: var(--text-muted);
}
.lane.top .lane-label { top: auto; bottom: 8px; left: 0; }
.lane.bottom .lane-label { right: 0; }

.packet-slot {
  position: absolute;
  opacity: 0;
  transition:
    left 600ms var(--ease-out),
    transform 600ms var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}
.packet-slot.top { top: 108px; left: 0; transform: translate(0, -50%); }
.packet-slot.top.go { left: 100%; transform: translate(-100%, -50%); opacity: 1; }
.packet-slot.top.go.absorbed { opacity: 0; }
.packet-slot.bottom { top: 222px; left: 100%; transform: translate(-100%, -50%); }
.packet-slot.bottom.go { left: 0; transform: translate(0, -50%); opacity: 1; }
</style>
