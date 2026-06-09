<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import BackToTop from './BackToTop.vue'
import { sidebar, openSidebar, closeSidebar, setSidebarVisible } from '../utils/useSidebar'
import { getNoteList } from '../utils/content'

const route = useRoute()
const router = useRouter()

const isDark = ref(false)
const isAnimating = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

function toggleTheme() {
  isAnimating.value = true
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  setTimeout(() => { isAnimating.value = false }, 300)
}

const tabs = [
  { label: '首页', path: '/' },
  { label: '笔记', path: '/notes' },
  { label: '文档', path: '/docs' },

  { label: '关于', path: '/about' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  if (path === '/notes') return route.path.startsWith('/note')
  return route.path.startsWith(path)
}

function go(path: string) {
  router.push(path)
}

function toggleSidebar() {
  if (sidebar.visible) {
    closeSidebar()
    return
  }
  // On article pages or docs article pages: sidebar already pre-populated by page
  if (route.path.startsWith('/note/') || route.path.startsWith('/docs/')) {
    if (sidebar.toc.length > 0 || sidebar.notes.length > 0) {
      setSidebarVisible(true)
      return
    }
  }
  // Fallback: show all notes
  openSidebar({ notes: getNoteList() })
}
</script>

<template>
  <nav
    class="nav-bar sticky top-0 z-50 border-b transition-colors"
  >
    <div class="flex items-center justify-between max-w-6xl mx-auto px-4">
      <div class="flex items-center gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          @click="go(tab.path)"
          class="tab-btn"
          :class="{ active: isActive(tab.path) }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <BackToTop />
        <button
          class="sidebar-toggle"
          @click="toggleSidebar"
          aria-label="打开侧栏"
          title="打开侧栏"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="14" height="2" rx="1" fill="currentColor" />
            <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
            <rect x="3" y="14" width="14" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :class="{ rotating: isAnimating }"
          :title="isDark ? '切换亮色' : '切换暗色'"
        >
          <svg v-if="isDark" class="theme-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="10" cy="10" r="4" fill="currentColor" />
            <g stroke="currentColor" stroke-width="1.5">
              <line x1="10" y1="1" x2="10" y2="3.5" />
              <line x1="10" y1="16.5" x2="10" y2="19" />
              <line x1="1" y1="10" x2="3.5" y2="10" />
              <line x1="16.5" y1="10" x2="19" y2="10" />
              <line x1="3.8" y1="3.8" x2="5.3" y2="5.3" />
              <line x1="14.7" y1="14.7" x2="16.2" y2="16.2" />
              <line x1="3.8" y1="16.2" x2="5.3" y2="14.7" />
              <line x1="14.7" y1="5.3" x2="16.2" y2="3.8" />
            </g>
          </svg>
          <svg v-else class="theme-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path d="M17 12.5A8 8 0 0 1 7.5 3a8 8 0 1 0 9.5 9.5z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-bar {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-glass);
}

.tab-btn {
  position: relative;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  transition: color 0.25s, background-color 0.25s;
}
.tab-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
}

.tab-btn:hover::after {
  transform: scaleX(1);
}

.tab-btn.active {
  color: var(--accent);
  font-weight: 500;
  background-color: var(--bg-tertiary);
}

.tab-btn.active::after {
  transform: scaleX(1);
}

/* ── Sidebar toggle ── */
.sidebar-toggle {
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
.sidebar-toggle::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--accent);
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
  border-radius: 1px;
}
.sidebar-toggle:hover {
  color: white;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
.sidebar-toggle:hover::before {
  transform: scale(1);
}
.sidebar-toggle:active {
  transform: scale(0.97);
}
.sidebar-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Theme toggle ── */
.theme-toggle {
  position: relative;
  overflow: hidden;
  background: none;
  border: 1px solid var(--border-primary);
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  color: var(--text-secondary);
  border-radius: 2px;
  transition: color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.15s;
}
.theme-toggle::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--accent);
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
  border-radius: 1px;
}
.theme-toggle:hover {
  color: white;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
.theme-toggle:hover::before {
  transform: scale(1);
}
.theme-toggle:active {
  transform: scale(0.97);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Theme icon rotation (kept) ── */

/* Click rotation */
.theme-toggle.rotating {
  animation: rotateOnce 0.3s ease;
}

/* Hover rotation */
.theme-toggle:hover .theme-icon {
  animation: rotateOnce 0.6s ease;
}

.theme-icon {
  display: block;
  line-height: 1;
}

@keyframes rotateOnce {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
