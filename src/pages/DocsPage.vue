<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories, loadNote } from '../utils/content'
import type { NoteMeta, Note } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import ArticleContent from '../components/ArticleContent.vue'
import { useGlobalLoading } from '../utils/useGlobalLoading'

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])
const currentNote = ref<Note | undefined>()
const loading = ref(true)
const { startPage, stopPage } = useGlobalLoading()

const category = computed(() => route.params.category as string | undefined)
const slug = computed(() => route.params.slug as string | undefined)

const categoryNotes = computed(() =>
  category.value ? allNotes.value.filter((n) => n.category === category.value) : []
)

async function selectNote(noteSlug: string) {
  if (!category.value) return
  startPage()
  loading.value = true
  currentNote.value = undefined

  const note = await loadNote(noteSlug)
  currentNote.value = note
  loading.value = false
  stopPage()

  if (noteSlug !== slug.value) {
    router.replace({ params: { category: category.value, slug: noteSlug } })
  }
}

function selectCategory(cat: string) {
  router.push({ params: { category: cat } })
}

function goHome() {
  router.push({ name: 'docs' })
}

onMounted(() => {
  allNotes.value = getNoteList()
  categories.value = getCategories()

  if (category.value && slug.value) {
    selectNote(slug.value)
  } else {
    loading.value = false
  }
})

watch([category, slug], ([newCat, newSlug], [oldCat, oldSlug]) => {
  if (newCat === oldCat && newSlug === oldSlug) return
  if (!newCat) {
    currentNote.value = undefined
    loading.value = false
    return
  }
  if (newSlug) {
    selectNote(newSlug)
  } else {
    currentNote.value = undefined
    loading.value = false
  }
})

/* ── category icons ── */
const CATEGORY_ICONS: Record<string, string> = {
  java: '<svg viewBox="0 0 24 24" fill="none"><path d="M8.5 3.5L12 2l3.5 1.5L12 5 8.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 3.5v3L12 8l3.5-1.5v-3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 8v3" stroke="currentColor" stroke-width="1.5"/><path d="M6 12l-2 1v4l2 1 2-1v-4l-2-1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M18 12l2 1v4l-2 1-2-1v-4l2-1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  python: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c-4 0-5 1-5 3v2h5v1H7c-2 0-4 1-4 4v2c0 2 1 3 3 3h2v-3c0-2 2-3 4-3h4c2 0 3-1 3-3V8c0-2-1-3-3-3h-4z" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="7" r=".8" fill="currentColor"/><path d="M12 21c4 0 5-1 5-3v-2h-5v-1h5c2 0 4-1 4-4V9c0-2-1-3-3-3h-2v3c0 2-2 3-4 3H8c-2 0-3 1-3 3v2c0 2 1 3 3 3h4z" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="17" r=".8" fill="currentColor"/></svg>',
  javascript: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3h18v18H3V3z" stroke="currentColor" stroke-width="1.5"/><path d="M15 10c0-1-1-2-2-2h-1c-1 0-2 1-2 2v1c0 1 1 2 2 2h1c1 0 2 1 2 2v1c0 1-1 2-2 2h-1c-1 0-2-1-2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 12h3" stroke="currentColor" stroke-width="1.5"/></svg>',
  typescript: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M9 12h6M12 9v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 9h6v3h-3v3h3" stroke="currentColor" stroke-width="1.5"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M12 9v6M7 16l3-2M14 14l3-2" stroke="currentColor" stroke-width="1.5"/></svg>',
  algorithm: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="19" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="19" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v2M7 17l2-3M17 17l-2-3" stroke="currentColor" stroke-width="1.5"/></svg>',
  database: '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" stroke-width="1.5"/><path d="M5 6v5c0 2 3 3 7 3s7-1 7-3V6" stroke="currentColor" stroke-width="1.5"/><path d="M5 11v5c0 2 3 3 7 3s7-1 7-3v-5" stroke="currentColor" stroke-width="1.5"/></svg>',
  react: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" stroke-width="1.2" transform="rotate(0 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" stroke-width="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" stroke-width="1.2" transform="rotate(-60 12 12)"/></svg>',
  vue: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 21h6l4-7 4 7h6L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
}

function iconFor(cat: string): string {
  const key = cat.toLowerCase()
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.algorithm
}
</script>

<template>
  <!-- Category home grid -->
  <div v-if="!category" class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="categories.length > 0" class="docs-home">
          <header class="docs-home-header">
            <div class="docs-home-deco" aria-hidden="true">
              <svg viewBox="0 0 200 12" fill="none">
                <line x1="0" y1="6" x2="200" y2="6" stroke="var(--border-primary)" stroke-width="1" stroke-dasharray="4 4" opacity="0.3" />
                <circle cx="40" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
                <circle cx="100" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
                <circle cx="160" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
              </svg>
            </div>
            <h1 class="docs-home-title">全部文档</h1>
            <p class="docs-home-subtitle">选择分类开始阅读</p>
          </header>

          <div class="docs-category-grid">
            <button
              v-for="(cat, i) in categories"
              :key="cat"
              :class="['docs-category-card', 'interact-slide-bg']"
              :style="{ '--i': i }"
              @click="selectCategory(cat)"
            >
              <span class="cat-icon" v-html="iconFor(cat)"></span>
              <span class="cat-name">{{ cat }}</span>
              <span class="cat-count">{{ allNotes.filter(n => n.category === cat).length }} 篇</span>
            </button>
          </div>
        </div>

        <div v-else class="docs-home">
          <p class="txt-muted">暂无分类</p>
        </div>
      </div>
    </main>
  </div>

  <!-- Category article list -->
  <div v-else-if="!slug" class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="max-w-4xl mx-auto px-4">
          <header class="category-header">
            <button class="category-back" @click="goHome" aria-label="返回全部分类">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div>
              <span class="cat-icon cat-icon-lg" v-html="iconFor(category)"></span>
              <h1 class="text-2xl font-bold txt-primary">{{ category }}</h1>
              <p class="text-xs txt-muted mt-1">{{ categoryNotes.length }} 篇文档</p>
            </div>
          </header>

          <div v-if="categoryNotes.length === 0" class="text-sm py-16 text-center txt-muted">
            该分类暂无文章
          </div>

          <div v-else class="article-list">
            <div
              v-for="(n, i) in categoryNotes"
              :key="n.slug"
              :class="['article-card-wrapper', { 'in': true }]"
              :style="{ '--i': i }"
            >
              <router-link
                :to="`/docs/${category}/${n.slug}`"
                class="article-card interact-slide-bg"
              >
                <div class="article-card-main">
                  <h2 class="article-title">{{ n.title }}</h2>
                </div>
                <div class="article-card-meta">
                  <span v-if="n.date" class="article-date">{{ n.date }}</span>
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
    </main>
  </div>

  <!-- Article reading -->
  <div v-else class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="loading" class="py-16 text-center txt-muted">
          <LoadingDots text="加载中" />
        </div>

        <ArticleContent
          v-else-if="currentNote"
          :note="currentNote"
          :nav-items="categoryNotes"
          :nav-link-to="s => `/docs/${category}/${s}`"
          :current-slug="slug"
          :category="category"
        />

        <div v-else class="py-16 text-center txt-muted">
          文档不存在
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ═══════════ DOCS HOME (category grid) ═══════════ */
.docs-home {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1rem 6rem;
}

.docs-home-header {
  text-align: center;
  margin-bottom: 3rem;
}

.docs-home-deco {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.docs-home-deco svg {
  width: 200px;
  height: 12px;
}
.docs-home-deco circle {
  animation: dotPulse 2.4s ease-in-out infinite;
}
.docs-home-deco circle:nth-child(2) { animation-delay: 0.3s; }
.docs-home-deco circle:nth-child(3) { animation-delay: 0.6s; }
@keyframes dotPulse {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.9; }
}

.docs-home-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.docs-home-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* ── category cards ── */
.docs-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1px;
  background: var(--border-primary);
  box-shadow: var(--shadow-glass);
}

.docs-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1.25rem;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s, backdrop-filter 0.2s;
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.06s);
}
.docs-category-card:hover {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cat-icon {
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--accent);
}
.cat-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.cat-icon-lg {
  width: 2rem;
  height: 2rem;
}

.cat-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.cat-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ═══════════ CATEGORY HEADER (article list) ═══════════ */
.category-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.category-back {
  flex-shrink: 0;
  margin-top: 0.15rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border-primary);
  cursor: pointer;
  color: var(--text-secondary);
  font-family: inherit;
  transition: background 0.2s, color 0.2s;
}
.category-back:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* ═══════════ ARTICLE LIST ═══════════ */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-primary);
  box-shadow: var(--shadow-glass);
}

.article-card-wrapper {
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.05s);
}

.article-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1rem;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-decoration: none;
  transition: background 0.2s, backdrop-filter 0.2s;
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

.article-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-card-meta {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.article-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.article-reading {
  font-size: 0.6875rem;
  color: var(--text-muted);
  opacity: 0.7;
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
</style>
