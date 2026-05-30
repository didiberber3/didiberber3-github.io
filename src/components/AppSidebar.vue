<script setup lang="ts">
import type { NoteMeta } from '../utils/content'
import type { TocItem } from '../utils/markdown'
import TOCSidebar from './TOCSidebar.vue'

const props = defineProps<{
  category?: string | null
  categoryNotes?: NoteMeta[]
  currentSlug?: string
  toc?: TocItem[]
}>()

const emit = defineEmits<{
  selectNote: [slug: string]
  close: []
}>()
</script>

<template>
  <button class="sidebar-close-btn" title="关闭侧栏" @click="emit('close')">✕</button>
  <aside class="app-sidebar">
    <!-- Group: Category Nav -->
    <div v-if="category" class="sidebar-group">
      <div class="sidebar-group-label">{{ category }}</div>
      <nav class="sidebar-nav">
        <a
          v-for="note in categoryNotes"
          :key="note.slug"
          href="#"
          :class="['sidebar-nav-item', 'interact-slide-bg', currentSlug === note.slug ? 'list-item-active' : '']"
          @click.prevent="emit('selectNote', note.slug)"
        >
          <span class="sidebar-nav-title">{{ note.title }}</span>
        </a>
      </nav>
    </div>

    <div v-if="category" class="sidebar-separator"></div>

    <!-- Group: Table of Contents -->
    <div v-if="toc && toc.length > 1" class="sidebar-group">
      <div class="sidebar-group-label">目录</div>
      <TOCSidebar :items="toc" />
    </div>

    <div v-if="toc && toc.length > 1" class="sidebar-separator"></div>
  </aside>
</template>
