# CSS 设计规范

> 项目：记录与分享（Blog）  
> 生成日期：2026-05-28  
> 本文档记录所有 CSS 设计决策，作为后续开发的唯一参考。

---

## 目录

1. [设计原则](#1-设计原则)
2. [色彩体系](#2-色彩体系)
3. [字体与排版](#3-字体与排版)
4. [间距体系](#4-间距体系)
5. [动画与交互](#5-动画与交互)
6. [组件样式规范](#6-组件样式规范)
7. [暗色模式](#7-暗色模式)
8. [CSS Token 命名约定](#8-css-token-命名约定)
9. [附录：完整交互对照表](#9-附录完整交互对照表)

---

## 1. 设计原则

```
整体感受: 可读性好、细节多、整体统一、有设计感
风格定位: 直角 + 简单 + 精致
受众定位: 既用于个人记录，也分享给他人阅读
```

### 核心理念

1. **内容优先** — 设计为内容服务，不喧宾夺主
2. **一致性高于一切** — 同类交互用同一种实现，杜绝三套风格
3. **细节决定品质** — 每个 hover 动画、每个间距都是经过设计的
4. **直角语言** — `border-radius: 0` 是品牌特征，不妥协
5. **功能性美观** — 每个设计决策都有功能理由，不为装饰而装饰

---

## 2. 色彩体系

### 2.1 完整色板

| Token | 亮色值 | 暗色值 | 用途 |
|-------|--------|--------|------|
| `--bg-primary` | `#f8f9fa` | `#1a1f2e` | 主背景 |
| `--bg-secondary` | `#f0f1f3` | `#222838` | hover、次级区块 |
| `--bg-tertiary` | `#e8e9ed` | `#2d3448` | 更深一层背景 |
| `--text-primary` | `#1a1a2e` | `#e2e4eb` | 标题、正文 |
| `--text-secondary` | `#6b7280` | `#9499b3` | 辅助文字 |
| `--text-muted` | `#9ca3af` | `#6b7191` | 最淡文字 |
| `--border-primary` | `#e2e4e9` | `#2d3448` | 主分割线 |
| `--border-secondary` | `#d1d4db` | `#3a4158` | 深边框 |
| `--accent` | `#16a34a` | `#67e8f9` | **主强调色** |
| `--accent-hover` | `#15803d` | `#7dd3fc` | 强调悬停 |
| `--accent-bg` | `#e8f5e9` | `#0f2a38` | 选中态背景 |
| `--code-bg` | `#f1f2f5` | `#222838` | 代码块背景 |
| `--code-border` | `#e2e4e9` | `#2d3448` | 代码块边框 |

### 2.2 配色逻辑

```
亮色: 冷白底 + 自然绿强调       → 安静、干净、适合阅读
暗色: 雾霾蓝底 + 青绿强调       → 柔和护眼、通透发光感

亮暗强调色不同策略:
  亮色用绿色 (16a34a)  — 与冷白背景协调，自然不抢眼
  暗色用青绿 (67e8f9)  — 在深色背景上更醒目，有科技感
```

---

## 3. 字体与排版

### 3.1 字体

使用**经典系统字体栈**，零加载、各平台最优：

```
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Microsoft YaHei", "Noto Sans SC", sans-serif;

平台映射:
  macOS / iOS → San Francisco + PingFang SC
  Windows     → Segoe UI + Microsoft YaHei
  Linux       → Noto Sans SC
  兜底        → sans-serif
```

### 3.2 字号层级

| Token | 大小 | 字重 | 用于 |
|-------|------|------|------|
| `--text-h1` | 1.6rem | 700 | 页面标题 |
| `--text-h2` | 1.25rem | 600 | 区块标题 |
| `--text-h3` | 1.125rem | 600 | 子区块标题 |
| `--text-body` | 1rem | 400 | 正文（默认） |
| `--text-sm` | 0.875rem | 400 | 导航文字 |
| `--text-xs` | 0.75rem | 400 | 日期、tag、按钮 |
| `--text-xxs` | 0.6875rem | 400 | TOC 标签、极小文字 |

### 3.3 行距与字距

```
body line-height:     1.8
body letter-spacing:  0.01em
代码块 line-height:   1.6
prose 最大宽度:       780px
全页最大宽度:         1152px（Home）/ 1280px（DocsPage）
```

*4px 间距网格见下一章。*

---

## 4. 间距体系

### 4.1 4px 网格

所有 padding、margin、gap 遵循 4px 网格：

```
 4px  (p-1)
 8px  (p-2)
12px  (p-3)
16px  (p-4)  ← 基本单位
20px  (p-5)
24px  (p-6)
32px  (p-8)
40px  (p-10)
48px  (p-12)
64px  (p-16)
```

### 4.2 常见间距

```
页面两侧安全边距:    16px
导航栏项目间距:      4px
按钮垂直内边距:      4px
按钮水平内边距:      12px
卡片内边距:          16px
分类卡片网格 gap:    16px
TOC 内边距:          16px（背景框）
```

---

## 5. 动画与交互

### 5.1 全局标准

```
交互过渡 (hover / active / focus):
  duration:       0.2s（全站统一）
  timing-function: ease（全站统一）

页面切入:
  animation: fadeUp 0.35s ease-out both
  效果: translateY(12px) + opacity 0 → 正常位置

例外:
  TOC 折叠展开: 0.12s ease（纯 opacity 淡入淡出）
```

### 5.2 解耦的交互单元

所有交互效果定义为独立的 CSS 类，通过添加类名应用到组件，**不将交互代码写在具体组件的样式里**。

```
.interact-slide     → 绿线推进（完整版：绿线 + 右移 + 背景 + 变色）
.interact-slide-bg   → 绿线推进（轻量版：绿线 + 变色，无右移无背景）
.interact-fill      → 绿色填充推进（按钮用）
.interact-line-top  → 顶部绿线推进（分类卡片用，含上移）
```

这样改一处定义，所有用到的地方自动更新。

### 5.3 三种交互模式

#### 模式 A：绿线推进（`.interact-slide`）

```
起始:  border-left: 2px solid transparent
       padding-left: 0.5rem
       color: var(--text-primary)

hover: border-left-color: var(--accent)
       padding-left: 1rem
       background-color: var(--bg-secondary)
       color: var(--accent)

active: border-left-color: var(--accent)
        padding-left: 1rem
        background-color: var(--accent-bg)
        color: var(--accent)
        font-weight: 500

transition: background-color 0.2s, color 0.2s,
            border-color 0.2s, padding-left 0.2s
```

**完整版** — 用于：
- `.article-card > a` — 文章列表项
- 需要三要素（绿线 + 位移 + 背景 + 变色）的场景

#### 模式 A 轻量版（`.interact-slide-bg`）

```
与完整版唯一区别:
  hover 时无 padding-left 变化、无 background-color 变化
  仅 border-left + color 变化

用于:
  `.docs-nav-item` — 文档导航（去掉右移）
  `.toc-h2 a` / `.toc-btn` / `.toc-sub a` — TOC（去掉右移和背景）
```

#### 模式 B：填充推进（`.interact-fill`）

```
初始: border: 2px solid var(--accent)
      color: var(--accent)
      position: relative; overflow: hidden
      ::before (绿色填充层) scaleX(0)
      transform-origin: left
      z-index: -1

hover: color: #fff
       ::before transform: scaleX(1)

transition: transform 0.2s ease
```

用于：
- `.btn-more` — "全部 N 篇" 按钮
- `.visit-btn` — "访问" 按钮

#### 模式 C：顶部边线推进 + 上移（`.interact-line-top`）

```
初始: position: relative; overflow: hidden
      ::before (2px 绿条) scaleX(0)
      transform-origin: left; top: 0

hover: ::before transform: scaleX(1)
       background-color: var(--bg-tertiary)
       transform: translateY(-4px)

transition: transform 0.2s, background-color 0.2s
```

用于：
- `.docs-category-card` — 分类卡片

### 5.4 导航 Tab 规范（独立实现）

导航栏是水平布局，不适合用左边线，单独实现底部绿条：

```
默认: color: var(--text-secondary)
      background: transparent
      ::after (底部 2px 绿条) scaleX(0)

hover: background-color: var(--bg-tertiary)
       ::after transform: scaleX(1)

press: 和 hover 一样，无特殊点击反馈

选中: color: var(--accent)
      background-color: var(--bg-tertiary)
      font-weight: 500
      ::after transform: scaleX(1)

transition: all 0.2s ease

⚠️ hover 和 选中 使用相同的灰底 + 底部绿条 100%
   仅通过文字颜色区分当前选中状态
```

### 5.5 选中态（Active）规范

适用于所有 list-item 类元素的当前选中状态：

```
background-color: var(--accent-bg)
border-left:      2px solid var(--accent)
color:            var(--accent)
font-weight:      500
```

### 5.6 装饰动画

| 元素 | 动画 | 时长 | 循环 |
|------|------|------|------|
| HeroSvg 描边绘制 | stroke-dashoffset → 0 | 1.2s ease-out | 一次性 |
| HeroSvg 浮动 | translateY 0 → -6px | 6s ease-in-out | 无限 |
| LoadingDots 光条 | translateX -100% → 250% | 1.4s ease-in-out | 无限 |
| 主题切换点击旋转 | rotate 0 → 360deg | 0.3s ease | 一次性 |
| 主题切换 hover 旋转 | rotate 0 → 360deg | 0.6s ease | 一次性（hover 触发） |

装饰动画必须设置 `aria-hidden="true"`。

---

## 6. 组件样式规范

### 6.1 文章卡片（`.article-card`）

```
结构:
  .article-list (divide-y)
    └─ .article-card
         └─ a.interact-slide
              ├─ .article-title (text-base font-medium)
              └─ .article-date (text-xs, muted)

交互: 模式 A 完整版（interact-slide）
      起始 pl-2 (0.5rem) → hover pl-4 (1rem)
      hover 时标题文字变 accent 色
      press: 和 hover 一样，无特殊点击反馈
      无选中/已访问标记
```

### 6.2 文档导航（`.docs-nav`）

```
结构:
  .docs-nav
    ├─ .docs-nav-label (uppercase, muted, 11px)
    └─ .docs-nav-list
         └─ .docs-nav-item.interact-slide-bg (flex, justify-between)
              ├─ .docs-nav-title
              └─ .docs-nav-date

交互: 模式 A 轻量版（interact-slide-bg）
      绿线 + 文字变色，无右移，无背景变化
      选中: 模式 A active 规范
```

### 6.3 分类卡片（`.docs-category-card`）

```
结构:
  .docs-category-card.interact-line-top
    ├─ .docs-category-name (1rem, font-semibold)
    └─ .docs-category-count (0.75rem, muted)

交互: 模式 C（顶部绿线 + 上移 4px）
      网格: grid, auto-fill, minmax(160px, 1fr), gap 16px
```

### 6.4 按钮（`.btn-more` / `.visit-btn`）

```
结构:
  .btn-more.interact-fill
    └─ 文字

交互: 模式 B（填充推进）
      font-size: 0.75rem; padding: 2px 12px
```

### 6.5 TOC 侧边栏

```
结构:
  .toc-wrapper (sticky, top-5rem)
    └─ .toc-inner (padding: 16px)
         ├─ .toc-label (uppercase, 11px, muted)
         └─ .toc-list
              ├─ .toc-h2 > a.interact-slide-bg    (h2 无子项)
               ├─ .toc-h2-toggle > button.toc-btn.interact-slide-bg
               │    └─ 展开时: font-weight 600；收起时: font-weight 400
               └─ .toc-sub > a.interact-slide-bg   (h3 子项, 起始 pl-6)

交互: 模式 A 轻量版（interact-slide-bg）
      仅绿线 + 文字变色，无右移，无背景变化
      选中: 模式 A active 规范

背景框: 保留浅色背景框（var(--toc-bg)）+ 边框（var(--toc-border)）
       padding: 16px，与内容区域视觉区分

折叠: 
      展开: toc-btn font-weight: 600（加粗表示可折叠）
      收起: toc-btn font-weight: 400（正常粗细）
      无箭头图标，纯文字粗细区分
      Vue Transition, name="toc-sublist"
      opacity 0.12s ease
      IntersectionObserver 跟踪阅读位置
```

### 6.6 搜索框（`SearchBar.vue`）

```
input: w-full, px-4, py-2, text-sm
border: 1px solid var(--border-primary)
hover: 无变化（不响应 hover）
focus: border-color var(--accent)（内联 @focus 设置）
无 outline，用 border 颜色变化代替
```

### 6.7 代码块

```
背景: var(--code-bg)
边框: 1px solid var(--code-border)
字体: 继承 body 系统字体栈, 0.8125rem

暗色高亮配色:
  keyword/operator:  #c792ea (紫)
  string/number:     #c3e88d (绿)
  comment:           #64748b (灰斜体)
  number:            #f78c6c (橙)
  function/attr:     #82aaff (蓝)
  type/built-in:     #ffcb6b (黄)
  meta/variable:     #f07178 (红)
```

### 6.8 加载指示器（`LoadingDots.vue`）

```
.loading-track: height 2px, bg border-primary
.loading-fill: 40% width, gradient transparent → accent → transparent
animation: streamFlow 1.4s ease-in-out infinite
```

### 6.9 自定义滚动条

```
::-webkit-scrollbar: width 6px, height 6px
::-webkit-scrollbar-track: transparent
::-webkit-scrollbar-thumb: var(--border-secondary)
:hover: var(--text-muted)
```

---

## 7. 暗色模式

### 7.1 切换机制

```
切换: <html class="dark">
存储: localStorage key="theme" | "dark" | "light"
优先级: localStorage → prefers-color-scheme
防闪: IIFE 在 Vue mount 前执行（src/main.ts）
```

### 7.2 实现方式

```css
:root { /* 亮色值 */ }
.dark { /* 暗色值 */ }
```

组件中统一使用 `var(--xxx)` 引用，自动适配亮暗。

---

## 8. CSS Token 命名约定

### 8.1 变量命名

```
--{category}-{property}

分类: bg- / text- / border- / accent- / code- / toc-
属性: -primary / -secondary / -tertiary / -muted / -hover / -bg
```

### 8.2 交互类命名

```
.interact-slide       模式 A 完整版（绿线 + 位移 + 背景 + 变色）
.interact-slide-bg    模式 A 轻量版（仅绿线 + 变色）
.interact-fill        模式 B（填充推进）
.interact-line-top    模式 C（顶部绿线 + 上移）
```

所有新交互必须从以上中选择，不得自创。

---

## 9. 附录：完整交互对照表

| 组件 | 交互模式 | 右移 | 背景变灰 | 文字变色 | 绿线/绿条 | press 反馈 | 特殊效果 |
|------|---------|------|---------|---------|----------|----------|---------|
| 文章卡片 | A 完整版 | ✅ 0.5rem | ✅ bg-secondary | ✅ accent | ✅ 2px left | 同 hover（无特殊反馈） | — |
| 文档导航 | A 轻量版 | ❌ | ❌ | ✅ accent | ✅ 2px left | 同 hover | active 加 accent-bg |
| TOC h2/h3 | A 轻量版 | ❌ | ❌ | ✅ accent | ✅ 2px left | 同 hover | active 加 accent-bg |
| 导航 Tab | 底部条 | — | ✅ bg-tertiary | ✅ accent | ✅ bottom 2px | 同 hover | hover/选中皆灰底+100%条 |
| "更多" 按钮 | B 填充 | — | — | 主题色→bg色 | — | 同 hover | 主题色从左至右填充 |
| "访问" 按钮 | B 填充 | — | — | 主题色→bg色 | — | 同 hover | 主题色从左至右填充 |
| 分类卡片 | C 顶线 | — | ✅ bg-tertiary | — | ✅ top 2px | 同 hover | translateY -4px |
| 主题切换 | — | — | hover 时 bg-tertiary | — | — | — | hover 时图标 360° 旋转 0.6s |

### 决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-05-28 | 亮色冷白 #f8f9fa | 减少眩光 |
| 2026-05-28 | 暗色雾霾蓝 #1a1f2e + 青绿 #67e8f9 | 柔和护眼 |
| 2026-05-28 | 亮暗不同强调色 | 暗色需要更醒目的颜色 |
| 2026-05-28 | 全站 MapleMono CN | 统一感 |
| 2026-05-29 | 撤销 MapleMono CN，改用系统字体栈 | Windows 无 MapleMono，且 CDN 加载有兼容问题 | 
| 2026-05-28 | 4px 间距网格 | 更灵活 |
| 2026-05-28 | 交互 transition 统一 0.2s ease | 一致性 |
| 2026-05-28 | 页面切入 0.35s ease-out | 仪式感 |
| 2026-05-28 | TOC 折叠 0.12s opacity | 轻量、不打扰 |
| 2026-05-28 | 交互类解耦成独立 utility | 一处修改全局生效 |
| 2026-05-28 | 文档导航用轻量版（去右移） | 侧边栏不需大幅位移 |
| 2026-05-28 | TOC 用轻量版（去右移+背景） | 保持专注阅读 |
| 2026-05-28 | 导航 Tab hover/active 皆灰底+100%绿条 | 干净、一致 |
| 2026-05-28 | 分类卡片 hover 上移 4px | 增加立体感 |
| 2026-05-28 | TOC 保留背景框 | 与正文视觉区分 |
| 2026-05-28 | 直角不妥协 | 品牌特征 |
| 2026-05-29 | 导航 Tab 无 press 反馈 | 简化点击效果 |
| 2026-05-29 | 文章卡片无 press 反馈 | 简化点击效果 |
| 2026-05-29 | 分类卡片无 press 反馈 | 简化点击效果 |
| 2026-05-29 | 文档导航无 press 反馈 | 简化点击效果 |
| 2026-05-29 | 按钮无 press 反馈 | 简化点击效果 |
| 2026-05-29 | TOC 无 press 反馈 | 简化点击效果 |
| 2026-05-29 | TOC 折叠去箭头，改用 font-weight 区分 | 更干净 |
| 2026-05-29 | 主题切换 hover 图标 360° 旋转 0.6s | 增加趣味 |
| 2026-05-29 | 搜索框无 hover 反馈，仅 focus 变边框色 | 简洁 |
| 2026-05-29 | 所有点击微反馈统一取消 | 保持一致、不冗余 |
