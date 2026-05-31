<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote } from '../utils/content'
import type { Note } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { useGlobalLoading } from '../utils/useGlobalLoading'
import { openSidebar } from '../utils/useSidebar'

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
            <div class="flex items-start justify-between gap-2">
            <div>
              <h1 class="text-2xl font-bold mb-2 txt-primary">{{ note.title }}</h1>
              <p v-if="note.date" class="text-xs txt-secondary">{{ note.date }}</p>
            </div>
            <button
              v-if="note.toc && note.toc.length > 1"
              class="sidebar-toggle"
              @click="openSidebar({ toc: note.toc })"
              aria-label="打开目录"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="14" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
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

<style scoped>
.sidebar-toggle {
  background: none;
  border: 1px solid var(--border-primary);
  padding: 0.375rem;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.2s, border-color 0.2s;
}
.sidebar-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
