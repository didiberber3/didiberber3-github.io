<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { TocItem, TocGroup } from '../utils/markdown'
import { groupTocItems } from '../utils/markdown'
import { activeHeadingId, startTocObserver, stopTocObserver } from '../utils/useTocObserver'

const props = defineProps<{
  items: TocItem[]
}>()

const groups = computed<TocGroup[]>(() => groupTocItems(props.items))

function isActiveH2(group: TocGroup): boolean {
  if (activeHeadingId.value === group.h2.id) return true
  return group.children.some((c) => c.id === activeHeadingId.value)
}

function setupObserver() {
  if (props.items.length) {
    startTocObserver(props.items.map((i) => i.id))
  }
}

onMounted(setupObserver)
watch(() => props.items, () => nextTick(setupObserver))
onUnmounted(() => stopTocObserver())

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeHeadingId.value = id
  }
}
</script>

<template>
  <aside v-if="items.length > 1" class="toc-wrapper">
    <ul class="toc-list">
      <li v-for="group in groups" :key="group.h2.id">
        <!-- h2 row -->
        <div :class="['toc-h2', isActiveH2(group) ? 'active' : '']">
          <a href="#" class="toc-link toc-link-h2" @click.prevent="scrollTo(group.h2.id)">
            {{ group.h2.text }}
          </a>
        </div>

        <!-- h3 children -->
        <ul v-if="group.children.length > 0" class="toc-sublist">
          <li
            v-for="child in group.children"
            :key="child.id"
            :class="['toc-sub', activeHeadingId === child.id ? 'active' : '']"
          >
            <a href="#" class="toc-link toc-link-h3" @click.prevent="scrollTo(child.id)">{{ child.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.toc-wrapper {
  position: relative;
}

/* ── TOC links: shared ── */
.toc-link {
  display: block;
  font-size: 0.8125rem;
  text-decoration: none;
  padding: 0.35rem 0.5rem;
  border-left: 2px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s, border-color 0.2s, padding-left 0.2s;
  color: var(--text-primary);
}

.toc-link:hover {
  border-left-color: var(--accent);
  color: var(--accent);
  padding-left: 0.75rem;
}

/* h2 links */
.toc-link-h2 {
  font-weight: 500;
}

/* h3 links */
.toc-link-h3 {
  padding-left: 1.25rem;
  font-size: 0.78125rem;
  color: var(--text-secondary);
}
.toc-link-h3:hover {
  padding-left: 1.5rem;
}

/* ── Active states ── */
.toc-h2.active > .toc-link-h2 {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
  padding-left: 0.75rem;
}

.toc-sub.active > .toc-link-h3 {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
  padding-left: 1.5rem;
}

/* ── List structure ── */
.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-sublist {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
