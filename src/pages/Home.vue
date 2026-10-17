<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import ArticleCard from '../components/ArticleCard.vue'
import { buildTagIndex } from '../utils/tags'
import { buildArchiveIndex } from '../utils/archive'
import { filterNotes, homeQueryFor, parseHomeFilter, type HomeFilter } from '../utils/homeFilter'
import { usePageTitle } from '../utils/usePageTitle'

usePageTitle('学习笔记')

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])
const articleSelected = ref<string | null>(null)

const tagIndex = computed(() => buildTagIndex(allNotes.value))
const archiveGroups = computed(() => buildArchiveIndex(allNotes.value))
const activeFilter = computed(() => parseHomeFilter(route.query))
const visibleNotes = computed(() =>
  activeFilter.value ? filterNotes(allNotes.value, activeFilter.value) : allNotes.value.slice(0, 6),
)

function countFor(cat: string): number {
  return allNotes.value.filter((n) => n.category === cat).length
}

function sameFilter(filter: HomeFilter): boolean {
  const current = activeFilter.value
  if (!current || !filter) return false
  return current.type === filter.type && current.value.toLowerCase() === filter.value.toLowerCase()
}

/** 点击索引：在首页原地筛选；再次点击同一项则清除 */
function applyFilter(filter: HomeFilter) {
  articleSelected.value = null
  if (sameFilter(filter)) {
    clearFilter()
    return
  }
  router.push({ path: '/', query: homeQueryFor(filter) })
}

function clearFilter() {
  articleSelected.value = null
  router.push({ path: '/', query: {} })
}

function isCategoryActive(name: string): boolean {
  const filter = activeFilter.value
  return filter?.type === 'category' && filter.value.toLowerCase() === name.toLowerCase()
}
function isTagActive(name: string): boolean {
  const filter = activeFilter.value
  return filter?.type === 'tag' && filter.value.toLowerCase() === name.toLowerCase()
}
function isArchiveActive(value: string): boolean {
  const filter = activeFilter.value
  return filter?.type === 'archive' && filter.value === value
}

onMounted(() => {
  allNotes.value = getNoteList()
  categories.value = getCategories()
})
</script>

<template>
  <div class="page-shell">
    <div class="page-content">
      <div class="animate-reveal">
        <header class="masthead">
          <h1 class="masthead-title">小窝</h1>
          <p class="masthead-desc">记录 Java、Godot 与开发工具的学习笔记。</p>
        </header>

        <!-- 分类：点击后在首页原地筛选 -->
        <section v-if="categories.length" class="home-cats" aria-label="分类">
          <div class="cat-inline">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="cat-link"
              :class="{ active: isCategoryActive(cat) }"
              :aria-pressed="isCategoryActive(cat)"
              @click="applyFilter({ type: 'category', value: cat })"
            >
              <span class="cat-name">{{ cat }}</span>
              <span class="cat-count mono">{{ countFor(cat) }}</span>
            </button>
          </div>
        </section>

        <!-- 标签：点击后在首页原地筛选 -->
        <section v-if="tagIndex.length" class="home-tags" aria-label="标签">
          <div class="tag-row">
            <button
              v-for="tag in tagIndex"
              :key="tag.name"
              type="button"
              class="tag-link"
              :class="{ active: isTagActive(tag.name) }"
              :aria-pressed="isTagActive(tag.name)"
              @click="applyFilter({ type: 'tag', value: tag.name })"
            >
              <span>{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }}</span>
            </button>
          </div>
        </section>

        <!-- 归档：年 / 月点击后在首页原地筛选 -->
        <section v-if="archiveGroups.length" class="home-archive" aria-label="归档">
          <div class="archive-rows">
            <div v-for="yg in archiveGroups" :key="yg.year" class="archive-row">
              <button
                type="button"
                class="archive-year"
                :class="{ active: isArchiveActive(yg.year) }"
                :aria-pressed="isArchiveActive(yg.year)"
                @click="applyFilter({ type: 'archive', value: yg.year })"
              >
                {{ yg.year }}
              </button>
              <div v-if="yg.months.some((m) => m.month)" class="archive-months">
                <button
                  v-for="mg in yg.months.filter((m) => m.month)"
                  :key="mg.month"
                  type="button"
                  class="archive-month"
                  :class="{ active: isArchiveActive(`${yg.year}-${mg.month}`) }"
                  :aria-pressed="isArchiveActive(`${yg.year}-${mg.month}`)"
                  :aria-label="`${yg.year} 年 ${Number(mg.month)} 月`"
                  @click="applyFilter({ type: 'archive', value: `${yg.year}-${mg.month}` })"
                >
                  {{ mg.month }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="note-section" aria-label="笔记列表">
          <div v-if="activeFilter" class="filter-bar">
            <button type="button" class="filter-clear" @click="clearFilter">清除筛选</button>
          </div>

          <div v-if="visibleNotes.length" class="article-list" @mouseleave="articleSelected = null">
            <ArticleCard
              v-for="(note, i) in visibleNotes"
              :key="note.slug"
              :note="note"
              :index="i"
              :active="articleSelected === note.slug"
              @select="(slug) => (articleSelected = slug)"
            />
          </div>
          <p v-else class="meta empty-state">
            {{ activeFilter ? '没有匹配的笔记' : '暂无笔记' }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 刊头 ── */
.masthead {
  padding-block: var(--space-4) var(--space-5);
}

.masthead-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.masthead-desc {
  margin-top: var(--space-3);
  font-size: var(--text-md);
  line-height: 1.75;
  color: var(--text-secondary);
}

/* ── 索引通用 active 状态 ── */
.cat-link.active,
.tag-link.active,
.archive-year.active,
.archive-month.active {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.cat-link.active .cat-count,
.tag-link.active .tag-count {
  color: var(--accent);
}

/* ── 分类：大字号排版索引（无边框） ── */
.home-cats {
  margin-top: var(--space-7);
}

.cat-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3) var(--space-6);
}

.cat-link {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  line-height: 1.15;
  font-family: inherit;
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  transition: color var(--dur-fast) var(--ease-out);
}
.cat-link:hover {
  color: var(--accent);
}

.cat-name {
  white-space: nowrap;
}

.cat-count {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--text-muted);
  transform: translateY(2px);
  transition: color var(--dur-fast) var(--ease-out);
}
.cat-link:hover .cat-count {
  color: var(--accent);
}

/* ── 标签：紧凑 mono 行 ── */
.home-tags {
  margin-top: var(--space-6);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.tag-link {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}
.tag-link:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.tag-count {
  font-size: var(--text-xs);
  color: var(--text-muted);
  transition: color var(--dur-fast) var(--ease-out);
}
.tag-link:hover .tag-count {
  color: var(--accent);
}

/* ── 归档：年 + 月索引 ── */
.home-archive {
  margin-top: var(--space-6);
}

.archive-rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-mono);
}

.archive-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-4);
}

.archive-year {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}
.archive-year:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.archive-months {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.archive-month {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: var(--text-muted);
  transition: color var(--dur-fast) var(--ease-out);
}
.archive-month:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── 笔记列表 ── */
.note-section {
  margin-top: var(--space-8);
}

.filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-3);
}

.filter-clear {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
  transition: color var(--dur-fast) var(--ease-out);
}
.filter-clear:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.empty-state {
  padding-block: var(--space-7);
  text-align: center;
}

/* ── < 768px ── */
@media (max-width: 767px) {
  .masthead {
    padding-block: var(--space-3) var(--space-4);
  }
  .home-cats {
    margin-top: var(--space-6);
  }
  .cat-inline {
    gap: var(--space-2) var(--space-5);
  }
  .note-section {
    margin-top: var(--space-7);
  }
}

/* ── < 480px：刊头降到 --text-2xl ── */
@media (max-width: 479px) {
  .masthead-title {
    font-size: var(--text-2xl);
  }
  .masthead-desc {
    font-size: var(--text-base);
  }
  .cat-inline {
    gap: var(--space-2) var(--space-4);
  }
  .cat-link {
    font-size: 1.125rem;
  }
  .note-section {
    margin-top: var(--space-6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cat-link,
  .cat-count,
  .tag-link,
  .tag-count,
  .archive-year,
  .archive-month,
  .filter-clear {
    transition: none;
  }
}
</style>
