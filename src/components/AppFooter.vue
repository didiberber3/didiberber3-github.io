<script setup lang="ts">
const year = new Date().getFullYear()
const rssHref = `${import.meta.env.BASE_URL}rss.xml`
</script>

<template>
  <footer class="app-footer">
    <div class="page-shell footer-inner">
      <span class="meta">© {{ year }} 小窝</span>
      <a class="meta footer-link" :href="rssHref">RSS</a>
      <RouterLink class="meta footer-link" to="/about">关于</RouterLink>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-primary);
}

.footer-inner {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-block: var(--space-4);
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.footer-link:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 480px) {
  .footer-inner {
    gap: var(--space-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-link {
    transition: none;
  }
}
</style>
