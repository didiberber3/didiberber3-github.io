# GitHub Pages 部署指南

## 自动部署（推荐）

项目已配置 GitHub Actions 工作流，推送代码到 main 分支时会自动部署。

### 步骤：

1. **确保仓库设置**：
   - 进入 GitHub 仓库 Settings > Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages" 和 "/ (root)"

2. **推送代码**：
   ```bash
   git add .
   git commit -m "更新博客内容"
   git push origin main
   ```

3. **等待部署完成**：
   - 查看 Actions 标签页查看部署进度
   - 部署完成后访问 `https://[your-username].github.io/[repository-name]`

## 手动部署

如果需要手动部署，可以运行：

```bash
npm run deploy
```

这会自动构建并推送到 gh-pages 分支。

## 常见问题解决

### 1. 构建失败
- 确保所有动态页面都有 `generateStaticParams()`
- 检查是否有 TypeScript 错误
- 确认 `next.config.ts` 配置正确

### 2. 页面404
- 确认 GitHub Pages 设置正确
- 检查仓库是否为公开仓库
- 等待几分钟让 GitHub Pages 生效

### 3. 样式丢失
- 确认 `basePath` 配置正确
- 检查静态资源路径

### 4. 自定义域名
1. 在仓库 Settings > Pages > Custom domain 添加域名
2. 在 DNS 提供商处添加 CNAME 记录指向 `[username].github.io`
3. 更新 `.github/workflows/deploy.yml` 中的 `cname` 字段

## 环境变量

- `NODE_ENV`: 生产环境自动设置为 `production`
- `NEXT_EXPORT`: 自动启用静态导出模式
- `GITHUB_TOKEN`: GitHub Actions 自动提供

## 构建输出

构建生成的静态文件位于 `out/` 目录，会被自动推送到 `gh-pages` 分支。
