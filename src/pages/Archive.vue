<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import ArticleCard from '../components/ArticleCard.vue'
import PageHead from '../components/PageHead.vue'

const notes = ref<NoteMeta[]>([])
const articleSelected = ref<string | null>(null)

onMounted(() => {
  notes.value = getNoteList()
})

interface MonthGroup {
  month: string
  notes: NoteMeta[]
}

interface YearGroup {
  year: string
  count: number
  months: MonthGroup[]
}

const yearGroups = computed<YearGroup[]>(() => {
  const list = notes.value
  if (!list.length) return []

  const result: YearGroup[] = []
  let lastYear = ''
  let lastMonth = -1
  let currentYear: YearGroup | null = null
  let currentMonth: MonthGroup | null = null

  for (const note of list) {
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
      const yearNotes = list.filter((n) => n.date?.startsWith(y))
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
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="page-archive-test">
          <!-- header -->
          <PageHead title="归档" :count="notes.length + ' 篇'" />

          <div v-if="yearGroups.length === 0" class="text-sm py-16 text-center text-muted">
            还没有内容
          </div>

          <div v-else class="tl-sections">
            <template v-for="yg in yearGroups" :key="yg.year">
              <!-- 年份：纯文本分割 -->
              <div class="tl-year-label">{{ yg.year }} <span class="tl-year-count">{{ yg.count }} 篇</span></div>

              <div class="tl-month-group" v-for="mg in yg.months" :key="mg.month || '_'">
                <!-- 月份：纯文本分割 -->
                <div v-if="mg.month" class="tl-month-heading">{{ mg.month }}月</div>
                <div class="article-list" @mouseleave="articleSelected = null">
                  <ArticleCard
                    v-for="(note, ni) in mg.notes"
                    :key="note.slug"
                    :note="note"
                    :index="ni"
                    :active="articleSelected === note.slug"
                    @select="(slug) => (articleSelected = slug)"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-archive-test {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1rem 1rem 6rem;
}

/* ── 年份：纯文本分割 ── */
.tl-year-label {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin: 2.5rem 0 1rem;
}
.tl-year-label:first-of-type {
  margin-top: 0;
}
.tl-year-count {
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--text-muted);
  margin-left: 0.5rem;
}

/* ── 月份：纯文本分割 ── */
.tl-month-group {
  margin-bottom: 1.5rem;
}
.tl-month-heading {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}
</style>
