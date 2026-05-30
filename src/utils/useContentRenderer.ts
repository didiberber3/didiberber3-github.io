import { ref, nextTick, onUnmounted } from 'vue'
import { highlightBlocks } from './highlight'
import { addCopyButtons, setupLightbox } from './reader'

export function useContentRenderer() {
  const contentRef = ref<HTMLElement | null>(null)
  let cleanupLightbox: (() => void) | null = null

  function renderContent() {
    nextTick(() => {
      highlightBlocks()
      if (contentRef.value) {
        addCopyButtons(contentRef.value)
        cleanupLightbox?.()
        cleanupLightbox = setupLightbox(contentRef.value)
      }
    })
  }

  onUnmounted(() => cleanupLightbox?.())

  return { contentRef, renderContent }
}
