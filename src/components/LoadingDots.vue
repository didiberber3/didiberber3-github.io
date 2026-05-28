<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <span class="loading-wrap">
    <span class="loading-bar" role="status" aria-label="Loading">
      <span class="loading-track">
        <span class="loading-fill"></span>
      </span>
    </span>
    <span v-if="text" class="loading-text">{{ text }}</span>
  </span>
</template>

<style scoped>
.loading-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.loading-bar {
  display: inline-block;
  width: 80px;
}

.loading-track {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--border-primary);
  position: relative;
  overflow: hidden;
}

.loading-fill {
  display: block;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  position: absolute;
  top: 0;
  left: 0;
  animation: streamFlow 1.4s ease-in-out infinite;
}

@keyframes streamFlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}

.loading-text {
  font-size: 0.8125rem;
  color: var(--text-muted);
}
</style>
