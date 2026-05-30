---
name: ci-cd-github
description: GitHub Actions CI/CD workflow for Vue SPA deployment to GitHub Pages. Covers build, SPA 404 fallback, and npm caching.
---

# CI/CD: GitHub Actions + GitHub Pages

## 构建部署流程

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
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci --prefer-offline
      - run: npm run build
      - name: SPA fallback for history routing
        run: cp dist/index.html dist/404.html
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist
          publish_branch: gh-pages
          force_orphan: true
```

## 关键要点

### SPA History 路由支持
因为切换到 `createWebHistory()` 路由模式，GitHub Pages 需要 `404.html` 做 SPA fallback：
```bash
cp dist/index.html dist/404.html
```
放在 `npm run build` 之后、deploy 之前。

### npm ci vs npm install
CI 环境用 `npm ci --prefer-offline` 而非 `npm install`，保证可重现构建。

### 缓存
`actions/setup-node@v4` 的 `cache: npm` 会自动缓存 `node_modules`。

## DO NOT
- 不要在 workflow 中使用 `npm install` — 用 `npm ci`
- 不要推送 `dist/` 到 main 分支
- 不要修改 GitHub Pages 的自定义域名配置（在仓库 Settings 中设置）
