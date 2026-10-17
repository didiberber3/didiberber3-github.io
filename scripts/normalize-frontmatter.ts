/**
 * 批量规范化 content/notes 的 frontmatter（Obsidian 兼容）。
 *
 * 用法：
 *   node scripts/normalize-frontmatter.ts           # 只预览，不写文件
 *   node scripts/normalize-frontmatter.ts --write   # 写入（默认先备份到 .frontmatter-backup/）
 *
 * 规则：
 * - date 统一为 yyyy-mm-dd；缺失时按 文件名日期 → git 最后提交日期 → 文件 mtime 推断
 * - tag / tags 合并为 `tags`，值全部小写、去 #、去重
 * - 未知字段（title/category/info 等）原样保留
 * - 只处理分类子目录里的笔记；根目录文件（Obsidian 日记）不动
 * - 正文逐字节保留（不改换行、不改内容），可重复执行
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import {
  parseFrontmatterWithContent,
  type Frontmatter,
  type FrontmatterValue,
} from '../src/utils/frontmatter.ts'
import { categoryFromFilePath, walkMdFiles } from '../src/utils/fs.ts'

const root = process.cwd()
const notesDir = join(root, 'content/notes')
const backupDir = join(root, '.frontmatter-backup')
const apply = process.argv.includes('--write')
const useBackup = !process.argv.includes('--no-backup')

const fmBlockRe = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/

function detectEol(raw: string): string {
  const i = raw.indexOf('\n')
  if (i === -1) return '\n'
  return raw[i - 1] === '\r' ? '\r\n' : '\n'
}

function isValidDate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return false
  const d = new Date(value)
  return (
    !Number.isNaN(d.getTime()) &&
    d.getUTCFullYear() === Number(m[1]) &&
    d.getUTCMonth() + 1 === Number(m[2]) &&
    d.getUTCDate() === Number(m[3])
  )
}

function gitDate(file: string): string | null {
  const rel = relative(root, file).split(sep).join('/')
  const candidates = [
    rel,
    rel.replace('/Java/', '/java/'),
    rel.replace('/Godot/', '/godot/'),
    rel.replace('/Misc/', '/misc/'),
  ]
  for (const path of candidates) {
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%ad', '--date=short', '--', path], {
        encoding: 'utf8',
      }).trim()
      if (isValidDate(out)) return out
    } catch {
      /* git 不可用或路径不存在，继续尝试下一个 */
    }
  }
  return null
}

function mtimeDate(file: string): string {
  const d = statSync(file).mtime
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function inferDate(file: string, fm: Frontmatter): { date: string; source: string } {
  if (typeof fm.date === 'string' && isValidDate(fm.date)) {
    return { date: fm.date, source: 'frontmatter' }
  }
  const base = file.split(sep).pop()!.replace(/\.md$/, '')
  if (isValidDate(base)) return { date: base, source: 'filename' }
  const fromGit = gitDate(file)
  if (fromGit) return { date: fromGit, source: 'git' }
  return { date: mtimeDate(file), source: 'mtime' }
}

function formatScalar(value: string): string {
  const s = String(value)
  if (s === '') return '""'
  if (s === s.trim() && !/[:#[\]{},"'\n|>&*!%@`]/.test(s)) return s
  return JSON.stringify(s)
}

function formatValue(value: FrontmatterValue): string {
  return Array.isArray(value) ? '[' + value.map(formatScalar).join(', ') + ']' : formatScalar(value)
}

function buildFrontmatter(fm: Frontmatter, date: string, body: string): string {
  const lines: string[] = []
  const tags = Array.isArray(fm.tags) ? fm.tags : []

  if (fm.title !== undefined) lines.push('title: ' + formatValue(fm.title))
  lines.push('date: ' + date)
  if (tags.length) lines.push('tags: ' + formatValue(tags))

  const handled = new Set(['title', 'date', 'tag', 'tags'])
  for (const key of Object.keys(fm)) {
    if (handled.has(key)) continue
    lines.push(`${key}: ${formatValue(fm[key])}`)
  }

  const eol = detectEol(body || '\n')
  return '---' + eol + lines.join(eol) + eol + '---' + eol + body
}

function backup(file: string): void {
  const rel = relative(root, file)
  const dest = join(backupDir, rel)
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(file, dest)
}

type Change = {
  file: string
  rel: string
  before: string
  after: string
  dateSource: string
  tagless: boolean
}

const changes: Change[] = []
const skippedRoot: string[] = []
const skippedEmpty: string[] = []

for (const file of walkMdFiles(notesDir)) {
  const rel = relative(root, file).split(sep).join('/')
  const raw = readFileSync(file, 'utf-8')

  if (raw.trim() === '') {
    skippedEmpty.push(rel)
    continue
  }
  if (!categoryFromFilePath(file)) {
    skippedRoot.push(rel)
    continue
  }

  const match = raw.match(fmBlockRe)
  const body = match ? raw.slice(match[0].length) : raw
  const fm = parseFrontmatterWithContent(raw).frontmatter
  const { date, source } = inferDate(file, fm)
  const after = buildFrontmatter(fm, date, body)

  if (after !== raw) {
    changes.push({
      file,
      rel,
      before: raw,
      after,
      dateSource: source,
      tagless: !Array.isArray(fm.tags) || fm.tags.length === 0,
    })
  }
}

if (changes.length === 0) {
  console.log('没有需要修改的笔记。')
} else {
  console.log(
    `待修改 ${changes.length} 个文件${apply ? '' : '（预览模式，加 --write 才会写入）'}：\n`,
  )
  for (const change of changes) {
    console.log(`~ ${change.rel}  [date: ${change.dateSource}${change.tagless ? ', 无 tags' : ''}]`)
    if (!apply) {
      const afterFm = change.after.match(fmBlockRe)?.[0] ?? ''
      process.stdout.write(afterFm.replace(/\r?\n/g, '\n'))
      console.log('')
    }
  }

  if (apply) {
    if (useBackup) {
      for (const change of changes) backup(change.file)
      console.log(`备份已写入：${relative(root, backupDir)}/`)
    }
    for (const change of changes) writeFileSync(change.file, change.after, 'utf-8')
    console.log(`已写入 ${changes.length} 个文件。`)
  }
}

if (skippedRoot.length) {
  console.log(`\n跳过根目录文件（不作为博客笔记）：\n- ${skippedRoot.join('\n- ')}`)
}
if (skippedEmpty.length) {
  console.log(`\n跳过空文件：\n- ${skippedEmpty.join('\n- ')}`)
}
