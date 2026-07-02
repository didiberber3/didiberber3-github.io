# DESIGN SPEC — 记录与分享 Blog

> 统一前端视觉设计规范。基于实际代码（Vue 3 + Tailwind + CSS 自定义属性）整理，确保文档即实现。

---

## 1. Brand / Identity

| Token | Value | Notes |
|---|---|---|
| **Wordmark** | `记录与分享` | 纯文本，无 Logo／图标 |
| **Brand feel** | 温暖、安静、个人化 | 毛玻璃 + 暖灰底色 + 低对比度边框 |
| **Background** | `bg1.webp` 平铺，`--bg-overlay` 叠加 | 桌面端 `background-attachment: fixed` |
| **Selection** | `::selection { background: var(--accent); color: white }` | 亮色绿色、暗色橙色 |

---

## 2. Typography

### Primary Font Stack

```
-apple-system, BlinkMacSystemFont, "PingFang SC",
"Microsoft YaHei", "Noto Sans SC", sans-serif
```

| Property | Value |
|---|---|
| `line-height` | 1.8 |
| `letter-spacing` | 0.01em |
| `-webkit-font-smoothing` | antialiased |
| `body` size | Tailwind base (默认 16px) |

### Code Font Stack

```
"Fira Code", "Cascadia Code", "JetBrains Mono", "Fira Mono",
"Source Code Pro", "Consolas", "Liberation Mono", "Courier New", monospace
```

| Token | Light | Dark |
|---|---|---|
| `--code-bg` | `#eef4e8` | `#0f1621` |
| `--code-border` | `#d5e0cb` | `#1e293b` |

> **Note**: No strict type scale (H1/H2/H3). Headings are sized per-component context. Consistency maintained through shared `.page-hero-*` classes.

---

## 3. Color System

### Light Mode (default `:root`)

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#f7f7f5` | 页面主导背景 |
| `--bg-secondary` | `#efeeeb` | 次级区域、卡片 |
| `--bg-tertiary` | `#e5e4e1` | hover、交互区 |
| `--accent` | **`#16a34a`** | 强调色（链接、激活） |
| `--accent-hover` | `#15803d` | 强调色 hover |
| `--accent-bg` | `#f0fdf4` | 强调色透明背景（按钮 hover） |
| `--text-primary` | `#111827` | 正文 |
| `--text-secondary` | `#6b7280` | 次级文本 |
| `--text-muted` | `#9ca3af` | 辅助文字 |
| `--border-primary` | `#e5e7eb` | 主要边框 |
| `--border-secondary` | `#d1d5db` | 次级边框 |

### Dark Mode (`.dark`)

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#080c14` | 深色页面背景 |
| `--bg-secondary` | `#0f1621` | 次级区域、卡片 |
| `--bg-tertiary` | `#182232` | hover、交互区 |
| `--accent` | **`#f97316`** | 强调色（链接、激活） |
| `--accent-hover` | `#fb923c` | 强调色 hover |
| `--accent-bg` | `#1a0e05` | 强调色透明背景 |
| `--text-primary` | `#e2e8f0` | 正文 |
| `--text-secondary` | `#94a3b8` | 次级文本 |
| `--text-muted` | `#475569` | 辅助文字 |
| `--border-primary` | `#1e293b` | 主要边框 |
| `--border-secondary` | `#334155` | 次级边框 |

> **Key Decision**: Light uses **green** (`#16a34a`), Dark uses **orange** (`#f97316`). Different hues intentionally differentiate the two modes while preserving warm feel.

---

## 4. Spacing System

| Unit | Value |
|---|---|
| **Base unit** | `8px` |
| **Hero vertical padding** | `5rem 0 3.5rem` (`.page-hero`) |
| **Card internal padding** | `1rem` (`.article-card`) |
| **Nav item padding-left** | `0.5rem` → hover `0.75rem` (`.interact-slide-bg`) |

---

## 5. Glassmorphism (Flat)

| Token | Light | Dark | Blur |
|---|---|---|---|
| `--bg-glass` | `rgba(247,247,245,0.70)` | `rgba(8,12,20,0.72)` | — |
| `.interact-btn-icon` | `--bg-glass` | `--bg-glass` | `blur(2px)` |
| Main glass surfaces | `--bg-glass` | `--bg-glass` | `blur(4px)` |
| Hover state glass | — | — | `blur(8px)` |
| `--bg-overlay` (body) | `rgba(247,247,245,0.85)` | `rgba(8,12,20,0.88)` | — |

### Flat Glass Principles

1. **Low blur**: `blur(2px)` for buttons, `blur(4px)` for main surfaces, `blur(8px)` for hover — never exceeding 8px
2. **High transparency**: `--bg-glass` at ~70–72% opacity — visible background through glass
3. **Single-layer shadow**: no inner shadows, no layered blur effects
4. **Backdrop-friendly**: uses `backdrop-filter` (with `-webkit-` prefix)

---

## 6. Shadows

### Light Mode

| Token | Value |
|---|---|
| `--shadow-glass` | `0 1px 2px rgba(0,0,0,0.04)` |
| `--shadow-glass-lg` | `0 2px 6px rgba(0,0,0,0.05)` |

### Dark Mode

| Token | Value |
|---|---|
| `--shadow-glass` | `0 1px 2px rgba(0,0,0,0.12)` |
| `--shadow-glass-lg` | `0 2px 6px rgba(0,0,0,0.18)` |

### Other Shadows

| Token | Light | Dark |
|---|---|---|
| `--drawer-shadow` | `-4px 0 12px rgba(0,0,0,0.06)` | `-4px 0 12px rgba(0,0,0,0.3)` |
| `--drawer-overlay` | `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.55)` |

> **Principles**: Shadows are intentionally **light** (thin, low opacity). Dark mode shadows are darker than light mode but still restrained — no heavy drop shadows.

---

## 7. Animations

### Page Entry Animation (`fadeUpEnhanced`)

| Property | Value |
|---|---|
| Initial state | `opacity: 0; transform: translateY(20px)` |
| Final state | `opacity: 1; transform: translateY(0)` |
| Duration | `0.5s ease-out` |

### Card Entry Animation (`cardIn`)

| Property | Value |
|---|---|
| Initial state | `opacity: 0; transform: translateY(12px)` |
| Final state | `opacity: 1; transform: translateY(0)` |
| Duration | `0.35s ease-out` |
| Stagger delay | `0.05s` per item (uniform across pages) |

> **Key Decision**: All hover/transition durations standardized to `0.2s`. No 0.15s or 0.25s exceptions.

---

## 8. Interaction Patterns

Three CSS-only interaction patterns, consumed via class:

### Pattern A: Slide Background (`interact-slide-bg`)

| State | Style |
|---|---|
| Normal | `border-left: 2px solid transparent; padding-left: 0.5rem` |
| Hover | `border-left-color: var(--accent); color: var(--accent); padding-left: 0.75rem` |
| Transition | `color 0.2s, border-color 0.2s, padding-left 0.2s` |

_用于: `.docs-nav-item`, `.toc-h2 a`, `.toc-btn`, `.toc-sub a`_

### Pattern B: Fill Button (`interact-fill`)

| State | Style |
|---|---|
| Normal | `border: 2px solid var(--accent); color: var(--accent); background: transparent` |
| Hover | `background-color: var(--accent-bg)` + `::after` underline scales X from 0→1 |
| Focus-visible | `outline: 2px solid var(--accent); outline-offset: 2px` |

_用于: `.btn-more`, `.visit-btn`_

### Pattern C: Icon Button (`interact-btn-icon`)

| State | Style |
|---|---|
| Normal | `background: var(--bg-glass); backdrop-filter: blur(2px); border: 1px solid var(--border-primary)` |
| Hover | `background-color: var(--bg-tertiary); border-color: var(--border-secondary)` + `::after` underline scales X from 0→1 |
| Focus-visible | `outline: 2px solid var(--accent); outline-offset: 2px` |

_用于: `.sidebar-toggle`, `.theme-toggle`, `.drawer-close`, `.btt-nav`, `.copy-btn`, `.fold-btn`_

### Common Underline: `::after` pseudo-element

| Property | Value |
|---|---|
| Position | `absolute; bottom: 0; left: 0` |
| Size | `width: 100%; height: 2px` |
| Color | `var(--accent)` |
| Normal | `transform: scaleX(0); transform-origin: left` |
| Hover | `transform: scaleX(1)` |
| Transition | `transform 0.2s ease` |

---

## 9. Layout

### Page Structure
```
<body>                    ← bg-primary + bg1.webp + bg-overlay
  #app                    ← z-index: 1
    <TabNav />            ← 顶部栏（home + theme-toggle + sidebar-toggle）
    <router-view>
      .page-hero          ← 标题区（统一 padding: 5rem 0 3.5rem）
      .page-content        ← 主内容
    </router-view>
    <AppSidebar />        ← Drawer 从右侧滑入
    <BackToTop />         ← 右下角固定
```

### Article Page Two-Column
```
.article-layout
  ├── .article-main       ← 正文（左侧，flex: 1）
  └── .article-sidebar    ← TOC（右侧，sticky）
```

> **Key Decision**: Two-column layout is article-only. Home, Notes, Timeline, Docs are single-column.

### Drawer (`.app-sidebar`)

- Slides in from **right** (not left)
- Overlay: `--drawer-overlay` / Shadow: `--drawer-shadow`
- Width: `320px`
- Close button uses Pattern C (`.interact-btn-icon`)
- Navigation items use Pattern A (`.interact-slide-bg`)

---

## 10. Responsive

| Breakpoint | Behavior |
|---|---|
| **≥ 1024px** | Full layout: article two-column, sidebar shown as panel |
| **769–1023px** | Tablet: maintain two-column but narrower |
| **≤ 768px** | Mobile: single column, sidebar as drawer-overlay |
| **≤ 480px** | Small mobile: adjust hero padding, reduce card gaps |

---

## 11. Borders & Radius

| Token | Value |
|---|---|
| Global `border-radius` | **`2px`** (uniform throughout) |
| `--border-primary` | 1px solid |
| `--border-secondary` | 1px solid |
| Button hover underline | `2px` high |
| `interact-fill` border | `2px` |
| `interact-btn-icon` border | `1px` |

> **Key Decision**: All `border-radius` values are `2px`. No rounded cards, no pill buttons, no border-radius exceptions.

---

## 12. Keyboard & Active States

| Element | Style |
|---|---|
| `:focus-visible` | `outline: 2px solid var(--accent); outline-offset: 2px` |
| Active nav item | `border-left-color: var(--accent); color: var(--accent); font-weight: 500` |
| Active drawer item | `background-color: var(--bg-tertiary); color: var(--accent)` |

---

## Quick Reference — CSS Variables

```css
/* Light mode (:root) */
--bg-primary:  #f7f7f5;
--bg-secondary:#efeeeb;
--bg-tertiary: #e5e4e1;
--bg-overlay:  rgba(247,247,245,0.85);
--bg-glass:    rgba(247,247,245,0.70);
--shadow-glass:     0 1px 2px rgba(0,0,0,0.04);
--shadow-glass-lg:  0 2px 6px rgba(0,0,0,0.05);
--text-primary:#111827;
--text-secondary:#6b7280;
--text-muted:  #9ca3af;
--border-primary:#e5e7eb;
--border-secondary:#d1d5db;
--accent:      #16a34a;
--accent-hover:#15803d;
--accent-bg:   #f0fdf4;
--code-bg:     #eef4e8;
--code-border: #d5e0cb;
--drawer-overlay:rgba(0,0,0,0.15);
--drawer-shadow: -4px 0 12px rgba(0,0,0,0.06);

/* Dark mode (.dark) */
--bg-primary:  #080c14;
--bg-secondary:#0f1621;
--bg-tertiary: #182232;
--bg-overlay:  rgba(8,12,20,0.88);
--bg-glass:    rgba(8,12,20,0.72);
--shadow-glass:     0 1px 2px rgba(0,0,0,0.12);
--shadow-glass-lg:  0 2px 6px rgba(0,0,0,0.18);
--text-primary:#e2e8f0;
--text-secondary:#94a3b8;
--text-muted:  #475569;
--border-primary:#1e293b;
--border-secondary:#334155;
--accent:      #f97316;
--accent-hover:#fb923c;
--accent-bg:   #1a0e05;
--code-bg:     #0f1621;
--code-border: #1e293b;
--drawer-overlay:rgba(0,0,0,0.55);
--drawer-shadow: -4px 0 12px rgba(0,0,0,0.3);
```
