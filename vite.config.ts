import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { practicePages } from './build/practice-pages'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), practicePages()],
  build: { copyPublicDir: false },
})
