# Restructure: Unified Left Sidebar (30/70) with Multi-Group Panel

## TL;DR
> **Summary**: Replace the fragmented per-page layouts (right TOC, left category nav, `animate-fade-up` wrapper) with a unified CSS Grid two-column layout: left sidebar (30%) with multiple `SidebarGroup` panels (category nav, TOC, reserved slots), right content area (70%).
> **Deliverables**: `AppSidebar.vue` component, updated page templates, CSS Grid layout, responsive overlay behavior
> **Effort**: Large
> **Parallel**: YES — 3 waves

## Context
### Original Request
- `animate-fade-up` should be split, not wrap everything
- Left sidebar with multiple groups/blocks + reserved slots for future content
- TOC + document nav both go into left sidebar
- Overall spacing comfortable
- Content ratio: left 3, right 7

### Current State
- DocsPage: 3-column layout (left nav | content | right TOC), each sidebar `13rem`
- ArticleView/ShareView: 2-column layout (TOC left | content right), TOC moved to right in previous change
- All pages: `<TabNav />` + `<div class="animate-fade-up">` wrapping all content
- Category nav and TOC are separate components in different positions

### Metis Review
- N/A (not consulted yet — straightforward architecture)

## Work Objectives
### Core Objective
Create a unified `AppSidebar` component that lives on the left side of every content page, containing navigable sections (category nav, TOC, reserved slots), with the content area taking the remaining space.

### Deliverables
1. `AppSidebar.vue` — multi-group sidebar component
2. Layout refactor: all content pages use CSS Grid (30% / 70%)
3. `animate-fade-up` split: sidebar and content each have independent containers
4. Responsive: sidebar collapses to overlay on <1024px
5. Remove old `docs-sidebar-left`, `docs-sidebar-right`, `docs-sidebar-right` CSS

### Definition of Done
- `npm run build` passes with zero errors
- ArticleView, DocsPage, ShareView all show left sidebar with category nav + TOC groups
- Sidebar has visible placeholder groups labeled "预留" for future content
- Left 30% / Right 70% ratio visible on >1280px screens
- `<1024px` sidebar hides, becomes toggleable overlay
- TOC and category nav items work (click scrolls, IntersectionObserver active)
- Removed all old sidebar layout CSS from DocsPage scoped styles

### Must Have
- Multi-group sidebar with labeled sections
- Category nav group (visible only on docs pages)
- TOC group (visible when article/share has headings)
- At least 2 reserved placeholder slots with label but no functional content
- CSS Grid layout, not flexbox, for the main shell
- `animate-fade-up` removed or split per-section

### Must NOT Have
- No new external dependencies (no shadcn/vue install — implement pattern manually)
- No change to TabNav or BackToTop behavior
- No change to scroll logic or IntersectionObserver behavior
- No change to dark/light theme variables

## Verification Strategy
> ZERO HUMAN INTERVENTION
- Test decision: tests-after (build verification only — no test suite exists)
- QA policy: Visual verification via build output + Tailwind class audit
- Evidence: Build log output

## Execution Strategy

### Parallel Execution Waves

**Wave 1**: Foundation — `AppSidebar.vue` component + CSS Grid layout shell + style.css additions
**Wave 2**: Page migrations — update ArticleView, DocsPage, ShareView to use new layout
**Wave 3**: Cleanup — remove old CSS, `animate-fade-up`, dead code, build verification

### Dependency Matrix
| Task | Depends On |
|------|-----------|
| 1. AppSidebar component | — |
| 2. CSS Grid layout shell | — |
| 3. style.css additions | — |
| 4. ArticleView migration | 1, 2, 3 |
| 5. DocsPage migration | 1, 2, 3 |
| 6. ShareView migration | 1, 2, 3 |
| 7. Home/Notes/About sidebar add | 1, 2, 3 |
| 8. Remove old CSS | 4, 5, 6 |
| 9. Remove animate-fade-up | 4, 5, 6, 7 |
| 10. Build verification | 8, 9 |

## TODOs

- [ ] 1. Create `AppSidebar.vue` — Multi-group sidebar component

  **What to do**: Create a new component at `src/components/AppSidebar.vue` that renders a left sidebar with multiple `SidebarGroup` sections. The component accepts props for which groups to show and their data.

  **Component structure**:
  ```
  <script setup>
  props:
    - category: string | null (null = hide category nav group)
    - categoryNotes: NoteMeta[] (items for category nav)
    - currentSlug: string (highlight active note)
    - toc: TocItem[] (TOC items, empty = hide TOC group)
    - activeTocId: string (IntersectionObserver-driven)
  
  emits:
    - selectNote(slug: string)
    - scrollTo(id: string)
  </script>
  
  <template>
    <aside class="app-sidebar">
      <!-- Group: Category Nav -->
      <div v-if="category" class="sidebar-group">
        <div class="sidebar-group-label">{{ category }}</div>
        <nav class="sidebar-nav">
          <a v-for="note in categoryNotes" ...
        </nav>
      </div>
  
      <div class="sidebar-separator"></div>
  
      <!-- Group: Table of Contents -->
      <div v-if="toc.length > 1" class="sidebar-group">
        <div class="sidebar-group-label">目录</div>
        <TOCSidebar :items="toc" :activeId="activeTocId" />
      </div>
  
      <div class="sidebar-separator"></div>
  
      <!-- Group: Reserved Slot 1 -->
      <div class="sidebar-group">
        <div class="sidebar-group-label sidebar-group-label-placeholder">预留</div>
        <div class="sidebar-placeholder"></div>
      </div>
  
      <div class="sidebar-separator"></div>
  
      <!-- Group: Reserved Slot 2 -->
      <div class="sidebar-group">
        <div class="sidebar-group-label sidebar-group-label-placeholder">预留</div>
        <div class="sidebar-placeholder"></div>
      </div>
    </aside>
  </template>
  ```

  **Styling**:
  - `.app-sidebar`: width 100% of grid column, sticky top-20, overflow-y-auto, max-height calc
  - `.sidebar-group`: padding, no background/border
  - `.sidebar-group-label`: `.label-uppercase` style, `margin-bottom: 0.5rem`
  - `.sidebar-group-label-placeholder`: use `var(--text-muted)` + italic or dimmed
  - `.sidebar-placeholder`: dashed border, min-height 48px, `var(--border-primary)`, to show it's reserved
  - `.sidebar-separator`: 1px solid `var(--border-primary)`, margin 1rem 0

  **Acceptance Criteria**:
  - [ ] Component renders all 4 groups with correct labels
  - [ ] Category nav group hidden when `category` prop is null
  - [ ] TOC group hidden when `toc` array length ≤ 1
  - [ ] Placeholder groups always visible
  - [ ] `v-show` for responsive overlay behavior

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Styling-heavy new component
  - Skills: `[]`

  **Parallelization**: Wave 1 | Blocks: 4,5,6,7

  **QA Scenarios**:
  ```
  Scenario: Component renders with all props
    Tool: Bash
    Steps: npm run build
    Expected: Build passes with new component
    Evidence: .sisyphus/evidence/task-1-build.log
  ```

- [ ] 2. CSS Grid layout shell in style.css

  **What to do**: Add global layout classes to `src/style.css` (inside `@layer components`).

  ```css
  /* ── Global page layout (CSS Grid, left 30% / right 70%) ── */
  .page-shell {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: minmax(16rem, 30%) minmax(0, 1fr);
    gap: 2rem;
    min-height: calc(100vh - 4rem);
  }

  @media (max-width: 1023px) {
    .page-shell {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
  ```

  Also add responsive overlay styles for the sidebar:
  ```css
  .sidebar-overlay {
    display: none;
  }
  @media (max-width: 1023px) {
    .sidebar-overlay.active {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 30;
      background: rgba(0,0,0,0.4);
    }
    .app-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      z-index: 40;
      background: var(--bg-primary);
      border-right: 1px solid var(--border-primary);
      transform: translateX(-100%);
      transition: transform 0.25s ease;
    }
    .app-sidebar.open {
      transform: translateX(0);
    }
  }
  ```

  **Acceptance Criteria**:
  - [ ] `.page-shell` grid renders two columns
  - [ ] Left column min 16rem, max 30%
  - [ ] Right column fills remaining space
  - [ ] On <1024px, single column layout
  - [ ] Sidebar overlay with backdrop on mobile

- [ ] 3. Remove `animate-fade-up` and update page templates

  **What to do**: In all page templates (ArticleView, DocsPage, ShareView, Home, Notes, About, NotFound, Shares), replace:
  ```html
  <div class="animate-fade-up">
    ...content...
  </div>
  ```
  With:
  ```html
  <div class="page-shell">
    <AppSidebar ... />
    <main class="page-content">
      <div class="animate-fade-up">
        ...content...
      </div>
    </main>
  </div>
  ```

  The `animate-fade-up` should only wrap the **content area**, not the sidebar.

  For each page, determine which props to pass to `<AppSidebar>`:
  - **ArticleView**: `:toc="note.toc"` (category=null, no category nav)
  - **DocsPage**: `:category="category" :categoryNotes="categoryNotes" :currentSlug="currentNote?.slug" :toc="currentNote?.toc"` + emit handlers
  - **ShareView**: `:toc="share.toc"` (category=null)
  - **Home/Notes/About/Shares/NotFound**: no category, no toc → only placeholder slots shown (`AppSidebar` with minimal/no props)

  **Acceptance Criteria**:
  - [ ] All 8 pages use `.page-shell` + `<AppSidebar>` + `.page-content`
  - [ ] `animate-fade-up` only wraps the main content, not sidebar
  - [ ] Build passes

- [ ] 4. Remove old sidebar CSS from DocsPage

  **What to do**: Delete the following from DocsPage.vue scoped styles:
  - `.docs-sidebar-left` + media query
  - `.docs-sidebar-right` + media query
  - `.docs-nav` and children (`.docs-nav-list`, `.docs-nav-item`, etc.)
  - `.docs-layout` class
  - `.docs-content` padding (replace with `.page-content`)

  **Acceptance Criteria**:
  - [ ] All docs-specific sidebar CSS removed
  - [ ] Build passes

- [ ] 5. Integrate AppSidebar into App.vue or layout level (optional)

  **What to do**: If the sidebar should persist across page navigations, move `<AppSidebar>` into `App.vue`'s template and use `provide/inject` or route meta to pass per-page data. The sidebar groups can show/hide based on the current route.

  Alternative: Keep per-page `<AppSidebar>` (simpler, no cross-page state).

  Decision needed: Per-page or global sidebar?
  - Per-page = simpler, each page controls its own sidebar props
  - Global = smoother transitions, sidebar doesn't remount, but needs state management

  **Default**: Per-page (simpler, less refactoring risk)

- [ ] 6. Responsive sidebar toggle on mobile

  **What to do**: Add a sidebar toggle button in TabNav (left side, before tabs) or as a floating hamburger button. The toggle controls an `isSidebarOpen` ref that adds `.open` class to `.app-sidebar` and `.active` class to `.sidebar-overlay`.

  Add to `style.css`:
  ```css
  .sidebar-toggle {
    display: none;
  }
  @media (max-width: 1023px) {
    .sidebar-toggle {
      display: inline-flex;
    }
  }
  ```

  **Acceptance Criteria**:
  - [ ] On <1024px, sidebar is hidden by default
  - [ ] Toggle button visible on mobile
  - [ ] Click opens sidebar with slide animation
  - [ ] Click outside or on backdrop closes sidebar

- [ ] 7. Cleanup: remove unused CSS variables and dead code

  **What to do**:
  - Search for any remaining references to removed classes
  - Remove unused `--toc-bg`, `--toc-border` if still present (should already be removed)
  - Remove any `animate-fade-up` references that are no longer needed

  **Acceptance Criteria**:
  - [ ] No dead CSS variables in style.css
  - [ ] No references to removed class names

- [ ] F1. Final Verification Wave — Plan Compliance Audit

  **What to do**: Verify all tasks completed, all acceptance criteria met, build passes.
  **Agent**: oracle
  **Evidence**: .sisyphus/evidence/final-build.log

- [ ] F2. Final Verification Wave — Code Quality Review

  **What to do**: Review new components for clean patterns, no duplication, proper Vue conventions.
  **Agent**: unspecified-high

## Commit Strategy
- One commit per wave
- Message format: `feat(sidebar): [description]`

## Success Criteria
- `npm run build` passes
- Left sidebar with 4 groups renders on all pages
- Category nav + TOC correctly positioned in sidebar
- 30/70 ratio visible on desktop
- Responsive overlay on mobile
- All old sidebar layout code removed
