<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { Note, NoteMeta } from '../utils/content'
import type { TocItem } from '../utils/markdown'
import { useContentRenderer } from '../utils/useContentRenderer'

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
const activeTocId = ref('')
const tocObserver = ref<IntersectionObserver | null>(null)
const { contentRef, renderContent } = useContentRenderer()

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function setupTocObserver() {
  tocObserver.value?.disconnect()

  tocObserver.value = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeTocId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -50% 0px' }
  )

  nextTick(() => {
    const items = props.note.toc ?? []
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) tocObserver.value!.observe(el)
    }
  })
}

function setupContent() {
  renderContent()
  if (props.note.toc.length) {
    setupTocObserver()
  }
}

watch(() => props.note, setupContent)
onMounted(setupContent)
onUnmounted(() => tocObserver.value?.disconnect())
</script>

<template>
  <article class="article-with-aside">
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
          <div v-if="category" class="label-uppercase px-3 pt-2 pb-1">{{ category }}</div>
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
            :class="['aside-toc-item', activeTocId === item.id ? 'active' : '']"
            :style="{ paddingLeft: (item.level - 2) * 14 + 12 + 'px' }"
          >{{ item.text }}</a>
          <div v-if="!note.toc.length" class="aside-empty txt-muted">暂无目录</div>
        </nav>
      </aside>
    </div>
  </article>
</template>

<style scoped>
/* 文章目录 active 状态 — 跟随阅读位置平滑切换 */
.aside-toc-item.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: var(--bg-secondary);
}
</style>
