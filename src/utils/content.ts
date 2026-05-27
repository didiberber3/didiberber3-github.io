import { noteDates } from 'virtual:content-dates'
import { renderMarkdown, parseFrontmatter, extractTOC, type TocItem } from './markdown'

export interface Note {
  slug: string
  title: string
  date: string
  content: string
  html: string
  toc: TocItem[]
}

export interface Share {
  slug: string
  title: string
  date: string
  url: string
  tag: string
  content: string
  html: string
  toc: TocItem[]
}

// Vite import.meta.glob — eager imports at build time
const noteModules = import.meta.glob('/content/notes/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const shareModules = import.meta.glob('/content/shares/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function slugFromPath(filepath: string): string {
  return filepath
    .replace(/\\/g, '/')
    .split('/')
    .pop()!
    .replace(/\.md$/, '')
}

function titleFromSlug(slug: string): string {
  // contains non-ASCII (Chinese) → use as-is
  if (/[^\x00-\x7F]/.test(slug)) return slug
  // ASCII only: "uu-jiasuqi" → "Uu Jiasuqi"
  return slug
    .split('-')
    .map((s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
}

export function getAllNotes(): Note[] {
  const notes = Object.entries(noteModules).map(([path, raw]) => {
    const slug = slugFromPath(path)
    const title = titleFromSlug(slug)
    const date = noteDates[slug] || ''
    const html = renderMarkdown(raw)
    const toc = extractTOC(html)
    return { slug, title, date, content: raw, html, toc }
  })

  notes.sort((a, b) => b.date.localeCompare(a.date))
  return notes
}

export function getNote(slug: string): Note | undefined {
  return getAllNotes().find((n) => n.slug === slug)
}

export function getAllShares(): Share[] {
  const shares = Object.entries(shareModules).map(([path, raw]) => {
    const slug = slugFromPath(path)
    const { frontmatter, content } = parseFrontmatter(raw)
    const title = titleFromSlug(slug)
    const html = renderMarkdown(content)
    const toc = extractTOC(html)
    return {
      slug,
      title,
      date: frontmatter.date || '',
      url: frontmatter.url || '',
      tag: frontmatter.tag || '',
      content,
      html,
      toc,
    }
  })

  shares.sort((a, b) => b.date.localeCompare(a.date))
  return shares
}

export function getShare(slug: string): Share | undefined {
  return getAllShares().find((s) => s.slug === slug)
}
