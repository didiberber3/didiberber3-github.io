# 博客 Markdown 渲染方案分析

> 本文档供你我一起阅读、讨论后，再决定下一步行动。

---

## 一、你当前的系统

```
content/notes/*.md     ← 你在此写 Markdown 源文件
      │
      ▼  (git push → GitHub Actions 触发)
scripts/build.py       ← Python 脚本：读取 .md，渲染成 HTML
      │
      ▼
blog/articles/*.html   ← 生成的 HTML 文件（被 .gitignore 忽略）
blog/index.html        ← 首页（也是 build.py 生成的）
      │
      ▼  (peaceiris/actions-gh-pages)
GitHub Pages 部署      ← 将 blog/ 目录发布到 gh-pages 分支
```

---

## 二、你的真实诉求（根据你的最新说明）

| 之前的问题 | 你真正的意思 |
|-----------|------------|
| "不想用 Python" | Python 不属于前端技术栈，感觉"不统一" |
| "只用 html css js 能做到吗" | 你只懂 HTML/CSS/一点 JS，希望用你懂的东西 |
| "框架我也不懂" | Vue/React 等框架你无法自己维护，AI 生成的也经常出错 |
| "ai 使用 vue 的能力很差" | 你试过让 AI 写 Vue 项目，但部署到 GitHub Pages 总是失败 |
| "需要更加统一的技术栈" | 全部统一在 **JavaScript/HTML/CSS** 体系内，不再混入 Python |

**一句话总结：你想要一套去掉 Python、只用 JS 生态、AI 不容易写错、能稳定部署到 GitHub Pages 的博客方案。**

---

## 三、两个推荐方案（二选一）

### 方案 A：Node.js 构建脚本（替代 Python）⭐ 强烈推荐

**核心思路**：用 Node.js 重写 `build.py` 的功能，架构完全不变。

**改什么：**
- `scripts/build.py` → `scripts/build.js`（用 Node.js + `marked` 包）
- `.github/workflows/deploy.yml`：加一步 `npm install`，把 `python scripts/build.py` 改成 `node scripts/build.js`

**不改什么：**
- 你仍然在 `content/notes/*.md` 写 Markdown
- 仍然 `git push` → CI 自动构建 → GitHub Pages 部署
- 仍然是**静态 HTML**，SEO 完好

**为什么 AI 不容易写错：**
- `marked` 库的 API 就一行代码：`marked.parse(mdText)`
- Node.js 文件操作 API（`fs.readFileSync` / `fs.writeFileSync`）是标准库，AI 写过几百万次
- 整个脚本就 70-100 行，逻辑清晰，没有组件生命周期、没有路由、没有状态管理

**技术栈统一度：** ⭐⭐⭐⭐⭐（全线 JavaScript）

| 优点 | 缺点 |
|------|------|
| 你现有的工作流一步不改 | 需要 `npm install`，引入了一个库依赖 |
| 替换成本最低（换一个文件 + 改 3 行 CI 配置） | 你对 Node.js 也不熟（但你不需自己写，AI 写） |
| `marked` 渲染能力比手写 render_md() 强得多（GFM 表格、任务列表等） | |
| SEO 完美（静态 HTML） | |
| AI 生成可靠性极高 | |

---

### 方案 B：浏览器端渲染（完整的 .md → 浏览器直接渲染）

**核心思路**：去掉所有构建步骤，源文件 .md 直接部署，浏览器用 JS 渲染。

**怎么做：**
```html
<!-- 在 HTML 中引入 marked.js（从 CDN） -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
  fetch('article.md')
    .then(r => r.text())
    .then(md => {
      document.getElementById('content').innerHTML = marked.parse(md);
    });
</script>
```

**技术栈：** 只有 HTML + CSS + JS（CDN 库），没有构建步骤，没有 npm，没有 Node。

| 优点 | 缺点 |
|------|------|
| 零构建，最极简 | ❌ **SEO 几乎为零**（搜索引擎看不到文章内容） |
| 你完全能理解每一行代码 | 首次打开有加载延迟 |
| AI 极难写错（fetch + marked.parse，两行核心代码） | 文章 URL 必须包含 .md 后缀或特殊处理 |
| 不需要任何 CI 改动 | 不适用于公开技术博客（除非你不关心搜索流量） |

---

## 四、AI 生成可靠性对比（你特别关心的点）

我评估了各方案中 AI（包括我在内）的犯错概率：

| 方案 | AI 犯错概率 | 常见错误类型 |
|------|-----------|------------|
| **当前：Python build.py** | ⭐⭐ 低 | 偶尔 import 路径错误 |
| **方案 A：Node.js + marked** | ⭐ 极低 | 几乎不会错（太标准了） |
| **方案 B：浏览器 marked CDN** | ⭐ 极低 | 极少（简单 fetch + render） |
| ~~Vue / React + Vite~~ | ⭐⭐⭐⭐ 高 | 路由配置错、SSG 构建失败、gh-pages 部署路径错、JS 运行时错误、组件不渲染... |

**方案 A 和 B 的 AI 犯错概率最低**，因为它们没有框架的"魔法"——每一步都是显式的、标准的 API 调用。

---

## 五、我的明确推荐

### 推荐路径：方案 A（Node.js + marked 构建脚本）

原因是结合了你的所有约束：

1. ✅ **统一技术栈**：全线 JavaScript，不再有 Python
2. ✅ **你现有的工作流不动**：继续写 .md → git push → 自动部署
3. ✅ **AI 几乎不会写错**：marked.parse() 是 AI 训练数据中出现频率最高的 API 之一
4. ✅ **SEO 完好**：生成的仍然是静态 HTML
5. ✅ **替换成本最低**：只改两个文件（`scripts/build.py` → `scripts/build.js` + 改 `deploy.yml`）
6. ✅ **渲染能力升级**：`marked` 比你手写的渲染器支持更多 Markdown 语法（GFM 表格、任务列表、删除线等）

**唯一你需要接受的：** npm 生态 + node_modules。但你不需要在本地跑它——CI 里会自动 `npm install && node scripts/build.js`，你看不见它。

---

## 六、我需要你回答的问题（读完请告诉我）

1. **方案 A 和方案 B，你倾向哪一个？**
   - A：Node.js 构建脚本（保留当前工作流，Python 换成 JS）
   - B：浏览器端渲染（去构建，全 .md 部署，牺牲 SEO）

2. **如果你选方案 A：对 `marked` 渲染的效果有要求吗？**（比如代码高亮、数学公式、流程图等）目前你的博客用了 highlight.js 做代码高亮，我们可以保留。

3. **你的分享页（`content/shares/`）也需要同样的处理吗？**（目前 build.py 也处理分享页，新的脚本应该继续保持）

---

读完请告诉我你的选择，我来生成完整的实施计划。
