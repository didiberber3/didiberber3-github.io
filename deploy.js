#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubPagesDeployer {
  constructor() {
    this.repoName = this.getRepoName();
    this.originalConfig = null;
    this.tempConfigPath = 'next.config.ts.deploy';
  }

  getRepoName() {
    try {
      const remote = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      const match = remote.match(/\/([^\/]+?)(?:\.git)?$/);
      return match ? match[1] : 'my-blog';
    } catch {
      return 'my-blog';
    }
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m',   // red
      reset: '\x1b[0m'     // reset
    };
    
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    
    console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
  }

  backupConfig() {
    this.log('备份原始配置...', 'info');
    if (fs.existsSync('next.config.ts')) {
      fs.copyFileSync('next.config.ts', 'next.config.ts.backup');
      this.originalConfig = fs.readFileSync('next.config.ts', 'utf8');
    }
  }

  createStaticConfig() {
    this.log('创建静态配置...', 'info');
    const config = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/${this.repoName}',
  assetPrefix: '/${this.repoName}',
  distDir: 'out',
}

module.exports = nextConfig`;
    
    fs.writeFileSync('next.config.ts', config);
  }

  addGenerateStaticParams() {
    this.log('添加静态参数生成函数...', 'info');
    
    // 为 archive/[archive]/page.tsx 添加 generateStaticParams
    const archivePagePath = 'src/app/archive/[archive]/page.tsx';
    if (fs.existsSync(archivePagePath)) {
      let content = fs.readFileSync(archivePagePath, 'utf8');
      
      // 移除现有的动态配置
      content = content.replace(/export const dynamic = 'force-dynamic';\n?/g, '');
      content = content.replace(/export const dynamicParams = true;\n?/g, '');
      content = content.replace(/export const dynamicParams = false;\n?/g, '');
      
      if (!content.includes('generateStaticParams')) {
        const generateParams = `

// 为静态导出生成所有可能的 archive 参数
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/posts');
  const posts = await getPosts();
  const archives = [...new Set(posts.map(post => post.archive).filter(Boolean))];
  
  return archives.map(archive => ({
    archive: archive,
  }));
}

export const dynamicParams = false;`;
        
        const newContent = content + generateParams;
        fs.writeFileSync(archivePagePath, newContent);
        this.log('✅ 已为 archive/[archive]/page.tsx 添加 generateStaticParams', 'success');
      } else {
        // 如果已存在 generateStaticParams，确保 dynamicParams 为 false
        if (!content.includes('dynamicParams = false')) {
          // 移除所有现有的 dynamicParams 声明
          content = content.replace(/\nexport const dynamicParams = (true|false);?/g, '');
          const newContent = content + '\nexport const dynamicParams = false;';
          fs.writeFileSync(archivePagePath, newContent);
          this.log('✅ 已更新 archive/[archive]/page.tsx 的 dynamicParams 为 false', 'success');
        }
      }
    }

    // 为 category/[category]/page.tsx 添加 generateStaticParams
    const categoryPagePath = 'src/app/category/[category]/page.tsx';
    if (fs.existsSync(categoryPagePath)) {
      let content = fs.readFileSync(categoryPagePath, 'utf8');
      
      // 移除现有的动态配置
      content = content.replace(/export const dynamic = 'force-dynamic';\n?/g, '');
      content = content.replace(/export const dynamicParams = true;\n?/g, '');
      content = content.replace(/export const dynamicParams = false;\n?/g, '');
      
      if (!content.includes('generateStaticParams')) {
        const generateParams = `

// 为静态导出生成所有可能的 category 参数
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/posts');
  const posts = await getPosts();
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  
  return categories.map(category => ({
    category: category,
  }));
}

export const dynamicParams = false;`;
        
        const newContent = content + generateParams;
        fs.writeFileSync(categoryPagePath, newContent);
        this.log('✅ 已为 category/[category]/page.tsx 添加 generateStaticParams', 'success');
      }
    }

    // 为 tag/[tag]/page.tsx 添加 generateStaticParams
    const tagPagePath = 'src/app/tag/[tag]/page.tsx';
    if (fs.existsSync(tagPagePath)) {
      let content = fs.readFileSync(tagPagePath, 'utf8');
      
      // 移除现有的动态配置
      content = content.replace(/export const dynamic = 'force-dynamic';\n?/g, '');
      content = content.replace(/export const dynamicParams = true;\n?/g, '');
      content = content.replace(/export const dynamicParams = false;\n?/g, '');
      
      if (!content.includes('generateStaticParams')) {
        const generateParams = `

// 为静态导出生成所有可能的 tag 参数
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/posts');
  const posts = await getPosts();
  const allTags = posts.flatMap(post => post.tags || []);
  const uniqueTags = [...new Set(allTags)];
  
  return uniqueTags.map(tag => ({
    tag: tag,
  }));
}

export const dynamicParams = false;`;
        
        const newContent = content + generateParams;
        fs.writeFileSync(tagPagePath, newContent);
        this.log('✅ 已为 tag/[tag]/page.tsx 添加 generateStaticParams', 'success');
      } else {
        // 如果已存在 generateStaticParams，确保 dynamicParams 为 false
        if (!content.includes('dynamicParams = false')) {
          // 移除所有现有的 dynamicParams 声明
          content = content.replace(/\nexport const dynamicParams = (true|false);?/g, '');
          const newContent = content + '\nexport const dynamicParams = false;';
          fs.writeFileSync(tagPagePath, newContent);
          this.log('✅ 已更新 tag/[tag]/page.tsx 的 dynamicParams 为 false', 'success');
        }
      }
    }

    // 为 posts/[slug]/page.tsx 添加 generateStaticParams
    const postPagePath = 'src/app/posts/[slug]/page.tsx';
    if (fs.existsSync(postPagePath)) {
      let content = fs.readFileSync(postPagePath, 'utf8');
      
      // 移除或替换现有的动态配置 - 使用更精确的正则表达式
      content = content.replace(/export const dynamic = 'force-dynamic';\n?/g, '');
      content = content.replace(/export const dynamicParams = true;\n?/g, '');
      content = content.replace(/export const dynamicParams = false;\n?/g, '');
      
      // 移除所有现有的 dynamicParams 声明（包括在 generateStaticParams 中的）
      content = content.replace(/\nexport const dynamicParams = false;?/g, '');
      
      if (!content.includes('generateStaticParams')) {
        const generateParams = `

// 为静态导出生成所有可能的 slug 参数
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/posts');
  const posts = await getPosts();
  
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;`;
        
        const newContent = content + generateParams;
        fs.writeFileSync(postPagePath, newContent);
        this.log('✅ 已为 posts/[slug]/page.tsx 添加 generateStaticParams', 'success');
      } else {
        // 如果已存在 generateStaticParams，确保 dynamicParams 为 false
        if (!content.includes('dynamicParams = false')) {
          // 移除所有现有的 dynamicParams 声明
          content = content.replace(/\nexport const dynamicParams = (true|false);?/g, '');
          const newContent = content + '\nexport const dynamicParams = false;';
          fs.writeFileSync(postPagePath, newContent);
          this.log('✅ 已更新 posts/[slug]/page.tsx 的 dynamicParams 为 false', 'success');
        }
      }
    }
  }

  removeGenerateStaticParams() {
    this.log('移除临时添加的静态参数生成函数...', 'info');
    
    const files = [
      'src/app/archive/[archive]/page.tsx',
      'src/app/category/[category]/page.tsx',
      'src/app/tag/[tag]/page.tsx',
      'src/app/posts/[slug]/page.tsx'
    ];

    files.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 只移除脚本添加的特定注释和函数，保留原有的
        const scriptAddedPattern = /\/\/ 为静态导出生成所有可能的.*?参数[\s\S]*?export async function generateStaticParams\(\)[\s\S]*?^}\s*\n\s*export const dynamicParams = false;/gm;
        
        // 检查是否包含脚本添加的内容
        if (scriptAddedPattern.test(content)) {
          content = content.replace(scriptAddedPattern, '');
          this.log(`✅ 已清理 ${filePath} 中的临时函数`, 'success');
        }
        
        fs.writeFileSync(filePath, content);
      }
    });
  }

  buildAndExport() {
    this.log('构建静态站点...', 'info');
    try {
      // 清理之前的构建
      if (fs.existsSync('out')) {
        fs.rmSync('out', { recursive: true, force: true });
      }
      
      // 构建项目
      execSync('npm run build', { stdio: 'inherit' });
      this.log('构建完成', 'success');
    } catch (error) {
      this.log(`构建失败: ${error.message}`, 'error');
      throw error;
    }
  }

  deployToGitHub() {
    this.log('部署到GitHub Pages...', 'info');
    try {
      // 检查是否有未提交的更改
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      if (status) {
        this.log('检测到未提交的更改，请先提交代码', 'warning');
        throw new Error('有未提交的更改');
      }

      // 创建临时分支
      execSync('git checkout --orphan gh-pages-temp', { stdio: 'inherit' });
      
      // 清理分支
      execSync('git rm -rf .', { stdio: 'inherit' });
      
      // 复制构建文件
      if (fs.existsSync('out')) {
        execSync('cp -r out/* .', { stdio: 'inherit' });
      }
      
      // 创建.nojekyll文件
      fs.writeFileSync('.nojekyll', '');
      
      // 添加必要文件
      const filesToAdd = ['.nojekyll'];
      if (fs.existsSync('CNAME')) {
        filesToAdd.push('CNAME');
      }
      
      // 提交并推送
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
      execSync('git push origin gh-pages-temp:gh-pages --force', { stdio: 'inherit' });
      
      this.log('成功推送到GitHub Pages', 'success');
    } catch (error) {
      this.log(`部署失败: ${error.message}`, 'error');
      throw error;
    }
  }

  cleanup() {
    this.log('清理临时文件...', 'info');
    try {
      // 切换回主分支
      execSync('git checkout main', { stdio: 'inherit' });
      
      // 删除临时分支
      try {
        execSync('git branch -D gh-pages-temp', { stdio: 'inherit' });
      } catch {
        // 分支可能不存在，忽略错误
      }
      
      // 清理构建文件
      if (fs.existsSync('out')) {
        fs.rmSync('out', { recursive: true, force: true });
      }
      
      // 清理临时配置
      if (fs.existsSync(this.tempConfigPath)) {
        fs.unlinkSync(this.tempConfigPath);
      }
    } catch (error) {
      this.log(`清理警告: ${error.message}`, 'warning');
    }
  }

  restoreConfig() {
    this.log('恢复原始配置...', 'info');
    try {
      if (fs.existsSync('next.config.ts.backup')) {
        fs.copyFileSync('next.config.ts.backup', 'next.config.ts');
        fs.unlinkSync('next.config.ts.backup');
      }
    } catch (error) {
      this.log(`恢复配置警告: ${error.message}`, 'warning');
    }
  }

  async deploy() {
    const startTime = Date.now();
    
    try {
      this.log(`开始部署到GitHub Pages (仓库: ${this.repoName})`, 'info');
      
      // 1. 备份配置
      this.backupConfig();
      
      // 2. 创建静态配置
      this.createStaticConfig();
      
      // 3. 添加静态参数生成函数
      this.addGenerateStaticParams();
      
      // 4. 构建和导出
      this.buildAndExport();
      
      // 5. 部署到GitHub
      this.deployToGitHub();
      
      // 6. 清理和恢复
      this.cleanup();
      this.removeGenerateStaticParams();
      this.restoreConfig();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      this.log(`部署完成！耗时: ${duration}秒`, 'success');
      this.log(`访问地址: https://your-username.github.io/${this.repoName}`, 'info');
      
    } catch (error) {
      this.log(`部署失败: ${error.message}`, 'error');
      
      // 尝试恢复
      try {
        this.cleanup();
        this.removeGenerateStaticParams();
        this.restoreConfig();
      } catch (cleanupError) {
        this.log(`清理失败: ${cleanupError.message}`, 'error');
      }
      
      process.exit(1);
    }
  }
}

// 检查是否在正确的目录
if (!fs.existsSync('package.json')) {
  console.error('❌ 请在项目根目录运行此脚本');
  process.exit(1);
}

// 检查是否是git仓库
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  console.error('❌ 当前目录不是git仓库');
  process.exit(1);
}

// 运行部署
const deployer = new GitHubPagesDeployer();
deployer.deploy();
