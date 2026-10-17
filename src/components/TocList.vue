<script setup lang="ts">
/**
 * 目录条目列表（桌面右栏与移动端底部抽屉共用）。
 * 仅负责渲染与高亮，点击通过 select 事件上报。
 */
import type { TocItem } from '../utils/markdown'

defineProps<{
  items: TocItem[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <a
    v-for="item in items"
    :key="item.id"
    :href="'#' + item.id"
    :data-id="item.id"
    :class="['toc-link', 'depth-' + Math.min(item.level, 3), { active: activeId === item.id }]"
    @click.prevent="emit('select', item.id)"
    >{{ item.text }}</a
  >
</template>

<style scoped>
.toc-link {
  display: -webkit-box;
  padding: 3px 0 3px var(--space-3);
  border-left: 2px solid transparent;
  color: var(--text-muted);
  font-size: 0.8125rem;
  line-height: 1.45;
  text-decoration: none;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition:
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.toc-link:hover {
  color: var(--text-primary);
  border-left-color: var(--border-secondary);
}

.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

/* 层级：h1 次级，h2 更淡，h3 更小更淡 */
.depth-1 {
  padding-left: var(--space-3);
  color: var(--text-secondary);
  font-weight: 500;
}
.depth-2 {
  padding-left: calc(var(--space-3) + var(--space-2));
}
.depth-3 {
  padding-left: calc(var(--space-3) + var(--space-5));
  font-size: 0.75rem;
}

.depth-1.active,
.depth-2.active,
.depth-3.active {
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .toc-link {
    transition: none;
  }
}
</style>
