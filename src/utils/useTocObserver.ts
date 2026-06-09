/**
 * 共享 TOC IntersectionObserver
 *
 * ArticleContent 和 TOCSidebar 原是各自创建 IntersectionObserver
 * 监听相同元素 — 现合并为一个模块级单例，引用计数管理生命周期。
 */
import { ref, nextTick } from 'vue'

export const activeHeadingId = ref('')

let observer: IntersectionObserver | null = null
let activeCount = 0

export function startTocObserver(headingIds: string[]) {
  activeCount++
  observer?.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeadingId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -50% 0px' },
  )

  nextTick(() => {
    for (const id of headingIds) {
      const el = document.getElementById(id)
      if (el) observer!.observe(el)
    }
  })
}

export function stopTocObserver() {
  activeCount = Math.max(0, activeCount - 1)
  if (activeCount <= 0) {
    observer?.disconnect()
    observer = null
    activeCount = 0
  }
}
