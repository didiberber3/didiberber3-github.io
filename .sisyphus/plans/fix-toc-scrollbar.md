# Fix: TOC Scrollbar & Remove "目录" Labels

## Problem
1. Right TOC sidebar can't scroll — items overflow and are hidden behind viewport
2. User doesn't want "目录" label on either left sidebar or right TOC

## Root Cause of Scrollbar
`.docs-toc` has `overflow: hidden` and `max-height: calc(100vh - 2rem)`. The `overflow: hidden` clips the child `.docs-toc-nav`'s scrollbar, preventing `overflow-y: auto` from working. The child can't establish its own scroll container because the parent clips overflow at the container level.

## Changes

### 1. CSS — Fix TOC scrollbar
**File**: `D:\Test1\src\pages\DocsPage.vue`

**.docs-toc** (around line 328):
- Remove `overflow: hidden` — was preventing child's scrollbar from working
- Keep `display: flex; flex-direction: column` for layout
- Keep `max-height: calc(100vh - 2rem)` as the constraint
- Keep `padding: 0` (already set)

**.docs-toc-nav** (around line 350):
- Change `overflow-y: auto` → `overflow-y: scroll` to always show scrollbar
- Keep `flex: 1; min-height: 0` for proper flex height constraint
- Keep `gap: 0.125rem`, `padding-bottom: 1rem`

### 2. Template — Remove "目录" labels
**File**: `D:\Test1\src\pages\DocsPage.vue`

Line 101: Delete `<div class="docs-sidebar-label">目录</div>`
Line 141: Delete `<div class="docs-toc-label">目录</div>`

### 3. Style cleanup — Remove unused CSS classes
After removing those divs, these CSS rules are orphaned:
- `.docs-sidebar-label` (lines 283-291)
- `.docs-toc-label` (lines 340-348)

Delete both rule blocks to keep CSS clean.

## Verification
- `npm run build` passes with no errors
- Left sidebar shows note list with no "目录" header
- Right TOC shows article headings with no "目录" header
- Right TOC has a visible scrollbar when content overflows
- Scrollbar works properly (can click and drag)
