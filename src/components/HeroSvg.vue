<template>
  <svg class="hero-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="40" cy="40" r="28" stroke="currentColor" stroke-width="1.5" class="draw-in" />
    <line x1="25" y1="55" x2="55" y2="25" stroke="currentColor" stroke-width="1.5" class="draw-in delay-1" />
    <circle cx="40" cy="40" r="3.5" fill="currentColor" class="fade-in delay-2" />
  </svg>
</template>

<style scoped>
.hero-svg {
  width: 64px;
  height: 64px;
  color: var(--accent);
  opacity: 0.7;
  animation: gentleFloat 6s ease-in-out infinite;
}

.draw-in {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawIn 1.2s ease-out forwards;
}

.delay-1 {
  animation-delay: 0.3s;
}

.fade-in {
  opacity: 0;
  animation: fadeSvgIn 0.6s ease-out forwards;
}

.delay-2 {
  animation-delay: 1s;
}

@keyframes drawIn {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeSvgIn {
  to { opacity: 1; }
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
