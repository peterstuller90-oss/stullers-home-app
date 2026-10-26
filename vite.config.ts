import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// host: true makes the app reachable from other devices on the home Wi-Fi.
// BASE_PATH is set when building for GitHub Pages (served under /stullers-home/).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 5173 },
})
