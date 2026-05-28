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
  <aside v-if="items.length > 1" class="toc-wrapper">
    <div class="toc-inner">
      <h3 class="label-uppercase" style="margin-bottom: 0.75rem;">目录</h3>
      <ul class="toc-list">
        <li v-for="group in groups" :key="group.h2.id">
          <!-- h2 row -->
          <div
            :class="['toc-h2', isActiveH2(group) ? 'active' : '']"
          >
            <a href="#" class="interact-slide-bg" @click.prevent="scrollTo(group.h2.id)">
              {{ group.h2.text }}
            </a>
          </div>

          <!-- h3 children (always visible) -->
          <ul v-if="group.children.length > 0" class="toc-sublist">
            <li
              v-for="child in group.children"
              :key="child.id"
              :class="['toc-sub', activeId === child.id ? 'active' : '']"
            >
              <a href="#" class="interact-slide-bg" @click.prevent="scrollTo(child.id)">{{ child.text }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.toc-wrapper {
  position: sticky;
  top: 5rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-secondary) transparent;
}

.toc-wrapper::-webkit-scrollbar {
  width: 4px;
}
.toc-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--border-secondary);
}
.toc-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

/* background box to separate from content area */
.toc-inner {
  padding: 16px;
  background-color: var(--toc-bg);
  border: 1px solid var(--toc-border);
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ── h2 row ── */
.toc-h2 {
  margin: 0;
}

.toc-h2 a {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.35rem 0 0.35rem 0.5rem;
}

.toc-h2.active > a {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
}

/* ── h3 children ── */
.toc-sublist {
  list-style: none;
  padding: 0 0 0 0.75rem;
  margin: 0;
}

.toc-sub a {
  display: block;
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.25rem 0 0.25rem 0.5rem;
  border-left: 2px solid transparent;
}

.toc-sub.active a {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
}
</style>
