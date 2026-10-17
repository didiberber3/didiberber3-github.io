/**
 * Frontmatter 解析共享模块（Obsidian 兼容）
 *
 * 统一 contentIndexPlugin / rssPlugin / markdown / 迁移脚本的解析逻辑。
 *
 * 支持:
 * - key 不区分大小写（统一转小写）
 * - `key: value` 与 `key:value`（冒号后空格可省略）
 * - 单引号 / 双引号字符串
 * - 行内数组 `tags: [java, 集合]`
 * - 块列表
 *   tags:
 *     - java
 *     - 集合
 * - `tag` / `tags` 两种 key，合并去重
 * - 标签统一小写、去 #、空格转 -
 * - 日期自动补全为 ISO (YYYY-MM-DD)
 * - 行尾注释（` # ...`，引号内不算）
 */

export type FrontmatterValue = string | string[]
export type Frontmatter = Record<string, FrontmatterValue>

/** 把常见日期写法统一成 yyyy-mm-dd */
export function normalizeDate(raw: string): string {
  const value = raw.trim()
  // 已归一化: 2026-06-06
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  // 无分隔符: 20260606
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
  }
  // 尝试 Date 构造器解析 (兼容 2026-6-6, 2026/6/6, Jun 6 2026 等)
  const d = new Date(value)
  if (!Number.isNaN(d.getTime())) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
  }
  // 无法解析则原样返回（fallback 会有 mtime / 文件名兜底）
  return value
}

/** 去掉一层引号 */
function unquote(raw: string): string {
  const value = raw.trim()
  if (value.length >= 2) {
    const first = value[0]
    const last = value[value.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\')
    }
  }
  return value
}

/** 去掉行尾注释（引号内的 # 保留） */
function stripInlineComment(raw: string): string {
  let quote: string | null = null
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (quote) {
      if (ch === quote && raw[i - 1] !== '\\') quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === '#' && (i === 0 || /\s/.test(raw[i - 1]))) {
      return raw.slice(0, i).trimEnd()
    }
  }
  return raw.trim()
}

/** 解析 `[a, b]` 形式的行内数组 */
function parseInlineList(raw: string): string[] {
  const inner = raw.trim().replace(/^\[/, '').replace(/\]$/, '')
  const out: string[] = []
  let current = ''
  let quote: string | null = null
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null
      else current += ch
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === ',') {
      if (current.trim()) out.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) out.push(current.trim())
  return out.map(unquote)
}

/** 标签统一小写、去 #、空格转 -，保序去重 */
export function normalizeTags(rawTags: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of rawTags) {
    const tag = raw.replace(/^#+/, '').trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !seen.has(tag)) {
      seen.add(tag)
      result.push(tag)
    }
  }
  return result
}

function splitTagString(raw: string): string[] {
  // 标量写法兼容 `tags: java, 集合` 与 `tags: java 集合`
  return raw
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseFrontmatter(raw: string): Frontmatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return {}

  type Entry = { key: string; value: FrontmatterValue }
  const entries: Entry[] = []
  let pendingList: { key: string; items: string[] } | null = null

  function flushPending() {
    if (pendingList) {
      entries.push({ key: pendingList.key, value: pendingList.items })
      pendingList = null
    }
  }

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue
    // 顶层注释行（不进入任何键）
    if (/^\s*#/.test(line)) continue

    // 块列表项
    const listMatch = line.match(/^\s*-\s+(.*)$/)
    if (listMatch && pendingList) {
      pendingList.items.push(unquote(stripInlineComment(listMatch[1])))
      continue
    }

    const kv = line.match(/^([^:]+?)\s*:\s?(.*)$/)
    if (!kv) continue
    flushPending()

    const key = kv[1].trim().toLowerCase()
    const value = stripInlineComment(kv[2]).trim()

    if (!value) {
      // 可能是块列表的起始行（tags:）
      pendingList = { key, items: [] }
    } else if (value.startsWith('[') && value.endsWith(']')) {
      entries.push({ key, value: parseInlineList(value) })
    } else {
      entries.push({ key, value: unquote(value) })
    }
  }
  flushPending()

  const fm: Frontmatter = {}
  const tagValues: string[] = []

  for (const { key, value } of entries) {
    if (key === 'tag' || key === 'tags') {
      const values = Array.isArray(value) ? value : splitTagString(value)
      tagValues.push(...values)
      continue
    }
    if (key === 'date') {
      fm.date = normalizeDate(Array.isArray(value) ? String(value[0] ?? '') : value)
      continue
    }
    fm[key] = value
  }

  const tags = normalizeTags(tagValues)
  if (tags.length) fm.tags = tags

  return fm
}

export function parseFrontmatterWithContent(raw: string): {
  frontmatter: Frontmatter
  content: string
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }
  return {
    frontmatter: parseFrontmatter(raw),
    content: match[2],
  }
}
