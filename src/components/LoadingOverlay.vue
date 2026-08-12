<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGlobalLoading } from '../utils/useGlobalLoading'

const { isLoading } = useGlobalLoading()
const visible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null

// 加载不足 ~120ms 不显示，避免快速跳转闪屏；卡住（慢 chunk / 渲染）时正常展示
const SHOW_DELAY = 120
watch(isLoading, (loading) => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (loading) {
    showTimer = setTimeout(() => {
      visible.value = true
    }, SHOW_DELAY)
  } else {
    visible.value = false
  }
})
</script>

<template>
  <Transition name="overlay-fade">
    <div v-if="visible" class="loading-overlay" aria-label="加载中" role="status">
      <svg class="loading-spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"
                stroke-dasharray="31.4 31.4" stroke-linecap="round" />
      </svg>
    </div>
  </Transition>
</template>

<style scoped>
/* 全屏模糊 + 中间转圈 */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in srgb, var(--bg-primary) 45%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.loading-spinner {
  width: 36px;
  height: 36px;
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

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
