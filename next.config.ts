import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  distDir: 'out',
  
  // 用户仓库不需要 basePath，直接使用根域名
  basePath: "",
  
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
