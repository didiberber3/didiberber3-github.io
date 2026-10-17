/**
 * 阅读进度（模块级 composable，供回到顶部按钮实时显示）。
 * 用 requestAnimationFrame 节流 + passive scroll，避免逐帧 setState 抖动；
 * 组件卸载时移除监听并取消未执行的帧。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useReadingProgress() {
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
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  })

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  })

  return { progress }
}
