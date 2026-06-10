<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList, getCategories } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import { iconForCategory } from '../utils/categoryIcons'

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])

const category = computed(() => route.params.category as string | undefined)

const categoryNotes = computed(() =>
  category.value ? allNotes.value.filter((n) => n.category === category.value) : []
)

function selectCategory(cat: string) {
  router.push({ params: { category: cat } })
}

function goHome() {
  router.push({ name: 'docs' })
}

onMounted(() => {
  allNotes.value = getNoteList()
  categories.value = getCategories()
})
</script>

<template>
  <!-- Category home grid -->
  <div v-if="!category" class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="categories.length > 0" class="docs-home">
          <div class="docs-hero">
            <svg class="docs-geo" viewBox="0 0 960 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <radialGradient id="gd"><stop offset="0%" stop-color="var(--accent3)" stop-opacity=".14"/><stop offset="60%" stop-color="var(--accent)" stop-opacity=".05"/><stop offset="100%" stop-color="transparent" stop-opacity="0"/></radialGradient>
              </defs>
              <ellipse cx="480" cy="140" rx="200" ry="120" fill="url(#gd)"/>
              <g class="docs-orbit-slow"><ellipse cx="480" cy="140" rx="160" ry="70" fill="none" stroke="var(--accent)" stroke-width=".7" opacity=".35" stroke-dasharray="10 5"/></g>
              <g class="docs-orbit-ccw"><ellipse cx="480" cy="140" rx="120" ry="60" fill="none" stroke="var(--accent2)" stroke-width=".8" opacity=".4" stroke-dasharray="4 8"/></g>
              <g class="docs-orbit-fast"><ellipse cx="480" cy="140" rx="80" ry="40" fill="none" stroke="var(--accent3)" stroke-width="1" opacity=".5"/></g>
              <circle cx="480" cy="140" r="18" fill="var(--accent3)" opacity=".18"/>
              <circle cx="480" cy="140" r="8" fill="var(--accent)" opacity=".5"/>
              <g class="docs-orbit-fast"><circle cx="480" cy="100" r="3" fill="var(--accent3)" opacity=".8"/></g>
              <g class="docs-orbit-ccw"><circle cx="560" cy="140" r="2.5" fill="var(--accent2)" opacity=".6"/></g>
              <g class="docs-orbit-slow"><circle cx="400" cy="140" r="2" fill="var(--accent)" opacity=".5"/></g>
              <line x1="60" y1="10" x2="900" y2="10" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
              <line x1="60" y1="270" x2="900" y2="270" stroke="var(--accent)" stroke-width=".5" opacity=".15" stroke-dasharray="2 10"/>
            </svg>
            <h1 class="docs-hero-title">全部文档</h1>
            <p class="docs-hero-sub">选择分类开始阅读</p>
            <div class="docs-hero-count"><strong>{{ categories.length }}</strong><span>个分类</span></div>
          </div>

          <div class="docs-category-grid">
            <button
              v-for="(cat, i) in categories"
              :key="cat"
              :class="['docs-category-card', 'interact-slide-bg']"
              :style="{ '--i': i }"
              @click="selectCategory(cat)"
            >
              <span class="cat-icon" v-html="iconForCategory(cat)"></span>
              <span class="cat-name">{{ cat }}</span>
              <span class="cat-count">{{ allNotes.filter(n => n.category === cat).length }} 篇</span>
            </button>
          </div>
        </div>

        <div v-else class="docs-home">
          <p class="text-muted">暂无分类</p>
        </div>
      </div>
    </main>
  </div>

  <!-- Category article list -->
  <div v-else class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="max-w-4xl mx-auto px-4">
          <div class="cat-hero">
            <svg class="cat-geo" viewBox="0 0 960 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <radialGradient id="gc"><stop offset="0%" stop-color="var(--accent2)" stop-opacity=".1"/><stop offset="40%" stop-color="var(--accent)" stop-opacity=".05"/><stop offset="100%" stop-color="transparent" stop-opacity="0"/></radialGradient>
              </defs>
              <ellipse cx="480" cy="130" rx="160" ry="100" fill="url(#gc)"/>
              <g class="cat-orbit-cw"><ellipse cx="480" cy="130" rx="90" ry="45" fill="none" stroke="var(--accent)" stroke-width=".8" opacity=".4" stroke-dasharray="8 4"/></g>
              <g class="cat-orbit-ccw"><ellipse cx="480" cy="130" rx="60" ry="30" fill="none" stroke="var(--accent3)" stroke-width=".7" opacity=".5"/></g>
              <circle cx="480" cy="130" r="12" fill="var(--accent)" opacity=".25"/>
              <circle cx="480" cy="130" r="5" fill="var(--accent3)" opacity=".6"/>
              <g class="cat-orbit-cw"><circle cx="480" cy="85" r="3" fill="var(--accent3)" opacity=".7"/></g>
              <g class="cat-orbit-ccw"><circle cx="540" cy="130" r="2" fill="var(--accent2)" opacity=".5"/></g>
            </svg>
            <button class="cat-back" @click="goHome" aria-label="返回全部分类">←</button>
            <h1 class="cat-hero-title">{{ category }}</h1>
            <p class="cat-hero-sub">该分类下的文档</p>
            <div class="cat-hero-count"><strong>{{ categoryNotes.length }}</strong><span>篇文档</span></div>
          </div>

          <div v-if="categoryNotes.length === 0" class="text-sm py-16 text-center text-muted">
            该分类暂无文章
          </div>

          <div v-else class="article-list">
            <div
              v-for="(n, i) in categoryNotes"
              :key="n.slug"
              :class="['article-card-wrapper', { 'in': true }]"
              :style="{ '--i': i }"
            >
              <router-link
                :to="`/docs/${category}/${n.slug}`"
                class="article-card interact-slide-bg"
              >
                <div class="article-card-main">
                  <h2 class="article-title">{{ n.title }}</h2>
                </div>
                <div class="article-card-meta">
                  <span v-if="n.date" class="article-date">{{ n.date }}</span>
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
/* ═══════════ DOCS HOME (category grid) ═══════════ */
.docs-home {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1rem 6rem;
}

/* ── hero ── */
.docs-hero {
  position: relative;
  padding: 5rem 0 3.5rem;
  text-align: center;
}
.docs-geo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  pointer-events: none;
}
@keyframes docw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes doccw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
@keyframes doss{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.docs-orbit-cw{animation:docw 28s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.docs-orbit-ccw{animation:doccw 22s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.docs-orbit-fast{animation:docw 14s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.docs-orbit-slow{animation:doss 50s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.docs-hero-title{font-size:2.75rem;font-weight:800;letter-spacing:-.04em;color:var(--text-primary);line-height:1.15;margin-bottom:1.25rem;position:relative;z-index:1}
.docs-hero-sub{font-size:.9375rem;color:var(--text-secondary);margin-bottom:1.5rem;position:relative;z-index:1}
.docs-hero-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}
.docs-hero-count strong {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.1;
}
.docs-hero-count span {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* ── category header ── */
.cat-hero{position:relative;padding:3rem 0 2.5rem;text-align:center;overflow:hidden}
.cat-geo{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible}
@keyframes catcw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes catccw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
.cat-orbit-cw{animation:catcw 28s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.cat-orbit-ccw{animation:catccw 22s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.cat-back{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin-bottom:1.5rem;border:1px solid var(--border-primary);border-radius:2px;color:var(--text-muted);cursor:pointer;font-size:.875rem;font-family:inherit;line-height:1;background:none;transition:all .25s;position:relative;z-index:1}
.cat-back:hover{color:var(--accent);border-color:var(--accent);box-shadow:0 0 0 1px var(--accent);transform:scale(1.05)}
.cat-hero-title{font-size:2.75rem;font-weight:800;letter-spacing:-.04em;color:var(--text-primary);line-height:1.15;margin-bottom:1.25rem;text-transform:capitalize;position:relative;z-index:1}
.cat-hero-sub{font-size:.9375rem;color:var(--text-secondary);margin-bottom:1.5rem;position:relative;z-index:1}
.cat-hero-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}
.cat-hero-count strong {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.1;
}
.cat-hero-count span {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* ── category cards ── */
.docs-category-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1px;background:var(--border-primary);box-shadow:var(--shadow-glass)}
@media (max-width: 480px){.docs-category-grid{grid-template-columns:1fr}}
.docs-category-card{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:2rem 1.25rem;background:var(--bg-glass);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:none;cursor:pointer;font-family:inherit;transition:background .2s,backdrop-filter .2s;animation:cardIn .5s ease both;animation-delay:calc(var(--i,0)*.06s)}
.docs-category-card:hover{background:var(--bg-secondary);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.cat-icon{display:flex;width:2.25rem;height:2.25rem;color:var(--accent)}.cat-icon :deep(svg){width:100%;height:100%;display:block}
.cat-icon-lg{width:2rem;height:2rem}.cat-name{font-size:1rem;font-weight:600;color:var(--text-primary)}.cat-count{font-size:.75rem;color:var(--text-muted)}

/* ═══════════ ARTICLE LIST ═══════════ */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-primary);
  box-shadow: var(--shadow-glass);
}

.article-card-wrapper {
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.05s);
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

.article-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-card-meta {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.article-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.article-reading {
  font-size: 0.6875rem;
  color: var(--text-muted);
  opacity: 0.7;
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
</style>
