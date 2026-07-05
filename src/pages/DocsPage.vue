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
const isSelected = ref<number | null>(null)
const articleSelected = ref<number | null>(null)

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

          <div class="edit-grid" @mouseleave="isSelected = null">
            <div
              v-for="(cat, i) in categories"
              :key="cat"
              class="edit-card"
              :class="{ 'is-active': isSelected === i }"
              @mouseenter="isSelected = i"
              @click="selectCategory(cat)"
            >
              <span class="edit-icon" v-html="iconForCategory(cat)"></span>
              <span class="edit-bignum">{{ cat }}</span>
              <span class="edit-body">{{ allNotes.filter(n => n.category === cat).length }}</span>
            </div>
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
        <div class="cat-content">
          <div class="cat-hero">
            <button class="cat-back" @click="goHome" aria-label="返回全部分类">←</button>
            <h1 class="cat-hero-title">{{ category }}</h1>
            <p class="cat-hero-sub">该分类下的文档</p>
            <div class="cat-hero-count"><strong>{{ categoryNotes.length }}</strong><span>篇文档</span></div>
          </div>

          <div v-if="categoryNotes.length === 0" class="text-sm py-16 text-center text-muted">
            该分类暂无文章
          </div>

          <div v-else class="article-list" @mouseleave="articleSelected = null">
            <div
              v-for="(n, i) in categoryNotes"
              :key="n.slug"
              :class="['article-card-wrapper', { 'in': true, 'is-active': articleSelected === i }]"
              :style="{ '--i': i }"
            >
              <router-link
                :to="`/docs/${category}/${n.slug}`"
                class="article-card interact-slide-bg"
                @mouseenter="articleSelected = i"
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
/* DocsPage-specific card meta (column layout) */
.article-card-meta {
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.cat-content {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
