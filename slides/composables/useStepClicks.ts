import type { RawAtValue } from '@slidev/types'
import { useSlideContext } from '@slidev/client'
import { computed, onUnmounted } from 'vue'

let uid = 0

/**
 * Lets a component own `steps` clicks on its slide, the same way `v-click`
 * does: the slide's click total grows by `steps`, and `step` reports how many
 * of this component's clicks have happened (0 … steps).
 *
 * Outside a slide (or with steps = 0) `step` sits at `steps`, the final state,
 * which is also what PDF export renders.
 */
export function useStepClicks(steps: number, at: RawAtValue = '+1') {
  const ctx = useSlideContext().$clicksContext
  const id = `step-clicks-${++uid}`

  const info = steps > 0 && ctx ? ctx.calculateSince(at, steps) : null
  if (info) {
    ctx.register(id, info)
    onUnmounted(() => ctx.unregister(id))
  }

  const step = computed(() => {
    if (!info)
      return steps
    return Math.max(0, Math.min(steps, ctx.current - info.start + 1))
  })

  return { step, start: info?.start ?? 0 }
}
