/**
 * Event inputs (plan section 10). Anything still wrapped in {{ }} is a
 * placeholder: components render it as a clearly marked "not set yet" state
 * instead of a broken link or QR code. Edit this file only; slides read from it.
 */
export const workshop = {
  /** Stable public URL of the deployed v1 board (Pangolin). Used by the iframes and the QR code. */
  liveBoardUrl: '{{LIVE_BOARD_URL}}',
  /** The deployed board's Django admin, for deleting spam during the talk. */
  liveBoardAdminUrl: '{{LIVE_BOARD_ADMIN_URL}}',
  /** Starter repo attendees clone. Must be public before the night. */
  starterRepoUrl: 'https://github.com/joshualent/questions-api',
  /** Developer Club wordmark, placed in slides/public/media/brand/. Leave as a placeholder until supplied. */
  logoSrc: '{{CLUB_LOGO}}',
  /** Closing slide: next club event. */
  nextEvent: {
    title: '{{NEXT_EVENT_TITLE}}',
    when: '{{NEXT_EVENT_DATE}}',
    where: '{{NEXT_EVENT_ROOM}}',
  },
  /** "Where to go next" QR code target. */
  resourcesUrl: '{{RESOURCES_URL}}',
  /** Local dev server attendees run. */
  localApiUrl: 'http://127.0.0.1:8000/api/questions/',
  localAdminUrl: 'http://127.0.0.1:8000/admin/',
  /** Wall-clock start of the talk (24 h), for the pre-show countdown. */
  talkStartsAt: '18:55',
}

export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /^\{\{.*\}\}$/.test(value.trim())
}

/** Folder name `git clone` creates, derived from the repo URL. */
export function repoDirName(url = workshop.starterRepoUrl): string {
  return url.replace(/\/+$/, '').split('/').pop()!.replace(/\.git$/, '')
}

/** URL without the scheme, for printing under QR codes. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '')
}
