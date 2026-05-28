/// <reference types="vite/client" />

declare module 'virtual:content-index' {
  export interface NoteEntry {
    date: string
    title: string
  }
  export const noteMeta: Record<string, NoteEntry>
  export const shareMeta: Record<string, { date: string; tag: string; url: string }>
}
