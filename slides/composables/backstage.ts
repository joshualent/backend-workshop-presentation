import type { SlideRoute } from '@slidev/types'
import { useNav } from '@slidev/client'

/**
 * Backstage slides (appendix, screenshot fallbacks, projector check) live at
 * the end of the deck with `backstage: true` in their frontmatter.
 *
 * Slidev 53 strips `hide: true` slides at build time, so they could never be
 * reached during the talk. Backstage slides stay in the build; the shortcut
 * guard in setup/shortcuts.ts makes Space/arrows/clicker skip them, and they
 * are reached with `g` (goto) or the `b` key on a slide that names a fallback.
 */
export function isBackstage(route: SlideRoute | undefined): boolean {
  return !!route?.meta?.slide?.frontmatter?.backstage
}

function frontmatterOf(route: SlideRoute | undefined): Record<string, any> {
  return route?.meta?.slide?.frontmatter ?? {}
}

function findByAlias(slides: SlideRoute[], alias: string | undefined) {
  if (!alias)
    return undefined
  return slides.find(s => frontmatterOf(s).routeAlias === alias)
}

export function useBackstageNav() {
  const nav = useNav()

  const slides = () => nav.slides.value
  const current = () => nav.currentSlideRoute.value

  /** Front-stage neighbour of slide `no`, walking in `dir`. */
  function nextFrontStage(no: number, dir: 1 | -1): SlideRoute | undefined {
    const list = slides()
    for (let n = no + dir; n >= 1 && n <= list.length; n += dir) {
      if (!isBackstage(list[n - 1]))
        return list[n - 1]
    }
    return undefined
  }

  /** The live slide a fallback stands in for (via `fallbackFor: <routeAlias>`). */
  function liveSlideFor(route: SlideRoute | undefined) {
    return findByAlias(slides(), frontmatterOf(route).fallbackFor)
  }

  async function next() {
    const route = current()
    const live = liveSlideFor(route)
    if (nav.clicks.value < nav.clicksTotal.value)
      return nav.next()
    if (live) {
      // Leaving a fallback continues the show after the slide it replaced.
      const target = nextFrontStage(live.no, 1)
      return target ? nav.go(target.no) : undefined
    }
    if (isBackstage(route))
      return nav.next()
    const target = nextFrontStage(route.no, 1)
    return target ? nav.go(target.no) : undefined
  }

  async function prev() {
    const route = current()
    if (nav.clicks.value > nav.clicksStart.value)
      return nav.prev()
    return prevSlide(true)
  }

  async function nextSlide() {
    const route = current()
    const live = liveSlideFor(route)
    if (isBackstage(route) && !live)
      return nav.nextSlide()
    const target = nextFrontStage((live ?? route).no, 1)
    return target ? nav.go(target.no) : undefined
  }

  async function prevSlide(lastClicks = false) {
    const route = current()
    const live = liveSlideFor(route)
    if (isBackstage(route) && !live)
      return nav.prevSlide(lastClicks)
    const target = nextFrontStage((live ?? route).no, -1)
    // 999 clamps to the slide's last click, like Slidev's own prevSlide(true).
    return target ? nav.go(target.no, lastClicks ? 999 : 0) : undefined
  }

  /** `b`: live board slide <-> its screenshot fallback. */
  async function toggleFallback() {
    const route = current()
    const fm = frontmatterOf(route)
    const fallback = findByAlias(slides(), fm.fallback)
    if (fallback)
      return nav.go(fallback.no)
    const live = liveSlideFor(route)
    if (live)
      return nav.go(live.no)
  }

  return { next, prev, nextSlide, prevSlide, toggleFallback }
}
