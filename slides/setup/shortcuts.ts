import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { useBackstageNav } from '../composables/backstage'
import { toggleProjectorSim } from '../composables/projector'

/**
 * The clicker and arrow keys skip the backstage appendix (composables/backstage.ts).
 * Everything else keeps Slidev's defaults, including `g` to go to a slide number.
 */
export default function setupShortcuts(_nav: NavOperations, base: ShortcutOptions[]): ShortcutOptions[] {
  const guarded = useBackstageNav()

  const replacements: Record<string, () => unknown> = {
    next_space: guarded.next,
    next_right: guarded.next,
    next_page_key: guarded.next,
    prev_space: guarded.prev,
    prev_left: guarded.prev,
    prev_page_key: guarded.prev,
    next_down: guarded.nextSlide,
    next_shift: guarded.nextSlide,
    prev_up: () => guarded.prevSlide(),
    prev_shift: () => guarded.prevSlide(),
  }

  const shortcuts = base
    // The deck is dark only; a stray `d` must not flip it to light on the projector.
    .filter(s => s.name !== 'toggle_dark')
    .map(s => (s.name && replacements[s.name] ? { ...s, fn: replacements[s.name] } : s))

  // Projector simulation: `p`, dev only (plan section 5.1). `?projector` works everywhere.
  if (import.meta.env.DEV)
    shortcuts.push({ name: 'toggle_projector_sim', key: 'p', fn: toggleProjectorSim })

  return shortcuts
}
