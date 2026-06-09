<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGlobalLoading } from '../utils/useGlobalLoading'

const { isLoading } = useGlobalLoading()
const visible = ref(false)
const MIN_DISPLAY = 200
let showTime = 0
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(isLoading, (loading) => {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  if (loading) {
    showTime = Date.now()
    visible.value = true
  } else {
    const elapsed = Date.now() - showTime
    hideTimer = setTimeout(() => { visible.value = false }, Math.max(0, MIN_DISPLAY - elapsed))
  }
})
</script>

<template>
  <Transition name="overlay-fade">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-spinner" aria-label="加载中">
        <svg viewBox="0 0 160 160" width="120" height="120" fill="none">

          <!-- outer track ring -->
          <circle cx="80" cy="80" r="72" stroke="var(--border-primary)" stroke-width="1" opacity="0.15" stroke-dasharray="4 6" />
          <circle cx="80" cy="80" r="72" stroke="var(--accent)" stroke-width="1" opacity="0.08" />

          <!-- dashed azimuth ring -->
          <circle cx="80" cy="80" r="60" stroke="var(--border-primary)" stroke-width="1" opacity="0.06" stroke-dasharray="2 8" />

          <!-- star: two overlapping triangles (hexagram) → orbit a -->
          <path d="M80 30 L114 105 L46 105 Z" stroke="var(--accent)" stroke-width="1.2" stroke-linejoin="round" opacity="0.2" class="star-a" />
          <path d="M80 130 L46 55 L114 55 Z" stroke="var(--accent)" stroke-width="1.2" stroke-linejoin="round" opacity="0.2" class="star-b" />

          <!-- cross hairs -->
          <line x1="20" y1="80" x2="140" y2="80" stroke="var(--accent)" stroke-width="0.5" opacity="0.06" />
          <line x1="80" y1="20" x2="80" y2="140" stroke="var(--accent)" stroke-width="0.5" opacity="0.06" />

          <!-- satellite dots on outer orbit -->
          <circle cx="80" cy="8" r="3" fill="var(--accent)" class="sat s1" />
          <circle cx="80" cy="8" r="2.5" fill="var(--accent)" class="sat s2" />
          <circle cx="80" cy="8" r="2" fill="var(--accent)" class="sat s3" />
          <circle cx="80" cy="8" r="1.5" fill="var(--accent)" class="sat s4" />

          <!-- inner sweep arc -->
          <path d="M80 8 A72 72 0 0 1 152 80" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" class="sweep" />

          <!-- center diamond stack -->
          <rect x="76" y="76" width="8" height="8" fill="var(--accent)" class="diamond-a" />
          <rect x="78" y="78" width="4" height="4" fill="var(--accent)" class="diamond-b" />
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
  width: 120px;
  height: 120px;
}

/* ── all rotating elements share origin ── */
.sweep,
.star-a, .star-b,
.sat, .diamond-a, .diamond-b {
  transform-box: view-box;
  transform-origin: 80px 80px;
}

/* ── outer sweep arm ── */
.sweep {
  animation: spinCW 3s linear infinite;
}

/* ── stars counter-rotate ── */
.star-a {
  animation: spinCW 20s linear infinite;
}
.star-b {
  animation: spinCCW 16s linear infinite;
}

/* ── satellites each at own rhythm ── */
.s1 { animation: spinCW 5s linear infinite; }
.s2 { animation: spinCCW 7s linear infinite; }
.s3 { animation: spinCW 11s linear infinite; }
.s4 { animation: spinCCW 13s linear infinite; }

/* ── center diamonds ── */
.diamond-a {
  animation: spinCW 4s ease-in-out infinite;
}
.diamond-b {
  animation: spinCCW 3s ease-in-out infinite;
}

@keyframes spinCW {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes spinCCW {
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

/* ── fade transition ── */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
