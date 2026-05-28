<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getShareList } from '../utils/content'
import type { ShareMeta } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import SearchBar from '../components/SearchBar.vue'

const shares = ref<ShareMeta[]>([])
const query = ref('')

onMounted(() => {
  shares.value = getShareList()
})

const filtered = computed(() => {
  if (!query.value.trim()) return shares.value
  const q = query.value.toLowerCase()
  return shares.value.filter(
    (s) => s.title.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="animate-fade-up">
    <TabNav />

    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6 txt-primary">分享</h1>

      <SearchBar
        :placeholder="`搜索 ${shares.length} 篇分享...`"
        @update:query="query = $event"
      />

      <div v-if="filtered.length === 0" class="text-sm py-8 text-center txt-muted">
        没有匹配的内容
      </div>

      <div v-else class="article-list">
        <article v-for="share in filtered" :key="share.slug" class="article-card">
          <router-link :to="`/share/${share.slug}`" class="interact-slide">
            <h2 class="article-title text-base font-medium">{{ share.title }}</h2>
            <div class="flex items-center gap-2 mt-1">
              <span v-if="share.date" class="text-xs txt-secondary">{{ share.date }}</span>
              <span v-if="share.tag" class="tag">{{ share.tag }}</span>
            </div>
          </router-link>
        </article>
      </div>
    </div>
  </div>
</template>
