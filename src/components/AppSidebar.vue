<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TOCSidebar from './TOCSidebar.vue'
import { sidebar, closeSidebar } from '../utils/useSidebar'

const emit = defineEmits<{
  selectNote: [slug: string]
}>()

const route = useRoute()
const router = useRouter()
const notesOpen = ref(false)
const tocOpen = ref(true)

const navLinks = [
  { label: '首页', path: '/' },
  { label: '时间轴', path: '/timeline' },
  { label: '文档', path: '/docs' },
  { label: '关于', path: '/about' },
]

function isActiveNav(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function go(path: string) {
  router.push(path)
  closeSidebar()
}

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
          <span class="drawer-title">导航</span>
          <button class="drawer-close interact-btn-icon" @click="closeSidebar" aria-label="关闭">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="drawer-body">
          <!-- Nav links -->
          <nav class="drawer-nav-links">
            <button
              v-for="link in navLinks"
              :key="link.path"
              @click="go(link.path)"
              :class="['drawer-nav-btn', isActiveNav(link.path) ? 'active' : '']"
            >{{ link.label }}</button>
          </nav>

          <!-- Notes -->
          <div v-if="sidebar.notes.length" class="drawer-section">
            <button class="drawer-section-btn" @click="notesOpen = !notesOpen">
              <span>{{ sidebar.category || '笔记' }}</span>
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

          <!-- TOC -->
          <div v-if="sidebar.toc.length > 1" class="drawer-section">
            <button class="drawer-section-btn" @click="tocOpen = !tocOpen">
              <span>目录</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" :class="{ rotated: tocOpen }"><path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-left: 1px solid var(--border-primary);
  box-shadow: var(--shadow-glass);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
}
.drawer-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--accent);
  z-index: 1;
  opacity: 0.3;
  pointer-events: none;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.drawer-title::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.7;
}

.drawer-close {
  width: 28px;
  height: 28px;
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
}

/* ── nav links ── */
.drawer-nav-links {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.125rem;
  border-bottom: 1px solid var(--border-primary);
}
.drawer-nav-btn {
  width: 100%;
  text-align: left;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--text-secondary);
  background: none;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  border-left: 2px solid transparent;
  padding-left: 0.625rem;
  transition: background 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
}
.drawer-nav-btn:hover {
  background: color-mix(in srgb, var(--bg-secondary) 50%, transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: var(--text-primary);
  border-left-color: var(--accent);
  padding-left: 0.875rem;
}
.drawer-nav-btn.active {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-tertiary) 50%, transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  font-weight: 500;
  border-left-color: var(--accent);
  padding-left: 0.875rem;
}
.drawer-nav-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

/* ── sections ── */
.drawer-section { padding: 0; }
.drawer-section + .drawer-section { border-top: 1px solid var(--border-primary); }
.drawer-section-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
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
  opacity: 0.5;
}
.drawer-section-btn:hover svg { opacity: 0.8; }
.drawer-section-btn svg.rotated { transform: rotate(90deg); }

/* ── list items ── */
.drawer-list {
  display: flex;
  flex-direction: column;
}
.drawer-list-item {
  display: block;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.2s, background 0.2s, border-color 0.2s, padding-left 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.drawer-list-item:hover {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-secondary) 50%, transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-left-color: var(--accent);
  padding-left: 1.75rem;
}
.drawer-list-item.active {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-tertiary) 50%, transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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
