# Category Card Redesign — Editorial Spread (Direction A)

## TL;DR
> **Summary**: Redesign the docs-home category cards from oversized watermark style to left-aligned list-style layout — category name at 2.25rem bold top-left, optional subtitle line, count at bottom-right with hover reveal.
> **Deliverables**: Updated `src/pages/DocsPage.vue` (live page) + `src/pages/DocsText.vue` (prototype page, same change for consistency)
> **Effort**: Quick
> **Parallel**: YES – 2 independent files
> **Critical Path**: N/A

## Context
### Original Request
User prototyped an "Editorial Spread" section (section 05 in DocsText.vue) with flex-based hover selection. Currently it uses an absolute-positioned 4.5rem watermark at top-left (overflow hidden for long names) and a bottom-right counter. The user wants to redesign the card layout to Direction A:

```
┌──────────────────────────────────────┐
│                                       │
│   分类名 (2.25rem, bold)              │
│   subtitle / 描述 (optional)          │
│                                       │
│                          12 篇 (右下)  │
└──────────────────────────────────────┘
```

### Interview Summary
- Direction A chosen: left-aligned, no overflow clipping, category name in normal flow
- Subtitle is optional (can add later, not blocking)
- Count remains bottom-right absolute, hidden by default, slides in on hover/active
- Hover selection logic unchanged (flex 0 0 50% on active)

### Acceptance Criteria (Definition of Done)
- [ ] `src/pages/DocsPage.vue` — `.edit-bignum` changed from absolute overflow watermark to in-flow left-aligned text
- [ ] `src/pages/DocsPage.vue` — card padding adjusted (top 2rem, bottom 1rem for count space)
- [ ] `src/pages/DocsPage.vue` — count positioning unchanged (absolute bottom-right)
- [ ] `src/pages/DocsPage.vue` — all long category names display fully (no overflow hidden)
- [ ] `src/pages/DocsPage.vue` — build passes (`npm run build`)
- [ ] `src/pages/DocsText.vue` — same changes applied for consistency
- [ ] Hover/flex selection behavior preserved

### Out of Scope
- Adding actual subtitle text/content (infrastructure only, actual text TBD)
- Changing the hover/flex selection mechanism
- Changing the count styling/font

## Execution Strategy
### Parallel Waves
Wave 1 (independent): Both files can be edited in parallel.

### Agent Dispatch
- Wave 1, 2 tasks: `quick` agent per file — both are simple CSS + minor template changes

## TODOs

- [ ] 1. Redesign `.edit-card` layout in DocsPage.vue

  **What to do**: 
  1. Change `.edit-card` padding from `3.5rem 1.5rem 0.75rem` → `2rem 1.5rem 1rem`
  2. Remove `align-items: flex-start` from `.edit-card` (let default `stretch` handle it, or keep — verify)
  3. Change `.edit-bignum` from absolute-positioned overflow watermark → in-flow block element:
     - Remove `position: absolute; top: -0.15rem; left: 0; overflow: hidden; white-space: nowrap; max-width: 90%; pointer-events: none;`
     - Keep font-size 2.25rem, font-weight 900, line-height 1, color, opacity, user-select
     - Change to `display: block; position: static; margin-bottom: 0.25rem;`
  4. Add optional subtitle placeholder: `<span class="edit-sub" v-if="false">可选描述</span>` (rendered but hidden, easy to activate)
  5. Count (`.edit-body`) stays unchanged (absolute bottom-right)
  6. Mobile: adjust padding to `2rem 1rem 0.6rem`, keep count same

  **Must NOT do**:
  - Do NOT change the flex selection logic (`isSelected`, `selectedFlex`, `unselectedFlex`)
  - Do NOT remove the count element
  - Do NOT change `transition` timings

  **Recommended Agent Profile**:
  - Category: `quick` — single component, simple CSS + template changes
  - Skills: `[]` — no specialized skills needed

  **References**:
  - Existing file: `src/pages/DocsPage.vue` lines 155–192 (current edit-card CSS)
  - Existing file: `src/pages/DocsPage.vue` lines 49–65 (template)
  - User's chosen design: Direction A (left-aligned list style)

  **Acceptance Criteria**:
  - [ ] `.edit-bignum` is in-flow, not absolute positioned
  - [ ] Category name visible without overflow clipping
  - [ ] Layout matches: name top-left, count bottom-right
  - [ ] `npm run build` passes with no errors

  **QA Scenarios**:
  ```
  Scenario: Category name displays fully
    Tool: interactive_bash
    Steps: Build project with `npm run build`
    Expected: Build succeeds

  Scenario: Visual layout check
    Tool: Playwright
    Steps: 
      1. Navigate to /docs
      2. Wait for category cards to render
      3. Screenshot and verify name is left-aligned, not overflow clipped
    Expected: Category names fully visible, count at bottom-right
    Evidence: .sisyphus/evidence/task-1-card-layout.png
  ```

  **Commit**: YES | Message: `feat(docs): redesign category card layout to Direction A` | Files: `src/pages/DocsPage.vue`

- [ ] 2. Redesign `.edit-card` layout in DocsText.vue (prototype consistency)

  **What to do**: Apply identical changes to `src/pages/DocsText.vue` section 05.
  Same changes as Task 1:
  - Padding: `3.5rem 1.5rem 0.75rem` → `2rem 1.5rem 1rem`
  - `.edit-bignum` from absolute → static in-flow block
  - Add `.edit-sub` placeholder (hidden: `display: none` or `v-if="false"`)
  - Keep count unchanged
  - Mobile padding adjustment

  **Must NOT do**: Same exclusions as Task 1.

  **Recommended Agent Profile**:
  - Category: `quick`
  - Skills: `[]`

  **References**:
  - `src/pages/DocsText.vue` lines 293–331 (section 05 CSS)
  - `src/pages/DocsText.vue` lines 147–163 (template)
  - Task 1 changes applied to DocsPage.vue (mirror exactly)

  **Acceptance Criteria**:
  - [ ] Identical layout change as DocsPage.vue
  - [ ] `npm run build` passes

  **QA Scenarios**:
  ```
  Scenario: Build passes with changes
    Tool: Bash
    Steps: `npm run build`
    Expected: Build succeeds, no errors
    Evidence: .sisyphus/evidence/task-2-build.txt
  ```

  **Commit**: NO (squash with Task 1) | Files: `src/pages/DocsText.vue`

## Final Verification Wave
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (verify visual layout matches Direction A)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
Single commit: `feat(docs): redesign category card layout to Direction A` with both files.

## Success Criteria
- Category names display fully without overflow clipping
- Left-aligned layout: name at top-left, optional subtitle below, count bottom-right
- Hover selection (flex 50%) unaffected
- Build passes
