<script setup lang="ts">
/**
 * 阅读进度条。
 * 优先用 CSS scroll-driven animation（零 JS 监听）；
 * 浏览器不支持 `animation-timeline` 时，退化为 rAF 节流的 passive scroll 监听，
 * 保证在旧内核浏览器 / 旧 Safari 上也能看到进度。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const supportsTimeline = ref(true)
const progress = ref(0)
let rafId = 0

function update() {
  rafId = 0
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
}

function schedule() {
  if (!rafId) rafId = requestAnimationFrame(update)
}

onMounted(() => {
  supportsTimeline.value =
    typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'scroll()')
  if (supportsTimeline.value) return

  update()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
})
</script>

<template>
  <div
    class="scroll-progress"
    :class="{ 'is-fallback': !supportsTimeline }"
    :style="supportsTimeline ? undefined : { transform: `scaleX(${progress})` }"
    aria-hidden="true"
  ></div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-progress);
  height: 2px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: 0 50%;
  pointer-events: none;
  animation: scroll-progress-grow linear both;
  animation-timeline: scroll(root block);
}

/* JS 兜底：关闭 scroll-driven 动画，由内联 transform 驱动 */
.scroll-progress.is-fallback {
  animation: none;
}

@keyframes scroll-progress-grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    /* 进度条是状态指示而不是装饰动画，保留滚动联动 */
    animation-duration: auto !important;
    transition: none;
  }
}
</style>
