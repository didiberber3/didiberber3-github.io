import { type Plugin } from 'vite'
import { join } from 'path'
import { statSync, readFileSync, writeFileSync } from 'fs'

import { parseFrontmatter } from './frontmatter'
import { stripMarkdown } from './text'
import { walkMdFiles, slugFromFilePath } from './fs'

export function rssPlugin(): Plugin {
  return {
    name: 'rss-feed',
    closeBundle() {
      const notesDir = join(process.cwd(), 'content/notes')
      const siteUrl = 'https://flyhunterl.github.io/didiberber3-github.io'

      interface NoteEntry {
        slug: string
        title: string
        date: string
        description: string
      }

      const notes: NoteEntry[] = []

      for (const fullPath of walkMdFiles(notesDir)) {
        const slug = slugFromFilePath(fullPath)
        const raw = readFileSync(fullPath, 'utf-8')
        const fm = parseFrontmatter(raw)
        const fallbackDate = statSync(fullPath).mtime.toISOString().split('T')[0]
        const title = fm.title || slug
        const date = fm.date || fallbackDate
        // Strip frontmatter + markdown for the description
        const content = raw.replace(/^---[\s\S]*?---\r?\n?/m, '')
        const plain = stripMarkdown(content)
          .replace(/\s+/g, ' ')  // collapse whitespace (RSS-specific)
          .trim()
        const description = plain.slice(0, 200) + (plain.length > 200 ? '…' : '')

        notes.push({
          slug: fm.slug || slug,
          title,
          date,
          description,
        })
      }

      // Sort by date descending
      notes.sort((a, b) => b.date.localeCompare(a.date))

      const items = notes
        .map(
          (note) => `
    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${siteUrl}/note/${note.slug}</link>
      <guid>${siteUrl}/note/${note.slug}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description>${escapeXml(note.description)}</description>
    </item>`
        )
        .join('')

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>记录与分享</title>
    <link>${siteUrl}</link>
    <description>个人学习笔记与技术分享 — Java、前端、开发工具</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

      try {
        writeFileSync(join(process.cwd(), 'dist/rss.xml'), rss, 'utf-8')
        console.log('[rss-feed] Generated dist/rss.xml')
      } catch (e) {
        console.warn('[rss-feed] Failed to write RSS feed:', e)
      }
    },
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
