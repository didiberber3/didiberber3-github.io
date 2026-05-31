# 侧栏整合 + TOC 折叠化

## TL;DR
> **Summary**: 将 DocsPage 左栏 DocNav、右栏 DocTOC、全局 AppSidebar 抽屉三合一；移除 DocsPage 右侧冗余 TOC；将 TOC 改为可折叠的 accordion 抽屉
> **Deliverables**: 修改 4 个组件，删除 1 个+ 简化布局
> **Effort**: Medium
> **Parallel**: YES — 2 waves

## 现状问题

```
DocsPage 当前布局:
┌─────────────┬──────────────────┬──────────────┐
│  DocNav     │                  │  DocTOC      │ ← 与 AppSidebar 重复
│ (左分类列表) │   内容区域        │ (右侧目录)   │ ← 越来越长滚不动
│             │                  │              │
└─────────────┴──────────────────┴──────────────┘
                          ↑
              还有 AppSidebar 抽屉 (☰ 按钮)
              也显示笔记列表 + TOC → 三重冗余
```

## 目标布局

```
DocsPage 新布局:
┌────────────────────────────────────┐
│                                    │
│         内容区域 (单栏)             │
│         最大宽度 780px             │
│                                    │
│   ☐ 抽屉包含全部：                  │
│   ├─ 分类导航列表                   │
│   └─ 当前文章 TOC (可折叠)          │
│                                    │
└────────────────────────────────────┘
```

**删除 DocsPage 左右两侧栏**，所有导航功能统一归入 ☰ AppSidebar 抽屉。

## TODOs

### Wave 1 — TOC 折叠化 + AppSidebar 增强

- [ ] 1. 重写 TOCSidebar 为可折叠 accordion

  **What to do**: 修改 `src/components/TOCSidebar.vue`
  - 每个 `h2` 分组是一个可折叠的面板
  - 点击 h2 行展开/收起其下的 h3 子项
  - 默认展开当前活跃的 h2 组（activeId 所在的组），其余收起
  - 添加展开/收起的箭头图标（▸/▾）
  - 使用 transition 动画平滑展开收起

  **数据结构不变**：`TocGroup[]` (`h2` + `children: TocItem[]`)

  **参考实现**：
  ```vue
  <script setup lang="ts">
  const expandedGroups = ref<Set<number>>(new Set())
  function toggleGroup(idx: number) {
    if (expandedGroups.value.has(idx)) {
      expandedGroups.value.delete(idx)
    } else {
      expandedGroups.value.add(idx)
    }
  }
  // 默认展开当前活跃组
  watch(activeId, (id) => {
    const idx = groups.value.findIndex(g => g.h2.id === id || g.children.some(c => c.id === id))
    if (idx >= 0) expandedGroups.value.add(idx)
  })
  </script>
  ```

  **Acceptance Criteria**:
  - [ ] 每个 h2 组可点击展开/收起
  - [ ] 默认只展开当前活跃组
  - [ ] 展开/收起有平滑动画
  - [ ] 不破坏 TOCSidebar 的现有功能（点击跳转、活跃高亮）

  **Commit**: YES | `feat: make TOCSidebar collapsible accordion`

- [ ] 2. 增强 AppSidebar 同时显示笔记列表 + TOC

  **What to do**: 修改 `src/components/AppSidebar.vue`
  - 目前已有两个 section（notes + toc），但 divider 条件不对
  - 确保同时有 notes 和 toc 时两个 section 都显示，中间有分隔线
  - section label 根据内容动态显示：`sidebar.category || '笔记'`

  **当前问题已修复**（条件改为 `sidebar.notes.length` 而非 `sidebar.category && sidebar.notes.length`），只需要验证即可。

  额外改进：在 drawer-header 添加笔记数量统计 `${sidebar.notes.length} 篇`

  **Acceptance Criteria**:
  - [ ] 有 notes 显示 notes 列表
  - [ ] 有 toc 显示 toc 目录
  - [ ] 同时存在时中间有分隔线
  - [ ] 标题栏显示笔记数量

  **Commit**: YES | `feat: enhance AppSidebar with notes count and dual sections`

- [ ] 3. 同步 DocsPage 数据到 AppSidebar

  **What to do**: 修改 `src/pages/DocsPage.vue`
  - 添加 `import { sidebar } from '../utils/useSidebar'`
  - 添加 watch 监听 `categoryNotes` 和 `currentNote`，同步到 `sidebar`：
    ```ts
    watch([categoryNotes, currentNote], () => {
      sidebar.notes = categoryNotes.value
      sidebar.category = category.value || ''
      if (currentNote.value?.toc?.length) {
        sidebar.toc = currentNote.value.toc
      }
    }, { immediate: true })
    ```

  **Acceptance Criteria**:
  - [ ] 在 DocsPage 点击 ☰ 按钮，抽屉显示当前分类的笔记列表 + 当前文章的 TOC
  - [ ] 切换文章后，抽屉内容自动更新

  **Commit**: YES | `feat: sync DocsPage context to AppSidebar drawer`

- [ ] 4. 更新 TabNav toggleSidebar 逻辑

  **What to do**: 修改 `src/components/TabNav.vue`
  - 更新 `toggleSidebar` 函数：
    ```ts
    function toggleSidebar() {
      if (sidebar.visible) { closeSidebar(); return }
      // Docs/article pages: sidebar data already pre-populated by page component
      if (route.path.startsWith('/docs/') || route.path.startsWith('/note/')) {
        if (sidebar.notes.length || sidebar.toc.length) {
          sidebar.visible = true
          return
        }
      }
      // Default: show all notes
      openSidebar({ notes: getNoteList() })
    }
    ```

  **Acceptance Criteria**:
  - [ ] Docs 页面点击 ☰ 显示分类+目录
  - [ ] 笔记文章页点击 ☰ 显示 TOC
  - [ ] 其他页面点击 ☰ 显示全部笔记列表
  - [ ] 再次点击 ☰ 关闭

  **Commit**: YES | `feat: update toggleSidebar with context-aware logic`

### Wave 2 — DocsPage 布局简化

- [ ] 5. DocsPage 移除左右侧栏，改为纯单栏布局

  **What to do**: 修改 `src/pages/DocsPage.vue`
  - 从模板中删除整个左侧 `<aside class="docs-sidebar">` 块（包含 DocNav）
  - 从模板中删除右侧 `<aside class="docs-toc">` 块
  - 删除 `import DocNav from '../components/DocNav.vue'`
  - 删除 `import DocTOC from '../components/DocTOC.vue'`
  - 删除 `docs-page-root`、`docs-sidebar`、`docs-body`、`docs-body-inner`、`docs-content`、`docs-toc` 等三栏布局结构，改为简单的单栏 `.page-shell > .page-content` 模式
  - 内容区域 `<article>` 使用 `max-w-3xl mx-auto`（和 ArticleView 一致）

  **保留功能**：分类选择（通过 DocsPage 首页的 category grid）+ 文章导航（通过 ☰ 抽屉）

  **Acceptance Criteria**:
  - [ ] DocsPage 不再有左侧分类导航栏
  - [ ] DocsPage 不再有右侧 TOC 栏
  - [ ] 内容区域居中显示，最大宽度 780px
  - [ ] 所有导航通过 ☰ 抽屉访问
  - [ ] DocsPage 首页 category grid 保持不变

  **Commit**: YES | `refactor: remove redundant DocTOC from DocsPage, use drawer instead`

- [ ] 6. 清理废弃的 CSS 和组件

  **What to do**:
  - 删除 `src/components/DocNav.vue`（不再被引用）
  - 删除 `src/components/DocTOC.vue`（不再被引用）
  - 清理 `src/pages/DocsPage.vue` 中 `.docs-sidebar`、`.docs-toc`、`.docs-page-root`、`.docs-body` 等废弃 CSS
  - 清理 `src/style.css` 或其他文件中可能存在的 `.docs-*` 残余样式

  **Acceptance Criteria**:
  - [ ] 无 `DocNav`、`DocTOC` import 残余
  - [ ] 无 `.docs-sidebar`、`.docs-toc` CSS 残余
  - [ ] `npm run build` 成功

  **Commit**: YES | `chore: cleanup DocTOC component and unused styles`

- [ ] 7. 路由切换时重置 sidebar

  **What to do**: 修改 `src/App.vue`
  - 在 `router.afterEach` 中添加 sidebar 数据重置：
    ```ts
    router.afterEach(() => {
      stopRouter()
      sidebar.notes = []
      sidebar.toc = []
      sidebar.category = ''
    })
    ```
  - 添加 import：`import { sidebar } from './utils/useSidebar'`

  **Acceptance Criteria**:
  - [ ] 切换页面后 sidebar 数据清空
  - [ ] 新页面重新填充正确数据
  - [ ] `npm run build` 成功

  **Commit**: YES | `fix: reset sidebar data on route change`

## Final Verification Wave
- [ ] F1. 构建通过 — `npm run build`
- [ ] F2. DocsPage 无右侧 TOC 列
- [ ] F3. ☰ 抽屉在 DocsPage 显示分类+目录
- [ ] F4. ☰ 抽屉在笔记页显示 TOC
- [ ] F5. ☰ 抽屉在其他页显示全部笔记
- [ ] F6. TOC accordion 可折叠
- [ ] F7. TOC 默认只展开当前活跃组

## Commit Strategy
7 个原子提交，每个独立可回滚。

## 不再需要的文件（Wave 2 后可删除）
- `src/components/DocTOC.vue` — 功能已合并到 TOCSidebar + AppSidebar 抽屉
