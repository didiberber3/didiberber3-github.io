<script setup lang="ts">
/**
 * 笔记索引行。
 * 行式排版：分类（mono，hover / 键盘焦点时显示）/ 标题 + 一句话简介 / 日期（hover 时显示）。
 * 简介在 hover 时出现在标题后面（同一行）；通过 `select` 事件上报被 hover 的笔记 slug。
 */
import type { NoteMeta } from '../utils/content'

defineProps<{
  note: NoteMeta
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
      <span class="article-main">
        <span class="article-title">{{ note.title }}</span>
        <span v-if="note.description" class="article-desc">{{ note.description }}</span>
      </span>
      <span v-if="note.date" class="article-date">{{ note.date }}</span>
    </router-link>
  </div>
</template>
