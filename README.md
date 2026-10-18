# 小窝

个人学习笔记站，记录 Java、Godot 和开发工具。自用为主，不是公开项目。

线上地址：<https://didiberber3.github.io/didiberber3-github.io/>

## 本地开发

```bash
npm install
npm run dev     # http://localhost:5173/didiberber3-github.io/
npm test        # Vitest
npm run lint
npm run build   # vue-tsc + vite build
```

## 内容

- 笔记放在 `content/notes/<分类>/<标题>.md`，**文件夹名就是分类**。
- frontmatter 需要 `date`（`yyyy-mm-dd`）、`tags`（数组或逗号分隔，统一小写）和 `description`（一句话，解释标题是干嘛的）：

```yaml
---
date: 2026-08-24
tags: [godot, tutorial]
description: 跟着 Godot 官方 2D 入门教程做一个可玩的小游戏。
---
```

- 分类由文件夹决定（`content/notes/<分类>/`），不要再额外写 `category` 字段。
- `description` 在首页卡片 hover 时显示在标题后面，也会显示在文章页标题区。
- `npm run notes:normalize` 检查并规范化 frontmatter（只预览）；加 `:write` 才写入，写入前会备份。
  需要 Node 22+（直接执行 TypeScript）。

## 页面结构

- 首页：分类 / 标签 / 归档索引 + 最新笔记，全部在首页原地筛选。
- 文章页：正文 + 右侧目录 + 相关文章 + 上/下一篇。
- 关于页。
- 旧的分类、标签、归档独立页面已删除，旧 URL 会重定向到首页筛选。

## 部署

push 到 `main` 后，GitHub Actions 会自动构建并发布到 `gh-pages` 分支，再走 GitHub Pages。

- 站点：<https://didiberber3.github.io/didiberber3-github.io/>
- 构建产物：`dist/`（含 `404.html` SPA 回退和 `rss.xml`）

设计规范见 [DESIGN_SPEC.md](DESIGN_SPEC.md)。
