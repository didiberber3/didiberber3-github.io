<script setup lang="ts">
/**
 * 页面统一页头：可选「← 返回」文字按钮 + 标题 + 底部 1px 分隔线。
 * 首页 / 归档 / 文档 / 关于 / 分类页共用。
 */
defineProps<{
  title: string
  /** 是否显示返回按钮（分类页用） */
  back?: boolean
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="page-head">
    <div class="ph-row">
      <button v-if="back" type="button" class="ph-back" @click="emit('back')">
        <span class="ph-back-arrow" aria-hidden="true">←</span>
        <span>返回</span>
      </button>
      <h1 class="ph-title">{{ title }}</h1>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--border-primary);
}

.ph-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.ph-title {
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.ph-back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
  padding: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-out);
}
.ph-back:hover {
  color: var(--accent);
}
.ph-back-arrow {
  line-height: 1;
}

@media (max-width: 480px) {
  .ph-title {
    font-size: var(--text-lg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ph-back {
    transition: none;
  }
}
</style>
