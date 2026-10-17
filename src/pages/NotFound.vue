<template>
  <div class="page-shell">
    <div class="page-content">
      <div class="animate-reveal">
        <div class="not-found">
          <h1 class="nf-code mono">404</h1>
          <p class="nf-text text-secondary">页面不存在</p>
          <router-link to="/" class="nf-link">返回首页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageTitle } from '../utils/usePageTitle'

usePageTitle('页面不存在')
</script>

<style scoped>
.not-found {
  width: 100%;
  max-width: var(--reading);
  margin-inline: auto;
  padding-block: var(--space-8);
  text-align: left;
}

.nf-code {
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.nf-text {
  margin-top: var(--space-3);
  font-size: var(--text-md);
}

.nf-link {
  display: inline-block;
  margin-top: var(--space-5);
  font-size: var(--text-sm);
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
.nf-link:hover {
  text-decoration-thickness: 2px;
}

@media (max-width: 768px) {
  .not-found {
    padding-block: var(--space-7);
  }
}

@media (max-width: 480px) {
  .nf-text {
    font-size: var(--text-base);
  }
}
</style>
