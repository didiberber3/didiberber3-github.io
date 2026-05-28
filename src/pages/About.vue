<template>
  <div class="animate-fade-up">
    <TabNav />

    <div class="about-page">
      <h1 class="about-title txt-primary">关于</h1>

      <div class="about-body prose prose-sm max-w-none">
        <p>这是一个基于 <strong>Vue 3 + Vite + TypeScript</strong> 构建的个人博客站点。</p>
        <p>用于记录学习笔记、分享技术文章和项目经验。</p>

        <h2>技术栈</h2>
        <ul>
          <li>前端框架：Vue 3 (Composition API + script setup)</li>
          <li>构建工具：Vite 5</li>
          <li>样式方案：Tailwind CSS + CSS 变量</li>
          <li>内容管理：本地 Markdown 文件</li>
          <li>代码高亮：highlight.js</li>
        </ul>

        <h2>功能特性</h2>
        <ul>
          <li>亮色/暗色模式切换</li>
          <li>响应式布局</li>
          <li>全文搜索</li>
          <li>Markdown 渲染</li>
          <li>代码语法高亮</li>
          <li>目录导航</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TabNav from '../components/TabNav.vue'
</script>

<style scoped>
.about-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem 1rem 4rem;
}
.about-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.about-body h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}
.about-body ul {
  padding-left: 1.25rem;
}
.about-body li {
  margin-bottom: 0.375rem;
  color: var(--text-secondary);
}
</style>
