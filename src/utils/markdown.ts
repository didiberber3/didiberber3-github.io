import { Marked, Renderer } from 'marked'
import { parseFrontmatterWithContent } from './frontmatter'
import { stripMarkdown } from './text'

/**
 * 每次 renderMarkdown 调用独立的已用 id 集合，
 * 重名标题自动追加序号（第一个用原名，第二个起 `-1`、`-2`…），
 * 保证 HTML id 与 TOC 跳转唯一。
 */
let usedHeadingIds = new Set<string>()

function headingId(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1') || 'heading'

  let id = base
  let n = 1
  while (usedHeadingIds.has(id)) {
    id = `${base}-${n++}`
  }
  usedHeadingIds.add(id)
  return id
}

const renderer = new Renderer()
renderer.heading = function (text: string, level: number): string {
  const id = headingId(text)
  return `<h${level} id="${id}">${text}</h${level}>`
}

const marked = new Marked({ gfm: true, breaks: true })
marked.use({ renderer })

export interface TocItem {
  level: number
  id: string
  text: string
}

export interface TocGroup {
  h2: TocItem
  children: TocItem[]
}

export function groupTocItems(items: TocItem[]): TocGroup[] {
  const groups: TocGroup[] = []
  let current: TocGroup | null = null

  for (const item of items) {
    if (item.level === 1) {
      // h1 — standalone group, resets h2→h3 grouping
      current = null
      groups.push({ h2: item, children: [] })
    } else if (item.level === 2) {
      current = { h2: item, children: [] }
      groups.push(current)
    } else if (item.level === 3 && current) {
      current.children.push(item)
    }
  }

  return groups
}

export function renderMarkdown(content: string): string {
  usedHeadingIds = new Set()
  return marked.parse(content) as string
}

export function extractTOC(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([123])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[123]>/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const inner = match[3].replace(/<[^>]+>/g, '').trim()
    if (inner) {
      items.push({
        level: parseInt(match[1]),
        id: match[2],
        text: inner,
      })
    }
  }

  return items
}

export function computeReadingStats(text: string): { charCount: number; readingTime: number } {
  const plain = stripMarkdown(text)
  const charCount = plain.replace(/\s/g, '').length
  const readingTime = Math.max(1, Math.ceil(charCount / 300))
  return { charCount, readingTime }
}

export { parseFrontmatterWithContent as parseFrontmatter }
