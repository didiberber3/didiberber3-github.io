<template>
  <div class="app-shell">
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="footer-inner">
        <span>&copy; 2026 记录与分享</span>
        <span class="footer-sep">·</span>
        <span>Vue + Vite</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}

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
</style>
