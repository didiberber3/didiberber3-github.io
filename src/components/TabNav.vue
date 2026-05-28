<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

defineProps<{ visitUrl?: string }>()

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
  { label: '分享', path: '/shares' },
  { label: '关于', path: '/about' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function go(path: string) {
  router.push(path)
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
         <a
           v-if="visitUrl"
           :href="visitUrl"
           target="_blank"
           rel="noopener noreferrer"
           class="visit-btn interact-fill"
         >
           访问
         </a>

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
  background-color: var(--bg-primary);
  border-color: var(--border-primary);
}

.tab-btn {
  position: relative;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
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

/* ── Visit button: uses .interact-fill from style.css ── */
.visit-btn {
  padding: 0.125rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
}

/* ── Theme toggle ── */
.theme-toggle {
  background: none;
  border: 1px solid var(--border-primary);
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.theme-toggle:hover {
  background-color: var(--bg-secondary);
}

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
