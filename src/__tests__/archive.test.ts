import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '../utils/content'
import { buildArchiveYears } from '../utils/archive'

function note(slug: string, date: string): NoteMeta {
  return { slug, title: slug, date, category: 'Java', charCount: 100, tags: [] }
}

describe('buildArchiveYears', () => {
  it('returns unique years sorted descending', () => {
    expect(
      buildArchiveYears([
        note('a', '2026-08-24'),
        note('b', '2026-07-01'),
        note('c', '2025-09-10'),
        note('d', '2025-01-01'),
      ]),
    ).toEqual(['2026', '2025'])
  })

  it('puts notes without date into 其他 at the end', () => {
    expect(buildArchiveYears([note('a', '2026-01-01'), note('x', '')])).toEqual(['2026', '其他'])
  })

  it('returns empty array for no notes', () => {
    expect(buildArchiveYears([])).toEqual([])
  })
})
