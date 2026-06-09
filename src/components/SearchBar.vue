<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ placeholder?: string }>()
const emit = defineEmits<{ (e: 'update:query', value: string): void }>()

const input = ref('')
let debounceTimer: ReturnType<typeof setTimeout>
watch(input, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('update:query', val), 200)
})
</script>

<template>
  <div class="mb-6">
    <input
      v-model="input"
      type="text"
      :placeholder="placeholder || '搜索...'"
      class="search-input w-full px-4 py-2 text-sm"
    />
  </div>
</template>

<style scoped>
.search-input {
  border: 1px solid var(--border-primary);
  background-color: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--text-primary);
  outline: none;
  box-shadow: var(--shadow-glass);
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}
.search-input:focus {
  border-color: var(--accent);
}
</style>
