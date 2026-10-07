/**
 * Projector simulation (plan section 5): washes the deck out with
 * `filter: contrast(0.75) brightness(1.15)` so every slide can be checked
 * for readability on an average projector. Toggle with `p` (dev) or load any
 * page with `?projector` in the URL.
 */
const CLASS = 'projector-sim'

export function applyProjectorSimFromUrl() {
  if (typeof window === 'undefined')
    return
  // Only ever switches on, so a `p` toggle survives slide changes.
  if (new URLSearchParams(window.location.search).has('projector'))
    document.documentElement.classList.add(CLASS)
}

export function toggleProjectorSim() {
  document.documentElement.classList.toggle(CLASS)
}
