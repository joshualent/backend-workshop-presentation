import type { AppContext } from '@slidev/types'
import { applyProjectorSimFromUrl } from '../composables/projector'
import { displayUrl, isPlaceholder, workshop } from '../workshop.config'

declare module 'vue' {
  interface ComponentCustomProperties {
    $workshop: typeof workshop
    $display: typeof displayUrl
    $isPlaceholder: typeof isPlaceholder
  }
}

export default function setupMain({ app, router }: AppContext) {
  // Event inputs, readable from any slide as $workshop.repoUrl etc.
  app.config.globalProperties.$workshop = workshop
  app.config.globalProperties.$display = displayUrl
  app.config.globalProperties.$isPlaceholder = isPlaceholder

  applyProjectorSimFromUrl()
  // Slidev rewrites the query on navigation; keep the toggle on while `?projector` is present.
  router.afterEach(() => applyProjectorSimFromUrl())
}
