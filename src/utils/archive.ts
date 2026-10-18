import type { NoteMeta } from './content'

/**
 * 归档只按年份聚合，供首页归档索引使用。
 * 无日期的笔记归入「其他」，排在最后。
 */
export function buildArchiveYears(notes: NoteMeta[]): string[] {
  const years = new Set<string>()
  let hasUndated = false

  for (const note of notes) {
    if (!note.date) {
      hasUndated = true
      continue
    }
    years.add(note.date.slice(0, 4))
  }

  const sorted = [...years].sort((a, b) => b.localeCompare(a))
  if (hasUndated) sorted.push('其他')
  return sorted
}
