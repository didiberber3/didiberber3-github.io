<script setup lang="ts">
/**
 * 文章列表卡片 — 首页 / 文档 / 归档三处共用
 * hover 激活（滑入 + 箭头浮现）与跳转链接。
 * 通过 `select` 事件上报被 hover 的笔记 slug，由父组件维护高亮状态。
 */
import type { NoteMeta } from '../utils/content'

defineProps<{
  note: NoteMeta
  /** 列表内序号，用于 stagger 动画延迟 */
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
    :style="{ '--i': index ?? 0 }"
    @mouseenter="emit('select', note.slug)"
  >
    <router-link
      :to="`/note/${note.slug}`"
      class="article-card interact-slide-bg"
    >
      <div class="article-card-main">
        <h2 class="article-title">{{ note.title }}</h2>
      </div>
      <div class="article-card-meta">
        <span v-if="note.date" class="article-date">{{ note.date }}</span>
      </div>
      <span class="article-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </router-link>
  </div>
</template>
