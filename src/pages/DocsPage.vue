<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories, loadNote } from '../utils/content'
import type { NoteMeta, Note } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import DocNav from '../components/DocNav.vue'
import DocTOC from '../components/DocTOC.vue'
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
  <!-- Docs reading mode: left nav + content + right toc -->
  <div v-if="category" class="docs-page-root">
    <aside class="docs-sidebar">
      <div class="docs-sidebar-label">{{ category }}</div>
      <DocNav
        :notes="categoryNotes"
        :current-slug="currentNote?.slug"
        @select-note="selectNote"
      />
    </aside>

    <div class="docs-body">
      <div class="docs-body-inner">
        <main class="docs-content">
          <div class="animate-reveal">
            <div v-if="loading" class="py-16 text-center txt-muted">
              <LoadingDots text="加载中" />
            </div>

            <article v-else-if="currentNote">
              <header class="mb-10">
                <h1 class="text-2xl font-bold mb-2 txt-primary">{{ currentNote.title }}</h1>
              <p v-if="currentNote.date" class="text-xs txt-secondary">{{ currentNote.date }}</p>
            </header>
              <div
                ref="contentRef"
                class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
                v-html="currentNote.html"
              ></div>
            </article>

            <div v-else class="py-16 text-center txt-muted">
              笔记不存在
            </div>
          </div>
        </main>

        <aside v-if="currentNote?.toc?.length" class="docs-toc">
          <div class="docs-toc-label">本页目录</div>
          <DocTOC :items="currentNote.toc" />
        </aside>
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

/* ── Docs reading mode: left nav + content + right toc ── */
.docs-page-root {
  display: flex;
  align-items: flex-start;
  min-height: calc(100vh - 4rem);
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── Left sidebar: doc nav ── */
.docs-sidebar {
  position: sticky;
  top: calc(48px + 1rem);
  flex-shrink: 0;
  width: 260px;
  max-height: calc(100vh - 48px - 2rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem 1rem 0;
  border-right: 1px solid var(--border-primary);
}

.docs-sidebar-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
}

/* ── Body wrapper: centers content+toc horizontally ── */
.docs-body {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.docs-body-inner {
  display: flex;
  width: 100%;
  max-width: 1160px;
}

/* ── Content area ── */
.docs-content {
  flex: 1;
  min-width: 0;
  max-width: 880px;
  padding: 1.5rem 2rem 4rem 2rem;
}

/* ── Right sidebar: file toc ── */
.docs-toc {
  position: sticky;
  top: calc(48px + 1rem);
  flex-shrink: 0;
  width: 220px;
  max-height: calc(100vh - 48px - 2rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem 0 1rem 1.5rem;
  border-left: 1px solid var(--border-primary);
}

.docs-toc-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  padding: 0 0.75rem;
}

@media (max-width: 1200px) {
  .docs-toc {
    display: none;
  }
}

@media (max-width: 900px) {
  .docs-sidebar {
    display: none;
  }
  .docs-body {
    justify-content: flex-start;
  }
  .docs-content {
    padding: 1rem 1rem 4rem;
  }
}
</style>
