import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/cafe', // use environment variable BASE_PATH, fallback to '/cafe' if not set
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000, // or your preferred port
  },
})
