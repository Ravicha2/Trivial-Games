import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: true,
    watch: {
      usePolling: false,
    },
    allowedHosts: ['mushy-winner-amenity.ngrok-free.dev'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
  },
})
