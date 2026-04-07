import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/zippyindia-ai-offer-test/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
})
