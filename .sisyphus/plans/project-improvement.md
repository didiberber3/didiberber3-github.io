# Test1 项目综合改进计划

## TL;DR
> **Summary**: 围绕 skill 补充、工程化基建、代码清理、架构改进 4 个维度，系统性提升 Test1 博客项目质量。
> **Deliverables**: 4 个新 skill · vitest+ESLint+Prettier 配置 · composable 提取 · hash→history 路由迁移 · 死代码清理 · SEO meta
> **Effort**: Large
> **Parallel**: YES — 4 waves
> **Critical Path**: Task 1(依赖) → Task 11(路由) → Task 16(验证)

## Context
### Original Request
> "不需要去除重叠 skill，补技能，工程化升级，代码清理，改进架构"

### Interview Summary
所有关键决策已确认：
| 决策 | 选择 |
|------|------|
| 测试 | vitest + 基础配置 + 示例测试 |
| 代码规范 | ESLint flat config + Prettier |
| 依赖升级 | 只升不破坏构建的安全版本 |
| 路由 | hash → history + SPA fallback |
| 重复代码 | 提取为 useContentRenderer composable |
| 死代码 | 删除 AppSidebar 占位组 |
| 弃用 API | 替换 document.execCommand |
| SEO | 加基础 meta 标签 |
| 遗留文件 | 清理 .sisyphus 旧 artifacts |
| 新技能 | Vue 3 + Tailwind/TS + 测试 + CI/CD 方向（不贪多） |

## Work Objectives
### Core Objective
系统性提升 Test1 项目的 skill 支持、工程化水平、代码质量和架构一致性。

### Deliverables
1. 4 个新 skill 文件 (`.agents/skills/`)
2. vitest + @vue/test-utils 配置
3. ESLint flat config + Prettier 配置
4. `useContentRenderer` composable + 3 个页面重构
5. hash → history 路由迁移 + 404.html
6. AppSidebar 死代码删除 + reader.ts 弃用 API 替换
7. index.html SEO meta 补充
8. .sisyphus 旧 artifacts 清理
9. 安全依赖升级 + CI 更新

### Definition of Done
- `npm run build` 零错误通过
- `npm run lint` 通过（配置正确）
- `npm run test` 通过（vitest 可运行）
- 所有页面路由正常（history 模式）
- 清理后无残留旧 artifacts

### Must Have
- 新技能文件创建在 `.agents/skills/` 下并在 `skills-lock.json` 注册
- vitest 能运行并至少有一个示例测试
- ESLint + Prettier 配置对所有 `src/**/*.{vue,ts}` 生效
- 3 个页面改用 `useContentRenderer` composable（行为不变）
- 路由切换 history 模式后 GitHub Pages 可正常部署
- AppSidebar 只有实际使用的组（分类导航 + 目录），无占位组

### Must NOT Have
- 不删除/去重现有的 13 个 design skill
- 不触及 UI 设计、色彩体系、布局样式
- 不新增业务功能页面
- 不改变 content/notes 和 content/shares 的内容结构

---

- [ ] 7. **删除 AppSidebar 死代码**

  **What to do**:
  打开 `D:\Test1\src\components\AppSidebar.vue`，执行以下删除：
  - 删除 `<template>` 中的 `.sidebar-group-profile` 区块（第 23-29 行：profile avatar + name + bio）
  - 删除 `.sidebar-group-announcement` 区块（第 60-63 行：公告组）
  - 删除对应的 scoped CSS 区块（第 121-135 行：`.sidebar-group-profile`, `.sidebar-group-announcement` 及 `:has()` 规则）
  - 保留 `.sidebar-group-label` 样式和其他正常使用的样式

  删除后验证组件结构：分类导航 + 目录两个实际组正常，中间用 `.sidebar-separator` 分隔。

  **Must NOT do**: 不要修改分类导航和目录组的功能。不要删除 `.sidebar-separator` 样式。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单一文件精确删除
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: []

  **References**:
  - `D:\Test1\src\components\AppSidebar.vue` - target file, lines 22-29 (profile), 60-66 (announcement), 121-135 (css)

  **Acceptance Criteria**:
  - [ ] AppSidebar.vue 不包含 `.sidebar-group-profile` 或 `.sidebar-group-announcement` 相关代码
  - [ ] AppSidebar 正常渲染分类导航 + 目录组
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: Dead code removed
    Tool: Bash (grep)
    Steps: cd D:\Test1 && findstr "sidebar-group-profile" src\components\AppSidebar.vue || echo "REMOVED"
    Expected: REMOVED (no match found)
    Evidence: .sisyphus/evidence/task-7-deadcode-removed.txt

  Scenario: Build passes
    Tool: Bash
    Steps: cd D:\Test1 && npm run build 2>&1
    Expected: exit code 0
    Evidence: .sisyphus/evidence/task-7-build.txt
  ```

  **Commit**: YES | Message: `refactor(sidebar): remove dead profile and announcement placeholder groups` | Files: [src/components/AppSidebar.vue]

---

- [ ] 8. **创建 useContentRenderer composable**

  **What to do**:
  在 `src/utils/` 下创建 `useContentRenderer.ts`，将 ArticleView、ShareView、DocsPage 三处重复的渲染后处理逻辑提取为共享 composable。

  ```typescript
  // src/utils/useContentRenderer.ts
  import { ref, nextTick, onUnmounted, type Ref } from 'vue'
  import { highlightBlocks } from './highlight'
  import { addCopyButtons, setupLightbox } from './reader'

  export function useContentRenderer() {
    const contentRef = ref<HTMLElement | null>(null)
    let cleanupLightbox: (() => void) | null = null

    function renderContent() {
      nextTick(() => {
        highlightBlocks()
        if (contentRef.value) {
          addCopyButtons(contentRef.value)
          cleanupLightbox?.()
          cleanupLightbox = setupLightbox(contentRef.value)
        }
      })
    }

    onUnmounted(() => cleanupLightbox?.())

    return { contentRef, renderContent }
  }
  ```

  **Must NOT do**: 不要引入额外依赖。不要改变 highlight.ts 或 reader.ts 的接口。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单一文件创建，简单逻辑提取
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [9,10,11] | Blocked By: []

  **References**:
  - `D:\Test1\src\utils\highlight.ts` - import highlightBlocks
  - `D:\Test1\src\utils\reader.ts` - import addCopyButtons, setupLightbox
  - `D:\Test1\src\pages\ArticleView.vue` - pattern to extract (lines 8-10, 15-16, 25-33, 37)
  - `D:\Test1\src\pages\ShareView.vue` - same pattern (lines 8-10, 15-16, 25-33, 37)
  - `D:\Test1\src\pages\DocsPage.vue` - same pattern (lines 9-10, 19-20, 37-44, 78)

  **Acceptance Criteria**:
  - [ ] `src/utils/useContentRenderer.ts` 存在
  - [ ] 导出 `useContentRenderer` 函数
  - [ ] 包含 `contentRef`, `renderContent` 和自动清理逻辑

  **QA Scenarios**:
  ```
  Scenario: File exists with correct exports
    Tool: Bash
    Steps: cd D:\Test1 && findstr "export function useContentRenderer" src\utils\useContentRenderer.ts
    Expected: match found (function exported)
    Evidence: .sisyphus/evidence/task-8-composable-export.txt
  ```

  **Commit**: NO (merge with task 9/10/11 commit)

---

- [ ] 9. **重构 ArticleView 使用 composable**

  **What to do**:
  修改 `ArticleView.vue`：
  - 删除 `import { highlightBlocks } from '../utils/highlight'`
  - 删除 `import { addCopyButtons, setupLightbox } from '../utils/reader'`
  - 添加 `import { useContentRenderer } from '../utils/useContentRenderer'`
  - 删除 `const contentRef = ref<HTMLElement | null>(null)` 和 `let cleanupLightbox`
  - 删除 `onUnmounted(() => cleanupLightbox?.())`
  - 替换为 `const { contentRef, renderContent } = useContentRenderer()`
  - 将 `nextTick(() => { ... })` 块替换为 `renderContent()`

  **Must NOT do**: 不要改变模板结构。不要改变 load 函数的 async 流程。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单一文件重构，模式替换
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: [8]

  **References**:
  - `D:\Test1\src\pages\ArticleView.vue` - target file
  - `D:\Test1\src\utils\useContentRenderer.ts` - new composable

  **Acceptance Criteria**:
  - [ ] ArticleView.vue 不再直接 import highlight.ts 或 reader.ts
  - [ ] ArticleView.vue 使用 `useContentRenderer()`
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: Verify imports changed
    Tool: Bash
    Steps: cd D:\Test1 && findstr "from '../utils/highlight'" src\pages\ArticleView.vue || echo "NO_HIGHLIGHT_IMPORT" && findstr "useContentRenderer" src\pages\ArticleView.vue
    Expected: NO_HIGHLIGHT_IMPORT and useContentRenderer found
    Evidence: .sisyphus/evidence/task-9-articleview-refactored.txt
  ```

  **Commit**: NO (merge with task 10/11 commit)

---

- [ ] 10. **重构 ShareView 使用 composable**

  **What to do**:
  与 task 9 完全相同，目标文件改为 `ShareView.vue`。
  替换 import、删除旧变量、使用 `useContentRenderer()`。

  **Must NOT do**: 不要修改 visit-url prop 逻辑。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 与 task 9 相同的模式
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES (with task 9) | Wave 2 | Blocks: [] | Blocked By: [8]

  **References**:
  - `D:\Test1\src\pages\ShareView.vue` - target file
  - `D:\Test1\src\utils\useContentRenderer.ts` - new composable

  **Acceptance Criteria**:
  - [ ] ShareView.vue 使用 `useContentRenderer()` 而非直接 import
  - [ ] `npm run build` 通过

  **QA Scenarios**: Same pattern as task 9.

  **Commit**: NO (merge with task 9/11 commit)

---

- [ ] 11. **重构 DocsPage 使用 composable**

  **What to do**:
  与 task 9 相同，目标文件为 `DocsPage.vue`。
  替换 import、删除旧变量、删除 `onUnmounted`、使用 `useContentRenderer()`。
  特别注意：DocsPage 的 `selectNote()` 中有 `nextTick(() => { ... })` 块需要替换。

  **Must NOT do**: 不要修改路由监听和分类选择的逻辑。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 与 task 9 相同的模式
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES (with task 9,10) | Wave 2 | Blocks: [] | Blocked By: [8]

  **References**:
  - `D:\Test1\src\pages\DocsPage.vue` - target file
  - `D:\Test1\src\utils\useContentRenderer.ts` - new composable

  **Acceptance Criteria**:
  - [ ] DocsPage.vue 使用 `useContentRenderer()` 而非直接 import
  - [ ] `npm run build` 通过

  **QA Scenarios**: Same pattern as task 9.

  **Commit**: YES | Message: `refactor: extract content rendering to useContentRenderer composable` | Files: [src/utils/useContentRenderer.ts, src/pages/ArticleView.vue, src/pages/ShareView.vue, src/pages/DocsPage.vue]

---

- [ ] 12. **替换 document.execCommand 弃用 API**

  **What to do**:
  修改 `src/utils/reader.ts` 中的 `addCopyButtons` 函数：
  - 删除 `document.execCommand('copy')` 的整个 fallback 分支（第 23-30 行）
  - 仅保留 `navigator.clipboard.writeText(code)` 路径
  - 在 catch 块中添加 `console.warn('Clipboard API not available:', err)` 静默降级

  **Must NOT do**: 不要引入新的 polyfill 或第三方库。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单一文件小修改
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: []

  **References**:
  - `D:\Test1\src\utils\reader.ts` - target file, lines 21-33

  **Acceptance Criteria**:
  - [ ] `reader.ts` 中不再包含 `document.execCommand`
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: Deprecated API removed
    Tool: Bash
    Steps: cd D:\Test1 && findstr "execCommand" src\utils\reader.ts || echo "REMOVED"
    Expected: REMOVED
    Evidence: .sisyphus/evidence/task-12-execcommand-removed.txt
  ```

  **Commit**: YES | Message: `fix(reader): replace deprecated document.execCommand with Clipboard API` | Files: [src/utils/reader.ts]

---

- [ ] 13. **添加 SEO meta 标签**

  **What to do**:
  修改 `D:\Test1\index.html`，在 `<head>` 中添加：
  ```html
  <meta name="description" content="个人学习笔记与技术分享 — Java、前端、开发工具" />
  <meta property="og:title" content="记录与分享" />
  <meta property="og:description" content="个人学习笔记与技术分享 — Java、前端、开发工具" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  ```

  保留现有的 `<title>` 和 `<meta charset>` 和 `<meta name="viewport">`。

  **Must NOT do**: 不要删除或修改现有 meta 标签。不要添加不存在的图标路径。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单一文件小修改
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: []

  **References**:
  - `D:\Test1\index.html` - target file

  **Acceptance Criteria**:
  - [ ] index.html 包含 description, og:title, og:description, og:type, twitter:card meta
  - [ ] 原有 meta charset 和 viewport 未被删除

  **QA Scenarios**:
  ```
  Scenario: SEO tags present
    Tool: Bash
    Steps: cd D:\Test1 && findstr "og:title" index.html && findstr "og:description" index.html && findstr "twitter:card" index.html
    Expected: all 3 findstr commands find matches
    Evidence: .sisyphus/evidence/task-13-seo-tags.txt
  ```

  **Commit**: YES | Message: `feat(seo): add OG and Twitter Card meta tags` | Files: [index.html]

---

- [ ] 14. **迁移路由 hash → history 模式**

  **What to do**:
  修改 `src/main.ts`：
  - 将 `createWebHashHistory()` 改为 `createWebHistory()`
  - 保留其他代码不变

  创建 `D:\Test1\public\404.html`（GitHub Pages SPA fallback）：
  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>记录与分享</title>
    <script>
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      const segmentCount = 1
      const l = window.location
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        '/?' + Array(segmentCount + 1).join('/').slice(1) +
        l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        (l.hash)
      )
    </script>
  </head>
  <body></body>
  </html>
  ```

  修改 `src/main.ts` 中的 redirect 逻辑，加入 404.html 的重定向处理：
  在 createApp 之前添加：
  ```typescript
  // SPA redirect for GitHub Pages (from 404.html)
  ;(function () {
    const redirect = sessionStorage.redirect
    delete sessionStorage.redirect
    if (redirect && redirect !== location.href) {
      history.replaceState(null, '', redirect)
    }
  })()
  ```

  **Must NOT do**: 不要修改任何路由表或页面组件。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 标准路由迁移操作
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [16] | Blocked By: []

  **References**:
  - `D:\Test1\src\main.ts` - target file, line 20: `createWebHashHistory()`
  - `D:\Test1\.github\workflows\deploy.yml` - deploy config (needs update next task)
  - SPA GitHub Pages: https://github.com/rafgraph/spa-github-pages

  **Acceptance Criteria**:
  - [ ] `src/main.ts` 使用 `createWebHistory()` 而非 `createWebHashHistory()`
  - [ ] `public/404.html` 存在且包含 SPA redirect script
  - [ ] `npm run build` 通过，dist/ 包含 404.html

  **QA Scenarios**:
  ```
  Scenario: History mode enabled
    Tool: Bash
    Steps: cd D:\Test1 && findstr "createWebHistory" src\main.ts
    Expected: match found, createWebHashHistory NOT present
    Evidence: .sisyphus/evidence/task-14-history-mode.txt

  Scenario: 404.html created
    Tool: Bash
    Steps: if exist "D:\Test1\public\404.html" echo "EXISTS"
    Expected: EXISTS
    Evidence: .sisyphus/evidence/task-14-404-file.txt
  ```

  **Commit**: NO (merge with task 15 commit)

---

- [ ] 15. **更新 GitHub Actions deploy.yml**

  **What to do**:
  修改 `.github/workflows/deploy.yml`，在 `Build` 步骤后添加对 404.html 的处理：
  - 确认 `vite build` 生成的 `dist/404.html` 被正确复制
  - 或在 deploy 步骤中添加：
  ```yaml
  - name: Copy 404 for SPA
    run: cp dist/index.html dist/404.html
  ```
  放在 Build 之后、Deploy 之前。

  **Must NOT do**: 不要修改已有的 checkout、setup-node 和 deploy 步骤。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单一 YAML 文件小修改
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [16] | Blocked By: [14]

  **References**:
  - `D:\Test1\.github\workflows\deploy.yml` - target file, line 25-26

  **Acceptance Criteria**:
  - [ ] deploy.yml 在 build 和 deploy 之间包含 404 处理步骤
  - [ ] YAML 语法有效

  **QA Scenarios**:
  ```
  Scenario: SPA 404 step in deploy
    Tool: Bash
    Steps: cd D:\Test1 && findstr "404" .github\workflows\deploy.yml
    Expected: at least one match (404.html or 404 step)
    Evidence: .sisyphus/evidence/task-15-deploy-404.txt
  ```

  **Commit**: YES | Message: `ci: add SPA 404.html for history mode routing` | Files: [.github/workflows/deploy.yml, public/404.html, src/main.ts]

---

- [ ] 16. **编写示例测试**

  **What to do**:
  创建 `src/__tests__/` 目录和示例测试文件。

  1. `src/__tests__/example.test.ts` — 基础 vitest 示例：
     ```typescript
     import { describe, it, expect } from 'vitest'

     describe('basic test', () => {
       it('should work', () => {
         expect(1 + 1).toBe(2)
       })
     })
     ```

  2. `src/__tests__/SearchBar.test.ts` — 组件渲染示例（使用 @vue/test-utils）：
     ```typescript
     import { mount } from '@vue/test-utils'
     import { describe, it, expect } from 'vitest'
     import SearchBar from '../components/SearchBar.vue'

     describe('SearchBar', () => {
       it('renders with placeholder', () => {
         const wrapper = mount(SearchBar, {
           props: { placeholder: '搜索测试' }
         })
         expect(wrapper.find('input').attributes('placeholder')).toBe('搜索测试')
       })

       it('emits update:query on input', async () => {
         const wrapper = mount(SearchBar)
         const input = wrapper.find('input')
         await input.setValue('test')
         expect(wrapper.emitted('update:query')?.[0]).toEqual(['test'])
       })
     })
     ```

  运行 `npm run test` 确认通过。

  **Must NOT do**: 不要写覆盖全项目的测试。不需要测试未修改的页面。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 创建示例测试文件
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: [] | Blocked By: [4]

  **References**:
  - `D:\Test1\vitest.config.ts` - vitest config
  - `D:\Test1\src\components\SearchBar.vue` - component to test
  - vitest docs: https://vitest.dev/guide/#writing-tests

  **Acceptance Criteria**:
  - [ ] `src/__tests__/example.test.ts` 存在
  - [ ] `src/__tests__/SearchBar.test.ts` 存在
  - [ ] `npm run test` 通过，显示至少 3 个测试通过

  **QA Scenarios**:
  ```
  Scenario: Tests pass
    Tool: Bash
    Steps: cd D:\Test1 && npx vitest run 2>&1
    Expected: exit code 0, shows "Tests 3 passed" or similar
    Evidence: .sisyphus/evidence/task-16-test-results.txt
  ```

  **Commit**: YES | Message: `test: add vitest example and SearchBar component tests` | Files: [src/__tests__/example.test.ts, src/__tests__/SearchBar.test.ts]

---

- [ ] 17. **最终构建验证**

  **What to do**:
  执行完整的构建验证流程：
  ```bash
  npm run build           # TypeScript 类型检查 + Vite 构建
  npm run test            # vitest 测试
  ```

  全部通过后，执行一次 `git status` 确认所有修改文件正确。

  **Must NOT do**: 不要提交任何代码（只做验证）。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 验证流程
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: [] | Blocked By: [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

  **References**:
  - `D:\Test1\package.json` - scripts section

  **Acceptance Criteria**:
  - [ ] `npm run build` exit code 0
  - [ ] `npm run test` exit code 0

  **QA Scenarios**:
  ```
  Scenario: Full build
    Tool: Bash
    Steps: cd D:\Test1 && npm run build 2>&1
    Expected: exit code 0
    Evidence: .sisyphus/evidence/task-17-final-build.txt

  Scenario: All tests
    Tool: Bash
    Steps: cd D:\Test1 && npm run test 2>&1
    Expected: exit code 0
    Evidence: .sisyphus/evidence/task-17-final-tests.txt
  ```

  **Commit**: NO (verification only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. **Plan Compliance Audit** — oracle
  - 确认所有 17 个任务已完成
  - 确认 scope 边界未被突破
  - 确认无遗漏的依赖或配置
  
- [ ] F2. **Code Quality Review** — unspecified-high
  - 审查 composable 提取是否完整（3 pages 全部使用）
  - 确认死代码已清理
  - 确认 ESLint/Prettier 配置合理
  
- [ ] F3. **Real Manual QA** — unspecified-high
  - `npm run build` 零错误
  - `npm run test` 测试通过
  - `npm run lint` 不崩溃
  - 确认 history 路由工作正常
  
- [ ] F4. **Scope Fidelity Check** — deep
  - 确认未删除/修改现有 13 个 skill
  - 确认未修改 UI 设计
  - 确认未新增业务功能

## Commit Strategy

| 提交 | 内容 | 文件 |
|------|------|------|
| chore(deps): safe minor/patch dependency upgrades | 安全依赖升级 | package.json, package-lock.json |
| chore: add ESLint flat config + Prettier | lint/format 配置 | eslint.config.js, .prettierrc, package.json |
| feat(skills): add 4 project-specific skills | 新 skill 文件 | .agents/skills/*/SKILL.md, skills-lock.json |
| chore: clean up old .sisyphus artifacts | 清理旧文件 | 删除的文件 |
| refactor(sidebar): remove dead placeholder groups | AppSidebar 清理 | src/components/AppSidebar.vue |
| refactor: extract content rendering to composable | composable + 3 页面重构 | src/utils/useContentRenderer.ts, 3 pages |
| fix(reader): replace deprecated document.execCommand | 弃用 API 替换 | src/utils/reader.ts |
| feat(seo): add OG and Twitter Card meta tags | SEO meta | index.html |
| ci: add SPA 404.html for history mode routing | 路由迁移 | main.ts, 404.html, deploy.yml |
| test: add vitest example and SearchBar tests | 示例测试 | src/__tests__/*.test.ts |

## Success Criteria

1. **Build 通过**: `npm run build` exit code 0
2. **测试通过**: `npm run test` 至少 3 个测试通过
3. **配置有效**: ESLint/Prettier/vitest 配置均不崩溃
4. **路由正常**: history 模式，404.html fallback 部署就绪
5. **无死代码**: AppSidebar 无占位组，reader.ts 无 execCommand
6. **新技能就绪**: 4 个项目专属 skill 在 `.agents/skills/` 下可用
7. **无遗留文件**: .sisyphus 旧 artifacts 已清理
8. **SEO 就绪**: index.html 含 OG/Twitter meta

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Foundation·5 tasks): 依赖升级 + devDeps 安装 + ESLint/Prettier 配置 + vitest 配置 + skill 创建 + artifacts 清理
Wave 2 (Code Changes·4 tasks): 死代码删除 + composable 提取 + 3 页面重构 + reader.ts 修复 + SEO meta
Wave 3 (Architecture·3 tasks): 路由迁移 + 404.html + deploy.yml 更新
Wave 4 (Verification·2 tasks): 示例测试 + 最终验证

## TODOs

- [ ] 1. **安全依赖升级**

  **What to do**: 运行 `npm outdated` 识别可安全升级的包。只升级 patch/minor 版本以及明确不破坏构建的版本。逐包执行 `npm install <package>@latest` 或指定安全版本，每次升级后运行 `npm run build` 验证。

  **具体升级清单**（当前 → 目标）：
  - `vue` 3.4 → 3.5（minor 兼容）
  - `@vitejs/plugin-vue` 5.2 → 5.x latest（minor）
  - `typescript` ~5.4 → ~5.7（minor, 非 6.x major）
  - `vite` 5.4 → 5.x latest（守住 5.x line）
  - `vue-router` 4.6 → 4.x latest（守住 4.x line）
  - `marked` 12.0 → 12.x latest（守住 12.x line）
  - `vue-tsc` 2.2 → 2.x latest（守住 2.x line）
  - `tailwindcss` 3.4 → 3.x latest（守住 3.x line）
  - `highlight.js` 保持或 minor
  - `@tailwindcss/typography` 保持或 minor

  每次升级后 `npm run build`。记录哪些包成功升级。

  **Must NOT do**: 不要升级到 major breaking 版本（vite 8, tailwind 4, marked 18, vue-router 5, vue-tsc 3, typescript 6）

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 逐包升级验证，自动化操作
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [2,14,16] | Blocked By: []

  **References**:
  - `D:\Test1\package.json` - dependencies to update
  - `D:\Test1\node_modules` - check actual installed versions

  **Acceptance Criteria**:
  - [ ] `npm run build` 通过
  - [ ] 没有包升级到 major breaking 版本
  - [ ] 升级后网页访问正常

  **QA Scenarios**:
  ```
  Scenario: Build verification after upgrade
    Tool: Bash
    Steps: cd D:\Test1 && npm run build
    Expected: exit code 0, dist/ 目录生成
    Evidence: .sisyphus/evidence/task-1-build-pass.txt

  Scenario: Dev server starts
    Tool: Bash
    Steps: cd D:\Test1 && timeout 10 npx vite --host 2>&1 || true
    Expected: Vite dev server starts without errors
    Evidence: .sisyphus/evidence/task-1-dev-server.txt
  ```

  **Commit**: YES | Message: `chore(deps): safe minor/patch dependency upgrades` | Files: [package.json, package-lock.json]

---

- [ ] 2. **安装工程化 devDependencies**

  **What to do**: 安装以下 dev 依赖：
  ```bash
  npm install -D vitest @vue/test-utils jsdom
  npm install -D eslint @eslint/js eslint-plugin-vue typescript-eslint
  npm install -D prettier eslint-config-prettier eslint-plugin-prettier
  npm install -D @types/node  # if not already
  ```

  验证 `node_modules` 已正确安装，package.json 已更新。

  **Must NOT do**: 不要安装 runtime dependencies 如 vue/eslint-plugin（只装 devDependencies）

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 标准 npm install 操作
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [3,4] | Blocked By: [1]

  **References**:
  - `D:\Test1\package.json` - add to devDependencies

  **Acceptance Criteria**:
  - [ ] `node_modules` 包含 vitest, eslint, prettier 及相关包
  - [ ] `package.json` devDependencies 正确列出所有新包

  **QA Scenarios**:
  ```
  Scenario: Verify installed packages
    Tool: Bash
    Steps: cd D:\Test1 && npx vitest --version && npx eslint --version && npx prettier --version
    Expected: all three commands print version numbers
    Evidence: .sisyphus/evidence/task-2-versions.txt
  ```

  **Commit**: NO (merge with task 3 or 4 commit)

---

- [ ] 3. **配置 ESLint flat config + Prettier**

  **What to do**:
  1. 创建 `eslint.config.js`（ESLint 9 flat config）:
     ```javascript
     // eslint.config.js
     import js from '@eslint/js'
     import pluginVue from 'eslint-plugin-vue'
     import ts from 'typescript-eslint'
     import prettier from 'eslint-config-prettier'

     export default [
       js.configs.recommended,
       ...ts.configs.recommended,
       ...pluginVue.configs['flat/recommended'],
       {
         files: ['*.vue', '**/*.vue'],
         languageOptions: { parserOptions: { parser: ts.parser } },
       },
       prettier,
       {
         ignores: ['dist/', 'node_modules/', '*.config.*'],
       },
     ]
     ```
  2. 创建 `.prettierrc`:
     ```json
     {
       "semi": false,
       "singleQuote": true,
       "trailingComma": "all",
       "printWidth": 100,
       "tabWidth": 2
     }
     ```
  3. 更新 `package.json` scripts:
     ```json
     "lint": "eslint .",
     "format": "prettier --write src/"
     ```
  4. 首次运行 `npm run lint` 确认配置正确（允许初始错误，不强制修复）

  **Must NOT do**: 不要自动修复 lint 错误（只建立配置）。不要在 CI 中加入 lint 检查（本轮不要求全绿通过）。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 标准配置文件创建
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [] | Blocked By: [2]

  **References**:
  - `D:\Test1\package.json` - add scripts
  - ESLint flat config docs: https://eslint.org/docs/latest/use/configure/configuration-files-new

  **Acceptance Criteria**:
  - [ ] `eslint.config.js` 存在且有效
  - [ ] `.prettierrc` 存在且有效
  - [ ] `npm run lint` 执行不崩溃（可输出错误但 exit code 不重要）
  - [ ] `npm run format` 执行成功

  **QA Scenarios**:
  ```
  Scenario: ESLint config loads
    Tool: Bash
    Steps: cd D:\Test1 && npx eslint --print-config src/main.ts > nul 2>&1 && echo "CONFIG_OK" || echo "CONFIG_FAIL"
    Expected: CONFIG_OK
    Evidence: .sisyphus/evidence/task-3-eslint-config.txt

  Scenario: Prettier works
    Tool: Bash
    Steps: cd D:\Test1 && npx prettier --check src/main.ts
    Expected: exit code 0 or 1 (not crash), should output checking result
    Evidence: .sisyphus/evidence/task-3-prettier-check.txt
  ```

  **Commit**: YES | Message: `chore: add ESLint flat config + Prettier` | Files: [eslint.config.js, .prettierrc, package.json]

---

- [ ] 4. **配置 vitest**

  **What to do**:
  1. 创建 `vitest.config.ts`:
     ```typescript
     import { defineConfig } from 'vitest/config'
     import vue from '@vitejs/plugin-vue'

     export default defineConfig({
       plugins: [vue()],
       test: {
         environment: 'jsdom',
         globals: true,
         include: ['src/**/*.{test,spec}.{ts,js}'],
       },
     })
     ```
  2. 更新 `tsconfig.json` 添加 vitest 类型（在 `compilerOptions.types` 加 `vitest/globals`）或创建 `src/vitest.d.ts`:
     ```typescript
     /// <reference types="vitest/globals" />
     ```
  3. 更新 `package.json` scripts:
     ```json
     "test": "vitest run",
     "test:watch": "vitest"
     ```
  4. 运行 `npm run test` 确认配置正确（无测试文件时跳过）

  **Must NOT do**: 不要写业务测试（后面有专门任务）。不要 setup `@vue/test-utils` 的复杂配置。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 标准配置创建
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [15] | Blocked By: [2]

  **References**:
  - `D:\Test1\vite.config.ts` - reference for plugins
  - `D:\Test1\tsconfig.json` - to add types
  - vitest docs: https://vitest.dev/config/

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` 存在
  - [ ] `npm run test` 执行成功（输出 "No test files found" 或 0 tests，exit code 0）

  **QA Scenarios**:
  ```
  Scenario: Vitest runs
    Tool: Bash
    Steps: cd D:\Test1 && npx vitest run 2>&1
    Expected: exit code 0, shows "No test files found" or equivalent
    Evidence: .sisyphus/evidence/task-4-vitest-init.txt
  ```

  **Commit**: NO (merge with task 15 test commit)

---

- [ ] 5. **创建项目专属技能（4个 SKILL.md）**

  **What to do**:
  在 `.agents/skills/` 下创建 4 个新技能目录和 SKILL.md 文件。每个 skill 聚焦于本项目特定模式的最佳实践。

  **技能清单**:

  1. `vue-tailwind-ts` — **Vue 3 + Tailwind + TypeScript 模式**
     - 重点: Composition API + `<script setup lang="ts">` 模式、Tailwind 类名约定、CSS 变量使用规范（参考 style.css 现有体系）、组件颗粒化原则
     - 引用本项目现有关键文件：App.vue、style.css、tailwind.config.js 的模式

  2. `vitest-testing` — **Vitest 测试策略**
     - 重点: vitest 配置、@vue/test-utils 用法、组件渲染测试、composable 单元测试
     - 引用本项目 vitest.config.ts 配置

  3. `ci-cd-github` — **GitHub Actions CI/CD**
     - 重点: GitHub Pages 部署流程、SPA history 路由的 404 处理、workflow 语法
     - 引用 `.github/workflows/deploy.yml`

  4. `content-markdown` — **内容管理与 Markdown 处理**
     - 重点: `content/` 目录结构、frontmatter 规则、marked 配置、highlight.js 集成
     - 引用 src/utils/markdown.ts、content.ts、highlight.ts 的模式

  每个 SKILL.md 必须包含:
  - YAML frontmatter: `name`, `description`
  - `# {Title}` 标题
  - 至少 3 条项目特定的规则/模式
  - 引用实际项目文件路径作为示例
  - 禁止事项（DO NOTs）

  然后更新 `skills-lock.json`，为每个新技能添加条目：
  ```json
  "vue-tailwind-ts": {
    "source": "local",
    "sourceType": "local",
    "skillPath": ".agents/skills/vue-tailwind-ts/SKILL.md",
    "computedHash": "<sha256>"
  }
  ```

  **Must NOT do**: 不要写通用教程内容，所有内容必须针对本项目定制。不要超过 4 个技能。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 技术写作，需要生成高质量文档
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [] | Blocked By: []

  **References**:
  - `D:\Test1\.agents\skills\brandkit\SKILL.md` - SKILL.md 格式参考
  - `D:\Test1\skills-lock.json` - 更新注册
  - `D:\Test1\src\style.css` - 供 vue-tailwind-ts skill 引用
  - `D:\Test1\src\utils\markdown.ts` - 供 content-markdown skill 引用
  - `D:\Test1\.github\workflows\deploy.yml` - 供 ci-cd-github skill 引用
  - `D:\Test1\src\utils\highlight.ts` - 供 content-markdown skill 引用

  **Acceptance Criteria**:
  - [ ] 4 个 `.agents/skills/{name}/SKILL.md` 文件均存在
  - [ ] 每个 SKILL.md 有 valid YAML frontmatter (name + description)
  - [ ] 每个 skill 有项目特定的代码引用
  - [ ] `skills-lock.json` 包含 4 个新条目的注册

  **QA Scenarios**:
  ```
  Scenario: Verify all 4 skill files exist
    Tool: Bash
    Steps: dir /b "D:\Test1\.agents\skills\vue-tailwind-ts" "D:\Test1\.agents\skills\vitest-testing" "D:\Test1\.agents\skills\ci-cd-github" "D:\Test1\.agents\skills\content-markdown"
    Expected: all 4 directories exist, each contains SKILL.md
    Evidence: .sisyphus/evidence/task-5-skills-exist.txt

  Scenario: skills-lock.json updated
    Tool: Bash
    Steps: cd D:\Test1 && type skills-lock.json | findstr "vue-tailwind-ts" && findstr "vitest-testing" && findstr "ci-cd-github" && findstr "content-markdown"
    Expected: all 4 skill names found in skills-lock.json
    Evidence: .sisyphus/evidence/task-5-skills-lock.txt
  ```

  **Commit**: YES | Message: `feat(skills): add 4 project-specific skills (vue-tailwind-ts, vitest-testing, ci-cd-github, content-markdown)` | Files: [.agents/skills/vue-tailwind-ts/SKILL.md, .agents/skills/vitest-testing/SKILL.md, .agents/skills/ci-cd-github/SKILL.md, .agents/skills/content-markdown/SKILL.md, skills-lock.json]

---

- [ ] 6. **清理 .sisyphus 遗留文件**

  **What to do**:
  删除以下文件/目录内容：
  - `D:\Test1\.sisyphus\run-continuation\` 下的所有 4 个 `ses_*.json`
  - `D:\Test1\.sisyphus\drafts\markdown-render-architecture.md`（旧 draft，决策已过时）
  - `D:\Test1\.sisyphus\design-compare.html`（独立 HTML，不在 build 流程中）

  注意：保留 `代码分析报告.md`、`CSS设计规范.md`、`drafts/project-improvement.md`（当前在用的）、`plans/` 下的所有文件。

  **Must NOT do**: 不要删除 `代码分析报告.md` 和 `CSS设计规范.md`。不要删除当前使用的 `drafts/project-improvement.md`。

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 简单的文件删除操作
  - Skills: [] - no skills needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [] | Blocked By: []

  **References**:
  - `D:\Test1\.sisyphus\run-continuation\` - target directory

  **Acceptance Criteria**:
  - [ ] `run-continuation\` 目录为空或不存在
  - [ ] `drafts\markdown-render-architecture.md` 不存在
  - [ ] `design-compare.html` 不存在
  - [ ] `代码分析报告.md` 和 `CSS设计规范.md` 仍然存在

  **QA Scenarios**:
  ```
  Scenario: Verify old artifacts deleted
    Tool: Bash
    Steps: dir /b "D:\Test1\.sisyphus\run-continuation" 2>nul || echo "EMPTY"
    Expected: EMPTY or directory does not exist
    Evidence: .sisyphus/evidence/task-6-cleanup.txt
  ```

  **Commit**: YES | Message: `chore: clean up old .sisyphus artifacts` | Files: [deleted files]
