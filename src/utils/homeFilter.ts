import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { NoteMeta } from './content'

export type HomeFilter =
  | { type: 'category'; value: string }
  | { type: 'tag'; value: string }
  | { type: 'archive'; value: string }
  | null

function firstValue(value: LocationQuery[string]): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

/** 从路由 query 解析首页筛选状态（category > tag > archive） */
export function parseHomeFilter(query: LocationQuery): HomeFilter {
  const category = firstValue(query.category).trim()
  if (category) return { type: 'category', value: category }

  const tag = firstValue(query.tag).trim().toLowerCase()
  if (tag) return { type: 'tag', value: tag }

  const archive = firstValue(query.archive).trim()
  if (archive === '其他' || /^\d{4}(-\d{2})?$/.test(archive)) {
    return { type: 'archive', value: archive }
  }

  return null
}

/** 筛选状态 → 首页 query */
export function homeQueryFor(filter: HomeFilter): LocationQueryRaw {
  if (!filter) return {}
  if (filter.type === 'category') return { category: filter.value }
  if (filter.type === 'tag') return { tag: filter.value }
  return { archive: filter.value }
}

/** 按筛选状态过滤笔记（archive 用日期前缀匹配年 / 年月） */
export function filterNotes(notes: NoteMeta[], filter: HomeFilter): NoteMeta[] {
  if (!filter) return notes
  if (filter.type === 'category') {
    const key = filter.value.toLowerCase()
    return notes.filter((note) => note.category.toLowerCase() === key)
  }
  if (filter.type === 'tag') {
    const key = filter.value.toLowerCase()
    return notes.filter((note) => note.tags.some((tag) => tag.toLowerCase() === key))
  }
  if (filter.value === '其他') return notes.filter((note) => !note.date)
  return notes.filter((note) => note.date.startsWith(filter.value))
}
