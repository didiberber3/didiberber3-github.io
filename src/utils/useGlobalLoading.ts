import { ref, computed } from 'vue'

const routerLoading = ref(false)
const pageLoading = ref(false)

export function useGlobalLoading() {
  const isLoading = computed(() => routerLoading.value || pageLoading.value)

  function startRouter() { routerLoading.value = true }
  function stopRouter() { routerLoading.value = false }
  function startPage()  { pageLoading.value = true }
  function stopPage()   { pageLoading.value = false }

  return { isLoading, startRouter, stopRouter, startPage, stopPage }
}
