<script setup lang="ts">
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Slide 16: the serializer as translator and bouncer.
 * Click 1: valid JSON passes through and becomes a Python object.
 * Click 2: "votes": 9999 passes, but the read-only field is stripped.
 * Click 3: an empty "text" bounces back with a red 400.
 */
const props = withDefaults(defineProps<{ at?: string | number }>(), { at: '+1' })
const { step } = useStepClicks(3, props.at)
</script>

<template>
  <div class="gate-demo">
    <div class="head left">JSON in</div>
    <div class="head mid">Serializer</div>
    <div class="head right">Python out</div>

    <div class="gate">
      <span class="role">translator</span>
      <span class="role">bouncer</span>
    </div>

    <!-- Row 1: valid -->
    <div class="cell in r1" :class="{ on: step >= 1 }">
      <span class="pkt">{"text": "What is REST?"}</span>
    </div>
    <div class="cell out r1" :class="{ on: step >= 1 }">
      <span class="obj">Question(text="What is REST?")</span>
    </div>

    <!-- Row 2: read-only field stripped -->
    <div class="cell in r2" :class="{ on: step >= 2 }">
      <span class="pkt">{"text": "Hi", <span class="stripped">"votes": 9999</span>}</span>
      <span class="note">read-only: dropped</span>
    </div>
    <div class="cell out r2" :class="{ on: step >= 2 }">
      <span class="obj">Question(text="Hi", votes=0)</span>
    </div>

    <!-- Row 3: invalid, bounced -->
    <div class="cell in r3 bounce" :class="{ on: step >= 3 }">
      <span class="pkt bad">{"text": ""}</span>
      <span class="err"><StatusBadge :code="400" :text="false" size="sm" /> "This field may not be blank."</span>
    </div>
    <div class="cell out r3 nothing" :class="{ on: step >= 3 }">
      <span>nothing saved</span>
    </div>
  </div>
</template>

<style scoped>
.gate-demo {
  display: grid;
  grid-template-columns: 364px 130px 316px;
  grid-template-rows: 34px repeat(3, 96px);
  column-gap: 28px;
  align-items: center;
  width: 866px;
  margin: 0 auto;
}
.head {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.head.left { grid-column: 1; text-align: right; }
.head.mid { grid-column: 2; text-align: center; color: var(--accent); font-size: 18px; }
.head.right { grid-column: 3; }

.gate {
  grid-column: 2;
  grid-row: 2 / span 3;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border: var(--stroke-bold) solid var(--accent);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--accent) 16%, var(--surface));
}
.role { font-size: 20px; font-weight: 800; color: var(--text); }

.cell { display: flex; flex-direction: column; gap: 6px; }
.in { grid-column: 1; align-items: flex-end; }
.out { grid-column: 3; align-items: flex-start; }
.r1 { grid-row: 2; }
.r2 { grid-row: 3; }
.r3 { grid-row: 4; }

.pkt, .obj {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  background: var(--surface);
  border: var(--stroke-bold) solid var(--accent);
  border-radius: var(--radius-sm);
  padding: 7px 10px;
  white-space: nowrap;
}
.obj { border-color: var(--post); }
.pkt.bad { border-color: var(--error); }

/* in: slides toward the gate */
.in { opacity: 0; translate: -40px 0; transition: opacity var(--dur-fast) var(--ease-out), translate 450ms var(--ease-out); }
.in.on { opacity: 1; translate: 0 0; }
/* out: emerges from the gate */
.out { opacity: 0; translate: -40px 0; transition: opacity var(--dur-fast) var(--ease-out) 250ms, translate 400ms var(--ease-out) 250ms; }
.out.on { opacity: 1; translate: 0 0; }

.stripped { transition: color var(--dur-fast) var(--ease-out) 300ms; }
.in.on .stripped { color: var(--error); text-decoration: line-through 3px; }
.note, .err {
  font-size: var(--fs-label);
  font-weight: 700;
  color: var(--error);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.err { font-family: var(--font-mono); color: var(--text); }

.in.r3.on { animation: bounce 600ms var(--ease-out); }
@keyframes bounce {
  0% { translate: -40px 0; }
  45% { translate: 26px 0; }
  100% { translate: 0 0; }
}
.nothing span {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-muted);
  border: var(--stroke) dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 7px 10px;
}
</style>
