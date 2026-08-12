<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import ArticleCard from '../components/ArticleCard.vue'
import PageHead from '../components/PageHead.vue'

const route = useRoute()
const router = useRouter()

const allNotes = ref<NoteMeta[]>([])
const articleSelected = ref<string | null>(null)

const category = computed(() => route.params.category as string | undefined)

const categoryNotes = computed(() =>
  category.value ? allNotes.value.filter((n) => n.category === category.value) : []
)

function goHome() {
  router.push('/')
}

onMounted(() => {
  allNotes.value = getNoteList()
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="cat-content">
          <PageHead
            :title="category ?? ''"
            :count="categoryNotes.length + ' 篇'"
            back
            @back="goHome"
          />

          <div v-if="categoryNotes.length === 0" class="text-sm py-16 text-center text-muted">
            该分类暂无文章
          </div>

          <div v-else class="article-list" @mouseleave="articleSelected = null">
            <ArticleCard
              v-for="(n, i) in categoryNotes"
              :key="n.slug"
              :note="n"
              :index="i"
              :active="articleSelected === n.slug"
              @select="(slug) => (articleSelected = slug)"
            />
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

/* ── 分类页内容列 ── */
.cat-content {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
