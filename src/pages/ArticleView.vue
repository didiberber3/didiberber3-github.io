<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes, getNoteList } from '../utils/content'
import type { Note, NoteMeta } from '../utils/content'
import ArticleContent from '../components/ArticleContent.vue'
import ArticleToc from '../components/ArticleToc.vue'
import { usePageTitle } from '../utils/usePageTitle'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const adjacent = ref<{ prev: NoteMeta | null; next: NoteMeta | null }>({ prev: null, next: null })

usePageTitle(() => note.value?.title ?? '文章')

const slug = computed(() => (route.params.slug as string) || '')

/** 同类文章：用于文末「相关文章」 */
const relatedNotes = computed(() => {
  const all = getNoteList()
  if (!note.value) return []
  return all.filter((n) => n.category === note.value!.category && n.slug !== note.value!.slug)
})

const hasToc = computed(() => (note.value?.toc.length ?? 0) > 0)

async function load() {
  loading.value = true
  const s = slug.value
  const found = await loadNote(s)
  // 快速切换文章时丢弃过期结果，避免旧请求覆盖新文章
  if (slug.value !== s) return
  note.value = found
  adjacent.value = getAdjacentNotes(s)
  loading.value = false
}
onMounted(load)
watch(slug, load)
</script>

<template>
  <div class="page-shell">
    <div class="page-content">
      <div class="article-layout" :class="{ 'has-toc': hasToc }">
        <div class="article-main">
          <div class="animate-reveal">
            <!-- 加载态：骨架屏（标题条 + 元信息条 + 正文灰条），不用全屏转圈 -->
            <div
              v-if="loading"
              class="article-skeleton"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <span class="visually-hidden">正在载入文章</span>
              <div class="sk sk-title" aria-hidden="true"></div>
              <div class="sk sk-meta" aria-hidden="true"></div>
              <div class="sk-lines" aria-hidden="true">
                <div class="sk sk-line"></div>
                <div class="sk sk-line"></div>
                <div class="sk sk-line"></div>
                <div class="sk sk-line"></div>
                <div class="sk sk-line"></div>
              </div>
            </div>

            <div v-else-if="!note" class="article-empty">
              <p class="article-empty-text text-muted">笔记不存在</p>
              <router-link class="article-empty-link" to="/">返回首页</router-link>
            </div>

            <ArticleContent
              v-else
              :note="note"
              :nav-items="relatedNotes"
              :nav-link-to="(s) => `/note/${s}`"
              :current-slug="slug"
              :category="note.category"
              :adjacent="adjacent"
              :adjacent-link-to="(s) => `/note/${s}`"
            />
          </div>
        </div>

        <!-- 宽屏常驻目录；窄屏由组件内的「目录」按钮 + 底部抽屉接管 -->
        <ArticleToc v-if="hasToc" :items="note?.toc ?? []" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-layout {
  max-width: var(--reading);
  margin-inline: auto;
}

.article-layout.has-toc {
  display: grid;
  grid-template-columns: minmax(0, var(--reading)) var(--toc-width);
  column-gap: clamp(var(--space-5), 4vw, var(--space-8));
  justify-content: center;
  align-items: start;
  max-width: none;
}

.article-main {
  min-width: 0;
}

@media (max-width: 1099px) {
  .article-layout.has-toc {
    display: block;
    max-width: var(--reading);
    margin-inline: auto;
  }
}

/* ── 骨架屏 ── */
.article-skeleton {
  padding-top: var(--space-5);
}
.sk {
  background: var(--bg-secondary);
  animation: sk-pulse 1.6s var(--ease-in-out) infinite;
}
.sk-title {
  width: 64%;
  height: var(--space-6);
  margin-bottom: var(--space-4);
}
.sk-meta {
  width: 34%;
  height: var(--space-2);
  margin-bottom: var(--space-7);
}
.sk-lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.sk-line {
  height: var(--space-3);
}
.sk-line:nth-child(1) {
  width: 100%;
}
.sk-line:nth-child(2) {
  width: 96%;
}
.sk-line:nth-child(3) {
  width: 88%;
}
.sk-line:nth-child(4) {
  width: 72%;
}
.sk-line:nth-child(5) {
  width: 46%;
}

@keyframes sk-pulse {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.85;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sk {
    animation: none;
    opacity: 0.6;
  }
}

/* ── 文章不存在 ── */
.article-empty {
  padding-block: var(--space-8);
}
.article-empty-text {
  font-size: var(--text-md);
  margin-bottom: var(--space-3);
}
.article-empty-link {
  font-size: var(--text-sm);
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.article-empty-link:hover {
  text-decoration-thickness: 2px;
}

@media (max-width: 768px) {
  .article-skeleton {
    padding-top: var(--space-4);
  }
}

@media (max-width: 480px) {
  .sk-title {
    width: 82%;
    height: var(--space-5);
  }
  .sk-meta {
    width: 52%;
  }
}
</style>
