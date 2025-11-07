import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'  // garante que a build vai para a pasta esperada pelo Vercel
  },
  base: './' // garante que os assets funcionem mesmo em subpastas ou deploys estáticos
})
