/**
 * 文件系统共享模块
 *
 * 统一 contentIndexPlugin / rssPlugin 的目录遍历逻辑，
 * 消除两份重复的 walkNotes 实现。
 */

import { readdirSync } from 'fs'
import { join } from 'path'

/** 递归遍历目录，返回所有 .md 文件的绝对路径 */
export function walkMdFiles(dir: string): string[] {
  const results: string[] = []
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        results.push(...walkMdFiles(fullPath))
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath)
      }
    }
  } catch (e) {
    console.warn('[walkMdFiles] Failed to walk:', dir, e)
  }
  return results
}

/** 从 .md 文件绝对路径中提取 slug（不含扩展名的文件名） */
export function slugFromFilePath(filepath: string): string {
  return filepath.replace(/\\/g, '/').split('/').pop()!.replace(/\.md$/, '')
}

/** 从 .md 文件绝对路径中提取分类（notes 目录的下一级目录；根目录文件返回空） */
export function categoryFromFilePath(filepath: string): string {
  const normalized = filepath.replace(/\\/g, '/')
  const parts = normalized.split('/')
  const notesIdx = parts.indexOf('notes')
  // 需要 notes/<category>/<file>.md 至少三段，根目录 notes/<file>.md 不算分类
  if (notesIdx >= 0 && notesIdx + 2 < parts.length) {
    return parts[notesIdx + 1]
  }
  return ''
}
