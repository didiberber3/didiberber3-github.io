import { describe, it, expect } from 'vitest'
import {
  parseFrontmatter,
  extractTOC,
  groupTocItems,
  renderMarkdown,
  type TocItem,
} from '../utils/markdown'

describe('parseFrontmatter', () => {
  it('extracts frontmatter and content with LF endings', () => {
    const raw = `---
date: 2026-01-15
title: Hello
tags: test
---
# Content body`
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ date: '2026-01-15', title: 'Hello', tags: 'test' })
    expect(result.content).toBe('# Content body')
  })

  it('extracts frontmatter and content with CRLF endings', () => {
    const raw = '---\r\ndate: 2026-05-31\r\ntags: Java\r\n---\r\n\r\n# Test\r\n\r\nThis is test...'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ date: '2026-05-31', tags: 'Java' })
    expect(result.content).toContain('# Test')
    expect(result.content).toContain('This is test...')
  })

  it('returns raw content when no frontmatter', () => {
    const raw = '# No frontmatter here'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe('# No frontmatter here')
  })

  it('handles empty frontmatter (no keys)', () => {
    const raw = '---\n\n---\n# Empty frontmatter'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe('# Empty frontmatter')
  })
})

describe('renderMarkdown', () => {
  it('renders inline code', () => {
    const html = renderMarkdown('Use the `code` tag')
    expect(html).toContain('<code>code</code>')
  })

  it('renders fenced code blocks', () => {
    const html = renderMarkdown('```js\nconst x = 1\n```')
    expect(html).toContain('<pre>')
    expect(html).toContain('<code')
  })

  it('generates heading IDs', () => {
    const html = renderMarkdown('## Hello World')
    expect(html).toContain('id="hello-world"')
  })

  it('handles Chinese headings', () => {
    const html = renderMarkdown('# 你好世界')
    expect(html).toContain('id="你好世界"')
  })

  it('renders GFM tables', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |'
    const html = renderMarkdown(md)
    expect(html).toContain('<table>')
    expect(html).toContain('<td>')
  })

  it('deduplicates heading IDs for repeated titles', () => {
    const html = renderMarkdown('## 说明\n\n## 说明\n\n### 说明')
    expect(html).toContain('id="说明"')
    expect(html).toContain('id="说明-1"')
    expect(html).toContain('id="说明-2"')
  })

  it('resets the heading ID dedup state between renders', () => {
    renderMarkdown('## 重名')
    const second = renderMarkdown('## 重名')
    expect(second).toContain('id="重名"')
    expect(second).not.toContain('id="重名-1"')
  })
})

describe('extractTOC', () => {
  it('extracts h1, h2, h3 from HTML', () => {
    const html = '<h1 id="a">A</h1><h2 id="b">B</h2><h3 id="c">C</h3>'
    const toc = extractTOC(html)
    expect(toc).toEqual([
      { level: 1, id: 'a', text: 'A' },
      { level: 2, id: 'b', text: 'B' },
      { level: 3, id: 'c', text: 'C' },
    ])
  })

  it('skips empty headings', () => {
    const html = '<h2 id="x">  </h2><h2 id="y">Y</h2>'
    const toc = extractTOC(html)
    expect(toc).toHaveLength(1)
    expect(toc[0].id).toBe('y')
  })

  it('returns empty array when no headings', () => {
    const html = '<p>No headings here</p>'
    expect(extractTOC(html)).toEqual([])
  })
})

describe('groupTocItems', () => {
  it('groups h2 with following h3', () => {
    const items: TocItem[] = [
      { level: 2, id: 'a', text: 'A' },
      { level: 3, id: 'a1', text: 'A1' },
      { level: 3, id: 'a2', text: 'A2' },
      { level: 2, id: 'b', text: 'B' },
    ]
    const groups = groupTocItems(items)
    expect(groups).toHaveLength(2)
    expect(groups[0].h2.id).toBe('a')
    expect(groups[0].children).toHaveLength(2)
    expect(groups[1].h2.id).toBe('b')
    expect(groups[1].children).toHaveLength(0)
  })

  it('treats h1 as standalone group', () => {
    const items: TocItem[] = [
      { level: 1, id: 'title', text: 'Title' },
      { level: 2, id: 'a', text: 'A' },
    ]
    const groups = groupTocItems(items)
    expect(groups).toHaveLength(2)
    expect(groups[0].h2.level).toBe(1)
    expect(groups[0].children).toHaveLength(0)
  })
})
