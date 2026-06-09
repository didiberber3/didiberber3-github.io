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
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  border-radius: 2px;
  transition: color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.15s;
}
.btt-nav::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--accent);
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
  border-radius: 1px;
}
.btt-nav:hover {
  color: white;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
.btt-nav:hover::before {
  transform: scale(1);
}
.btt-nav:active {
  transform: scale(0.97);
}
.btt-nav:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
