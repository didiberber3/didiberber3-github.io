<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'

const notes = ref<NoteMeta[]>([])

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
        <div class="page-timeline">
          <section class="tl-hero">
            <svg class="tl-geo" viewBox="0 0 960 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <radialGradient id="gt1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".14"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></radialGradient>
              </defs>
              <ellipse cx="480" cy="140" rx="160" ry="110" fill="url(#gt1)"/>
              <g class="tl-orbit-cw"><ellipse cx="480" cy="140" rx="90" ry="45" fill="none" stroke="var(--accent)" stroke-width=".8" opacity=".45" stroke-dasharray="6 4"/></g>
              <g class="tl-orbit-ccw"><ellipse cx="480" cy="140" rx="70" ry="55" fill="none" stroke="var(--accent2)" stroke-width=".6" opacity=".35" stroke-dasharray="4 6"/></g>
              <g class="tl-orbit-fast"><circle cx="480" cy="140" r="60" fill="none" stroke="var(--accent3)" stroke-width=".6" opacity=".35" stroke-dasharray="2 8"/></g>
              <circle cx="480" cy="140" r="16" fill="var(--accent)" opacity=".22"/>
              <circle cx="480" cy="140" r="8" fill="var(--accent)" opacity=".45"/>
              <g class="tl-orbit-cw"><circle cx="480" cy="95" r="3.5" fill="var(--accent3)" opacity=".7"/></g>
              <g class="tl-orbit-ccw"><circle cx="550" cy="140" r="3" fill="var(--accent2)" opacity=".6"/></g>
              <g class="tl-orbit-fast"><circle cx="410" cy="140" r="2.5" fill="var(--accent)" opacity=".5"/></g>
              <line x1="60" y1="10" x2="900" y2="10" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
              <line x1="60" y1="270" x2="900" y2="270" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
            </svg>
            <h1 class="tl-hero-title">时间轴</h1>
            <p class="tl-hero-sub">按时间线浏览全部笔记</p>
            <div class="tl-hero-count"><strong>{{ notes.length }}</strong><span>篇</span></div>
          </section>

          <div v-if="yearGroups.length === 0" class="text-sm py-16 text-center text-muted">
            还没有内容
          </div>

          <div v-else class="tl-grid">
            <template v-for="yg in yearGroups" :key="yg.year">
              <div class="tl-year-cell">
                <span class="tl-year-num">{{ yg.year }}</span>
              </div>
              <div class="tl-content-cell">
                <div v-for="mg in yg.months" :key="mg.month || '_'" class="tl-month-group">
                  <div v-if="mg.month" class="tl-month-heading">{{ mg.month }}月</div>
                  <div
                    v-for="(note, ni) in mg.notes"
                    :key="note.slug"
                    class="article-card-wrapper"
                    :style="{ '--i': ni }"
                  >
                    <router-link :to="`/note/${note.slug}`" class="article-card interact-slide-bg">
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
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-timeline {
  max-width: 60rem;
  margin: 0 auto;
  padding: 2rem 1rem 6rem;
  overflow-x: hidden; /* prevent any child from blowing out */
}

/* ── hero ── */
.tl-hero {
  position: relative;
  padding: 5rem 0 3.5rem;
  text-align: center;
}
.tl-geo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  pointer-events: none;
}
@keyframes nocw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes noccw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
.tl-orbit-cw{animation:nocw 28s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.tl-orbit-ccw{animation:noccw 22s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.tl-orbit-fast{animation:nocw 14s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.tl-hero-title{font-size:2.75rem;font-weight:800;letter-spacing:-.04em;color:var(--text-primary);line-height:1.15;margin-bottom:1.25rem;position:relative;z-index:1}
.tl-hero-sub{font-size:.9375rem;color:var(--text-secondary);margin-bottom:1.5rem;position:relative;z-index:1}
.tl-hero-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}
.tl-hero-count strong {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.1;
}
.tl-hero-count span {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* ── two-column grid ── */
.tl-grid {
  display: grid;
  grid-template-columns: 5rem 1fr;
  column-gap: 1.25rem;
}

/* ── year column (left) ── */
.tl-year-cell {
  position: relative;
  padding: 1.5rem 0 0;
  text-align: right;
}
.tl-year-num {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -0.02em;
}
.tl-year-cell::after {
  content: '';
  position: absolute;
  top: 1.7rem;
  right: -0.625rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg-primary);
  z-index: 1;
}

/* ── content column (right) ── */
.tl-content-cell {
  position: relative;
  padding: 0 0 0 1.25rem;
  border-left: 2px solid var(--border-primary);
  min-width: 0; /* allow flex children to shrink below content width */
}

/* ── month heading ── */
.tl-month-group {
  margin-bottom: 1px;
}
.tl-month-heading {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.75rem 0 0.375rem;
  letter-spacing: 0.04em;
  position: relative;
}
.tl-month-heading::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 0.9rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-muted);
  transform: translateX(-50%);
}

/* ── cards ── */
.article-card-wrapper {
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.04s);
}
.article-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-decoration: none;
  border-radius: 2px;
  transition: background 0.2s, backdrop-filter 0.2s;
  margin-bottom: 2px;
}
.article-card:hover {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.article-card-main {
  flex: 1;
  min-width: 0;
}
.article-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-card-meta {
  flex-shrink: 0;
}
.article-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}
.article-arrow {
  flex-shrink: 0;
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}
.article-card:hover .article-arrow {
  opacity: 1;
  transform: translateX(0);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── mobile (≤767px) ── */
@media (max-width: 767px) {
  .tl-grid {
    grid-template-columns: 1fr;
  }

  .tl-year-cell {
    text-align: left;
    padding: 2.5rem 0 0 1.25rem; /* indent to align with content vertical line */
  }

  .tl-year-cell::after {
    right: auto;
    left: -0.625rem; /* dot sits on the timeline line */
  }

  .tl-content-cell {
    padding-left: 1.25rem; /* keep the line indent */
  }
}
</style>
