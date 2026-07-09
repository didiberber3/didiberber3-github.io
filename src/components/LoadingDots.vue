<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <span class="loading-wrap">
    <svg class="loading-spinner" viewBox="0 0 24 24" role="status" aria-label="Loading">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"
              stroke-dasharray="31.4 31.4" stroke-linecap="round" />
    </svg>
    <span v-if="text" class="loading-text">{{ text }}</span>
  </span>
</template>

<style scoped>
.loading-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  color: var(--accent);
  animation: spin 0.8s linear infinite;
}

.loading-spinner circle {
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes dash {
  0%   { stroke-dashoffset: 62.8; }
  50%  { stroke-dashoffset: 15.7; transform: rotate(90deg); }
  100% { stroke-dashoffset: 62.8; transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.8125rem;
  color: var(--text-muted);
}
</style>
