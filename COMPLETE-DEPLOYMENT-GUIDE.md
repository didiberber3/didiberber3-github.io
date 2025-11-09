# 🚀 完整部署指南 - GitHub Pages & Vercel

## 📋 目录
- [GitHub Pages 部署（推荐）](#github-pages-部署推荐)
- [Vercel 部署（备选）](#vercel-部署备选)
- [故障排除](#故障排除)
- [维护指南](#维护指南)

---

## 🎯 GitHub Pages 部署（推荐）

### ✅ 当前配置状态
您的项目已经完全配置好了！
- ✅ Next.js 静态导出配置完成
- ✅ GitHub Actions 工作流已配置
- ✅ 所有动态路由静态生成正常
- ✅ 构建成功，生成 29 个静态页面

### 🚀 快速部署步骤

#### 第一步：提交当前配置
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

#### 第二步：GitHub 仓库设置
1. 进入您的 GitHub 仓库：`https://github.com/didiberber3/my-blog`
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择：
   - **Source**: Deploy from a branch
   - **Branch**: gh-pages
   - **Folder**: / (root)
5. 点击 **Save**

#### 第三步：等待自动部署
- 推送代码后，GitHub Actions 会自动触发
- 在 **Actions** 标签页查看部署进度
- 部署完成后，您的博客将在线可访问

#### 第四步：访问您的博客
部署成功后，访问：`https://didiberber3.github.io/my-blog`

### 📊 部署验证清单
- [ ] 代码已推送到 main 分支
- [ ] GitHub Actions 构建成功
- [ ] gh-pages 分支已创建
- [ ] GitHub Pages 设置已启用
- [ ] 网站可以正常访问
- [ ] 所有页面链接正常工作
- [ ] 中文内容显示正常

---

## 🌟 Vercel 部署（备选）

### 📝 创建 Vercel 配置文件

首先，我需要为您创建 `vercel.json` 配置文件：

```json
{
  "buildCommand": "npm run build:static",
  "outputDirectory": "out",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "functions": {},
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "cleanUrls": true,
  "trailingSlash": true
}
```

### 🚀 Vercel 部署步骤

#### 第一步：创建 Vercel 账户
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 授权 Vercel 访问您的仓库

#### 第二步：导入项目
1. 点击 **New Project**
2. 选择您的 `my-blog` 仓库
3. Vercel 会自动检测到 Next.js 项目

#### 第三步：配置构建设置
在部署设置页面：
- **Framework Preset**: Next.js
- **Build Command**: `npm run build:static`
- **Output Directory**: `out`
- **Install Command**: `npm ci`

#### 第四步：环境变量（可选）
如果需要，可以添加环境变量：
- `NODE_ENV`: `production`

#### 第五步：部署
点击 **Deploy** 按钮，Vercel 会：
1. 克隆您的仓库
2. 安装依赖
3. 构建静态文件
4. 部署到全球 CDN

#### 第六步：访问网站
部署完成后，您会获得：
- 临时域名：`https://my-blog-xxx.vercel.app`
- 可以添加自定义域名

### 🔄 自动部署
Vercel 支持自动部署：
- 推送到 main 分支 → 自动部署到生产环境
- 推送到其他分支 → 自动部署到预览环境

---

## 🔧 故障排除

### GitHub Pages 常见问题

#### 问题 1：部署失败
**症状**: GitHub Actions 构建失败
**解决方案**:
```bash
# 检查构建脚本
npm run build:static

# 检查 Next.js 配置
cat next.config.ts

# 清理缓存重新构建
rm -rf .next out
npm run build:static
```

#### 问题 2：404 错误
**症状**: 页面显示 404
**解决方案**:
1. 检查 `basePath` 配置是否正确
2. 确认 GitHub Pages 设置中的分支和文件夹
3. 检查 `.nojekyll` 文件是否存在

#### 问题 3：样式丢失
**症状**: 网站样式不正确
**解决方案**:
1. 检查 `_next` 文件夹是否正确生成
2. 确认 `trailingSlash: true` 配置
3. 检查静态资源路径

#### 问题 4：中文内容显示异常
**症状**: 中文文件名或内容显示问题
**解决方案**:
1. 检查文件编码（应为 UTF-8）
2. 确认 URL 编码正确处理
3. 验证 `generateStaticParams` 返回正确的 slug

### Vercel 常见问题

#### 问题 1：构建失败
**症状**: Vercel 构建失败
**解决方案**:
1. 检查 `vercel.json` 配置
2. 确认 `build:static` 脚本正确
3. 检查 Node.js 版本兼容性

#### 问题 2：路由问题
**症状**: 页面刷新后 404
**解决方案**:
1. 确认 `trailingSlash: true`
2. 检查 `routes` 配置
3. 验证动态路由生成

---

## 📚 维护指南

### 日常维护

#### 添加新文章
1. 在 `posts/` 目录创建新的 Markdown 文件
2. 添加必要的 frontmatter：
```yaml
---
title: 文章标题
date: 2025-01-01
archive: 2025
tags: [标签1, 标签2]
category: 分类
---
```
3. 提交并推送：
```bash
git add posts/新文章.md
git commit -m "Add new post: 文章标题"
git push origin main
```

#### 更新配置
- **博客信息**: 编辑 `src/lib/config.ts`
- **构建配置**: 编辑 `next.config.ts`
- **部署配置**: 编辑 `.github/workflows/deploy.yml`

### 性能优化

#### 图片优化
- 使用 WebP 格式
- 压缩图片大小
- 添加 alt 文本

#### SEO 优化
- 更新 Meta Tags
- 生成站点地图
- 优化页面标题

### 监控和备份

#### 部署监控
- GitHub Actions 状态
- 网站可用性检查
- 性能监控

#### 备份策略
- Git 仓库备份
- 内容备份
- 配置文件备份

---

## 🎉 部署成功检查

### GitHub Pages 部署检查
- [ ] 网站可以正常访问
- [ ] 所有页面链接正常
- [ ] 中文内容显示正确
- [ ] 样式和布局正常
- [ ] 移动端适配正常
- [ ] SEO 元数据正确

### Vercel 部署检查
- [ ] 临时域名可以访问
- [ ] 自动部署正常工作
- [ ] 预览部署功能正常
- [ ] 自定义域名配置（如需要）

---

## 📞 获取帮助

如果遇到问题：
1. 检查本文档的故障排除部分
2. 查看 GitHub Actions 构建日志
3. 检查 Vercel 部署日志
4. 搜索相关错误信息
5. 提交 Issue 到相关平台

---

**🎊 恭喜！您的博客现在已经准备好部署到任何平台了！**
