<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getNote } from '../utils/content'
import type { Note } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import TOCSidebar from '../components/TOCSidebar.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const route = useRoute()
const note = ref<Note | undefined>()
const notFound = ref(false)

function loadNote() {
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = getNote(slug)
  if (found) {
    note.value = found
    notFound.value = false
  } else {
    note.value = undefined
    notFound.value = true
  }
}

function highlightCode() {
  nextTick(() => {
    document.querySelectorAll('.article-content pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement)
    })
  })
}

onMounted(() => {
  loadNote()
  highlightCode()
})

watch(() => route.params.slug, () => {
  loadNote()
  highlightCode()
})
</script>

<template>
  <div class="animate-fade-up">
    <TabNav />

    <div v-if="notFound" class="max-w-4xl mx-auto px-4 text-center text-gray-400 py-16">
      笔记不存在
    </div>

    <div v-if="note" class="max-w-4xl mx-auto px-4 flex gap-8">
      <!-- main content -->
      <article class="flex-1 min-w-0 pb-16">
        <header class="mb-8">
          <h1 class="text-2xl font-bold mb-2">{{ note.title }}</h1>
          <p v-if="note.date" class="text-xs text-gray-400">{{ note.date }}</p>
        </header>

        <div
          class="article-content prose prose-sm max-w-none prose-headings:font-semibold prose-a:text-green-600 prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-50 prose-code:text-sm prose-img:rounded-none"
          v-html="note.html"
        ></div>
      </article>

      <!-- TOC sidebar -->
      <aside class="hidden lg:block w-56 flex-shrink-0">
        <TOCSidebar :items="note.toc" />
      </aside>
    </div>
  </div>
</template>
