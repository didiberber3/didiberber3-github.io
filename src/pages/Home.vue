<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import ArticleCard from '../components/ArticleCard.vue'
import { buildTagIndex } from '../utils/tags'
import { buildArchiveYears } from '../utils/archive'
import {
  filterLabels as buildFilterLabels,
  filterNotes,
  hasFilters,
  homeQueryFor,
  parseHomeFilters,
  toggleFilter,
} from '../utils/homeFilter'
import { usePageTitle } from '../utils/usePageTitle'

usePageTitle('学习笔记')

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])
const articleSelected = ref<string | null>(null)

const tagIndex = computed(() => buildTagIndex(allNotes.value))
const archiveYears = computed(() => buildArchiveYears(allNotes.value))
const filters = computed(() => parseHomeFilters(route.query))
const filtersActive = computed(() => hasFilters(filters.value))
const visibleNotes = computed(() =>
  filtersActive.value ? filterNotes(allNotes.value, filters.value) : allNotes.value.slice(0, 6),
)

const announcement = computed(() =>
  filtersActive.value
    ? `已筛选 ${buildFilterLabels(filters.value).join('、')}，共 ${visibleNotes.value.length} 篇`
    : '',
)

function countFor(cat: string): number {
  return allNotes.value.filter((n) => n.category === cat).length
}

function updateFilters(next: typeof filters.value) {
  articleSelected.value = null
  router.replace({ path: '/', query: homeQueryFor(next) })
}

/** 分类 / 标签：切换该维度，可与其它维度叠加 */
function applyFilter(type: 'category' | 'tag', value: string) {
  void updateFilters(toggleFilter(filters.value, type, value))
}

/** 年：点当前年取消；点其它年切到该年 */
function toggleArchiveYear(year: string) {
  const archive = filters.value.archive === year ? '' : year
  void updateFilters({ ...filters.value, archive })
}

function clearFilters() {
  articleSelected.value = null
  router.replace({ path: '/', query: {} })
}

function isCategoryActive(name: string): boolean {
  return filters.value.category.toLowerCase() === name.toLowerCase()
}
function isTagActive(name: string): boolean {
  return filters.value.tag.toLowerCase() === name.toLowerCase()
}
function isArchiveYearActive(year: string): boolean {
  return filters.value.archive === year
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && filtersActive.value) {
    event.preventDefault()
    clearFilters()
  }
}

onMounted(() => {
  allNotes.value = getNoteList()
  categories.value = getCategories()
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="page-shell home-shell">
    <div class="page-content home-content">
      <div class="animate-reveal home-reveal">
        <h1 class="visually-hidden">小窝 · 学习笔记</h1>

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
              @click="applyFilter('category', cat)"
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
              @click="applyFilter('tag', tag.name)"
            >
              <span>{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }}</span>
            </button>
          </div>
        </section>

        <!-- 归档：只按年份筛选 -->
        <section v-if="archiveYears.length" class="home-archive" aria-label="归档">
          <div class="archive-years">
            <button
              v-for="year in archiveYears"
              :key="year"
              type="button"
              class="archive-year"
              :class="{ active: isArchiveYearActive(year) }"
              :aria-pressed="isArchiveYearActive(year)"
              @click="toggleArchiveYear(year)"
            >
              {{ year }}
            </button>
          </div>
        </section>

        <section class="note-section" aria-label="笔记列表">
          <p class="visually-hidden" role="status" aria-live="polite">{{ announcement }}</p>

          <div v-if="visibleNotes.length" class="article-list" @mouseleave="articleSelected = null">
            <ArticleCard
              v-for="note in visibleNotes"
              :key="note.slug"
              :note="note"
              :active="articleSelected === note.slug"
              @select="(slug) => (articleSelected = slug)"
            />
          </div>
          <p v-else class="meta empty-state">
            {{ filtersActive ? '没有匹配的笔记' : '暂无笔记' }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 首页固定一屏：筛选区在文档流，列表内部滚动 ── */
.home-shell {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.home-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-block: clamp(1rem, 3vw, 1.5rem) var(--space-3);
}

.home-reveal {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* ── 索引通用 active 状态 ── */
.cat-link.active,
.tag-link.active,
.archive-year.active {
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

/* ── 归档：两级索引，年 → 月 ── */
.home-archive {
  margin-top: var(--space-6);
}

.archive-years {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-4);
  font-family: var(--font-mono);
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

/* ── 笔记列表：首页固定一屏，只有列表内部滚动 ── */
.note-section {
  flex: 1;
  min-height: 0;
  margin-top: var(--space-8);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  /* 列表内部滚动条也始终占位，筛选前后内容宽度不变 */
  scrollbar-gutter: stable;
}

.empty-state {
  padding-block: var(--space-7);
  text-align: center;
}

/* ── < 768px ── */
@media (max-width: 767px) {
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

/* ── < 480px：字号再降一档 ── */
@media (max-width: 479px) {
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

/* ── 触屏：扩大标签 / 年份的点按高度 ── */
@media (hover: none), (max-width: 767px) {
  .tag-link,
  .archive-year {
    padding-block: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cat-link,
  .cat-count,
  .tag-link,
  .tag-count,
  .archive-year {
    transition: none;
  }
}
</style>
