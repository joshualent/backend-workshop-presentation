import type { AppContext } from '@slidev/types'
import { applyProjectorSimFromUrl } from '../composables/projector'
import { displayUrl, isPlaceholder, repoDirName, workshop } from '../workshop.config'

declare module 'vue' {
  interface ComponentCustomProperties {
    $workshop: typeof workshop
    $display: typeof displayUrl
    $isPlaceholder: typeof isPlaceholder
    $repoDir: string
  }
}

export default function setupMain({ app, router }: AppContext) {
  // Event inputs, readable from any slide as $workshop.liveBoardUrl etc.
  app.config.globalProperties.$workshop = workshop
  app.config.globalProperties.$display = displayUrl
  app.config.globalProperties.$isPlaceholder = isPlaceholder
  app.config.globalProperties.$repoDir = repoDirName()

  applyProjectorSimFromUrl()
  // Slidev rewrites the query on every click; keep the toggle sticky while `?projector` is present.
  router.afterEach(() => applyProjectorSimFromUrl())
}
