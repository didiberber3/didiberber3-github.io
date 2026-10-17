import type { NoteMeta } from './content'

export interface ArchiveMonthGroup {
  month: string
  notes: NoteMeta[]
}

export interface ArchiveYearGroup {
  year: string
  count: number
  months: ArchiveMonthGroup[]
}

/**
 * 把笔记按「年 → 月」分组，供归档页与首页归档索引共用。
 * 输入需按日期倒序（getNoteList 已保证）。
 */
export function buildArchiveIndex(notes: NoteMeta[]): ArchiveYearGroup[] {
  if (!notes.length) return []

  const result: ArchiveYearGroup[] = []
  let lastYear = ''
  let lastMonth = -1
  let currentYear: ArchiveYearGroup | null = null
  let currentMonth: ArchiveMonthGroup | null = null

  for (const note of notes) {
    if (!note.date) {
      if (!lastYear) {
        currentYear = { year: '其他', count: 0, months: [{ month: '', notes: [] }] }
        result.push(currentYear)
        currentMonth = currentYear.months[0]
      }
      currentMonth?.notes.push(note)
      continue
    }

    const [y, m] = note.date.split('-')
    const monthNum = m ? parseInt(m, 10) : -1

    if (y !== lastYear) {
      const yearNotes = notes.filter((n) => n.date?.startsWith(y))
      currentYear = { year: y, count: yearNotes.length, months: [] }
      result.push(currentYear)
      lastYear = y
      lastMonth = -1
      currentMonth = null
    }

    if (monthNum !== lastMonth) {
      currentMonth = { month: m, notes: [] }
      currentYear!.months.push(currentMonth!)
      lastMonth = monthNum
    }

    currentMonth!.notes.push(note)
  }

  return result
}
