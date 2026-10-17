import { describe, it, expect } from 'vitest'
import {
  normalizeDate,
  normalizeTags,
  parseFrontmatter,
  parseFrontmatterWithContent,
} from '../utils/frontmatter'

describe('normalizeDate', () => {
  it('keeps ISO dates', () => {
    expect(normalizeDate('2026-06-06')).toBe('2026-06-06')
  })

  it('pads single-digit month/day', () => {
    expect(normalizeDate('2026-6-6')).toBe('2026-06-06')
  })

  it('supports compact and slash formats', () => {
    expect(normalizeDate('20260606')).toBe('2026-06-06')
    expect(normalizeDate('2026/6/6')).toBe('2026-06-06')
  })

  it('returns unparsable values untouched', () => {
    expect(normalizeDate('not-a-date')).toBe('not-a-date')
  })
})

describe('normalizeTags', () => {
  it('lowercases, strips #, dedupes, keeps order', () => {
    expect(normalizeTags(['Java', '#JAVA', ' 集合 ', 'Mysql'])).toEqual(['java', '集合', 'mysql'])
  })

  it('turns spaces into hyphens', () => {
    expect(normalizeTags(['Machine Learning'])).toEqual(['machine-learning'])
  })
})

describe('parseFrontmatter', () => {
  it('extracts key-value pairs (LF)', () => {
    const fm = parseFrontmatter('---\ndate: 2026-01-15\ntitle: Hello\ntags: test\n---\n# Body')
    expect(fm.date).toBe('2026-01-15')
    expect(fm.title).toBe('Hello')
    expect(fm.tags).toEqual(['test'])
  })

  it('extracts key-value pairs (CRLF)', () => {
    const fm = parseFrontmatter('---\r\ndate: 2026-05-31\r\ntags: Java\r\n---\r\n# Body')
    expect(fm.date).toBe('2026-05-31')
    expect(fm.tags).toEqual(['java'])
  })

  it('supports colon without space', () => {
    const fm = parseFrontmatter('---\ndate:2026-01-01\ntag:tutorial\n---\n')
    expect(fm.date).toBe('2026-01-01')
    expect(fm.tags).toEqual(['tutorial'])
  })

  it('merges tag and tags, lowercases and dedupes', () => {
    const fm = parseFrontmatter('---\ntag: Godot\ntags: [godot, GDScript]\ndate: 2026-06-06\n---\n')
    expect(fm.tags).toEqual(['godot', 'gdscript'])
  })

  it('supports block list tags', () => {
    const fm = parseFrontmatter('---\ndate: 2025-08-29\ntags:\n  - Java\n  - Coding\n---\n')
    expect(fm.tags).toEqual(['java', 'coding'])
  })

  it('supports inline arrays', () => {
    const fm = parseFrontmatter('---\ntags: [Java, "集合", coding]\n---\n')
    expect(fm.tags).toEqual(['java', '集合', 'coding'])
  })

  it('splits scalar tag strings by comma / whitespace', () => {
    const fm = parseFrontmatter('---\ntags: Java, Mysql\n---\n')
    expect(fm.tags).toEqual(['java', 'mysql'])
  })

  it('strips quotes and inline comments', () => {
    const fm = parseFrontmatter('---\ntitle: "Hello: World" # note\ndate: 2026-01-01\n---\n')
    expect(fm.title).toBe('Hello: World')
    expect(fm.date).toBe('2026-01-01')
  })

  it('keeps unknown list keys as arrays', () => {
    const fm = parseFrontmatter('---\naliases:\n  - 集合\n  - Collection\n---\n')
    expect(fm.aliases).toEqual(['集合', 'Collection'])
  })

  it('returns empty object when no frontmatter', () => {
    expect(parseFrontmatter('# No frontmatter')).toEqual({})
  })

  it('returns empty object for empty frontmatter', () => {
    expect(parseFrontmatter('---\n\n---\n# Content')).toEqual({})
  })

  it('ignores lines without colon', () => {
    const fm = parseFrontmatter('---\ndate: 2026-01-01\njust_a_line\nkey: value\n---\n# Body')
    expect(fm.date).toBe('2026-01-01')
    expect(fm.key).toBe('value')
  })
})

describe('parseFrontmatterWithContent', () => {
  it('returns both frontmatter and content', () => {
    const result = parseFrontmatterWithContent('---\ntitle: Test\n---\n# Content body')
    expect(result.frontmatter.title).toBe('Test')
    expect(result.content).toBe('# Content body')
  })

  it('returns raw content when no frontmatter', () => {
    const raw = '# Plain content'
    const result = parseFrontmatterWithContent(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe(raw)
  })
})
