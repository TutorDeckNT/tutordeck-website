import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This 'base' property is critical for GitHub Pages deployment.
  // It must match your repository name.
  base: '/tutordeck-website/', 
  plugins: [react()],
})
