---
name: content-markdown
description: Content management and Markdown processing for the 记录与分享 blog. Covers frontmatter rules, content directory structure, and rendering pipeline.
---

# 内容管理与 Markdown 处理

## 目录结构

```
content/
├── notes/          # 笔记（支持分类子目录）
│   ├── java/       # Java 分类
│   └── 排版/       # 排版分类
└── shares/         # 分享（平铺，无子目录）
```

## Frontmatter 格式

### 笔记 (Notes)
```markdown
---
title: 集合框架详解
date: 2026-01-15
---
```

### 分享 (Shares)
```markdown
---
title: Git 常用命令速查
date: 2026-01-20
tag: 工具
url: https://git-scm.com/docs
---
```

## 渲染管线

1. Vite glob import 加载 `.md` 源文件（`import.meta.glob`）
2. `parseFrontmatter()` 提取 frontmatter + 正文
3. `renderMarkdown(content)` 用 `marked`（GFM 模式）转为 HTML
4. `extractTOC(html)` 正则提取 `h2`/`h3` 生成目录
5. `highlightBlocks()` 用 `highlight.js` 着色代码块
6. `addCopyButtons()` 为代码块添加复制按钮
7. `setupLightbox()` 图片点击放大

## 代码高亮语言
注册的语言：`java`, `bash`, `terminal`, `markdown`, `md`, `powershell`
参考 `src/utils/highlight.ts`

## DO NOT
- 不要在 Markdown 中使用 HTML 表格 — 用 GFM 表格语法
- 不要在 content/notes 根目录下直接放文件 — 用分类子目录
- 不要修改 `.md` 源文件的文件名作为 slug 后的逻辑（slug = 文件名去掉 `.md`）
- 不要使用非 UTF-8 编码的源文件
