// Virtual module provided by Vite plugin — types declared in vite-env.d.ts
import { noteMeta, slugCategory } from 'virtual:content-index'
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

/* ===== Helpers ===== */

function titleFromSlug(slug: string): string {
  if (/[^\x00-\x7F]/.test(slug)) return slug
  return slug
    .split('-')
    .map((s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
}

/* ===== Sync: metadata only (no .md content fetched) ===== */

let noteListCache: NoteMeta[] | null = null
let categoriesCache: string[] | null = null

export function getNoteList(): NoteMeta[] {
  if (noteListCache) return noteListCache
  const list = Object.keys(noteMeta).map((slug) => {
    const meta = noteMeta[slug]
    return {
      slug,
      title: meta?.title || titleFromSlug(slug),
      date: meta?.date || '',
      category: slugCategory[slug] || '',
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
  for (const cat of Object.values(slugCategory)) {
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

/* ===== Async: full content loading (fetch static .md) ===== */

/** 由 Vite 插件的静态中间件提供：把 /notes/:category/:slug.md 映射到 content/notes 下的原文件。
 *  必须拼 BASE_URL，否则部署到子路径（如 GitHub Pages 的 /didiberber3-github.io/）时 404。 */
export function noteFilePath(category: string, slug: string): string {
  return `${import.meta.env.BASE_URL}notes/${category}/${encodeURIComponent(slug)}.md`
}

export async function loadNote(slug: string): Promise<Note | undefined> {
  const cached = cacheGet(slug)
  if (cached) return cached

  const meta = noteMeta[slug]
  if (!meta) return undefined
  const category = slugCategory[slug] || ''

  const res = await fetch(noteFilePath(category, slug))
  if (!res.ok) return undefined
  const raw = await res.text()

  const { content } = parseFrontmatter(raw)
  const { charCount, readingTime } = computeReadingStats(content)
  const html = renderMarkdown(content)
  const toc = extractTOC(html)
  const note: Note = {
    slug,
    title: meta.title || titleFromSlug(slug),
    date: meta.date || '',
    category,
    content: raw,
    html,
    toc,
    charCount,
    readingTime,
  }
  cacheSet(slug, note)
  return note
}
