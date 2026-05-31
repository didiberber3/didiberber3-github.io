// Virtual module provided by Vite plugin — types declared in vite-env.d.ts
import { noteMeta } from 'virtual:content-index'
import { renderMarkdown, parseFrontmatter, extractTOC, type TocItem } from './markdown'

/* ===== Types ===== */

export interface NoteMeta {
  slug: string
  title: string
  date: string
  category: string
}

export interface Note extends NoteMeta {
  content: string
  html: string
  toc: TocItem[]
}

/* ===== Lazy globs ===== */

const noteModules = import.meta.glob('/content/notes/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

/* ===== Helpers ===== */

function slugFromPath(filepath: string): string {
  return filepath.replace(/\\/g, '/').split('/').pop()!.replace(/\.md$/, '')
}

function categoryFromPath(filepath: string): string {
  const normalized = filepath.replace(/\\/g, '/')
  const parts = normalized.split('/')
  // Find 'notes' segment; the next segment is the category
  const notesIdx = parts.indexOf('notes')
  if (notesIdx >= 0 && notesIdx + 1 < parts.length) {
    return parts[notesIdx + 1]
  }
  return ''
}

function titleFromSlug(slug: string): string {
  if (/[^\x00-\x7F]/.test(slug)) return slug
  return slug
    .split('-')
    .map((s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
}

/* ===== Sync: metadata only (no .md content loaded) ===== */

export function getNoteList(): NoteMeta[] {
  const list = Object.keys(noteModules).map((path) => {
    const slug = slugFromPath(path)
    const meta = noteMeta[slug]
    return {
      slug: meta?.slug || slug,
      title: meta?.title || titleFromSlug(slug),
      date: meta?.date || '',
      category: categoryFromPath(path),
    }
  })
  list.sort((a, b) => b.date.localeCompare(a.date))
  return list
}

export function getCategories(): string[] {
  const cats = new Set<string>()
  for (const path of Object.keys(noteModules)) {
    const cat = categoryFromPath(path)
    if (cat) cats.add(cat)
  }
  return Array.from(cats).sort()
}

export function getNotesByCategory(category: string): NoteMeta[] {
  return getNoteList().filter((n) => n.category === category)
}

/* ===== Async: full content loading  ===== */

export async function loadNote(slug: string): Promise<Note | undefined> {
  const entry = Object.entries(noteModules).find(
    ([path]) => slugFromPath(path) === slug
  )
  if (!entry) return undefined

  const raw = await entry[1]()
  const { content } = parseFrontmatter(raw)
  const html = renderMarkdown(content)
  const toc = extractTOC(html)
  const meta = noteMeta[slug]
  return {
    slug,
    title: meta?.title || titleFromSlug(slug),
    date: meta?.date || '',
    category: categoryFromPath(entry[0]),
    content: raw,
    html,
    toc,
  }
}


