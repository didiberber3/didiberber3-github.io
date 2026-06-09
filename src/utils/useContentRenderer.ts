import { ref, nextTick, onUnmounted } from 'vue'
import { highlightBlocks } from './highlight'
import { enhanceCodeBlocks, setupLightbox } from './reader'
import pangu from 'pangu/browser'

export function useContentRenderer() {
  const contentRef = ref<HTMLElement | null>(null)
  let cleanupLightbox: (() => void) | null = null

  function renderContent() {
    nextTick(() => {
      highlightBlocks()
      if (contentRef.value) {
        enhanceCodeBlocks(contentRef.value)
        pangu.spacingNode(contentRef.value)
        cleanupLightbox?.()
        cleanupLightbox = setupLightbox(contentRef.value)
      }
    })
  }

  onUnmounted(() => cleanupLightbox?.())

  return { contentRef, renderContent }
}
