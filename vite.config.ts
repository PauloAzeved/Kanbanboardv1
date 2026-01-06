
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Set base to your repo name for GitHub Pages project sites
export default defineConfig({
  plugins: [react()],
  base: '/Kanbanboardv1/',
})
