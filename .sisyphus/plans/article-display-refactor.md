# Plan: Unify Article Display (ArticleView + DocsPage)

## TL;DR
> **Summary**: Extract the duplicated article display (header, body, sidebar with nav/toc tabs, TOC tracking) from `ArticleView.vue` into a shared `ArticleContent.vue` component. Both `ArticleView.vue` and `DocsPage.vue` use it with different props. Eliminates code duplication, fixes DocsPage missing TOC tracking, ensures consistent behavior.
> **Deliverables**: 1 new component (`ArticleContent.vue`), 2 updated pages (`ArticleView.vue`, `DocsPage.vue`)
> **Effort**: Short (3 files, ~100 lines total change)
> **Parallel**: YES — Wave 1 (create component) then Wave 2 (update both pages in parallel)
> **Critical Path**: Create component → update ArticleView → update DocsPage → verify

## Context

### Current Problem
- `ArticleView.vue` (`/note/:slug`) and `DocsPage.vue` (`/docs/:category?/:slug?`) have ~80% identical code for displaying an article (header, content renderer, sidebar with 文章导航/文章目录 tabs, TOC list)
- TOC IntersectionObserver + active animation was added to `ArticleView` but never ported to `DocsPage`
- Both will keep diverging over time

### Root Architecture
Router defines:
- `/note/:slug` → ArticleView.vue (standalone article)
- `/docs/:category?/:slug?` → DocsPage.vue (category grid → article list → article reading)

Both load the same `Note` data via `loadNote(slug)`. The only differences:
| Aspect | ArticleView | DocsPage |
|--------|------------|----------|
| Nav items | `sidebarNotes` (filtered by note's category) | `categoryNotes` (filtered by route category) |
| Nav link | `/note/${slug}` | `/docs/${category}/${slug}` |
| Active check | `slug === route.params.slug` | `slug === computed slug` |
| Prev/Next | Yes (`getAdjacentNotes`) | No |
| TOC tracking | ✅ Has IntersectionObserver | ❌ Missing entirely |
| Extra views | — | Category grid + article list |

## Work Objectives

### Core Objective
Extract shared article display logic into `ArticleContent.vue` so both pages render articles identically.

### Deliverables
1. `src/components/ArticleContent.vue` — new shared component
2. `src/pages/ArticleView.vue` — slimmed down, delegates to ArticleContent
3. `src/pages/DocsPage.vue` — article reading section uses ArticleContent

### Definition of Done
- `vue-tsc --noEmit` passes with zero errors
- `vite build` succeeds
- `ArticleView` renders article identically to before (header, body, sidebar, nav, TOC, prev/next)
- `DocsPage` article reading shows TOC tracking that follows scroll position
- TOC animation (`::before` slide-in) works in both routes
- Nav items in sidebar link to correct URLs per route
- Active nav highlighting works in both routes

### Must Have
- All existing CSS classes preserved (`.article-with-aside`, `.aside-nav-item`, `.aside-toc-item`, etc.)
- TOC IntersectionObserver rootMargin: `-80px 0px -50% 0px`
- `contentRef` passed correctly for `renderContent()` to work
- Scoped animation styles properly applied to both routes

### Must NOT Have
- No changes to route definitions
- No changes to data loading logic (loadNote, getNoteList, etc.)
- No changes to CSS variables or global styles
- No changes to category grid or article list views in DocsPage

## Component Design

### `src/components/ArticleContent.vue` — Props Interface

```ts
interface Props {
  note: Note
  navItems: NoteMeta[]
  navLinkTo: (slug: string) => string  // e.g. slug => `/note/${slug}`
  currentSlug: string
  category?: string           // label shown above nav list
  adjacent?: { prev: NoteMeta | null; next: NoteMeta | null }
  adjacentLinkTo?: (slug: string) => string  // only needed if adjacent provided
}
```

### Behavior
- Renders article header (title, date, readingTime, charCount)
- Renders article body with `contentRef` (for `useContentRenderer`)
- Renders sidebar with tabs (文章导航 / 文章目录)
- Tab "文章导航": shows nav items with active highlighting
- Tab "文章目录": shows TOC items with IntersectionObserver active tracking + slide-in animation
- If `adjacent` is provided, renders prev/next nav below article body
- All TOC logic (activeTocId, tocObserver, setupTocObserver) lives inside this component
- `contentRef` is exposed so parent can call `renderContent()`

### Template Structure (key part)
```html
<article class="article-with-aside">
  <div class="article-main">
    <div class="article-body">
      <header>...</header>
      <div ref="contentRef" class="article-content ..." v-html="note.html" />
      <nav v-if="adjacent" class="prev-next">...</nav>
    </div>
    <aside class="article-aside">
      <div class="aside-tabs">...</div>
      <nav v-show="activeTab === 'nav'">...</nav>
      <nav v-show="activeTab === 'toc'">...</nav>
    </aside>
  </div>
</article>
```

### Integration in each page

**ArticleView.vue** (after refactor):
```vue
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadNote, getAdjacentNotes, getNoteList } from '../utils/content'
import type { Note, NoteMeta } from '../utils/content'
import LoadingDots from '../components/LoadingDots.vue'
import ArticleContent from '../components/ArticleContent.vue'
import { useContentRenderer } from '../utils/useContentRenderer'
import { useGlobalLoading } from '../utils/useGlobalLoading'
import { sidebar } from '../utils/useSidebar'

const route = useRoute()
const note = ref<Note | undefined>()
const loading = ref(true)
const { contentRef, renderContent } = useContentRenderer()
const { startPage, stopPage } = useGlobalLoading()
const adjacent = ref<{ prev: NoteMeta | null; next: NoteMeta | null }>({ prev: null, next: null })

const sidebarNotes = computed(() => {
  const all = getNoteList()
  if (!note.value) return all
  return all.filter((n) => n.category === note.value!.category)
})

async function load() {
  startPage()
  loading.value = true
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const found = await loadNote(slug)
  note.value = found
  adjacent.value = getAdjacentNotes(slug)
  loading.value = false
  stopPage()
  renderContent()
  if (found?.toc?.length) sidebar.toc = found.toc
  sidebar.currentSlug = slug
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div v-if="loading" class="py-16 text-center txt-muted">
          <LoadingDots text="加载中" />
        </div>
        <div v-else-if="!note" class="py-16 text-center txt-muted">笔记不存在</div>
        <ArticleContent
          v-else
          :note="note"
          :nav-items="sidebarNotes"
          :nav-link-to="slug => `/note/${slug}`"
          :current-slug="typeof route.params.slug === 'string' ? route.params.slug : ''"
          :category="note.category"
          :adjacent="adjacent"
          :adjacent-link-to="slug => `/note/${slug}`"
        />
      </div>
    </main>
  </div>
</template>
```

**DocsPage.vue** (after refactor — only the article reading section changes):
```vue
<ArticleContent
  v-if="currentNote"
  :note="currentNote"
  :nav-items="categoryNotes"
  :nav-link-to="slug => `/docs/${category}/${slug}`"
  :current-slug="slug || ''"
  :category="category"
/>
```

## TODOs

- [ ] 1. Create `src/components/ArticleContent.vue`

  **What to do**: Create the shared component with:
  1. Script: accept props per interface above, implement IntersectionObserver TOC tracking, implement active tab, implement scrollToHeading, implement prev/next computed visibility
  2. Template: article header, body with `contentRef`, sidebar with tabs, nav list, TOC list with active class binding, prev/next nav
  3. Scoped styles: `.aside-toc-item` position relative + overflow hidden, `.aside-toc-item.active` with gray bg + green border + green color + z-index 0, `::before` with tocActiveSlideIn animation, `@keyframes tocActiveSlideIn`

  **Must NOT do**: Don't import any page-specific utils (useSidebar, getNoteList, etc.) — those belong in the parent pages.

  **References**:
  - Pattern: `src/pages/ArticleView.vue:170-207` — copy scoped styles exactly
  - Pattern: `src/pages/ArticleView.vue:18-42` — copy IntersectionObserver logic
  - Pattern: `src/pages/ArticleView.vue:126-161` — copy sidebar template structure
  - API/Type: `src/utils/content.ts:Note, NoteMeta` — prop types

  **Acceptance Criteria**:
  - `vue-tsc --noEmit` passes
  - Component compiles without errors
  - All props properly typed

  **QA Scenarios**:
  ```
  Scenario: Component renders with required props
    Tool: Bash
    Steps: npm run build
    Expected: Exit code 0, no type/compile errors
    Evidence: .sisyphus/evidence/task-1-build.log
  ```

  **Commit**: NO (committed after both pages updated)

- [ ] 2. Update `src/pages/ArticleView.vue`

  **What to do**: Replace the inline article template (lines 91-167) with `<ArticleContent>`. Remove now-unused imports (`onUnmounted`, `nextTick`, `activeTocId`, `tocObserver`, `setupTocObserver`). Add import for `ArticleContent`. Remove scoped styles (lines 170-207) — they move to ArticleContent.

  **Must NOT do**: Don't change load logic, don't change how `getAdjacentNotes` is called, don't change `sidebar` updates.

  **References**:
  - Current file: `src/pages/ArticleView.vue` (full file — 209 lines)
  - New component: `src/components/ArticleContent.vue` (created in task 1)

  **Acceptance Criteria**:
  - `vue-tsc --noEmit` passes
  - Article page renders identically
  - Prev/next nav still works

  **QA Scenarios**:
  ```
  Scenario: ArticleView still loads and renders
    Tool: Bash
    Steps: npm run build
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-2-build.log
  ```

  **Commit**: NO (committed after all 3 tasks)

- [ ] 3. Update `src/pages/DocsPage.vue`

  **What to do**: In the article reading section (lines 129-169), replace the inline `<article>` template with `<ArticleContent>`. Add import for `ArticleContent`. The TOC section (line 162-164) already has no IntersectionObserver — ArticleContent will handle it now.

  **Must NOT do**: Don't change the category grid or article list views (lines 92-119, 178-204). Don't change `selectNote` loading logic.

  **References**:
  - Current file: `src/pages/DocsPage.vue:129-169` — article reading section to replace
  - New component: `src/components/ArticleContent.vue` (created in task 1)

  **Acceptance Criteria**:
  - `vue-tsc --noEmit` passes
  - Docs article page renders with TOC tracking
  - Category grid and article list views unchanged

  **QA Scenarios**:
  ```
  Scenario: DocsPage article reading renders with TOC tracking
    Tool: Bash
    Steps: npm run build
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-3-build.log
  ```

  **Commit**: YES | Message: `refactor: unify article display into shared ArticleContent component` | Files: `src/components/ArticleContent.vue src/pages/ArticleView.vue src/pages/DocsPage.vue`

## Execution Strategy

### Waves
Wave 1: Create `ArticleContent.vue` component (task 1)
Wave 2: Update `ArticleView.vue` + `DocsPage.vue` (tasks 2-3, parallel)

### Agent Dispatch
Task 1: `visual-engineering` — create new component with template + TS + scoped CSS
Task 2: `quick` (single file edit, remove code and add import)
Task 3: `quick` (single file edit, replace template section)

## Commit Strategy
Single commit after all 3 tasks: `refactor: unify article display into shared ArticleContent component`

## Success Criteria
- Build passes ✓
- ArticleView renders with header, body, sidebar, prev/next ✓
- DocsPage renders article with TOC tracking ✓
- TOC slide-in animation plays on active item change ✓
- Nav items link to correct URLs ✓
- Active nav highlighting works in both routes ✓
