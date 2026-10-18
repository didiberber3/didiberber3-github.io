import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { NoteMeta } from './content'

export interface HomeFilters {
  category: string
  tag: string
  archive: string
}

type FilterType = keyof HomeFilters

export const EMPTY_HOME_FILTERS: HomeFilters = {
  category: '',
  tag: '',
  archive: '',
}

function firstValue(value: LocationQuery[string]): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function normalizeArchive(value: string): string {
  if (value === '其他') return '其他'
  // 只保留年份；旧的 YYYY-MM 链接降级到该年
  return value.match(/^(\d{4})(?:-\d{2})?$/)?.[1] ?? ''
}

/** 从路由 query 解析首页筛选状态；分类 / 标签 / 归档可以同时存在（AND） */
export function parseHomeFilters(query: LocationQuery): HomeFilters {
  return {
    category: firstValue(query.category).trim(),
    tag: firstValue(query.tag).trim().toLowerCase(),
    archive: normalizeArchive(firstValue(query.archive).trim()),
  }
}

export function hasFilters(filters: HomeFilters): boolean {
  return Boolean(filters.category || filters.tag || filters.archive)
}

/** 筛选状态 → 首页 query（空项省略） */
export function homeQueryFor(filters: HomeFilters): LocationQueryRaw {
  const query: Record<string, string> = {}
  if (filters.category) query.category = filters.category
  if (filters.tag) query.tag = filters.tag
  if (filters.archive) query.archive = filters.archive
  return query
}

/** 按筛选状态过滤笔记，多个条件之间是 AND */
export function filterNotes(notes: NoteMeta[], filters: HomeFilters): NoteMeta[] {
  if (!hasFilters(filters)) return notes

  const category = filters.category.toLowerCase()
  const tag = filters.tag.toLowerCase()

  return notes.filter((note) => {
    if (category && note.category.toLowerCase() !== category) return false
    if (tag && !note.tags.some((item) => item.toLowerCase() === tag)) return false
    if (filters.archive) {
      if (filters.archive === '其他') {
        if (note.date) return false
      } else if (!note.date.startsWith(filters.archive)) {
        return false
      }
    }
    return true
  })
}

/** 当前生效的筛选维度列表（用于读屏播报） */
export function filterLabels(filters: HomeFilters): string[] {
  const labels: string[] = []
  if (filters.category) labels.push(filters.category)
  if (filters.tag) labels.push(`#${filters.tag}`)
  if (filters.archive) labels.push(filters.archive)
  return labels
}

/** 切换某个维度的筛选：已选中则移除，否则替换该维度 */
export function toggleFilter(filters: HomeFilters, type: FilterType, value: string): HomeFilters {
  const next: HomeFilters = { ...filters }
  const active = filters[type].toLowerCase() === value.toLowerCase()
  next[type] = active ? '' : value
  return next
}
