<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'

const notes = ref<NoteMeta[]>([])

onMounted(() => {
  notes.value = getNoteList().slice(0, 5)
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="page-home">

          <!-- simple hero -->
          <section class="page-hero">
            <h1 class="page-hero-title">小窝</h1>
            <p class="page-hero-sub">想做自己喜欢的事</p>
          </section>

          <!-- recent notes -->
          <section class="home-section">
            <div class="section-head">
              <h2 class="section-heading">最新笔记</h2>
            </div>
            <div class="section-divider"></div>
            <div class="article-list">
              <div
                v-for="(note, i) in notes"
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
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-home {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0.5rem 1rem 6rem;
}



/* ── section ── */
.home-section {
  margin-bottom: 3rem;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.section-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  border-left: 3px solid var(--accent);
  padding-left: 0.75rem;
}
.section-divider {
  height: 1px;
  background: var(--accent);
  opacity: 0.15;
  margin-bottom: 1.25rem;
}

/* ── article list (matching DocsPage) ── */
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
  background: color-mix(in srgb, var(--bg-primary) 50%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: var(--shadow-glass);
  text-decoration: none;
  transition: background 0.2s, backdrop-filter 0.2s, box-shadow 0.2s;
}
.article-card:hover {
  background: color-mix(in srgb, var(--bg-secondary) 50%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
