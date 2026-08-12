/**
 * TOC 滚动高亮 IntersectionObserver
 *
 * 目录已统一收敛到 ArticleContent 一处展示，
 * 观察器由其单独持有，不再需要引用计数。
 */
import { ref, nextTick } from 'vue'

export const activeHeadingId = ref('')

let observer: IntersectionObserver | null = null

export function startTocObserver(headingIds: string[]) {
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
  observer?.disconnect()
  observer = null
}
