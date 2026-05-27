<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAllNotes, getAllShares } from '../utils/content'
import type { Note, Share } from '../utils/content'
import TabNav from '../components/TabNav.vue'

const notes = ref<Note[]>([])
const shares = ref<Share[]>([])

onMounted(() => {
  notes.value = getAllNotes().slice(0, 3)
  shares.value = getAllShares().slice(0, 3)
})
</script>

<template>
  <div class="animate-fade-up">
    <TabNav />

    <div class="max-w-4xl mx-auto px-4">
      <!-- intro -->
      <div class="mb-12">
        <h1 class="text-3xl font-bold mb-2">记录与分享</h1>
        <p class="text-gray-500 text-sm">
          GitHubPages-学习与记录 · 共 {{ getAllNotes().length + getAllShares().length }} 篇笔记与分享
        </p>
      </div>

      <!-- recent notes -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-5">
          <h2 class="section-heading">最新笔记</h2>
          <router-link
            to="/notes"
            class="btn-more"
          >
            全部 {{ getAllNotes().length }} 篇
          </router-link>
        </div>
        <div class="article-list">
          <article v-for="note in notes" :key="note.slug" class="article-card">
            <router-link :to="`/note/${note.slug}`" class="block">
              <h3 class="text-base font-medium text-gray-900">{{ note.title }}</h3>
              <p v-if="note.date" class="text-xs text-gray-400 mt-1">{{ note.date }}</p>
            </router-link>
          </article>
        </div>
      </section>

      <!-- recent shares -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-5">
          <h2 class="section-heading">最新分享</h2>
          <router-link
            to="/shares"
            class="btn-more"
          >
            全部 {{ getAllShares().length }} 篇
          </router-link>
        </div>
        <div class="article-list">
          <article v-for="share in shares" :key="share.slug" class="article-card">
            <router-link :to="`/share/${share.slug}`" class="block">
              <h3 class="text-base font-medium text-gray-900">{{ share.title }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="share.date" class="text-xs text-gray-400">{{ share.date }}</span>
                <span v-if="share.tag" class="tag">{{ share.tag }}</span>
              </div>
            </router-link>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
