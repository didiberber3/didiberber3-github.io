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
          <section class="notes-hero">
            <svg class="notes-geo" viewBox="0 0 960 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <radialGradient id="gn1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".14"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></radialGradient>
              </defs>
              <ellipse cx="480" cy="140" rx="160" ry="110" fill="url(#gn1)"/>
              <g class="notes-orbit-cw"><ellipse cx="480" cy="140" rx="90" ry="45" fill="none" stroke="var(--accent)" stroke-width=".8" opacity=".45" stroke-dasharray="6 4"/></g>
              <g class="notes-orbit-ccw"><ellipse cx="480" cy="140" rx="70" ry="55" fill="none" stroke="var(--accent2)" stroke-width=".6" opacity=".35" stroke-dasharray="4 6"/></g>
              <g class="notes-orbit-fast"><circle cx="480" cy="140" r="60" fill="none" stroke="var(--accent3)" stroke-width=".6" opacity=".35" stroke-dasharray="2 8"/></g>
              <circle cx="480" cy="140" r="16" fill="var(--accent)" opacity=".22"/>
              <circle cx="480" cy="140" r="8" fill="var(--accent)" opacity=".45"/>
              <g class="notes-orbit-cw"><circle cx="480" cy="95" r="3.5" fill="var(--accent3)" opacity=".7"/></g>
              <g class="notes-orbit-ccw"><circle cx="550" cy="140" r="3" fill="var(--accent2)" opacity=".6"/></g>
              <g class="notes-orbit-fast"><circle cx="410" cy="140" r="2.5" fill="var(--accent)" opacity=".5"/></g>
              <line x1="60" y1="10" x2="900" y2="10" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
              <line x1="60" y1="270" x2="900" y2="270" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
            </svg>
            <h1 class="notes-hero-title">时间轴</h1>
            <p class="notes-hero-sub">按时间浏览全部笔记</p>
            <div class="notes-hero-count"><strong>{{ notes.length }}</strong><span>篇</span></div>
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

/* ── hero ── */
.notes-hero {
  position: relative;
  padding: 5rem 0 3.5rem;
  text-align: center;
}
.notes-geo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  pointer-events: none;
}
@keyframes nocw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes noccw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
.notes-orbit-cw{animation:nocw 28s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.notes-orbit-ccw{animation:noccw 22s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.notes-orbit-fast{animation:nocw 14s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.notes-hero-title{font-size:2.75rem;font-weight:800;letter-spacing:-.04em;color:var(--text-primary);line-height:1.15;margin-bottom:1.25rem;position:relative;z-index:1}
.notes-hero-sub{font-size:.9375rem;color:var(--text-secondary);margin-bottom:1.5rem;position:relative;z-index:1}
.notes-hero-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}
.notes-hero-count strong {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.1;
}
.notes-hero-count span {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* ── article list ── */
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
