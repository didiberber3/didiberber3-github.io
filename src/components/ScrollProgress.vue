<template>
  <div v-show="visible" class="scroll-progress" :style="{ width: progress + '%' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const visible = ref(true)

function onScroll() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  visible.value = docHeight > window.innerHeight
  if (docHeight <= 0) {
    progress.value = 0
    return
  }
  const scrollTop = window.scrollY
  progress.value = Math.min((scrollTop / docHeight) * 100, 100)
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background-color: var(--accent);
  z-index: 60;
  transition: width 0.1s linear;
}
</style>
