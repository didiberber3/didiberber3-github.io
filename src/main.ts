/*
 * 在 Vue 挂载前同步读取 localStorage 的深色模式偏好，
 * 并应用到 <html> 的 class 上，防止页面闪烁（Flash of Wrong Theme）。
 * 此 IIFE 必须在所有 import 之前执行，因为 Vue 挂载后 DOM 已渲染。
 *
 * 默认暗色：仅在用户明确选择过亮色（'light'）时才使用亮色，
 * 首次访问与系统偏好不再影响默认主题。
 */
; (function () {
  const stored = localStorage.getItem('theme')
  if (stored !== 'light') {
    document.documentElement.classList.add('dark')
  }
})()

  // SPA redirect for GitHub Pages (from 404.html)
  ; (function () {
    const redirect = sessionStorage.redirect
    delete sessionStorage.redirect
    if (redirect && redirect !== location.href) {
      history.replaceState(null, '', redirect)
    }
  })()

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'
import './style.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

createApp(App).use(router).mount('#app')
