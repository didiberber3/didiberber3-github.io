<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'
import HeroSvg from '../components/HeroSvg.vue'

const notes = ref<NoteMeta[]>([])
const noteTotal = ref(0)

onMounted(() => {
  noteTotal.value = getNoteList().length
  notes.value = getNoteList().slice(0, 3)
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="max-w-4xl mx-auto px-4">
          <!-- intro -->
          <div class="hero-section">
            <div class="hero-svg-wrap">
              <HeroSvg />
            </div>
            <div>
              <h1 class="text-3xl font-bold mb-2 txt-primary">记录与分享</h1>
              <p class="text-sm txt-secondary">
                GitHubPages-学习与记录 · 共 {{ noteTotal }} 篇笔记
              </p>
            </div>
          </div>

          <!-- recent notes -->
          <section class="mb-12">
            <div class="flex items-center justify-between mb-5">
              <h2 class="section-heading">最新笔记</h2>
              <router-link to="/notes" class="btn-more interact-fill">全部 {{ noteTotal }} 篇</router-link>
            </div>
            <div class="article-list">
              <article v-for="note in notes" :key="note.slug" class="article-card">
                <router-link :to="`/note/${note.slug}`" class="interact-slide flex items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <h3 class="article-title text-base font-medium truncate">{{ note.title }}</h3>
                  </div>
                  <div class="flex-shrink-0 text-right card-meta">
                    <p v-if="note.date" class="text-xs txt-secondary whitespace-nowrap card-meta-date">{{ note.date }}</p>

                  </div>
                </router-link>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.hero-svg-wrap {
  flex-shrink: 0;
}
</style>
