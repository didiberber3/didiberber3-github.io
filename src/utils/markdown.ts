import { Marked, Renderer } from 'marked'

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1') || 'heading'
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

export function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }

  const fm: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(': ')
    if (idx > 0) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
    }
  }

  return { frontmatter: fm, content: match[2] }
}
