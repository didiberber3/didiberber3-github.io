<script setup lang="ts">
/**
 * 关于页使用的独立页头：标题 + 底部 1px 分隔线。
 * 其他页面已合并进首页筛选，不再使用返回按钮。
 */
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="page-head">
    <h1 class="ph-title">{{ title }}</h1>
  </div>
</template>

<style scoped>
.page-head {
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--border-primary);
}

.ph-title {
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

@media (max-width: 480px) {
  .ph-title {
    font-size: var(--text-lg);
  }
}
</style>
