import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { categoryFromFilePath, walkMdFiles } from '../utils/fs'
import { parseFrontmatterWithContent } from '../utils/frontmatter'

/**
 * 内容规范守卫：把 content/notes 同时当作 Obsidian 仓库使用后，
 * 用测试保证 frontmatter 不漂移（date 必须是 yyyy-mm-dd、tag 统一为 tags、标签小写）。
 * 根目录文件（Obsidian 日记等）不参与校验，因为它们本来就不进博客。
 */
const notesDir = join(process.cwd(), 'content/notes')
const noteFiles = walkMdFiles(notesDir).filter((file) => categoryFromFilePath(file) !== '')

describe('content/notes frontmatter 规范', () => {
  it('至少有一条分类笔记', () => {
    expect(noteFiles.length).toBeGreaterThan(0)
  })

  for (const file of noteFiles) {
    const rel = file
      .replace(process.cwd(), '')
      .replace(/^[\\/]/, '')
      .replace(/\\/g, '/')

    it(rel, () => {
      const raw = readFileSync(file, 'utf-8')
      const { frontmatter: fm, content } = parseFrontmatterWithContent(raw)
      const fmText = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''

      expect(raw.startsWith('---'), '缺少 frontmatter').toBe(true)
      expect(content.trim().length, '正文为空').toBeGreaterThan(0)

      const dateLine = fmText.match(/^date\s*:\s*(.+?)\s*$/m)
      expect(dateLine, '缺少 date 字段').toBeTruthy()
      expect(dateLine![1]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof fm.date).toBe('string')

      expect(fmText, '旧字段 tag 应改为 tags').not.toMatch(/^tag\s*:/m)

      const tagsLine = fmText.match(/^tags\s*:\s*(.+?)\s*$/m)
      if (tagsLine) {
        expect(tagsLine[1], 'tags 值必须小写').not.toMatch(/[A-Z]/)
      }
      for (const item of fmText.matchAll(/^\s*-\s+(.+?)\s*$/gm)) {
        expect(item[1], '块列表标签必须小写').not.toMatch(/[A-Z]/)
      }
      if (fm.tags) {
        expect(Array.isArray(fm.tags)).toBe(true)
        for (const tag of fm.tags as string[]) {
          expect(tag).toBe(tag.toLowerCase())
        }
      }

      const descLine = fmText.match(/^description\s*:\s*(.+?)\s*$/m)
      expect(descLine, '缺少 description 一句话简介').toBeTruthy()
      const description = descLine![1]
      expect(description.length, 'description 不能为空').toBeGreaterThan(0)
      expect(description, 'description 必须以。结尾').toMatch(/。$/)
      expect((description.match(/。/g) ?? []).length, 'description 只能有一句话').toBe(1)
      expect(typeof fm.description).toBe('string')
    })
  }
})
