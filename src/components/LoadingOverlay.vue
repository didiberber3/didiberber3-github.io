<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGlobalLoading } from '../utils/useGlobalLoading'

const { isLoading } = useGlobalLoading()
const visible = ref(false)
const MIN_DISPLAY = 200
let showTime = 0
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(isLoading, (loading) => {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  if (loading) {
    showTime = Date.now()
    visible.value = true
  } else {
    const elapsed = Date.now() - showTime
    hideTimer = setTimeout(() => { visible.value = false }, Math.max(0, MIN_DISPLAY - elapsed))
  }
})
</script>

<template>
  <Transition name="overlay-fade">
    <div v-if="visible" class="loading-overlay">
      <svg class="loading-spinner" viewBox="0 0 24 24" role="status" aria-label="加载中">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"
                stroke-dasharray="31.4 31.4" stroke-linecap="round" />
      </svg>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  color: var(--accent);
  animation: spin 0.8s linear infinite;
}

.loading-spinner circle {
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes dash {
  0%   { stroke-dashoffset: 62.8; }
  50%  { stroke-dashoffset: 15.7; transform: rotate(90deg); }
  100% { stroke-dashoffset: 62.8; transform: rotate(360deg); }
}

/* ── fade transition ── */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
