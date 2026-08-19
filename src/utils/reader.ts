/**
 * 文章阅读增强工具
 * - enhanceCodeBlocks: 统一处理代码块（header 导航栏 + 折叠/展开 + 复制 + 行号）
 * - setupLightbox: 为图片添加点击放大功能
 */

/** 超过此行数才显示「折叠/展开」按钮 */
const FOLD_BTN_MIN = 20
/** 超过此行数才默认折叠（其余默认展开） */
const FOLD_DEFAULT = 60

/** 复制按钮的临时反馈计时器 */
let copyFlashTimer: ReturnType<typeof setTimeout> | null = null

/** 按钮短暂显示「已复制 / 复制失败」，1.5s 后还原 */
function flashCopyState(btn: HTMLButtonElement, ok: boolean) {
  if (copyFlashTimer) clearTimeout(copyFlashTimer)
  const original = btn.textContent
  btn.textContent = ok ? '已复制' : '复制失败'
  btn.classList.toggle('copied', ok)
  copyFlashTimer = setTimeout(() => {
    btn.textContent = original
    btn.classList.remove('copied')
  }, 1500)
}

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

/** 统计代码行数（剔除结尾换行产生的空行） */
function countLines(text: string): number {
  let n = text.split('\n').length
  if (n > 1 && text.endsWith('\n')) n--
  return n
}

export function enhanceCodeBlocks(container: HTMLElement): void {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.closest('.code-block')) return

    const code = pre.querySelector('code')
    if (!code) return

    const text = code.textContent || ''
    const lineCount = countLines(text)
    const showFoldBtn = lineCount > FOLD_BTN_MIN
    const defaultCollapsed = lineCount > FOLD_DEFAULT
    const lang = detectLang(code as HTMLElement)

    // 1. .code-block 包裹
    const block = document.createElement('div')
    block.className = 'code-block'
    pre.parentNode?.insertBefore(block, pre)
    block.appendChild(pre)

    // 2. header 导航栏
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
        flashCopyState(copyBtn, true)
      } catch {
        flashCopyState(copyBtn, false)
      }
    })
    headerActions.appendChild(copyBtn)

    // 3. body（行号列 + pre）
    const body = document.createElement('div')
    body.className = 'code-block-body'
    pre.parentNode?.insertBefore(body, pre)
    body.appendChild(pre)

    // 折叠/展开按钮（仅超长块有）
    if (showFoldBtn) {
      const foldBtn = document.createElement('button')
      foldBtn.className = 'fold-btn interact-btn-icon'
      const collapsedLabel = `展开全部 ${lineCount} 行`

      let isExpanded = !defaultCollapsed
      if (defaultCollapsed) {
        body.classList.add('collapsed')
        foldBtn.textContent = collapsedLabel
      } else {
        foldBtn.textContent = '折叠'
      }

      foldBtn.addEventListener('click', () => {
        isExpanded = !isExpanded
        body.classList.toggle('collapsed', !isExpanded)
        foldBtn.textContent = isExpanded ? '折叠' : collapsedLabel
      })

      headerActions.prepend(foldBtn)
    }

    header.appendChild(headerActions)
    // header 插入到 block 的最前面
    block.insertBefore(header, block.firstChild)

    // 4. 行内行号（不破坏高亮 span，行号与代码同行，行高天然对齐）
    addLineNumbers(code)
  })
}

/**
 * 行内行号：把 code 内的节点按换行分组，每行包一层 .code-line（行号 + 代码）。
 * 用 DOM 遍历而非 innerHTML 字符串切分，保留高亮 span；
 * 跨行 token（多行字符串/块注释）的 class 继承到其所在每一行，颜色不错乱。
 */
function addLineNumbers(codeEl: HTMLElement): void {
  if (codeEl.querySelector('.code-line')) return

  type Line = { classes: string[]; nodes: Node[] }
  const lines: Line[] = []
  let current: Line = { classes: [], nodes: [] }

  function walk(node: Node, inherited: string[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.nodeValue || '').split('\n')
      parts.forEach((part, i) => {
        if (i > 0) {
          lines.push(current)
          current = { classes: [...inherited], nodes: [] }
        }
        if (part) current.nodes.push(document.createTextNode(part))
      })
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      const classes = [...inherited, ...Array.from(el.classList)]
      if (el.textContent?.includes('\n')) {
        Array.from(el.childNodes).forEach((child) => walk(child, classes))
      } else {
        current.nodes.push(el.cloneNode(true))
      }
    }
  }

  Array.from(codeEl.childNodes).forEach((child) => walk(child, []))
  // 末尾换行产生的空行（current.nodes 为空）不 push，等价于 trim 末尾换行
  if (current.nodes.length) lines.push(current)

  const fragment = document.createDocumentFragment()
  lines.forEach((line, i) => {
    const row = document.createElement('span')
    row.className = 'code-line'

    const num = document.createElement('span')
    num.className = 'line-num'
    num.setAttribute('aria-hidden', 'true')
    num.textContent = String(i + 1)
    row.appendChild(num)

    const code = document.createElement('span')
    code.className = line.classes.length ? `line-code ${line.classes.join(' ')}` : 'line-code'
    line.nodes.forEach((n) => code.appendChild(n))
    row.appendChild(code)

    fragment.appendChild(row)
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
