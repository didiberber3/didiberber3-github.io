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
    <div class="search-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input
        v-model="input"
        type="text"
        :placeholder="placeholder || '搜索...'"
        class="search-input"
      />
    </div>
  </div>
</template>

<style scoped>
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.25s;
}
.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-primary);
  border-radius: 2px;
  background-color: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--text-primary);
  outline: none;
  box-shadow: var(--shadow-glass);
  transition: border-color 0.25s, box-shadow 0.25s, background-color 0.25s;
}
.search-input::placeholder {
  color: var(--text-muted);
}
.search-input:focus {
  border-color: var(--accent);
  box-shadow: var(--shadow-glass-lg), 0 0 0 1px var(--accent);
}
.search-wrap:focus-within .search-icon {
  color: var(--accent);
}
</style>
