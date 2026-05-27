<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  visitUrl?: string
}>()

const route = useRoute()
const router = useRouter()

const tabs = [
  { label: '首页', path: '/' },
  { label: '笔记', path: '/notes' },
  { label: '分享', path: '/shares' },
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
  <nav class="border-b border-gray-200 mb-8">
    <div class="flex items-center justify-between max-w-4xl mx-auto px-4">
      <div class="flex">
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

      <a
        v-if="visitUrl"
        :href="visitUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="border-2 border-green-600 text-green-600 px-4 py-1 text-sm font-medium hover:bg-green-600 hover:text-white transition-colors"
      >
        访问
      </a>
    </div>
  </nav>
</template>

<style scoped>
.tab-btn {
  position: relative;
  overflow: hidden;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  color: #16a34a;
  font-weight: 500;
}

/* left-to-right underline fill */
.tab-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #16a34a;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease-out;
}

.tab-btn.active::after {
  transform: scaleX(1);
}
</style>
