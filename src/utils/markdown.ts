import { Marked } from 'marked'

const marked = new Marked({
  gfm: true,
  breaks: true,
})

export interface TocItem {
  level: number
  id: string
  text: string
}

export function renderMarkdown(content: string): string {
  return marked.parse(content) as string
}

export function extractTOC(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/g
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
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }

  const fm: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(': ')
    if (idx > 0) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
    }
  }

  return { frontmatter: fm, content: match[2] }
}
