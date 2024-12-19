import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': 'https://f78a52bftrial-dev-backend-cds-srv.cfapps.us10-001.hana.ondemand.com/odata/v4',
      '/stations' : 'https://f78a52bftrial-dev-backend-cds-srv.cfapps.us10-001.hana.ondemand.com/odata/v4'
    }
  },
})
