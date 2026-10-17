<script setup lang="ts">
/**
 * 笔记索引行，首页 / 分类页 / 归档页共用。
 * 行式排版：分类（mono）/ 标题（flex:1）/ 日期（mono）/ 箭头。
 * 通过 `select` 事件上报被 hover 的笔记 slug，由父组件维护高亮状态。
 */
import type { NoteMeta } from '../utils/content'

defineProps<{
  note: NoteMeta
  /** 列表内序号，保留以兼容旧调用（不再用于 stagger 动画） */
  index?: number
  active?: boolean
}>()

const emit = defineEmits<{
  select: [slug: string]
}>()
</script>

<template>
  <div
    class="article-card-wrapper"
    :class="{ 'is-active': active }"
    @mouseenter="emit('select', note.slug)"
  >
    <router-link :to="`/note/${note.slug}`" class="article-card">
      <span v-if="note.category" class="article-cat">{{ note.category }}</span>
      <span class="article-title">{{ note.title }}</span>
      <span v-if="note.date" class="article-date">{{ note.date }}</span>
      <span class="article-arrow" aria-hidden="true">→</span>
    </router-link>
  </div>
</template>
