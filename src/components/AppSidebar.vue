<script setup lang="ts">
import { ref } from 'vue'
import TOCSidebar from './TOCSidebar.vue'
import { sidebar, closeSidebar } from '../utils/useSidebar'

const emit = defineEmits<{
  selectNote: [slug: string]
}>()

const notesOpen = ref(true)
const tocOpen = ref(true)

function onSelectNote(slug: string) {
  emit('selectNote', slug)
  closeSidebar()
}

function toggleNotes() {
  notesOpen.value = !notesOpen.value
}

function toggleToc() {
  tocOpen.value = !tocOpen.value
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
          <!-- Notes List (collapsible) -->
          <div v-if="sidebar.notes.length" class="drawer-section">
            <div class="drawer-section-header" @click="toggleNotes" role="button" tabindex="0" @keydown.enter="toggleNotes" @keydown.space.prevent="toggleNotes">
              <span class="drawer-section-label">{{ sidebar.category || '笔记' }}</span>
              <span class="drawer-chevron" :class="{ rotated: notesOpen }">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <nav v-show="notesOpen" class="drawer-nav">
              <a
                v-for="note in sidebar.notes"
                :key="note.slug"
                href="#"
                :class="['drawer-nav-item', sidebar.currentSlug === note.slug ? 'active' : '']"
                @click.prevent="onSelectNote(note.slug)"
              >
                <span class="drawer-nav-title">{{ note.title }}</span>
              </a>
            </nav>
          </div>

          <div v-if="sidebar.notes.length && sidebar.toc.length" class="drawer-divider"></div>

          <!-- Table of Contents (collapsible) -->
          <div v-if="sidebar.toc.length > 1" class="drawer-section">
            <div class="drawer-section-header" @click="toggleToc" role="button" tabindex="0" @keydown.enter="toggleToc" @keydown.space.prevent="toggleToc">
              <span class="drawer-section-label">目录</span>
              <span class="drawer-chevron" :class="{ rotated: tocOpen }">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <div v-show="tocOpen">
              <TOCSidebar :items="sidebar.toc" />
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
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid var(--border-primary);
}

.drawer-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-close {
  position: relative;
  overflow: hidden;
  background: none;
  border: 1px solid var(--border-primary);
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  border-radius: 2px;
  transition: color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.15s;
}
.drawer-close::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--accent);
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
  border-radius: 1px;
}
.drawer-close:hover {
  color: white;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
.drawer-close:hover::before {
  transform: scale(1);
}
.drawer-close:active {
  transform: scale(0.97);
}
.drawer-close:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
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
  padding: 0.75rem 0;
}

.drawer-section {
  padding: 0 0.75rem;
}

.drawer-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 0.5rem 0.25rem;
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
  border-radius: 2px;
  transition: background-color 0.25s, border-color 0.25s, padding-left 0.25s;
}
.drawer-section-header:hover {
  background-color: var(--bg-secondary);
  border-left-color: var(--accent);
  padding-left: 0.75rem;
}
.drawer-section-header:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
.drawer-section-header:hover .drawer-section-label,
.drawer-section-header:hover .drawer-chevron {
  color: var(--accent);
}

.drawer-section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  transition: color 0.25s;
}

.drawer-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
  transition: color 0.2s, transform 0.25s ease;
}
.drawer-chevron.rotated {
  transform: rotate(90deg);
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
  color: var(--text-secondary);
  border-left: 2px solid transparent;
  border-radius: 0;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

.drawer-nav-item:hover {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border-left-color: var(--border-secondary);
}

.drawer-nav-item.active {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
  border-left-color: var(--accent);
  font-weight: 500;
}

.drawer-nav-item.active:hover {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
  border-left-color: var(--accent);
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
