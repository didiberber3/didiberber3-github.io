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
          <!-- deco line -->
          <div class="notes-deco" aria-hidden="true">
            <svg viewBox="0 0 200 12" fill="none">
              <line x1="0" y1="6" x2="200" y2="6" stroke="var(--border-primary)" stroke-width="1" stroke-dasharray="4 4" opacity="0.3" />
              <circle cx="40" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
              <circle cx="100" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
              <circle cx="160" cy="6" r="3" fill="var(--accent)" opacity="0.5" />
            </svg>
          </div>

          <!-- header -->
          <div class="notes-header">
            <h1 class="notes-title">笔记</h1>
            <p class="notes-subtitle">共 {{ notes.length }} 篇笔记</p>
          </div>

          <SearchBar
            :placeholder="`搜索 ${notes.length} 篇笔记...`"
            @update:query="query = $event"
          />

          <div v-if="filtered.length === 0" class="text-sm py-16 text-center text-muted">
             没有匹配的内容
          </div>

          <div v-else :key="query" class="article-list">
            <div
              v-for="(note, i) in filtered"
              :key="note.slug"
              class="article-card-wrapper"
              :style="{ '--i': i }"
            >
              <router-link
                :to="`/note/${note.slug}`"
                class="article-card interact-slide-bg"
              >
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
  padding: 3rem 1rem 6rem;
}

/* ── deco line ── */
.notes-deco {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.notes-deco svg {
  width: 200px;
  height: 12px;
}
.notes-deco circle {
  animation: dotPulse 2.4s ease-in-out infinite;
}
.notes-deco circle:nth-child(2) { animation-delay: 0.3s; }
.notes-deco circle:nth-child(3) { animation-delay: 0.6s; }

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.9; }
}

/* ── header ── */
.notes-header {
  text-align: center;
  margin-bottom: 2rem;
}
.notes-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.notes-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* ── article list (matching DocsPage) ── */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-primary);
  box-shadow: var(--shadow-glass);
}
.article-card-wrapper {
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.04s);
}
.article-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1rem;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-decoration: none;
  transition: background 0.2s, backdrop-filter 0.2s;
}
.article-card:hover {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
