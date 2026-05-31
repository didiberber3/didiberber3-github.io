<template>
  <div class="page-shell">
    <main class="page-content">
      <div class="animate-reveal">
        <div class="not-found">
          <h1 class="nf-code">404</h1>
          <p class="nf-text txt-secondary">页面不存在</p>
          <router-link to="/" class="nf-link">← 返回首页</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  max-width: 480px;
  margin: 0 auto;
  padding: 6rem 1rem;
  text-align: center;
}
.nf-code {
  font-size: 4rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 0.5rem;
  line-height: 1.1;
}
.nf-text {
  font-size: 1rem;
  margin-bottom: 2rem;
}
.nf-link {
  font-size: 0.875rem;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}
.nf-link:hover {
  opacity: 0.7;
}
</style>
