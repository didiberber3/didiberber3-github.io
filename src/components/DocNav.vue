<script setup lang="ts">
import { watch, nextTick } from 'vue'
import type { NoteMeta } from '../utils/content'

const props = defineProps<{
  notes: NoteMeta[]
  currentSlug?: string
}>()

const emit = defineEmits<{
  selectNote: [slug: string]
}>()

watch(
  () => props.currentSlug,
  () => {
    nextTick(() => {
      const el = document.querySelector('.doc-nav-item.list-item-active')
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }
)
</script>

<template>
  <nav class="doc-nav">
    <a
      v-for="n in notes"
      :key="n.slug"
      href="#"
      :class="['doc-nav-item', 'interact-slide-bg', n.slug === currentSlug ? 'list-item-active' : '']"
      @click.prevent="emit('selectNote', n.slug)"
    >
      <span class="doc-nav-title">{{ n.title }}</span>
    </a>
  </nav>
</template>

<style scoped>
.doc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.doc-nav-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.45rem 0.5rem;
  text-decoration: none;
  cursor: pointer;
  color: var(--text-primary);
  scroll-margin: 0.5rem;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
}

.doc-nav-item:hover {
  background-color: var(--accent-bg);
}

.doc-nav-item.list-item-active {
  background-color: var(--bg-secondary);
}

.doc-nav-title {
  font-size: 0.8125rem;
  color: inherit;
  line-height: 1.4;
}

.doc-nav-item.list-item-active .doc-nav-title {
  font-weight: 500;
}
</style>
