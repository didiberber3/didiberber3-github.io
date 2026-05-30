<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import ScrollProgress from '../components/ScrollProgress.vue'
import SearchBar from '../components/SearchBar.vue'

const notes = ref<NoteMeta[]>([])
const query = ref('')

onMounted(() => {
  notes.value = getNoteList()
})

const filtered = computed(() => {
  if (!query.value.trim()) return notes.value
  const q = query.value.toLowerCase()
  return notes.value.filter((n) => n.title.toLowerCase().includes(q))
})
</script>

<template>
  <ScrollProgress />
  <TabNav />
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-fade-up">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-2xl font-bold mb-6 txt-primary">笔记</h1>

          <SearchBar
            :placeholder="`搜索 ${notes.length} 篇笔记...`"
            @update:query="query = $event"
          />

          <div v-if="filtered.length === 0" class="text-sm py-8 text-center txt-muted">
            没有匹配的内容
          </div>

          <div v-else class="article-list">
            <article v-for="note in filtered" :key="note.slug" class="article-card">
              <router-link :to="`/note/${note.slug}`" class="interact-slide flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <h2 class="article-title text-base font-medium truncate">{{ note.title }}</h2>
                </div>
                <div class="flex-shrink-0 text-right card-meta">
                  <p v-if="note.date" class="text-xs txt-secondary whitespace-nowrap card-meta-date">{{ note.date }}</p>

                </div>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
