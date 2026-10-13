import type { SlideRoute } from '@slidev/types'
import { useNav } from '@slidev/client'

/**
 * The hidden appendix (plan section 7.9). Slidev 53 drops `hide: true` slides
 * when it parses the deck, so they could never be shown during the talk.
 * Appendix slides use `backstage: true` instead: they stay in the build, the
 * clicker and arrow keys skip them (setup/shortcuts.ts), and the presenter
 * reaches them with `g` and a slide number.
 */
export function isBackstage(route: SlideRoute | undefined): boolean {
  return !!route?.meta?.slide?.frontmatter?.backstage
}

export function useBackstageNav() {
  const nav = useNav()

  /** The nearest show slide from `no`, walking in `dir`. */
  function nearestShowSlide(no: number, dir: 1 | -1): SlideRoute | undefined {
    const list = nav.slides.value
    for (let n = no + dir; n >= 1 && n <= list.length; n += dir) {
      if (!isBackstage(list[n - 1]))
        return list[n - 1]
    }
    return undefined
  }

  const onBackstage = () => isBackstage(nav.currentSlideRoute.value)
  const here = () => nav.currentSlideRoute.value.no

  async function next() {
    if (nav.clicks.value < nav.clicksTotal.value || onBackstage())
      return nav.next()
    const target = nearestShowSlide(here(), 1)
    return target ? nav.go(target.no) : undefined
  }

  async function prev() {
    if (nav.clicks.value > nav.clicksStart.value || onBackstage())
      return nav.prev()
    return prevSlide(true)
  }

  async function nextSlide() {
    if (onBackstage())
      return nav.nextSlide()
    const target = nearestShowSlide(here(), 1)
    return target ? nav.go(target.no) : undefined
  }

  async function prevSlide(lastClicks = false) {
    if (onBackstage())
      return nav.prevSlide(lastClicks)
    const target = nearestShowSlide(here(), -1)
    // 999 clamps to the slide's last click, like Slidev's own prevSlide(true).
    return target ? nav.go(target.no, lastClicks ? 999 : 0) : undefined
  }

  return { next, prev, nextSlide, prevSlide }
}
