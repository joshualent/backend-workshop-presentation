<script setup lang="ts">
import { useStepClicks } from '../composables/useStepClicks'

/**
 * Slide 5. Click 1: the order ticket slides from the dining room to the
 * kitchen. Click 2: the dish comes back. Click 3: labels map each part
 * (frontend / API / backend).
 */
const props = withDefaults(defineProps<{ at?: string | number }>(), { at: '+1' })
const { step } = useStepClicks(3, props.at)
</script>

<template>
  <div class="restaurant">
    <div class="zone dining">
      <div class="zone-name">Dining room</div>
      <ph-fork-knife-bold class="big" />
    </div>

    <div class="pass">
      <div class="zone-name">Order<br>window</div>
      <div class="hatch" />
    </div>

    <div class="zone kitchen">
      <div class="zone-name">Kitchen</div>
      <div class="icons"><ph-chef-hat-bold class="big" /><ph-cooking-pot-bold class="big" /></div>
    </div>

    <div class="ticket" :class="{ sent: step >= 1 }">
      <ph-receipt-bold class="ticket-icon" />
      <span>Order #4<br>questions, by votes</span>
    </div>

    <div class="dish" :class="{ served: step >= 2 }">
      <ph-bowl-food-bold class="dish-icon" />
      <span>your data</span>
    </div>

    <div class="labels" :class="{ show: step >= 3 }">
      <span class="label l-front">= Frontend</span>
      <span class="label l-api">= API</span>
      <span class="label l-back">= Backend</span>
    </div>
  </div>
</template>

<style scoped>
.restaurant { position: relative; width: 876px; height: 370px; margin: 0 auto; }

.zone, .pass { position: absolute; top: 0; height: 290px; box-sizing: border-box; }
.zone {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 14px 12px;
  border: var(--stroke-bold) solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}
.dining { left: 0; }
.kitchen { right: 0; }
.pass { left: 348px; width: 180px; }
.pass .zone-name { position: absolute; top: 14px; left: 0; right: 0; }
.hatch { position: absolute; left: 22px; right: 22px; top: 136px; height: 136px; border: var(--stroke-bold) dashed var(--text-muted); border-radius: var(--radius); }
.zone-name { font-size: 24px; font-weight: 800; }
.pass .zone-name { font-size: 22px; text-align: center; line-height: 1.15; }
.big { font-size: 84px; color: var(--text); }
.icons { display: flex; gap: 10px; }

.ticket, .dish {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 700;
  line-height: 1.25;
  transition: left 650ms var(--ease-out), opacity var(--dur-fast) var(--ease-out);
}
.ticket {
  top: 152px;
  left: 30px;
  background: var(--text);
  color: var(--bg);
  border: var(--stroke-bold) solid var(--accent-2);
}
.ticket.sent { left: 606px; }
.ticket-icon { font-size: 28px; flex: none; }
.dish {
  top: 214px;
  left: 616px;
  background: var(--surface);
  color: var(--text);
  border: var(--stroke-bold) solid var(--accent-2);
  opacity: 0;
}
.dish.served { left: 56px; opacity: 1; }
.dish-icon { font-size: 30px; color: var(--accent-2); }

.labels { position: absolute; left: 0; right: 0; top: 308px; height: 50px; }
.label {
  position: absolute;
  top: 0;
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
  white-space: nowrap;
  opacity: 0;
  translate: 0 10px;
  transition: opacity var(--dur-step) var(--ease-out), translate var(--dur-step) var(--ease-out);
}
.labels.show .label { opacity: 1; translate: 0 0; }
.l-front { left: 150px; transform: translateX(-50%); }
.l-api { left: 438px; transform: translateX(-50%); transition-delay: 80ms; }
.l-back { left: 726px; transform: translateX(-50%); transition-delay: 160ms; }
</style>
