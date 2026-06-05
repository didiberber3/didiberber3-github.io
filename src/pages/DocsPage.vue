<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories, loadNote } from '../utils/content'
import type { NoteMeta, Note } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { useGlobalLoading } from '../utils/useGlobalLoading'

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])
const currentNote = ref<Note | undefined>()
const loading = ref(true)
const { contentRef, renderContent } = useContentRenderer()
const { startPage, stopPage } = useGlobalLoading()

const category = computed(() => route.params.category as string | undefined)
const slug = computed(() => route.params.slug as string | undefined)

const categoryNotes = computed(() =>
  category.value ? allNotes.value.filter((n) => n.category === category.value) : []
)

const activeTab = ref<'nav' | 'toc'>('nav')

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

async function selectNote(noteSlug: string) {
  if (!category.value) return
  startPage()
  loading.value = true
  currentNote.value = undefined

  const note = await loadNote(noteSlug)
  currentNote.value = note
  loading.value = false
  stopPage()
  renderContent()

  // Sync slug to URL
  if (noteSlug !== slug.value) {
    router.replace({ params: { category: category.value, slug: noteSlug } })
  }
}

function selectCategory(cat: string) {
  router.push({ params: { category: cat } })
}

function goHome() {
  router.push({ params: {}, query: {} })
}

// Load data on mount
onMounted(() => {
  allNotes.value = getNoteList()
  categories.value = getCategories()

  if (category.value && slug.value) {
    selectNote(slug.value)
  } else {
    loading.value = false
  }
})

// React to route changes
watch([category, slug], ([newCat, newSlug], [oldCat, oldSlug]) => {
  // Skip initial fire — handled by onMounted
  if (newCat === oldCat && newSlug === oldSlug) return

  if (!newCat) {
    // Back to category grid
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
</script>

<template>
  <!-- Card list: category selected, no slug -->
  <div v-if="category && !slug" class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-2xl font-bold mb-6 txt-primary">{{ category }}</h1>

          <div v-if="categoryNotes.length === 0" class="text-sm py-8 text-center txt-muted">
            该分类暂无文章
          </div>

          <div v-else class="article-list">
            <article v-for="n in categoryNotes" :key="n.slug" class="article-card">
              <router-link :to="`/docs/${category}/${n.slug}`" class="interact-slide flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <h2 class="article-title text-base font-medium truncate">{{ n.title }}</h2>
                </div>
                <div class="flex-shrink-0 text-right card-meta">
                  <p v-if="n.date" class="text-xs txt-secondary whitespace-nowrap card-meta-date">{{ n.date }}</p>
                </div>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Article reading mode: category + slug -->
  <div v-else-if="category && slug" class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="loading" class="py-16 text-center txt-muted">
          <LoadingDots text="加载中" />
        </div>

        <article v-else-if="currentNote" class="article-with-aside">
          <div class="article-main">
            <div class="article-body">
              <header class="mb-10">
                <h1 class="text-2xl font-bold mb-2 txt-primary">{{ currentNote.title }}</h1>
                <p class="text-xs txt-secondary">{{ currentNote.date }} · {{ currentNote.readingTime }} 分钟 · 约 {{ currentNote.charCount }} 字</p>
              </header>
              <div
                ref="contentRef"
                class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
                v-html="currentNote.html"
              ></div>
            </div>

            <aside class="article-aside">
              <div class="aside-tabs">
                <button :class="['aside-tab', { active: activeTab === 'nav' }]" @click="activeTab = 'nav'">文章导航</button>
                <button :class="['aside-tab', { active: activeTab === 'toc' }]" @click="activeTab = 'toc'">文章目录</button>
              </div>

              <nav v-show="activeTab === 'nav'" class="aside-body aside-nav-list">
                <div v-if="category" class="label-uppercase px-3 pt-2 pb-1">{{ category }}</div>
                <router-link
                  v-for="n in categoryNotes"
                  :key="n.slug"
                  :to="`/docs/${category}/${n.slug}`"
                  :class="['aside-nav-item', { active: n.slug === slug }]"
                >
                  <span class="aside-nav-title">{{ n.title }}</span>
                  <span class="aside-nav-date">{{ n.date }}</span>
                </router-link>
              </nav>

              <nav v-show="activeTab === 'toc'" class="aside-body aside-toc-list">
                <a v-for="item in currentNote?.toc || []" :key="item.id" href="#" @click.prevent="scrollToHeading(item.id)"
                  :class="['aside-toc-item']" :style="{ paddingLeft: (item.level - 2) * 14 + 12 + 'px' }">{{ item.text }}</a>
                <div v-if="!currentNote?.toc?.length" class="aside-empty txt-muted">暂无目录</div>
              </nav>
            </aside>
          </div>
        </article>

        <div v-else class="py-16 text-center txt-muted">
          文档不存在
        </div>
      </div>
    </main>
  </div>

  <!-- Category grid: no category selected -->
  <div v-else class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="categories.length > 0" class="docs-home">
          <h1 class="docs-home-title">全部文档</h1>
          <p class="docs-home-subtitle">选择分类开始阅读</p>
          <div class="docs-category-grid">
            <button
              v-for="cat in categories"
              :key="cat"
              class="docs-category-card interact-line-top"
              @click="selectCategory(cat)"
            >
              <span class="docs-category-name">{{ cat }}</span>
              <span class="docs-category-count">{{ allNotes.filter(n => n.category === cat).length }} 篇</span>
            </button>
          </div>
        </div>

        <div v-else class="docs-home">
          <p class="txt-muted">暂无分类</p>
          <button class="docs-back-btn" @click="goHome">← 返回</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Category home grid ── */
.docs-home {
  max-width: 640px;
  margin: 0 auto;
  padding: 4rem 1rem;
  text-align: center;
}

.docs-home-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.docs-home-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
}

.docs-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.docs-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 1.5rem 1rem;
  border: 1px solid var(--border-primary);
  background: none;
  cursor: pointer;
  font-family: inherit;
}

.docs-category-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.docs-category-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.docs-back-btn {
  margin-top: 1rem;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.8125rem;
  color: var(--accent);
  cursor: pointer;
  padding: 0.25rem 0;
}

.docs-back-btn:hover {
  text-decoration: underline;
}

/* ── Article layout (matches ArticleView) ── */
.article-with-aside {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.article-main {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.article-body {
  flex: 1;
  min-width: 0;
  max-width: 720px;
}

/* ── Aside sidebar ── */
.article-aside {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 5rem;
  align-self: flex-start;
  max-height: calc(100vh - 7rem);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
}

/* Tab bar */
.aside-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.aside-tab {
  flex: 1;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  cursor: pointer;
  border: none;
  background: none;
  color: var(--text-secondary);
  transition: color 0.15s, background 0.15s;
  position: relative;
}

.aside-tab:hover {
  background: var(--bg-secondary);
}

.aside-tab.active {
  color: var(--text-primary);
  font-weight: 500;
}

.aside-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  right: 0.5rem;
  height: 2px;
  background: var(--accent);
}

/* Scrollable body */
.aside-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0;
}

/* ── Nav list ── */
.aside-nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  font-size: 0.8125rem;
  color: var(--text-primary);
  border-left: 2px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.aside-nav-item:hover {
  background: var(--bg-secondary);
  border-left-color: var(--accent);
  color: var(--accent);
}

.aside-nav-item.active {
  border-left-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

.aside-nav-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  margin-right: 0.5rem;
}

.aside-nav-date {
  flex-shrink: 0;
  font-size: 0.6875rem;
  color: var(--text-muted);
}

/* ── TOC list ── */
.aside-toc-item {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  border-left: 2px solid transparent;
  line-height: 1.4;
}

.aside-toc-item:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-left-color: var(--accent);
}

.aside-empty {
  padding: 1.5rem 0.75rem;
  font-size: 0.8125rem;
  text-align: center;
  color: var(--text-muted);
}

/* ── Responsive ── */
@media (max-width: 896px) {
  .article-main {
    flex-direction: column;
  }
  .article-aside {
    display: none;
  }
}
</style>
