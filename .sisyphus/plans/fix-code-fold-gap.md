# Fix Code Block Fold — Gap & Style Disconnect

## TL;DR
> **Summary**: Two-line CSS fix to eliminate the visual gap between code block and fold button, and match the button background to the code block.
> **Deliverables**: Updated `src/style.css` with corrected `.pre-wrap` and `.fold-btn` rules.
> **Effort**: Quick
> **Parallel**: NO — single file, sequential edits
> **Critical Path**: Edit CSS → build → visual verify

## Context
### Original Request
Fix code block fold visual issue — gap between the expanded code block and the "收起" button; button style disconnected from code block background.

### Interview Summary
Diagnosis completed via analysis of Tailwind Typography source (`node_modules`):
- Line 109-110 in `styles.js`: `pre { marginTop: em(20, 12); marginBottom: em(20, 12) }` generates `margin-bottom: 1.6666667em` on `<pre>`.
- `.pre-wrap` wraps `<pre>`, but has no `padding-bottom` or `border-bottom` — the `<pre>`'s margin **collapses** through `.pre-wrap`, creating space between `pre` content and `.fold-btn`.
- `.fold-btn { background: none }` makes button transparent against page background instead of matching `var(--code-bg)`.

### Root Cause
- **Gap**: CSS margin collapsing. Tailwind sets `margin-bottom: 1.6666667em` on `pre`. Since `.pre-wrap` has `position: relative` but no padding/border/overflow, the child margin escapes the wrapper and pushes `.fold-btn` downward.
- **Style**: `.fold-btn` inherits no background, appearing as a floating transparent element disconnected from the code block.

## Work Objectives
### Core Objective
Eliminate the gap and make the fold button look like a seamless extension of the code block.

### Deliverables
- Updated `src/style.css` with two targeted CSS changes

### Definition of Done
- [ ] `pnpm build` succeeds with zero errors
- [ ] Visual inspection shows NO gap between expanded code block and fold button
- [ ] Fold button background matches code block background (`var(--code-bg)`)
- [ ] Hover state on fold button still shows distinct accent styling
- [ ] Collapsed state gradient overlay remains visually correct

### Must Have
- Gap between code block and fold button eliminated (collapsing margin fixed)
- Fold button background matches code block background
- Original Tailwind Typography unchanged (no CSS overrides of prose defaults outside our scoped selectors)
- All 18 tests still pass

### Must NOT Have
- No changes to the `pre` element's own margin (other prose elements depend on it)
- No changes to Tailwind Typography config or node_modules
- No HTML/structure changes to reader.ts

## Verification Strategy
- Test decision: Vitest (existing) — test suite must pass
- QA policy: Scenarios below for each fix
- Evidence: `.sisyphus/evidence/`

## Execution Strategy
### Parallel Execution Waves
Wave 1: [Single task — CSS edits]

### Dependency Matrix
Task 1 → Verify (build + visual)

## TODOs

- [ ] 1. Fix `.pre-wrap` margin collapse + `.fold-btn` background

  **What to do**:
  1. In `src/style.css`, add `overflow: hidden;` to `.pre-wrap` (line ~416).
     - This creates a new block formatting context, containing the `<pre>` child's margin inside the wrapper.
     - Prevents the Tailwind `pre { margin-bottom: 1.6666667em }` from collapsing through and pushing `.fold-btn` down.
  2. In `src/style.css`, change `.fold-btn` (line ~444) `background: none;` to `background: var(--code-bg);`.
     - Makes the button visually continuous with the code block background.
     - The hover state still has `background-color: var(--accent-bg)` which overrides on hover.

  **Must NOT do**:
  - Do NOT modify the `<pre>` margin or Tailwind Typography config.
  - Do NOT change `reader.ts` or HTML structure.
  - Do NOT add `margin-bottom: 0` override on `pre` (that's broader scoping than needed).

  **Files**:
  - `src/style.css:416` — add `overflow: hidden` to `.pre-wrap`
  - `src/style.css:444` — change `background: none` to `background: var(--code-bg)` in `.fold-btn`

  **Recommended Agent Profile**:
  - Category: `quick` — single file, two-line CSS edits, no structural changes
  - Skills: none needed
  - Omitted: n/a

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [verify] | Blocked By: none

  **References**:
  - Pattern: existing `.pre-wrap` CSS `src/style.css:416-418`
  - CSS principle: `overflow: hidden` creates a new BFC, preventing margin collapse (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)
  - Variable: `var(--code-bg)` — defined elsewhere in same file and used by `.prose pre`

  **Acceptance Criteria**:
  - [ ] `pnpm build` succeeds with zero errors
  - [ ] `pnpm test` passes all 18 tests

  **QA Scenarios**:
  ```
  Scenario: Code block expanded — no gap between pre and fold button
    Tool: interactive_bash / Browser (Playwright)
    Steps: 1. Build: `pnpm build`
           2. Start dev server: `pnpm dev` (or open built HTML)
           3. Navigate to a page with a code block longer than 280px
           4. Click "展开" / "expand" button on a collapsed code block
           5. Inspect the gap between expanded code block bottom and fold button
    Expected: No visible gap. The fold button sits flush against the code block.
    Evidence: .sisyphus/evidence/task-1-no-gap.png

  Scenario: Fold button background matches code block
    Tool: interactive_bash / Browser (Playwright)
    Steps: 1. Open page with code block in browser
           2. Inspect `.fold-btn` computed style or examine visually
           3. Check that `background-color` of fold button equals `var(--code-bg)` of `.prose pre`
    Expected: `background: var(--code-bg)` is applied, matching the code block.
    Evidence: .sisyphus/evidence/task-1-style-match.png

  Scenario: Fold button hover still works
    Tool: Browser
    Steps: 1. Hover over fold button
           2. Check that accent styling (color, border-color) appears
    Expected: Hover state still shows `color: var(--accent); border-color: var(--accent); background-color: var(--accent-bg)`
    Evidence: .sisyphus/evidence/task-1-hover.png

  Scenario: Collapsed state still shows gradient overlay
    Tool: Browser
    Steps: 1. Refresh page with code block > 280px
           2. Verify collapsed gradient overlay appears at bottom of code block
    Expected: `.pre-wrap.collapsed::after` renders gradient
    Evidence: .sisyphus/evidence/task-1-collapsed.png
  ```

  **Commit**: YES | Message: `fix(style): code block fold gap and button background` | Files: `["src/style.css"]`

## Final Verification Wave
- [ ] F1. Plan Compliance Audit — verify both CSS changes were applied, no structural changes
- [ ] F2. Code Quality Review — check no side effects on other prose elements
- [ ] F3. Real Manual QA — open browser, inspect gap, button background, hover, collapsed state
- [ ] F4. Scope Fidelity Check — confirm no changes to reader.ts or Tailwind config

## Commit Strategy
Single commit: `fix(style): code block fold gap and button background` on `src/style.css`.

## Success Criteria
1. `pnpm build` succeeds
2. `pnpm test` passes
3. Visual gap between expanded code block and fold button is eliminated
4. Fold button background matches code block background (`var(--code-bg)`)
5. All original functionality (collapsed state, hover, gradient) preserved
