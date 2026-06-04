import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { contentIndexPlugin } from './src/utils/contentIndexPlugin'
import { rssPlugin } from './src/utils/rssPlugin'

export default defineConfig({
  plugins: [vue(), contentIndexPlugin(), rssPlugin()],
  base: '/didiberber3-github.io/',
  build: {
    outDir: 'dist',
  },
})
