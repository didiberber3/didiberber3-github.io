<script setup lang="ts">
import { ref, computed } from 'vue'
import { sidebar, closeSidebar } from '../utils/useSidebar'
import { activeHeadingId } from '../utils/useTocObserver'

const emit = defineEmits<{
  selectNote: [slug: string]
}>()

const tocOpen = ref(true)
const notesOpen = ref(true)

/** 空态：既无目录也无同类文章（非文章页面） */
const isEmpty = computed(() => sidebar.toc.length === 0 && sidebar.notes.length === 0)

function onSelectNote(slug: string) {
  emit('selectNote', slug)
  closeSidebar()
}

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  activeHeadingId.value = id
}
</script>

<template>
  <Transition name="drawer">
    <div v-if="sidebar.visible" class="drawer-overlay" @click="closeSidebar">
      <aside class="drawer-panel" @click.stop>
        <div class="drawer-header">
          <span class="drawer-title">文章</span>
          <button class="drawer-close interact-btn-icon" @click="closeSidebar" aria-label="关闭">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="drawer-body">
          <div v-if="isEmpty" class="drawer-empty text-muted">暂无内容</div>

          <!-- 目录 -->
          <div v-else-if="sidebar.toc.length" class="drawer-section">
            <button class="drawer-section-btn" @click="tocOpen = !tocOpen">
              <span>目录</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" :class="{ rotated: tocOpen }"><path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div v-show="tocOpen" class="drawer-toc">
              <a
                v-for="item in sidebar.toc"
                :key="item.id"
                href="#"
                @click.prevent="scrollToHeading(item.id)"
                :class="['drawer-toc-item', activeHeadingId === item.id ? 'active' : '']"
                :style="{ paddingLeft: (item.level - 2) * 14 + 12 + 'px' }"
              >{{ item.text }}</a>
            </div>
          </div>

          <!-- 同类文章 -->
          <div v-if="sidebar.notes.length" class="drawer-section">
            <button class="drawer-section-btn" @click="notesOpen = !notesOpen">
              <span>{{ sidebar.category || '同类文章' }}</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" :class="{ rotated: notesOpen }"><path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div v-show="notesOpen" class="drawer-list">
              <a
                v-for="note in sidebar.notes"
                :key="note.slug"
                href="#"
                :class="['drawer-list-item', sidebar.currentSlug === note.slug ? 'active' : '']"
                @click.prevent="onSelectNote(note.slug)"
              >{{ note.title }}</a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: var(--drawer-overlay, rgba(0, 0, 0, 0.15));
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 280px;
  max-width: 80vw;
  height: 100%;
  background: var(--bg-glass);
  border-left: 1px solid var(--border-primary);
  box-shadow: var(--shadow-glass-lg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--border-primary);
}
.drawer-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.drawer-title::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.8;
}

.drawer-close {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--text-secondary);
}
.drawer-close:hover svg {
  animation: drawerCloseRotate 0.6s ease;
}
@keyframes drawerCloseRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1.5rem;
}

.drawer-empty {
  padding: 3rem 1rem;
  font-size: 0.8125rem;
  text-align: center;
}

/* ── sections ── */
.drawer-section { padding: 0.75rem 0.75rem 0; }
.drawer-section-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  border-radius: 2px;
  transition: color 0.2s, background 0.2s;
}
.drawer-section-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}
.drawer-section-btn svg {
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
  flex-shrink: 0;
  opacity: 0.6;
}
.drawer-section-btn svg.rotated { transform: rotate(90deg); }

/* ── TOC items ── */
.drawer-toc {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.375rem 0.25rem 0.5rem;
}
.drawer-toc-item {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  border-radius: 2px;
  line-height: 1.4;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}
.drawer-toc-item:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-left-color: var(--border-secondary);
}
.drawer-toc-item.active,
.drawer-toc-item.active:hover {
  color: var(--accent);
  font-weight: 500;
  border-left-color: var(--accent);
  background: var(--accent-bg);
}

/* ── 同类文章 ── */
.drawer-list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.375rem 0.25rem 0.5rem;
}
.drawer-list-item {
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  border-radius: 2px;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.drawer-list-item:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-left-color: var(--border-secondary);
}
.drawer-list-item.active {
  color: var(--accent);
  background: var(--accent-bg);
  border-left-color: var(--accent);
  font-weight: 500;
}

/* Transition animations */
.drawer-enter-active {
  transition: opacity 0.25s ease;
}
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer-panel {
  animation: slideIn 0.25s ease-out;
}
.drawer-leave-active .drawer-panel {
  animation: slideOut 0.2s ease-in;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slideOut {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
</style>
