import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  test: {
    globals: true,          // позволяет использовать describe, it, expect без импорта
    environment: 'jsdom',   // эмулирует браузерное окружение
    setupFiles: ['./vitest.setup.js'],
  },
  resolve: {
    // чтобы работали импорты типа
    // import ContextMenu from '@/components/shared/ContextMenu' без /index.vue
    extensions: ['.vue', '.js', '.ts', '.json'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
