<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { loadShare } from '../utils/content'
import type { Share } from '../utils/content'
import TabNav from '../components/TabNav.vue'
import TOCSidebar from '../components/TOCSidebar.vue'
import LoadingDots from '../components/LoadingDots.vue'
import ScrollProgress from '../components/ScrollProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import { highlightBlocks } from '../utils/highlight'
import { addCopyButtons, setupLightbox } from '../utils/reader'

const route = useRoute()
const share = ref<Share | undefined>()
const loading = ref(true)
const contentRef = ref<HTMLElement | null>(null)
let cleanupLightbox: (() => void) | null = null

async function load() {
  loading.value = true
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = await loadShare(slug)
  share.value = found
  loading.value = false

  nextTick(() => {
    highlightBlocks()
    if (contentRef.value) {
      addCopyButtons(contentRef.value)
      cleanupLightbox?.()
      cleanupLightbox = setupLightbox(contentRef.value)
    }
  })
}

onMounted(load)
watch(() => route.params.slug, load)
onUnmounted(() => cleanupLightbox?.())
</script>

<template>
  <ScrollProgress />
  <div class="animate-fade-up">
    <TabNav :visit-url="share?.url" />

    <!-- loading -->
    <div v-if="loading" class="max-w-6xl mx-auto px-4 py-16 text-center txt-muted">
      <LoadingDots text="加载中" />
    </div>

    <!-- not found -->
    <div v-else-if="!share" class="max-w-6xl mx-auto px-4 py-16 text-center txt-muted">
      分享不存在
    </div>

    <!-- content -->
    <div v-else class="max-w-6xl mx-auto px-4 flex gap-0">
      <!-- TOC sidebar — left (only when enough headings) -->
      <aside v-if="share.toc.length > 1" class="hidden lg:block w-72 flex-shrink-0">
        <TOCSidebar :items="share.toc" />
      </aside>

      <!-- main content — constrained width -->
      <article class="flex-1 min-w-0 max-w-[780px] mx-auto pb-16 px-6 lg:px-10">
        <header class="mb-10">
          <h1 class="text-2xl font-bold mb-2 txt-primary">{{ share.title }}</h1>
          <div class="flex items-center gap-2 text-xs txt-secondary">
            <span v-if="share.date">{{ share.date }}</span>
            <span v-if="share.tag" class="tag">{{ share.tag }}</span>
          </div>
        </header>

        <div
          ref="contentRef"
          class="article-content prose prose-sm max-w-none prose-headings:font-semibold"
          v-html="share.html"
        ></div>
      </article>
    </div>
  </div>
  <BackToTop />
</template>
