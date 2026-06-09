<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes, getNoteList } from '../utils/content'
import type { Note, NoteMeta } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import ArticleContent from '../components/ArticleContent.vue'
import { useGlobalLoading } from '../utils/useGlobalLoading'
import { sidebar } from '../utils/useSidebar'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const { startPage, stopPage } = useGlobalLoading()
const adjacent = ref<{ prev: NoteMeta | null; next: NoteMeta | null }>({ prev: null, next: null })

const sidebarNotes = computed(() => {
  const all = getNoteList()
  if (!note.value) return all
  return all.filter((n) => n.category === note.value!.category)
})

async function load() {
  startPage()
  loading.value = true
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = await loadNote(slug)
  note.value = found
  adjacent.value = getAdjacentNotes(slug)
  loading.value = false
  stopPage()
  if (found?.toc?.length) {
    sidebar.toc = found.toc
  }
  sidebar.currentSlug = slug
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <!-- loading -->
        <div v-if="loading" class="py-16 text-center txt-muted">
          <LoadingDots text="加载中" />
        </div>

        <!-- not found -->
        <div v-else-if="!note" class="py-16 text-center txt-muted">
          笔记不存在
        </div>

        <!-- content -->
        <ArticleContent
          v-else
          :note="note"
          :nav-items="sidebarNotes"
          :nav-link-to="slug => `/note/${slug}`"
          :current-slug="typeof route.params.slug === 'string' ? route.params.slug : ''"
          :category="note.category"
          :adjacent="adjacent"
          :adjacent-link-to="slug => `/note/${slug}`"
        />
      </div>
    </main>
  </div>
</template>
