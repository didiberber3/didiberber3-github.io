<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <span>&copy; {{ year }} 记录与分享</span>
      <span class="footer-sep">·</span>
      <a href="/about" class="footer-link">关于</a>
      <span class="footer-sep">·</span>
      <span>Vue + Vite</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  border-top: 1px solid var(--border-primary);
  padding: 1.25rem 1rem;
}
.footer-inner {
  max-width: 1152px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.footer-sep {
  color: var(--border-secondary);
}
.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: var(--accent);
}
</style>
