# Blog Enhancements — pangu, Reading Time, Prev/Next, RSS, Scroll-Progress

## TL;DR
> **Summary**: 5 independent improvements to the blog: Chinese typography auto-spacing (pangu.js), reading time + word count display, prev/next article navigation, RSS feed generation, and short-page scroll-progress auto-hide.
> **Deliverables**: 4 implementation tasks + 1 final verification
> **Effort**: Short
> **Parallel**: YES — 3 waves
> **Critical Path**: None (all tasks independent)

## Context
### Original Request
User wants: pangu.js integration, reading time + word count, prev/next navigation (no copyright, no tags), RSS feed generation, TIL section (deferred for discussion), and scroll-progress auto-hide on short pages.

### Interview Summary
- pangu.js: in `useContentRenderer.ts` via `pangu.spacingElementByClassName('.article-content')`
- Reading time + word count: compute from markdown text, show in article header
- Prev/Next: use `getNoteList()` sorted order, show nav links below article
- RSS: Vite plugin that generates `/rss.xml` at build time
- Scroll-progress auto-hide: hide when `docHeight <= window.innerHeight`

## Work Objectives
### Core Objective
Implement 5 independent blog features while maintaining existing functionality.

### Definition of Done (verifiable conditions with commands)
- Build passes: `npm run build` succeeds
- Tests pass: `npx vitest run` passes
- Each task verified independently

### Must NOT Have
- No changes to GitHub configs (.github/)
- No changes to content/markdown pipeline (marked, highlight.js)
- No copyright notice or tag display
- No TIL section (deferred)

## Execution Strategy
### Parallel Execution Waves

**Wave 1** (3 parallel tasks — independent):
- pangu.js integration
- Reading time + word count
- Scroll-progress auto-hide

**Wave 2** (2 parallel tasks — independent):
- Prev/Next navigation
- RSS feed generation

**Wave 3** (1 task):
- Final verification

## TODOs

- [ ] 1. Integrate pangu.js for CJK spacing

  **What to do**:
  1. Import `pangu` from `pangu/browser` in `src/utils/useContentRenderer.ts`
  2. Call `pangu.spacingElementByClassName('article-content')` inside the `renderContent()` nextTick, after `addCopyButtons()` and before `setupLightbox()`

  **Must NOT do**: Do not modify `renderMarkdown()` or `content.ts` pipeline. pangu runs on rendered DOM only.

  **Recommended Agent Profile**:
  - Category: `quick` — single import + one function call
  - Skills: [] — no specialized skill needed

  **Parallelization**: Wave 1 | Blocks: [] | Blocked By: []

  **References**:
  - Pattern: `src/utils/useContentRenderer.ts` — existing file to edit
  - API: `node_modules/pangu/dist/browser/pangu.d.ts` — `spacingElementByClassName(className: string): void`
  - External: `https://github.com/vinta/pangu.js` — docs

  **Acceptance Criteria**:
  - [ ] `npm run build` succeeds with `pangu/browser` import
  - [ ] `pangu.spacingElementByClassName` called with `'article-content'` in renderContent()

  **QA Scenarios**:
  ```
  Scenario: pangu spaces CJK and Latin text
    Tool: interactive_bash
    Steps:
      1. Create a test note with content "JavaScript教程"
      2. Navigate to the note page
      3. Check DOM: text between "JavaScript" and "教程" should have a space inserted
    Expected: "JavaScript" and "教程" are separated by a space in rendered HTML
    Evidence: .sisyphus/evidence/task-1-pangu.txt

  Scenario: pangu does not break code blocks
    Tool: interactive_bash
    Steps:
      1. Create a note with fenced code block containing CJK comments
      2. Navigate to the note page
      3. Check the pre code block remains intact
    Expected: Code block contents are not modified by pangu
    Evidence: .sisyphus/evidence/task-1-pangu-codeblock.txt
  ```

  **Commit**: YES | Message: `feat: integrate pangu.js for CJK text spacing` | Files: [`src/utils/useContentRenderer.ts`, `package.json`, `package-lock.json`]

- [ ] 2. Add reading time and word count to article header

  **What to do**:
  1. In `src/utils/markdown.ts`, add a `computeReadingStats(text: string)` function:
     - Strip markdown syntax (headings `#`, bold `**`, code fences, etc.) to get plain text
     - Count total characters (excluding whitespace)
     - Compute reading time: `Math.ceil(charCount / 300)` minutes (300 chars/min for mixed CJK/English)
     - Return `{ charCount, readingTime }`
  2. In `src/utils/content.ts`, call `computeReadingStats(content)` in `loadNote()` after getting the content string (before renderMarkdown)
     - Add `charCount` and `readingTime` fields to the `Note` interface
  3. In `src/pages/ArticleView.vue`, show reading time and word count in the header alongside the date:
     `<p class="text-xs txt-secondary">{{ note.date }} · {{ note.readingTime }} 分钟 · 约 {{ note.charCount }} 字</p>`
  4. In `src/pages/DocsPage.vue`, same display for `currentNote`

  **Must NOT do**: Do not modify the NoteMeta interface or getNoteList — these fields are only available after async loadNote.

  **Recommended Agent Profile**:
  - Category: `quick` — small utility function + Vue template changes
  - Skills: [`vue-tailwind-ts`] — Vue 3 patterns

  **Parallelization**: Wave 1 | Blocks: [] | Blocked By: []

  **References**:
  - Pattern: `src/utils/markdown.ts` lines 52-54 (`renderMarkdown` function)
  - Interface: `src/utils/content.ts` lines 14-18 (`Note` interface)
  - UI: `src/pages/ArticleView.vue` lines 52-53 (header with date)
  - UI: `src/pages/DocsPage.vue` lines ~115-120 (header area)
  - Skill: `vue-tailwind-ts` — component conventions

  **Acceptance Criteria**:
  - [ ] "N 分钟 · 约 M 字" appears in ArticleView for all notes
  - [ ] DocsPage also shows reading stats for currentNote
  - [ ] `npm run build` succeeds
  - [ ] `npx vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Reading stats shown
    Tool: interactive_bash
    Steps:
      1. Build and navigate to any note page
      2. Check the header area below the title
    Expected: Text like "2026-05-31 · 12 分钟 · 约 2400 字" is visible

  Scenario: Short notes show 1 minute
    Tool: interactive_bash
    Steps:
      1. Create a short note with <300 chars
      2. Navigate to it
    Expected: "1 分钟" is displayed (minimum 1)
  ```

  **Commit**: YES | Message: `feat: add reading time and word count to articles` | Files: [`src/utils/markdown.ts`, `src/utils/content.ts`, `src/pages/ArticleView.vue`, `src/pages/DocsPage.vue`]

- [ ] 3. Auto-hide scroll-progress on short pages

  **What to do**:
  In `src/components/ScrollProgress.vue`:
  1. After computing `docHeight`, add a check:
     ```ts
     const shouldShow = docHeight > window.innerHeight
     progress.value = shouldShow ? Math.min((scrollTop / docHeight) * 100, 100) : 0
     ```
  2. Add `v-if="visible"` to the template (instead of always rendering)
     ```ts
     const visible = ref(false)
     // in onScroll: visible.value = docHeight > window.innerHeight
     ```
  3. Apply the `:style` only when visible

  **Must NOT do**: Do not remove the component from App.vue — it should still render, just remain hidden with width=0 on short pages.

  **Recommended Agent Profile**:
  - Category: `quick` — single file change
  - Skills: [] — trivial refactor

  **Parallelization**: Wave 1 | Blocks: [] | Blocked By: []

  **References**:
  - File: `src/components/ScrollProgress.vue` — lines 8-14 (onScroll logic)
  - File: `src/components/ScrollProgress.vue` — line 2 (template)

  **Acceptance Criteria**:
  - [ ] ScrollProgress div is hidden (width 0 or transparent) when page content is shorter than viewport
  - [ ] ScrollProgress works normally on pages with content taller than viewport
  - [ ] `npm run build` succeeds

  **QA Scenarios**:
  ```
  Scenario: Short page hides progress bar
    Tool: interactive_bash
    Steps:
      1. Navigate to a short page (e.g., /about)
      2. Check if the scroll-progress element has width 0
    Expected: scroll-progress bar is not visible

  Scenario: Long page shows progress bar
    Tool: interactive_bash
    Steps:
      1. Navigate to a long note
      2. Scroll down
    Expected: scroll-progress bar width increases with scroll
  ```

  **Commit**: YES | Message: `fix: auto-hide scroll-progress on short pages` | Files: [`src/components/ScrollProgress.vue`]

- [ ] 4. Add prev/next navigation below articles

  **What to do**:
  1. In `src/utils/content.ts`, add `getAdjacentNotes(slug: string): { prev: NoteMeta | null; next: NoteMeta | null }`:
     - Get the sorted note list via `getNoteList()`
     - Find current note index
     - Return previous and next NoteMeta (null if at boundaries)
  2. In `src/pages/ArticleView.vue`, add a prev/next nav section below the article content:
     - Use `getAdjacentNotes(note.slug)` computed
     - Show "← 上一篇" (if prev exists) and "下一篇 →" (if next exists)
     - Style as text links with the `.interact-slide-bg` hover pattern
     - Use `router-link` for navigation
  3. The nav should be inside the `article` tag, after the `v-html` content div

  **Must NOT do**: Do not add copyright notice or tag display. Do not modify DocsPage prev/next (only ArticleView).

  **Recommended Agent Profile**:
  - Category: `unspecified-low` — small feature addition
  - Skills: [`vue-tailwind-ts`] — Vue 3 + Tailwind conventions

  **Parallelization**: Wave 2 | Blocks: [] | Blocked By: []

  **References**:
  - Function: `src/utils/content.ts` lines 54-67 (`getNoteList`)
  - Template: `src/pages/ArticleView.vue` lines 56-60 (article content area)
  - Style: `src/style.css` lines 202-211 (`.interact-slide-bg` pattern)
  - Skill: `vue-tailwind-ts` — Vue 3 component patterns

  **Acceptance Criteria**:
  - [ ] "← 上一篇" link appears on articles that are not the first in sorted order
  - [ ] "下一篇 →" link appears on articles that are not the last in sorted order
  - [ ] Both links use router-link and navigate correctly
  - [ ] Clicking prev/next loads the correct article
  - [ ] `npm run build` succeeds

  **QA Scenarios**:
  ```
  Scenario: Prev/next navigation visible
    Tool: interactive_bash
    Steps:
      1. Navigate to the second note in chronological order
      2. Check for prev and next links below the article
    Expected: Both "← 上一篇" and "下一篇 →" are visible

  Scenario: First article has no prev
    Tool: interactive_bash
    Steps:
      1. Navigate to the most recent note (first in sorted list)
      2. Check navigation area
    Expected: Only "下一篇 →" is shown (no prev link)

  Scenario: Click next navigates correctly
    Tool: interactive_bash
    Steps:
      1. On the first note, click "下一篇 →"
      2. Check the URL and article title
    Expected: Navigates to the next note chronologically
  ```

  **Commit**: YES | Message: `feat: add prev/next article navigation` | Files: [`src/utils/content.ts`, `src/pages/ArticleView.vue`]

- [ ] 5. Generate RSS feed at build time

  **What to do**:
  1. Create `src/utils/rssPlugin.ts` — a Vite plugin that:
     - Hooks into `buildEnd` or `closeBundle` phase
     - Reads frontmatter from all markdown files in `content/notes/` (same logic as `contentIndexPlugin`)
     - Generates an RSS 2.0 XML feed with entries for each note (title, date, link, description)
     - Writes to `dist/rss.xml`
  2. Register the plugin in `vite.config.ts`
  3. The RSS feed should:
     - Use site title "记录与分享"
     - Use site description from index.html meta
     - Use base URL `/didiberber3-github.io/`
     - Include ALL notes sorted by date descending
     - Each entry: title, pubDate, link, guid, description (first 200 chars of content)

  **Must NOT do**: Do not modify any source code files. Only add/create the plugin file and edit vite.config.ts.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` — build-time plugin
  - Skills: [] — standard Vite plugin pattern

  **Parallelization**: Wave 2 | Blocks: [] | Blocked By: []

  **References**:
  - Pattern: `src/utils/contentIndexPlugin.ts` — existing build-time plugin (same directory, same fs pattern)
  - Config: `vite.config.ts` — add plugin to plugins array
  - External: `https://validator.w3.org/feed/docs/rss2.html` — RSS 2.0 spec

  **Acceptance Criteria**:
  - [ ] `dist/rss.xml` is generated after `npm run build`
  - [ ] Contains valid RSS 2.0 XML (well-formed)
  - [ ] Contains entries for all notes with correct dates and links
  - [ ] npm run build succeeds

  **QA Scenarios**:
  ```
  Scenario: RSS file exists after build
    Tool: Bash
    Steps: npm run build && if exist "dist\rss.xml" echo FOUND
    Expected: FOUND
    Evidence: .sisyphus/evidence/task-5-rss-exists.txt

  Scenario: RSS XML is valid
    Tool: Bash
    Steps: Check file starts with <?xml version="1.0" encoding="UTF-8"?> and contains <rss> tag
    Expected: Valid RSS 2.0 structure
    Evidence: .sisyphus/evidence/task-5-rss-valid.txt
  ```

  **Commit**: YES | Message: `feat: generate RSS feed at build time` | Files: [`src/utils/rssPlugin.ts`, `vite.config.ts`]

## Final Verification Wave
- [ ] F1. Build + Test check — `npm run build` and `npx vitest run`
- [ ] F2. Feature verification (manual QA on dev server if available)
- [ ] F3. Scope fidelity — no accidental copyright/tags/TIL additions

## Commit Strategy
5 separate commits, one per task. The agent can batch them if clean.

## Success Criteria
- pangu.js spaces CJK text correctly without breaking code blocks
- Every article shows "N 分钟 · 约 M 字" in header
- Scroll-progress auto-hides on short pages (About, Home)
- Prev/Next links navigate between articles chronologically
- `/rss.xml` is generated at build time with valid RSS 2.0
