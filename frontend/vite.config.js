import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      
      '/stations': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false,
      },
      
      '/user': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false,
      },
      '/ar': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

