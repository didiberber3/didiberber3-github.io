<script setup lang="ts">
/**
 * 文章目录。
 * - 宽屏（>=1100px）：右侧常驻 sticky 目录，跟随滚动高亮。
 * - 窄屏：右下角「目录」按钮，点开底部抽屉；选中后自动收起。
 * 目录观察器由 ArticleContent 负责启动，这里只消费 activeHeadingId。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { TocItem } from '../utils/markdown'
import { activeHeadingId } from '../utils/useTocObserver'
import TocList from './TocList.vue'

const props = defineProps<{
  items: TocItem[]
}>()

const open = ref(false)
const railListRef = ref<HTMLElement | null>(null)
const sheetBodyRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const hasItems = computed(() => props.items.length > 0)
const activeId = computed(() => activeHeadingId.value)

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function lockBody() {
  document.body.style.overflow = 'hidden'
}
function unlockBody() {
  document.body.style.overflow = ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function openSheet() {
  if (open.value) return
  open.value = true
  lockBody()
  document.addEventListener('keydown', onKeydown)
}

function close() {
  if (!open.value) return
  open.value = false
  unlockBody()
  document.removeEventListener('keydown', onKeydown)
  nextTick(() => triggerRef.value?.focus())
}

function toggle() {
  if (open.value) close()
  else openSheet()
}

function goTo(id: string) {
  close()
  activeHeadingId.value = id
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

/** 让当前高亮条目滚动到目录可视区中部（只滚目录容器，不动页面） */
function centerActive(container: HTMLElement | null) {
  if (!container) return
  const el = container.querySelector<HTMLElement>(
    `[data-id="${CSS.escape(activeHeadingId.value)}"]`,
  )
  if (!el) return
  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const offset = elRect.top - containerRect.top
  const target = container.scrollTop + offset - (container.clientHeight - elRect.height) / 2
  const max = container.scrollHeight - container.clientHeight
  container.scrollTop = Math.max(0, Math.min(target, max))
}

watch(activeHeadingId, () => {
  nextTick(() => {
    centerActive(railListRef.value)
    if (open.value) centerActive(sheetBodyRef.value)
  })
})

watch(open, (value) => {
  if (value) nextTick(() => centerActive(sheetBodyRef.value))
})

onBeforeUnmount(() => {
  if (open.value) {
    unlockBody()
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <nav v-if="hasItems" ref="railListRef" class="toc-rail" aria-label="文章目录">
    <div class="toc-rail-list">
      <TocList :items="items" :active-id="activeId" @select="goTo" />
    </div>
  </nav>

  <button
    v-if="hasItems && !open"
    ref="triggerRef"
    type="button"
    class="toc-trigger"
    aria-haspopup="dialog"
    @click="toggle"
  >
    <span>目录</span>
    <span class="toc-trigger-count mono" aria-hidden="true">{{ items.length }}</span>
  </button>

  <Teleport to="body">
    <Transition name="toc-sheet">
      <div v-if="open" class="toc-backdrop" @click="close">
        <section
          class="toc-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="文章目录"
          @click.stop
        >
          <header class="toc-sheet-head">
            <span class="toc-sheet-handle" aria-hidden="true"></span>
            <button
              type="button"
              class="interact-btn-icon toc-sheet-close"
              aria-label="关闭目录"
              @click="close"
            >
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </header>
          <div ref="sheetBodyRef" class="toc-sheet-body">
            <TocList :items="items" :active-id="activeId" @select="goTo" />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── 桌面常驻右栏 ── */
.toc-rail {
  display: none;
  position: sticky;
  top: calc(var(--nav-h) + var(--space-5));
  max-height: calc(100dvh - var(--nav-h) - var(--space-7));
  padding-block: var(--space-1);
  overflow-y: auto;
  scrollbar-width: none;
}
.toc-rail::-webkit-scrollbar {
  display: none;
}

.toc-rail-list {
  display: flex;
  flex-direction: column;
}

/* ── 移动端触发按钮 ── */
.toc-trigger {
  position: fixed;
  right: var(--space-4);
  bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  z-index: var(--z-popup);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 2.25rem;
  padding: 0 var(--space-3);
  border: 1px solid var(--border-secondary);
  background: var(--bg-raised);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  transition:
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}
.toc-trigger:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.toc-trigger-count {
  color: var(--text-muted);
  font-size: 0.6875rem;
}

/* ── 底部抽屉 ── */
.toc-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  align-items: flex-end;
  background: var(--bg-overlay);
}

.toc-sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 72dvh;
  background: var(--bg-raised);
  border-top: 1px solid var(--border-secondary);
}

.toc-sheet-head {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: var(--space-2) var(--space-4) var(--space-2);
  border-bottom: 1px solid var(--border-primary);
}

.toc-sheet-handle {
  grid-column: 2;
  justify-self: center;
  width: 2.25rem;
  height: 2px;
  background: var(--border-secondary);
}

.toc-sheet-close {
  grid-column: 3;
  justify-self: end;
}

.toc-sheet-body {
  display: flex;
  flex-direction: column;
  padding: var(--space-2) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* 抽屉内条目放大点击区域，同时保证可读性 */
.toc-sheet-body :deep(.toc-link) {
  padding-block: var(--space-3);
  font-size: var(--text-base);
  color: var(--text-secondary);
}
.toc-sheet-body :deep(.toc-link.depth-3) {
  font-size: var(--text-sm);
}
.toc-sheet-body :deep(.toc-link.active) {
  color: var(--accent);
}

/* ── 抽屉动画 ── */
.toc-sheet-enter-active,
.toc-sheet-leave-active {
  transition: opacity var(--dur) var(--ease-out);
}
.toc-sheet-enter-active .toc-sheet,
.toc-sheet-leave-active .toc-sheet {
  transition: transform var(--dur) var(--ease-out);
}
.toc-sheet-enter-from,
.toc-sheet-leave-to {
  opacity: 0;
}
.toc-sheet-enter-from .toc-sheet,
.toc-sheet-leave-to .toc-sheet {
  transform: translateY(100%);
}

/* ── 断点：>=1100 显示右栏，窄屏显示按钮 ── */
@media (min-width: 1100px) {
  .toc-rail {
    display: block;
  }
  .toc-trigger {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toc-trigger,
  .toc-sheet,
  .toc-sheet-enter-active,
  .toc-sheet-leave-active,
  .toc-sheet-enter-active .toc-sheet,
  .toc-sheet-leave-active .toc-sheet {
    transition: none;
  }
}
</style>
