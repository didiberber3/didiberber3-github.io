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

const { contentRef, renderContent } = useContentRenderer()

/* ── 快速目录：点击正文标题在点击位置弹出 ──
 * 关闭策略：全屏透明遮罩（backdrop）接住 popup 外的点击。
 * 不用 document 全局 click 监听——否则「点击标题打开」的这次点击
 * 冒泡到 document 时会被误判为点击外部而立即关闭。
 */
const quickTocOpen = ref(false)
const quickTocPos = ref({ x: 0, y: 0 })

function openQuickToc(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const popupWidth = 260
  const maxH = Math.min(window.innerHeight * 0.6, 360)
  // 优先在标题下方，放不下则向上弹
  let y = rect.bottom + 6
  if (y + maxH > window.innerHeight - 8) y = rect.top - 6 - maxH
  const x = Math.min(Math.max(rect.left, 8), window.innerWidth - popupWidth - 8)
  quickTocPos.value = { x, y: Math.max(y, 8) }
  quickTocOpen.value = true
  window.addEventListener('keydown', onDocKeydown)
}

function closeQuickToc() {
  quickTocOpen.value = false
  window.removeEventListener('keydown', onDocKeydown)
}

function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeQuickToc()
}

function onWindowScroll() {
  if (quickTocOpen.value) closeQuickToc()
}

function goToHeading(id: string) {
  closeQuickToc()
  activeHeadingId.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ── 正文点击：标题 → 快速目录；行内代码 → 复制 ── */
function onContentClick(e: MouseEvent) {
  const target = e.target as Element | null
  if (!target || !(target instanceof Element)) return
  const heading = target.closest('h1, h2, h3, h4, h5, h6')
  if (heading) {
    openQuickToc(heading as HTMLElement)
    return
  }
  if (target.tagName === 'CODE' && !target.closest('pre')) {
    const text = target.textContent ?? ''
    navigator.clipboard.writeText(text).catch(() => {})
    // 短暂高亮作为复制反馈
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

function setupContent() {
  renderContent()
  setupTocObserver()
}

watch(() => props.note, setupContent)
onMounted(() => {
  setupContent()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})
onUnmounted(() => {
  stopTocObserver()
  window.removeEventListener('scroll', onWindowScroll)
  window.removeEventListener('keydown', onDocKeydown)
  quickTocOpen.value = false
})
</script>

<template>
  <article class="article-page">
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

    <div class="article-body">
      <div
        ref="contentRef"
        class="article-content content-prose"
        v-html="note.html"
        @click="onContentClick"
      ></div>
    </div>

    <!-- 快速目录 popup：全屏遮罩接住外部点击，popup 内部 @click.stop 隔离 -->
    <Teleport to="body">
      <Transition name="quick-toc">
        <div v-if="quickTocOpen" class="quick-toc-backdrop" @click="closeQuickToc">
          <div
            class="quick-toc"
            :style="{ left: quickTocPos.x + 'px', top: quickTocPos.y + 'px' }"
            @click.stop
          >
            <div class="quick-toc-head">快速目录</div>
            <ul v-if="note.toc.length" class="quick-toc-list">
              <li v-for="item in note.toc" :key="item.id">
                <a
                  href="#"
                  @click.prevent="goToHeading(item.id)"
                  :class="['quick-toc-link', activeHeadingId === item.id ? 'active' : '']"
                  :style="{ paddingLeft: (item.level - 1) * 14 + 10 + 'px' }"
                >{{ item.text }}</a>
              </li>
            </ul>
            <div v-else class="quick-toc-empty text-muted">暂无目录</div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </article>
</template>

<style scoped>
/* ── Article header ── */
.article-hd {
  padding: 2.5rem 0 1.5rem;
}
.article-hd-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -.03em;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: .75rem;
}
.article-hd-meta {
  font-size: .8125rem;
  color: var(--text-muted);
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

/* ── 单栏版式 ── */
.article-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.article-body {
  padding: 2rem 0;
}

/* ── 快速目录 popup（Teleport 到 body，scoped 样式仍生效）── */
.quick-toc-backdrop {
  position: fixed;
  inset: 0;
  z-index: 199;
}
.quick-toc {
  position: fixed;
  z-index: 200;
  width: 260px;
  max-width: calc(100vw - 16px);
  max-height: min(60vh, 360px);
  overflow-y: auto;
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  box-shadow: var(--shadow-glass-lg);
}
.quick-toc-head {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
}
.quick-toc-list {
  list-style: none;
  margin: 0;
  padding: 0.375rem 0;
}
.quick-toc-link {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}
.quick-toc-link:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-left-color: var(--border-secondary);
}
.quick-toc-link.active,
.quick-toc-link.active:hover {
  color: var(--accent);
  font-weight: 500;
  border-left-color: var(--accent);
  background: var(--accent-bg);
}
.quick-toc-empty {
  padding: 1rem;
  font-size: 0.8125rem;
  text-align: center;
}

/* ── 快速目录过渡 ── */
.quick-toc-enter-active,
.quick-toc-leave-active {
  transition: opacity 0.15s ease;
}
.quick-toc-enter-from,
.quick-toc-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .article-body {
    padding: 1.25rem 0;
  }
  .article-hd {
    padding: 1.5rem 0 1.25rem;
  }
}

@media (max-width: 480px) {
  .article-body {
    padding: 0.875rem 0;
  }
  .article-hd-title {
    font-size: 1.5rem;
  }
}
</style>
