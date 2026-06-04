/**
 * 文章阅读增强工具
 * - addCopyButtons: 为代码块添加复制按钮
 * - setupLightbox: 为图片添加点击放大功能
 */

const FOLD_THRESHOLD = 15

export function addCodeFold(container: HTMLElement): void {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.closest('.pre-wrap')) return

    const code = pre.querySelector('code')
    if (!code) return

    const lineCount = (code.textContent || '').split('\n').length
    if (lineCount <= FOLD_THRESHOLD) return

    // Wrap pre in a div for controlled collapsing
    const wrap = document.createElement('div')
    wrap.className = 'pre-wrap collapsed'
    pre.parentNode?.insertBefore(wrap, pre)
    wrap.appendChild(pre)

    // Create fold toggle button
    const btn = document.createElement('button')
    btn.className = 'fold-btn'
    const rowLabel = `展开全部 ${lineCount} 行`
    btn.innerHTML = `<span class="fold-arrow">▸</span> ${rowLabel}`

    let isExpanded = false
    btn.addEventListener('click', () => {
      isExpanded = !isExpanded
      wrap.classList.toggle('collapsed', !isExpanded)
      btn.classList.toggle('expanded', isExpanded)
      btn.innerHTML = isExpanded
        ? `<span class="fold-arrow">▾</span> 收起`
        : `<span class="fold-arrow">▸</span> ${rowLabel}`
    })

    wrap.appendChild(btn)
  })
}

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

function openLightbox(img: HTMLImageElement): void {
  const overlay = document.createElement('div')
  overlay.className = 'lightbox-overlay'

  const fullImg = document.createElement('img')
  fullImg.src = img.src
  fullImg.alt = img.alt
  fullImg.className = 'lightbox-image'

  overlay.appendChild(fullImg)

  overlay.addEventListener('click', () => overlay.remove())

  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.remove()
      document.removeEventListener('keydown', escapeHandler)
    }
  }
  requestAnimationFrame(() => {
    document.addEventListener('keydown', escapeHandler)
  })

  document.body.appendChild(overlay)
}

export function setupLightbox(container: HTMLElement): () => void {
  // Apply cursor and marker class to all images
  container.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    img.style.cursor = 'zoom-in'
    img.classList.add('lightbox-trigger')
  })

  // Event delegation: one listener instead of N
  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG' && target.classList.contains('lightbox-trigger')) {
      openLightbox(target as HTMLImageElement)
    }
  }
  container.addEventListener('click', handler)

  return () => container.removeEventListener('click', handler)
}
