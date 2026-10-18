<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import type { Note, NoteMeta } from '../utils/content'
import { useContentRenderer } from '../utils/useContentRenderer'
import { startTocObserver, stopTocObserver } from '../utils/useTocObserver'

const props = defineProps<{
  note: Note
  navItems: NoteMeta[]
  navLinkTo: (slug: string) => string
  currentSlug: string
  category?: string
  adjacent?: { prev: NoteMeta | null; next: NoteMeta | null }
  adjacentLinkTo?: (slug: string) => string
}>()

const { contentRef, renderContent } = useContentRenderer()

/** 文末相关文章：同类其它笔记，最多 6 条 */
const relatedNotes = computed(() =>
  props.navItems.filter((n) => n.slug !== props.currentSlug).slice(0, 6),
)

function relatedLink(slug: string): string {
  return props.navLinkTo(slug)
}

function pagerLink(slug: string): string {
  return props.adjacentLinkTo ? props.adjacentLinkTo(slug) : props.navLinkTo(slug)
}

/* ── 正文点击：仅处理行内代码复制（标题不再弹目录） ── */
function onContentClick(e: MouseEvent) {
  const target = e.target as Element | null
  if (!target || !(target instanceof Element)) return
  if (target.tagName === 'CODE' && !target.closest('pre')) {
    const text = target.textContent ?? ''
    navigator.clipboard.writeText(text).catch(() => {})
    target.classList.add('copied')
    setTimeout(() => target.classList.remove('copied'), 600)
  }
}

function setupTocObserver() {
  const items = props.note.toc ?? []
  if (items.length) {
    startTocObserver(items.map((i) => i.id))
  }
}

async function setupContent() {
  await renderContent()
  setupTocObserver()
}

watch(() => props.note, setupContent)
onMounted(setupContent)
onUnmounted(() => stopTocObserver())
</script>

<template>
  <article class="article-page">
    <header class="article-hd">
      <h1 class="article-hd-title">{{ note.title }}</h1>
      <p class="article-hd-meta">
        <span class="meta-date">{{ note.date }}</span>
        <span
          ><span class="meta-num">{{ note.readingTime }}</span> 分钟</span
        >
        <span
          >约 <span class="meta-num">{{ note.charCount }}</span> 字</span
        >
      </p>
      <div v-if="note.category || note.tags.length" class="article-taxonomy">
        <router-link
          v-if="note.category"
          :to="{ path: '/', query: { category: note.category } }"
          class="article-cat-link"
          >{{ note.category }}</router-link
        >
        <span v-if="note.tags.length" class="article-tags mono">
          <router-link
            v-for="tag in note.tags"
            :key="tag"
            :to="{ path: '/', query: { tag } }"
            class="article-tag"
          >
            <span class="article-tag-hash" aria-hidden="true">#</span>{{ tag }}
          </router-link>
        </span>
      </div>
      <p v-if="note.description" class="article-lead">{{ note.description }}</p>
    </header>

    <div class="article-body">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        ref="contentRef"
        class="article-content content-prose"
        @click="onContentClick"
        v-html="note.html"
      ></div>
    </div>

    <!-- 文末：相关文章 -->
    <section v-if="relatedNotes.length" class="related" aria-labelledby="related-title">
      <div class="related-head">
        <h2 id="related-title" class="related-title">相关文章</h2>
      </div>
      <ul class="related-list">
        <li v-for="item in relatedNotes" :key="item.slug">
          <router-link :to="relatedLink(item.slug)" class="related-link">
            <span class="related-name">{{ item.title }}</span>
            <span v-if="item.date" class="meta related-date">{{ item.date }}</span>
          </router-link>
        </li>
      </ul>
    </section>

    <!-- 文末：上一篇 / 下一篇 -->
    <nav v-if="adjacent" class="pager" aria-label="文章导航">
      <router-link
        v-if="adjacent.prev"
        :to="pagerLink(adjacent.prev.slug)"
        class="pager-link pager-prev"
      >
        <span class="pager-label mono">上一篇</span>
        <span class="pager-title">{{ adjacent.prev.title }}</span>
      </router-link>
      <span v-else class="pager-placeholder" aria-hidden="true"></span>

      <router-link
        v-if="adjacent.next"
        :to="pagerLink(adjacent.next.slug)"
        class="pager-link pager-next"
      >
        <span class="pager-label mono">下一篇</span>
        <span class="pager-title">{{ adjacent.next.title }}</span>
      </router-link>
    </nav>
  </article>
</template>

<style scoped>
.article-page {
  width: 100%;
}

/* ── 文章头：标题 + 元信息 + 分类/标签 ── */
.article-hd {
  padding-block: var(--space-2) var(--space-4);
}
.article-hd-title {
  margin-top: var(--space-2);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--text-primary);
  text-wrap: balance;
}
.article-hd-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-4);
  margin-top: var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* 数字保留 mono，中文标签用正文字体，避免中文走等宽字体的回退字形 */
.meta-date,
.meta-num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

/* ── 分类 + 标签：纯文字，分类用 / 前缀，标签用 # 前缀 ── */
.article-taxonomy {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-3);
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.01em;
}

.article-cat-link {
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.article-cat-link::before {
  content: '/';
  margin-right: 3px;
  color: var(--border-secondary);
  font-weight: 400;
}
.article-cat-link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.article-lead {
  margin-top: var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.85;
  color: var(--text-muted);
  text-wrap: pretty;
}

.article-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}
.article-tag {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.article-tag:hover {
  color: var(--accent);
}
.article-tag-hash {
  margin-right: 1px;
  color: var(--border-secondary);
  transition: color var(--dur-fast) var(--ease-out);
}
.article-tag:hover .article-tag-hash {
  color: var(--accent);
}

.article-body {
  padding-block: var(--space-3) var(--space-6);
}

/* ── 文末相关文章 ── */
.related {
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-primary);
}
.related-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}
.related-title {
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}
.related-list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}
.related-link {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  padding-block: var(--space-2);
  border-bottom: 1px solid var(--border-primary);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.related-link:last-child {
  border-bottom: 0;
}
.related-name {
  flex: 1 1 auto;
  min-width: 0;
  font-size: var(--text-base);
  color: var(--text-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color var(--dur-fast) var(--ease-out);
}
.related-date {
  flex: 0 0 auto;
}
.related-link:hover .related-name {
  color: var(--accent);
}

/* ── 上一篇 / 下一篇 ── */
.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-top: var(--space-7);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-primary);
}
.pager-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
  text-decoration: none;
}
.pager-next {
  align-items: flex-end;
  text-align: right;
}
.pager-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 0.04em;
}
.pager-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-primary);
  font-size: var(--text-sm);
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color var(--dur-fast) var(--ease-out);
}
.pager-link:hover .pager-title {
  color: var(--accent);
}

@media (max-width: 768px) {
  .article-hd {
    padding-block: var(--space-1) var(--space-3);
  }
  .article-body {
    padding-block: var(--space-2) var(--space-5);
  }
  .related,
  .pager {
    margin-top: var(--space-6);
  }
}

@media (max-width: 480px) {
  .article-hd-title {
    font-size: var(--text-xl);
  }
  .article-hd-meta {
    gap: var(--space-2) var(--space-3);
  }
  .pager {
    gap: var(--space-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .related-link,
  .related-name,
  .pager-title,
  .article-tag,
  .article-tag-hash,
  .article-cat-link {
    transition: none;
  }
}
</style>
