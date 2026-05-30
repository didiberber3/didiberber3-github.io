<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { TocItem, TocGroup } from '../utils/markdown'
import { groupTocItems } from '../utils/markdown'

const props = defineProps<{
  items: TocItem[]
}>()

const groups = computed<TocGroup[]>(() => groupTocItems(props.items))

const activeId = ref('')
const observer = ref<IntersectionObserver | null>(null)

function isActiveH2(group: TocGroup): boolean {
  if (activeId.value === group.h2.id) return true
  return group.children.some(c => c.id === activeId.value)
}

function setupObserver() {
  observer.value?.disconnect()

  observer.value = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -50% 0px' }
  )

  nextTick(() => {
    for (const item of props.items) {
      const el = document.getElementById(item.id)
      if (el) observer.value!.observe(el)
    }
  })
}

onMounted(setupObserver)
watch(() => props.items, () => nextTick(setupObserver))
onUnmounted(() => observer.value?.disconnect())

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeId.value = id
  }
}
</script>

<template>
  <nav class="doc-toc">
    <a
      v-for="group in groups"
      :key="group.h2.id"
      href="#"
      :class="['doc-toc-h2', isActiveH2(group) ? 'active' : '']"
      @click.prevent="scrollTo(group.h2.id)"
    >{{ group.h2.text }}</a>
    <template v-for="group in groups" :key="'sub-' + group.h2.id">
      <a
        v-for="child in group.children"
        :key="child.id"
        href="#"
        :class="['doc-toc-h3', activeId === child.id ? 'active' : '']"
        @click.prevent="scrollTo(child.id)"
      >{{ child.text }}</a>
    </template>
  </nav>
</template>

<style scoped>
.doc-toc {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.doc-toc-h2,
.doc-toc-h3 {
  display: block;
  color: var(--text-muted);
  cursor: pointer;
  text-decoration: none;
  font-size: 0.8125rem;
  padding: 0.25rem 0.75rem;
  border-left: 2px solid transparent;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-toc-h2:hover,
.doc-toc-h3:hover {
  color: var(--accent);
  border-left-color: var(--accent);
  padding-left: 1rem;
  background-color: var(--accent-bg);
}

.doc-toc-h2.active,
.doc-toc-h3.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
}

.doc-toc-h2.active {
  padding-left: 0.75rem;
}

.doc-toc-h3 {
  padding-left: 1.5rem;
  font-size: 0.75rem;
  border-left-width: 1px;
}

.doc-toc-h3:hover,
.doc-toc-h3.active {
  padding-left: 1.75rem;
}
</style>
