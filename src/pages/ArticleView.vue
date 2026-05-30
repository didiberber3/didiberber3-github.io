<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote } from '../utils/content'
import type { Note } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import LoadingDots from '../components/LoadingDots.vue'
import ScrollProgress from '../components/ScrollProgress.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { useGlobalLoading } from '../utils/useGlobalLoading'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const { contentRef, renderContent } = useContentRenderer()
const { startPage, stopPage } = useGlobalLoading()

async function load() {
  startPage()
  loading.value = true
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = await loadNote(slug)
  note.value = found
  loading.value = false
  stopPage()
  renderContent()
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <ScrollProgress />
  <TabNav />
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-fade-up">
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
            <p v-if="note.date" class="text-xs txt-secondary">{{ note.date }}</p>
          </header>

          <div
            ref="contentRef"
            class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
            v-html="note.html"
          ></div>
        </article>
      </div>
    </main>
  </div>
</template>
