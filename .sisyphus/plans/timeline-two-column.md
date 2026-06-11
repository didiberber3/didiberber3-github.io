# 时间轴双栏页面

## TL;DR
> **Summary**: 创建独立时间轴页面 `/timeline`，左栏年份 + 右栏月份/卡片双栏布局，保留 `时间轴` 导航入口
> **Deliverables**: Timeline.vue 页面文件 + 路由 + TabNav/AppSidebar 导航更新
> **Effort**: Short
> **Parallel**: YES — 2 waves
> **Critical Path**: Timeline.vue 创建 → 路由/导航引用

## Context
### Original Request
用户要求"左右双栏（年份侧栏 + 内容区）"时间轴布局：
```
2026  │  3月
      │  [卡片] [卡片]
2025  │  12月
      │  [卡片]
```
### Interview Summary
- Notes.vue 已去掉年月分割，保留纯文章列表
- Timeline.vue 独立页面，左栏年份（带小圆点装饰），右栏月份+卡片（带竖线）
- 视觉层次：年份 (橙色大号) > 月份 (灰色字号) > 卡片 (毛玻璃)
- 无抽屉功能，无折叠
- 沿用 Notes.vue 相同的 hero header SVG 风格

### Metis Review (gaps addressed)
- 无

## Work Objectives
### Core Objective
创建独立时间轴页面 `/timeline`，双栏 grid 布局

### Deliverables
- `src/pages/Timeline.vue` — 新建文件
- `src/router/index.ts` — 加 `/timeline` 路由
- `src/components/TabNav.vue` — 恢复"时间轴"标签指向 `/timeline`
- `src/components/AppSidebar.vue` — 恢复"时间轴"导航指向 `/timeline`

### Definition of Done
```bash
npm run build  # 无错误
```

### Must Have
- 左栏：年份橙色粗体 + 右侧圆点
- 右栏：月份小字 + 卡片列表，左侧竖线贯穿
- 年份首次出现时竖线从顶部开始
- 月份左侧有小灰点标记

### Must NOT Have
- 无抽屉/折叠功能
- 无搜索栏（纯时间轴视图）
- 不修改 Notes.vue

## Execution Strategy
### Parallel Execution Waves

Wave 1: Timeline.vue 创建（核心文件）
Wave 2: 路由 + 导航更新（3个文件，可并行）

Wave 1 → Wave 2

## TODOs

- [ ] 1. 创建 `src/pages/Timeline.vue`

  **What to do**: 按以下规格创建文件：
  - Script: `yearGroups` computed（nested YearGroup[]，按 date 分组 year→months→notes）
  - Template: grid 双栏 `<div class="tl-grid">`，每行 `tl-year-cell`（左）+ `tl-content-cell`（右）
  - Hero header SVG: 与 Notes.vue 一致的轨道 SVG（`tl-` 前缀）
  - 标题 "时间轴"，副标题 "按时间线浏览全部笔记"
  - CSS grid: `grid-template-columns: 5rem 1fr; column-gap: 1.25rem`
  - 左栏：`.tl-year-num` 1.375rem 800 weight accent 色，右对齐
  - 左栏 `::after`: 8px 橙色圆点，绝对定位在右侧边界
  - 右栏：`border-left: 2px solid var(--border-primary)` 竖线
  - 月份：`.tl-month-heading` 0.8125rem text-secondary，`::before` 4px 灰点
  - 卡片：与 Notes.vue 一致的 `.article-card` 样式（毛玻璃 + hover 效果 + cardIn 动画）
  - 卡片 `margin-bottom: 2px` 而非 gap（因为竖线需要连续）

  **Must NOT do**:
  - 不添加搜索功能
  - 不添加折叠/抽屉
  - 不使用 gap 在 grid 中（会断开竖线）

  **References**:
  - 样式参考当前 `src/pages/Notes.vue` 的卡片/动画 CSS
  - grouping 逻辑参考 Notes.vue 之前删除的 `yearGroups` computed（相同的接口 + 逻辑）
  - Hero SVG 复制自 Notes.vue，CSS 类名改为 `tl-` 前缀避免 scoped 冲突

  **Acceptance Criteria**:
  - [ ] `npm run build` 无报错
  - [ ] 文件完成，无 `TODO` 或占位符

  **Commit**: NO（与后续任务一起提交）

- [ ] 2. 添加 `/timeline` 路由

  **What to do**: 在 `src/router/index.ts` 的 `/notes` 路由下方添加：
  ```ts
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('../pages/Timeline.vue'),
  },
  ```

  **Acceptance Criteria**:
  - [ ] `npm run build` 无报错

- [ ] 3. 更新 TabNav 添加"时间轴"

  **What to do**: 在 `src/components/TabNav.vue` 的 `tabs` 数组中插入：
  ```ts
  { label: '时间轴', path: '/timeline', icon: '<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { label: '笔记', path: '/notes', icon: '...文档图标...' },
  ```
  （时间轴在 首页 之后，笔记在 时间轴 之后）
  同时更新 `isActive` 函数添加 `/timeline` 的分支：
  ```ts
  if (path === '/timeline') return route.path === '/timeline'
  ```

  **References**:
  - 当前 TabNav 第 30-36 行的 tabs 数组
  - 第 38-42 行的 isActive 函数

  **Acceptance Criteria**:
  - [ ] `npm run build` 无报错

- [ ] 4. 更新 AppSidebar 添加"时间轴"

  **What to do**: 在 `src/components/AppSidebar.vue` 的 `navLinks` 数组中插入：
  ```ts
  { label: '首页', path: '/' },
  { label: '时间轴', path: '/timeline' },
  { label: '笔记', path: '/notes' },
  { label: '文档', path: '/docs' },
  { label: '关于', path: '/about' },
  ```

  **References**:
  - 当前 AppSidebar 第 16-21 行的 navLinks 数组

  **Acceptance Criteria**:
  - [ ] `npm run build` 无报错

## Final Verification Wave
- [ ] F1. `npm run build` 通过
- [ ] F2. `timeline` 路由正确加载页面
- [ ] F3. TabNav 和 AppSidebar 的"时间轴"导航正确指向 `/timeline`
- [ ] F4. Notes.vue 不受影响

## Commit Strategy
- 一次性提交：`feat(timeline): 创建双栏时间轴页面`

## Success Criteria
- `/timeline` 双栏渲染：左年份 | 右月份+卡片
- 竖线连贯，圆点装饰正确
- 导航栏时间轴可点击跳转
- Notes.vue 纯列表无变化
