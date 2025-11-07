import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // pasta esperada pelo Vercel
  },
  base: './' // garante que assets funcionem em subrotas
})
