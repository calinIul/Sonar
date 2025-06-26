import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxies /stations to localhost:4004/stations (which your CDS backend serves)
      '/stations': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false,
      },
      // Proxies /my-profile to localhost:4004/my-profile
      '/my-profile': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

