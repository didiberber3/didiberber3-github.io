# GitHub Pages 静态博客部署修复方案

## 问题分析

当前博客项目存在以下部署问题：
1. **动态导出配置错误**：部分页面使用了 `export const dynamic = 'force-dynamic'`，与静态导出不兼容
2. 动态组件在静态导出时可能失效
3. GitHub Actions 配置需要优化
4. 路径配置可能不正确

## 修复方案

### 1. 修复 next.config.ts 配置

```typescript
import type { NextConfig } from "next";

// Set deploy time environment variable
if (typeof process !== 'undefined') {
  process.env.NEXT_PUBLIC_DEPLOY_TIME = new Date().toISOString();
}

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  // 修复：移除 basePath 或根据实际仓库名称设置
  basePath: process.env.NODE_ENV === "production" ? "/my-blog" : "",
  images: {
    unoptimized: true,
  },
  // 添加 trailingSlash 确保路由正确
  trailingSlash: true,
  // 确保所有页面都静态生成
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
```

### 2. 修复 GitHub Actions 工作流

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
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
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
        # 添加站点URL环境变量
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
        # 确保文件权限正确
        enable_jekyll: false
        # 如果有自定义域名，取消注释下面这行
        # cname: yourdomain.com
```

### 3. 修复动态组件问题

#### ThemeToggle 组件优化
```typescript
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  
  // 在静态导出期间返回null，避免服务端渲染问题
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full w-9 h-9 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}
```

#### TOC 组件优化
```typescript
'use client'

import { useEffect, useState } from 'react'

type TOCItem = {
  id: string;
  title: string;
  level: number;
};

export default function TOC() {
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === 'undefined') return;
    
    const updateTOC = () => {
      const article = document.querySelector('article');
      if (article) {
        const headings = Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const tocItems = headings.map(h => ({
          id: h.id,
          title: h.textContent || '',
          level: parseInt(h.tagName.charAt(1))
        }));
        setToc(tocItems);
      }
    };

    // 延迟执行确保DOM完全加载
    const timeoutId = setTimeout(updateTOC, 500);

    // 监听DOM变化
    const observer = new MutationObserver(updateTOC);
    const article = document.querySelector('article');
    if (article) {
      observer.observe(article, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  if (!toc.length) return null;

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0 ml-auto">
      <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pl-2 text-xs">
        <h3 className="text-xs font-semibold mb-2 opacity-70">目录</h3>
        <ul className="space-y-1 text-xs">
          {toc.map(item => (
            <li 
              key={item.id} 
              style={{ marginLeft: `${(item.level - 1) * 1}rem` }}
            >
              <a 
                href={`#${item.id}`} 
                className={`block py-0.5 hover:text-blue-600 dark:hover:text-blue-400 leading-tight text-xs transition-colors
                  ${item.level === 1 ? 'font-bold opacity-100 text-sm' : ''}
                  ${item.level === 2 ? 'font-semibold opacity-90' : ''}
                  ${item.level === 3 ? 'font-medium opacity-80' : ''}
                  ${item.level === 4 ? 'font-normal opacity-70' : ''}
                  ${item.level >= 5 ? 'font-normal opacity-60 text-[11px]' : ''}
                `}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
```

### 4. 确保 generateStaticParams 函数

检查所有动态路由页面是否有 `generateStaticParams` 函数：

```typescript
// src/app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// src/app/tag/[tag]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  const tags = [...new Set(posts.flatMap(post => post.tags || []))];
  return tags.map((tag) => ({
    tag: tag,
  }));
}

// src/app/category/[category]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  const categories = [...new Set(posts.flatMap(post => post.category ? [post.category] : []))];
  return categories.map((category) => ({
    category: category,
  }));
}
```

### 5. 修复 package.json 脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:static": "cross-env NEXT_EXPORT=true next build && next-sitemap",
    "deploy": "npm run build:static && gh-pages -d out",
    "start": "next start",
    "lint": "eslint",
    "verify": "node scripts/verify.js"
  }
}
```

### 6. 添加 .nojekyll 文件

在 `out` 目录中添加 `.nojekyll` 文件，防止 GitHub Pages 使用 Jekyll 处理。

### 7. GitHub Pages 设置

1. 进入仓库 Settings > Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages" 和 "/ (root)"
4. 确保仓库是公开的（私有仓库需要 GitHub Pro）

### 8. 部署步骤

```bash
# 1. 提交所有更改
git add .
git commit -m "修复 GitHub Pages 部署问题"
git push origin main

# 2. 等待 GitHub Actions 完成
# 3. 访问 https://[username].github.io/[repository-name]
```

### 9. 关键修复：动态导出配置

**已修复的文件：**
- `src/app/page.tsx`：将 `export const dynamic = 'force-dynamic'` 改为 `export const dynamic = 'force-static'`
- `src/app/category/page.tsx`：将 `export const dynamic = 'force-dynamic'` 改为 `export const dynamic = 'force-static'`

**其他页面已正确配置：**
- `src/app/posts/[slug]/page.tsx`：已使用 `force-static`
- `src/app/tag/[tag]/page.tsx`：已使用 `force-static`
- `src/app/archive/page.tsx`：已使用 `force-static`
- `src/app/category/[category]/page.tsx`：已使用 `force-static`

### 10. 修复HTML嵌套链接错误

**问题：** 在 `src/app/page.tsx` 中存在嵌套的 `<a>` 标签，违反HTML规范并导致hydration错误。

**修复方案：** 将外层Link组件移除，只保留标题链接，其他链接（分类、标签）独立存在。

**修复前：**
```jsx
<Link href={`/posts/${encodeURIComponent(p.slug)}`} className="block hover:opacity-70 transition-opacity">
  <div className="flex justify-between items-center p-4 border-b border-[var(--line-light)] dark:border-[var(--line-dark)]">
    <div className="flex-1">
      <span className="text-lg font-semibold">{p.title}</span>
      {(p.archive || p.category || p.tags) && (
        <div className="flex gap-2 mt-1 flex-wrap">
          {p.category && (
            <Link href={`/category/${encodeURIComponent(p.category)}`}>
              {p.category}
            </Link>
          )}
          {/* 其他嵌套链接 */}
        </div>
      )}
    </div>
  </div>
</Link>
```

**修复后：**
```jsx
<div className="flex justify-between items-center p-4 border-b border-[var(--line-light)] dark:border-[var(--line-dark)]">
  <div className="flex-1">
    <Link href={`/posts/${encodeURIComponent(p.slug)}`} className="text-lg font-semibold hover:opacity-70 transition-opacity block">
      {p.title}
    </Link>
    {(p.archive || p.category || p.tags) && (
      <div className="flex gap-2 mt-1 flex-wrap">
        {p.category && (
          <Link href={`/category/${encodeURIComponent(p.category)}`}>
            {p.category}
          </Link>
        )}
        {/* 其他独立链接 */}
      </div>
    )}
  </div>
</div>
```

### 11. 修复generateStaticParams参数问题

**问题：** 新增文章后出现 "Page "/posts/[slug]/page" is missing param "/posts/[slug]" in "generateStaticParams()"" 错误。

**修复方案：** 
1. 在 `src/lib/posts.ts` 中移除 `decodeURIComponent` 调用，保持原始路径
2. 在 `src/app/posts/[slug]/page.tsx` 中简化 `generateStaticParams` 函数

**修复内容：**
```typescript
// src/lib/posts.ts - 移除decodeURIComponent
return {
    slug: slug, // 保持原始路径，不进行decodeURIComponent
    // ... 其他字段
};

// src/app/posts/[slug]/page.tsx - 简化generateStaticParams
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    // 确保所有slug都是字符串，不进行额外编码
    return posts.map(p => ({ 
      slug: p.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
```

### 12. 常见问题解决

- **Runtime Error: force-dynamic**：确保所有页面都使用 `force-static` 而不是 `force-dynamic`
- **generateStaticParams错误**：确保slug路径编码一致性，避免重复编码/解码
- **HTML嵌套链接错误**：避免在 `<a>` 标签内嵌套其他 `<a>` 标签
- **Hydration错误**：确保客户端组件正确处理服务端渲染差异
- **404 错误**：检查 `basePath` 配置和 GitHub Pages 设置
- **样式丢失**：确保静态资源路径正确，检查 `basePath` 配置
- **动态组件不工作**：确保所有客户端组件都有 `'use client'` 指令
- **构建失败**：检查 TypeScript 错误和依赖问题

这个修复方案解决了静态导出时的所有主要问题，包括 `force-dynamic` 导出错误、HTML嵌套链接错误和 `generateStaticParams` 参数问题，确保博客能够成功部署到 GitHub Pages。
