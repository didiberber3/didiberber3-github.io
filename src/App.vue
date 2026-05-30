<template>
  <div class="app-shell">
    <main class="app-main">
      <router-view />
    </main>
    <AppFooter />
    <LoadingOverlay />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import { useGlobalLoading } from './utils/useGlobalLoading'

const router = useRouter()
const { startRouter, stopRouter } = useGlobalLoading()

router.beforeEach((_to, _from) => {
  startRouter()
})
router.afterEach(() => {
  stopRouter()
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
