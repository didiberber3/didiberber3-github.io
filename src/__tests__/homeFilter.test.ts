import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '../utils/content'
import { filterNotes, homeQueryFor, parseHomeFilter } from '../utils/homeFilter'

function note(slug: string, category: string, date: string, tags: string[]): NoteMeta {
  return { slug, title: slug, date, category, charCount: 100, tags }
}

const notes = [
  note('a', 'Java', '2026-08-24', ['java']),
  note('b', 'Java', '2026-07-01', ['java', 'coding']),
  note('c', 'Godot', '2025-10-02', ['godot']),
]

describe('parseHomeFilter', () => {
  it('reads category / tag / archive from query', () => {
    expect(parseHomeFilter({ category: 'Java' })).toEqual({ type: 'category', value: 'Java' })
    expect(parseHomeFilter({ tag: 'Java' })).toEqual({ type: 'tag', value: 'java' })
    expect(parseHomeFilter({ archive: '2026' })).toEqual({ type: 'archive', value: '2026' })
    expect(parseHomeFilter({ archive: '2026-08' })).toEqual({ type: 'archive', value: '2026-08' })
    expect(parseHomeFilter({ archive: '其他' })).toEqual({ type: 'archive', value: '其他' })
  })

  it('ignores invalid archive values and empty query', () => {
    expect(parseHomeFilter({})).toBeNull()
    expect(parseHomeFilter({ archive: 'abc' })).toBeNull()
  })
  it('prefers category over tag and archive', () => {
    expect(parseHomeFilter({ category: 'Java', tag: 'java' })).toEqual({
      type: 'category',
      value: 'Java',
    })
  })
})

describe('homeQueryFor', () => {
  it('builds a single-key query', () => {
    expect(homeQueryFor({ type: 'category', value: 'Java' })).toEqual({ category: 'Java' })
    expect(homeQueryFor({ type: 'tag', value: 'java' })).toEqual({ tag: 'java' })
    expect(homeQueryFor({ type: 'archive', value: '2026-08' })).toEqual({ archive: '2026-08' })
    expect(homeQueryFor(null)).toEqual({})
  })
})

describe('filterNotes', () => {
  it('filters by category, tag and archive prefix', () => {
    expect(filterNotes(notes, { type: 'category', value: 'java' }).map((n) => n.slug)).toEqual([
      'a',
      'b',
    ])
    expect(filterNotes(notes, { type: 'tag', value: 'CODING' }).map((n) => n.slug)).toEqual(['b'])
    expect(filterNotes(notes, { type: 'archive', value: '2026' }).map((n) => n.slug)).toEqual([
      'a',
      'b',
    ])
    expect(filterNotes(notes, { type: 'archive', value: '2026-07' }).map((n) => n.slug)).toEqual([
      'b',
    ])
  })

  it('returns the original list when there is no filter', () => {
    expect(filterNotes(notes, null)).toBe(notes)
  })

  it('filters undated notes under 其他', () => {
    const withUndated = [...notes, note('u', 'Misc', '', [])]
    expect(filterNotes(withUndated, { type: 'archive', value: '其他' }).map((n) => n.slug)).toEqual(
      ['u'],
    )
  })
})
