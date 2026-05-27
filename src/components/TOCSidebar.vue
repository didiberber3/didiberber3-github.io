<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { TocItem } from '../utils/markdown'

const props = defineProps<{
  items: TocItem[]
}>()

const activeId = ref('')
const observer = ref<IntersectionObserver | null>(null)

function setupObserver() {
  if (observer.value) observer.value.disconnect()

  observer.value = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -50% 0px' }
  )

  nextTick(() => {
    for (const item of props.items) {
      const el = document.getElementById(item.id)
      if (el) observer.value!.observe(el)
    }
  })
}

onMounted(setupObserver)

watch(() => props.items, () => {
  nextTick(setupObserver)
})

onUnmounted(() => {
  observer.value?.disconnect()
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeId.value = id
  }
}
</script>

<template>
  <aside v-if="items.length > 1" class="toc-sidebar">
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">目录</h3>
    <ul class="space-y-1">
      <li
        v-for="item in items"
        :key="item.id"
        :class="['toc-item', item.level === 3 ? 'pl-4' : '', activeId === item.id ? 'active' : '']"
      >
        <a
          href="#"
          @click.prevent="scrollTo(item.id)"
          class="block text-xs text-gray-500 hover:text-green-600 transition-colors py-0.5"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.toc-sidebar {
  position: sticky;
  top: 2rem;
}

.toc-item.active > a {
  @apply text-green-600 font-medium;
}
</style>
