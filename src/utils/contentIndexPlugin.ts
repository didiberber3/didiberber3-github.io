import { type Plugin } from 'vite'
import { join } from 'path'
import { statSync, readFileSync } from 'fs'

import { parseFrontmatterWithContent } from './frontmatter'
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
      const noteMeta: Record<
        string,
        { date: string; title: string; slug: string; charCount: number; tags: string[] }
      > = {}
      // slug → 分类，供正文改为静态 fetch 时组装路径
      const slugCategory: Record<string, string> = {}

      for (const fullPath of walkMdFiles(notesDir)) {
        // 只收录分类子目录中的笔记；根目录文件（Obsidian 日记等）不进博客
        const category = categoryFromFilePath(fullPath)
        if (!category) continue

        const slug = slugFromFilePath(fullPath)
        const raw = readFileSync(fullPath, 'utf-8')
        const { frontmatter: fm, content } = parseFrontmatterWithContent(raw)

        // 空笔记（只有 frontmatter 或完全为空）不进索引
        const plain = stripMarkdown(content)
        const charCount = plain.replace(/\s/g, '').length
        if (charCount === 0) continue

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

        const fmTitle = typeof fm.title === 'string' ? fm.title : ''
        const fmDate = typeof fm.date === 'string' ? fm.date : ''
        const fmSlug = typeof fm.slug === 'string' ? fm.slug : ''
        const metaSlug = fmSlug || slug

        noteMeta[metaSlug] = {
          date: fmDate || fallbackDate,
          title: fmTitle || fallbackTitle,
          slug: metaSlug,
          charCount,
          tags: Array.isArray(fm.tags) ? fm.tags : [],
        }
        slugCategory[metaSlug] = category
      }

      return `
export const noteMeta = ${JSON.stringify(noteMeta)};
export const slugCategory = ${JSON.stringify(slugCategory)};
`
    },
  }
}
