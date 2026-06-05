<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes, getNoteList } from '../utils/content'
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

const sidebarNotes = computed(() => {
  const all = getNoteList()
  if (!note.value) return all
  return all.filter((n) => n.category === note.value!.category)
})
const activeTab = ref<'nav' | 'toc'>('nav')

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

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
        <article v-else class="article-with-aside">
          <div class="article-main">
            <div class="article-body">
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
            </div>

            <aside class="article-aside">
              <div class="aside-tabs">
                <button
                  :class="['aside-tab', { active: activeTab === 'nav' }]"
                  @click="activeTab = 'nav'"
                >文章导航</button>
                <button
                  :class="['aside-tab', { active: activeTab === 'toc' }]"
                  @click="activeTab = 'toc'"
                >文章目录</button>
              </div>

              <nav v-show="activeTab === 'nav'" class="aside-body aside-nav-list">
                <div v-if="note?.category" class="label-uppercase px-3 pt-2 pb-1">{{ note.category }}</div>
                <router-link
                  v-for="n in sidebarNotes"
                  :key="n.slug"
                  :to="`/note/${n.slug}`"
                  :class="['aside-nav-item', { active: n.slug === (typeof route.params.slug === 'string' ? route.params.slug : '') }]"
                >
                  <span class="aside-nav-title">{{ n.title }}</span>
                  <span class="aside-nav-date">{{ n.date }}</span>
                </router-link>
              </nav>

              <nav v-show="activeTab === 'toc'" class="aside-body aside-toc-list">
                <a
                  v-for="item in note?.toc || []"
                  :key="item.id"
                  href="#"
                  @click.prevent="scrollToHeading(item.id)"
                  :class="['aside-toc-item']"
                  :style="{ paddingLeft: (item.level - 2) * 14 + 12 + 'px' }"
                >{{ item.text }}</a>
                <div v-if="!note?.toc?.length" class="aside-empty txt-muted">暂无目录</div>
              </nav>
            </aside>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>

