# Docs Page: 双 TOC 可滚动布局

## TL;DR
> **Summary**: 将 DocsPage 改造成三栏布局 — 左栏展示当前分类下的所有文档列表（可滚动），中间是文章内容，右栏展示当前文档的标题层级 TOC（可滚动）。两个侧栏均独立滚动，不依赖页面滚动。
> **Deliverables**: DocNav 组件（左）、DocTOC 组件（右）、更新后的 DocsPage.vue、响应式断点
> **Effort**: Medium
> **Parallel**: YES - 2 waves
> **Critical Path**: 布局基座 → DocNav → DocTOC → 整合 → 响应式

## Context
### Original Request
用户在 docs 页面需要两个 TOC：
- **左侧（DocNav）**：当前分类下所有 md 文件的导航列表，按目录或字母排列，可独立滚动
- **右侧（DocTOC）**：当前文件的标题层级（h2/h3），可独立滚动
- 两者都不是固定定位（not position: fixed），且各自有滚动条，可在页面任何位置滚动查看完整内容
- 参考 api-docs.deepseek.com 的三栏布局

### Interview Summary
| 项目 | 结论 |
|------|------|
| 左栏内容 | 当前 category 下的所有 md 文件，按文件名/子目录分组 |
| 右栏内容 | 当前文件的 h2/h3 标题层级 |
| 滚动行为 | 两栏各自独立滚动 (`overflow-y: auto` + `max-height: 100vh`) |
| 定位方式 | `position: sticky`（跟随视口，不随页面滚动而消失） |
| 响应式 | 窄屏隐藏侧栏，可选浮动按钮打开 |
| 当前状态 | DocsPage 已被删除两侧栏，TOCSidebar.vue 保留可用 |

### Metis Review (gaps addressed)
- 子目录处理：当前 content 结构为扁平文件（无子目录），但设计需兼容未来可能出现的子目录
- Active 状态同步：左侧需高亮当前文档，右侧需 IntersectionObserver 跟踪当前标题
- TabNav 高度 48px (`sticky top-0 z-50`)，侧栏 sticky top 需避开此高度

## Work Objectives
### Core Objective
实现 DocsPage 三栏可滚动布局，左栏文档列表导航 + 右栏标题层级 TOC。

### Deliverables
1. `src/components/DocNav.vue` — 左侧文档导航组件
2. `src/components/DocTOC.vue` — 右侧标题 TOC 组件（基于现有 TOCSidebar 改造）
3. `src/pages/DocsPage.vue` — 更新后的三栏布局
4. 响应式适配（平板/手机）

### Definition of Done
- [ ] 左栏渲染当前 category 所有文件，点击切换文档
- [ ] 右栏渲染当前文件的 h2/h3 标题，点击滚动到对应标题
- [ ] 两栏各自有滚动条，内容超出视口高度时可独立滚动
- [ ] `position: sticky` 使侧栏随页面滚动保持在视口内
- [ ] TabNav 高度被 correct offset
- [ ] 当前文档在左栏高亮
- [ ] 当前标题在右栏高亮（IntersectionObserver）
- [ ] 窄屏（< 900px）侧栏隐藏
- [ ] 构建通过，无 TS/Lint 错误

### Must Have
- 左栏 sticky + 独立滚动
- 右栏 sticky + 独立滚动
- active 高亮状态同步
- 三个区域各自 scroll 行为自然

### Must NOT Have
- ❌ 不要 `position: fixed`（用户明确拒绝）
- ❌ 不要依赖页面滚动到底部才能看到侧栏内容
- ❌ 不要改动 content 目录结构或路由
- ❌ 不要破坏现有的 TabNav / ScrollProgress / 主题切换

## Verification Strategy
> ZERO HUMAN INTERVENTION — all verification is agent-executed.
- **Test decision**: tests-after + Playwright visual check
- **QA policy**: 每个组件有 Playwright 打开页面截图验证布局
- **Evidence**: `.sisyphus/evidence/` 下截图

## Execution Strategy
### Parallel Execution Waves

**Wave 1**: 布局基座 + 数据层
- DocsPage.vue 恢复三栏 flex 布局 structural 框架
- 确保 TabNav sticky 高度被正确 offset

**Wave 2**: 组件实现 + 整合
- DocNav.vue 左栏文件列表
- DocTOC.vue 右栏标题层级（基于 TOCSidebar.vue）
- 整合到 DocsPage.vue
- 响应式断点

### Dependency Matrix
| Task | Depends On |
|------|-----------|
| 1. DocsPage 布局基座 | — |
| 2. DocNav 组件 | 1 |
| 3. DocTOC 组件 | 1 |
| 4. 整合 + 响应式 | 2, 3 |

### Agent Dispatch Summary
| Wave | Tasks | Category |
|------|-------|----------|
| 1 | 1 | visual-engineering |
| 2 | 2, 3, 4 | visual-engineering |

## TODOs

- [ ] 1. DocsPage: 恢复三栏 flex 布局基座

  **What to do**:
  - 在 DocsPage.vue template 中恢复三栏结构：
    ```
    .docs-page-root (display: flex)
      ├── <DocNav />           (左栏)
      ├── main.docs-content    (中间内容，现有)
      └── <DocTOC />           (右栏)
    ```
  - 侧栏 CSS 关键样式：
    ```css
    .docs-sidebar {
      position: sticky;
      top: calc(48px + 1rem);    /* TabNav 48px + 间距 */
      flex-shrink: 0;
      width: 260px;
      max-height: calc(100vh - 48px - 2rem);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .docs-toc {
      position: sticky;
      top: calc(48px + 1rem);
      flex-shrink: 0;
      width: 220px;
      max-height: calc(100vh - 48px - 2rem);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .docs-content {
      flex: 1;
      min-width: 0;
      max-width: 780px;
      padding: 1.5rem 2rem 4rem;
    }
    ```
  - `.docs-page-root` flex 容器 max-width 设为 1440px（三栏需要更宽）
  - 保留 TabNav 和 ScrollProgress 的现有使用
  - 暂时用占位元素替代 DocNav/DocTOC（确保布局正确）
  - 删除之前清除掉的空行和残留样式

  **Must NOT do**:
  - 不删除或改变 TabNav 和 ScrollProgress
  - 不改变 router 或 content 数据层

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — 需要精确的 CSS 布局和响应式设计
  - Skills: [] — 不需要特殊 skill

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [2,3,4] | Blocked By: []

  **References**:
  - Pattern: 现有 `src/pages/DocsPage.vue` — 恢复三栏布局
  - Reference: api-docs.deepseek.com 三栏 sticky 布局模式
  - TabNav height: `src/components/TabNav.vue:49-52` — sticky top-0, ~48px

  **Acceptance Criteria**:
  - [ ] 构建通过
  - [ ] 三栏布局在viewport > 1200px 正常显示
  - [ ] 左右侧栏 sticky 定位，滚动页面时保持在视口内
  - [ ] 左右侧栏各自有滚动条

  **QA Scenarios**:
  ```
  Scenario: 三栏布局渲染
    Tool: Playwright
    Steps: 打开 /docs/java/Java汇总（viewport 1400x900）
    Expected: 左侧260px区域存在，中间内容区域存在，右侧220px区域存在
    Evidence: .sisyphus/evidence/task-1-three-column.png

  Scenario: sticky 行为
    Tool: Playwright
    Steps: 滚动页面到中段，检查侧栏是否可见
    Expected: 左右侧栏保持在视口内
    Evidence: .sisyphus/evidence/task-1-sticky.png
  ```

  **Commit**: YES | Message: `feat(docs): restore three-column layout structure` | Files: [src/pages/DocsPage.vue]


- [ ] 2. DocNav: 创建左栏文档导航组件

  **What to do**:
  - 创建 `src/components/DocNav.vue`
  - Props:
    ```ts
    defineProps<{
      notes: NoteMeta[]          // 当前 category 的文档列表
      currentSlug?: string       // 当前选中文档的 slug
    }>()
    defineEmits<{ selectNote: [slug: string] }>()
    ```
  - 模板渲染 `notes` 列表，每个项展示 note.title
  - `currentSlug` 匹配的项添加 `.active` 类（绿色左边框 + 背景色）
  - 点击触发 `emit('selectNote', note.slug)`
  - 如果未来需要子目录分组，可通过传入 `groupedNotes` prop 或在组件外分组后传入
  - 样式：
    - 列表项：`padding: 0.4rem 0.75rem`, `font-size: 0.8125rem`
    - active: `border-left: 2px solid var(--accent)`, `background: var(--accent-bg)`
    - hover: 同现有 docs-nav-item 交互模式
    - 容器本身不带滚动条（由父容器 `.docs-sidebar` 提供 `overflow-y: auto`）
    - 顶部显示 "目录" 或 category 名称作为 label

  **Must NOT do**:
  - 不内联 scroll 逻辑（由父容器处理）
  - 不处理文档加载逻辑（由 DocsPage 传入）
  - 不处理子目录展开/折叠（当前 phase 展平列表）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — 组件交互 + 样式
  - Skills: [] — 不需要特殊 skill

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [4] | Blocked By: [1]

  **References**:
  - Pattern: `src/components/AppSidebar.vue:23-36` — 现有 nav-item 交互模式（interact-slide-bg）
  - NoteMeta type: `src/utils/content.ts:7-13`

  **Acceptance Criteria**:
  - [ ] 渲染 notes 列表，显示 title
  - [ ] currentSlug 匹配项高亮
  - [ ] 点击触发 selectNote
  - [ ] 构建通过

  **QA Scenarios**:
  ```
  Scenario: DocNav 渲染文件列表
    Tool: Playwright
    Steps: 打开 /docs/java/Java汇总
    Expected: 左栏列出 java 分类下所有文件标题，Java汇总 高亮
    Evidence: .sisyphus/evidence/task-2-docnav.png

  Scenario: 点击切换文档
    Tool: Playwright
    Steps: 点击左栏 "类与对象"
    Expected: URL 变为 /docs/java/类与对象，内容区域切换
    Evidence: .sisyphus/evidence/task-2-docnav-click.png
  ```

  **Commit**: YES | Message: `feat(docs): create DocNav component for left sidebar file list` | Files: [src/components/DocNav.vue]


- [ ] 3. DocTOC: 创建右栏标题 TOC 组件（基于 TOCSidebar 改造）

  **What to do**:
  - 基于现有 `TOCSidebar.vue` 创建或重命名为 `DocTOC.vue`
  - 保留现有功能：
    - Props: `items: TocItem[]`
    - IntersectionObserver 跟踪 active 标题
    - h2/h3 层级缩进渲染
    - 点击 `scrollIntoView({ behavior: 'smooth' })`
  - 新增/改造：
    - 组件名改为 DocTOC
    - 顶部添加固定 label "本页目录" / "On this page"
    - 容器不内联滚动（由父容器 `.docs-toc` 提供 `overflow-y: auto`）
    - 可选的：折叠 h3 子项（默认展开）
  - 样式：
    - h2: `font-weight: 500`, `padding-left: 0.75rem`
    - h3: `padding-left: 1.5rem`, `font-size: 0.75rem`
    - active: 同 TOCSidebar 现有 active 样式

  **Must NOT do**:
  - 不重复实现 IntersectionObserver（复用现有逻辑）
  - 不删除 TOCSidebar.vue（可能被 AppSidebar 使用）
  - 不改变 markdown.ts 中的 TocItem/TocGroup 类型

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — 基于现有组件改造
  - Skills: [] — 不需要特殊 skill

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [4] | Blocked By: [1]

  **References**:
  - Base: `src/components/TOCSidebar.vue` — 完整实现，需复用
  - Types: `src/utils/markdown.ts:21-25` — TocItem, TocGroup
  - Grouping: `src/utils/markdown.ts:32-46` — groupTocItems

  **Acceptance Criteria**:
  - [ ] 渲染当前文件的 h2/h3 标题列表
  - [ ] 滚动时 active 标题自动切换（IntersectionObserver）
  - [ ] 点击标题滚动到对应位置
  - [ ] 构建通过

  **QA Scenarios**:
  ```
  Scenario: DocTOC 渲染标题层级
    Tool: Playwright
    Steps: 打开 /docs/java/Java汇总
    Expected: 右栏显示所有 h2/h3 标题，h3 缩进
    Evidence: .sisyphus/evidence/task-3-doctoc.png

  Scenario: 点击标题滚动
    Tool: Playwright
    Steps: 点击右栏 "类与对象"
    Expected: 页面滚动到对应标题位置
    Evidence: .sisyphus/evidence/task-3-doctoc-click.png
  ```

  **Commit**: YES | Message: `feat(docs): create DocTOC component for right sidebar heading nav` | Files: [src/components/DocTOC.vue]


- [ ] 4. 整合 DocNav + DocTOC 到 DocsPage + 响应式

  **What to do**:
  - 在 DocsPage.vue 中导入并使用 DocNav 和 DocTOC
  - 数据流：
    - DocNav: `:notes="categoryNotes" :current-slug="currentNote?.slug" @select-note="selectNote"`
    - DocTOC: `:items="currentNote?.toc ?? []"`
  - 响应式断点（参考 DeepSeek 风格）：
    - `>= 1200px`: 三栏全显示
    - `>= 900px 且 < 1200px`: 隐藏右栏 DocTOC
      - 右栏内容改为可选的浮动按钮/下拉菜单（可选，phase 1 仅隐藏）
    - `< 900px`: 隐藏左栏 DocNav（用户通过 category 选择页面进入）
  - 清除任务 1 中的占位元素
  - 验证 sticky 偏移量正确（TabNav 48px + 1rem padding）

  **Must NOT do**:
  - 不要使用 `position: fixed` — 必须用 sticky
  - 不要改动 TabNav 组件的样式

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — 组件整合 + 响应式
  - Skills: [] — 不需要特殊 skill

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [] | Blocked By: [2, 3]

  **References**:
  - Current DocsPage: `src/pages/DocsPage.vue` — 修改此文件
  - DeepSeek reference: api-docs.deepseek.com — 三栏布局比例
  - TabNav 高度: `src/components/TabNav.vue:49-52` — sticky top-0

  **Acceptance Criteria**:
  - [ ] 三栏完整渲染，数据流正确
  - [ ] 点击左栏文档切换中间内容和右栏 TOC
  - [ ] 滚动页面时两栏 sticky 保持在视口内
  - [ ] 响应式断点正确工作
  - [ ] 构建通过，无 TS/Lint 错误

  **QA Scenarios**:
  ```
  Scenario: 完整三栏交互
    Tool: Playwright
    Steps: 打开 /docs/java （选择 java 分类）
           → 左栏显示 java 文件列表
           → 点击 "类与对象"
           → 中间显示文章内容
           → 右栏显示该文章的 h2/h3 标题
    Expected: 三栏协同工作
    Evidence: .sisyphus/evidence/task-4-full-interaction.png

  Scenario: 平板视图（1000px）
    Tool: Playwright
    Steps: viewport 1000x900，打开 /docs/java/类与对象
    Expected: 左栏可见，右栏隐藏
    Evidence: .sisyphus/evidence/task-4-tablet.png

  Scenario: 手机视图（800px）
    Tool: Playwright
    Steps: viewport 800x900，打开 /docs/java/类与对象
    Expected: 单栏全文显示，侧栏隐藏
    Evidence: .sisyphus/evidence/task-4-mobile.png
  ```

  **Commit**: YES | Message: `feat(docs): integrate DocNav and DocTOC with responsive layout` | Files: [src/pages/DocsPage.vue]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
| # | Message | Scope |
|---|---------|-------|
| 1 | `feat(docs): restore three-column layout structure` | DocsPage layout |
| 2 | `feat(docs): create DocNav component for left sidebar file list` | DocNav.vue |
| 3 | `feat(docs): create DocTOC component for right sidebar heading nav` | DocTOC.vue |
| 4 | `feat(docs): integrate DocNav and DocTOC with responsive layout` | DocsPage integration |

## Success Criteria
- 左栏文件列表完整显示、可滚动、可点击切换
- 右栏标题层级完整显示、可滚动、active 跟踪准确
- 两栏 sticky + overflow-y: auto 行为自然
- 响应式断点覆盖桌面/平板/手机
- 现有功能（TabNav、主题切换、ScrollProgress）不受影响
