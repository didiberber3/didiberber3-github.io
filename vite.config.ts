import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join, dirname } from 'path'
import { readdirSync, statSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return {}
  const fm: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(': ')
    if (idx > 0) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
    }
  }
  return fm
}

function contentIndexPlugin(): Plugin {
  return {
    name: 'content-index',
    resolveId(id) {
      if (id === 'virtual:content-index') return '\0virtual:content-index'
    },
    load(id) {
      if (id !== '\0virtual:content-index') return

      const notesDir = join(__dirname, 'content/notes')

      const noteMeta: Record<string, { date: string; title: string; slug: string }> = {}

      // Notes — date & title from frontmatter, fallback to mtime
      function walkNotes(dir: string) {
        try {
          const entries = readdirSync(dir, { withFileTypes: true })
          for (const entry of entries) {
            const fullPath = join(dir, entry.name)
            if (entry.isDirectory()) {
              walkNotes(fullPath)
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
              const slug = entry.name.replace(/\.md$/, '')
              const raw = readFileSync(fullPath, 'utf-8')
              const fm = parseFrontmatter(raw)
              const fallbackDate = statSync(fullPath).mtime.toISOString().split('T')[0]
              const fallbackTitle = slug
                .replace(/\.md$/, '')
                .split('-')
                .map((s: string) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s))
                .join(' ')
              noteMeta[slug] = {
                date: fm.date || fallbackDate,
                title: fm.title || fallbackTitle,
                slug: fm.slug || slug,
              }
            }
          }
        } catch (e) {
          console.warn('[content-index] Failed to walk notes:', e)
        }
      }
      walkNotes(notesDir)

      return `
export const noteMeta = ${JSON.stringify(noteMeta)};
`
    },
  }
}

export default defineConfig({
  plugins: [vue(), contentIndexPlugin()],
  base: '/didiberber3-github.io/',
  build: {
    outDir: 'dist',
  },
})
