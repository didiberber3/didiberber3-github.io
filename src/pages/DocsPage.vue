<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories, loadNote } from '../utils/content'
import type { NoteMeta, Note } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { sidebar } from '../utils/useSidebar'
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

  // Pre-populate sidebar with current category notes + TOC
  syncSidebar(noteSlug)
}

function syncSidebar(noteSlug?: string) {
  sidebar.category = category.value || ''
  sidebar.notes = categoryNotes.value
  sidebar.toc = currentNote.value?.toc || []
  sidebar.currentSlug = noteSlug || currentNote.value?.slug || ''
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

  if (category.value) {
    const notes = allNotes.value.filter((n) => n.category === category.value)
    const targetSlug = slug.value || notes[0]?.slug
    if (targetSlug) {
      selectNote(targetSlug)
    } else {
      loading.value = false
    }
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
    sidebar.category = ''
    sidebar.notes = []
    sidebar.toc = []
    sidebar.currentSlug = ''
    return
  }

  if (newSlug && newSlug !== currentNote.value?.slug) {
    selectNote(newSlug)
  } else if (!newSlug) {
    const notes = allNotes.value.filter((n) => n.category === newCat)
    if (notes[0]) selectNote(notes[0].slug)
  }
})
</script>

<template>
  <!-- Docs reading mode: single column -->
  <div v-if="category" class="docs-reading">
    <div class="animate-reveal">
      <div v-if="loading" class="py-16 text-center txt-muted">
        <LoadingDots text="加载中" />
      </div>

      <article v-else-if="currentNote" class="docs-article prose prose-sm max-w-none prose-headings:font-semibold">
        <header class="mb-10">
          <h1 class="text-2xl font-bold mb-2 txt-primary">{{ currentNote.title }}</h1>
          <p class="text-xs txt-secondary">{{ currentNote.date }} · {{ currentNote.readingTime }} 分钟 · 约 {{ currentNote.charCount }} 字</p>
        </header>
        <div
          ref="contentRef"
          class="docs-article-content"
          v-html="currentNote.html"
        ></div>
      </article>

      <div v-else class="py-16 text-center txt-muted">
        笔记不存在
      </div>
    </div>
  </div>

  <!-- Docs home: category grid (no sidebar) -->
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
/* Category home */
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

/*
 * ▸ 分类卡片 — 悬浮时顶部绿色边线从左至右推进
 *   与 btn-more / article-card 统一交互模式
 *   ::before 作为顶部 2px 绿色条，scaleX(transform-origin: left)
 */
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

/* ── Docs reading mode: single column ── */
.docs-reading {
  max-width: 780px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 4rem;
}
</style>
