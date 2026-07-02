<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'
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
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="page-notes">
          <!-- header -->
          <section class="page-hero">
            <h1 class="page-hero-title">时间轴</h1>
            <p class="page-hero-sub">按时间浏览全部笔记</p>
            <div class="page-hero-count"><strong>{{ notes.length }}</strong><span>篇</span></div>
          </section>

          <SearchBar
            :placeholder="`搜索 ${notes.length} 篇笔记...`"
            @update:query="query = $event"
          />

          <div v-if="filtered.length === 0" class="text-sm py-16 text-center text-muted">
             没有匹配的内容
          </div>

          <div v-else class="article-list">
            <div
              v-for="(note, i) in filtered"
              :key="note.slug"
              class="article-card-wrapper"
              :style="{ '--i': i }"
            >
              <router-link :to="`/note/${note.slug}`" class="article-card interact-slide-bg">
                <div class="article-card-main">
                  <h2 class="article-title">{{ note.title }}</h2>
                </div>
                <div class="article-card-meta">
                  <span v-if="note.date" class="article-date">{{ note.date }}</span>
                </div>
                <span class="article-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-notes {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1rem 6rem;
}

/* ── article list ── */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.article-card-wrapper {
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.05s);
}
.article-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 2px;
  background: var(--bg-glass);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: var(--shadow-glass);
  text-decoration: none;
  transition: background 0.2s, backdrop-filter 0.2s, box-shadow 0.2s;
}
.article-card:hover {
  background: var(--bg-secondary);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.article-card-main {
  flex: 1;
  min-width: 0;
}
.article-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-card-meta {
  flex-shrink: 0;
}
.article-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}
.article-arrow {
  flex-shrink: 0;
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}
.article-card:hover .article-arrow {
  opacity: 1;
  transform: translateX(0);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
