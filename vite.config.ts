import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the build works both at a domain root and under a subpath such as GitHub Pages.
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
