# 博客项目全面优化计划

## TL;DR
> **Summary**: Vue 3 博客 5 项优化——删除 shares 模块 / 全局交互整合 / 底部渐变动画 / AppSidebar 抽屉重设计 / 代码清理
> **Deliverables**: 删 10+ 文件/路由/组件，重构 15+ 文件，新增 1 全局抽屉组件
> **Effort**: Large
> **Parallel**: YES — 3 waves
> **Critical Path**: Wave 1(删Shares+基础) → Wave 2(全局整合+动画) → Wave 3(侧栏+布局)

## Context
### Original Request
阅读代码找出优化点：back to top / 滚动进度条全局化 / 按钮放置导航栏 / 从下到上渐变色动画 / 内容栏侧栏解耦 / frontmatter Date 排序 / 删 shares / article card 日期 hover 显示。

### Interview Decisions
| 决策项 | 结论 |
|--------|------|
| Shares 删除范围 | 全部删除 |
| 全局交互整合 | 移到 App.vue |
| 动画效果 | clip-path + opacity 梯度揭示 |
| 侧栏策略 | 重设 AppSidebar 为滑动抽屉 |
| GitHub 相关 | 不动 |

### 预审发现
- ScrollProgress/TabNav 在 7 页面重复导入
- AppSidebar 已存在但 0 处引用（废弃）
- `interface Note` 重复声明（content.ts:14-18 和 20-24）
- `card-meta-date` hover 已实现（保留）
- `getNoteList()` 已按 date 倒序（验证即可，无需额外操作）

## Work Objectives
### Core Objective
5 大优化项全部完成，不引入回归，不影响 GitHub Pages 部署。

### Deliverables
1. Shares 模块干净删除（无残余 import/route/type/file）
2. ScrollProgress + BackToTop + TabNav 全局化（App.vue 单实例）
3. `.animate-fade-up` → `.animate-reveal`（clip-path 从下到上颜色揭示）
4. AppSidebar 重写为全局滑动抽屉（Notes/ArticleView 启用）
5. 废弃/重复代码清理（Note 接口、旧动画类）

### Definition of Done
- `npm run build` 无错误
- `npm run test` 全部通过
- 6 个路由正常：`/` `/notes` `/note/:slug` `/docs` `/docs/:cat/:slug` `/about`
- `/shares` `/share/:slug` → 404
- App.vue 只有 1 处 `<ScrollProgress />` 1 处 `<TabNav />`
- 每个页面不再自己 import TabNav/ScrollProgress

### Must NOT Have
- 不改 .github/、vite.config.ts base、main.ts 404 redirect
- 不改 DocsPage 三栏布局结构
- 不改 Markdown 渲染管线（marked / highlight.js）

## Verification Strategy
- **Test**: 现有 vitest + `npm run build` + Playwright 交互验证
- **Evidence**: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Waves

**Wave 1** (Foundation — 无交叉依赖):
| Task | 内容 |
|------|------|
| 1 | 删除 Shares 完整模块 |
| 2 | 修复 Note 接口重复 |
| 3 | 新增 `.animate-reveal` CSS |

**Wave 2** (Global Integration — 依赖 Wave 1 + 可并行):
| Task | 内容 | 依赖 |
|------|------|------|
| 4 | 重构 App.vue 全局化 | 1 |
| 5 | 页面移除重复导入 | 4 |
| 6 | 替换动画类名 | 3 |

**Wave 3** (Sidebar + Final — 依赖 Wave 2):
| Task | 内容 | 依赖 |
|------|------|------|
| 7 | 重写 AppSidebar 抽屉 | 无 |
| 8 | 集成 AppSidebar | 4, 7 |
| 9 | 最终清理验证 | 全部 |

## TODOs

### 1. 删除 Shares 模块

**What to do**:
1. 删除文件：`src/pages/Shares.vue`、`src/pages/ShareView.vue`
2. 删除 `content/shares/` 下全部 6 个 .md 文件
3. 编辑 `src/router/index.ts`：删 `/shares` 和 `/share/:slug` 两条路由（第19-28行）
4. 编辑 `src/utils/content.ts`：
   - 删 `import { shareMeta }`（第2行，只保留 noteMeta）
   - 删 `interface ShareMeta`（第26-32行）、`interface Share`（第34-38行）
   - 删 `const shareModules`（第47-50行）
   - 删 `export function getShareList()`（第107-115行）
   - 删 `export async function loadShare()`（第140-160行）
5. 编辑 `vite.config.ts`：删 sharesDir 扫描（第68-85行），删 return 中 `shareMeta`（第89行）
6. 编辑 `src/pages/Home.vue`：
   - 删 `import { getShareList }` 和 `import type { ShareMeta }`（第3-4行）
   - 删 `shares`、`shareTotal` ref（第10-12行）
   - 删 onMounted 中 `.length` 和 `.slice(0,3)`（第16-18行）
   - 删模板"最新分享"整个 `<section>`（第63-89行）
   - 改 `{{ noteTotal + shareTotal }}` → `{{ noteTotal }}`（第37行）
7. 编辑 `src/components/TabNav.vue`：
   - 删 `defineProps<{ visitUrl?: string }>()`（第6行）
   - 从 `tabs` 删 `{ label: '分享', path: '/shares' }`（第34行）
   - 删 `visit-btn` 按钮模板（第66-74行）和关联 CSS

**Must NOT do**: 不删 noteMeta、不改 GitHub 配置

**References**: router:19-28 | content.ts:2,26-38,107-115,140-160 | vite.config.ts:68-91 | Home.vue:3-4,10-18,37,64-89 | TabNav.vue:6,30-36,66-74

**Acceptance Criteria**:
- [ ] `grep -r "share" src/ --include="*.ts" --include="*.vue"` 无逻辑引用（允许注释/文字）
- [ ] `npm run build` 成功
- [ ] 访问 `/shares` → 404

**QA Scenarios**:
```
Scenario: Shares 404
  Tool: Playwright
  Steps: navigate /shares → /share/devdocs
  Expected: NotFound 页面
  Evidence: .sisyphus/evidence/task-1-404.png
Scenario: Build passes
  Tool: Bash
  Steps: npm run build
  Expected: exit 0, dist/ 生成
  Evidence: .sisyphus/evidence/task-1-build.log
```

**Commit**: YES | `refactor: remove entire shares module (files/routes/types/logic)`

---

### 2. 修复 Note 接口重复声明

**What to do**: 编辑 `src/utils/content.ts`，删除重复的 `interface Note` 块（第14-18行或第20-24行，保留一个）

**References**: content.ts:14-24

**Acceptance Criteria**:
- [ ] `grep -c "interface Note" src/utils/content.ts` === 1
- [ ] `npm run build` 成功

**Commit**: YES | `fix: remove duplicate Note interface declaration`

---

### 3. 新增 `.animate-reveal` CSS 类

**What to do**: 在 `src/style.css` `@layer utilities` 中（第109行后）新增：
```css
@keyframes clipReveal {
  from {
    clip-path: inset(100% 0 0 0);
    -webkit-clip-path: inset(100% 0 0 0);
    opacity: 0.3;
  }
  to {
    clip-path: inset(0 0 0 0);
    -webkit-clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
.animate-reveal {
  animation: clipReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```
保留旧的 `.animate-fade-up`（Task 6 再删除）

**Must NOT do**: 不删旧的 fadeUp

**References**: style.css:110-117（现有 fadeUp 动画）

**Acceptance Criteria**:
- [ ] `grep "animate-reveal" src/style.css` 返回非空

**Commit**: YES | `feat: add clip-reveal bottom-to-top animation`

---

### 4. 重构 App.vue（全局交互组件）

**What to do**:
改写 `src/App.vue`：
```vue
<template>
  <div class="app-shell">
    <ScrollProgress />
    <TabNav />
    <main class="app-main">
      <router-view />
    </main>
    <AppFooter />
    <LoadingOverlay />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ScrollProgress from './components/ScrollProgress.vue'
import TabNav from './components/TabNav.vue'
import AppFooter from './components/AppFooter.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import { useGlobalLoading } from './utils/useGlobalLoading'

const router = useRouter()
const { startRouter, stopRouter } = useGlobalLoading()
router.beforeEach((_to, _from) => { startRouter() })
router.afterEach(() => { stopRouter() })
router.onError(() => { stopRouter() })
</script>

<style scoped>
.app-shell { display: flex; flex-direction: column; min-height: 100vh; }
.app-main { flex: 1; }
</style>
```

**Must NOT do**: 不改 router hooks 逻辑、不改 LoadingOverlay

**References**: App.vue:1-40

**Acceptance Criteria**:
- [ ] App.vue 中 ScrollProgress、TabNav 各只出现一次
- [ ] `npm run build` 成功

**Commit**: YES | `refactor: centralize ScrollProgress/TabNav/BackToTop to App.vue`

---

### 5. 从页面移除重复的 ScrollProgress / TabNav

**What to do**: 编辑以下文件，删除 `<ScrollProgress />` 和 `<TabNav />` 的 import ＋模板引用：
- `src/pages/Home.vue` — 删 import `ScrollProgress`/`TabNav`，删模板中 `<ScrollProgress />` `<TabNav />`
- `src/pages/Notes.vue` — 同上
- `src/pages/ArticleView.vue` — 同上
- `src/pages/DocsPage.vue` — 同上
- `src/pages/About.vue` — 同上

**Parallelization**: Wave 2 | Blocked By: 4

**References**: 每个文件头部 2-8 行 import

**Acceptance Criteria**:
- [ ] `grep -r "ScrollProgress" src/pages/` 空
- [ ] `grep -r "TabNav" src/pages/` 空
- [ ] `npm run build` 成功

**Commit**: YES | `refactor: remove per-page ScrollProgress/TabNav imports`

---

### 6. 替换 `.animate-fade-up` → `.animate-reveal`

**What to do**:
1. 全局搜索替换所有 `.animate-fade-up` 为 `.animate-reveal`
2. 涉及文件：Home.vue / Notes.vue / ArticleView.vue / DocsPage.vue / About.vue
3. 从 style.css 删除 `.animate-fade-up` 完整定义

**Parallelization**: Wave 2 | Blocked By: 3, 4

**Acceptance Criteria**:
- [ ] `grep -r "animate-fade-up" src/` 空
- [ ] `npm run build` 成功

**Commit**: YES | `feat: replace fade-up animation with gradient reveal`

---

### 7. 重写 AppSidebar 为全局滑动抽屉

**What to do**:
1. 完全重写 `src/components/AppSidebar.vue`：
   - 从右侧滑入的抽屉面板 + 遮罩层
   - Props: `visible: boolean`, `category?: string`, `notes?: NoteMeta[]`, `toc?: TocItem[]`, `currentSlug?: string`
   - Emits: `close`, `selectNote(slug)`
   - Transition slide-in 动画
   - 含分类导航列表（复用现有模式）+ TOC（复用 TOCSidebar）
2. 新建 `src/utils/useSidebar.ts` 状态管理：
   ```ts
   import { ref } from 'vue'
   import type { NoteMeta } from './content'
   import type { TocItem } from './markdown'

   export const sidebarVisible = ref(false)
   export const sidebarCategory = ref('')
   export const sidebarNotes = ref<NoteMeta[]>([])
   export const sidebarToc = ref<TocItem[]>([])
   export const sidebarCurrentSlug = ref('')

   export function openSidebar(opts: { category?: string; notes?: NoteMeta[]; toc?: TocItem[]; currentSlug?: string }) {
     sidebarCategory.value = opts.category || ''
     sidebarNotes.value = opts.notes || []
     sidebarToc.value = opts.toc || []
     sidebarCurrentSlug.value = opts.currentSlug || ''
     sidebarVisible.value = true
   }
   export function closeSidebar() { sidebarVisible.value = false }
   ```

**Must NOT do**: 不修改 DocsPage 现有侧栏

**References**: old AppSidebar.vue:1-48 | TOCSidebar.vue（复用）| DocsPage.vue:100-141（样式参考）

**Acceptance Criteria**:
- [ ] 抽屉可打开/关闭
- [ ] 点击遮罩关闭
- [ ] 显示分类笔记列表 + 目录导航

**Commit**: YES | `feat: redesign AppSidebar as global sliding drawer`

---

### 8. 集成 AppSidebar 到 App.vue + Notes/ArticleView

**What to do**:
1. `src/App.vue`：添加 `<AppSidebar :visible="sidebarVisible" ... @close="closeSidebar" />`
2. `src/pages/Notes.vue`：添加"目录"按钮，`@click="openSidebar({ category, notes, toc })"`
3. `src/pages/ArticleView.vue`：添加"目录"按钮，`@click="openSidebar({ toc: note.toc })"`

按钮样式：与导航栏风格一致的小型文字按钮。

**Parallelization**: Wave 3 | Blocked By: 4, 7

**Acceptance Criteria**:
- [ ] Notes 页面可打开侧栏查看分类列表
- [ ] ArticleView 页面可打开侧栏查看目录
- [ ] 侧栏内容正确匹配当前上下文

**Commit**: YES | `feat: integrate AppSidebar into Notes and ArticleView`

---

### 9. 最终清理 + 完整验证

**What to do**:
1. 检查所有 import 是否有残余（未使用的引用）
2. 确认 `.animate-fade-up` 已彻底从 style.css 删除
3. 确认 `content.ts` 无 share 残余
4. 运行 `npm run build` + `npm run test`
5. 运行 `npm run dev` 快速浏览所有路由

**Parallelization**: Wave 3 | Blocked By: 全部

**Acceptance Criteria**:
- [ ] `npm run build` 成功
- [ ] `npm run test` 通过
- [ ] 所有 6 条路由正常渲染
- [ ] 无 share 残余引用

**Commit**: YES | `chore: final cleanup after optimization`

---

## Final Verification Wave
- [ ] F1. 构建验证 — `npm run build && npm run test`
- [ ] F2. 路由验证 — 手动检查 6 条路由 + /shares 404
- [ ] F3. 交互验证 — 滚动进度条可动 / 动画顺畅 / 侧栏开关正常
- [ ] F4. 代码残留检查 — `grep -ri "share" src/ --include="*.ts" --include="*.vue"`

## Commit Strategy
每完成一个 Task 提交一次，9 次原子提交，每个可独立回滚。

## Success Criteria
- 代码量净减少（删除 shares 模块 6+ 文件）
- 构建零警告
- 全局交互统一管理
- 动画更平滑有质感
- 侧栏功能可用但非侵入
