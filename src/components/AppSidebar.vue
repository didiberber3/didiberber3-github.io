<script setup lang="ts">
import type { NoteMeta } from '../utils/content'
import type { TocItem } from '../utils/markdown'
import TOCSidebar from './TOCSidebar.vue'
import { sidebar, closeSidebar } from '../utils/useSidebar'

const emit = defineEmits<{
  selectNote: [slug: string]
}>()

function onSelectNote(slug: string) {
  emit('selectNote', slug)
  closeSidebar()
}
</script>

<template>
  <Transition name="drawer">
    <div v-if="sidebar.visible" class="drawer-overlay" @click="closeSidebar">
      <aside class="drawer-panel" @click.stop>
        <div class="drawer-header">
          <span class="drawer-title">
            {{ sidebar.category || '导航' }}
          </span>
          <button class="drawer-close" @click="closeSidebar" aria-label="关闭侧栏">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="drawer-body">
          <!-- Category Nav -->
          <div v-if="sidebar.category && sidebar.notes.length" class="drawer-section">
            <div class="drawer-section-label">分类</div>
            <nav class="drawer-nav">
              <a
                v-for="note in sidebar.notes"
                :key="note.slug"
                href="#"
                :class="['drawer-nav-item', 'interact-slide-bg', sidebar.currentSlug === note.slug ? 'list-item-active' : '']"
                @click.prevent="onSelectNote(note.slug)"
              >
                <span class="drawer-nav-title">{{ note.title }}</span>
              </a>
            </nav>
          </div>

          <div v-if="sidebar.category && sidebar.notes.length && sidebar.toc.length" class="drawer-divider"></div>

          <!-- Table of Contents -->
          <div v-if="sidebar.toc.length > 1" class="drawer-section">
            <div class="drawer-section-label">目录</div>
            <TOCSidebar :items="sidebar.toc" />
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
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 280px;
  max-width: 80vw;
  height: 100%;
  background-color: var(--bg-primary);
  border-left: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid var(--border-primary);
}

.drawer-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-close {
  background: none;
  border: 1px solid var(--border-primary);
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
}

.drawer-close:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0;
}

.drawer-section {
  padding: 0 0.75rem;
}

.drawer-section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  padding: 0.5rem 0.5rem 0.25rem;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.drawer-nav-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.45rem 0.5rem;
  text-decoration: none;
  cursor: pointer;
  color: var(--text-primary);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
}

.drawer-nav-item:hover {
  background-color: var(--accent-bg);
}

.drawer-nav-title {
  font-size: 0.8125rem;
  color: inherit;
  line-height: 1.4;
}

.drawer-divider {
  height: 1px;
  background-color: var(--border-primary);
  margin: 0.75rem 0;
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
