// Virtual module provided by Vite plugin — types declared in vite-env.d.ts
import { noteMeta } from 'virtual:content-index'
import { renderMarkdown, parseFrontmatter, extractTOC, computeReadingStats, type TocItem } from './markdown'
/* ===== Types ===== */

export interface NoteMeta {
  slug: string
  title: string
  date: string
  category: string
  charCount: number
}

export interface Note extends NoteMeta {
  content: string
  html: string
  toc: TocItem[]
  charCount: number
  readingTime: number
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

let noteListCache: NoteMeta[] | null = null
let categoriesCache: string[] | null = null

export function getNoteList(): NoteMeta[] {
  if (noteListCache) return noteListCache
  const list = Object.keys(noteModules).map((path) => {
    const slug = slugFromPath(path)
    const meta = noteMeta[slug]
    return {
      slug: meta?.slug || slug,
      title: meta?.title || titleFromSlug(slug),
      date: meta?.date || '',
      category: categoryFromPath(path),
      charCount: meta?.charCount || 0,
    }
  })
  list.sort((a, b) => b.date.localeCompare(a.date))
  noteListCache = list
  return list
}

export function getCategories(): string[] {
  if (categoriesCache) return categoriesCache
  const cats = new Set<string>()
  for (const path of Object.keys(noteModules)) {
    const cat = categoryFromPath(path)
    if (cat) cats.add(cat)
  }
  categoriesCache = Array.from(cats).sort()
  return categoriesCache
}

export function getAdjacentNotes(slug: string): { prev: NoteMeta | null; next: NoteMeta | null } {
  const list = getNoteList()
  const idx = list.findIndex((n) => n.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx + 1 < list.length ? list[idx + 1] : null,
    next: idx > 0 ? list[idx - 1] : null,
  }
}

/* ===== LRU cache for loaded notes ===== */

const noteCache = new Map<string, Note>()
const CACHE_MAX = 20

function cacheGet(slug: string): Note | undefined {
  const hit = noteCache.get(slug)
  if (hit) {
    // Bump to most-recently-used
    noteCache.delete(slug)
    noteCache.set(slug, hit)
  }
  return hit
}

function cacheSet(slug: string, note: Note): void {
  if (noteCache.has(slug)) noteCache.delete(slug)
  else if (noteCache.size >= CACHE_MAX) {
    // Delete least-recently-used (first inserted key)
    const oldest = noteCache.keys().next()
    if (!oldest.done) noteCache.delete(oldest.value)
  }
  noteCache.set(slug, note)
}

/* ===== Async: full content loading  ===== */

export async function loadNote(slug: string): Promise<Note | undefined> {
  const cached = cacheGet(slug)
  if (cached) return cached

  const entry = Object.entries(noteModules).find(
    ([path]) => slugFromPath(path) === slug
  )
  if (!entry) return undefined

  const raw = await entry[1]()
  const { content } = parseFrontmatter(raw)
  const { charCount, readingTime } = computeReadingStats(content)
  const html = renderMarkdown(content)
  const toc = extractTOC(html)
  const meta = noteMeta[slug]
  const note: Note = {
    slug,
    title: meta?.title || titleFromSlug(slug),
    date: meta?.date || '',
    category: categoryFromPath(entry[0]),
    content: raw,
    html,
    toc,
    charCount,
    readingTime,
  }
  cacheSet(slug, note)
  return note
}


