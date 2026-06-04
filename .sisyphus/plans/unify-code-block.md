# 统一代码块组件 — 容器化设计

## TL;DR
> **目标**：用一个 `.code-block` 容器包住 pre-wrap + fold-btn，让代码块、复制按钮、折叠按钮成为**同一个组件**，视觉上统一。
> **成果**：更新 `reader.ts` (加容器) + `style.css` (容器样式，pre 去边框，fold-btn 加分割线)。
> **工时**：Quick（2 个文件，定点修改）
> **并行**：否 — reader.ts 改完结构，CSS 匹配新结构

## 背景
### 需求来源
用户反馈：代码块、复制按钮、折叠按钮风格不统一，它们是同一个大功能的不同部分，应该视觉整体一致。

### 现状问题
```
<pre-wrap>     ← 透明容器，只管折叠高度
  <pre>        ← 自己有 border + border-radius（Tailwind Typography）
    <code>
    <copy-btn>
  </pre>
</pre-wrap>
<fold-btn>     ← 兄弟节点，border-top:0 勉强贴在 pre 下面
```
- `<pre>` 有下圆角，fold-btn 是平的 → 交界处有空隙/视觉断裂
- 三个元素的背景/边框各自定义，不是统一组件
- 没有"代码块组件"这个概念，全靠 CSS 拼接

### 选定方案
**A: 统一容器** — reader.ts 加一层 `.code-block` div 包住 pre-wrap + fold-btn，容器统一负责边框、圆角、背景。

```
<code-block>         ← 新增：统一容器
  <pre-wrap>         ← 原有：折叠控制
    <pre>            ← 去边框/圆角（容器接管）
      <code>
      <copy-btn>     ← 不动
    </pre>
  </pre-wrap>
  <fold-btn>         ← 去边框，仅保留顶部分割线
</code-block>
```

## 设计规格

### 容器 `.code-block`
```css
.code-block {
  border: 1px solid var(--code-border);
  border-radius: 0.375rem;      /* 6px，和当前 prose pre 一致 */
  overflow: hidden;             /* 裁剪子元素到圆角内 */
  background: var(--code-bg);
  margin-bottom: 1rem;          /* 替代原有 pre 的 margin-bottom */
}
```

### pre 去边框/去圆角
```css
.code-block .prose pre {
  border: none;
  border-radius: 0;
  margin-top: 0;
  margin-bottom: 0;             /* 消除 Tailwind 的 1.666em margin */
}
```

### fold-btn 分割线
```css
.code-block .fold-btn {
  border: none;                 /* 去掉四周边框 */
  border-top: 1px solid var(--code-border);  /* 仅保留顶部分割线 */
  border-radius: 0;             /* 不抢容器的圆角 */
  background: var(--code-bg);   /* 和容器背景一致 */
}
```

### 其他不变
- `.pre-wrap`、`.pre-wrap.collapsed`、`.pre-wrap.collapsed::after` → 不动
- `.copy-btn` → 不动
- `.fold-btn:hover`、`.fold-btn .fold-arrow` → 不动
- 短代码块（≤15 行，无 fold-btn）→ 不受影响，保持原有 pre 样式

## 实现任务

### 任务 1：reader.ts — 创建 code-block 容器

**文件**：`src/utils/reader.ts`
**位置**：`addCodeFold()` 函数内 (行 20-41)

**改动**：

当前：
```ts
const wrap = document.createElement('div')
wrap.className = 'pre-wrap collapsed'
pre.parentNode?.insertBefore(wrap, pre)
wrap.appendChild(pre)
// ... btn 创建 ...
wrap.parentNode?.insertBefore(btn, wrap.nextSibling)
```

改为：
```ts
// 1. 创建统一容器
const codeBlock = document.createElement('div')
codeBlock.className = 'code-block'

// 2. 创建 pre-wrap
const wrap = document.createElement('div')
wrap.className = 'pre-wrap collapsed'

// 3. 插入容器到 pre 之前
pre.parentNode?.insertBefore(codeBlock, pre)

// 4. pre 移入 pre-wrap
wrap.appendChild(pre)

// 5. pre-wrap 移入容器
codeBlock.appendChild(wrap)

// ... btn 创建不变 ...

// 6. btn 追加到容器末尾
codeBlock.appendChild(btn)
```

**不可做**：
- 不要改动 `addCopyButtons()` 函数
- 不要改动 `FOLD_THRESHOLD = 15`
- 不要改动 btn 的 label、事件逻辑

### 任务 2：style.css — 添加容器样式

**文件**：`src/style.css`
**位置**：在 `/* ── Code block fold ── */` 注释块内

**新增 `.code-block` 规则**（放在 `.pre-wrap` 规则之前）：
```css
/* ── Code block unified container ── */
.code-block {
  border: 1px solid var(--code-border);
  border-radius: 0.375rem;
  overflow: hidden;
  background: var(--code-bg);
  margin-bottom: 1rem;
}
```

**新增 `.code-block .prose pre` 规则**（放在 prose overrides 区域，约 line 505 之后）：
```css
.code-block .prose pre:where(.prose pre) {
  border: none;
  border-radius: 0;
  margin-top: 0;
  margin-bottom: 0;
}
```

**新增 `.code-block .fold-btn` 规则**（替换当前的 `.fold-btn` 的 border 设置）：
```css
.code-block .fold-btn {
  border: none;
  border-top: 1px solid var(--code-border);
  border-radius: 0;
  background: var(--code-bg);
}
```

**不可做**：
- 不要删除 `.fold-btn` 规则（短代码块或无容器场景可能用到）
- 不要改动 `.pre-wrap` 相关规则
- 不要改动 `.copy-btn` 规则
- 不要碰 prose override 区域以外的 CSS

## 验收标准
- [ ] `pnpm build` 成功，无错误
- [ ] `pnpm test` 全部 18 个测试通过
- [ ] 长代码块（>15 行）：展开后代码底部和 fold-btn 之间无间隙
- [ ] fold-btn 仅有一条顶部分割线，其余三边无边框
- [ ] 代码块整体有均匀圆角（6px）
- [ ] 折叠状态 gradient 遮罩正常
- [ ] 短代码块（≤15 行）：样式不变，仍有完整边框/圆角
- [ ] 复制按钮：hover 显示，点击复制，位置不变

## 验证方式
- 构建：`pnpm build`
- 测试：`pnpm test`
- 可视化：启动 dev server，打开有长代码块的页面，检查展开/折叠状态

## 提交策略
单次提交：`feat(style): unify code block into container component`
文件：`["src/utils/reader.ts", "src/style.css"]`

## 最终检查
- [ ] F1. 代码审查 — reader.ts 逻辑正确，CSS 无副作用
- [ ] F2. 构建验证 — pnpm build 通过
- [ ] F3. 可视化验证 — 展开/折叠正常，样式统一
- [ ] F4. 回归验证 — 短代码块不受影响
