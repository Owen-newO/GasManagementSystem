import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose NEXT_PUBLIC_* env vars (in addition to VITE_*) to import.meta.env
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
})
