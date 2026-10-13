import type { ShikiSetupReturn } from '@slidev/types'

/**
 * A high-contrast dark theme (plan section 5.1). Its own background is
 * replaced by --surface; token colors were checked against it with the
 * projector simulation on.
 */
export default function setupShiki(): ShikiSetupReturn {
  return {
    themes: {
      dark: 'github-dark-high-contrast',
      light: 'github-dark-high-contrast',
    },
  }
}
