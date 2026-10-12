import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This 'base' property is critical for GitHub Pages deployment.
  // It must match your repository name.
  base: '/', 
  // Match Pages: unknown files must return 404, not the homepage HTML.
  appType: 'mpa',
  plugins: [react()],
  build: { sourcemap: true, rollupOptions: { output: { sourcemapExcludeSources: true } } },
  ssr: { noExternal: true },
})
