/**
 * 全局加载状态（模块级单例）
 *
 * 路由懒加载 chunk 与文章内容渲染共用一套加载动画。
 * isLoading = 路由加载 或 页面内容加载任一进行中。
 */
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
