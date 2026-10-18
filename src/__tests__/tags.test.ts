import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '../utils/content'
import { buildTagIndex } from '../utils/tags'

function note(slug: string, tags: string[], date = '2026-01-01'): NoteMeta {
  return {
    slug,
    title: slug,
    date,
    category: 'Java',
    charCount: 100,
    tags,
  }
}

const notes = [
  note('a', ['java', 'coding'], '2026-03-01'),
  note('b', ['java', 'mysql'], '2025-12-01'),
  note('c', ['java'], '2026-01-01'),
  note('d', ['git'], '2026-02-01'),
  note('e', ['fresh'], '2026-04-01'),
]

describe('buildTagIndex', () => {
  it('sorts by most recent note first, not by article count', () => {
    expect(buildTagIndex(notes).map((t) => t.name)).toEqual([
      'fresh', // 2026-04-01，虽然只有 1 篇但最新
      'java', // 2026-03-01，最新一篇来自 a
      'coding', // 2026-03-01，同日期时文章数少，排在 java 后
      'git', // 2026-02-01
      'mysql', // 2025-12-01
    ])
  })

  it('keeps article count as the weight', () => {
    const index = buildTagIndex(notes)
    expect(index.find((t) => t.name === 'java')?.count).toBe(3)
    expect(index.find((t) => t.name === 'fresh')?.count).toBe(1)
  })

  it('tracks the latest date per tag', () => {
    const index = buildTagIndex(notes)
    expect(index.find((t) => t.name === 'java')?.latestDate).toBe('2026-03-01')
    expect(index.find((t) => t.name === 'mysql')?.latestDate).toBe('2025-12-01')
  })

  it('ignores empty tags and handles missing tag arrays', () => {
    const list = [note('a', ['Java', '  ']), note('b', [])]
    expect(buildTagIndex(list)).toEqual([{ name: 'java', count: 1, latestDate: '2026-01-01' }])
  })

  it('returns empty array for no notes', () => {
    expect(buildTagIndex([])).toEqual([])
  })
})
