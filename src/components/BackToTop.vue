<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button
    v-if="visible"
    class="btt-nav"
    @click="scrollToTop"
    aria-label="回到顶部"
  >
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 17V4M10 4L4 10M10 4L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<style scoped>
.btt-nav {
  position: relative;
  overflow: hidden;
  background: var(--code-bg);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  line-height: 1;
  z-index: 0;
  transition: color 0.2s, border-color 0.2s;
}
.btt-nav::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--accent);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s ease;
  z-index: -1;
}
.btt-nav:hover {
  color: white;
  border-color: var(--accent);
}
.btt-nav:hover::before {
  transform: scaleY(1);
}
</style>
