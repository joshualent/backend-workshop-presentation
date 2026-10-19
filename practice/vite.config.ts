import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Monaco is one big chunk; that's fine for an app that runs locally.
  build: { chunkSizeWarningLimit: 4000 },
})
