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
          <div class="page-hero">
            <h1 class="page-hero-title">全部文档</h1>
            <p class="page-hero-sub">选择分类开始阅读</p>
            <div class="page-hero-count"><strong>{{ categories.length }}</strong><span>个分类</span></div>
          </div>

          <div class="docs-category-grid">
            <button
              v-for="(cat, i) in categories"
              :key="cat"
              class="docs-category-card"
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

/* ── category header ── */
.cat-hero{position:relative;padding:3rem 0 2.5rem;text-align:center}
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
.docs-category-grid{display:flex;flex-wrap:wrap;gap:6px}
.docs-category-card{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.5rem;padding:2rem 1rem 1.5rem;background:color-mix(in srgb,var(--bg-primary) 50%,transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:none;border-left:2px solid transparent;cursor:pointer;font-family:inherit;transition:background .2s,backdrop-filter .2s,border-color .2s;animation:cardIn .5s ease both;animation-delay:calc(var(--i,0)*.06s);flex:1 1 180px;min-height:130px}
.docs-category-card:hover{background:color-mix(in srgb,var(--bg-secondary) 50%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left-color:var(--accent)}
@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.cat-icon{display:flex;width:2.25rem;height:2.25rem;color:var(--accent);margin-bottom:.25rem}.cat-icon :deep(svg){width:100%;height:100%;display:block}
.cat-name{font-size:.9375rem;font-weight:600;color:var(--text-primary)}.cat-count{font-size:.75rem;color:var(--text-muted)}

/* ═══════════ ARTICLE LIST ═══════════ */
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
