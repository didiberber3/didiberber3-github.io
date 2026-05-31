import { reactive } from 'vue'
import type { NoteMeta } from './content'
import type { TocItem } from './markdown'

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
