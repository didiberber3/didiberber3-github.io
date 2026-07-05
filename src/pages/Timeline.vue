<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'

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
        <div class="page-timeline-test">
          <!-- hero -->
          <section class="page-hero">
            <h1 class="page-hero-title">时间轴</h1>
            <p class="page-hero-sub">按时间线浏览全部笔记</p>
            <div class="page-hero-count"><strong>{{ notes.length }}</strong><span>篇</span></div>
          </section>

          <div v-if="yearGroups.length === 0" class="text-sm py-16 text-center text-muted">
            还没有内容
          </div>

          <div v-else class="tl-sections">
            <template v-for="yg in yearGroups" :key="yg.year">
              <!-- year divider -->
              <div class="tl-year-divider">
                <span class="tl-year-label">{{ yg.year }}</span>
                <span class="tl-year-count">{{ yg.count }} 篇</span>
                <div class="tl-year-line"></div>
              </div>

              <div class="tl-month-blocks">
                <div v-for="mg in yg.months" :key="mg.month || '_'" class="tl-month-group">
                  <div v-if="mg.month" class="tl-month-heading">{{ mg.month }}月</div>
                  <div class="article-list" @mouseleave="articleSelected = null">
                    <div
                      v-for="(note, ni) in mg.notes"
                      :key="note.slug"
                      class="article-card-wrapper"
                      :class="{ 'is-active': articleSelected === note.slug }"
                      :style="{ '--i': ni }"
                    >
                      <router-link
                        :to="`/note/${note.slug}`"
                        class="article-card interact-slide-bg"
                        @mouseenter="articleSelected = note.slug"
                      >
                        <div class="article-card-main">
                          <h2 class="article-title">{{ note.title }}</h2>
                        </div>
                        <div class="article-card-meta">
                          <span v-if="note.date" class="article-date">{{ note.date }}</span>
                        </div>
                        <span class="article-arrow" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </span>
                      </router-link>
                    </div>
                  </div>
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
.page-timeline-test {
  max-width: 48rem;
  margin: 0 auto;
  padding: 0.5rem 1rem 6rem;
}

/* ── year divider ── */
.tl-year-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 2.5rem 0 1.25rem;
}
.tl-year-divider:first-of-type {
  margin-top: 0;
}
.tl-year-line {
  flex: 1;
  height: 1px;
  background: var(--accent);
  opacity: 0.15;
}
.tl-year-label {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.tl-year-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ── month heading ── */
.tl-month-blocks {
  border-left: 2px solid var(--border-primary);
  padding-left: 1rem;
}
.tl-month-group {
  margin-bottom: 1px;
}
.tl-month-heading {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.75rem 0 0.375rem 0.5rem;
  letter-spacing: 0.04em;
  position: relative;
}
.tl-month-heading::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 0.9rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  transform: translateX(-50%);
  border: 2px solid var(--bg-primary);
}

/* ── mobile ── */
@media (max-width: 767px) {
  .tl-month-blocks {
    padding-left: 0.75rem;
  }
  .tl-month-heading::before {
    left: -0.75rem;
  }
}
</style>
