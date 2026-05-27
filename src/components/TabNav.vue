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
          :class="[
            'px-5 py-3 text-sm border-b-2 transition-colors',
            isActive(tab.path)
              ? 'border-green-600 text-green-600 font-medium'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <a
        v-if="visitUrl"
        :href="visitUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="tab-visit border-2 border-green-600 text-green-600 px-4 py-1 text-sm font-medium hover:bg-green-600 hover:text-white transition-colors"
      >
        访问
      </a>
    </div>
  </nav>
</template>
