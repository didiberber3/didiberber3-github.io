<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getNoteList, getCategories } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import ArticleCard from '../components/ArticleCard.vue'
import PageHead from '../components/PageHead.vue'
import { iconForCategory } from '../utils/categoryIcons'

const router = useRouter()

const notes = ref<NoteMeta[]>([])
const allNotes = ref<NoteMeta[]>([])
const categories = ref<string[]>([])
const articleSelected = ref<string | null>(null)
const isSelected = ref<number | null>(null)

function selectCategory(cat: string) {
  router.push(`/docs/${cat}`)
}

onMounted(() => {
  notes.value = getNoteList().slice(0, 5)
  allNotes.value = getNoteList()
  categories.value = getCategories()
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="page-home">

          <!-- 站点标题 -->
          <header class="site-head">
            <h1 class="site-name">小窝</h1>
            <p class="site-tagline">记录学习笔记与技术分享</p>
          </header>

          <!-- 分类网格（原文档页内容，无 header） -->
          <div v-if="categories.length" class="home-cats">
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

          <!-- recent notes -->
          <section class="home-section">
            <PageHead title="最新笔记" :count="notes.length + ' 篇'" />
            <div class="article-list" @mouseleave="articleSelected = null">
              <ArticleCard
                v-for="(note, i) in notes"
                :key="note.slug"
                :note="note"
                :index="i"
                :active="articleSelected === note.slug"
                @select="(slug) => (articleSelected = slug)"
              />
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

/* ── 站点标题 ── */
.site-head {
  margin-bottom: 2rem;
}
.site-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
}
.site-name::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.8;
}
.site-tagline {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* ── 分类网格区 ── */
.home-cats {
  margin-bottom: 3rem;
}

/* ── section ── */
.home-section {
  margin-bottom: 3rem;
}
</style>
