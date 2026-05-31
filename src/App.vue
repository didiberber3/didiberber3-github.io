<template>
  <div class="app-shell">
    <ScrollProgress />
    <TabNav />
    <main class="app-main">
      <router-view />
    </main>
    <AppSidebar @select-note="(slug) => { closeSidebar(); router.push('/note/' + slug) }" />
    <AppFooter />
    <LoadingOverlay />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ScrollProgress from './components/ScrollProgress.vue'
import TabNav from './components/TabNav.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import { useGlobalLoading } from './utils/useGlobalLoading'
import { closeSidebar } from './utils/useSidebar'

const router = useRouter()
const { startRouter, stopRouter } = useGlobalLoading()

router.beforeEach((_to, _from) => {
  startRouter()
})
router.afterEach(() => {
  stopRouter()
  closeSidebar()
})
router.onError(() => {
  stopRouter()
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-main {
  flex: 1;
}
</style>
