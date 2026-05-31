# Sidebar Redesign + Radial Button Animation + TOC h1 Fix

## TL;DR
> **Summary**: Fix three issues: (1) TOC missing h1 headings on Test/坦克大战2, (2) Theme-toggle + sidebar close button get radial-fill hover animation, (3) AppSidebar drawer visual redesign to match site's warm minimal design system.
> **Deliverables**: 3 files modified, 0 new files
> **Effort**: Short
> **Parallel**: Single wave (no deps)

## Status
| Task | File | Status |
|------|------|--------|
| TOC 提取 h1 + groupTocItems 处理 | `src/utils/markdown.ts` | ✅ DONE |
| 主题切换按钮径向填充 + 旋转 | `src/components/TabNav.vue` | ✅ DONE |
| AppSidebar 遮罩色 light/dark 区分 | `src/components/AppSidebar.vue` | ✅ DONE |
| 关闭按钮恢复边框 + 加旋转 | `src/components/AppSidebar.vue` | ❌ 待执行 |
| 打开按钮 (sidebar-toggle) 动效 | `src/components/TabNav.vue` | ⏳ 待决策 |
| 构建验证 | — | ❌ 待执行 |

## Remaining TODOs

- [ ] 1. AppSidebar.vue — 关闭按钮恢复边框 + SVG 旋转

  **文件**: `src/components/AppSidebar.vue`

  **当前问题**: 之前误去掉了 `.drawer-close` 的 `border`，需要恢复为 `1px solid var(--border-primary)`，并给内部 SVG 加 hover 旋转动效。

  **具体改动**: 找到 `<style scoped>` 中的 `.drawer-close` 相关 CSS 块，替换为以下完整内容：

  ```css
  .drawer-close {
    position: relative;
    overflow: hidden;
    background: none;
    border: 1px solid var(--border-primary);
    padding: 0.25rem;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    transition: color 0.2s, border-color 0.2s;
  }
  .drawer-close::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--accent);
    transform: scale(0);
    transition: transform 0.3s ease;
    z-index: -1;
  }
  .drawer-close:hover {
    color: white;
    border-color: var(--accent);
  }
  .drawer-close:hover::before {
    transform: scale(1.5);
  }
  .drawer-close:hover svg {
    animation: drawerCloseRotate 0.6s ease;
  }

  @keyframes drawerCloseRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  ```

  **关键点**:
  - `border: 1px solid var(--border-primary)` — 和 theme-toggle 一致
  - `::before` 径向填充不变（`scale(0)` → `scale(1.5)`）
  - hover 时 SVG 旋转 360°（`drawerCloseRotate`，0.6s ease）
  - `z-index: 0/ -1` 保证按钮文字在填充层之上

  **Acceptance Criteria**:
  - [ ] 关闭按钮有 1px 边框，hover 时变 accent 色
  - [ ] hover 时径向填充从中心扩散 accent
  - [ ] hover 时 X 图标变白色
  - [ ] hover 时 X 图标旋转 360°
  - [ ] `npm run build` 成功

  **Commit**: YES (merge with task 2 if applicable)

- [ ] 2. TabNav.vue — 打开按钮 (sidebar-toggle) 右→左径向填充

  **文件**: `src/components/TabNav.vue` — `.sidebar-toggle` CSS

  **动效**: 从右向左径向填充（`transform-origin: right center`）
  - `::before` 用 `scale(0)` → `scale(1.5)`，但 `transform-origin: right center`
  - hover 时填充从右侧起始向左扩散
  - 图标（三横线）变白色
  - 边框变 accent 色

  **替换当前 CSS**:
  ```css
  .sidebar-toggle {
    position: relative;
    overflow: hidden;
    background: none;
    border: 1px solid var(--border-primary);
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    transition: color 0.2s, border-color 0.2s;
  }
  .sidebar-toggle::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--accent);
    transform: scale(0);
    transform-origin: right center;
    transition: transform 0.3s ease;
    z-index: -1;
  }
  .sidebar-toggle:hover {
    color: white;
    border-color: var(--accent);
  }
  .sidebar-toggle:hover::before {
    transform: scale(1.5);
  }
  ```

  **关键区别**: `transform-origin: right center` — 填充从右往左扩散，不与 theme-toggle 的居中径向重复。

  **Acceptance Criteria**:
  - [ ] hover 时填充从右侧起始向左扩散
  - [ ] 三横线变白色
  - [ ] 边框变 accent 色

## Final Verification
- [ ] F1. `npm run build` — vue-tsc + vite build 通过
- [ ] F2. 浏览器确认 Test.md、坦克大战2.md TOC 显示 h1 标题
- [ ] F3. 确认已有 h2/h3 文章（坦克大战.md）TOC 不变
- [ ] F4. hover 主题切换按钮：径向填充 + 旋转 + 白色图标
- [ ] F5. hover 关闭按钮：边框变 accent + 径向填充 + 旋转 + 白色 X

