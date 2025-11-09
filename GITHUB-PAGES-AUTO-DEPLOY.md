# GitHub Pages 自动部署方案

## 🚀 方案概述

此方案实现了**不修改代码、保持动态函数**的情况下，通过GitHub Actions自动部署到GitHub Pages。

## ✅ 核心优势

- **零代码修改**：只优化配置文件，业务逻辑完全不变
- **保持动态函数**：通过`generateStaticParams`处理动态路由
- **完全自动化**：推送代码即自动部署
- **SEO友好**：静态导出，搜索引擎友好
- **多环境支持**：开发/生产环境路径自动适配

## 📋 已完成的配置优化

### 1. Next.js 配置优化 (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  distDir: 'out',
  
  // GitHub Pages路径配置
  basePath: process.env.NODE_ENV === "production" ? "/my-blog" : "",
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 确保路由正确
  trailingSlash: true,
  
  // 环境变量
  env: {
    NEXT_PUBLIC_DEPLOY_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
```

### 2. GitHub Actions 工作流优化 (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build static site
      run: npm run build:static
      env:
        NODE_ENV: production
        NEXT_EXPORT: true
        SITE_URL: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}
    
    - name: Add .nojekyll file
      run: touch out/.nojekyll
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
        publish_branch: gh-pages
        enable_jekyll: false
```

## 🔧 GitHub Pages 设置步骤

### 1. 仓库配置

1. 进入GitHub仓库的 **Settings** 页面
2. 找到 **Pages** 选项
3. 在 **Source** 中选择 **"Deploy from a branch"**
4. 在 **Branch** 中选择 **"gh-pages"** 和 **"/ (root)"**
5. 点击 **Save** 保存设置

### 2. 权限确认

确保仓库是公开的，或者您有GitHub Pro账户（私有仓库需要Pro才能使用GitHub Pages）

## 🚀 部署流程

### 自动部署（推荐）

1. **推送代码到main分支**
   ```bash
   git add .
   git commit -m "更新博客内容"
   git push origin main
   ```

2. **等待自动部署**
   - 查看仓库的 **Actions** 标签页
   - 等待工作流完成（通常2-3分钟）

3. **访问网站**
   - 访问：`https://[your-username].github.io/my-blog`
   - 替换 `[your-username]` 为您的GitHub用户名

### 手动部署

如果需要手动部署：

```bash
npm run deploy
```

## 📁 构建输出说明

- **构建目录**：`out/`
- **部署分支**：`gh-pages`
- **静态文件**：所有页面都预渲染为静态HTML
- **资源文件**：CSS、JS、图片等静态资源

## 🔍 动态函数处理

### 自动静态生成

项目中的动态路由通过 `generateStaticParams()` 自动处理：

- `/posts/[slug]` - 自动生成所有文章页面
- `/tag/[tag]` - 自动生成所有标签页面  
- `/category/[category]` - 自动生成所有分类页面
- `/archive/[archive]` - 自动生成所有归档页面

### 客户端组件

- `ThemeToggle` - 主题切换（客户端渲染）
- `TOC` - 目录生成（客户端渲染）
- 其他交互组件保持原有功能

## 🛠️ 故障排除

### 常见问题

1. **部署失败**
   - 检查GitHub Actions日志
   - 确认所有依赖已安装
   - 检查TypeScript错误

2. **页面404**
   - 确认GitHub Pages设置正确
   - 检查仓库是否为公开仓库
   - 等待几分钟让GitHub Pages生效

3. **样式丢失**
   - 确认`basePath`配置正确
   - 检查静态资源路径
   - 清除浏览器缓存

4. **链接错误**
   - 确认`basePath`设置
   - 检查相对路径配置

### 调试方法

1. **本地测试**
   ```bash
   npm run build:static
   # 检查 out/ 目录内容
   ```

2. **查看构建日志**
   - GitHub Actions > 选择工作流 > 查看详细日志

3. **检查生成的文件**
   ```bash
   ls -la out/
   # 确认所有页面都已生成
   ```

## 🎯 性能优化

### 已实现的优化

- ✅ 静态导出 - 极快的加载速度
- ✅ 图片优化 - unoptimized配置适配GitHub Pages
- ✅ 路径优化 - trailingSlash确保路由正确
- ✅ 缓存策略 - GitHub Actions缓存依赖

### 进一步优化建议

1. **图片优化**
   - 使用WebP格式
   - 实现懒加载

2. **代码分割**
   - 动态导入大型组件
   - 优化bundle大小

3. **CDN加速**
   - 使用自定义域名
   - 配置CDN服务

## 📊 监控和分析

### 部署监控

- GitHub Actions自动监控部署状态
- 失败时自动发送通知

### 访问分析

可以集成：
- Google Analytics
- Vercel Analytics
- 自定义统计脚本

## 🔄 更新和维护

### 内容更新

1. **添加新文章**
   - 在`posts/`目录添加Markdown文件
   - 推送到GitHub，自动部署

2. **修改配置**
   - 更新`src/lib/config.ts`
   - 推送更改，自动重新部署

### 依赖更新

```bash
npm update
npm audit fix
git add package.json package-lock.json
git commit -m "更新依赖"
git push origin main
```

## 🎉 总结

此方案成功实现了：

- ✅ **零代码修改** - 业务逻辑完全不变
- ✅ **自动部署** - 推送即部署
- ✅ **动态函数保持** - 所有功能正常工作
- ✅ **SEO友好** - 静态导出
- ✅ **性能优秀** - 快速加载
- ✅ **易于维护** - 简单的配置管理

您的博客现在可以通过简单的`git push`命令自动部署到GitHub Pages，无需任何手动操作！
