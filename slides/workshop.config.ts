/**
 * Event inputs (plan section 11). Values in {{double braces}} are
 * placeholders: slides show a dashed "placeholder" box until they're set.
 * `pnpm qa` lists any that are left.
 */
export const workshop = {
  title: 'Build a Q&A API with Python & Django',
  host: 'Developer Club, WMU',
  date: 'Monday, October 19, 2026',
  room: 'Floyd Hall D-109',

  /** The repo attendees clone (the QR code on the setup slide). */
  repoUrl: 'https://github.com/joshualent/questions-api',

  /**
   * A public, deployed instance for the audience, if there is one. Only used
   * in the presenter notes: it's shown by switching to a browser tab, never in
   * an iframe. Set to null if there isn't one.
   */
  publicInstance: { url: '{{PUBLIC_INSTANCE_URL}}', checkpoint: '{{CHECKPOINT}}' } as { url: string, checkpoint: string } | null,
}

export function isPlaceholder(value: unknown): boolean {
  return typeof value === 'string' && /\{\{.*\}\}/.test(value)
}

/** Drop the scheme for display: github.com/joshualent/questions-api */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
