# Code Block Collapse/Expand for Long Code Blocks

## TL;DR
> **Summary**: Add a fold/expand toggle to code blocks taller than 15 lines. Large code blocks in your notes (some are 50+ lines) will be collapsed by default with a "展开全部 N 行" button, and can be expanded on click.
> **Deliverables**: JS logic in `reader.ts`, CSS styles in `style.css`, wired in `useContentRenderer.ts`
> **Effort**: Short (1 task)
> **Parallel**: NO (single task)
> **Critical Path**: None

## Context
### Original Request
"现在的代码块大都很长，我需要大代码块的折叠与展开功能" — Large code blocks (some 50+ lines) need a collapse/expand toggle.

### Existing Infrastructure
- `reader.ts`: `addCopyButtons()` already processes each `pre` element, adding a copy button
- `useContentRenderer.ts`: Calls `addCopyButtons()` + `setupLightbox()` on content mount
- Code blocks have a `.copy-btn` positioned absolutely at top-right
- Highlight.js runs on `.article-content pre code` elements

## Work Objectives
### Core Objective
Add collapse/expand toggle to code blocks with >15 lines.

### Definition of Done
- [ ] `npm run build` succeeds
- [ ] Code blocks with ≤15 lines render normally (no toggle)
- [ ] Code blocks with >15 lines show a "展开全部 N 行" button and are collapsed by default
- [ ] Clicking the toggle expands the code block to full height
- [ ] Once expanded, a "收起" button is available (or the toggle flips)
- [ ] The copy button continues to work on both collapsed and expanded states
- [ ] Highlight.js highlighting is unaffected

### Must NOT Have
- Do not modify how highlight.js works
- Do not break the existing copy button functionality
- Do not use Vue components for this (keep it in vanilla JS like the rest of reader.ts)
- No changes to the markdown rendering pipeline

## TODOs

- [ ] 1. Implement code block fold/unfold

  **What to do**:

  ### Step 1: Add CSS styles to `src/style.css`
  Add after the `.copy-btn` section (around line 413):

  ```css
  /* ── Code block fold ── */
  .pre-wrap {
    position: relative;
  }
  .pre-wrap.collapsed {
    max-height: 280px;
    overflow: hidden;
  }
  .pre-wrap.collapsed::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(transparent, var(--code-bg));
    pointer-events: none;
    transition: opacity 0.25s;
  }
  /* Hide fade gradient when expanded or when collapse button is hovered */
  .pre-wrap:not(.collapsed)::after,
  .pre-wrap.collapsed .fold-btn:hover + .pre-wrap::after {
    opacity: 0;
  }

  .fold-btn {
    display: block;
    width: 100%;
    padding: 0.375rem 0;
    font-size: 0.75rem;
    font-family: inherit;
    color: var(--text-muted);
    background: none;
    border: 1px solid var(--code-border);
    border-top: 0;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
    text-align: center;
  }
  .fold-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
    background-color: var(--accent-bg);
  }
  .fold-btn .fold-arrow {
    display: inline-block;
    transition: transform 0.2s;
    margin-right: 0.25rem;
  }
  .fold-btn.expanded .fold-arrow {
    transform: rotate(180deg);
  }
  ```

  ### Step 2: Add `addCodeFold()` function to `src/utils/reader.ts`

  ```ts
  const FOLD_THRESHOLD = 15 // lines

  export function addCodeFold(container: HTMLElement): void {
    container.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.fold-btn')) return

      const code = pre.querySelector('code')
      if (!code) return

      const lineCount = (code.textContent || '').split('\n').length
      if (lineCount <= FOLD_THRESHOLD) return

      // Wrap pre in a div for controlled collapsing
      const wrap = document.createElement('div')
      wrap.className = 'pre-wrap collapsed'
      pre.parentNode?.insertBefore(wrap, pre)
      wrap.appendChild(pre)

      // Create fold toggle button
      const btn = document.createElement('button')
      btn.className = 'fold-btn'
      btn.innerHTML = `<span class="fold-arrow">▸</span> 展开全部 ${lineCount} 行`

      let isExpanded = false
      btn.addEventListener('click', () => {
        isExpanded = !isExpanded
        wrap.classList.toggle('collapsed', !isExpanded)
        btn.classList.toggle('expanded', isExpanded)
        btn.innerHTML = isExpanded
          ? `<span class="fold-arrow">▾</span> 收起`
          : `<span class="fold-arrow">▸</span> 展开全部 ${lineCount} 行`
      })

      wrap.parentNode?.insertBefore(btn, wrap.nextSibling)
    })
  }
  ```

  ### Step 3: Wire into `src/utils/useContentRenderer.ts`

  Import `addCodeFold` and call it after `addCopyButtons`:

  ```ts
  import { addCopyButtons, addCodeFold, setupLightbox } from './reader'

  // in renderContent nextTick, after addCopyButtons:
  addCodeFold(contentRef.value)
  ```

  **Must NOT do**: Do not use the `pre.style.position = 'relative'` that copy-btn uses — the `.pre-wrap` div handles positioning.

  **Recommended Agent Profile**:
  - Category: `quick` — single feature, 3 files
  - Skills: [] — standard DOM + CSS patterns

  **Parallelization**: Wave 1 (only task) | Blocks: [F1] | Blocked By: []

  **References**:
  - Pattern: `src/utils/reader.ts` lines 7-33 (`addCopyButtons` pattern: querySelectorAll, guard clause, button creation, append)
  - Wired in: `src/utils/useContentRenderer.ts` lines 9-17
  - Style section: `src/style.css` lines 387-413 (`.copy-btn` section — add fold styles after)
  - Existing code block style: `src/style.css` lines 455-471 (`.prose pre` styles)

  **Acceptance Criteria**:
  - [ ] `npm run build` succeeds
  - [ ] Short code blocks (≤15 lines) have no fold button
  - [ ] Long code blocks (>15 lines) show fold button and are collapsed
  - [ ] Clicking fold button expands the code block
  - [ ] Clicking again collapses it
  - [ ] Copy button still works on all code blocks
  - [ ] `npx vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Long code block is collapsed by default
    Tool: Playwright
    Steps:
      1. Navigate to a note with a 50+ line code block (e.g., Java notes)
      2. Wait for the page to fully render
      3. Check that the pre element's parent has class "collapsed"
      4. Check that a "展开全部" button exists below the pre
    Expected: pre is inside .pre-wrap.collapsed, fold-btn shows line count
    Evidence: .sisyphus/evidence/task-1-fold-collapsed.txt

  Scenario: Click expands the code block
    Tool: Playwright
    Steps:
      1. Navigate to a note with a long code block
      2. Click the "展开全部" button
      3. Check that .pre-wrap no longer has "collapsed" class
      4. Check that button text changes to "收起"
    Expected: Code block expands to full height, button shows "收起"

  Scenario: Short code block has no fold
    Tool: Playwright
    Steps:
      1. Navigate to a note with a short inline code block or short fenced block
      2. Check for .fold-btn element
    Expected: No .fold-btn is created for ≤15 line blocks
  ```

  **Commit**: YES | Message: `feat: add collapse/expand for long code blocks` | Files: [`src/utils/reader.ts`, `src/utils/useContentRenderer.ts`, `src/style.css`]

## Final Verification Wave
- [ ] F1. Build: `npm run build` passes
- [ ] F2. Test: `npx vitest run` passes
- [ ] F3. Manual: Verify on a long code block note that fold/unfold works correctly
- [ ] F4. Manual: Verify a short code block note has no fold button

## Commit Strategy
Single commit with the feature.

## Success Criteria
- All code blocks >15 lines have fold/expand toggle
- Copy button works regardless of fold state
- Visual transition is smooth
- No regression in existing code block styling
