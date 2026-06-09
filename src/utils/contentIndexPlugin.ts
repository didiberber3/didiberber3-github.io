import { type Plugin } from 'vite'
import { join } from 'path'
import { statSync, readFileSync } from 'fs'

import { parseFrontmatter } from './frontmatter'
import { walkMdFiles, slugFromFilePath } from './fs'

export function contentIndexPlugin(): Plugin {
  return {
    name: 'content-index',
    resolveId(id) {
      if (id === 'virtual:content-index') return '\0virtual:content-index'
    },
    load(id) {
      if (id !== '\0virtual:content-index') return

      const notesDir = join(process.cwd(), 'content/notes')
      const noteMeta: Record<string, { date: string; title: string; slug: string }> = {}

      for (const fullPath of walkMdFiles(notesDir)) {
        const slug = slugFromFilePath(fullPath)
        const raw = readFileSync(fullPath, 'utf-8')
        const fm = parseFrontmatter(raw)
        const fallbackDate = statSync(fullPath).mtime.toISOString().split('T')[0]
        const fallbackTitle = slug
          .split('-')
          .map((s: string) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s))
          .join(' ')
        noteMeta[slug] = {
          date: fm.date || fallbackDate,
          title: fm.title || fallbackTitle,
          slug: fm.slug || slug,
        }
      }

      return `
export const noteMeta = ${JSON.stringify(noteMeta)};
`
    },
  }
}
