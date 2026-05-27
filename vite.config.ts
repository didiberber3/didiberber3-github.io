import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join, dirname } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function contentDatesPlugin(): Plugin {
  return {
    name: 'content-dates',
    resolveId(id) {
      if (id === 'virtual:content-dates') return '\0virtual:content-dates'
    },
    load(id) {
      if (id !== '\0virtual:content-dates') return

      const notesDir = join(__dirname, 'content/notes')
      const dates: Record<string, string> = {}

      try {
        const entries = readdirSync(notesDir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && entry.name.endsWith('.md')) {
            const stat = statSync(join(notesDir, entry.name))
            const slug = entry.name.replace(/\.md$/, '')
            dates[slug] = stat.mtime.toISOString().split('T')[0]
          }
        }
      } catch {
        // content/notes dir might not exist yet
      }

      return `export const noteDates = ${JSON.stringify(dates)};`
    },
  }
}

export default defineConfig({
  plugins: [vue(), contentDatesPlugin()],
  base: '/didiberber3-github.io/',
  build: {
    outDir: 'dist',
  },
})
