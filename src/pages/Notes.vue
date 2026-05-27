<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllNotes } from '../utils/content'
import type { Note } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import SearchBar from '../components/SearchBar.vue'

const notes = ref<Note[]>([])
const query = ref('')

onMounted(() => {
  notes.value = getAllNotes()
})

const filtered = computed(() => {
  if (!query.value.trim()) return notes.value
  const q = query.value.toLowerCase()
  return notes.value.filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="animate-fade-up">
    <TabNav />

    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">笔记</h1>

      <SearchBar
        :placeholder="`搜索 ${notes.length} 篇笔记...`"
        @update:query="query = $event"
      />

      <div v-if="filtered.length === 0" class="text-gray-400 text-sm py-8 text-center">
        没有匹配的内容
      </div>

      <div class="space-y-4">
        <article v-for="note in filtered" :key="note.slug" class="border border-gray-200 p-4">
          <h2 class="text-base font-medium mb-1">
            <router-link
              :to="`/note/${note.slug}`"
              class="text-gray-900 hover:text-green-600 transition-colors"
            >
              {{ note.title }}
            </router-link>
          </h2>
          <p v-if="note.date" class="text-xs text-gray-400">{{ note.date }}</p>
        </article>
      </div>
    </div>
  </div>
</template>
