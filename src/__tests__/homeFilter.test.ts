import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '../utils/content'
import {
  EMPTY_HOME_FILTERS,
  filterLabels,
  filterNotes,
  hasFilters,
  homeQueryFor,
  parseHomeFilters,
  toggleFilter,
} from '../utils/homeFilter'

function note(slug: string, category: string, date: string, tags: string[]): NoteMeta {
  return { slug, title: slug, date, category, charCount: 100, tags }
}

const notes = [
  note('a', 'Java', '2026-08-24', ['java']),
  note('b', 'Java', '2026-07-01', ['java', 'coding']),
  note('c', 'Godot', '2025-10-02', ['godot']),
]

describe('parseHomeFilters', () => {
  it('reads and combines category / tag / archive', () => {
    expect(parseHomeFilters({ category: 'Java', tag: 'CODING', archive: '2026' })).toEqual({
      category: 'Java',
      tag: 'coding',
      archive: '2026',
    })
  })

  it('normalizes legacy YYYY-MM archive links to the year', () => {
    expect(parseHomeFilters({ archive: '2026-07' }).archive).toBe('2026')
  })

  it('keeps valid fields when archive is invalid', () => {
    expect(parseHomeFilters({ category: 'Java', tag: 'java', archive: 'abc' })).toEqual({
      category: 'Java',
      tag: 'java',
      archive: '',
    })
  })

  it('accepts 其他 as an archive filter and ignores empty query', () => {
    expect(parseHomeFilters({ archive: '其他' }).archive).toBe('其他')
    expect(parseHomeFilters({})).toEqual(EMPTY_HOME_FILTERS)
  })
})

describe('hasFilters / homeQueryFor', () => {
  it('detects any active filter and omits empty query keys', () => {
    expect(hasFilters(EMPTY_HOME_FILTERS)).toBe(false)
    expect(hasFilters({ ...EMPTY_HOME_FILTERS, tag: 'java' })).toBe(true)
    expect(homeQueryFor({ category: 'Java', tag: '', archive: '2026' })).toEqual({
      category: 'Java',
      archive: '2026',
    })
    expect(homeQueryFor(EMPTY_HOME_FILTERS)).toEqual({})
  })
})

describe('filterNotes', () => {
  it('filters by a single dimension', () => {
    const f = (patch: Partial<typeof EMPTY_HOME_FILTERS>) => ({ ...EMPTY_HOME_FILTERS, ...patch })
    expect(filterNotes(notes, f({ category: 'java' })).map((n) => n.slug)).toEqual(['a', 'b'])
    expect(filterNotes(notes, f({ tag: 'CODING' })).map((n) => n.slug)).toEqual(['b'])
    expect(filterNotes(notes, f({ archive: '2026' })).map((n) => n.slug)).toEqual(['a', 'b'])
  })

  it('combines dimensions with AND', () => {
    expect(
      filterNotes(notes, { category: 'Java', tag: 'coding', archive: '2026' }).map((n) => n.slug),
    ).toEqual(['b'])
    expect(filterNotes(notes, { category: 'Godot', tag: 'java', archive: '' })).toEqual([])
  })

  it('returns the original list when there is no filter', () => {
    expect(filterNotes(notes, EMPTY_HOME_FILTERS)).toBe(notes)
  })

  it('filters undated notes under 其他', () => {
    const withUndated = [...notes, note('u', 'Misc', '', [])]
    expect(
      filterNotes(withUndated, { ...EMPTY_HOME_FILTERS, archive: '其他' }).map((n) => n.slug),
    ).toEqual(['u'])
  })
})

describe('filterLabels / toggleFilter', () => {
  it('builds readable labels', () => {
    expect(filterLabels({ category: 'Java', tag: 'git', archive: '2026-08' })).toEqual([
      'Java',
      '#git',
      '2026-08',
    ])
    expect(filterLabels(EMPTY_HOME_FILTERS)).toEqual([])
  })

  it('toggles a dimension on and off', () => {
    const on = toggleFilter(EMPTY_HOME_FILTERS, 'tag', 'Git')
    expect(on.tag).toBe('Git')
    expect(toggleFilter(on, 'tag', 'git').tag).toBe('')
  })
})
