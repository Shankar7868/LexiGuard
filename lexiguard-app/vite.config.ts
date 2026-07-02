import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/analyze': {
        target: 'http://13.53.216.50:5678/webhook/LexiGuard',
        changeOrigin: true,
        rewrite: () => '', // Removes the /api/analyze path since n8n handles the root target
      },
    },
  },
})
