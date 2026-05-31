<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import SearchBar from '../components/SearchBar.vue'
import { openSidebar } from '../utils/useSidebar'

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
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="max-w-4xl mx-auto px-4">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold txt-primary">笔记</h1>
            <button
              class="sidebar-toggle"
              @click="openSidebar({ notes })"
              aria-label="打开侧栏"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="14" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>

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

<style scoped>
.sidebar-toggle {
  background: none;
  border: 1px solid var(--border-primary);
  padding: 0.375rem;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
}
.sidebar-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
