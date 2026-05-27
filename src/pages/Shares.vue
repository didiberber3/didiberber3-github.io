<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllShares } from '../utils/content'
import type { Share } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import SearchBar from '../components/SearchBar.vue'

const shares = ref<Share[]>([])
const query = ref('')

onMounted(() => {
  shares.value = getAllShares()
})

const filtered = computed(() => {
  if (!query.value.trim()) return shares.value
  const q = query.value.toLowerCase()
  return shares.value.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.tag.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="animate-fade-up">
    <TabNav />

    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">分享</h1>

      <SearchBar
        :placeholder="`搜索 ${shares.length} 篇分享...`"
        @update:query="query = $event"
      />

      <div v-if="filtered.length === 0" class="text-gray-400 text-sm py-8 text-center">
        没有匹配的内容
      </div>

      <div class="space-y-4">
        <article v-for="share in filtered" :key="share.slug" class="border border-gray-200 p-4">
          <h2 class="text-base font-medium mb-1">
            <router-link
              :to="`/share/${share.slug}`"
              class="text-gray-900 hover:text-green-600 transition-colors"
            >
              {{ share.title }}
            </router-link>
          </h2>
          <div class="flex items-center gap-2 text-xs text-gray-400">
            <span v-if="share.date">{{ share.date }}</span>
            <span v-if="share.tag" class="border border-gray-300 px-1.5 py-0.5">{{ share.tag }}</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
