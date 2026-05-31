/// <reference types="vite/client" />

declare module 'virtual:content-index' {
  export interface NoteEntry {
    date: string
    title: string
    slug: string
  }
  export const noteMeta: Record<string, NoteEntry>
}
