<script setup lang="ts">
/**
 * 页面统一页头：左侧绿线标题 + 右侧计数 + 底部分割线
 * 首页 / 归档 / 文档 / 关于 / 分类页共用，保证风格一致。
 */
defineProps<{
  title: string
  /** 右侧灰色计数文本，如「27 篇」「3 个分类」，省略则不显示 */
  count?: string
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
      <button v-if="back" class="ph-back" aria-label="返回" @click="emit('back')">←</button>
      <h1 class="ph-title">{{ title }}</h1>
      <span v-if="count" class="ph-count">{{ count }}</span>
    </div>
    <div class="ph-divider"></div>
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 1.5rem;
}

.ph-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.ph-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  border-left: 3px solid var(--accent);
  padding-left: 0.75rem;
}

.ph-count {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.ph-divider {
  height: 1px;
  background: var(--accent);
  opacity: 0.15;
  margin-top: 0.875rem;
}

.ph-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid var(--border-primary);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1;
  background: none;
  transition: all 0.25s;
  align-self: center;
}
.ph-back:hover {
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  transform: scale(1.05);
}
</style>
