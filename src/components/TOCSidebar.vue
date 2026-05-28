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
const collapsed = ref<Record<string, boolean>>({})

function toggleCollapse(id: string) {
  collapsed.value[id] = !(collapsed.value[id] ?? false)
}

function isCollapsed(id: string): boolean {
  return collapsed.value[id] ?? false
}

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

function scrollToH2(group: TocGroup) {
  scrollTo(group.h2.id)
  if (group.children.length > 0) {
    // expand if currently collapsed
    if (isCollapsed(group.h2.id)) {
      toggleCollapse(group.h2.id)
    }
  }
}
</script>

<template>
  <aside v-if="items.length > 1" class="toc-wrapper">
    <div class="toc-inner">
      <h3 class="toc-label">目录</h3>
      <ul class="toc-list">
        <li v-for="group in groups" :key="group.h2.id">
          <!-- h2 row -->
          <div
            v-if="group.children.length === 0"
            :class="['toc-h2', isActiveH2(group) ? 'active' : '']"
          >
            <a href="#" @click.prevent="scrollTo(group.h2.id)">
              {{ group.h2.text }}
            </a>
          </div>

          <!-- h2 with children — toggleable -->
          <div
            v-else
            :class="['toc-h2', 'toc-h2-toggle', isActiveH2(group) ? 'active' : '']"
          >
            <button @click="toggleCollapse(group.h2.id)" class="toc-btn">
              <span class="toc-arrow">{{ isCollapsed(group.h2.id) ? '▸' : '▾' }}</span>
              <span class="toc-h2-text">{{ group.h2.text }}</span>
            </button>
          </div>

          <!-- h3 children (collapsible) -->
          <Transition name="toc-sublist">
            <ul
              v-if="group.children.length > 0 && !isCollapsed(group.h2.id)"
              class="toc-sublist"
            >
              <li
                v-for="child in group.children"
                :key="child.id"
                :class="['toc-sub', activeId === child.id ? 'active' : '']"
              >
                <a href="#" @click.prevent="scrollTo(child.id)">{{ child.text }}</a>
              </li>
            </ul>
          </Transition>
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

/* no border/background box — match clean look of other sidebars */
.toc-inner {
  padding: 0.25rem 0;
}

.toc-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
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
  border-left: 2px solid transparent;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
}

.toc-h2 a:hover {
  color: var(--accent);
  background-color: var(--bg-secondary);
  border-left-color: var(--accent);
  padding-left: 1rem;
}

.toc-h2.active > a {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
}

/* ── h2 toggle button ── */
.toc-h2-toggle {
  margin-bottom: 0;
}

.toc-btn {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  width: 100%;
  padding: 0.35rem 0 0.35rem 0.5rem;
  background: none;
  border: none;
  border-left: 2px solid transparent;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: var(--text-primary);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
}

.toc-btn:hover {
  color: var(--accent);
  background-color: var(--bg-secondary);
  border-left-color: var(--accent);
  padding-left: 1rem;
}

.toc-h2-toggle.active .toc-btn {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
}

.toc-arrow {
  flex-shrink: 0;
  font-size: 0.625rem;
  line-height: 1.35rem;
  color: var(--text-muted);
  width: 0.875rem;
  transition: color 0.2s;
}

.toc-btn:hover .toc-arrow {
  color: var(--accent);
}

.toc-h2-text {
  font-size: 0.875rem;
  font-weight: 500;
}

/* ── h3 children ── */
.toc-sublist {
  list-style: none;
  margin: 0 0 0 0.25rem;
  padding: 0;
}

.toc-sub {
  margin: 0;
}

.toc-sub a {
  display: block;
  padding: 0.25rem 0 0.25rem 1.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
}

.toc-sub a:hover {
  color: var(--accent);
  background-color: var(--bg-secondary);
  border-left-color: var(--accent);
  padding-left: 2rem;
}

.toc-sub.active > a {
  color: var(--accent);
  border-left-color: var(--accent);
  background-color: var(--accent-bg);
}

/* ── collapsible transition ── */
.toc-sublist-enter-active,
.toc-sublist-leave-active {
  transition: opacity 0.12s ease;
}
.toc-sublist-enter-from,
.toc-sublist-leave-to {
  opacity: 0;
}
</style>
