<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BackToTop from './BackToTop.vue'

const route = useRoute()

const tabs = [
  { label: '首页', path: '/' },
  { label: '关于', path: '/about' },
]

/** 站点默认暗色：仅当用户明确选择过亮色（localStorage 'theme' = 'light'）时用亮色 */
function readDarkPreference(): boolean {
  try {
    return localStorage.getItem('theme') !== 'light'
  } catch {
    return true
  }
}

const isDark = ref(readDarkPreference())
const rotating = ref(false)
let rotateTimer: number | undefined

onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})

onBeforeUnmount(() => {
  if (rotateTimer) window.clearTimeout(rotateTimer)
})

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } catch {
    /* 隐私模式下无法持久化，仅本次会话生效 */
  }
  // 点击旋转 300ms，单次播放
  rotating.value = true
  if (rotateTimer) window.clearTimeout(rotateTimer)
  rotateTimer = window.setTimeout(() => {
    rotating.value = false
  }, 300)
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="nav-bar" aria-label="主导航">
    <div class="nav-inner page-shell">
      <RouterLink to="/" class="brand" aria-label="小窝，返回首页">
        <span class="brand-text">小窝</span>
      </RouterLink>

      <ul class="nav-tabs">
        <li v-for="tab in tabs" :key="tab.path" class="nav-tab">
          <RouterLink
            :to="tab.path"
            class="tab-link"
            :class="{ active: isActive(tab.path) }"
            :aria-current="isActive(tab.path) ? 'page' : undefined"
          >
            {{ tab.label }}
          </RouterLink>
        </li>
      </ul>

      <div class="nav-actions">
        <BackToTop />
        <button
          type="button"
          class="interact-btn-icon theme-toggle"
          :class="{ rotating }"
          :aria-label="isDark ? '切换到亮色主题' : '切换到暗色主题'"
          :title="isDark ? '切换到亮色主题' : '切换到暗色主题'"
          @click="toggleTheme"
        >
          <svg
            v-if="isDark"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  height: var(--nav-h);
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  height: 100%;
  white-space: nowrap;
}

/* ── 品牌 ── */
.brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color var(--dur-fast) var(--ease-out);
}
.brand:hover {
  color: var(--accent);
}

/* ── 导航项：hover 只滑入下划线，不换底色 ── */
.nav-tabs {
  display: flex;
  align-items: stretch;
  gap: var(--space-1);
  height: 100%;
  margin-right: auto;
}

.nav-tab {
  display: flex;
}

.tab-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding-inline: var(--space-3);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1;
}
.tab-link::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-fast) var(--ease-out);
}
.tab-link:hover::after,
.tab-link.active::after {
  transform: scaleX(1);
}
.tab-link.active {
  color: var(--accent);
}

/* ── 右侧动作 ── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

/* 主题切换：点击旋转 300ms，单次播放 */
.theme-toggle.rotating {
  animation: theme-rotate 300ms var(--ease-out);
}
@keyframes theme-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── 响应式：始终单行 ── */
@media (max-width: 640px) {
  .nav-inner {
    gap: var(--space-2);
  }
  .brand {
    font-size: 0.8125rem;
  }
  .tab-link {
    padding-inline: var(--space-2);
    font-size: 0.8125rem;
  }
  .nav-actions {
    gap: var(--space-1);
  }
}

@media (max-width: 480px) {
  .tab-link {
    padding-inline: var(--space-1);
  }
  .brand {
    gap: var(--space-1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand,
  .tab-link::after,
  .theme-toggle.rotating {
    transition: none;
    animation: none;
  }
}
</style>
