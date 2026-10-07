import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { useBackstageNav } from '../composables/backstage'
import { toggleProjectorSim } from '../composables/projector'

/**
 * Clicker and keyboard navigation skip backstage slides (see
 * composables/backstage.ts). Everything else keeps Slidev's defaults.
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

  const shortcuts = base.map(s =>
    s.name && replacements[s.name] ? { ...s, fn: replacements[s.name] } : s,
  )

  shortcuts.push({ name: 'toggle_fallback', key: 'b', fn: guarded.toggleFallback })

  // Projector simulation: `p` in dev only (plan section 5). `?projector` works everywhere.
  if (import.meta.env.DEV)
    shortcuts.push({ name: 'toggle_projector_sim', key: 'p', fn: toggleProjectorSim })

  return shortcuts
}
