<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes, getNoteList } from '../utils/content'
import type { Note, NoteMeta } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { useGlobalLoading } from '../utils/useGlobalLoading'
import { sidebar } from '../utils/useSidebar'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const { contentRef, renderContent } = useContentRenderer()
const { startPage, stopPage } = useGlobalLoading()
const adjacent = ref<{ prev: NoteMeta | null; next: NoteMeta | null }>({ prev: null, next: null })

const sidebarNotes = computed(() => {
  const all = getNoteList()
  if (!note.value) return all
  return all.filter((n) => n.category === note.value!.category)
})
const activeTab = ref<'nav' | 'toc'>('nav')

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

async function load() {
  startPage()
  loading.value = true
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = await loadNote(slug)
  note.value = found
  adjacent.value = getAdjacentNotes(slug)
  loading.value = false
  stopPage()
  renderContent()
  if (found?.toc?.length) {
    sidebar.toc = found.toc
  }
  sidebar.currentSlug = slug
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <!-- loading -->
        <div v-if="loading" class="py-16 text-center txt-muted">
          <LoadingDots text="加载中" />
        </div>

        <!-- not found -->
        <div v-else-if="!note" class="py-16 text-center txt-muted">
          笔记不存在
        </div>

        <!-- content -->
        <article v-else class="article-with-aside">
          <div class="article-main">
            <div class="article-body">
              <header class="mb-10">
                <h1 class="text-2xl font-bold mb-2 txt-primary">{{ note.title }}</h1>
                <p class="text-xs txt-secondary">{{ note.date }} · {{ note.readingTime }} 分钟 · 约 {{ note.charCount }} 字</p>
              </header>

              <div
                ref="contentRef"
                class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
                v-html="note.html"
              ></div>

              <!-- prev/next navigation -->
              <nav class="flex items-center justify-between mt-16 pt-8 border-t" style="border-color: var(--border-primary)">
                <router-link
                  v-if="adjacent.prev"
                  :to="`/note/${adjacent.prev.slug}`"
                  class="interact-slide-bg inline-flex items-center gap-1 text-sm px-3 py-2"
                >
                  ← {{ adjacent.prev.title }}
                </router-link>
                <div v-else />
                <router-link
                  v-if="adjacent.next"
                  :to="`/note/${adjacent.next.slug}`"
                  class="interact-slide-bg inline-flex items-center gap-1 text-sm px-3 py-2"
                >
                  {{ adjacent.next.title }} →
                </router-link>
              </nav>
            </div>

            <aside class="article-aside">
              <div class="aside-tabs">
                <button
                  :class="['aside-tab', { active: activeTab === 'nav' }]"
                  @click="activeTab = 'nav'"
                >文章导航</button>
                <button
                  :class="['aside-tab', { active: activeTab === 'toc' }]"
                  @click="activeTab = 'toc'"
                >文章目录</button>
              </div>

              <nav v-show="activeTab === 'nav'" class="aside-body aside-nav-list">
                <div v-if="note?.category" class="label-uppercase px-3 pt-2 pb-1">{{ note.category }}</div>
                <router-link
                  v-for="n in sidebarNotes"
                  :key="n.slug"
                  :to="`/note/${n.slug}`"
                  :class="['aside-nav-item', { active: n.slug === (typeof route.params.slug === 'string' ? route.params.slug : '') }]"
                >
                  <span class="aside-nav-title">{{ n.title }}</span>
                  <span class="aside-nav-date">{{ n.date }}</span>
                </router-link>
              </nav>

              <nav v-show="activeTab === 'toc'" class="aside-body aside-toc-list">
                <a
                  v-for="item in note?.toc || []"
                  :key="item.id"
                  href="#"
                  @click.prevent="scrollToHeading(item.id)"
                  :class="['aside-toc-item']"
                  :style="{ paddingLeft: (item.level - 2) * 14 + 12 + 'px' }"
                >{{ item.text }}</a>
                <div v-if="!note?.toc?.length" class="aside-empty txt-muted">暂无目录</div>
              </nav>
            </aside>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
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

/* ── Nav list (notes) ── */
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

/* ── Responsive: hide sidebar on small screens ── */
@media (max-width: 896px) {
  .article-main {
    flex-direction: column;
  }
  .article-aside {
    display: none;
  }
}
</style>

