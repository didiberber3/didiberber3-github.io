/**
 * Sidebar 状态管理（模块级单例）
 *
 * 封装 API，禁止组件直接修改 sidebar 属性。
 * 所有写操作通过 setter 函数进行。
 */
import { reactive } from 'vue'
import type { NoteMeta } from './content'
import type { TocItem } from './markdown'

/** 内部状态 — 外部只读，写操作通过 setter 函数 */
export const sidebar = reactive({
  visible: false,
  category: '',
  notes: [] as NoteMeta[],
  toc: [] as TocItem[],
  currentSlug: '',
})

export function openSidebar(opts: {
  category?: string
  notes?: NoteMeta[]
  toc?: TocItem[]
  currentSlug?: string
}) {
  sidebar.category = opts.category || ''
  sidebar.notes = opts.notes || []
  sidebar.toc = opts.toc || []
  sidebar.currentSlug = opts.currentSlug || ''
  sidebar.visible = true
}

export function closeSidebar() {
  sidebar.visible = false
}

export function setSidebarToc(toc: TocItem[]) {
  sidebar.toc = toc
}

export function setSidebarCurrentSlug(slug: string) {
  sidebar.currentSlug = slug
}

export function setSidebarVisible(visible: boolean) {
  sidebar.visible = visible
}
