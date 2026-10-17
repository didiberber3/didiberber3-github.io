import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '../utils/content'
import { buildArchiveIndex } from '../utils/archive'

function note(slug: string, date: string): NoteMeta {
  return { slug, title: slug, date, category: 'Java', charCount: 100, tags: [] }
}

describe('buildArchiveIndex', () => {
  it('groups notes by year and month', () => {
    const groups = buildArchiveIndex([
      note('a', '2026-08-24'),
      note('b', '2026-08-20'),
      note('c', '2026-07-01'),
      note('d', '2025-09-10'),
    ])
    expect(groups.map((g) => g.year)).toEqual(['2026', '2025'])
    expect(groups[0].count).toBe(3)
    expect(groups[0].months.map((m) => m.month)).toEqual(['08', '07'])
    expect(groups[0].months[0].notes.map((n) => n.slug)).toEqual(['a', 'b'])
  })

  it('puts notes without date into 其他', () => {
    const groups = buildArchiveIndex([note('x', ''), note('a', '2026-01-01')])
    expect(groups.map((g) => g.year)).toEqual(['其他', '2026'])
    expect(groups[0].months[0].notes.map((n) => n.slug)).toEqual(['x'])
  })

  it('returns empty array for no notes', () => {
    expect(buildArchiveIndex([])).toEqual([])
  })
})
