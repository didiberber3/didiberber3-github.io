import type { NoteMeta } from './content'

export interface TagStat {
  name: string
  count: number
  /** 该标签下最新一篇笔记的日期（yyyy-mm-dd），用于排序 */
  latestDate: string
}

/**
 * 按标签聚合：
 * - count 作为标签云的字号权重
 * - latestDate 作为排序依据（最近更新的标签在前），不按文章数排序
 */
export function buildTagIndex(notes: NoteMeta[]): TagStat[] {
  const stats = new Map<string, TagStat>()

  for (const note of notes) {
    for (const raw of note.tags ?? []) {
      const tag = raw.trim().toLowerCase()
      if (!tag) continue
      const current = stats.get(tag)
      if (current) {
        current.count += 1
        if (note.date && note.date > current.latestDate) current.latestDate = note.date
      } else {
        stats.set(tag, { name: tag, count: 1, latestDate: note.date || '' })
      }
    }
  }

  return [...stats.values()].sort(
    (a, b) =>
      b.latestDate.localeCompare(a.latestDate) || b.count - a.count || a.name.localeCompare(b.name),
  )
}

/** 按标签筛选笔记（大小写不敏感） */
export function filterNotesByTag(notes: NoteMeta[], tag: string | undefined): NoteMeta[] {
  const key = (tag ?? '').trim().toLowerCase()
  if (!key) return []
  return notes.filter((note) => note.tags.some((t) => t.toLowerCase() === key))
}
