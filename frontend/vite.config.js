import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  server: {
    allowedHosts: ["raspberrypi"],
    port: 5173,
    strictPort: true
  },
  base: env.VITE_BASE_URL || '/',
  plugins: [react()],
}})
