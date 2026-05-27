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
          一个在学 Java 的人 · 共 {{ notes.length + shares.length }} 篇笔记与分享
        </p>
      </div>

      <!-- recent notes -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-green-600">最新笔记</h2>
          <router-link
            to="/notes"
            class="border-2 border-green-600 text-green-600 px-3 py-0.5 text-xs font-medium hover:bg-green-600 hover:text-white transition-colors"
          >
            全部 {{ getAllNotes().length }} 篇
          </router-link>
        </div>
        <div class="space-y-4">
          <article v-for="note in notes" :key="note.slug" class="border border-gray-200 p-4">
            <h3 class="text-base font-medium mb-1">
              <router-link
                :to="`/note/${note.slug}`"
                class="text-gray-900 hover:text-green-600 transition-colors"
              >
                {{ note.title }}
              </router-link>
            </h3>
            <p v-if="note.date" class="text-xs text-gray-400">{{ note.date }}</p>
          </article>
        </div>
      </section>

      <!-- recent shares -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-green-600">最新分享</h2>
          <router-link
            to="/shares"
            class="border-2 border-green-600 text-green-600 px-3 py-0.5 text-xs font-medium hover:bg-green-600 hover:text-white transition-colors"
          >
            全部 {{ getAllShares().length }} 篇
          </router-link>
        </div>
        <div class="space-y-4">
          <article v-for="share in shares" :key="share.slug" class="border border-gray-200 p-4">
            <h3 class="text-base font-medium mb-1">
              <router-link
                :to="`/share/${share.slug}`"
                class="text-gray-900 hover:text-green-600 transition-colors"
              >
                {{ share.title }}
              </router-link>
            </h3>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <span v-if="share.date">{{ share.date }}</span>
              <span v-if="share.tag" class="border border-gray-300 px-1.5 py-0.5">{{ share.tag }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
