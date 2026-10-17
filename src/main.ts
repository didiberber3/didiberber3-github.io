import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'
import './style.css'

// SPA redirect for GitHub Pages (from 404.html)
;(function () {
  const redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  if (redirect && redirect !== location.href) {
    history.replaceState(null, '', redirect)
  }
})()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切换页面时回到顶部；浏览器后退时恢复原位置；带 hash 时滚动到锚点
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 72 }
    // 首页筛选只改 query，不滚动页面
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

createApp(App).use(router).mount('#app')
