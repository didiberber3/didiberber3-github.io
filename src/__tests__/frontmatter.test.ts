import { describe, it, expect } from 'vitest'
import { parseFrontmatter, parseFrontmatterWithContent } from '../utils/frontmatter'

describe('parseFrontmatter', () => {
  it('extracts key-value pairs from frontmatter (LF)', () => {
    const result = parseFrontmatter('---\ndate: 2026-01-15\ntitle: Hello\ntags: test\n---\n# Body')
    expect(result).toEqual({ date: '2026-01-15', title: 'Hello', tags: 'test' })
  })

  it('extracts key-value pairs from frontmatter (CRLF)', () => {
    const result = parseFrontmatter('---\r\ndate: 2026-05-31\r\ntags: Java\r\n---\r\n# Body')
    expect(result).toEqual({ date: '2026-05-31', tags: 'Java' })
  })

  it('returns empty object when no frontmatter', () => {
    const result = parseFrontmatter('# No frontmatter')
    expect(result).toEqual({})
  })

  it('returns empty object for empty frontmatter', () => {
    const result = parseFrontmatter('---\n\n---\n# Content')
    expect(result).toEqual({})
  })

  it('ignores lines without colon', () => {
    const result = parseFrontmatter('---\ndate: 2026-01-01\njust_a_line\nkey: value\n---\n# Body')
    expect(result).toEqual({ date: '2026-01-01', key: 'value' })
  })
})

describe('parseFrontmatterWithContent', () => {
  it('returns both frontmatter and content', () => {
    const result = parseFrontmatterWithContent('---\ntitle: Test\n---\n# Content body')
    expect(result.frontmatter).toEqual({ title: 'Test' })
    expect(result.content).toBe('# Content body')
  })

  it('returns raw content when no frontmatter', () => {
    const raw = '# Plain content'
    const result = parseFrontmatterWithContent(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe(raw)
  })
})
