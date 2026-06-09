import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { contentIndexPlugin } from './src/utils/contentIndexPlugin'

export default defineConfig({
  plugins: [vue(), contentIndexPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: false,
    include: ['src/**/*.{test,spec}.{ts,js}'],
  },
})
