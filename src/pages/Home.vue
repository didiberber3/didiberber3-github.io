<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getNoteList } from '../utils/content'
import type { NoteMeta } from '../utils/content'

const notes = ref<NoteMeta[]>([])
const articleSelected = ref<number | null>(null)

onMounted(() => {
  notes.value = getNoteList().slice(0, 5)
})
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="page-home">

          <!-- simple hero -->
          <section class="page-hero">
            <h1 class="page-hero-title">小窝</h1>
            <p class="page-hero-sub">想做自己喜欢的事</p>
          </section>

          <!-- recent notes -->
          <section class="home-section">
            <div class="section-head">
              <h2 class="section-heading">最新笔记</h2>
            </div>
            <div class="section-divider"></div>
            <div class="article-list" @mouseleave="articleSelected = null">
              <div
                v-for="(note, i) in notes"
                :key="note.slug"
                class="article-card-wrapper"
                :class="{ 'is-active': articleSelected === i }"
                :style="{ '--i': i }"
              >
                <router-link
                  :to="`/note/${note.slug}`"
                  class="article-card interact-slide-bg"
                  @mouseenter="articleSelected = i"
                >
                  <div class="article-card-main">
                    <h2 class="article-title">{{ note.title }}</h2>
                  </div>
                  <div class="article-card-meta">
                    <span v-if="note.date" class="article-date">{{ note.date }}</span>
                  </div>
                  <span class="article-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </router-link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-home {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0.5rem 1rem 6rem;
}



/* ── section ── */
.home-section {
  margin-bottom: 3rem;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.section-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  border-left: 3px solid var(--accent);
  padding-left: 0.75rem;
}
.section-divider {
  height: 1px;
  background: var(--accent);
  opacity: 0.15;
  margin-bottom: 1.25rem;
}
</style>
