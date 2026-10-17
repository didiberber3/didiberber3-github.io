import { onBeforeUnmount, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

const SITE_NAME = '小窝'

/**
 * 把页面标题写进浏览器标签页。
 * 支持传字符串或 getter（路由参数 / 异步文章标题变化时自动更新）。
 * 统一格式：`小窝 · 页面标题`。
 */
export function usePageTitle(title: MaybeRefOrGetter<string | undefined>) {
  const stop = watchEffect(() => {
    const value = (toValue(title) ?? '').trim()
    document.title = value ? `${SITE_NAME} · ${value}` : SITE_NAME
  })

  onBeforeUnmount(stop)
}
