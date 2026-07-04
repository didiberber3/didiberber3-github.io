/**
 * Frontmatter 解析共享模块
 *
 * 统一三个模块（contentIndexPlugin / rssPlugin / markdown）的 frontmatter 解析逻辑，
 * 消除三份重复代码。
 *
 * 特性:
 * - key 不区分大小写（均转为小写）
 * - 自动补正常见日期格式为 ISO (YYYY-MM-DD)
 */

function normalizeDate(raw: string): string {
  // 已归一化: 2026-06-06
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  // 无分隔符: 20260606
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  }
  // 尝试 Date 构造器解析 (兼容 2026-6-6, 2026/6/6, Jun 6 2026 等)
  const d = new Date(raw)
  if (!isNaN(d.getTime())) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
  }
  // 无法解析则原样返回（fallback 会有 mtime 兜底）
  return raw
}

export function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return {}
  const fm: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(': ')
    if (idx > 0) {
      const key = line.slice(0, idx).trim().toLowerCase()
      const value = line.slice(idx + 2).trim()
      fm[key] = key === 'date' ? normalizeDate(value) : value
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
