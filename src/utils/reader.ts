/**
 * 文章阅读增强工具
 * - enhanceCodeBlocks: 统一处理代码块（header 导航栏 + 抽屉式展开/折叠 + 复制）
 * - setupLightbox: 为图片添加点击放大功能
 */

import { showToast } from './useToast'

const FOLD_THRESHOLD = 15

const LANG_MAP: Record<string, string> = {
  js: 'JavaScript', ts: 'TypeScript', tsx: 'TSX', jsx: 'JSX',
  java: 'Java', python: 'Python', py: 'Python',
  bash: 'Bash', shell: 'Shell', powershell: 'PowerShell', ps: 'PowerShell',
  markdown: 'Markdown', md: 'Markdown',
  json: 'JSON', yaml: 'YAML', yml: 'YAML',
  css: 'CSS', scss: 'SCSS', html: 'HTML', xml: 'XML',
  sql: 'SQL', go: 'Go', rust: 'Rust',
  c: 'C', cpp: 'C++', cs: 'C#',
  php: 'PHP', ruby: 'Ruby', r: 'R',
  kotlin: 'Kotlin', swift: 'Swift', scala: 'Scala',
  dart: 'Dart', lua: 'Lua', haskell: 'Haskell',
}

function detectLang(codeEl: HTMLElement): string {
  for (const cls of codeEl.classList) {
    if (cls.startsWith('language-')) {
      const raw = cls.slice(9)
      return LANG_MAP[raw] || raw
    }
  }
  return ''
}

export function enhanceCodeBlocks(container: HTMLElement): void {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.closest('.code-block')) return

    const code = pre.querySelector('code')
    if (!code) return

    const text = code.textContent || ''
    const lineCount = text.split('\n').length
    const isFoldable = lineCount > FOLD_THRESHOLD
    const lang = detectLang(code as HTMLElement)

    // 1. .code-block 包裹
    const block = document.createElement('div')
    block.className = 'code-block'
    pre.parentNode?.insertBefore(block, pre)
    block.appendChild(pre)

    // 2. stiky header 导航栏
    const header = document.createElement('div')
    header.className = 'code-block-header'

    const langBadge = document.createElement('span')
    langBadge.className = 'code-lang'
    langBadge.textContent = lang
    header.appendChild(langBadge)

    const headerActions = document.createElement('div')
    headerActions.className = 'code-header-actions'

    // 复制按钮
    const copyBtn = document.createElement('button')
    copyBtn.className = 'copy-btn interact-btn-icon'
    copyBtn.textContent = '复制'
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text)
        showToast('已复制')
      } catch {
        showToast('复制失败')
      }
    })
    headerActions.appendChild(copyBtn)

    // 折叠/展开按钮（仅大块有，小块不需要）
    if (isFoldable) {
      const foldBtn = document.createElement('button')
      foldBtn.className = 'fold-btn interact-btn-icon'
      foldBtn.textContent = '展开'
      const rowLabel = `展开全部 ${lineCount} 行`

      const body = document.createElement('div')
      body.className = 'code-block-body collapsed'
      pre.parentNode?.insertBefore(body, pre)
      body.appendChild(pre)

      let isExpanded = false
      foldBtn.addEventListener('click', () => {
        isExpanded = !isExpanded
        body.classList.toggle('collapsed', !isExpanded)
        foldBtn.textContent = isExpanded ? '折叠' : rowLabel
      })

      headerActions.prepend(foldBtn)
    } else {
      // 小块直接放进 body（不折叠）
      const body = document.createElement('div')
      body.className = 'code-block-body'
      pre.parentNode?.insertBefore(body, pre)
      body.appendChild(pre)
    }

    header.appendChild(headerActions)
    // header 插入到 block 的最前面
    block.insertBefore(header, block.firstChild)

    // ── 添加行号 ──
    addLineNumbers(code)
  })
}

function addLineNumbers(codeEl: HTMLElement): void {
  if (codeEl.querySelector('.code-line')) return

  const html = codeEl.innerHTML
  const lines = html.split('\n')
  // 去掉末尾空行（代码结尾 \n 产生的）
  if (lines.length > 1 && lines[lines.length - 1].trim() === '') {
    lines.pop()
  }

  const fragment = document.createDocumentFragment()
  lines.forEach((lineHtml, i) => {
    const wrapper = document.createElement('span')
    wrapper.className = 'code-line'

    const num = document.createElement('span')
    num.className = 'line-num'
    num.setAttribute('aria-hidden', 'true')
    num.textContent = String(i + 1)

    const codeContent = document.createElement('span')
    codeContent.className = 'line-code'
    codeContent.innerHTML = lineHtml || '\n'

    wrapper.appendChild(num)
    wrapper.appendChild(codeContent)
    fragment.appendChild(wrapper)
  })

  codeEl.innerHTML = ''
  codeEl.appendChild(fragment)
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
