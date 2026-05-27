<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:query', value: string): void
}>()

const input = ref('')

watch(input, (val) => {
  emit('update:query', val)
})
</script>

<template>
  <div class="mb-6">
    <input
      v-model="input"
      type="text"
      :placeholder="placeholder || '搜索...'"
      class="w-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-green-600 transition-colors"
    />
  </div>
</template>
