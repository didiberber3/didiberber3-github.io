/// <reference types="vite/client" />

declare module '@exercism/highlightjs-gdscript' {
  import type { LanguageFn } from 'highlight.js'
  const gdscript: LanguageFn
  export default gdscript
}

declare module 'virtual:content-index' {
  export interface NoteEntry {
    date: string
    title: string
    slug: string
    charCount: number
  }
  export const noteMeta: Record<string, NoteEntry>
  export const slugCategory: Record<string, string>
}
