# Drawer Style Unification

## TL;DR
> **Summary**: Polish the AppSidebar drawer so its visual language matches the site's warm minimal design system — fix rogue `border-radius`, remove redundant hover, add shadow, clean overlay variable, tighten spacing.
> **Deliverables**: 1 file modified (`src/components/AppSidebar.vue`), no new files
> **Effort**: Short (4 TODOs)

## Context

### Why It Looks Off
The drawer currently uses its own internal CSS conventions that clash with the site's global patterns:

| 问题 | 当前 | 全局标准 |
|------|------|---------|
| `.drawer-section-header` border-radius | `0.25rem` | `border-radius: 0`（全局 `*` 设置） |
| `.drawer-nav-item:hover` | 额外 `background-color: var(--accent-bg)` | `.interact-slide-bg` 已处理绿线 + 变色，背景多余 |
| drawer-panel 无层次 | 纯 `bg-primary` + `border-left` | 其他浮层（lightbox）有遮罩，drawer 无阴影 |
| 遮罩用 `:global(.dark)` | 脆弱，全局穿透 | 应改用 CSS var 或直接覆盖 |
| section-header 和 title 视觉层级 | 几乎一样大小颜色 | 缺少主次分明 |

### Design System Reference
- **Border radius**: `0` on all elements (`* { border-radius: 0 }`)
- **Interactive patterns**: `.interact-slide-bg` (绿线左滑), `.interact-fill` (填充)
- **Drawer convention**: 右侧滑入，遮罩 + 面板
- **Site overlay**: lightbox 用 `rgba(0,0,0,0.85)`，drawer 遮罩应使用 `--bg-primary` 混合或简单数值

## TODOs

- [ ] 1. 去掉 `.drawer-section-header` 的 `border-radius`

  **位置**: `src/components/AppSidebar.vue` line ~184

  **改动**: 删除 `border-radius: 0.25rem;` 属性

  **原因**: 全局 `* { border-radius: 0 }` 已被覆盖，这行是多余的且破坏一致性。

  ```diff
  - border-radius: 0.25rem;
  ```

- [ ] 2. 移除 `.drawer-nav-item:hover` 多余的背景色

  **位置**: `src/components/AppSidebar.vue` lines ~229-231

  **改动**: 删除 `.drawer-nav-item:hover { background-color: var(--accent-bg); }`

  **原因**: nav item 已使用 `.interact-slide-bg` 类，hover 时已有绿色左边线 + 字体变色 + 左移效果。额外添加 `accent-bg` 背景会与 active 态的 `list-item-active` 视觉冲突（active 态也用 `accent-bg`），让 hover 和 active 区分不清。

  ```diff
  - .drawer-nav-item:hover {
  -   background-color: var(--accent-bg);
  - }
  ```

- [ ] 3. 遮罩改用 CSS 变量代替 `:global(.dark)`

  **位置**: `src/components/AppSidebar.vue` lines ~93-99

  **当前**:
  ```css
  .drawer-overlay {
    background-color: rgba(0, 0, 0, 0.15);
  }
  :global(.dark) .drawer-overlay {
    background-color: rgba(0, 0, 0, 0.45);
  }
  ```

  **改成**: 用 `--drawer-overlay` CSS 自定义属性，在 `.dark` 选择器作用域内覆盖。

  **方案 A (推荐)** — 在全局 `style.css` 的 `:root` 和 `.dark` 中添加变量：
  ```css
  /* style.css :root 内添加 */
  --drawer-overlay: rgba(0, 0, 0, 0.15);
  /* style.css .dark 内添加 */
  --drawer-overlay: rgba(0, 0, 0, 0.45);
  ```

  AppSidebar 改为：
  ```css
  .drawer-overlay {
    background-color: var(--drawer-overlay, rgba(0, 0, 0, 0.15));
  }
  ```

  删除 `:global(.dark) .drawer-overlay` 块。

  **优点**: 不依赖 `:global()`，干净，变量可复用。
  **注意**: `style.css` 修改需小心不破坏其他内容。

- [ ] 4. 给 drawer-panel 加阴影

  **位置**: `src/components/AppSidebar.vue` — `.drawer-panel`

  **改动**: 添加阴影属性，让面板浮在遮罩之上。

  ```diff
  + box-shadow: -4px 0 12px rgba(0, 0, 0, 0.06);
  ```

  **参考**: 站点的投影风格 — 全局没有使用 `box-shadow`，所以这应该非常克制。左侧负向阴影（光从右来），`0.06` 透明度极低，不会破坏极简风格，但让 drawer 有呼吸感。

  **Dark 模式**: 阴影透明度可略增：
  ```css
  .dark .drawer-panel {
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
  }
  ```
  或使用 CSS 变量方案（同 TODO 3）:
  ```css
  /* style.css :root */
  --drawer-shadow: -4px 0 12px rgba(0, 0, 0, 0.06);
  /* style.css .dark */
  --drawer-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
  ```
  AppSidebar 使用 `box-shadow: var(--drawer-shadow, none);`

- [ ] 5. 强化 drawer-title vs section-label 视觉层级

  **位置**: `src/components/AppSidebar.vue` — `.drawer-title`

  **当前**:
  ```css
  .drawer-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  ```

  section-label 也是几乎一样的样式（0.6875rem, uppercase, muted）。

  **问题**: header 标题和 section 标签几乎无法区分。

  **改动**: 给 `.drawer-title` 加一点区别：
  ```diff
  - color: var(--text-muted);
  + color: var(--text-primary);
  + font-weight: 700;
  ```

  这样 drawer-title 用 primary 色 + 更粗，section-label 保持 muted 色，形成清晰的层级：
  - 标题 → 主色加粗（"这是我"）
  - 区块标签 → 次要色（"这是下面的分类"）

- [ ] 6. 调整 section header 文字色 + hover 效果

  **位置**: `src/components/AppSidebar.vue`

  **当前问题**:
  - hover 用 `var(--accent-bg)`（绿底）看起来像选中态而非悬停，太重
  - label 用 `var(--text-muted)` 太浅，看不清

  **改动**:
  ```diff
  .drawer-section-header:hover {
  -  background-color: var(--accent-bg);
  +  background-color: var(--bg-tertiary);
  }

  .drawer-section-label {
  -  color: var(--text-muted);
  +  color: var(--text-secondary);
  }

  .drawer-chevron {
  -  color: var(--text-muted);
  +  color: var(--text-secondary);
  }
  ```

  **原因**: `bg-tertiary` 和 tab-btn hover 一致，无 green tint，更干净。`text-secondary` 比 muted 更易读，但仍属低调层级。

  **Acceptance Criteria**:
  - [ ] section header hover 底色为灰（非绿）
  - [ ] label 用 `text-secondary`，清晰可读
  - [ ] chevron 用 `text-secondary`，更明显

## Verification
- [ ] F1. `npm run build` 通过
- [ ] F2. 浏览器检查 drawer：section-header 无圆角
- [ ] F3. hover nav-item：只有绿线左滑变色，无背景色
- [ ] F4. hover section-header：有背景反馈
- [ ] F5. drawer-panel 有阴影，视觉上浮于遮罩
- [ ] F6. drawer-title 比 section-label 更突出
- [ ] F7. light/dark 切换遮罩色正常
