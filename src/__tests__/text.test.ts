import { describe, it, expect } from 'vitest'
import { stripMarkdown } from '../utils/text'

describe('stripMarkdown', () => {
  it('removes frontmatter', () => {
    const plain = stripMarkdown('---\ntitle: Test\n---\nHello world')
    expect(plain).toBe('Hello world')
  })

  it('removes code fences', () => {
    const plain = stripMarkdown('```js\nconst x = 1\n```\nAfter code')
    // code fence removed, trailing newline preserved
    expect(plain.trim()).toBe('After code')
  })

  it('removes inline code', () => {
    const plain = stripMarkdown('Use the `code` tag here')
    expect(plain).toBe('Use the  tag here')
  })

  it('removes images', () => {
    const plain = stripMarkdown('![alt](url) and text')
    expect(plain).toBe(' and text')
  })

  it('replaces links with text', () => {
    const plain = stripMarkdown('[click here](url) end')
    expect(plain).toBe('click here end')
  })

  it('removes markdown markers (# * _ ~ > |)', () => {
    const plain = stripMarkdown('# Heading **bold** _italic_ ~strike~ > quote | pipe')
    expect(plain).toContain('Heading')
    expect(plain).toContain('bold')
    expect(plain).not.toContain('#')
    expect(plain).not.toContain('**')
    expect(plain).not.toContain('_')
  })

  it('removes horizontal rules', () => {
    const plain = stripMarkdown('Text --- more + = text')
    expect(plain).not.toContain('---')
    expect(plain).not.toContain('+')
  })

  it('handles Chinese characters', () => {
    const plain = stripMarkdown('## 你好世界\n这是内容 *强调* [链接](url)')
    expect(plain).toContain('你好世界')
    expect(plain).toContain('这是内容')
    expect(plain).toContain('链接')
    expect(plain).not.toContain('*')
  })
})
