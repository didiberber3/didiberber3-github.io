<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories, loadNote } from '../utils/content'
import type { NoteMeta, Note } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import TOCSidebar from '../components/TOCSidebar.vue'
import LoadingDots from '../components/LoadingDots.vue'
import ScrollProgress from '../components/ScrollProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import { highlightBlocks } from '../utils/highlight'
import { addCopyButtons, setupLightbox } from '../utils/reader'

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])
const currentNote = ref<Note | undefined>()
const loading = ref(true)
const contentRef = ref<HTMLElement | null>(null)
let cleanupLightbox: (() => void) | null = null

const category = computed(() => route.params.category as string | undefined)
const slug = computed(() => route.params.slug as string | undefined)

const categoryNotes = computed(() =>
  category.value ? allNotes.value.filter((n) => n.category === category.value) : []
)

async function selectNote(noteSlug: string) {
  if (!category.value) return
  loading.value = true
  currentNote.value = undefined

  const note = await loadNote(noteSlug)
  currentNote.value = note
  loading.value = false
  nextTick(() => {
    highlightBlocks()
    if (contentRef.value) {
      addCopyButtons(contentRef.value)
      cleanupLightbox?.()
      cleanupLightbox = setupLightbox(contentRef.value)
    }
  })

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

onUnmounted(() => cleanupLightbox?.())

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
  <ScrollProgress />
  <div class="animate-fade-up">
    <TabNav />

    <!-- Category grid -->
    <div v-if="!category && categories.length > 0" class="docs-home">
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

    <!-- Category empty -->
    <div v-else-if="category && categoryNotes.length === 0" class="docs-home">
      <p class="txt-muted">该分类暂无内容</p>
      <button class="docs-back-btn" @click="goHome">← 返回分类</button>
    </div>

    <!-- Note reading mode -->
    <div v-else-if="category" class="docs-layout">
      <!-- Global Nav — left -->
      <aside class="docs-sidebar-left">
        <nav class="docs-nav">
          <h3 class="label-uppercase" style="margin: 0 0 0.75rem 0; padding: 0 0.5rem;">{{ category }}</h3>
          <ul class="docs-nav-list">
            <li v-for="note in categoryNotes" :key="note.slug">
              <a
                href="#"
                :class="['docs-nav-item', 'interact-slide-bg', currentNote?.slug === note.slug ? 'list-item-active' : '']"
                @click.prevent="selectNote(note.slug)"
              >
                <span class="docs-nav-title">{{ note.title }}</span>
                <span v-if="note.date" class="docs-nav-date">{{ note.date }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Content — center -->
      <main class="docs-content">
        <div v-if="loading" class="py-16 text-center" style="color: var(--text-muted);">
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
      </main>

      <!-- Heading TOC — right -->
      <div class="docs-sidebar-right">
        <TOCSidebar v-if="currentNote" :items="currentNote.toc" />
      </div>
    </div>
  </div>
  <BackToTop />
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

/* Three-column layout */
.docs-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 0;
  min-height: calc(100vh - 4rem);
}

/* Left sidebar (global nav) */
.docs-sidebar-left {
  display: none;
  width: 13rem;
  flex-shrink: 0;
  border-right: 1px solid var(--border-primary);
}

@media (min-width: 1024px) {
  .docs-sidebar-left {
    display: block;
  }
}

.docs-nav {
  position: sticky;
  top: 5rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  padding: 1.5rem 0.5rem 1.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border-secondary) transparent;
}

.docs-nav::-webkit-scrollbar {
  width: 4px;
}
.docs-nav::-webkit-scrollbar-thumb {
  background-color: var(--border-secondary);
}
.docs-nav::-webkit-scrollbar-track {
  background: transparent;
}

.docs-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-nav-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.45rem 0.5rem;
  text-decoration: none;
  cursor: pointer;
  color: var(--text-primary);
}

.docs-nav-title {
  font-size: 0.8125rem;
  color: inherit;
  line-height: 1.4;
}

.docs-nav-item.list-item-active .docs-nav-title {
  font-weight: 500;
}

.docs-nav-date {
  font-size: 0.6875rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Content (center) */
.docs-content {
  flex: 1;
  min-width: 0;
  max-width: 780px;
  padding: 1.5rem 1.5rem 4rem 1.5rem;
}

@media (min-width: 1024px) {
  .docs-content {
    padding: 1.5rem 2.5rem 4rem 2.5rem;
  }
}

/* Right sidebar (heading TOC) */
.docs-sidebar-right {
  display: none;
  width: 13rem;
  flex-shrink: 0;
}

@media (min-width: 1280px) {
  .docs-sidebar-right {
    display: block;
  }
}
</style>
