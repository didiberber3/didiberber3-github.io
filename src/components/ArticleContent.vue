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
    <header class="article-hd">
      <svg class="article-geo" viewBox="0 0 960 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id="ga"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".1"/><stop offset="100%" stop-color="transparent" stop-opacity="0"/></radialGradient>
        </defs>
        <ellipse cx="480" cy="130" rx="140" ry="90" fill="url(#ga)"/>
        <g class="art-orbit-cw"><ellipse cx="480" cy="130" rx="80" ry="40" fill="none" stroke="var(--accent)" stroke-width=".8" opacity=".4" stroke-dasharray="6 4"/></g>
        <g class="art-orbit-ccw"><circle cx="480" cy="130" r="60" fill="none" stroke="var(--accent2)" stroke-width=".6" opacity=".3" stroke-dasharray="3 6"/></g>
        <g class="art-orbit-fast"><circle cx="480" cy="130" r="45" fill="none" stroke="var(--accent3)" stroke-width=".7" opacity=".35" stroke-dasharray="2 8"/></g>
        <circle cx="480" cy="130" r="14" fill="var(--accent)" opacity=".2"/>
        <circle cx="480" cy="130" r="7" fill="var(--accent)" opacity=".4"/>
        <g class="art-orbit-cw"><circle cx="480" cy="90" r="3" fill="var(--accent3)" opacity=".7"/></g>
        <g class="art-orbit-ccw"><circle cx="540" cy="130" r="2.5" fill="var(--accent2)" opacity=".5"/></g>
        <g class="art-orbit-fast"><circle cx="420" cy="130" r="2" fill="var(--accent)" opacity=".5"/></g>
        <line x1="60" y1="10" x2="900" y2="10" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
        <line x1="60" y1="250" x2="900" y2="250" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
      </svg>
      <h1 class="article-hd-title">{{ note.title }}</h1>
      <div class="article-hd-meta">{{ note.date }}<span class="article-hd-sep">·</span>{{ note.readingTime }} 分钟<span class="article-hd-sep">·</span>约 {{ note.charCount }} 字</div>
    </header>

    <div class="article-main">
      <div class="article-body">

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
.article-geo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  pointer-events: none;
}
@keyframes arcw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes arccw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
.art-orbit-cw{animation:arcw 28s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.art-orbit-ccw{animation:arccw 22s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.art-orbit-fast{animation:arcw 14s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
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
  transition: color 0.25s, background-color 0.25s;
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
  color: var(--text-primary);
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
}
</style>
