/*
 * 在 Vue 挂载前同步读取 localStorage 的深色模式偏好，
 * 并应用到 <html> 的 class 上，防止页面闪烁（Flash of Wrong Theme）。
 * 此 IIFE 必须在所有 import 之前执行，因为 Vue 挂载后 DOM 已渲染。
 */
;(function () {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
})()

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'
import './style.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
