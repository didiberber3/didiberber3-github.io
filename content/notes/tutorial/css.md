## `style.css` 完整解剖

```
总行数: 269 行
功能块: 7 个
Tailwind 指令: 3 行
CSS 变量: 36 行（亮/暗各 15 个）
@layer base:    22 行
@layer components: 100 行
prose 覆写:     34 行
hljs 暗色适配:   30 行
动画:           16 行
滚动条:         14 行
```



------

### 块 1：Tailwind 指令（L1-L3）

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```



这三行把 Tailwind 的所有样式注入到 CSS 中。顺序决定了优先级：**base < components < utilities**。后面的 `@layer base { }` 和 `@layer components { }` 就是往这两个层里加自定义样式，保证优先级正确。

------

### 块 2：主题变量（L5-L40）

```
:root { ··· }        /* 亮色模式 — 15 个变量 */
.dark { ··· }        /* 暗色模式 — 覆盖同样 15 个变量 */
```



这是全站的 **色彩引擎**。整个网站没有硬编码颜色，所有颜色都通过 `var(--xxx)` 引用这 15 个变量。切换亮/暗本质就是切换这组变量。

变量分类：

| 类别     | 变量                 | 亮色值    | 暗色值    | 用在哪儿              |
| :------- | :------------------- | :-------- | :-------- | :-------------------- |
| **背景** | `--bg-primary`       | `#ffffff` | `#0f172a` | body、页面主背景      |
|          | `--bg-secondary`     | `#f9fafb` | `#1e293b` | hover 背景、次级区块  |
|          | `--bg-tertiary`      | `#f3f4f6` | `#334155` | 更深一层背景          |
| **文字** | `--text-primary`     | `#111827` | `#f1f5f9` | 标题、正文            |
|          | `--text-secondary`   | `#6b7280` | `#94a3b8` | 辅助文字、日期        |
|          | `--text-muted`       | `#9ca3af` | `#64748b` | 最淡文字、placeholder |
| **边框** | `--border-primary`   | `#e5e7eb` | `#334155` | 主要分割线            |
|          | `--border-secondary` | `#d1d5db` | `#475569` | 较深边框（tag）       |
| **强调** | `--accent`           | `#16a34a` | `#4ade80` | 全部交互元素的主色    |
|          | `--accent-hover`     | `#15803d` | `#22c55e` | accent 的加深版       |
|          | `--accent-bg`        | `#f0fdf4` | `#052e16` | 选中态的浅绿背景      |
| **代码** | `--code-bg`          | `#f9fafb` | `#1e293b` | 代码块背景            |
|          | `--code-border`      | `#e5e7eb` | `#334155` | 代码块边框            |
| **TOC**  | `--toc-bg`           | `#f9fafb` | `#1e293b` | 目录盒子背景          |
|          | `--toc-border`       | `#e5e7eb` | `#334155` | 目录盒子边框          |

> **注意**: `--toc-bg` 和 `--toc-border` 在最近的修复中虽然去掉了 `.toc-inner` 的 `background + border`，但变量定义保留以备用。

亮色 → 暗色的变化规律：

- **暖白（`#f9fafb` 系）→ 深蓝灰（`#1e293b` 系）**：背景
- **深灰（`#111827`）→ 浅灰白（`#f1f5f9`）**：文字（反转）
- **草绿（`#16a34a`）→ 荧光绿（`#4ade80`）**：强调色（暗色需要更亮来保持对比度）

------

### 块 3：@layer base — 基础重置（L42-L64）

```
@layer base {
  *, *::before, *::after { border-radius: 0; }
  body { background-color: var(--bg-primary); ··· }
  ::selection { background-color: var(--accent); color: white; }
}
```



**`border-radius: 0`** — 全站统一直角，连 `::before`、`::after` 伪元素都切掉圆角。但不带 `!important`，所以组件/第三方内容可以覆盖。

**body 样式** — `line-height: 1.8`（宽松行距）+ `letter-spacing: 0.01em`（微宽字距）+ `-webkit-font-smoothing: antialiased`（字体渲染平滑）。

**选中色** — 用户拖选文字时，背景变绿色、文字变白。

------

### 块 4：@layer components — 组件层（L66-L166）

**4a. 文章卡片 `.article-card`**（L68-L111）

这是全站交互的 **"设计母版"**，其他交互（TOC、文档导航）都继承这个模式。

```
┌─────────────────────────────────────────────┐
│  文章列表（.article-list）                    │
│  ┌─────────────────────────────────────────┐ │
│  │ 每项（.article-card > a）                │ │
│  │ │ 竖线  │ 标题文字                       │ │
│  │ │ 2px绿 │ padding-left: 0.5rem → 1rem  │ │  ← hover 时右移 0.5rem
│  │ └──────┴──────────────────────────────┘ │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```



三个状态变化全部在 `0.2s` 内完成：

1. `border-left`: `transparent` → `var(--accent)`（左侧绿线出现）
2. `padding-left`: `0.5rem` → `1rem`（内容右移）
3. `background-color`: 无 → `var(--bg-secondary)`（灰色背景）

**4b. 标签 `.tag`**（L113-L119）

极简的标签小方块：小字（0.75rem）+ 灰色边框 + 淡色文字。用于分享页面的 tag 标记。

**4c. 节标题 `.section-heading`**（L121-L126）

区块标题：`1.25rem` + `font-weight: 600` + 绿色。用在首页"最新笔记"、"最新分享"上。

**4d. "全部 N 篇" 按钮 `.btn-more`**（L128-L165）

"填充推进"模式的唯一代表：

```
初始状态                   hover 状态
┌────┬──────────┐        ┌──────────────────┐
│ 绿 │ 全部3篇   │        │████ 全部3篇 ████  │  ← 绿色从左到右填充
│ 框 │ 文字绿色  │        │ 文字变白          │
└────┴──────────┘        └──────────────────┘
```



关键技巧：`::before` 用 `transform: scaleX(0)` 隐藏，`hover` 时 `scaleX(1)` 从左边展开。`z-index: -1` 保证填充层在文字下面。

------

### 块 5：Typography 覆写（L168-L201）

```
.prose { max-width: 780px; line-height: 1.8; ··· }
.prose pre { ··· }
.prose code { ··· }
.prose img { border-radius: 0 !important; }
```



这个块覆盖 `@tailwindcss/typography` 插件的默认样式。

**关键是**：`@tailwindcss/typography` 是一个 Tailwind 官方插件，它自动给 `.prose` 内部的 HTML（也就是 Markdown 渲染结果）添加排版样式——标题大小、列表缩进、链接颜色等。

这里的覆盖做了三件事：

1. 把 prose 的所有颜色从 Tailwind 默认改成 CSS 变量（适配亮暗切换）
2. 限制最大宽度 780px（阅读宽度舒适）
3. 把代码块背景改成自定义变量，图片保持直角

------

### 块 6：highlight.js 暗色适配（L203-L237）

```
.dark .hljs { color: #e2e8f0; }
.dark .hljs-keyword { color: #c792ea; }   /* 紫色 — 关键字 */
.dark .hljs-string { color: #c3e88d; }    /* 绿色 — 字符串 */
.dark .hljs-comment { color: #64748b; }   /* 灰色斜体 — 注释 */
.dark .hljs-number { color: #f78c6c; }    /* 橙色 — 数字 */
.dark .hljs-title { color: #82aaff; }     /* 蓝色 — 函数名 */
.dark .hljs-type { color: #ffcb6b; }      /* 黄色 — 类型 */
```



亮色模式直接使用 highlight.js 自带的 `github.css`（灰底黑字）。暗色模式需要覆盖，使用类似 Material Palenight 的配色方案。每个 token 类型（关键字、字符串、注释…）独立着色。

------

### 块 7：动画 + 滚动条（L239-L269）

```
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fadeUp 0.35s ease-out both;
}
```



`fadeUp` 是全局唯一的 CSS animation（其他动画都在各自组件的 scoped style 里）。每个页面容器都加了 `animate-fade-up` 类，路由切换时从下方 12px 淡入，0.35 秒完成，`both` 让动画结束后保持最终状态（不闪回透明）。

**滚动条**（L256-L269）：自定义窄滚动条（6px），颜色随主题变量变化。`:hover` 时加深颜色作为反馈。

------

## 可视化：style.css 功能占比

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  76%  @layer components（文章卡片 + 按钮）
▓▓▓▓▓░░░░░░░░░░░░░░░  14%  :root + .dark 主题变量
▓▓▓░░░░░░░░░░░░░░░░░  11%  prose 覆写
▓▓░░░░░░░░░░░░░░░░░░   8%  hljs 暗色适配
▓░░░░░░░░░░░░░░░░░░░   6%  @layer base（reset）
▓░░░░░░░░░░░░░░░░░░░   5%  动画 + 滚动条
```



------

## 一句话总结

`style.css` = **Tailwind 开关**（L1-L3）+ **色彩引擎**（L5-L40）+ **全局 reset**（L43-L64）+ **核心组件样式**（L66-L166）+ **文章排版**（L168-L201）+ **暗色代码高亮**（L203-L237）+ **页面动画**（L239-L254）+ **滚动条**（L256-L269）。

要改 **全局的东西**（颜色、字体、基础间距、动画时长、代码高亮配色）→ 来这个文件。
要改 **某个组件/页面的交互**（TOC、导航栏、文档页）→ 去对应的 `.vue` 文件。