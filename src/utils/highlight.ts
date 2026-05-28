/**
 * highlight.js 共享初始化模块
 *
 * 集中注册所有代码块高亮需要用到的语言，
 * 供 ArticleView / ShareView / DocsPage 统一调用，
 * 避免三处重复 import / register 代码。
 *
 * 用法：
 *   import { highlightBlocks } from '../utils/highlight'
 *   nextTick(() => highlightBlocks())
 */

import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'
import powershell from 'highlight.js/lib/languages/powershell'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('java', java)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('terminal', bash)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('powershell', powershell)

export function highlightBlocks(): void {
  document.querySelectorAll('.article-content pre code').forEach((block) => {
    hljs.highlightElement(block as HTMLElement)
  })
}
