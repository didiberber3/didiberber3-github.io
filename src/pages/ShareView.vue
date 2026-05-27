<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getShare } from '../utils/content'
import type { Share } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import TOCSidebar from '../components/TOCSidebar.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const route = useRoute()
const share = ref<Share | undefined>()
const notFound = ref(false)

function loadShare() {
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = getShare(slug)
  if (found) {
    share.value = found
    notFound.value = false
  } else {
    share.value = undefined
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
  loadShare()
  highlightCode()
})

watch(() => route.params.slug, () => {
  loadShare()
  highlightCode()
})
</script>

<template>
  <div class="animate-fade-up">
    <TabNav :visit-url="share?.url" />

    <div v-if="notFound" class="max-w-4xl mx-auto px-4 text-center text-gray-400 py-16">
      分享不存在
    </div>

    <div v-if="share" class="max-w-4xl mx-auto px-4 flex gap-8">
      <!-- main content -->
      <article class="flex-1 min-w-0 pb-16">
        <header class="mb-8">
          <h1 class="text-2xl font-bold mb-2">{{ share.title }}</h1>
          <div class="flex items-center gap-2 text-xs text-gray-400">
            <span v-if="share.date">{{ share.date }}</span>
            <span v-if="share.tag" class="border border-gray-300 px-1.5 py-0.5">{{ share.tag }}</span>
          </div>
        </header>

        <div
          class="article-content prose prose-sm max-w-none prose-headings:font-semibold prose-a:text-green-600 prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-50 prose-code:text-sm prose-img:rounded-none"
          v-html="share.html"
        ></div>
      </article>

      <!-- TOC sidebar -->
      <aside class="hidden lg:block w-56 flex-shrink-0">
        <TOCSidebar :items="share.toc" />
      </aside>
    </div>
  </div>
</template>
