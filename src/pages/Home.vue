<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getNoteList, getCategories } from '../utils/content'
import type { NoteMeta } from '../utils/content'

const notes = ref<NoteMeta[]>([])
const noteTotal = ref(0)
const categories = ref<string[]>([])

onMounted(() => {
  noteTotal.value = getNoteList().length
  notes.value = getNoteList().slice(0, 5)
  categories.value = getCategories()
})

const totalWords = computed(() => {
  const list = getNoteList()
  const total = list.reduce((sum, n) => sum + (n.charCount || 0), 0)
  if (total >= 10000) return `${(total / 10000).toFixed(1)}w`
  if (total >= 1000) return `${(total / 1000).toFixed(1)}k`
  return String(total)
})

const latestDate = computed(() => {
  const list = getNoteList()
  if (!list.length) return '--'
  return list[0].date?.slice(5) || '--'
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="page-home">
          <!-- hero -->
          <section class="hero-home">
            <svg class="hero-geo" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <radialGradient id="gh1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".18"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></radialGradient>
                <radialGradient id="gh2"><stop offset="0%" stop-color="var(--accent2)" stop-opacity=".1"/><stop offset="100%" stop-color="var(--accent2)" stop-opacity="0"/></radialGradient>
                <linearGradient id="mgh" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="var(--accent3)" stop-opacity="0"/><stop offset="40%" stop-color="var(--accent3)" stop-opacity=".6"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient>
              </defs>
              <ellipse cx="480" cy="180" rx="180" ry="120" fill="url(#gh1)"/>
              <ellipse cx="200" cy="330" rx="100" ry="60" fill="url(#gh2)"/>
              <circle cx="480" cy="180" r="48" fill="var(--accent)" opacity=".08"/>
              <circle cx="480" cy="180" r="36" fill="none" stroke="var(--accent)" stroke-width="1.5" opacity=".4"/>
              <circle cx="480" cy="180" r="8" fill="var(--accent)" opacity=".35"/>
              <circle cx="480" cy="180" r="3" fill="var(--accent3)" opacity=".6"/>
              <g class="home-orbit-cw"><ellipse cx="480" cy="180" rx="140" ry="40" fill="none" stroke="var(--accent)" stroke-width=".8" opacity=".4" stroke-dasharray="8 4"/></g>
              <g class="home-orbit-ccw"><ellipse cx="480" cy="180" rx="100" ry="70" fill="none" stroke="var(--accent2)" stroke-width=".6" opacity=".35" stroke-dasharray="3 6"/></g>
              <g class="home-orbit-fast"><circle cx="480" cy="180" r="100" fill="none" stroke="var(--accent3)" stroke-width=".7" opacity=".3" stroke-dasharray="2 8"/></g>
              <g class="home-orbit-cw"><circle cx="480" cy="50" r="4" fill="var(--accent3)" opacity=".8"/></g>
              <g class="home-orbit-cw"><circle cx="610" cy="180" r="3" fill="var(--accent2)" opacity=".7"/></g>
              <g class="home-orbit-cw"><circle cx="480" cy="310" r="2.5" fill="var(--accent)" opacity=".6"/></g>
              <g class="home-orbit-fast-ccw"><circle cx="380" cy="180" r="2.5" fill="var(--accent)" opacity=".6"/></g>
              <line x1="0" y1="130" x2="160" y2="150" stroke="url(#mgh)" stroke-width="1.5" class="home-meteor"/>
              <line x1="0" y1="280" x2="140" y2="295" stroke="url(#mgh)" stroke-width="1" class="home-meteor home-meteor-d2"/>
              <line x1="40" y1="470" x2="920" y2="470" stroke="var(--accent)" stroke-width=".6" opacity=".2" stroke-dasharray="2 12"/>
            </svg>
            <div class="hero-overlay">
              <h1 class="hero-home-title">记录与分享</h1>
              <div class="hero-home-line"></div>
              <p class="hero-home-sub">学习 · 记录 · 成长</p>
              <div class="hero-home-stats">
                <div class="hero-stat"><strong>{{ noteTotal }}</strong><span>篇笔记</span></div>
                <div class="hero-stat"><strong>{{ categories.length }}</strong><span>个分类</span></div>
              </div>
            </div>
          </section>

          <!-- intro card -->
          <div class="home-card">
            <div class="home-card-top">
              <div class="home-card-avatar">
                <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="var(--accent)" stroke-width="1.5"/><circle cx="20" cy="15" r="6" fill="var(--accent)" opacity=".3"/><ellipse cx="20" cy="34" rx="10" ry="6" fill="var(--accent)" opacity=".2"/></svg>
              </div>
              <div class="home-card-text">
                <p>个人技术博客 — 记录学习过程中的笔记、项目经验和思考。</p>
                <div class="home-card-tags">
                  <span>Java</span><span>Vue</span><span>Spring</span><span>前端</span>
                </div>
              </div>
            </div>
            <div class="home-card-div"></div>
            <div class="home-card-stats">
              <div class="hcs-item"><strong>{{ noteTotal }}</strong><span>篇文章</span></div>
              <div class="hcs-item"><strong>{{ categories.length }}</strong><span>个分类</span></div>
              <div class="hcs-item"><strong>{{ totalWords }}</strong><span>字</span></div>
              <div class="hcs-item"><strong>{{ latestDate }}</strong><span>最新</span></div>
            </div>
          </div>

          <!-- recent notes -->
          <section class="home-section">
            <div class="section-head">
              <h2 class="section-heading">最新笔记</h2>
              <router-link to="/notes" class="section-more">全部 {{ noteTotal }} 篇 →</router-link>
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
  padding: 2rem 1rem 6rem;
}

/* ── hero ── */
.hero-home {
  position: relative;
  aspect-ratio: 960 / 500;
  text-align: center;
  margin-bottom: 3rem;
}
.hero-geo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
@keyframes ocw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes occw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
@keyframes hmeteor{0%{transform:translate(-100px,0);opacity:1}70%{opacity:.8}100%{transform:translate(1060px,60px);opacity:0}}
.home-orbit-cw{animation:ocw 28s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.home-orbit-ccw{animation:occw 22s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.home-orbit-fast{animation:ocw 14s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.home-orbit-fast-ccw{animation:occw 16s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.home-meteor{animation:hmeteor 8s linear infinite}
.home-meteor-d2{animation-delay:4s}
.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}
.hero-home-title{font-size:2.75rem;font-weight:800;letter-spacing:-.04em;color:var(--text-primary);line-height:1.1;margin-bottom:.75rem}
.hero-home-line{width:64px;height:3px;background:linear-gradient(90deg,transparent,var(--accent),transparent);margin:.75rem auto 1rem}
.hero-home-sub{font-size:1rem;color:var(--text-secondary);margin-bottom:.5rem}
.hero-home-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-stat strong {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.1;
}
.hero-stat span {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
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
.section-more {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  white-space: nowrap;
  transition: color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.15s;
}
.section-more:hover {
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
.section-more:active {
  transform: scale(0.97);
}
.section-divider {
  height: 1px;
  background: var(--accent);
  opacity: 0.15;
  margin-bottom: 1.25rem;
}

/* ── intro card ── */
.home-card {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  box-shadow: var(--shadow-glass);
  margin-bottom: 2.5rem;
  overflow: hidden;
}
.home-card-top {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  align-items: flex-start;
}
.home-card-avatar {
  width: 40px; height: 40px; flex-shrink: 0;
}
.home-card-text { flex: 1; min-width: 0; }
.home-card-text p {
  font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.625rem; line-height: 1.5;
}
.home-card-tags {
  display: flex; flex-wrap: wrap; gap: 0.375rem;
}
.home-card-tags span {
  font-size: 0.625rem; font-weight: 500; color: var(--text-muted);
  padding: 0.125rem 0.5rem; border: 1px solid var(--border-primary); border-radius: 2px;
}
.home-card-div {
  height: 1px; background: var(--border-primary);
  margin: 0 1rem;
}
.home-card-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.75rem 0.5rem;
}
.hcs-item {
  display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
}
.hcs-item strong {
  font-size: 1.125rem; font-weight: 700; color: var(--accent); line-height: 1.1;
}
.hcs-item span {
  font-size: 0.625rem; color: var(--text-muted);
}

/* ── section more button ── */
.section-more {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  white-space: nowrap;
  background: var(--bg-glass);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.15s;
}
.section-more:hover {
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
.section-more:active { transform: scale(0.97); }

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
  animation-delay: calc(var(--i, 0) * 0.08s);
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
