import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Removes all console.log in production
        drop_debugger: true,     // Removes debugger statements
      },
    },
  },
})