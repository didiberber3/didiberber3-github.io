<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes } from '../utils/content'
import type { Note, NoteMeta } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { useGlobalLoading } from '../utils/useGlobalLoading'
import { sidebar } from '../utils/useSidebar'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const { contentRef, renderContent } = useContentRenderer()
const { startPage, stopPage } = useGlobalLoading()
const adjacent = ref<{ prev: NoteMeta | null; next: NoteMeta | null }>({ prev: null, next: null })

async function load() {
  startPage()
  loading.value = true
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = await loadNote(slug)
  note.value = found
  adjacent.value = getAdjacentNotes(slug)
  loading.value = false
  stopPage()
  renderContent()
  if (found?.toc?.length) {
    sidebar.toc = found.toc
  }
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
        <article v-else class="max-w-3xl mx-auto">
          <header class="mb-10">
            <h1 class="text-2xl font-bold mb-2 txt-primary">{{ note.title }}</h1>
            <p class="text-xs txt-secondary">{{ note.date }} · {{ note.readingTime }} 分钟 · 约 {{ note.charCount }} 字</p>
          </header>

          <div
            ref="contentRef"
            class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
            v-html="note.html"
          ></div>

          <!-- prev/next navigation -->
          <nav class="flex items-center justify-between mt-16 pt-8 border-t" style="border-color: var(--border-primary)">
            <router-link
              v-if="adjacent.prev"
              :to="`/note/${adjacent.prev.slug}`"
              class="interact-slide-bg inline-flex items-center gap-1 text-sm px-3 py-2"
            >
              ← {{ adjacent.prev.title }}
            </router-link>
            <div v-else />
            <router-link
              v-if="adjacent.next"
              :to="`/note/${adjacent.next.slug}`"
              class="interact-slide-bg inline-flex items-center gap-1 text-sm px-3 py-2"
            >
              {{ adjacent.next.title }} →
            </router-link>
          </nav>
        </article>
      </div>
    </main>
  </div>
</template>

