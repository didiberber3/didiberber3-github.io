<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">跳到主要内容</a>
    <ScrollProgress />
    <TabNav />
    <main id="main" class="app-main" tabindex="-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import ScrollProgress from './components/ScrollProgress.vue'
import TabNav from './components/TabNav.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.app-main {
  flex: 1;
}
</style>
