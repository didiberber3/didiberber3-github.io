<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Note, NoteMeta } from '../utils/content'
import type { TocItem } from '../utils/markdown'
import { useContentRenderer } from '../utils/useContentRenderer'
import { activeHeadingId, startTocObserver, stopTocObserver } from '../utils/useTocObserver'
import { iconForCategory } from '../utils/categoryIcons'

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
    <header class="article-hd">
      <h1 class="article-hd-title">{{ note.title }}</h1>
      <div class="article-hd-meta">
        <span v-if="note.category" class="article-hd-cat">
          <span class="cat-svg" v-html="iconForCategory(note.category)"></span>
          <span>{{ note.category }}</span>
        </span>
        <span class="article-hd-sep">·</span>
        {{ note.date }}<span class="article-hd-sep">·</span>{{ note.readingTime }} 分钟<span class="article-hd-sep">·</span>约 {{ note.charCount }} 字
      </div>
    </header>

    <div class="article-main">
      <div class="article-body">

        <div
          ref="contentRef"
          class="article-content content-prose"
          v-html="note.html"
        ></div>

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
/* ── Article header ── */
.article-hd {
  position: relative;
  padding: 3rem 0 2.5rem;
  text-align: center;
}
.article-hd-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -.03em;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: .75rem;
  position: relative;
  z-index: 1;
}
.article-hd-meta {
  font-size: .8125rem;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
}
.article-hd-cat {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.article-hd-cat .cat-svg {
  width: 13px;
  height: 13px;
}
.article-hd-sep {
  padding: 0 .5rem;
  color: var(--border-secondary);
}

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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-glass);
  border-radius: 2px;
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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: var(--shadow-glass);
  border-radius: 2px;
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
  border-radius: 2px;
}
.aside-tab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
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
  color: var(--text-secondary);
  border-left: 2px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.aside-nav-item:hover {
  background: var(--bg-secondary);
  border-left-color: var(--border-secondary);
  color: var(--text-primary);
}

.aside-nav-item.active,
.aside-nav-item.active:hover {
  border-left-color: var(--accent);
  color: var(--accent);
  font-weight: 500;
  background: var(--bg-tertiary);
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
  transition: color 0.2s, background 0.2s, border-color 0.2s;
  border-left: 2px solid transparent;
  line-height: 1.4;
}

.aside-toc-item:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-left-color: var(--border-secondary);
}

.aside-toc-item.active,
.aside-toc-item.active:hover {
  color: var(--text-primary);
  font-weight: 500;
  border-left-color: var(--accent);
  background: var(--bg-tertiary);
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
  .article-body {
    padding: 1.25rem;
    max-width: 100%;
    overflow-x: hidden;
  }
  .article-hd {
    padding: 2rem 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .article-body {
    padding: 0.875rem;
  }
  .article-hd-title {
    font-size: 1.5rem;
  }
}
</style>
