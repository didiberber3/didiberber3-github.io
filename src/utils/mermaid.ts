/**
 * Mermaid 图表渲染模块
 *
 * 将 markdown 中 ```mermaid 代码块转换为渲染的图表。
 *
 * 用法：
 *   import { renderMermaid } from '../utils/mermaid'
 *   await renderMermaid()
 */

import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
})

export function renderMermaid(): void {
  const selector = '.article-content pre code.language-mermaid'
  const blocks = document.querySelectorAll(selector)
  if (!blocks.length) return

  blocks.forEach((code) => {
    const pre = code.parentElement
    if (!pre) return

    const div = document.createElement('div')
    div.className = 'mermaid'
    div.textContent = code.textContent || ''
    pre.replaceWith(div)
  })

  mermaid.run({ querySelector: '.article-content .mermaid' })
}
