---
name: vue-tailwind-ts
description: Vue 3 Composition API + Tailwind CSS + TypeScript patterns for the 记录与分享 blog project. Covers script setup conventions, theming via CSS variables, and component structure.
---

# Vue 3 + Tailwind + TypeScript 模式

## 核心规则

### 1. 使用 `<script setup lang="ts">`
所有组件必须使用 Composition API 的 `<script setup>` 语法，并启用 TypeScript。

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title: string
  count?: number
}>()

const doubled = computed(() => (props.count ?? 0) * 2)
</script>
```

### 2. 组件命名与文件结构
- PascalCase 命名，一个文件一个组件
- 类型定义优先使用 `interface` 而非 `type`
- 组件 props 使用 `defineProps` 加泛型

### 3. 主题系统
参考 `src/style.css` 中的 CSS 变量体系，使用 `var(--xxx)` 而非硬编码颜色：

```css
/* 亮色/暗色自动适配 */
color: var(--text-primary);
background-color: var(--bg-primary);
border-color: var(--border-primary);
```

可用主题变量：
- `--bg-primary` / `--bg-secondary` / `--bg-tertiary` — 背景色
- `--text-primary` / `--text-secondary` / `--text-muted` — 文本色
- `--border-primary` / `--border-secondary` — 边框色
- `--accent` / `--accent-hover` / `--accent-bg` — 强调色
- `--code-bg` / `--code-border` — 代码块

### 4. Tailwind + CSS 变量结合
用 Tailwind 原子类处理布局和间距，用 CSS 变量处理色彩：

```html
<div class="flex items-center gap-2 p-4" style="color: var(--text-primary)">
```

### 5. 暗色模式
- 通过 `<html class="dark">` 切换
- 不要手动切换 CSS 类来控制颜色 — 利用 CSS 变量自动适配
- 主题切换逻辑参考 `src/components/TabNav.vue` 中的 `toggleTheme()`

## DO NOT
- 不要在组件内硬编码颜色值
- 不要用 `any` 类型（除非第三方库无类型定义）
- 不要在单个组件中写超过 300 行 — 拆分为更小组件
- 不要用选项式 API — 统一 Composition API
