<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Note, NoteMeta } from '../utils/content'
import type { TocItem } from '../utils/markdown'
import { useContentRenderer } from '../utils/useContentRenderer'
import { activeHeadingId, startTocObserver, stopTocObserver } from '../utils/useTocObserver'

const props = defineProps<{
  note: Note
  navItems: NoteMeta[]
  navLinkTo: (slug: string) => string
  currentSlug: string
  category?: string
  adjacent?: { prev: NoteMeta | null; next: NoteMeta | null }
  adjacentLinkTo?: (slug: string) => string
}>()

const activeTab = ref<'nav' | 'toc'>('nav')
const { contentRef, renderContent } = useContentRenderer()

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function setupTocObserver() {
  const items = props.note.toc ?? []
  if (items.length) {
    startTocObserver(items.map((i) => i.id))
  }
}

function setupContent() {
  renderContent()
  setupTocObserver()
}

watch(() => props.note, setupContent)
onMounted(setupContent)
onUnmounted(() => stopTocObserver())
</script>

<template>
  <article class="article-with-aside">
    <div class="article-main">
      <div class="article-body">
        <header class="mb-10">
          <h1 class="text-2xl font-bold mb-2 text-primary">{{ note.title }}</h1>
          <p class="text-xs text-secondary">{{ note.date }} · {{ note.readingTime }} 分钟 · 约 {{ note.charCount }} 字</p>
        </header>

        <div
          ref="contentRef"
          class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
          v-html="note.html"
        ></div>

        <!-- prev/next navigation -->
        <nav
          v-if="adjacent"
          class="flex items-center justify-between mt-16 pt-8 border-t"
          style="border-color: var(--border-primary)"
        >
          <router-link
            v-if="adjacent.prev"
            :to="adjacentLinkTo ? adjacentLinkTo(adjacent.prev.slug) : ''"
            class="interact-slide-bg inline-flex items-center gap-1 text-sm px-3 py-2"
          >
            ← {{ adjacent.prev.title }}
          </router-link>
          <div v-else />
          <router-link
            v-if="adjacent.next"
            :to="adjacentLinkTo ? adjacentLinkTo(adjacent.next.slug) : ''"
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
          <div v-if="category" class="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted px-3 pt-2 pb-1">{{ category }}</div>
          <router-link
            v-for="n in navItems"
            :key="n.slug"
            :to="navLinkTo(n.slug)"
            :class="['aside-nav-item', { active: n.slug === currentSlug }]"
          >
            <span class="aside-nav-title">{{ n.title }}</span>
            <span class="aside-nav-date">{{ n.date }}</span>
          </router-link>
        </nav>

        <nav v-show="activeTab === 'toc'" class="aside-body aside-toc-list">
          <a
            v-for="item in note.toc"
            :key="item.id"
            href="#"
            @click.prevent="scrollToHeading(item.id)"
            :class="['aside-toc-item', activeHeadingId === item.id ? 'active' : '']"
            :style="{ paddingLeft: (item.level - 2) * 14 + 12 + 'px' }"
          >{{ item.text }}</a>
          <div v-if="!note.toc.length" class="aside-empty text-muted">暂无目录</div>
        </nav>
      </aside>
    </div>
  </article>
</template>

<style scoped>
/* ── Inline article sidebar layout ── */
.article-with-aside {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.article-main {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.article-body {
  flex: 1;
  min-width: 0;
  max-width: 720px;
  padding: 2rem;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-glass);
}

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
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-glass);
}

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
  transition: color 0.2s, background-color 0.2s;
  position: relative;
}

.aside-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  right: 0.5rem;
  height: 2px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.aside-tab:hover {
  background-color: var(--bg-tertiary);
}

.aside-tab:hover::after {
  transform: scaleX(1);
}

.aside-tab.active {
  color: var(--accent);
  font-weight: 500;
  background-color: var(--bg-tertiary);
}

.aside-tab.active::after {
  transform: scaleX(1);
}

.aside-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0;
}

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
  background: var(--bg-secondary);
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

/* active 状态 — 跟随阅读位置平滑切换 */
.aside-toc-item.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: var(--bg-secondary);
}

.aside-empty {
  padding: 1.5rem 0.75rem;
  font-size: 0.8125rem;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 896px) {
  .article-main {
    flex-direction: column;
  }
  .article-aside {
    display: none;
  }
}
</style>
