import { type Plugin } from 'vite'
import { join } from 'path'
import { statSync, readFileSync } from 'fs'

import { parseFrontmatter } from './frontmatter'
import { walkMdFiles, slugFromFilePath, categoryFromFilePath } from './fs'
import { stripMarkdown } from './text'

export function contentIndexPlugin(): Plugin {
  return {
    name: 'content-index',
    resolveId(id) {
      if (id === 'virtual:content-index') return '\0virtual:content-index'
    },
    load(id) {
      if (id !== '\0virtual:content-index') return

      const notesDir = join(process.cwd(), 'content/notes')
      const noteMeta: Record<string, { date: string; title: string; slug: string; charCount: number }> = {}
      // slug → 分类，供正文改为静态 fetch 时组装路径
      const slugCategory: Record<string, string> = {}

      for (const fullPath of walkMdFiles(notesDir)) {
        const slug = slugFromFilePath(fullPath)
        const raw = readFileSync(fullPath, 'utf-8')
        const fm = parseFrontmatter(raw)
        const mtime = statSync(fullPath).mtime
        const fallbackDate = [
          mtime.getFullYear(),
          String(mtime.getMonth() + 1).padStart(2, '0'),
          String(mtime.getDate()).padStart(2, '0'),
        ].join('-')
        const fallbackTitle = slug
          .split('-')
          .map((s: string) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s))
          .join(' ')
        const plain = stripMarkdown(raw)
        const charCount = plain.replace(/\s/g, '').length
        const metaSlug = fm.slug || slug
        noteMeta[metaSlug] = {
          date: fm.date || fallbackDate,
          title: fm.title || fallbackTitle,
          slug: metaSlug,
          charCount,
        }
        slugCategory[metaSlug] = categoryFromFilePath(fullPath)
      }

      return `
export const noteMeta = ${JSON.stringify(noteMeta)};
export const slugCategory = ${JSON.stringify(slugCategory)};
`
    },
  }
}
