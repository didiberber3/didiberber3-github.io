<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes, getNoteList } from '../utils/content'
import type { Note, NoteMeta } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import ArticleContent from '../components/ArticleContent.vue'
import { useGlobalLoading } from '../utils/useGlobalLoading'
import { setSidebarToc, setSidebarCurrentSlug } from '../utils/useSidebar'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const { startPage, stopPage } = useGlobalLoading()
const adjacent = ref<{ prev: NoteMeta | null; next: NoteMeta | null }>({ prev: null, next: null })

const isDocs = computed(() => route.path.startsWith('/docs/'))

const navPrefix = computed(() => {
  if (isDocs.value && note.value) {
    return `/docs/${note.value.category}/`
  }
  return '/note/'
})

const slug = computed(() =>
  (route.params.slug as string) || ''
)

const sidebarNotes = computed(() => {
  const all = getNoteList()
  if (!note.value) return all
  return all.filter((n) => n.category === note.value!.category)
})

async function load() {
  startPage()
  loading.value = true
  const s = slug.value
  const found = await loadNote(s)
  note.value = found
  adjacent.value = getAdjacentNotes(s)
  loading.value = false
  stopPage()
  if (found?.toc?.length) {
    setSidebarToc(found.toc)
  }
  setSidebarCurrentSlug(s)
}

onMounted(load)
watch(slug, load)
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="loading" class="py-16 text-center text-muted">
          <LoadingDots text="加载中" />
        </div>

        <div v-else-if="!note" class="py-16 text-center text-muted">
          笔记不存在
        </div>

        <ArticleContent
          v-else
          :note="note"
          :nav-items="sidebarNotes"
          :nav-link-to="s => navPrefix + s"
          :current-slug="slug"
          :category="note.category"
          :adjacent="adjacent"
          :adjacent-link-to="s => `/note/${s}`"
        />
      </div>
    </main>
  </div>
</template>
