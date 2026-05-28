<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ placeholder?: string }>()
const emit = defineEmits<{ (e: 'update:query', value: string): void }>()

const input = ref('')
watch(input, (val) => emit('update:query', val))
</script>

<template>
  <div class="mb-6">
    <input
      v-model="input"
      type="text"
      :placeholder="placeholder || '搜索...'"
      class="w-full px-4 py-2 text-sm outline-none transition-colors"
      :style="{
        border: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }"
      @focus="($event.target as HTMLElement).style.borderColor = 'var(--accent)'"
      @blur="($event.target as HTMLElement).style.borderColor = 'var(--border-primary)'"
    />
  </div>
</template>
