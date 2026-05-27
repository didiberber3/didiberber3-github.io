# 博客技术栈统一升级计划

## TL;DR
> **Summary**: 将 Python 构建脚本 (`build.py`) 替换为 Node.js + `marked` 构建脚本 (`build.js`)，同时升级 Markdown 渲染（GFM + 脚注 + KaTeX + Mermaid）和样式精调。
> **Deliverables**: 1 个新构建脚本 · 1 个 package.json · 4 个文件更新 · 1 个文件删除
> **Effort**: medium
> **Parallel**: YES - 2 waves
> **Critical Path**: Task 1 → Task 2 → Task 10

## Context
### Original Request
用户有一个部署在 GitHub Pages 上的 Java 学习笔记博客。当前使用 Python 脚本 (`scripts/build.py`) 在 CI 中将 Markdown 源文件渲染为 HTML。用户只懂 HTML/CSS/基础 JS，不想再用 Python（不属于前端技术栈），也不想用 Vue/React 等框架（AI 生成质量差、部署困难）。需要一个统一在 JS 生态内的方案。

### Interview Summary
- **选择方案 A**：Node.js + `marked` 构建脚本，替换 Python
- **样式方向**：保留现有简约风格，做精调优化（不是彻底重设计）
- **Markdown 增强**：全都要——GFM 标准 + 脚注 + KaTeX（构建时渲染）+ Mermaid（浏览器运行时渲染）
- **工作流不变**：继续写 .md → git push → CI 自动构建 → GitHub Pages 部署
- **用户不碰 Node.js**：一切在 CI 中运行，package.json 提交到仓库即可

### Decisions Made
| 决策 | 选择 | 理由 |
|------|------|------|
| 构建语言 | Node.js (JavaScript) | 统一前端技术栈，AI 生成可靠性高 |
| 渲染引擎 | `marked` + GFM | 标准成熟，API 一行代码 |
| 数学公式 | KaTeX 构建时渲染 | SEO 友好，无闪烁 |
| 图表 | Mermaid 浏览器运行时 | 避免 Puppeteer 等重型依赖 |
| 脚注 | marked 自定义扩展 | 轻量，不引入额外包 |
| 样式策略 | 保留简约风，精调优化 | 用户偏好，工作量可控 |

## Work Objectives
### Core Objective
用 Node.js 构建脚本替换 Python 构建脚本，同时升级 Markdown 语法支持和页面样式。

### Deliverables
- `scripts/build.js` — 新的 Node.js 构建脚本
- `package.json` — npm 依赖声明
- 更新后的 `.github/workflows/deploy.yml`
- 更新后的 `blog/template.html`
- 更新后的 `blog/style.css`
- 更新后的 `.gitignore`
- 删除 `scripts/build.py`

### Definition of Done (verifiable conditions with commands)
所有验证通过 `node scripts/build.js` 在 blog/ 目录下生成完整输出，且 GitHub Actions 部署后页面访问正常。

### Must Have
- [ ] `scripts/build.js` 能正确处理 `content/notes/*.md` 和 `content/shares/*.md`
- [ ] 生成的 HTML 文件与现有 `template.html`/`share-template.html` 模板兼容
- [ ] 首页 (`blog/index.html`)、笔记列表 (`blog/notes.html`)、分享列表 (`blog/shares.html`) 正常生成
- [ ] 搜索索引 (`blog/search.json`) 和导航索引 (`blog/nav.json`) 正常生成
- [ ] GitHub Actions CI 中能自动安装依赖并运行构建
- [ ] 所有页面在浏览器中正常渲染（含 Mermaid 图表）

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- ❌ 不得引入 Vue/React/Next.js/Astro 等框架
- ❌ 不得要求用户在本地安装 Node.js（所有构建在 CI 中进行）
- ❌ 不得改变源文件格式（仍使用 .md + frontmatter）
- ❌ 不得重写 template.html 的整体结构（只做增量修改）
- ❌ 不得添加用户无法理解或维护的抽象层
- ❌ 不得引入 Puppeteer/Playwright 等无头浏览器依赖

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- **Test decision**: tests-after — 构建脚本运行后验证输出文件
- **QA policy**: 每个任务有 agent 可执行的验证场景
- **Evidence**: .sisyphus/evidence/task-{N}-{slug}.{ext}

## Execution Strategy
### Parallel Execution Waves

Wave 1: 基础建设 + 核心构建脚本 + CI 配置（Task 1-5）
Wave 2: 前端更新（模板、样式）+ 清理 + 整体验证（Task 6-10）

### Dependency Matrix
| Task | Depends On | Blocking |
|------|-----------|----------|
| 1. package.json | — | 2 |
| 2. build.js (core) | 1 | 4, 5 |
| 3. build.js (pages) | 1 | 4, 5 |
| 4. build.js (indexes) | 1 | 5 |
| 5. deploy.yml | 2, 3, 4 | 10 |
| 6. template.html | — | 10 |
| 7. style.css | — | 10 |
| 8. .gitignore | — | 10 |
| 9. Remove build.py | 5 | 10 |
| 10. Verify & test | 5, 6, 7, 8, 9 | — |

### Agent Dispatch Summary
Wave 1 (5 tasks): npm setup · build script core · page generation · index generation · CI config
Wave 2 (5 tasks): template update · style refinement · gitignore · cleanup · integration verification

## TODOs

- [ ] 1. 创建 package.json 并安装依赖

  **What to do**:
  1. 在项目根目录创建 `package.json`，内容如下：
     - name: `blog`
     - private: true
     - type: `commonjs`（使用 require/module.exports）
     - dependencies: `marked`（最新版）、`katex`（最新版）
     - scripts: `"build": "node scripts/build.js"`
  2. 运行 `npm install` 创建 node_modules 和 package-lock.json

  **Must NOT do**:
  - 不要添加 `gray-matter`（frontmatter 解析手动实现，减少依赖）
  - 不要添加 `marked-footnote`（用 marked 扩展 API 实现，减少依赖）
  - 不要使用 ES modules（type: module），保持 CommonJS

  **Recommended Agent Profile**:
  - Category: `quick` — 创建 package.json 加 npm install，标准操作
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [2, 3, 4] | Blocked By: []

  **References**:
  - Root: `D:\Test1\package.json` — 需要新建
  - CI: `.github/workflows/deploy.yml` — 后续会添加 `npm ci` 步骤

  **Acceptance Criteria**:
  - [ ] `package.json` 存在于项目根目录，包含 `marked` 和 `katex` 依赖
  - [ ] `package-lock.json` 和 `node_modules/` 存在

  **QA Scenarios**:
  ```
  Scenario: 验证依赖安装成功
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. Test-Path -LiteralPath "package.json"
      3. Test-Path -LiteralPath "node_modules/marked"
      4. Test-Path -LiteralPath "node_modules/katex"
    Expected: 所有文件路径都存在
    Evidence: .sisyphus/evidence/task-1-deps.txt

  Scenario: 验证 npm install 无报错
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. npm ls marked 2>&1
      3. npm ls katex 2>&1
    Expected: 没有 ERR 输出，显示依赖版本号
    Evidence: .sisyphus/evidence/task-1-npm-ls.txt
  ```

  **Commit**: YES | Message: `chore: add package.json with marked and katex deps` | Files: [package.json, package-lock.json]

---

- [ ] 2. 编写 scripts/build.js —— Markdown 渲染核心

  **What to do**:
  创建 `scripts/build.js`，实现以下核心功能模块：

  **常量与路径配置**（与 build.py 保持一致）：
  ```
  CONTENT_DIR = root/content
  NOTES_DIR = content/notes
  SHARES_DIR = content/shares
  BLOG_DIR = root/blog
  ARTICLES_DIR = blog/articles
  SHARED_DIR = blog/shared
  TEMPLATE_PATH = blog/template.html
  SHARE_TEMPLATE_PATH = blog/share-template.html
  NAV_PATH = blog/nav.json
  SEARCH_PATH = blog/search.json
  ```

  **函数 1：parseFrontmatter(raw)** — 使用正则解析 frontmatter
  - 匹配 `---\n(.*?)\n---\n` 模式
  - 逐行解析 key: value
  - 返回 `{ meta: {}, content: "" }`
  - 无 frontmatter 则返回 `{ meta: {}, content: raw }`

  **函数 2：slugify(text)** — 生成 URL 友好的 slug
  - 移除特殊字符，空格转连字符，截取 50 字符
  - 与现有 build.py 的 slugify 行为一致（保证生成的 HTML 文件名不变）

  **函数 3：renderMarkdown(mdText)** — 核心渲染管道
  按以下顺序处理：
  1. 提取 frontmatter（使用 parseFrontmatter）
  2. 预处理 KaTeX 块级公式 `$$...$$`：用 katex.renderToString() 渲染，标记占位
  3. 预处理 KaTeX 行内公式 `$...$`：用 katex.renderToString() 渲染，标记占位
  4. 使用 `marked.parse()` 渲染 Markdown（GFM 启用）
  5. 注入 footnotes 支持（marked 扩展：识别 `[^id]` 和 `[^id]:` 语法）
  6. 返回 `{ html, meta }`

  **marked 配置**：
  ```js
  marked.setOptions({
    gfm: true,
    breaks: false,
  });
  ```

  **Footnotes 实现**（marked 自定义扩展）：
  - 在 marked.use() 中注册一个 `extensions` 
  - 处理 `[^id]`（引用标记）→ `<sup id="fnref-id"><a href="#fn-id">id</a></sup>`
  - 处理 `[^id]: text`（脚注定义）→ 收集到页面底部 `<section class="footnotes">`
  - 参考 marked 官方扩展示例

  **函数 4：getTitleDate(mdPath)** — 获取文章标题和日期
  - 优先从 frontmatter 中读取 title 和 date
  - 无 frontmatter 则 fallback 到文件名（stem）和文件修改时间

  **Must NOT do**:
  - 不要使用 `import` 语法（使用 require/module.exports）
  - 不要添加任何框架级抽象
  - 不要修改 KaTeX CSS 文件——使用 CDN 加载
  - 不要在构建阶段运行 Mermaid（留给浏览器运行时）

  **Recommended Agent Profile**:
  - Category: `deep` — 核心构建逻辑，需要仔细处理各种 Markdown 边界情况
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [5] | Blocked By: [1]

  **References**:
  - Current build: `scripts/build.py` — 参考其 frontmatter 解析、目录结构、slugify 逻辑
  - Marked docs: https://marked.js.org/using_advanced#extensions
  - KaTeX API: https://katex.org/docs/api.html (katex.renderToString)
  - Template: `blog/template.html` — 了解 {{CONTENT}} 占位符格式
  - Share template: `blog/share-template.html` — 了解 share 页面渲染需求

  **Acceptance Criteria**:
  - [ ] `scripts/build.js` 存在且可通过 `node scripts/build.js` 执行不报错
  - [ ] parseFrontmatter 能正确解析 `---\ntitle: Test\ndate: 2026-05-24\n---\n# Content` 格式
  - [ ] renderMarkdown 能正确处理 GFM（表格、任务列表、删除线、自动链接）
  - [ ] renderMarkdown 能正确渲染 KaTeX 行内 `$E=mc^2$` 和块级 `$$\sum_{i=1}^n i$$`
  - [ ] Footnotes 扩展能正确处理 `[^1]` 和 `[^1]: description` 语法

  **QA Scenarios**:
  ```
  Scenario: 构建脚本无报错执行
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. node -e "require('./scripts/build')" 2>&1
    Expected: 无报错（此时模块未导出 main 函数也没关系）
    Evidence: .sisyphus/evidence/task-2-require.txt

  Scenario: Frontmatter 解析测试
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. node -e "
        const { parseFrontmatter } = require('./scripts/build');
        const r = parseFrontmatter('---\ntitle: Test\ndate: 2026-05-24\n---\n# Hello');
        console.log(JSON.stringify(r));
      " 2>&1
    Expected: 输出包含 {"meta":{"title":"Test","date":"2026-05-24"},"content":"# Hello"}
    Evidence: .sisyphus/evidence/task-2-frontmatter.txt
  ```

  **Commit**: YES | Message: `feat: add core markdown rendering with marked + KaTeX` | Files: [scripts/build.js]

---

- [ ] 3. 编写 scripts/build.js —— 页面生成模块

  **What to do**:
  在已创建的 `scripts/build.js` 中追加以下函数（或新建独立模块然后合并）。如果 Task 2 已完成，则在此任务中继续编辑该文件。

  **函数 5：applyTemplate(html, title, date, templatePath)** — 将渲染后的内容嵌入模板
  - 读取 templatePath 文件
  - 替换 `{{TITLE}}` → title
  - 替换 `{{DATE}}` → date
  - 替换 `{{CONTENT}}` → html
  - 返回完整 HTML 字符串

  **函数 6：generateArticle(mdPath, targetDir)** — 将单篇 .md 转换为 .html
  - 读取 .md 文件
  - 调用 renderMarkdown()
  - 调用 applyTemplate()
  - 写入 `targetDir/{slug}.html`

  **函数 7：generateSharePage(mdPath, targetDir)** — 将分享 .md 转换为分享 .html
  - 读取 .md 文件（分享文件 frontmatter 包含 tag 字段）
  - 调用 renderMarkdown()
  - 使用 share-template.html 模板
  - 写入 `targetDir/{slug}.html`

  **函数 8：generateNotesPage(notesMeta)** — 生成笔记列表页 `blog/notes.html`
  - 按日期降序排列（最新的在前）
  - 生成搜索框 + 卡片列表布局
  - 嵌入搜索 index 数据（JSON 内联 script）
  - 保留现有搜索功能（client-side JS）

  **函数 9：generateSharesPage(sharesMeta)** — 生成分享列表页 `blog/shares.html`
  - 按日期降序排列
  - 生成卡片列表布局，包含 tag 标签显示

  **函数 10：generateHomePage(notesMeta, sharesMeta)** — 生成首页 `blog/index.html`
  - 显示最新 6 篇笔记 + 最新 4 条分享
  - 保持与现有首页一致的布局

  **函数 11：build()** — 主入口函数
  ```
  function build() {
    // 1. Ensure output directories exist
    // 2. Process notes (read all .md → render → write to articles/)
    // 3. Process shares (read all .md → render → write to shared/)
    // 4. Generate notes.html
    // 5. Generate shares.html
    // 6. Generate index.html
    // 7. Generate nav.json
    // 8. Generate search.json
  }
  ```
  在文件末尾调用 `build();`

  **Must NOT do**:
  - 不要生成与现有结构不一致的文件路径
  - 不要在生成首页时硬编码文章数量（从实际文章列表动态获取）
  - 不要移除搜索功能

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — 有较多页面生成逻辑，但模式清晰
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [5] | Blocked By: [1]

  **References**:
  - Current build.py (lines 152-230): 首页/列表页生成逻辑
  - `blog/template.html`: {{TITLE}} {{DATE}} {{CONTENT}} 占位符
  - `blog/share-template.html`: 分享页模板
  - `blog/notes.html`: 现有笔记列表页的搜索功能和布局

  **Acceptance Criteria**:
  - [ ] `node scripts/build.js` 执行后 `blog/articles/` 目录生成了与 content/notes/ 对应的 .html 文件
  - [ ] `blog/shared/` 目录生成了与 content/shares/ 对应的 .html 文件
  - [ ] `blog/notes.html`、`blog/shares.html`、`blog/index.html` 均被生成
  - [ ] 生成的 HTML 文件中 {{TITLE}}、{{DATE}}、{{CONTENT}} 已被正确替换

  **QA Scenarios**:
  ```
  Scenario: 构建生成验证
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. node scripts/build.js 2>&1
      3. Get-ChildItem "blog/articles/*.html" | Measure-Object | Select-Object -ExpandProperty Count
      4. Get-ChildItem "blog/shared/*.html" | Measure-Object | Select-Object -ExpandProperty Count
      5. Test-Path -LiteralPath "blog/index.html"
      6. Test-Path -LiteralPath "blog/notes.html"
      7. Test-Path -LiteralPath "blog/shares.html"
    Expected: 文章数 > 0, 分享数 > 0, 所有页面文件存在
    Evidence: .sisyphus/evidence/task-3-build-output.txt
  ```

  **Commit**: YES | Message: `feat: complete build.js with page generation` | Files: [scripts/build.js]

---

- [ ] 4. 编写 scripts/build.js —— 索引生成模块

  **What to do**:
  在 `scripts/build.js` 中追加以下生成索引文件的函数：

  **函数 12：generateNavJson(notesMeta)** — 生成 `blog/nav.json`
  - 每个笔记条目：`{ title, date, slug }`
  - 按日期降序排列
  - 覆盖写入 `blog/nav.json`

  **函数 13：generateSearchJson(notesMeta, notesDir)** — 生成 `blog/search.json`
  - 读取每个笔记的纯文本（去除 frontmatter、代码块、markdown 标记）
  - 每个条目：`{ title, slug, date, text }`
  - text 为纯文本摘要（用于前端搜索匹配）
  - 覆盖写入 `blog/search.json`

  **函数 14：stripMarkdown(mdText)** — 去除 Markdown 标记
  - 移除 frontmatter
  - 移除代码块（```...```）
  - 移除行内代码（`code`）
  - 移除图片（![alt](url)）
  - 移除链接但保留文本（[text](url) → text）
  - 移除标题标记（#）
  - 移除加粗/斜体/删除线标记
  - 返回纯文本

  在 build() 主函数中集成上述函数。

  **Must NOT do**:
  - 不要引入 html stripping 的外部依赖
  - 不要在 search.json 中包含完整 HTML（只需要纯文本）
  - 不要修改 nav.json 和 search.json 的 JSON 结构（前端代码依赖它们）

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — 索引生成逻辑较复杂但模式简单
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [5] | Blocked By: [1]

  **References**:
  - Current `blog/nav.json` — 结构参考
  - Current `scripts/build.py:140-148` — search index 生成逻辑
  - Current `scripts/build.py:19-34` — strip_md 函数

  **Acceptance Criteria**:
  - [ ] `blog/nav.json` 生成，结构与现有文件一致（数组，每项 {title, date, slug}）
  - [ ] `blog/search.json` 生成，包含每篇笔记的纯文本内容
  - [ ] nav.json 条目按日期降序排列

  **QA Scenarios**:
  ```
  Scenario: 验证 JSON 索引生成
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. node scripts/build.js 2>&1
      3. $nav = Get-Content "blog/nav.json" -Raw | ConvertFrom-Json
      4. $nav.Count
      5. $search = Get-Content "blog/search.json" -Raw | ConvertFrom-Json
      6. $search.Count
    Expected: nav.Count > 0, search.Count > 0, nav.Count == search.Count
    Evidence: .sisyphus/evidence/task-4-indexes.txt
  ```

  **Commit**: YES | Message: `feat: add search and nav index generation` | Files: [scripts/build.js]

---

- [ ] 5. 更新 .github/workflows/deploy.yml

  **What to do**:
  修改 GitHub Actions CI 配置文件，将 Python 构建改为 Node.js 构建：

  当前 `deploy.yml` 内容：
  ```yaml
  - uses: actions/setup-python@v5
    with:
      python-version: '3.11'
  - name: Build
    run: python scripts/build.py
  ```

  改为：
  ```yaml
  - name: Install dependencies
    run: npm ci
  - name: Build
    run: node scripts/build.js
  ```

  同时删除 `actions/setup-python` 步骤（不再需要 Python）。

  完整的 deploy.yml 应变为：
  ```yaml
  name: Deploy Blog
  on:
    push:
      branches: [main]
    workflow_dispatch:
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      permissions:
        contents: write
      steps:
        - uses: actions/checkout@v4
        - name: Install dependencies
          run: npm ci
        - name: Build
          run: node scripts/build.js
        - name: Deploy to gh-pages
          uses: peaceiris/actions-gh-pages@v4
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: blog
            publish_branch: gh-pages
            force_orphan: true
  ```

  **Must NOT do**:
  - 不要修改 deploy 步骤（peaceiris/actions-gh-pages 保持不变）
  - 不要添加额外的工作流步骤
  - 不要使用 `npm install`（用 `npm ci`，更严格、更可靠）

  **Recommended Agent Profile**:
  - Category: `quick` — 简单编辑已知文件
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [10] | Blocked By: [2, 3, 4]

  **References**:
  - File: `.github/workflows/deploy.yml` — 需要编辑

  **Acceptance Criteria**:
  - [ ] deploy.yml 中不包含 actions/setup-python 步骤
  - [ ] deploy.yml 包含 `npm ci` 步骤
  - [ ] deploy.yml 的 Build 步骤运行 `node scripts/build.js`
  - [ ] deploy.yml 的 YAML 语法有效（可用 yamllint 或在线工具验证）

  **QA Scenarios**:
  ```
  Scenario: 验证 deploy.yml 语法
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. if (Get-Command "yamllint" -ErrorAction SilentlyContinue) { yamllint .github/workflows/deploy.yml } else { Write-Output "No yamllint - manual check" }
    Expected: 无语法错误
    Evidence: .sisyphus/evidence/task-5-deploy-yml.txt
  ```

  **Commit**: YES | Message: `ci: switch from Python to Node.js build` | Files: [.github/workflows/deploy.yml]

---

- [ ] 6. 更新 blog/template.html（添加 Mermaid + 布局微调）

  **What to do**:
  编辑 `blog/template.html`，进行以下修改：

  1. **在 head 中添加 KaTeX CSS**（用于构建时渲染的 KaTeX 公式样式）：
     ```html
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
     ```

  2. **在 body 末尾添加 Mermaid JS 和初始化代码**（在 highlight.js 之后）：
     ```html
     <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
     <script>
       mermaid.initialize({ startOnLoad: true, theme: 'default' });
     </script>
     ```

  3. **调整文章日期位置**：将 `<time class="nav-date article-date">` 放在标题下方更醒目的位置

  4. **优化目录（TOC）布局**：
     - 增大 TOC 侧边栏的宽度（当前可能偏窄）
     - 添加滚动条样式（toc-nav 区域可滚动）
     - 当前激活的目录项高亮更明显

  5. **为 Mermaid 图表容器添加基本样式**（直接内联 style 或在 style.css 中）：
     ```css
     .mermaid { margin: 1.5rem 0; text-align: center; }
     ```

  **Must NOT do**:
  - 不要删除现有的 highlight.js 代码高亮
  - 不要改变 {{TITLE}}、{{DATE}}、{{CONTENT}} 占位符的位置（build.js 依赖它们）
  - 不要改变导航栏 HTML 结构（class 名称供 CSS 使用）
  - 不要引入额外的 JS 框架

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — 前端模板调整
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [10] | Blocked By: []

  **References**:
  - File: `blog/template.html` — 当前模板，需要编辑
  - KaTeX CDN: `https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css`
  - Mermaid CDN: `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js`

  **Acceptance Criteria**:
  - [ ] template.html 包含 KaTeX CSS 链接
  - [ ] template.html 包含 Mermaid JS 脚本和初始化代码
  - [ ] highlight.js 代码高亮仍然正常工作
  - [ ] {{TITLE}}、{{DATE}}、{{CONTENT}} 占位符未被移除

  **QA Scenarios**:
  ```
  Scenario: 验证模板占位符完整性
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. Select-String -Pattern "{{TITLE}}" -LiteralPath "blog/template.html"
      3. Select-String -Pattern "{{CONTENT}}" -LiteralPath "blog/template.html"
    Expected: 找到 {{TITLE}} 和 {{CONTENT}} 占位符
    Evidence: .sisyphus/evidence/task-6-template.txt
  ```

  **Commit**: YES | Message: `feat: add KaTeX CSS and Mermaid JS to template` | Files: [blog/template.html]

---

- [ ] 7. 更新 blog/style.css（样式精调）

  **What to do**:
  编辑 `blog/style.css`，在保持现有简约风格的基础上进行精调：

  1. **排版优化**：
     - 文章内容区行高从 1.8 调整为 1.9（提升阅读舒适度）
     - 代码块添加圆角 `border-radius: 8px` 和柔和阴影
     - 标题上下间距微调（h1: 2em 上边距, h2: 1.5em 上边距）
     - 正文段落添加 `max-width: 70ch` 限制（最优阅读宽度）

  2. **颜色系统微调**：
     - 正文颜色从 `#2c2c2c` 调整为 `#1a1a1a`（提高对比度）
     - 链接颜色使用更鲜明的主色（如 `#2563eb` 蓝或保留现有绿色系 `#2d6a2d`）
     - 代码块背景色微调

  3. **卡片列表优化**：
     - 卡片添加悬停效果（hover 轻微上移 + 阴影变化）
     - 卡片间距调整

  4. **文章页面布局**：
     - 内容区最大宽度从隐含值调整为显式 `max-width: 780px`
     - 图片添加最大宽度限制和圆角
     - 表格添加斑马纹（zebra striping）

  5. **添加 KaTeX 相关样式**（确保公式显示正确）：
     ```css
     .katex { font-size: 1.1em; }
     .katex-display { margin: 1.5rem 0; overflow-x: auto; overflow-y: hidden; }
     ```

  6. **添加 Mermaid 容器样式**：
     ```css
     .mermaid { margin: 1.5rem 0; text-align: center; }
     ```

  7. **添加脚注样式**：
     ```css
     .footnotes { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.9em; }
     .footnotes li { margin-bottom: 0.5rem; }
     ```

  **Must NOT do**:
  - 不要改变现有的 class 命名（template.html 依赖它们）
  - 不要删除任何现有样式规则（只做添加和修改）
  - 不要做彻底的设计改版（保持简约风格）
  - 不要添加 CSS 框架（如 Tailwind、Bootstrap）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — 样式设计
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [10] | Blocked By: []

  **References**:
  - File: `blog/style.css` — 当前样式文件，需要编辑
  - File: `blog/template.html` — 了解需要匹配的 HTML 结构

  **Acceptance Criteria**:
  - [ ] 所有生成的页面在浏览器中打开后视觉正常（无布局错乱）
  - [ ] 代码块有圆角和柔和阴影
  - [ ] 卡片有悬停效果
  - [ ] 表格有斑马纹
  - [ ] KaTeX 公式显示正常
  - [ ] 所有现有 class 名称未被修改

  **QA Scenarios**:
  ```
  Scenario: CSS 语法验证
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. node -e "try { require('css').parse(require('fs').readFileSync('blog/style.css','utf8')); console.log('CSS valid'); } catch(e) { console.log('CSS error:', e.message); }" 2>&1
    Expected: "CSS valid" 或无报错
    Evidence: .sisyphus/evidence/task-7-css.txt
  ```

  **Commit**: YES | Message: `style: refine blog styling for readability and KaTeX/Mermaid` | Files: [blog/style.css]

---

- [ ] 8. 更新 .gitignore

  **What to do**:
  在 `.gitignore` 文件中添加 `node_modules/` 条目。

  当前 .gitignore 内容：
  ```
  blog/articles/
  blog/shared/
  blog/shares.html
  blog/notes.html
  blog/.cache.json
  blog/nav.json
  blog/index.html
  data/
  ```

  添加后：
  ```
  blog/articles/
  blog/shared/
  blog/shares.html
  blog/notes.html
  blog/.cache.json
  blog/nav.json
  blog/index.html
  data/
  node_modules/
  ```

  **Must NOT do**:
  - 不要删除 .gitignore 中的现有条目（它们仍然有效）
  - 不要添加 `package-lock.json` 到 gitignore（它应该被提交）

  **Recommended Agent Profile**:
  - Category: `quick` — 一行编辑
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [10] | Blocked By: []

  **References**:
  - File: `.gitignore` — 需要编辑

  **Acceptance Criteria**:
  - [ ] `.gitignore` 包含 `node_modules/` 条目
  - [ ] `.gitignore` 原有条目全部保留

  **QA Scenarios**:
  ```
  Scenario: 验证 gitignore
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. Select-String -Pattern "node_modules" -LiteralPath ".gitignore"
    Expected: 找到 node_modules/ 条目
    Evidence: .sisyphus/evidence/task-8-gitignore.txt
  ```

  **Commit**: YES | Message: `chore: add node_modules to gitignore` | Files: [.gitignore]

---

- [ ] 9. 删除 scripts/build.py

  **What to do**:
  删除旧的 Python 构建脚本：
  ```bash
  Remove-Item -LiteralPath "scripts/build.py" -Force
  ```

  **Must NOT do**:
  - 不要删除其他 .py 文件（应该不存在，但需确认）
  - 确认 build.py 确实不再被任何地方引用后才删除

  **Recommended Agent Profile**:
  - Category: `quick` — 文件删除
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [10] | Blocked By: [5]

  **References**:
  - File: `scripts/build.py` — 要删除的目标

  **Acceptance Criteria**:
  - [ ] `scripts/build.py` 不再存在
  - [ ] 仓库中无其他文件引用 `build.py`（deploy.yml 已更新）

  **QA Scenarios**:
  ```
  Scenario: 验证文件已删除
    Tool: Bash
    Steps:
      1. Test-Path -LiteralPath "scripts/build.py"
    Expected: False（文件不存在）
    Evidence: .sisyphus/evidence/task-9-deleted.txt
  ```

  **Commit**: YES | Message: `chore: remove deprecated Python build script` | Files: [scripts/build.py]

---

- [ ] 10. 整体构建验证

  **What to do**：
  在本地运行完整的构建流程，验证所有输出正确。

  1. 运行 `node scripts/build.js`
  2. 检查 blog/ 目录下所有输出文件
  3. 用浏览器打开 `blog/index.html` 验证页面渲染
  4. 验证 KaTeX 公式渲染（找包含数学公式的文章）
  5. 验证代码高亮（含 Java、Python 等多语言）
  6. 验证搜索功能正常工作

  **检查清单**：
  - [ ] blog/articles/ 中包含与 content/notes/ 对应的所有 .html 文件（13 篇）
  - [ ] blog/shared/ 中包含与 content/shares/ 对应的所有 .html 文件（6 条）
  - [ ] blog/index.html 显示最新 6 篇笔记和 4 条分享
  - [ ] blog/notes.html 显示所有 13 篇笔记，搜索功能可用
  - [ ] blog/shares.html 显示所有分享
  - [ ] blog/nav.json 包含 13 条记录，按日期降序
  - [ ] blog/search.json 包含 13 条记录，含纯文本内容
  - [ ] 任意文章页：高亮 JS 代码、表格、图片正常显示
  - [ ] deploy.yml 无 Python 相关步骤

  **Must NOT do**:
  - 不要在本机实际 push 到 GitHub（CI 部署由 push 触发）
  - 不要修改任何源文件（只验证构建输出）

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — 全面验证
  - Skills: [] — 无需特殊技能
  - Omitted: N/A

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [Final Verification] | Blocked By: [5, 6, 7, 8, 9]

  **References**:
  - Directory: `content/notes/` — 13 个源文件
  - Directory: `content/shares/` — 6 个源文件

  **Acceptance Criteria**:
  - [ ] 构建无报错退出
  - [ ] 所有输出文件存在且内容完整
  - [ ] nav.json 和 search.json 的 JSON 语法有效

  **QA Scenarios**:
  ```
  Scenario: 完整构建验证
    Tool: Bash
    Steps:
      1. cd D:\Test1
      2. Remove-Item -LiteralPath "blog/articles/*.html" -Force
      3. Remove-Item -LiteralPath "blog/shared/*.html" -Force
      4. node scripts/build.js 2>&1
      5. echo "Exit code: $LASTEXITCODE"
      6. $articleCount = (Get-ChildItem "blog/articles/*.html").Count
      7. $sharedCount = (Get-ChildItem "blog/shared/*.html").Count
      8. Write-Output "Articles: $articleCount, Shares: $sharedCount"
    Expected: Exit code 0, Articles: 13, Shares: 6
    Evidence: .sisyphus/evidence/task-10-full-build.txt
  ```

  **Commit**: NO（已包含在之前的任务中）

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. Plan Compliance Audit — oracle
      验证：所有 TODO 是否已实现？build.js 是否使用了 marked（而非其他库）？
- [ ] F2. Code Quality Review — unspecified-high
      验证：build.js 代码质量、错误处理、无硬编码路径
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
      验证：在浏览器中打开生成的页面，检查 Mermaid 渲染、KaTeX 公式、代码高亮、搜索功能
- [ ] F4. Scope Fidelity Check — deep
      验证：没有引入 Vue/React/Python，没有改变源文件格式

## Commit Strategy
每个任务独立提交，commit message 遵循 `type(scope): desc` 格式。
最终 push 到 main 分支触发 CI 部署。

## Success Criteria
1. ✅ `node scripts/build.js` 在 CI 中零报错运行
2. ✅ GitHub Actions 部署成功，gh-pages 分支包含正确文件
3. ✅ 所有文章页面在浏览器中正常访问
4. ✅ Mermaid 图表在页面中可见
5. ✅ KaTeX 公式正确渲染
6. ✅ 搜索功能正常工作
7. ✅ 代码高亮正常工作
8. ✅ 整体页面风格统一、阅读舒适
