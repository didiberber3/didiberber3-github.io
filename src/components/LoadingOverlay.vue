<script setup lang="ts">
import { useGlobalLoading } from '../utils/useGlobalLoading'

const { isLoading } = useGlobalLoading()
</script>

<template>
  <Transition name="overlay-fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner" aria-label="加载中">
        <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
          <!-- outer ring -->
          <circle cx="32" cy="32" r="28" stroke="var(--border-secondary)" stroke-width="3" />
          <circle
            cx="32" cy="32" r="28"
            stroke="var(--accent)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="44 132"
            class="spin-outer"
          />
          <!-- inner dot -->
          <circle cx="32" cy="4" r="4" fill="var(--accent)" class="spin-dot" />
        </svg>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
}

/* outer arc: sweeps around */
.spin-outer {
  transform-origin: 32px 32px;
  animation: spinOuter 1.2s ease-in-out infinite;
}

/* inner dot: orbits */
.spin-dot {
  animation: spinDot 1.2s ease-in-out infinite;
}

@keyframes spinOuter {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spinDot {
  0%   { transform: rotate(0deg) translateY(0); }
  50%  { transform: rotate(180deg) translateY(-2px); }
  100% { transform: rotate(360deg) translateY(0); }
}

/* fade transition */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
