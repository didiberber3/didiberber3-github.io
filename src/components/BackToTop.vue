<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useReadingProgress } from '../utils/useReadingProgress'

/**
 * 回到顶部 + 实时阅读进度。
 * 哨兵进入/离开视口决定按钮显隐（不使用 scroll 监听判断显隐）；
 * 进度值来自 rAF 节流的 useReadingProgress。
 */
const { progress } = useReadingProgress()
const percent = computed(() => Math.round(progress.value * 100))

const visible = ref(false)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !sentinel.value) return
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (!entry) return
    visible.value = !entry.isIntersecting
  })
  observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <Teleport to="body">
    <div ref="sentinel" class="btt-sentinel" aria-hidden="true"></div>
  </Teleport>

  <Transition name="btt">
    <button
      v-if="visible"
      type="button"
      class="btt-nav interact-btn-icon"
      :aria-label="`回到顶部，当前阅读进度 ${percent}%`"
      :title="`回到顶部（${percent}%）`"
      @click="scrollToTop"
    >
      <span class="btt-value" aria-hidden="true">
        {{ percent }}<span class="btt-unit">%</span>
      </span>
      <svg
        class="btt-icon"
        viewBox="0 0 20 20"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M10 16V4M10 4L4.5 9.5M10 4l5.5 5.5" />
      </svg>
      <span class="btt-bar" aria-hidden="true" :style="{ transform: `scaleX(${progress})` }"></span>
    </button>
  </Transition>
</template>

<style scoped>
/* 哨兵脱离文档流，锚定文档顶部；滚动 300px 后离开视口 */
.btt-sentinel {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 300px;
  pointer-events: none;
  visibility: hidden;
}

.btt-nav {
  position: relative;
  width: 2rem;
  min-width: 2rem;
  height: 2rem;
  padding: 0;
  color: var(--text-secondary);
  overflow: hidden;
}

/* 默认：实时进度数字 */
.btt-value {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  transition: opacity var(--dur-fast) var(--ease-out);
}
.btt-unit {
  margin-left: 1px;
  font-size: 0.5rem;
  color: var(--text-muted);
}

/* hover / 键盘聚焦：换成向上箭头 */
.btt-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-out);
}

.btt-nav:hover .btt-value,
.btt-nav:focus-visible .btt-value {
  opacity: 0;
}
.btt-nav:hover .btt-icon,
.btt-nav:focus-visible .btt-icon {
  opacity: 1;
}

/* 底部实时进度线（替代 .interact-btn-icon 的 hover 下划线） */
.btt-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: var(--accent);
  transform-origin: 0 50%;
  transition: transform 0.08s linear;
}
.btt-nav::after {
  display: none;
}

.btt-enter-active,
.btt-leave-active {
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 768px) {
  .btt-nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .btt-enter-active,
  .btt-leave-active,
  .btt-value,
  .btt-icon,
  .btt-bar {
    transition: none;
  }
}
</style>
