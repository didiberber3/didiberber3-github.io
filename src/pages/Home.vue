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

          <!-- 顶部留白（占位保持高度不变） -->
          <header class="site-head" aria-hidden="true"></header>

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

/* ── 顶部留白占位（高度保持原站点标题区，不显示内容）── */
.site-head {
  height: 6.3rem;
  margin-bottom: 2rem;
}

/* ── 分类网格区 ── */
.home-cats {
  margin-bottom: 5rem;
}

/* ── section ── */
.home-section {
  margin-bottom: 3rem;
}
</style>
