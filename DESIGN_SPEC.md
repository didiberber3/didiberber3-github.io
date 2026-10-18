# DESIGN SPEC — 小窝 · 极简技术笔记

> 本文件是本次 UI 重构的唯一事实来源。所有实现必须服从本文件；实现与本文件冲突时，先改实现，再回来补充本文件。
> 技术栈保持不变：Vue 3 + TypeScript + Vite + 原生 CSS（CSS 变量 + scoped styles）。**不引入任何新依赖。**

---

## 1. Design Read

- 页面类型：个人技术笔记博客（Java / Godot / 前端 / 工具），中文，作者个人维护。
- 受众：作者本人回看、同行读者、可能翻仓库的招聘方。
- 气质：安静、精确、可读，像一本排版严谨的编程手册，而不是营销落地页。
- 三档（dials）：`DESIGN_VARIANCE: 6` / `MOTION_INTENSITY: 4` / `VISUAL_DENSITY: 4`。
- 核心手法：细线、等宽元数据、克制的绿色、清晰的字号层级、几乎不用卡片和阴影。用版面和留白组织信息，而不是容器。

### 1.1 一句话原则

**每加一个边框、阴影、卡片、装饰，先问它是否在传递层级；不能就删掉，用间距和线解决。**

---

## 2. 硬性禁令（违反即返工）

1. **禁止 em dash `—` 与 en dash `–`**（任何可见文案、标题、按钮、alt、注释中的示例文案）。中文破折号一律改写为句号、逗号或冒号。
2. **禁止圆角**（全局 `border-radius: 0`，唯一例外：`.line-num` 等不需要；不要出现任何 `border-radius: 999px`）。
3. **禁止阴影**：除抽屉面板与快速目录弹层可各用一条极淡的 `--shadow-pop` 外，页面不得出现 `box-shadow`。
4. **禁止三列等高卡片**、渐变、玻璃拟态、霓虹发光、AI 紫、装饰性圆点、区块编号 eyebrow（`01 / INDEX` 类）、版本号脚注、滚动提示、天气/城市条。
5. **禁止 emoji**（包括按钮、空态文案）。
6. **禁止硬编码颜色/字号/间距**：组件内只能用 `var(--token)` 或 `var(--space-*)`。例外：`rgba()` 只能出现在 `theme.css` 的 token 定义里。
7. **禁止常规 scroll 监听**。滚动相关优先用 `IntersectionObserver` 或 CSS scroll-driven animation；允许两处 rAF 节流 + passive 的例外：`ScrollProgress` 的 CSS 兼容兜底（5.4），以及 `useReadingProgress` 为回到顶部按钮提供实时进度（5.5）。
8. **禁止手写装饰性 SVG 插画**；仅允许功能性箭头/关闭等 1.5px 线性小图标（统一 stroke-width 1.5，`currentColor`）。**分类不再使用 SVG 图标**，图标不要引入新依赖。
9. **禁止 `h-screen`**；全高用 `min-height: 100dvh`。
10. **禁止改动**：路由路径与 slug、`content/` 内容、`vite.config.ts` 的 `base`、RSS 生成逻辑、GitHub Pages 404 重定向逻辑、页面文案语义（关于页文字保持原文，只允许排版调整）。
11. 不要使用 `!important`（例外：`prefers-reduced-motion` 覆盖块）。
12. 单个 `.vue` 文件不超过约 300 行；超出就拆组件。

---

## 3. Design Tokens（`src/styles/theme.css`，已由 Lead 落地）

### 3.1 字体

- `--font-sans`：系统无衬线中文栈（SF Pro / Segoe UI / PingFang SC / 微软雅黑 / Noto Sans SC）。
- `--font-mono`：SF Mono / JetBrains Mono / Cascadia Code / Consolas，用于日期、计数、分类、代码、标签。
- 全文无衬线，**不使用衬线体**。标题用 `font-weight: 700` + `letter-spacing: -0.02em`；正文 `line-height: 1.75`；文章正文 `1.0625rem / 1.85`。
- 中文标题用 `text-wrap: balance`，正文段落 `text-wrap: pretty`。
- 等宽数字统一 `font-variant-numeric: tabular-nums`（`.mono` 已内置）。

### 3.2 字号阶梯

| Token         | 值                                      | 用途                   |
| ------------- | --------------------------------------- | ---------------------- |
| `--text-xs`   | 0.75rem                                 | 元数据、标签、代码题头 |
| `--text-sm`   | 0.875rem                                | 次级正文、导航、按钮   |
| `--text-base` | 1rem                                    | 基础正文               |
| `--text-md`   | 1.0625rem                               | 文章正文               |
| `--text-lg`   | 1.25rem                                 | 区块标题、页面标题小号 |
| `--text-xl`   | 1.5rem                                  | 页面标题、文章 H2      |
| `--text-2xl`  | 1.875rem                                | 文章大标题             |
| `--text-3xl`  | clamp(2.25rem, 1.6rem + 2.6vw, 3.25rem) | 首页刊头、404          |

### 3.3 颜色（单强调色：松绿）

- 唯一强调色：`--accent`（亮色深松绿 `#0e7a4a`，暗色亮松绿 `#4fd18b`）。全站只允许这一个彩色，状态色也用 accent / text-secondary / border-strong 表达。
- 中性色为唯一一套冷灰（带一丝绿调）：`--bg-primary/secondary/tertiary/raised`、`--text-primary/secondary/muted`、`--border-primary/secondary/strong`。
- 语义：链接与激活用 `--accent`；hover 用 `--accent-hover`；浅底强调用 `--accent-bg`；分隔线默认 `--border-primary`，需要更强时 `--border-secondary`。
- 选中文本：背景 `--accent`，文字 `--text-inverse`。
- 禁止纯黑 `#000` 与纯白 `#fff`。

### 3.4 间距、容器、动效

- `--space-1..24` = 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6rem 的 8px 节奏。
- 容器：`--container: 74rem`（页面外壳）；`--reading: 44rem`（文章阅读列）；`--nav-h: 3.5rem`。
- 过渡：`--dur-fast: .15s` / `--dur: .22s` / `--dur-slow: .45s`，缓动 `--ease-out: cubic-bezier(.22,1,.36,1)`。
- 动效原则（MOTION 4）：只在「入场、hover、状态切换」三处动；单次播放，无无限循环；必须写 `prefers-reduced-motion` 降级。

---

## 4. 全局类契约（`src/styles/base.css`，已由 Lead 落地）

| 类                                                                 | 作用                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `.page-shell`                                                      | 页面外壳：`max-width: var(--container)` + 左右 `clamp(1rem, 4vw, 2rem)` 内边距 + 居中 |
| `.page-content`                                                    | 内容竖向节奏：上 `clamp(1.5rem,4vw,2.5rem)`，下 `6rem`                                |
| `.mono`                                                            | 等宽 + tabular-nums                                                                   |
| `.meta`                                                            | 元数据：mono + `--text-xs` + `--text-muted`                                           |
| `.text-muted` `.text-secondary` `.text-center` `.text-sm` `.py-16` | 保留的旧工具类，语义不变                                                              |
| `.animate-reveal`                                                  | 页面入场（透明度 + 10px 上移，单次）                                                  |
| `.skip-link`                                                       | 键盘跳过导航，`focus-visible` 时出现在左上角                                          |
| `:focus-visible`                                                   | 2px accent 描边，offset 2px（全局）                                                   |

已有页面大量使用旧工具类，**不要删除**这些类，只允许扩充。

---

## 5. 页面与组件契约

> 所有颜色/间距必须来自 token。所有组件都要显式写 `< 768px` 与必要的 `< 480px` 降级。

### 5.1 导航 `TabNav.vue`（owner: A）

- 单行、高度 `var(--nav-h)`（56px），`position: sticky; top: 0`，`z-index: var(--z-nav)`，底部 1px `--border-primary`。
- 结构：`品牌(小窝，纯文字)` | `首页 / 关于` | `回到顶部 / 主题切换`。分类、标签、归档不再占导航位，全部从首页进入。
- 品牌点击回 `/`；当前页 `aria-current="page"` 且文字 `--accent`，底部 2px accent 下划线 `scaleX(1)`；hover 只让下划线滑入，不换底色。
- 图标按钮统一 `.interact-btn-icon`（interact.css 提供）：28×28、1px 边框、透明底、hover 只变边框与前景色 + 2px 底部 accent 线。
- 主题切换：保留点击旋转 300ms；`prefers-reduced-motion` 下取消旋转。
- 移动端（< 640px）：字号降到 0.8125rem，按钮内边距收紧，**必须保持单行**。

### 5.2 页脚 `AppFooter.vue`（owner: A）

- 顶部 1px 线，单行，`.meta` 风格：`© 2026 小窝`、`RSS`（链接 `${import.meta.env.BASE_URL}rss.xml`）、`关于`。
- 居中或与页面容器左对齐均可，但必须与 `.page-shell` 同宽居中；高 ≤ 64px。

### 5.3 页面标题 `PageHead.vue`

- 结构：`h1` 标题 + 底部 1px `--border-primary` 分隔；无返回按钮、无计数。
- 标题 `--text-xl` / 700 / 紧字距，`margin-bottom: 1.5rem`；目前仅关于页使用。

### 5.4 阅读进度 `ScrollProgress.vue`

- 2px accent 线，固定视口顶部，`z-index: var(--z-progress)`。
- 优先用 **CSS scroll-driven animation**（`animation-timeline: scroll(root block)` + `transform: scaleX()`），不支持 scroll 事件监听。
- **兼容兜底**：检测不到 `animation-timeline` 支持时（旧 Chromium / 旧 Safari），改用 `requestAnimationFrame` 节流的 passive `scroll` 监听驱动内联 `transform`，不允许直接逐帧 setState；组件卸载时移除监听并 `cancelAnimationFrame`。
- `prefers-reduced-motion` 下仍保留滚动联动（进度条是状态指示，不是装饰动画）。

### 5.5 回到顶部 `BackToTop.vue`

- 用 `IntersectionObserver` 观察顶部 300px 的 sentinel 决定显隐（滚动超过 300px 出现），不使用 scroll 监听判断显隐。
- **按钮同时是阅读进度指示**：默认显示实时百分比（mono 10px）+ 底部 2px accent 进度线（`scaleX(progress)`）；hover / `focus-visible` 时数字淡出、换成向上箭头图标，进度线保留。
- 进度值来自 `src/utils/useReadingProgress.ts`：rAF 节流 + passive scroll，`aria-label` 同步为「回到顶部，当前阅读进度 N%」。
- 按钮 32×32，`.interact-btn-icon` 基础样式；出现/消失用 150ms 透明 + 4px 位移；`< 768px` 隐藏。
- 点击 `window.scrollTo({ top: 0, behavior: 'smooth' })`（reduced-motion 时用 `auto`）。
- 更新 `src/__tests__/BackToTop.test.ts`：适配 IntersectionObserver、百分比、进度线，以及卸载时移除 scroll 监听。

### 5.6 文章目录 `ArticleToc.vue` + `TocList.vue`

- **宽屏（>=1100px）**：文章页右侧常驻 sticky 目录，跟随滚动高亮；高亮条目自动滚到目录可视区中部；目录独立滚动，不带动页面滚动。右栏不显示「目录」文字标题，直接展示条目（`aria-label="文章目录"` 已说明语义）。
- **窄屏（<1100px）**：右下角「目录 N」按钮，点开底部抽屉（`role="dialog"`）；抽屉头部只保留拖动条与关闭按钮，不再重复写「目录」；选中条目后抽屉自动收起并滚动到对应标题；Esc / 点击遮罩 / 关闭按钮均可关闭；打开时锁 body 滚动，关闭后焦点回到触发按钮。
- 目录层级：h1 最重（`--text-secondary` / 500），h2 缩进且更淡，h3 更小更淡；右栏字号 0.8125rem（h3 0.75rem），移动抽屉内恢复 `--text-base` / `--text-secondary` 保证可读；激活项 accent + 2px 左线。
- **取消「点击正文标题弹快速目录」**：标题只作为锚点，不再有 pointer 光标和浮层。
- 旧 `AppSidebar.vue` 抽屉与 `useSidebar.ts` 已删除，导航不再有汉堡按钮；「同类文章」移到文章底部（见 5.12）。

### 5.7 全局加载（owner: A）

- **删除** `LoadingOverlay.vue` 与 `useGlobalLoading.ts` 的全屏模糊转圈方案；App.vue 去掉路由级 loading 覆盖层。
- 文章加载改为**骨架屏**（owner: C 在 ArticleView 内实现）。
- App.vue：加 `.skip-link` 指向 `#main`；`<main id="main">`。

### 5.8 首页 `Home.vue`

- **不显示 masthead**（删掉「小窝」大标题和说明），只保留 `<h1 class="visually-hidden">` 供读屏 / SEO；也不显示「分类 / 标签 / 归档」section 标题，用留白区分。
- **分类**：大字号排版索引（无边框、无格子）：分类名 `1.375rem / 600` + mono 上标计数，flex-wrap 自然换行；分类变多只增加行数，不会变成方块墙；`<480px` 字号降到 1.125rem。与下方标签行（小号 mono）靠字号和字重区分。
- **标签**：分类下方整块标签区，沿用原分类的紧凑 mono 行样式（`标签名 计数`）。
- **归档：只按年份筛选**，单行年份按钮；不再有月份和多级展开。
- 筛选区不 sticky，保持普通文档流；分类 / 标签 / 年都是原地筛选，多个维度可叠加（AND，例如 `Java + git`）。点击筛选不滚动页面，也不再有「清除」按钮；点击已选中的项即可取消，`Esc` 仍可清空。
- URL 用 `router.replace` 更新 query，不污染浏览器历史；结果变化用 `aria-live` 播报篇数。触屏下标签、年份的命中高度 ≥ 40px。
- **首页固定一屏**：`html.home-fixed` 时整页不滚动，筛选区在文档流里，只有下方笔记列表内部滚动；列表用 `overflow-y: auto` + `overflow-x: hidden`，并设置 `scrollbar-gutter: stable` 防止滚动条出现/消失导致宽度跳动。列表区域高度自适应剩余空间，不再用固定 `min-height`。
- 独立的 `/docs`、`/tags`、`/archive` 页面**已全部删除**；旧 URL 重定向到首页筛选（见 5.10 / 5.11 / 5.15）。
- 不要空的占位 header（现有 `.site-head` 空占位删除）。
- 不要三列卡片；不要 hero 大图（本项目无真实图片素材，禁止伪造图）。

### 5.9 文章列表行 `ArticleCard.vue` + `cards.css`（owner: B）

- 行式列表，不是卡片：上下 1px `--border-primary`（首行只留底边，末行只留顶边也可），无背景块、无阴影、无圆角。
- 结构：`分类(mono 小号, muted, 默认 opacity 0，hover / focus-within 时显示)` + `标题 / 一句话简介（简介在标题后同一行，hover 时显示，无额外符号）` + `日期(mono 小号, 同样默认 opacity 0，hover / focus-within 时显示)`。**不再有行尾箭头**。移动端隐藏日期和分类，标题允许换行。
- hover：分类淡入，标题变 `--accent`，整行右移 4px，左侧 2px accent 竖线淡入；`transition` 0.15s。键盘 focus-visible 同样高亮。
- 保留 `select` 事件（父组件高亮）语义；删除 `--i` stagger 动画或改为极轻的 0.03s 延迟，不得影响可读性。
- `.edit-card` 大分类卡方案废弃；`cards.css` 只保留列表行，分类/标签的样式在各页面组件内。

### 5.10 归档（已合并进首页）

- `/archive` 页面已删除；首页只显示年份索引（不再有月份 / 多级展开）。
- 旧 `/archive`、`/timeline` 重定向到 `/`；旧的 `?archive=YYYY-MM` 链接会归一到该年。

### 5.11 分类（已合并进首页）

- `/docs`、`/docs/:category` 页面已删除；首页分类索引点击直接筛选。
- 旧 `/docs/:category` 重定向到 `/?category=:category`；`/docs` 重定向 `/`；旧 `/docs/:category/:slug` 仍重定向到 `/note/:slug`。

### 5.12 文章页 `ArticleView.vue` + `ArticleContent.vue`

- 布局：`.article-layout` 在 >=1100px 时为「正文 `--reading` + 目录 `--toc-width`」两列，整体居中；<1100px 单列居中。正文 `min-width: 0`，目录用 5.6。
- 注意：目录触发按钮是 `position: fixed`，**不能**放进带 `transform` 的入场动画容器里（会变成局部定位）。
- 文章头：`h1`（`--text-2xl`，中文标题可到 2 行）+ 元信息行（数字用 mono，中文单位用正文字体，避免中文走等宽字体回退；日期 / 阅读分钟 / 字数用间距分列，整行最多 1 个中点）+ **分类链接在前、标签在后**的一行：分类用 `/` 前缀 + 默认 `text-secondary` 文字，hover 只变 accent、**不加下划线**；标签用小号 mono `#tag`。两者都不加边框/背景/分隔线，指向首页 `?category=...` / `?tag=...`。分类/标签下方显示 frontmatter 的 `description`（一句话简介，正文字体、`--text-sm`、muted、无符号），再进入正文。**文章头与正文之间用 1px 分隔线 + 上下留白明确分开**（`.article-body` 的 `border-top`），避免简介和正文黏在一起。
- 骨架屏：加载时渲染 1 行标题条 + 1 行元信息 + 4~6 行正文灰条（`--bg-secondary`，轻微 pulse，reduced-motion 取消），不要全屏转圈。
- 正文 `.content-prose`（`prose.css`）：见 5.14。
- **文末「相关文章」**：同分类其它笔记（排除当前篇），最多 6 条，行式列表（标题 + 日期），样式与文章列表行同源。
- **文末「上一篇 / 下一篇」**：按日期相邻，两列，上一篇左对齐、下一篇右对齐，标题最多 2 行。
- 保留 TOC 观察器（驱动目录高亮）、行内代码点击复制、代码块增强、图片 lightbox 行为。
- 路由切换回到顶部；浏览器后退时恢复原位置（`scrollBehavior`）。

### 5.13 关于 / 404（owner: C）

- 关于：页头 + 正文段落（`--reading` 宽度，`1.0625rem / 1.85`）；GitHub 贡献图放在 1px 边框容器内（无阴影），亮暗模式都可读；保留原文，不新增链接。
- 404：大号 `404`（mono 或 `--text-3xl`）+ 一句说明 + 「返回首页」文字链接，版面居中偏左，不要插画。

### 5.14 文章正文 `prose.css`

- 行内元素：链接 accent + 下划线（`text-underline-offset: 3px`），hover 不变色只加粗下划线；行内 code 用 mono + `--code-inline-bg` + 1px 细边；strong 600。
- 标题：全部无衬线；H1 内文 `--text-xl`；H2 顶部 1px 线 + `padding-top`；H3 `--text-lg`。滚动锚点 `scroll-margin-top: calc(var(--nav-h) + 1rem)`。**标题无 hover 标记、无 pointer 光标**（目录见 5.6）。
- 引用块：2px accent 左边框，`--bg-secondary` 底，不用斜体。
- 表格：1px 细线，表头 `--bg-secondary`；移动端横向滚动。
- 代码块（收敛版 A）：
  - `.code-block` 无阴影，1px `--code-border`，`--code-bg` 底。
  - 题头**不是一条重底色工具栏**：透明背景、无下边框，语言标签 mono 小号 weak（`--text-muted`）；复制为**纯图标按钮**（复制图标 → 成功切换对勾 + accent，失败 `copy-failed`），折叠仍是文字按钮；两者都无边框，hover 才变 accent。
  - 行号 2em 右对齐、`opacity` 0.45，代码块 hover 时升到 0.65；行 hover 用 `--code-hover` 高亮整行。
  - 语法配色全部走 `--code-*` token（亮/暗各自一套），覆盖动态加载的 highlight.js 主题；注释**不用斜体**。
  - 长代码保留折叠/展开；`pre` 横向滚动、`tab-size: 4`，移动端不强制换行。
- 图片：`max-width: 100%`，1px 边框或无边框，无圆角；lightbox 用 `--lightbox-mask` 遮罩。

### 5.15 标签（已合并进首页）+ `src/utils/tags.ts`

- `/tags` 页面与字阶云已删除；首页标签行（紧凑 mono，按最近更新排序）点击直接筛选。
- 旧 `/tags/:tag` 重定向到 `/?tag=:tag`；`/tags` 重定向 `/`。
- 数据：`NoteMeta.tags: string[]` 由 `contentIndexPlugin` 注入虚拟模块；`buildTagIndex`（按最近更新排序，`count` 仅作展示/权重）。
- 边界：无标签的笔记不显示标签行；标签名统一小写（由 frontmatter 守卫保证）。

### 5.16 浏览器标签页标题

- 每个页面通过 `src/utils/usePageTitle.ts` 设置 `document.title`，统一格式 **`小窝 · 页面标题`**。
- 首页 `学习笔记`；文章页用文章标题；关于 `关于`；404 `页面不存在`。
- 标题支持 getter，异步文章标题变化时会自动更新；组件卸载时停止监听。

---

## 6. 响应式断点

- `>= 1100px`：文章页显示右侧常驻目录（`--toc-width`）；桌面完整版。
- `768px - 1099px`：文章单列，右下角「目录」按钮 + 底部抽屉；容器内边距收紧。
- `< 768px`：隐藏回到顶部；列表行隐藏日期/箭头；代码块、表格横向滚动；正文 `1rem / 1.8`。
- `< 480px`：字号再降一档（导航 0.8125rem，文章 H1 1.5rem），刊头 `--text-2xl`。
- 所有多列布局必须在组件内写明 `< 768px` 的单列降级。

---

## 7. 可访问性与动效

- 所有可交互元素有 `:focus-visible`（全局已提供，组件不要覆盖成 outline: none）。
- 图标按钮必须有 `aria-label`；导航当前项 `aria-current="page"`；装饰图标 `aria-hidden="true"`。
- 颜色对比：正文 ≥ 4.5:1，次级文本 ≥ 4.5:1，禁用状态可用 muted 但需可辨认。
- 动效全部在 `@media (prefers-reduced-motion: reduce)` 下降级为无动画（全局已有兜底，新增入场动画仍要确认）。
- 滚动行为 `smooth` 在 reduced-motion 下为 `auto`（base.css 已处理）。

---

## 8. 文案规则

- 保留现有中文文案与语气；关于页原文一字不改。
- 新增文案必须具体、短、无营销词（禁用「赋能、无缝、极致、下一代、开启」等）。
- 不使用「!」；空态/错误直接陈述事实。
- 数字不造假：只使用真实数据（笔记数、分类数、字数、阅读时间）。
- 整行最多 1 个中点 `·`。

---

## 9. 文件结构（当前）

| 领域                      | 文件                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 设计基础                  | `DESIGN_SPEC.md`、`src/styles/theme.css`、`base.css`、`cards.css`、`interact.css`、`prose.css`、`src/style.css`、`index.html`、`src/main.ts`                  |
| 外壳                      | `src/App.vue`、`src/components/{TabNav,AppFooter,BackToTop,ScrollProgress,PageHead}.vue`                                                                      |
| 索引层                    | `src/pages/Home.vue`、`src/components/ArticleCard.vue`、`src/utils/{tags,archive,homeFilter}.ts`                                                              |
| 阅读层                    | `src/pages/{ArticleView,About,NotFound}.vue`、`src/components/{ArticleContent,ArticleToc,TocList}.vue`                                                        |
| 数据/渲染工具（保持稳定） | `src/utils/{content,markdown,reader,highlight,useContentRenderer,useTocObserver,useReadingProgress,usePageTitle}.ts`、`src/router/index.ts`、`vite.config.ts` |
| 内容工具                  | `scripts/normalize-frontmatter.ts`、`src/utils/{frontmatter,fs,contentIndexPlugin,rssPlugin}.ts`、`src/__tests__/contentFrontmatter.test.ts`                  |

**已删除**：`src/components/AppSidebar.vue`、`src/components/LoadingOverlay.vue`、`src/utils/useSidebar.ts`、`src/utils/useGlobalLoading.ts`、`src/styles/mobile.css`、`src/pages/DocsPage.vue`、`src/pages/Archive.vue`、`src/pages/CategoriesPage.vue`、`src/pages/TagsPage.vue`、`src/utils/categories.ts`（分类/标签/归档已合并进首页筛选）、`src/utils/categoryIcons.ts`（分类不再用 SVG 图标）。

`content/` 的正文与frontmatter 规范见第 11 节；RSS 生成、GitHub Pages 部署配置（`base` / `404.html` / workflow）保持稳定。

---

## 10. 验收

每人完成后自测：

```powershell
npx vue-tsc --noEmit
npx vitest run
npm run build
```

Lead 最终验收：`npm test` + `npm run build` + 无头 Chrome 截图检查亮色/暗色、桌面 1440 / 移动 390 两档；截图存到 `D:\Test1\.ui-review\`。

### 10.1 交付自检清单

- [ ] 无 em dash、无 emoji、无圆角、无多余阴影、无渐变
- [ ] 所有颜色来自 token
- [ ] 无 scroll 事件监听
- [ ] 导航单行、≤ 56px
- [ ] 桌面与移动端布局都在组件内写了降级
- [ ] 空态/加载态/焦点态齐全
- [ ] 亮色/暗色两种模式都检查过
- [ ] `npx vitest run` 与 `npm run build` 通过

---

## 11. 内容 / Obsidian 约定

`content/notes` 同时作为 Obsidian 仓库使用，frontmatter 以 Obsidian 原生写法为准：

```yaml
---
title: 可选，仅当需要覆盖文件名标题时
date: 2026-06-06 # 必填，yyyy-mm-dd
tags: [java, coding] # 可选，数组形式，全部小写
description: 一句话说明这篇文章是干嘛的。 # 必填，只能一句话，以。结尾
---
```

- `date` 必须是 `yyyy-mm-dd`；旧格式（`2026-6-6`、`2026/6/6`、`20260606`）解析器可兜底，但文件本身必须是 ISO。
- `tags` 统一小写数组；兼容旧 `tag` 字段、块列表、行内数组、逗号/空格字符串。
- `description` 必填：一句话解释标题，只允许一个 `。` 结尾；会显示在首页卡片 hover 和文章页标题区。
- **分类由文件夹决定**（`content/notes/<分类>/<文件>.md`），不再写 `category` 字段；`info` 字段已迁移为 `description`。
- 只有 `content/notes/<分类>/<文件>.md` 才算博客笔记；根目录 `.md`（Obsidian 日记）不进博客、不进 RSS、不复制到 `dist/notes`；`.obsidian/`、`.trash/` 被忽略且不发布。
- 空笔记（0 字节或只有 frontmatter）不进索引。
- 规范化命令：`npm run notes:normalize`（预览）/ `npm run notes:normalize:write`（写入，先备份到 `.frontmatter-backup/`）；脚本 `scripts/normalize-frontmatter.ts`，幂等。
- 缺失日期的推断顺序：文件名日期 → git 最后提交日期 → 文件 mtime。
- 解析器 `src/utils/frontmatter.ts` 由站点与迁移脚本共用，支持引号、注释、行内/块列表与 `key:value` 无空格写法。
- 守卫测试 `src/__tests__/contentFrontmatter.test.ts` 逐篇校验 date / tags / description，`npm test` 会拦住写错的 frontmatter。
