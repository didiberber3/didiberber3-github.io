/**
 * 文章阅读增强工具
 * - addCopyButtons: 为代码块添加复制按钮
 * - setupLightbox: 为图片添加点击放大功能
 */

export function addCopyButtons(container: HTMLElement): void {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return

    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = '复制'

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        btn.textContent = '已复制'
        btn.classList.add('copied')
      } catch (err) {
        console.warn('Clipboard API not available:', err)
        btn.textContent = '复制失败'
      }
      setTimeout(() => {
        btn.textContent = '复制'
        btn.classList.remove('copied')
      }, 2000)
    })

    pre.style.position = 'relative'
    pre.appendChild(btn)
  })
}

export function setupLightbox(container: HTMLElement): () => void {
  const imgs = container.querySelectorAll<HTMLImageElement>('img')
  const cleanupFns: (() => void)[] = []

  imgs.forEach((img) => {
    img.style.cursor = 'zoom-in'
    img.classList.add('lightbox-trigger')

    const handler = () => {
      const overlay = document.createElement('div')
      overlay.className = 'lightbox-overlay'

      const fullImg = document.createElement('img')
      fullImg.src = img.src
      fullImg.alt = img.alt
      fullImg.className = 'lightbox-image'

      overlay.appendChild(fullImg)

      const closeHandler = () => overlay.remove()
      overlay.addEventListener('click', closeHandler)

      // Close on Escape
      const escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          overlay.remove()
          document.removeEventListener('keydown', escapeHandler)
        }
      }
      // Use a timer so the keydown listener is attached after overlay is mounted
      requestAnimationFrame(() => {
        document.addEventListener('keydown', escapeHandler)
      })

      document.body.appendChild(overlay)
    }

    img.addEventListener('click', handler)
    cleanupFns.push(() => img.removeEventListener('click', handler))
  })

  // Return cleanup function
  return () => cleanupFns.forEach((fn) => fn())
}
