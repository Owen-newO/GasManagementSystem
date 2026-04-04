import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Firebase Hosting rewrites /api/registerResident → Cloud Function; Vite has no rewrite unless we proxy.
// https://vite.dev/config/server-options.html#server-proxy
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const projectId =
    env.VITE_FIREBASE_PROJECT_ID || env.VITE_PUBLIC_FIREBASE_PROJECT_ID ||
    'agas-fuel-rationing-system'
  const region =
    env.VITE_FIREBASE_FUNCTIONS_REGION ||
    env.VITE_PUBLIC_FIREBASE_FUNCTIONS_REGION ||
    'asia-southeast1'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/registerResident': {
          target: 'http://127.0.0.1:5001',
          changeOrigin: true,
          rewrite: () => `/${projectId}/${region}/registerResident`,
        },
      },
    },
  }
})
