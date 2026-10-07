import type { ShikiSetupReturn } from '@slidev/types'

/**
 * High-contrast dark theme (plan section 5). Its background is replaced by
 * --surface in styles/global.css; token colors were checked against it.
 */
export default function setupShiki(): ShikiSetupReturn {
  return {
    themes: {
      dark: 'github-dark-high-contrast',
      light: 'github-dark-high-contrast',
    },
  }
}
