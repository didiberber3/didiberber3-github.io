/**
 * Frontmatter 解析共享模块
 *
 * 统一三个模块（contentIndexPlugin / rssPlugin / markdown）的 frontmatter 解析逻辑，
 * 消除三份重复代码。
 */

export function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return {}
  const fm: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(': ')
    if (idx > 0) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
    }
  }
  return fm
}

export function parseFrontmatterWithContent(raw: string): {
  frontmatter: Record<string, string>
  content: string
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }
  return {
    frontmatter: parseFrontmatter(raw),
    content: match[2],
  }
}
